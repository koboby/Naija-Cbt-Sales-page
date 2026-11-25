"use strict";
const { PLANS, json, paystack, issueLicense } = require("./_shared");
module.exports = async (req, res) => {
  if (req.method !== "GET" && req.method !== "POST") return json(res, 405, { error: "method_not_allowed" });
  if (!process.env.PAYSTACK_SECRET_KEY) return json(res, 503, { error: "payment_not_configured" });
  const reference = req.method === "GET" ? req.query?.reference : req.body?.reference;
  if (typeof reference !== "string" || reference.length < 8 || reference.length > 100) return json(res, 400, { error: "invalid_reference" });
  try {
    const transaction = await paystack("/transaction/verify/" + encodeURIComponent(reference));
    if (transaction.status !== "success" || transaction.currency !== "NGN") return json(res, 402, { error: "payment_not_successful" });
    const planId = transaction.metadata?.planId;
    const plan = typeof planId === "string" ? PLANS[planId] : null;
    if (!plan || transaction.amount !== plan.amountKobo) return json(res, 400, { error: "payment_details_mismatch" });
    if (transaction.metadata?.product !== "naija_cbt") return json(res, 400, { error: "wrong_product" });
    const license = await issueLicense(plan, transaction.reference);
    return json(res, 200, { ok: true, activationCode: license.code, planName: plan.name, maxDevices: license.maxDevices, message: "Payment verified. Save your activation code." });
  } catch (error) {
    console.error("payment_verification_failed", error.message);
    return json(res, 502, { error: "verification_or_licence_issuance_failed" });
  }
};
