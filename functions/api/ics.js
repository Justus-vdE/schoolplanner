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
  const upstream = await fetch(u.toString(), {
    headers: { 'Accept': 'text/calendar, text/plain, */*' },
  });
  if (!upstream.ok) {
    return new Response('De agenda-dienst gaf een fout (' + upstream.status + '). Controleer of de link klopt en de koppeling/publicatie aan staat.', { status: 502 });
  }
  const body = await upstream.text();
  // Elke aanbieder is welkom (Google, Apple, Outlook, Magister, school…),
  // maar het antwoord MOET een echt iCal-bestand zijn — anders is dit een
  // open doorgeefluik dat misbruikt kan worden om willekeurige sites op te
  // halen. Ook een maat-limiet om misbruik te voorkomen.
  if (!/^\s*BEGIN:VCALENDAR/i.test(body.slice(0, 200))) {
    return new Response('Deze link is geen agenda (iCal). Kopieer de iCal/ICS-link uit je agenda-app.', { status: 400 });
  }
  if (body.length > 3_000_000) {
    return new Response('Deze agenda is te groot om te importeren.', { status: 413 });
  }
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
