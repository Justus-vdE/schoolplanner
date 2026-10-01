// Cloudflare Pages Function: zet vrije tekst uit de stuurbalk om in
// stuurregels voor de planner ("minder wiskunde op maandag" → een regel die
// wiskunde op maandag overslaat).
//
// Belangrijk: de AI maakt NIET je schema. Hij vertaalt alleen jouw woorden
// naar een vast lijstje knoppen dat de app zelf al kan. Alles wat hier
// terugkomt wordt streng gecontroleerd voordat het de app in gaat — een raar
// of kwaadwillend antwoord kan dus nooit meer dan deze knoppen omzetten.
//
// Instellen: zet in Cloudflare Pages → Settings → Environment variables een
// secret ANTHROPIC_API_KEY. Zonder die sleutel geeft dit endpoint netjes een
// foutmelding en blijft de stuurbalk werken op de ingebouwde parser.

const MODEL = 'claude-opus-5-5';
const API_URL = 'https://api.anthropic.com/v1/messages';
const MAX_TEXT = 300;
const MAX_TEXT_TUNE = 900;   // de beschrijving bij 'fijnslijpen' is langer
const MAX_SUBJECTS = 40;

// Exact dezelfde soorten regels als js/data.js kent. Niets anders komt erdoor.
const KINDS = ['blockDay', 'dayHours', 'subjectDay', 'subjectHours', 'blockMinutes', 'breakMinutes', 'variety', 'peak', 'noWeekend'];
const PEAKS = ['morning', 'afternoon', 'evening', 'any'];
const DAY_NAMES = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];

const TOOL = {
  name: 'stuurregels',
  description: 'Geef de aanpassingen die de leerling wil als een lijst stuurregels voor de studieplanner.',
  input_schema: {
    type: 'object',
    properties: {
      uitleg: {
        type: 'string',
        description: 'Eén korte Nederlandse zin die zegt wat je hebt aangepast, bijvoorbeeld "Wiskunde staat nu niet meer op maandag."',
      },
      regels: {
        type: 'array',
        description: 'De aanpassingen. Laat leeg als de tekst geen aanpassing van de planning is.',
        items: {
          type: 'object',
          properties: {
            soort: {
              type: 'string',
              enum: KINDS,
              description: [
                'blockDay: helemaal niet leren op een weekdag (gebruik "dag").',
                'dayHours: hoogstens zoveel uur op een weekdag (gebruik "dag" en "uren").',
                'subjectDay: een vak juist wel of juist niet op een weekdag (gebruik "vak", "dag" en "modus").',
                'subjectHours: meer of minder leertijd voor een vak (gebruik "vak" en "factor"; 1.3 = meer, 0.7 = minder).',
                'blockMinutes: lengte van een leerblok in minuten (gebruik "minuten").',
                'breakMinutes: lengte van de pauze tussen blokken in minuten (gebruik "minuten").',
                'variety: afwisselen tussen vakken aan of uit (gebruik "waarde" true/false).',
                'peak: op welk deel van de dag geleerd wordt (gebruik "moment").',
                'noWeekend: niet leren in het weekend.',
              ].join(' '),
            },
            dag: { type: 'integer', description: 'Weekdag: 0=zondag, 1=maandag ... 6=zaterdag.' },
            vak: { type: 'string', description: 'De sleutel van het vak, exact zoals in de meegegeven vakkenlijst.' },
            uren: { type: 'number', description: 'Aantal uren, voor dayHours.' },
            minuten: { type: 'integer', description: 'Aantal minuten, voor blockMinutes en breakMinutes.' },
            factor: { type: 'number', description: 'Vermenigvuldiger voor subjectHours: 1.3 voor meer tijd, 0.7 voor minder.' },
            modus: { type: 'string', enum: ['avoid', 'prefer'], description: 'Voor subjectDay: avoid = niet op die dag, prefer = juist op die dag.' },
            moment: { type: 'string', enum: PEAKS, description: 'Voor peak: morning, afternoon, evening of any.' },
          },
          required: ['soort'],
        },
      },
    },
    required: ['uitleg', 'regels'],
  },
};

function systemPrompt(subjectList, mode) {
  const vakken = [
    'Zijn vakken (gebruik precies deze sleutels in het veld "vak"):',
    subjectList.map(s => `- ${s.key} = ${s.name}`).join('\n') || '- (geen vakken bekend)',
  ];
  // 'tune': de leerling vraagt om advies bij het opzetten van de planning.
  if (mode === 'tune') {
    return [
      'Je bent een studiecoach voor een Nederlandse scholier.',
      'Je krijgt een beschrijving van zijn toetsen, zijn beschikbare tijd en hoe hij leert.',
      'Stel met het gereedschap "stuurregels" een paar verbeteringen voor die zijn leerschema beter maken. Gebruik het gereedschap altijd.',
      '',
      ...vakken,
      '',
      'Regels voor jou:',
      '- Geef hoogstens 4 regels. Kies de aanpassingen die het meest helpen.',
      '- Denk aan: moeilijke vakken meer tijd geven, leren op het moment dat hij scherp is, en een haalbare bloklengte.',
      '- Laat het weekend en vrije dagen met rust tenzij de beschrijving daar reden voor geeft.',
      '- "uitleg" is één korte zin in het Nederlands die zegt wat je hebt aangepast en waarom.',
    ].join('\n');
  }
  return [
    'Je helpt een Nederlandse scholier zijn studieplanning bijsturen.',
    'De leerling typt in gewone taal wat hij anders wil aan zijn leerschema.',
    'Zet dat om in stuurregels met het gereedschap "stuurregels". Gebruik het gereedschap altijd, ook als je niets kunt omzetten (geef dan een lege lijst regels).',
    '',
    ...vakken,
    '',
    'Regels voor jou:',
    '- Geef alleen aanpassingen die echt uit de tekst volgen. Verzin niets bij.',
    '- Noemt de leerling meerdere dagen of vakken, maak dan per combinatie een losse regel.',
    '- Gaat de tekst niet over de planning, geef dan een lege lijst en leg dat vriendelijk uit.',
    '- "uitleg" is één korte zin in het Nederlands, zonder opsomming.',
  ].join('\n');
}

// --- Controle van het antwoord ---------------------------------------------
// Alles hieronder gaat ervan uit dat het antwoord onbetrouwbaar kan zijn.

function clean(text, max) {
  return String(text == null ? '' : text).replace(/[<>"'&]/g, '').trim().slice(0, max);
}

function num(v, min, max) {
  const n = Number(v);
  if (!Number.isFinite(n) || n < min || n > max) return null;
  return n;
}

function ruleText(rule, subjectNames) {
  const vak = subjectNames[rule.subject] || 'dit vak';
  const dag = DAY_NAMES[rule.day] || '';
  switch (rule.kind) {
    case 'blockDay': return `Niet leren op ${dag}`;
    case 'dayHours': return `Max ${String(rule.hours).replace('.', ',')} uur op ${dag}`;
    case 'subjectDay': return `${rule.mode === 'avoid' ? 'Geen' : 'Juist'} ${vak} op ${dag}`;
    case 'subjectHours': return `${rule.factor >= 1 ? 'Meer' : 'Minder'} tijd voor ${vak}`;
    case 'blockMinutes': return `Blokken van ${rule.minutes} min`;
    case 'breakMinutes': return `Pauzes van ${rule.minutes} min`;
    case 'variety': return rule.value ? 'Meer afwisselen' : 'Per vak doorwerken';
    case 'peak': return `Leren in de ${rule.value === 'morning' ? 'ochtend' : rule.value === 'afternoon' ? 'middag' : 'avond'}`;
    case 'noWeekend': return 'Geen weekend';
    default: return '';
  }
}

// Zet één regel van de AI om in een regel die de app vertrouwt, of null.
function validateRule(raw, allowedSubjects, subjectNames) {
  if (!raw || typeof raw !== 'object') return null;
  const kind = String(raw.soort || '');
  if (!KINDS.includes(kind)) return null;

  const day = Number.isInteger(raw.dag) && raw.dag >= 0 && raw.dag <= 6 ? raw.dag : null;
  const subject = allowedSubjects.includes(String(raw.vak)) ? String(raw.vak) : null;
  let out = null;

  if (kind === 'noWeekend') out = { kind };
  else if (kind === 'blockDay' && day != null) out = { kind, day };
  else if (kind === 'dayHours' && day != null) {
    const hours = num(raw.uren, 0, 16);
    if (hours != null) out = { kind, day, hours: Math.round(hours * 2) / 2 };
  } else if (kind === 'subjectDay' && day != null && subject) {
    const mode = raw.modus === 'prefer' ? 'prefer' : 'avoid';
    out = { kind, day, subject, mode };
  } else if (kind === 'subjectHours' && subject) {
    const factor = num(raw.factor, 0.5, 2);
    if (factor != null) out = { kind, subject, factor: Math.round(factor * 100) / 100 };
  } else if (kind === 'blockMinutes') {
    const minutes = num(raw.minuten, 15, 180);
    if (minutes != null) out = { kind, minutes: Math.round(minutes) };
  } else if (kind === 'breakMinutes') {
    const minutes = num(raw.minuten, 0, 60);
    if (minutes != null) out = { kind, minutes: Math.round(minutes) };
  } else if (kind === 'variety') {
    out = { kind, value: raw.waarde === true || raw.value === true };
  } else if (kind === 'peak' && PEAKS.includes(String(raw.moment))) {
    out = { kind, value: String(raw.moment) };
  }

  if (!out) return null;
  // Het label dat als chipje in de app komt maken we zélf, nooit de AI.
  out.text = ruleText(out, subjectNames);
  return out.text ? out : null;
}

export async function onRequest({ request, env }) {
  if (request.method !== 'POST') {
    return fout('Alleen POST.', 405);
  }
  // Alleen onze eigen site mag dit endpoint gebruiken.
  const origin = request.headers.get('Origin');
  if (origin) {
    try {
      if (new URL(origin).host !== new URL(request.url).host) {
        return fout('Verzoek vanaf een andere site is niet toegestaan.', 403);
      }
    } catch (e) {
      return fout('Ongeldige Origin.', 403);
    }
  }
  if (!env || !env.ANTHROPIC_API_KEY) {
    return fout('De AI-functie is nog niet ingesteld op deze site. De stuurbalk werkt gewoon zonder.', 503);
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return fout('Ongeldig verzoek.', 400);
  }

  const mode = body && body.mode === 'tune' ? 'tune' : 'steer';
  const text = clean(body && body.text, mode === 'tune' ? MAX_TEXT_TUNE : MAX_TEXT);
  if (!text) return fout('Typ eerst wat je anders wilt.', 400);

  const subjectList = (Array.isArray(body.subjects) ? body.subjects : [])
    .slice(0, MAX_SUBJECTS)
    .map(s => ({ key: clean(s && s.key, 40), name: clean(s && s.name, 40) }))
    .filter(s => s.key && s.name);
  const allowedSubjects = subjectList.map(s => s.key);
  const subjectNames = {};
  subjectList.forEach(s => { subjectNames[s.key] = s.name; });

  let upstream;
  try {
    upstream = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        // Wijst een veiligheidsfilter het verzoek af, dan probeert de API het
        // automatisch op een ander model in plaats van niets terug te geven.
        'anthropic-beta': 'server-side-fallback-2026-07-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 16000,
        output_config: { effort: 'medium' },
        fallbacks: 'default',
        system: systemPrompt(subjectList, mode),
        tools: [TOOL],
        tool_choice: { type: 'auto' },
        messages: [{ role: 'user', content: text }],
      }),
    });
  } catch (e) {
    return fout('Kon de AI niet bereiken. Probeer het straks nog eens.', 502);
  }

  if (!upstream.ok) {
    // Nooit de fouttekst van de API doorgeven: die kan interne details bevatten.
    const status = upstream.status === 429 ? 429 : 502;
    return fout(upstream.status === 429
      ? 'De AI is even te druk. Probeer het over een minuutje nog eens.'
      : 'De AI gaf een fout. Probeer het straks nog eens.', status);
  }

  let data;
  try {
    data = await upstream.json();
  } catch (e) {
    return fout('Onverwacht antwoord van de AI.', 502);
  }

  // Een veiligheidsfilter kan het verzoek afwijzen; dan is er geen inhoud.
  if (data.stop_reason === 'refusal') {
    return fout('De AI wilde hier niet op antwoorden. Probeer het anders te formuleren.', 422);
  }

  const call = (Array.isArray(data.content) ? data.content : []).find(b => b && b.type === 'tool_use');
  const input = (call && call.input) || {};
  const rules = (Array.isArray(input.regels) ? input.regels : [])
    .slice(0, 20)
    .map(r => validateRule(r, allowedSubjects, subjectNames))
    .filter(Boolean);

  const reply = clean(input.uitleg, 160) ||
    (rules.length ? 'Schema bijgewerkt.' : 'Hier kon ik geen aanpassing van maken.');

  return new Response(JSON.stringify({ rules, reply }), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

function fout(bericht, status) {
  return new Response(bericht, {
    status,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}
