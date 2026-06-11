// ============================================================
// Magister API Route
// POST — Fetches data using stored access token
// ============================================================

import { cookies } from 'next/headers';

// --- POST: Fetch Magister data using access token ---
export async function POST(request) {
  try {
    const { action } = await request.json();

    // Get token from cookie
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('magister_token');
    const schoolCookie = cookieStore.get('magister_school');

    if (!tokenCookie) {
      return Response.json(
        { error: 'Niet ingelogd bij Magister. Koppel eerst je account.' },
        { status: 401 }
      );
    }

    const accessToken = tokenCookie.value;
    let tenant = schoolCookie?.value || '';

    // If we don't have the tenant stored, try to discover it from the token
    if (!tenant) {
      try {
        const payloadB64 = accessToken.split('.')[1];
        const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
        if (payload.iss) {
          const issMatch = payload.iss.match(/https?:\/\/([^.]+)\.magister\.net/);
          if (issMatch) tenant = issMatch[1];
        }
        if (!tenant && payload.tenant) tenant = payload.tenant;
      } catch {}
    }

    if (!tenant) {
      return Response.json(
        { error: 'School niet gevonden. Log opnieuw in bij Magister.' },
        { status: 400 }
      );
    }

    const schoolUrl = `https://${tenant}.magister.net`;

    // Get account info
    const accountRes = await fetch(`${schoolUrl}/api/account`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!accountRes.ok) {
      // Token might be expired
      if (accountRes.status === 401) {
        cookieStore.delete('magister_token');
        cookieStore.delete('magister_school');
        return Response.json(
          { error: 'Sessie verlopen. Log opnieuw in bij Magister.' },
          { status: 401 }
        );
      }
      return Response.json(
        { error: 'Kon accountgegevens niet ophalen' },
        { status: 500 }
      );
    }

    const account = await accountRes.json();
    const personId = account.Persoon?.Id;
    const userName = account.Persoon?.Roepnaam || account.Persoon?.OfficieleVoornamen || '';
    const fullName = account.Persoon?.OfficieleAchternaam
      ? `${userName} ${account.Persoon.OfficieleAchternaam}`
      : userName;

    if (!personId) {
      return Response.json({ error: 'Kon leerling-ID niet vinden' }, { status: 500 });
    }

    const result = { authenticated: true, school: tenant, personId, userName: fullName };

    // --- Fetch grades ---
    if (action === 'grades' || action === 'all') {
      try {
        const gradesRes = await fetch(
          `${schoolUrl}/api/personen/${personId}/cijfers/laatste?top=100&actievePerioden=true`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (gradesRes.ok) {
          const gradesData = await gradesRes.json();
          result.grades = (gradesData.Items || gradesData.items || []).map((g) => ({
            subject: g.Vak?.Omschrijving || g.vak?.omschrijving || 'Onbekend',
            subjectCode: g.Vak?.Afkorting || g.vak?.afkorting || '',
            grade: g.CijferStr || g.waarde || '',
            description: g.KolomOmschrijving || g.omschrijving || '',
            date: g.DatumIngevoerd || g.datumIngevoerd || '',
            weight: g.Weging || g.weging || 1,
            isVoldoende: g.IsVoldoende ?? true,
          }));
        }
      } catch (e) {
        console.error('Error fetching grades:', e);
        result.grades = [];
      }
    }

    // --- Fetch homework ---
    if (action === 'homework' || action === 'all') {
      try {
        const now = new Date();
        const from = now.toISOString().split('T')[0];
        const until = new Date(now.getTime() + 30 * 86400000).toISOString().split('T')[0];

        const hwRes = await fetch(
          `${schoolUrl}/api/personen/${personId}/afspraken?van=${from}&tot=${until}&status=1`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (hwRes.ok) {
          const hwData = await hwRes.json();
          result.homework = (hwData.Items || hwData.items || [])
            .filter((item) => item.Inhoud || item.inhoud)
            .map((item) => ({
              subject: item.Vakken?.[0]?.Naam || item.vakken?.[0]?.naam || 'Onbekend',
              title: item.Inhoud || item.inhoud || '',
              date: item.Start || item.start || '',
              done: item.Afgerond || item.afgerond || false,
            }));
        }
      } catch (e) {
        console.error('Error fetching homework:', e);
        result.homework = [];
      }
    }

    // --- Fetch schedule ---
    if (action === 'schedule' || action === 'all') {
      try {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const monday = new Date(now);
        monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        const friday = new Date(monday);
        friday.setDate(monday.getDate() + 4);
        const from = monday.toISOString().split('T')[0];
        const until = friday.toISOString().split('T')[0];

        const schedRes = await fetch(
          `${schoolUrl}/api/personen/${personId}/afspraken?van=${from}&tot=${until}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (schedRes.ok) {
          const schedData = await schedRes.json();
          result.schedule = (schedData.Items || schedData.items || []).map((item) => ({
            subject: item.Vakken?.[0]?.Naam || item.vakken?.[0]?.naam || item.Omschrijving || '',
            start: item.Start || item.start || '',
            end: item.Einde || item.einde || '',
            location: item.Lokatie || item.lokatie || '',
            teacher: item.Docenten?.[0]?.Naam || item.docenten?.[0]?.naam || '',
            hour: item.LesuurVan || item.lesuurVan || 0,
          }));
        }
      } catch (e) {
        console.error('Error fetching schedule:', e);
        result.schedule = [];
      }
    }

    return Response.json(result);
  } catch (err) {
    console.error('Magister API error:', err);
    return Response.json({ error: 'Er is een onverwachte fout opgetreden' }, { status: 500 });
  }
}
