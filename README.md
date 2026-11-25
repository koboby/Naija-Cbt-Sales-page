# Naija CBT Sales Website

Static sales page plus Vercel serverless API routes for Paystack checkout.

## Vercel environment variables

Set these for **Preview** while testing (and Production only when intentionally going live):

- `PAYSTACK_SECRET_KEY`: Paystack test secret key (`sk_test_...`). Never expose it in browser code.
- `LICENSING_API_URL`: HTTPS base URL of the separately deployed Naija CBT Licensing API, with no trailing slash.
- `ADMIN_API_TOKEN`: same strong server-side token configured on the licensing API.

Redeploy after changing environment variables.

## Test checkout

The page calls `POST /api/checkout` with a selected plan and buyer email. The server initializes Paystack checkout. Paystack redirects back with a transaction reference. The page calls `GET /api/verify?reference=...`; the server verifies the transaction directly with Paystack and checks status, currency, amount, product and plan before asking the licensing API to issue a code.

No browser-supplied payment-success flag is trusted. Do not use live keys until test transactions and activation tests pass.

## Important deployment dependency

The licensing API must be deployed and reachable over HTTPS, with durable database storage and its private signing key/admin token configured. The current SQLite licensing service is not suitable for ephemeral serverless storage without a persistent volume/database migration. Do not enable live sales until that is addressed.

## Delivery limitation

For the initial test, the verified activation code is shown on the return page for the buyer to copy. Automated email delivery is not included yet. The licensing API currently rejects duplicate payment references; if a payment is verified but issuance fails, inspect server logs and reconcile before retrying or issuing a second code.
