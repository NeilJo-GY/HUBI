// app/src/config/recaptcha.ts
const PROJECT_ID = process.env.RECAPTCHA_PROJECT_ID;
const API_KEY = process.env.RECAPTCHA_API_KEY;
const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
const DEV_HTTPS_PROXY = process.env.DEV_HTTPS_PROXY;
const PROD_HTTPS_PROXY = process.env.PROD_HTTPS_PROXY;

function validateEnvConfig() {
  const missing = Object.entries({ PROJECT_ID, API_KEY, SITE_KEY })
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

validateEnvConfig();

export { PROJECT_ID, API_KEY, SITE_KEY, DEV_HTTPS_PROXY, PROD_HTTPS_PROXY };
