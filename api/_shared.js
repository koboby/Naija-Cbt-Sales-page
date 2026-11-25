const PLANS = Object.freeze({
  personal: { id: "personal", name: "Naija CBT Personal", amountKobo: 500000, currency: "NGN" }
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
module.exports = { PLANS, json, paystack };
