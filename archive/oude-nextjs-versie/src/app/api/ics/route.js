// ============================================================
// ICS Proxy Route
// Fetches ICS data from external URL to avoid CORS issues
// ============================================================

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return Response.json({ error: 'URL is verplicht' }, { status: 400 });
    }

    // Convert webcal:// to https:// (webcal is just https for calendar subscriptions)
    const normalizedUrl = url.replace(/^webcal:\/\//i, 'https://');

    // Basic URL validation
    try {
      const parsed = new URL(normalizedUrl);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return Response.json({ error: 'Alleen HTTP(S) URLs zijn toegestaan' }, { status: 400 });
      }
    } catch {
      return Response.json({ error: 'Ongeldige URL' }, { status: 400 });
    }

    const res = await fetch(normalizedUrl, {
      headers: { 'Accept': 'text/calendar, text/plain, */*' },
    });

    if (!res.ok) {
      return Response.json(
        { error: `Kon kalender niet ophalen (HTTP ${res.status})` },
        { status: 502 }
      );
    }

    const text = await res.text();

    if (!text.includes('BEGIN:VCALENDAR')) {
      return Response.json(
        { error: 'Dit is geen geldig ICS/iCal bestand' },
        { status: 422 }
      );
    }

    return Response.json({ data: text });
  } catch (err) {
    console.error('ICS proxy error:', err);
    return Response.json(
      { error: 'Kon de kalender niet ophalen. Controleer de URL.' },
      { status: 500 }
    );
  }
}
