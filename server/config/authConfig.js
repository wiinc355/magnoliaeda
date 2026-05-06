const crypto = require('crypto');
const { ConfidentialClientApplication } = require('@azure/msal-node');

const tenantId = process.env.ENTRA_TENANT_ID;
const clientId = process.env.ENTRA_CLIENT_ID;
const clientSecret = process.env.ENTRA_CLIENT_SECRET;

if (!tenantId || !clientId || !clientSecret) {
  console.warn('Entra auth env vars are missing. Set ENTRA_TENANT_ID, ENTRA_CLIENT_ID, and ENTRA_CLIENT_SECRET.');
}

const msalClient = new ConfidentialClientApplication({
  auth: {
    clientId: clientId || 'missing-client-id',
    authority: `https://login.microsoftonline.com/${tenantId || 'common'}`,
    clientSecret: clientSecret || 'missing-client-secret'
  }
});

const loginScopes = ['openid', 'profile', 'email'];

function createRandomBase64Url(size = 32) {
  return crypto.randomBytes(size).toString('base64url');
}

function createPkceCodes() {
  const verifier = createRandomBase64Url(64);
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
  return { verifier, challenge };
}

module.exports = {
  msalClient,
  loginScopes,
  createRandomBase64Url,
  createPkceCodes
};
