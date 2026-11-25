"use strict";
const { PLANS, json, paystack } = require("./_shared");
const DOWNLOAD_URL = process.env.APP_DOWNLOAD_URL || "";
module.exports = async (req, res) => {
  if (req.method !== "GET" && req.method !== "POST") return json(res, 405, { error: "method_not_allowed" });
  if (!process.env.PAYSTACK_SECRET_KEY || !DOWNLOAD_URL) return json(res, 503, { error: "payment_or_download_not_configured" });
  const reference = req.method === "GET" ? req.query?.reference : req.body?.reference;
  if (typeof reference !== "string" || reference.length < 8 || reference.length > 100) return json(res, 400, { error: "invalid_reference" });
  try {
    const transaction = await paystack("/transaction/verify/" + encodeURIComponent(reference));
    if (transaction.status !== "success" || transaction.currency !== "NGN") return json(res, 402, { error: "payment_not_successful" });
    const plan = transaction.metadata?.planId === "personal" ? PLANS.personal : null;
    if (!plan || transaction.amount !== plan.amountKobo || transaction.metadata?.product !== "naija_cbt") return json(res, 400, { error: "payment_details_mismatch" });
    return json(res, 200, { ok: true, planName: plan.name, downloadUrl: DOWNLOAD_URL, message: "Payment verified. Download Naija CBT." });
  } catch (error) {
    console.error("payment_verification_failed", error.message);
    return json(res, 502, { error: "payment_verification_failed" });
  }
};
