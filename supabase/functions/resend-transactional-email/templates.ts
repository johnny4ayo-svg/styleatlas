// Branded HTML email templates. All variable interpolation happens here,
// server-side, on values already validated/typed by the calling function
// — never on raw user HTML — so there's no injection surface.
const SITE_URL = Deno.env.get("SITE_URL") ?? "https://styleatlas.ng";

function wrap(title: string, bodyHtml: string, ctaLabel?: string, ctaUrl?: string) {
  return `
  <div style="font-family: -apple-system, Segoe UI, Arial, sans-serif; background:#F8F9FA; padding:32px;">
    <div style="max-width:520px; margin:0 auto; background:#FFFFFF; border-radius:12px; overflow:hidden; border:1px solid #EDEBE3;">
      <div style="background:#1F1F1F; padding:24px 32px;">
        <span style="color:#D4AF37; font-family: Georgia, serif; font-size:20px; font-weight:600;">STYLEATLAS</span>
      </div>
      <div style="padding:32px;">
        <h1 style="font-family: Georgia, serif; font-size:22px; color:#1F1F1F; margin:0 0 16px;">${title}</h1>
        <div style="font-size:15px; line-height:1.6; color:#4A4A4A;">${bodyHtml}</div>
        ${
          ctaLabel && ctaUrl
            ? `<a href="${ctaUrl}" style="display:inline-block; margin-top:24px; background:#D4AF37; color:#1F1F1F; text-decoration:none; padding:12px 24px; border-radius:6px; font-weight:600; font-size:14px;">${ctaLabel}</a>`
            : ""
        }
      </div>
      <div style="padding:20px 32px; background:#F8F9FA; font-size:12px; color:#6B7280;">
        STYLEATLAS · Nigeria's Trusted Fashion Directory<br/>
        <a href="${SITE_URL}/dashboard/settings" style="color:#6B7280;">Manage email preferences</a>
      </div>
    </div>
  </div>`;
}

export type EmailTemplate =
  | "welcome"
  | "professional_onboarding_reminder"
  | "listing_approved"
  | "listing_rejected"
  | "verification_submitted"
  | "verification_approved"
  | "verification_rejected"
  | "new_lead_received"
  | "customer_request_received"
  | "professional_responded_to_request"
  | "payment_successful"
  | "payment_failed"
  | "subscription_renewed"
  | "subscription_canceled"
  | "review_received"
  | "review_reply_notification"
  | "job_application_received"
  | "event_submission_approved"
  | "admin_alert";

export function renderTemplate(
  template: EmailTemplate,
  variables: Record<string, string | number>
): { subject: string; html: string } {
  switch (template) {
    case "welcome":
      return {
        subject: `Welcome to STYLEATLAS, ${variables.fullName}!`,
        html: wrap(
          `Welcome, ${variables.fullName}!`,
          `Thanks for joining STYLEATLAS — Nigeria's trusted fashion directory. You can now search designers, save favorites, and get matched with professionals.`,
          "Explore the Directory",
          `${SITE_URL}/directory`
        ),
      };
    case "professional_onboarding_reminder":
      return {
        subject: "Finish setting up your STYLEATLAS business profile",
        html: wrap(
          "You're almost ready to get leads",
          `Your business profile "${variables.businessName}" is still incomplete. Add a logo, portfolio, and services to start appearing in search results.`,
          "Complete Your Profile",
          `${SITE_URL}/dashboard/profile`
        ),
      };
    case "listing_approved":
      return {
        subject: "Your STYLEATLAS listing is now live",
        html: wrap("Your listing is live!", `"${variables.businessName}" has been approved and is now visible to customers.`, "View Your Listing", `${SITE_URL}/designers/${variables.slug}`),
      };
    case "listing_rejected":
      return {
        subject: "Your STYLEATLAS listing needs changes",
        html: wrap("Your listing needs a few changes", `We couldn't approve "${variables.businessName}" yet. Reason: ${variables.reason}`, "Update Your Profile", `${SITE_URL}/dashboard/profile`),
      };
    case "verification_submitted":
      return {
        subject: "Verification request received",
        html: wrap("We've received your verification request", `Our team is reviewing your ${variables.requestedLevel} verification for "${variables.businessName}". This usually takes 2-5 business days.`),
      };
    case "verification_approved":
      return {
        subject: "You're verified on STYLEATLAS!",
        html: wrap("Congratulations, you're verified!", `"${variables.businessName}" now has the ${variables.level} badge, boosting trust and visibility.`, "View Your Listing", `${SITE_URL}/dashboard/profile`),
      };
    case "verification_rejected":
      return {
        subject: "Update needed on your verification request",
        html: wrap("Your verification request needs attention", `Reason: ${variables.reason}. You can resubmit with updated documents anytime.`, "Resubmit Verification", `${SITE_URL}/dashboard/profile`),
      };
    case "new_lead_received":
      return {
        subject: `New lead: ${variables.leadName}`,
        html: wrap("You have a new lead!", `${variables.leadName} is interested in your services on "${variables.businessName}". Respond quickly to improve your conversion rate.`, "View Lead", `${SITE_URL}/dashboard/leads`),
      };
    case "customer_request_received":
      return {
        subject: "We've received your fashion request",
        html: wrap("Your request is being matched", `We're matching your request "${variables.title}" with relevant verified professionals now.`, "View Your Request", `${SITE_URL}/dashboard/requests`),
      };
    case "professional_responded_to_request":
      return {
        subject: "A professional responded to your fashion request",
        html: wrap("You've got a response!", `${variables.businessName} responded to your request "${variables.title}".`, "View Response", `${SITE_URL}/dashboard/requests`),
      };
    case "payment_successful":
      return {
        subject: "Payment successful — STYLEATLAS",
        html: wrap("Payment received, thank you!", `Your payment of ${variables.amount} for the ${variables.planName} plan was successful.`, "View Billing", `${SITE_URL}/dashboard/billing`),
      };
    case "payment_failed":
      return {
        subject: "Payment failed — action required",
        html: wrap("We couldn't process your payment", `Your payment for the ${variables.planName} plan failed. Please update your payment method to avoid service interruption.`, "Update Payment", `${SITE_URL}/dashboard/billing`),
      };
    case "subscription_renewed":
      return {
        subject: "Your STYLEATLAS subscription renewed",
        html: wrap("Subscription renewed", `Your ${variables.planName} plan has renewed and is active until ${variables.periodEnd}.`, "View Billing", `${SITE_URL}/dashboard/billing`),
      };
    case "subscription_canceled":
      return {
        subject: "Your STYLEATLAS subscription was canceled",
        html: wrap("Subscription canceled", `Your ${variables.planName} plan has been canceled and will remain active until ${variables.periodEnd}.`, "Reactivate", `${SITE_URL}/pricing`),
      };
    case "review_received":
      return {
        subject: "You received a new review",
        html: wrap("New review on your listing", `${variables.customerName} left a ${variables.rating}-star review on "${variables.businessName}".`, "View & Reply", `${SITE_URL}/dashboard/reviews`),
      };
    case "review_reply_notification":
      return {
        subject: `${variables.businessName} replied to your review`,
        html: wrap("You got a reply!", `${variables.businessName} replied to your review.`, "View Reply", `${SITE_URL}/designers/${variables.slug}`),
      };
    case "job_application_received":
      return {
        subject: `New application for ${variables.jobTitle}`,
        html: wrap("New job application", `${variables.applicantName} applied for "${variables.jobTitle}".`, "Review Application", `${SITE_URL}/dashboard/jobs`),
      };
    case "event_submission_approved":
      return {
        subject: "Your event is approved and live",
        html: wrap("Your event is live!", `"${variables.eventTitle}" has been approved and is now visible on STYLEATLAS.`, "View Event", `${SITE_URL}/events/${variables.slug}`),
      };
    case "admin_alert":
      return {
        subject: `Admin alert: ${variables.subject}`,
        html: wrap(String(variables.subject), String(variables.message)),
      };
    default:
      return { subject: "STYLEATLAS Notification", html: wrap("Notification", "You have a new notification on STYLEATLAS.") };
  }
}
