// Cloudflare Pages Function: Magister-proxy.
// magister.net staat geen directe browser-verzoeken van andere sites toe (CORS).
// Deze server-functie haalt daarom de data op namens de gebruiker, met een
// bearer-token dat de gebruiker zelf via de bookmarklet uit zijn eigen
// Magister-sessie haalt. Er wordt NOOIT om een wachtwoord gevraagd.
//
// Beveiliging: hier passeren tokens van (vaak minderjarige) scholieren.
// Log NOOIT tokens, bewaar niets server-side, en draai dit alleen over https.

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

// Alleen verzoeken vanaf onze eigen site: een andere website mag deze proxy
// niet als doorgeefluik naar Magister gebruiken. Verzoeken zonder Origin
// (zelfde site zonder CORS, of niet-browser) laten we door — de check is een
// browser-verdediging, geen vervanging van server-side validatie.
function originAllowed(request) {
  const origin = request.headers.get('Origin');
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch (e) {
    return false;
  }
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

export async function onRequest({ request }) {
  if (request.method !== 'POST') {
    return json({ error: 'Gebruik POST' }, 405);
  }
  if (!originAllowed(request)) {
    return json({ error: 'Verzoek vanaf een andere site is niet toegestaan.' }, 403);
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
    // Er is bewust géén wachtwoord-login: we vragen en verwerken nooit
    // wachtwoorden van gebruikers. Koppelen gaat via de bookmarklet (token).
    return json({ error: 'Onbekende action (gebruik "data" met een token).' }, 400);
  } catch (e) {
    return json({ error: 'Er ging iets mis bij Magister: ' + (e?.message || e) }, 502);
  }
}
