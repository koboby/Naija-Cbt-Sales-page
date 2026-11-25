# Naija CBT — Sales Website

Premium responsive product landing page for the Naija CBT Windows desktop CBT practice app.

## Preview locally
Open `index.html` in a browser. No build step is required.

## Deploy with GitHub Pages
1. Open repository Settings → Pages.
2. Choose **Deploy from a branch**, branch `main`, folder `/ (root)`.
3. Save and wait for GitHub Pages to publish.

A workflow is also included to publish the site using GitHub Pages Actions when Pages is enabled for the repository.

## Before accepting payments
The page intentionally does not pretend checkout is live. Purchase buttons show a setup notice until secure checkout URLs are configured. To launch real sales:
- Choose a payment provider (Paystack is a sensible Nigeria-first option).
- Implement a server-side checkout endpoint and verify payment webhooks.
- After a verified, paid webhook, call the private licensing API to issue a unique code.
- Deliver the activation code and installer securely; never expose the licensing admin token or signing private key in browser code.
- Set `window.NAIJACBT_CONFIG.checkoutUrls.student` and `window.NAIJACBT_CONFIG.checkoutUrls.centre` only to real, tested checkout URLs.

## Product accuracy
Keep exam-subject coverage, question counts, supported Windows versions, pricing and refund policy accurate. Do not describe generated practice questions as official past questions unless verified.
