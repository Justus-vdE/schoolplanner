// Cloudflare Pages Function: haalt de Magister-agendakoppeling (iCal) op
// namens de browser, omdat magister.net geen directe browser-verzoeken
// van andere websites toestaat (CORS). Alleen Magister-links zijn
// toegestaan, zodat dit geen open doorgeefluik voor willekeurige sites is.
export async function onRequest({ request }) {
  const target = new URL(request.url).searchParams.get('url');
  let u;
  try {
    u = new URL(String(target || '').replace(/^webcal:\/\//i, 'https://'));
  } catch (e) {
    return new Response('Ongeldige link', { status: 400 });
  }
  if (u.protocol !== 'https:') {
    return new Response('Alleen https-links zijn toegestaan', { status: 400 });
  }
  const host = u.hostname.toLowerCase();
  const allowed = host === 'magister.net'
    || host.endsWith('.magister.net')
    || host.endsWith('.magister.nl');
  if (!allowed) {
    return new Response('Alleen Magister-links zijn toegestaan', { status: 400 });
  }

  const upstream = await fetch(u.toString(), {
    headers: { 'Accept': 'text/calendar, text/plain, */*' },
  });
  const body = await upstream.text();
  return new Response(body, {
    status: upstream.status,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
