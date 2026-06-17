// Cloudflare Pages Function: Magister-proxy.
// magister.net staat geen directe browser-verzoeken van andere sites toe (CORS),
// en de inlog/OAuth-redirect mag alleen naar Magister's eigen adres. Daarom doet
// deze server-functie het werk: inloggen en data ophalen, namens de gebruiker.
//
// LET OP — eerlijk over de status:
//  * action=data  werkt meteen: geef een bestaand bearer-token + school mee.
//  * action=login is een SCAFFOLD voor de gebruikersnaam/wachtwoord-flow. Twee
//    waardes moet je live uit je eigen Magister halen (DevTools → Network → het
//    'authorize'-verzoek): de huidige CLIENT_ID en REDIRECT_URI. Vul ze hieronder
//    in. 2FA-accounts vereisen een extra stap (zie TODO).
//
// Beveiliging: hier passeren wachtwoorden/tokens van (vaak minderjarige)
// scholieren. Log NOOIT credentials, bewaar niets server-side, en draai dit
// alleen over https.

const ACCOUNTS = 'https://accounts.magister.net';

// >>> Live in te vullen vanuit DevTools (zie kop hierboven) <<<
const CLIENT_ID = 'M6LOLODfzo-NU_...'; // TODO: vervang door de actuele client_id
const REDIRECT_URI = 'https://argo-saml.../oidc';  // TODO: vervang door de actuele redirect_uri
const SCOPE = 'openid profile offline_access';

// --- PKCE helpers (Web Crypto is beschikbaar in de Workers-runtime) ---
function b64url(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function randomVerifier() {
  const a = new Uint8Array(32);
  crypto.getRandomValues(a);
  return b64url(a.buffer);
}
async function challenge(verifier) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return b64url(digest);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

// Normaliseer een schoolnaam naar een magister-subdomein.
function schoolHost(school) {
  const clean = String(school || '').trim().toLowerCase()
    .replace(/^https?:\/\//, '').replace(/\.magister\.net.*$/, '').replace(/[^a-z0-9-]/g, '');
  if (!clean) return null;
  return `${clean}.magister.net`;
}

// --- Data ophalen met een geldig bearer-token ---
async function fetchData(host, token) {
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/json' };
  const get = async (path) => {
    const r = await fetch(`https://${host}${path}`, { headers });
    if (!r.ok) return { _error: r.status, _path: path };
    return r.json();
  };

  // Wie ben ik? Hieruit komt het persoon-id voor de overige endpoints.
  const account = await get('/api/account');
  const persoonId = account?.Persoon?.Id;
  if (!persoonId) {
    return { account, error: 'Geen persoon-id gevonden — token verlopen of ongeldig?' };
  }

  const today = new Date();
  const from = new Date(today.getTime() - 14 * 864e5).toISOString().slice(0, 10);
  const to = new Date(today.getTime() + 14 * 864e5).toISOString().slice(0, 10);

  // Parallel ophalen wat we nodig hebben.
  const [cijfers, afspraken, opdrachten] = await Promise.all([
    get(`/api/personen/${persoonId}/cijfers/laatste`),
    get(`/api/personen/${persoonId}/afspraken?van=${from}&tot=${to}`),
    get(`/api/personen/${persoonId}/opdrachten`),
  ]);

  return {
    account: { id: persoonId, naam: account?.Persoon?.Roepnaam || account?.Persoon?.Achternaam },
    cijfers, afspraken, opdrachten,
  };
}

// --- Login-flow (scaffold) ---
// Server-side auth-code + PKCE: omdat WIJ de verzoeken doen (geen browser),
// mogen we Magister's eigen REDIRECT_URI gebruiken en lezen we de ?code= zelf
// uit de Location-header. Dit is de kern; de exacte login-POST verschilt per
// Magister-versie en moet tegen jouw school getest worden.
async function login(host, username, password) {
  const verifier = randomVerifier();
  const codeChallenge = await challenge(verifier);
  const state = randomVerifier().slice(0, 16);
  const nonce = randomVerifier().slice(0, 16);

  const authorizeUrl = `${ACCOUNTS}/connect/authorize?` + new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: SCOPE,
    state, nonce,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  // Stap 1: authorize openen → Magister stuurt door naar de loginpagina.
  // We volgen redirects handmatig en verzamelen cookies + het anti-forgery token.
  // TODO (live testen):
  //   - GET authorizeUrl met redirect: 'manual', cookies bewaren
  //   - uit de login-HTML het sessie-/returnUrl-/__RequestVerificationToken halen
  //   - POST username/password naar de login-endpoint met die cookies + token
  //   - bij 2FA: extra POST met de 6-cijfercode (TOTP)
  //   - de uiteindelijke redirect bevat ?code=...; die lezen we uit Location
  //   - POST code + verifier naar ${ACCOUNTS}/connect/token → access_token
  //
  // Tot dat live is getest geven we een duidelijke melding terug.
  return {
    error: 'login_scaffold',
    message: 'De wachtwoord-login moet nog tegen jouw school getest worden. ' +
      'Gebruik voorlopig action=data met een bearer-token, of vul CLIENT_ID/REDIRECT_URI in en test de flow.',
    debug: { authorizeUrl: authorizeUrl.toString(), host },
  };
}

export async function onRequest({ request }) {
  if (request.method !== 'POST') {
    return json({ error: 'Gebruik POST' }, 405);
  }
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json({ error: 'Ongeldige JSON' }, 400);
  }

  const host = schoolHost(body.school);
  if (!host) return json({ error: 'Vul een geldige school in (bijv. "mijnschool").' }, 400);

  try {
    if (body.action === 'data') {
      if (!body.token) return json({ error: 'Geen token meegegeven.' }, 400);
      return json(await fetchData(host, body.token));
    }
    if (body.action === 'login') {
      if (!body.username || !body.password) return json({ error: 'Gebruikersnaam en wachtwoord vereist.' }, 400);
      return json(await login(host, body.username, body.password));
    }
    return json({ error: 'Onbekende action (gebruik "login" of "data").' }, 400);
  } catch (e) {
    return json({ error: 'Er ging iets mis bij Magister: ' + (e?.message || e) }, 502);
  }
}
