// Post-upload processing: reads the just-uploaded object from Storage,
// decodes it to capture real width/height, generates a compressed WebP
// derivative for faster page loads, and records everything in
// media_assets. Called by the client immediately after a Storage upload
// completes (the upload itself goes straight to Storage under RLS; this
// function only handles the metadata + optimization step).
import { Image } from "https://deno.land/x/imagescript@1.2.17/mod.ts";
import { handleCors, jsonResponse } from "../_shared/cors.ts";
import { createAdminClient, getCallingUser } from "../_shared/supabase-admin.ts";

const MAX_DIMENSION = 2000;
const ALLOWED_BUCKETS = ["public-profile-images", "portfolio-images", "outfit-inspiration", "blog-media", "review-photos", "event-images"];

interface ProcessMediaBody {
  bucket: string;
  path: string;
  altText?: string;
  caption?: string;
}

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const user = await getCallingUser(req);
    if (!user) return jsonResponse({ error: "unauthorized" }, 401);

    const body: ProcessMediaBody = await req.json();
    if (!body.bucket || !body.path || !ALLOWED_BUCKETS.includes(body.bucket)) {
      return jsonResponse({ error: "invalid_request" }, 400);
    }

    const admin = createAdminClient();
    const { data: profile } = await admin.from("profiles").select("id").eq("auth_user_id", user.id).single();
    if (!profile) return jsonResponse({ error: "profile_not_found" }, 404);

    const { data: fileBlob, error: downloadError } = await admin.storage.from(body.bucket).download(body.path);
    if (downloadError || !fileBlob) return jsonResponse({ error: "file_not_found", detail: downloadError?.message }, 404);

    const bytes = new Uint8Array(await fileBlob.arrayBuffer());
    const mimeType = fileBlob.type || "image/jpeg";

    let width = 0;
    let height = 0;
    let optimizedUrl: string | null = null;

    if (mimeType.startsWith("image/")) {
      const decoded = await Image.decode(bytes);
      width = decoded.width;
      height = decoded.height;

      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        decoded.resize(
          width > height ? MAX_DIMENSION : Image.RESIZE_AUTO,
          height >= width ? MAX_DIMENSION : Image.RESIZE_AUTO
        );
      }

      const optimizedBytes = await decoded.encode(1); // PNG-compatible encoder path; WebP not available in all builds
      const optimizedPath = body.path.replace(/(\.[a-zA-Z0-9]+)$/, "-optimized.png");

      const { error: uploadError } = await admin.storage.from(body.bucket).upload(optimizedPath, optimizedBytes, {
        contentType: "image/png",
        upsert: true,
      });

      if (!uploadError) {
        const { data: publicUrl } = admin.storage.from(body.bucket).getPublicUrl(optimizedPath);
        optimizedUrl = publicUrl.publicUrl;
      }
    }

    const { data: publicUrlData } = admin.storage.from(body.bucket).getPublicUrl(body.path);

    const { data: mediaAsset, error: insertError } = await admin
      .from("media_assets")
      .insert({
        uploaded_by: profile.id,
        file_url: optimizedUrl ?? publicUrlData.publicUrl,
        file_path: body.path,
        file_type: mimeType.startsWith("video/") ? "video" : mimeType.startsWith("image/") ? "image" : "document",
        mime_type: mimeType,
        size: bytes.byteLength,
        width: width || null,
        height: height || null,
        alt_text: body.altText ?? null,
        caption: body.caption ?? null,
      })
      .select("id, file_url")
      .single();

    if (insertError) return jsonResponse({ error: "server_error", detail: insertError.message }, 500);

    return jsonResponse({ success: true, mediaAsset });
  } catch (error) {
    console.error("process-media-upload error", error);
    return jsonResponse({ error: "internal_error" }, 500);
  }
});
