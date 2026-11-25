"use strict";
const { PLANS, json, paystack } = require("./_shared");
module.exports = async (req, res) => {
  if (req.method !== "POST") return json(res, 405, { error: "method_not_allowed" });
  if (!process.env.PAYSTACK_SECRET_KEY || !process.env.APP_DOWNLOAD_URL) return json(res, 503, { error: "payment_or_download_not_configured" });
  try {
    const { planId, email } = req.body || {};
    const plan = typeof planId === "string" ? PLANS[planId] : null;
    if (!plan) return json(res, 400, { error: "invalid_plan" });
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return json(res, 400, { error: "valid_email_required" });
    const origin = "https://" + req.headers.host;
    const data = await paystack("/transaction/initialize", { method: "POST", body: JSON.stringify({
      email, amount: plan.amountKobo, currency: plan.currency,
      callback_url: origin + "/?payment=verify",
      metadata: { product: "naija_cbt", planId: plan.id, planName: plan.name, custom_fields: [{ display_name: "Product", variable_name: "product", value: "Naija CBT" }] }
    }) });
    return json(res, 200, { authorizationUrl: data.authorization_url, reference: data.reference });
  } catch (error) {
    console.error("checkout_initialization_failed", error.message);
    return json(res, 502, { error: "checkout_initialization_failed" });
  }
};
