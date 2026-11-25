const PLANS = Object.freeze({
  personal: { id: "personal", name: "Naija CBT Personal", amountKobo: 500000, currency: "NGN" },
  centre_5: { id: "centre_5", name: "Naija CBT Centre - 5 Computers", amountKobo: 2500000, currency: "NGN" },
  centre_10: { id: "centre_10", name: "Naija CBT Centre - 10 Computers", amountKobo: 4000000, currency: "NGN" },
  centre_20: { id: "centre_20", name: "Naija CBT Centre - 20 Computers", amountKobo: 7000000, currency: "NGN" }
});
function json(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}
async function paystack(path, options = {}) {
  const response = await fetch("https://api.paystack.co" + path, {
    ...options,
    headers: { Authorization: "Bearer " + process.env.PAYSTACK_SECRET_KEY, "Content-Type": "application/json", ...(options.headers || {}) }
  });
  const data = await response.json();
  if (!response.ok || data.status !== true) throw new Error(data.message || "Paystack request failed");
  return data.data;
}
async function issueLicense(plan, reference) {
  const base = (process.env.LICENSING_API_URL || "").replace(/\/$/, "");
  if (!base || !process.env.ADMIN_API_TOKEN) throw new Error("Licensing service is not configured");
  const response = await fetch(base + "/v1/admin/licenses", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + process.env.ADMIN_API_TOKEN },
    body: JSON.stringify({ planId: plan.id, paymentReference: reference, verifiedPayment: true, amountKobo: plan.amountKobo, currency: plan.currency })
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Licence issuance failed");
  return result;
}
module.exports = { PLANS, json, paystack, issueLicense };
