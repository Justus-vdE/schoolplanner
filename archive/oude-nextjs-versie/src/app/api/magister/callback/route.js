// ============================================================
// Magister OAuth2 Callback
// Exchanges authorization code for access token, discovers school
// from token, stores in cookie
// ============================================================

import { cookies } from 'next/headers';

const CLIENT_ID = 'M6LOAPP';
const REDIRECT_URI = 'http://localhost:3000/api/magister/callback';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  // Handle OAuth errors (user denied, etc.)
  if (error) {
    const errorDesc = searchParams.get('error_description') || 'Inloggen geannuleerd';
    return Response.redirect(
      `http://localhost:3000?magister_error=${encodeURIComponent(errorDesc)}`
    );
  }

  if (!code) {
    return Response.redirect(
      'http://localhost:3000?magister_error=' + encodeURIComponent('Ongeldige callback: code ontbreekt')
    );
  }

  // Exchange authorization code for access token
  const tokenUrl = 'https://accounts.magister.net/connect/token';

  try {
    const tokenRes = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
      }),
    });

    if (!tokenRes.ok) {
      const errBody = await tokenRes.text();
      console.error('Token exchange failed:', tokenRes.status, errBody);
      return Response.redirect(
        'http://localhost:3000?magister_error=' + encodeURIComponent('Token uitwisseling mislukt. Probeer opnieuw.')
      );
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    const expiresIn = tokenData.expires_in || 3600;

    if (!accessToken) {
      return Response.redirect(
        'http://localhost:3000?magister_error=' + encodeURIComponent('Geen access token ontvangen')
      );
    }

    // Discover the school tenant from the access token
    // The JWT contains the tenant info, or we can call the accounts endpoint
    let tenant = '';
    try {
      // Decode the JWT payload (base64url) to extract tenant
      const payloadB64 = accessToken.split('.')[1];
      const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
      // Magister tokens typically contain the tenant in the 'iss' or a custom claim
      if (payload.iss) {
        const issMatch = payload.iss.match(/https?:\/\/([^.]+)\.magister\.net/);
        if (issMatch) tenant = issMatch[1];
      }
      if (!tenant && payload.tenant) {
        tenant = payload.tenant;
      }
    } catch {
      // JWT decode failed — will try account endpoint below
    }

    // If we couldn't get tenant from JWT, try the account API via accounts.magister.net
    if (!tenant) {
      try {
        const profileRes = await fetch('https://accounts.magister.net/connect/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (profileRes.ok) {
          const profile = await profileRes.json();
          tenant = profile.tenant || profile.school || '';
        }
      } catch {
        // Fallback: tenant unknown
      }
    }

    // Store access token and school in httpOnly cookies
    const cookieStore = await cookies();

    cookieStore.set('magister_token', accessToken, {
      httpOnly: true,
      secure: false, // localhost
      sameSite: 'lax',
      maxAge: expiresIn,
      path: '/',
    });

    if (tenant) {
      cookieStore.set('magister_school', tenant, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: expiresIn,
        path: '/',
      });
    }

    // Redirect back to the app with success indicator
    return Response.redirect(
      `http://localhost:3000?magister_success=true`
    );
  } catch (err) {
    console.error('Callback error:', err);
    return Response.redirect(
      'http://localhost:3000?magister_error=' + encodeURIComponent('Er is een fout opgetreden bij het inloggen')
    );
  }
}
