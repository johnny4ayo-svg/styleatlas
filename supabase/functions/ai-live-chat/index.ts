// AI live chat, brokered entirely server-side. The OpenAI key never
// reaches the browser — the client only ever calls this function.
//
// Grounding: before calling the model, we do a lightweight keyword match
// against real categories/cities and pull up to 3 matching, active,
// verified-first professional_accounts rows. Those are injected into the
// system prompt as the ONLY professionals the model is allowed to
// mention by name, so it can't hallucinate listings that don't exist.
import { handleCors, jsonResponse } from "../_shared/cors.ts";
import { createAdminClient, getCallingUser } from "../_shared/supabase-admin.ts";

interface ChatRequestBody {
  message: string;
  sessionId?: string | null;
  visitorId?: string | null;
  professionalAccountId?: string | null;
  sourcePage: string;
}

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const body: ChatRequestBody = await req.json();
    if (!body?.message || typeof body.message !== "string") return jsonResponse({ error: "invalid_request" }, 400);
    if (body.message.length > 2000) return jsonResponse({ error: "message_too_long" }, 400);

    const admin = createAdminClient();
    const user = await getCallingUser(req);

    let profileId: string | null = null;
    if (user) {
      const { data: profile } = await admin.from("profiles").select("id").eq("auth_user_id", user.id).maybeSingle();
      profileId = profile?.id ?? null;
    }

    // Rate limit per visitor/user to prevent abuse and cost blowouts.
    const rateLimitKey = profileId ?? body.visitorId ?? "anonymous";
    const { data: allowed } = await admin.rpc("check_rate_limit", {
      p_bucket_key: rateLimitKey,
      p_action: "ai_chat_message",
      p_max_count: 30,
      p_window_seconds: 3600,
    });
    if (!allowed) return jsonResponse({ error: "rate_limited" }, 429);

    // Find or create the session.
    let sessionId = body.sessionId;
    if (!sessionId) {
      const { data: session, error: sessionError } = await admin
        .from("ai_chat_sessions")
        .insert({
          user_id: profileId,
          visitor_id: body.visitorId ?? null,
          professional_account_id: body.professionalAccountId ?? null,
          source_page: body.sourcePage,
        })
        .select("id")
        .single();
      if (sessionError || !session) return jsonResponse({ error: "session_create_failed" }, 500);
      sessionId = session.id;
    }

    await admin.from("ai_chat_messages").insert({ session_id: sessionId, role: "user", content: body.message });

    // ── Grounding: look for a category + city mentioned in the message ──
    const { data: categories } = await admin.from("categories").select("id, name, slug").eq("status", "active");
    const lowerMessage = body.message.toLowerCase();
    const matchedCategory = (categories ?? []).find((c) => lowerMessage.includes(c.name.toLowerCase().replace(/s$/, "")));

    const NIGERIAN_CITIES = ["lagos", "abuja", "port harcourt", "calabar", "enugu", "ibadan", "benin city", "warri", "uyo", "kano", "kaduna", "owerri", "asaba"];
    const matchedCity = NIGERIAN_CITIES.find((city) => lowerMessage.includes(city));

    let groundingContext = "No specific professionals matched yet — ask the visitor for their city and category preference.";
    if (matchedCategory) {
      let query = admin
        .from("professional_accounts")
        .select("business_name, slug, city, verification_status, rating_average")
        .eq("category_id", matchedCategory.id)
        .eq("status", "active")
        .order("verification_status", { ascending: false })
        .order("rating_average", { ascending: false })
        .limit(3);
      if (matchedCity) query = query.ilike("city", matchedCity);

      const { data: matches } = await query;
      if (matches && matches.length > 0) {
        groundingContext = `Real professionals matching this query (ONLY mention these by name, never invent others):\n${matches
          .map((m) => `- ${m.business_name} (${m.city}, rating ${m.rating_average ?? "N/A"}) — /designers/${m.slug}`)
          .join("\n")}`;
      } else {
        groundingContext = `No active professionals currently match "${matchedCategory.name}"${matchedCity ? ` in ${matchedCity}` : ""}. Suggest the visitor submit a fashion request at /marketplace instead of naming any business.`;
      }
    }

    const { data: knowledgeBase } = await admin.from("ai_knowledge_base").select("title, content").eq("status", "active").limit(10);
    const { data: settings } = await admin.from("ai_chat_settings").select("system_instructions").order("updated_at", { ascending: false }).limit(1).maybeSingle();

    const { data: history } = await admin
      .from("ai_chat_messages")
      .select("role, content")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true })
      .limit(20);

    const systemPrompt = `You are the STYLEATLAS style concierge, helping visitors discover Nigerian fashion designers, brands, stylists, and schools.

${settings?.system_instructions || "Be warm, concise, and helpful. Ask about location, budget, style, and event date when relevant."}

Rules:
- NEVER invent a designer, brand, or listing that wasn't given to you in the "Grounding" section below.
- If no real match exists, suggest the visitor submit a fashion request at /marketplace or browse /directory.
- Ask for consent before requesting phone/email.
- Keep responses under 120 words.
- If asked about pricing plans, direct them to /pricing.

Knowledge base:
${(knowledgeBase ?? []).map((k) => `- ${k.title}: ${k.content}`).join("\n") || "(none configured)"}

Grounding:
${groundingContext}`;

    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    let reply: string;

    if (!openaiKey) {
      reply = "Our AI concierge isn't configured yet — please browse /directory or contact support.";
    } else {
      const messages = [
        { role: "system", content: systemPrompt },
        ...(history ?? []).map((m) => ({ role: m.role, content: m.content })),
      ];

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${openaiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4o-mini", messages, max_tokens: 300, temperature: 0.6 }),
      });

      if (!response.ok) {
        console.error("OpenAI request failed", await response.text());
        reply = "Sorry, I'm having trouble responding right now. Please try again shortly.";
      } else {
        const data = await response.json();
        reply = data.choices?.[0]?.message?.content?.trim() ?? "Sorry, I couldn't generate a response.";
      }
    }

    await admin.from("ai_chat_messages").insert({ session_id: sessionId, role: "assistant", content: reply });

    // Lightweight lead capture: if the visitor volunteered an email in
    // their message (implying consent to be contacted), log it as an
    // ai_chat-sourced lead for the matched professional, if any.
    const emailMatch = body.message.match(EMAIL_REGEX);
    if (emailMatch) {
      await admin.from("leads").insert({
        source_type: "ai_chat",
        source_page: body.sourcePage,
        customer_id: profileId,
        name: "AI Chat Visitor",
        email: emailMatch[0],
        city: matchedCity ?? null,
        category_id: matchedCategory?.id ?? null,
        message: body.message,
        status: "new",
      });
    }

    return jsonResponse({ sessionId, reply });
  } catch (error) {
    console.error("ai-live-chat error", error);
    return jsonResponse({ error: "internal_error" }, 500);
  }
});
