# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `VITE_OPENROUTER_API_KEY` in [.env.local](.env.local) to your OpenRouter (or Gemini) API key
3. Run the app:
   `npm run dev`

## Security: leaked key remediation

If a secret was accidentally committed (GitHub alert), follow these steps:

- Rotate the key immediately via OpenRouter and any provider dashboards.
- Revoke the old key in OpenRouter.
- Check logs for suspicious activity.
- Remove the secret from the repository history (use git filter-repo or BFG) if necessary.

Do not keep real secrets in `.env` committed to the repo; use `.env.local`, CI secrets, or a secret manager.
