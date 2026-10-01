// ============================================================
// SchoolPlanner — Dummy Data
// ============================================================

const today = new Date();
const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon ... 6=Sat

function daysFromNow(n) {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return d;
}

function formatDate(date) {
  const days = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];
  const months = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
}

function formatDateShort(date) {
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Goedemorgen';
  if (hour < 18) return 'Goedemiddag';
  return 'Goedenavond';
}

// --- Subjects (catalogus) ---
// 'levels' geeft aan op welk examenniveau het vak bestaat (vmbo/havo/vwo).
// De volledige catalogus blijft beschikbaar voor opzoeken; via je instellingen
// kies je zelf welke vakken jij hebt (appSettings.mySubjects).
const subjects = {
  nederlands:   { name: 'Nederlands',   color: '#EF4444', light: '#FEE2E2', teacher: 'Mevr. Jansen',   icon: '📖', levels: ['vmbo','havo','vwo'] },
  engels:       { name: 'Engels',       color: '#8B5CF6', light: '#EDE9FE', teacher: 'Dhr. Williams',   icon: '🇬🇧', levels: ['vmbo','havo','vwo'] },
  frans:        { name: 'Frans',        color: '#6366F1', light: '#E0E7FF', teacher: '',                icon: '🇫🇷', levels: ['vmbo','havo','vwo'] },
  duits:        { name: 'Duits',        color: '#0EA5E9', light: '#E0F2FE', teacher: '',                icon: '🇩🇪', levels: ['vmbo','havo','vwo'] },
  spaans:       { name: 'Spaans',       color: '#F43F5E', light: '#FFE4E6', teacher: '',                icon: '🇪🇸', levels: ['havo','vwo'] },
  latijn:       { name: 'Latijn',       color: '#B45309', light: '#FEF3C7', teacher: '',                icon: '🏺', levels: ['gymnasium'] },
  grieks:       { name: 'Grieks',       color: '#92400E', light: '#FDE68A', teacher: '',                icon: '📜', levels: ['gymnasium'] },

  wiskunde:     { name: 'Wiskunde',     color: '#3B82F6', light: '#DBEAFE', teacher: 'Dhr. Bakker',    icon: '📐', levels: ['vmbo'] },
  wiskundea:    { name: 'Wiskunde A',   color: '#2563EB', light: '#DBEAFE', teacher: '',                icon: '📈', levels: ['havo','vwo'] },
  wiskundeb:    { name: 'Wiskunde B',   color: '#1D4ED8', light: '#DBEAFE', teacher: '',                icon: '📐', levels: ['havo','vwo'] },
  wiskundec:    { name: 'Wiskunde C',   color: '#60A5FA', light: '#DBEAFE', teacher: '',                icon: '📉', levels: ['vwo'] },
  wiskunded:    { name: 'Wiskunde D',   color: '#1E40AF', light: '#DBEAFE', teacher: '',                icon: '➗', levels: ['havo','vwo'] },

  natuurkunde:  { name: 'Natuurkunde',  color: '#F59E0B', light: '#FEF3C7', teacher: 'Mevr. de Boer',  icon: '⚡', levels: ['havo','vwo'] },
  scheikunde:   { name: 'Scheikunde',   color: '#EC4899', light: '#FCE7F3', teacher: 'Dhr. van Dijk',  icon: '🧪', levels: ['havo','vwo'] },
  nask:         { name: 'NaSk',         color: '#D97706', light: '#FEF3C7', teacher: '',                icon: '⚗️', levels: ['vmbo'] },
  biologie:     { name: 'Biologie',     color: '#06B6D4', light: '#CFFAFE', teacher: 'Mevr. Smit',     icon: '🧬', levels: ['vmbo','havo','vwo'] },
  nlt:          { name: 'NLT',          color: '#0D9488', light: '#CCFBF1', teacher: '',                icon: '🔬', levels: ['havo','vwo'] },

  geschiedenis: { name: 'Geschiedenis', color: '#10B981', light: '#D1FAE5', teacher: 'Dhr. Vermeer',    icon: '🏛️', levels: ['vmbo','havo','vwo'] },
  aardrijkskunde:{name: 'Aardrijkskunde',color:'#14B8A6', light: '#CCFBF1', teacher: '',                icon: '🌍', levels: ['vmbo','havo','vwo'] },
  economie:     { name: 'Economie',     color: '#F97316', light: '#FFEDD5', teacher: 'Mevr. de Groot', icon: '📊', levels: ['vmbo','havo','vwo'] },
  bedrijfseconomie:{name:'Bedrijfseconomie',color:'#EA580C',light:'#FFEDD5',teacher:'',                icon: '💼', levels: ['havo','vwo'] },
  maatschappijleer:{name:'Maatschappijleer',color:'#A855F7',light:'#F3E8FF',teacher:'',                icon: '👥', levels: ['vmbo','havo','vwo'] },
  maatschappijwetenschappen:{name:'Maatschappijwetensch.',color:'#9333EA',light:'#F3E8FF',teacher:'', icon: '🗳️', levels: ['havo','vwo'] },
  filosofie:    { name: 'Filosofie',    color: '#7C3AED', light: '#EDE9FE', teacher: '',                icon: '🤔', levels: ['havo','vwo'] },
  godsdienst:   { name: 'Godsdienst/Levbesch.', color: '#6B7280', light: '#F3F4F6', teacher: '',       icon: '✝️', levels: ['vmbo','havo','vwo'] },

  informatica:  { name: 'Informatica',  color: '#475569', light: '#E2E8F0', teacher: '',                icon: '💻', levels: ['vmbo','havo','vwo'] },
  ckv:          { name: 'CKV',          color: '#DB2777', light: '#FCE7F3', teacher: '',                icon: '🎭', levels: ['havo','vwo'] },
  kunst:        { name: 'Kunst/Tekenen',color: '#EC4899', light: '#FCE7F3', teacher: '',                icon: '🎨', levels: ['vmbo','havo','vwo'] },
  muziek:       { name: 'Muziek',       color: '#F472B6', light: '#FCE7F3', teacher: '',                icon: '🎵', levels: ['vmbo','havo','vwo'] },
  techniek:     { name: 'Techniek',     color: '#64748B', light: '#E2E8F0', teacher: '',                icon: '🔧', levels: ['vmbo'] },
  lo:           { name: 'Lichamelijke opv.', color: '#22C55E', light: '#DCFCE7', teacher: '',           icon: '🏃', levels: ['vmbo','havo','vwo'] },
};

// Examenniveaus
const examLevels = {
  vmbo:      'VMBO',
  havo:      'HAVO',
  vwo:       'VWO',
  gymnasium: 'Gymnasium',
};

// Welke vakken bestaan op een bepaald niveau?
// Gymnasium = alles van vwo, plus de gymnasium-only vakken (Latijn/Grieks).
function subjectsForLevel(level) {
  return Object.entries(subjects)
    .filter(([, s]) => {
      if (!s.levels) return true;
      if (level === 'gymnasium') return s.levels.includes('vwo') || s.levels.includes('gymnasium');
      return s.levels.includes(level);
    })
    .map(([key]) => key);
}

// --- Vakcategorieën (voor een overzichtelijke keuze) ---
const subjectCategories = {
  nederlands: 'Talen', engels: 'Talen', frans: 'Talen', duits: 'Talen', spaans: 'Talen', latijn: 'Talen', grieks: 'Talen',
  wiskunde: 'Exacte vakken', wiskundea: 'Exacte vakken', wiskundeb: 'Exacte vakken', wiskundec: 'Exacte vakken', wiskunded: 'Exacte vakken',
  natuurkunde: 'Exacte vakken', scheikunde: 'Exacte vakken', nask: 'Exacte vakken', biologie: 'Exacte vakken', nlt: 'Exacte vakken', informatica: 'Exacte vakken',
  geschiedenis: 'Mens & maatschappij', aardrijkskunde: 'Mens & maatschappij', economie: 'Mens & maatschappij', bedrijfseconomie: 'Mens & maatschappij',
  maatschappijleer: 'Mens & maatschappij', maatschappijwetenschappen: 'Mens & maatschappij', filosofie: 'Mens & maatschappij', godsdienst: 'Mens & maatschappij',
  ckv: 'Kunst & overig', kunst: 'Kunst & overig', muziek: 'Kunst & overig', techniek: 'Kunst & overig', lo: 'Kunst & overig',
};
const categoryOrder = ['Talen', 'Exacte vakken', 'Mens & maatschappij', 'Kunst & overig', 'Eigen vakken'];
function subjectCategory(key) {
  if (subjects[key] && subjects[key].custom) return 'Eigen vakken';
  return subjectCategories[key] || 'Kunst & overig';
}

// --- Eigen vakken (zelf toegevoegd) ---
function mergeCustomSubjects() {
  if (appSettings && appSettings.customSubjects) Object.assign(subjects, appSettings.customSubjects);
}

function addCustomSubject(name, icon) {
  if (!appSettings.customSubjects) appSettings.customSubjects = {};
  const palette = ['#0EA5E9', '#8B5CF6', '#EF4444', '#F59E0B', '#10B981', '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'];
  const color = palette[Object.keys(appSettings.customSubjects).length % palette.length];
  const key = 'custom_' + Date.now().toString(36);
  const entry = {
    name: String(name).slice(0, 30), color, light: color + '22',
    icon: icon || '📚', teacher: '', custom: true,
    levels: ['vmbo', 'havo', 'vwo', 'gymnasium'],
  };
  appSettings.customSubjects[key] = entry;
  subjects[key] = entry;
  saveSettings();
  return key;
}

// --- Vakkenpakketten (profielen) ---
// Nederlands en Engels horen er altijd bij (kernvakken).
const profileCore = ['nederlands', 'engels'];
// Vakken die in elk profiel gekozen kunnen worden (talen, kunst, algemeen)
const profileUniversal = [
  'frans', 'duits', 'spaans', 'latijn', 'grieks',
  'geschiedenis', 'aardrijkskunde', 'maatschappijleer', 'maatschappijwetenschappen',
  'filosofie', 'godsdienst', 'informatica', 'ckv', 'kunst', 'muziek', 'lo',
];
const subjectProfiles = {
  nt: { name: 'Natuur & Techniek',       icon: '🔬', mandatory: ['wiskundeb', 'natuurkunde', 'scheikunde'], allow: ['wiskunded', 'biologie', 'nlt'] },
  ng: { name: 'Natuur & Gezondheid',     icon: '🧬', mandatory: ['wiskundea', 'biologie', 'scheikunde'],    allow: ['wiskundeb', 'wiskunded', 'natuurkunde', 'nlt'] },
  em: { name: 'Economie & Maatschappij', icon: '📊', mandatory: ['wiskundea', 'economie', 'geschiedenis'],   allow: ['wiskundeb', 'bedrijfseconomie', 'natuurkunde'] },
  cm: { name: 'Cultuur & Maatschappij',  icon: '🎭', mandatory: ['wiskundea', 'geschiedenis'],               allow: ['wiskundec', 'economie', 'bedrijfseconomie'] },
};

// Vakken die je in dit profiel kúnt kiezen (verplicht + keuze + universeel)
function profileAllowed(profileKey, level) {
  const prof = subjectProfiles[profileKey];
  const avail = new Set(subjectsForLevel(level));
  const customKeys = Object.keys(appSettings.customSubjects || {});
  if (!prof) return [...avail];
  return [...new Set([...profileCore, ...prof.mandatory, ...prof.allow, ...profileUniversal, ...customKeys])]
    .filter(k => avail.has(k));
}

// Vakken die automatisch aangevinkt worden bij dit profiel (kern + verplicht)
function profileSubjects(profileKey, level) {
  const prof = subjectProfiles[profileKey];
  if (!prof) return [];
  const avail = new Set(subjectsForLevel(level));
  return [...new Set([...profileCore, ...prof.mandatory])].filter(k => avail.has(k));
}

// De vakken die JIJ hebt gekozen (valt terug op een standaardselectie).
function mySubjectKeys() {
  if (appSettings && Array.isArray(appSettings.mySubjects)) {
    return appSettings.mySubjects.filter(k => subjects[k]);
  }
  return ['nederlands','engels','wiskundeb','natuurkunde','scheikunde','biologie','geschiedenis','economie'].filter(k => subjects[k]);
}

// Entries (voor dropdowns), alfabetisch op naam.
function mySubjectEntries() {
  return mySubjectKeys()
    .map(k => [k, subjects[k]])
    .sort((a, b) => a[1].name.localeCompare(b[1].name, 'nl'));
}

// --- Schedule (weekly timetable) ---
const defaultSchedule = {
  maandag: [
    { hour: 1, time: '08:30 - 09:20', subject: 'wiskunde',     room: 'A204' },
    { hour: 2, time: '09:20 - 10:10', subject: 'nederlands',   room: 'B112' },
    { hour: 3, time: '10:30 - 11:20', subject: 'engels',       room: 'C301' },
    { hour: 4, time: '11:20 - 12:10', subject: 'natuurkunde',  room: 'D105' },
    { hour: 6, time: '12:40 - 13:30', subject: 'geschiedenis', room: 'A108' },
  ],
  dinsdag: [
    { hour: 1, time: '08:30 - 09:20', subject: 'biologie',     room: 'D201' },
    { hour: 2, time: '09:20 - 10:10', subject: 'scheikunde',   room: 'D105' },
    { hour: 3, time: '10:30 - 11:20', subject: 'wiskunde',     room: 'A204' },
    { hour: 4, time: '11:20 - 12:10', subject: 'economie',     room: 'B205' },
    { hour: 5, time: '12:10 - 13:00', subject: 'nederlands',   room: 'B112' },
  ],
  woensdag: [
    { hour: 1, time: '08:30 - 09:20', subject: 'engels',       room: 'C301' },
    { hour: 2, time: '09:20 - 10:10', subject: 'natuurkunde',  room: 'D105' },
    { hour: 3, time: '10:30 - 11:20', subject: 'geschiedenis', room: 'A108' },
    { hour: 4, time: '11:20 - 12:10', subject: 'biologie',     room: 'D201' },
  ],
  donderdag: [
    { hour: 1, time: '08:30 - 09:20', subject: 'scheikunde',   room: 'D105' },
    { hour: 2, time: '09:20 - 10:10', subject: 'economie',     room: 'B205' },
    { hour: 3, time: '10:30 - 11:20', subject: 'wiskunde',     room: 'A204' },
    { hour: 5, time: '12:10 - 13:00', subject: 'engels',       room: 'C301' },
    { hour: 6, time: '12:40 - 13:30', subject: 'nederlands',   room: 'B112' },
    { hour: 7, time: '13:30 - 14:20', subject: 'natuurkunde',  room: 'D105' },
  ],
  vrijdag: [
    { hour: 1, time: '08:30 - 09:20', subject: 'geschiedenis', room: 'A108' },
    { hour: 2, time: '09:20 - 10:10', subject: 'biologie',     room: 'D201' },
    { hour: 3, time: '10:30 - 11:20', subject: 'economie',     room: 'B205' },
    { hour: 4, time: '11:20 - 12:10', subject: 'scheikunde',   room: 'D105' },
  ],
};

let schedule = JSON.parse(JSON.stringify(defaultSchedule));

function loadSchedule() {
  const saved = localStorage.getItem('sp_schedule');
  if (saved) {
    try { schedule = JSON.parse(saved); } catch(e) {}
  }
}

function saveSchedule() {
  localStorage.setItem('sp_schedule', JSON.stringify(schedule));
}

const dayNames = ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag'];

function getTodaySchedule() {
  const jsDay = today.getDay(); // 0=Sun ... 6=Sat
  if (jsDay === 0 || jsDay === 6) return schedule.maandag; // weekend → show monday
  return schedule[dayNames[jsDay - 1]] || [];
}

// --- Homework ---
let homework = [
  { id: 1,  subject: 'wiskunde',     title: 'Hoofdstuk 5 opgaven 1-15',           due: daysFromNow(0), done: false },
  { id: 2,  subject: 'nederlands',   title: 'Boekverslag "Turks Fruit"',          due: daysFromNow(0), done: false },
  { id: 3,  subject: 'engels',       title: 'Vocabulary Unit 8 leren',            due: daysFromNow(1), done: false },
  { id: 4,  subject: 'natuurkunde',  title: 'Practicum verslag schrijven',        due: daysFromNow(1), done: true },
  { id: 5,  subject: 'geschiedenis', title: 'Samenvatting Koude Oorlog',          due: daysFromNow(2), done: false },
  { id: 6,  subject: 'biologie',     title: 'Paragraaf 3.4 en 3.5 bestuderen',   due: daysFromNow(3), done: false },
  { id: 7,  subject: 'scheikunde',   title: 'Opgaven mol berekeningen',           due: daysFromNow(3), done: true },
  { id: 8,  subject: 'economie',     title: 'Artikel analyse schrijven',          due: daysFromNow(5), done: false },
  { id: 9,  subject: 'wiskunde',     title: 'Oefentoets algebra',                due: daysFromNow(6), done: false },
  { id: 10, subject: 'engels',       title: 'Essay "Climate Change" (500 words)', due: daysFromNow(7), done: false },
];

function isDemoCleared() {
  return localStorage.getItem('sp_demo_cleared') === 'true';
}

function loadHomework() {
  const saved = localStorage.getItem('sp_homework');
  if (isDemoCleared()) {
    // Voorbeelddata gewist: alleen je eigen items laden
    homework = [];
    if (saved) {
      try {
        JSON.parse(saved).forEach(item => {
          item.due = new Date(item.due);
          homework.push(item);
        });
      } catch(e) {}
    }
    return;
  }
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Merge saved done-states with current homework
      homework.forEach(hw => {
        const s = parsed.find(p => p.id === hw.id);
        if (s) hw.done = s.done;
      });
      // Add any user-added items
      parsed.filter(p => p.id > 100).forEach(item => {
        if (!homework.some(h => h.id === item.id)) {
          item.due = new Date(item.due);
          homework.push(item);
        }
      });
    } catch(e) {}
  }
}

function saveHomework() {
  localStorage.setItem('sp_homework', JSON.stringify(homework.map(h => ({
    id: h.id, done: h.done, subject: h.subject, title: h.title, due: h.due
  }))));
}

// --- Tests ---
let tests = [
  { id: 1, subject: 'wiskunde',     title: 'Toets Hoofdstuk 5 — Algebra',       date: daysFromNow(2),  chapter: 'H5' },
  { id: 2, subject: 'natuurkunde',  title: 'Proefwerk Krachten & Beweging',      date: daysFromNow(4),  chapter: 'H3-4' },
  { id: 3, subject: 'engels',       title: 'Vocabulary Test Unit 7-8',           date: daysFromNow(5),  chapter: 'U7-8' },
  { id: 4, subject: 'geschiedenis', title: 'SO Koude Oorlog',                   date: daysFromNow(7),  chapter: 'H6' },
  { id: 5, subject: 'scheikunde',   title: 'Proefwerk Mol berekeningen',        date: daysFromNow(9),  chapter: 'H4' },
  { id: 6, subject: 'biologie',     title: 'Toets Evolutie',                    date: daysFromNow(12), chapter: 'H7' },
  { id: 7, subject: 'economie',     title: 'Proefwerk Marktvormen',             date: daysFromNow(14), chapter: 'H5-6' },
  { id: 8, subject: 'nederlands',   title: 'Literatuurtoets Periode 3',         date: daysFromNow(18), chapter: 'Lit.' },
];

function loadTests() {
  const saved = localStorage.getItem('sp_tests');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      parsed.forEach(t => { t.date = new Date(t.date); });
      tests = parsed;
    } catch(e) {}
  }
}

function saveTests() {
  localStorage.setItem('sp_tests', JSON.stringify(tests));
}

// --- Grades ---
const defaultGrades = {
  wiskunde:     { grades: [7.2, 6.8, 8.1, 7.5, 6.9], descriptions: ['Toets H1', 'SO H2', 'Proefwerk H3', 'Toets H4', 'SO H5'] },
  nederlands:   { grades: [6.5, 7.8, 7.0, 8.2],       descriptions: ['Opstel', 'Grammatica', 'Boekverslag', 'Spreekbeurt'] },
  engels:       { grades: [8.0, 7.5, 8.8, 7.2, 9.1], descriptions: ['Vocab T1', 'Writing', 'Vocab T2', 'Reading', 'Speaking'] },
  natuurkunde:  { grades: [6.2, 5.8, 7.4, 6.9],       descriptions: ['Toets H1', 'Practicum', 'Proefwerk H2-3', 'SO H4'] },
  geschiedenis: { grades: [7.8, 8.5, 6.7],             descriptions: ['Toets WO2', 'Werkstuk', 'SO Koude Oorlog'] },
  biologie:     { grades: [7.1, 6.4, 8.0, 7.3],       descriptions: ['Toets Cel', 'Practicum', 'Proefwerk Ecologie', 'SO Evolutie'] },
  scheikunde:   { grades: [5.9, 6.3, 7.1, 6.0],       descriptions: ['Toets Atoom', 'SO Reacties', 'Proefwerk H3', 'Practicum'] },
  economie:     { grades: [7.5, 8.0, 7.8],             descriptions: ['Toets Markt', 'Werkstuk', 'SO Conjunctuur'] },
};

let grades = JSON.parse(JSON.stringify(defaultGrades));

function loadGrades() {
  const saved = localStorage.getItem('sp_grades');
  if (saved) {
    try { grades = JSON.parse(saved); } catch(e) { grades = {}; }
  } else {
    grades = isDemoCleared() ? {} : JSON.parse(JSON.stringify(defaultGrades));
  }
  // Migratie: zorg dat elk vak een wegingen-lijst heeft (standaard 1)
  Object.values(grades).forEach(d => {
    if (!Array.isArray(d.weights)) d.weights = [];
    while (d.weights.length < d.grades.length) d.weights.push(1);
  });
}

// Som en totaalgewicht van één vak (voor berekeningen)
function gradeTotals(subjectId) {
  const d = grades[subjectId];
  let sum = 0, totalWeight = 0;
  if (d) d.grades.forEach((g, i) => {
    const w = (d.weights && d.weights[i]) || 1;
    sum += g * w;
    totalWeight += w;
  });
  return { sum, totalWeight };
}

// Welk cijfer moet je halen (bij gegeven weging) om op een doelgemiddelde te komen?
function requiredGradeFor(subjectId, target, weight) {
  const { sum, totalWeight } = gradeTotals(subjectId);
  return (target * (totalWeight + weight) - sum) / weight;
}

// Gewogen gemiddelde van één vak
function getWeightedAverage(data) {
  let sum = 0, tw = 0;
  data.grades.forEach((g, i) => {
    const w = (data.weights && data.weights[i]) || 1;
    sum += g * w;
    tw += w;
  });
  return tw > 0 ? (sum / tw).toFixed(1) : '-';
}

function saveGrades() {
  localStorage.setItem('sp_grades', JSON.stringify(grades));
}

function getAverage(arr) {
  if (!arr.length) return '-';
  return (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1);
}

function getOverallAverage() {
  const allGrades = Object.values(grades).flatMap(s => s.grades);
  return getAverage(allGrades);
}

// --- Cijfers plakken uit Magister ---
// Magister gebruikt vak-afkortingen; deze map vertaalt ze naar onze vakken.
const magisterSubjectMap = {
  ne: 'nederlands', netl: 'nederlands', nederlands: 'nederlands',
  en: 'engels', entl: 'engels', engels: 'engels',
  fa: 'frans', fatl: 'frans', frans: 'frans',
  du: 'duits', dutl: 'duits', duits: 'duits',
  sp: 'spaans', sptl: 'spaans', spaans: 'spaans',
  la: 'latijn', lakc: 'latijn', latl: 'latijn', latijn: 'latijn',
  gr: 'grieks', grkc: 'grieks', grtl: 'grieks', grieks: 'grieks',
  wi: 'wiskunde', wis: 'wiskunde', wiskunde: 'wiskunde',
  wa: 'wiskundea', wisa: 'wiskundea', 'wiskunde a': 'wiskundea',
  wb: 'wiskundeb', wisb: 'wiskundeb', 'wiskunde b': 'wiskundeb',
  wc: 'wiskundec', wisc: 'wiskundec', 'wiskunde c': 'wiskundec',
  wd: 'wiskunded', wisd: 'wiskunded', 'wiskunde d': 'wiskunded',
  na: 'natuurkunde', nat: 'natuurkunde', natuurkunde: 'natuurkunde',
  sk: 'scheikunde', schk: 'scheikunde', scheikunde: 'scheikunde',
  nask: 'nask', nask1: 'nask', nask2: 'nask',
  bi: 'biologie', bio: 'biologie', biol: 'biologie', biologie: 'biologie',
  nlt: 'nlt',
  gs: 'geschiedenis', ges: 'geschiedenis', geschiedenis: 'geschiedenis',
  ak: 'aardrijkskunde', aardrijkskunde: 'aardrijkskunde',
  ec: 'economie', eco: 'economie', econ: 'economie', economie: 'economie',
  beco: 'bedrijfseconomie', be: 'bedrijfseconomie', bedrijfseconomie: 'bedrijfseconomie',
  ma: 'maatschappijleer', maat: 'maatschappijleer', maatschappijleer: 'maatschappijleer',
  maw: 'maatschappijwetenschappen', mw: 'maatschappijwetenschappen',
  fi: 'filosofie', fil: 'filosofie', filosofie: 'filosofie',
  gd: 'godsdienst', gl: 'godsdienst', lv: 'godsdienst', godsdienst: 'godsdienst',
  in: 'informatica', inf: 'informatica', informatica: 'informatica',
  ckv: 'ckv', kv: 'ckv',
  te: 'kunst', kubv: 'kunst', bte: 'kunst', tekenen: 'kunst', kunst: 'kunst',
  mu: 'muziek', kumu: 'muziek', muziek: 'muziek',
  tn: 'techniek', tech: 'techniek', techniek: 'techniek',
  lo: 'lo', gym: 'lo',
};

// Herkent vak + cijfer(s) in geplakte Magister-tekst. Elke regel kan zijn:
// "ne  7,5"  /  "Nederlands  Boekverslag  7.5"  /  tab-gescheiden tabelregels.
function parsePastedGrades(text) {
  const rows = [];
  const lines = String(text || '').split(/\r?\n/);
  let lastSubject = '';

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    const tokens = line.split(/\t+| {2,}|;/).map(t => t.trim()).filter(Boolean);

    // Vak zoeken (afkorting of volledige naam)
    let subject = '';
    const descParts = [];
    for (const tok of tokens) {
      const key = tok.toLowerCase();
      if (!subject && magisterSubjectMap[key]) { subject = magisterSubjectMap[key]; continue; }
      if (!subject) {
        const byName = Object.entries(subjects).find(([, s]) => s.name.toLowerCase() === key);
        if (byName) { subject = byName[0]; continue; }
      }
      descParts.push(tok);
    }
    if (subject) lastSubject = subject;
    else subject = lastSubject; // doorlopende regels onder hetzelfde vak

    // Cijfers zoeken: 1,0 t/m 10,0 (komma of punt). Voorkeur voor decimalen,
    // zodat wegingen (1, 2, 3) niet als cijfer worden gezien.
    const gradeTokens = [];
    const cleanDesc = [];
    for (const part of descParts) {
      const m = part.match(/^(10|[1-9])([.,]\d{1,2})?$/);
      if (m) gradeTokens.push({ raw: part, decimal: !!m[2], value: parseFloat(part.replace(',', '.')) });
      else cleanDesc.push(part);
    }
    let grade = null;
    let gradeToken = null;
    const decimals = gradeTokens.filter(g => g.decimal);
    if (decimals.length) { gradeToken = decimals[0]; grade = gradeToken.value; }
    else if (gradeTokens.length === 1) { gradeToken = gradeTokens[0]; grade = gradeToken.value; }

    // Weging: het eerste hele getal (1-10) dat níet het cijfer zelf is
    let weight = 1;
    const weightToken = gradeTokens.find(g => g !== gradeToken && !g.decimal && Number.isInteger(g.value) && g.value >= 1 && g.value <= 10);
    if (weightToken) weight = weightToken.value;

    if (grade != null && grade >= 1 && grade <= 10) {
      rows.push({
        subject: subject || '',
        desc: cleanDesc.join(' ').slice(0, 60) || 'Cijfer uit Magister',
        grade: Math.round(grade * 10) / 10,
        weight,
      });
    }
  }
  return rows;
}

// --- Lijst met opgaves plakken (huiswerk & planner-taken) ---
// Elke niet-lege regel wordt een losse opgave. Per regel herkennen we
// optioneel een vak (afkorting of naam aan het begin, bv. "wi H5 opg 1-15")
// en een tijdsduur aan het einde (bv. "... 2u" of "... 1,5 uur").
function detectSubjectKey(token) {
  const key = String(token || '').toLowerCase().replace(/[:.\-]+$/, '');
  if (magisterSubjectMap[key]) return magisterSubjectMap[key];
  const byName = Object.entries(subjects).find(([, s]) => s.name.toLowerCase() === key);
  return byName ? byName[0] : null;
}

function parsePastedItems(text) {
  const rows = [];
  for (const rawLine of String(text || '').split(/\r?\n/)) {
    // Lijsttekens en tabs opruimen
    let line = rawLine.replace(/\t+/g, ' ').replace(/^[\s•◦▪‣·–—*\->]+/, '').trim();
    if (!line) continue;

    // Vak aan het begin? Probeer eerste twee woorden ("wiskunde a") en dan het eerste
    let subject = null;
    const tokens = line.split(/\s+/);
    if (tokens.length >= 2) {
      const two = detectSubjectKey(tokens[0] + ' ' + tokens[1]);
      if (two) { subject = two; line = tokens.slice(2).join(' '); }
    }
    if (!subject && tokens.length >= 1) {
      const one = detectSubjectKey(tokens[0]);
      if (one && tokens.length > 1) { subject = one; line = tokens.slice(1).join(' '); }
    }

    // Duur aan het einde? bv. "2u", "1,5 uur", "(2 uur)"
    let hours = null;
    const m = line.match(/[\s(]*(\d+(?:[.,]\d+)?)\s*(?:u|uur)\)?\s*$/i);
    if (m) {
      hours = parseFloat(m[1].replace(',', '.'));
      line = line.slice(0, m.index).trim();
    }

    const title = line.replace(/[\s,;:]+$/, '').trim();
    if (title) rows.push({ subject, title: title.slice(0, 80), hours });
  }
  return rows;
}

// --- Magister-rooster via agenda-koppeling (iCal) ---
function getMagisterIcsUrl() {
  return localStorage.getItem('sp_magister_ics') || '';
}
function saveMagisterIcsUrl(url) {
  if (url) localStorage.setItem('sp_magister_ics', url);
  else localStorage.removeItem('sp_magister_ics');
}

// Eenvoudige iCal-parser: haalt VEVENTs met start, eind, titel en lokaal eruit.
function parseIcs(text) {
  // Regels die over meerdere regels doorlopen weer aan elkaar plakken
  const unfolded = String(text || '').replace(/\r?\n[ \t]/g, '');
  const events = [];
  let cur = null;
  for (const line of unfolded.split(/\r?\n/)) {
    if (line === 'BEGIN:VEVENT') { cur = {}; continue; }
    if (line === 'END:VEVENT') {
      if (cur && cur.start) {
        if (!cur.end) cur.end = cur.start;
        cur.allDay = !!cur.start._allDay;
        events.push(cur);
      }
      cur = null; continue;
    }
    if (!cur) continue;
    const idx = line.indexOf(':');
    if (idx < 0) continue;
    const keyPart = line.slice(0, idx);      // bv. DTSTART;TZID=Europe/Amsterdam
    const value = line.slice(idx + 1);
    const key = keyPart.split(';')[0].toUpperCase();
    if (key === 'DTSTART') cur.start = parseIcsDate(value);
    else if (key === 'DTEND') cur.end = parseIcsDate(value);
    else if (key === 'SUMMARY') cur.summary = value.replace(/\\,/g, ',').replace(/\\n/g, ' ').trim();
    else if (key === 'LOCATION') cur.location = value.replace(/\\,/g, ',').trim();
  }
  return events;
}

function parseIcsDate(v) {
  const m = String(v).match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z?)$/);
  if (m) {
    const [, y, mo, d, h, mi, s, z] = m;
    if (z === 'Z') return new Date(Date.UTC(+y, mo - 1, +d, +h, +mi, +s));
    return new Date(+y, mo - 1, +d, +h, +mi, +s);
  }
  // Hele-dag-afspraken: alleen een datum (VALUE=DATE)
  const md = String(v).match(/^(\d{4})(\d{2})(\d{2})$/);
  if (md) {
    const dt = new Date(+md[1], md[2] - 1, +md[3]);
    dt._allDay = true;
    return dt;
  }
  return null;
}

// Bouwt een week-rooster (maandag t/m vrijdag) uit agenda-items: voor elke
// weekdag pakken we de eerstvolgende datum vanaf vandaag en zetten de lessen
// van die dag om naar roosterregels.
function icsToWeekSchedule(events) {
  const result = { maandag: [], dinsdag: [], woensdag: [], donderdag: [], vrijdag: [] };
  const today0 = startOfDay(today);
  const pad = (n) => String(n).padStart(2, '0');

  dayNames.forEach((dayKey, i) => {
    const jsDay = i + 1; // ma=1 ... vr=5
    let target = null;
    for (let off = 0; off < 14; off++) {
      const d = addDays(today0, off);
      if (d.getDay() === jsDay) { target = d; break; }
    }
    if (!target) return;

    const dayEvents = events
      .filter(ev => ev.start && startOfDay(ev.start).getTime() === target.getTime())
      .sort((a, b) => a.start - b.start);

    result[dayKey] = dayEvents.map((ev, idx) => {
      const summary = ev.summary || 'Les';
      // Vak herkennen uit de titel (bv. "ne - 104 - JAN" of "Wiskunde A")
      const tokens = summary.split(/[\s\-–]+/).filter(Boolean);
      let subject = null;
      if (tokens.length >= 2) subject = detectSubjectKey(tokens[0] + ' ' + tokens[1]);
      if (!subject && tokens.length >= 1) subject = detectSubjectKey(tokens[0]);
      return {
        hour: idx + 1,
        time: `${pad(ev.start.getHours())}:${pad(ev.start.getMinutes())} - ${pad(ev.end.getHours())}:${pad(ev.end.getMinutes())}`,
        // Onbekend vak: titel als tekst overnemen, zonder HTML-tekens
        // (externe agenda-data mag nooit als opmaak in de app belanden).
        subject: subject || summary.replace(/[<>"'&]/g, '').slice(0, 30),
        room: ev.location || '',
      };
    });
  });
  return result;
}

// --- Gekoppelde agenda's (Google / Apple / Outlook via iCal-link) ---
let icalFeeds = [];          // [{ id, name, url, lastSync }]
let icalEventsCache = {};    // feedId -> [{ date, title, time, allDay }]

function loadIcalFeeds() {
  try { icalFeeds = JSON.parse(localStorage.getItem('sp_ical_feeds') || '[]'); } catch (e) { icalFeeds = []; }
  try { icalEventsCache = JSON.parse(localStorage.getItem('sp_ical_events') || '{}'); } catch (e) { icalEventsCache = {}; }
}

function saveIcalFeeds() {
  localStorage.setItem('sp_ical_feeds', JSON.stringify(icalFeeds));
  localStorage.setItem('sp_ical_events', JSON.stringify(icalEventsCache));
}

// Alle agenda-items uit gekoppelde kalenders, als agenda-events (alleen-lezen)
function icalAgendaEvents() {
  const out = [];
  icalFeeds.forEach(feed => {
    (icalEventsCache[feed.id] || []).forEach((ev, i) => {
      out.push({
        id: 'ical-' + feed.id + '-' + i,
        date: new Date(ev.date),
        title: ev.title,
        time: ev.time,
        type: 'ical',
        source: feed.name,
        readonly: true,
      });
    });
  });
  return out;
}

// Eigen events + gekoppelde agenda's samen (voor agenda en kalenders)
function allAgendaEvents() {
  return events.concat(icalAgendaEvents());
}

// Zet geparste iCal-events om naar compacte agenda-items (komende ~3 maanden)
function icalToAgendaItems(parsed) {
  const pad = (n) => String(n).padStart(2, '0');
  const min = addDays(startOfDay(today), -7);
  const max = addDays(startOfDay(today), 90);
  return parsed
    .filter(ev => ev.start >= min && ev.start <= max)
    .sort((a, b) => a.start - b.start)
    .slice(0, 400)
    .map(ev => ({
      date: ev.start.toISOString(),
      title: (ev.summary || 'Afspraak').slice(0, 80),
      time: ev.allDay ? 'Hele dag' : `${pad(ev.start.getHours())}:${pad(ev.start.getMinutes())} - ${pad(ev.end.getHours())}:${pad(ev.end.getMinutes())}`,
      allDay: !!ev.allDay,
    }));
}

// --- Voorbeelddata wissen ---
function clearDemoData() {
  homework = homework.filter(h => h.id > 100);
  tests = tests.filter(t => t.id > 100);
  events = events.filter(e => e.id > 100);
  todos = [];
  grades = {};
  localStorage.setItem('sp_demo_cleared', 'true');
  saveHomework(); saveTests(); saveEvents(); saveTodos(); saveGrades();
}

// --- Events (Agenda) ---
let events = [
  { id: 1,  date: daysFromNow(-1), title: 'Ouderavond',                   time: '19:00 - 21:00', type: 'school' },
  { id: 2,  date: daysFromNow(0),  title: 'Inleveren boekverslag',        time: '23:59',         type: 'deadline' },
  { id: 3,  date: daysFromNow(0),  title: 'Wiskundebijles',               time: '15:30 - 16:30', type: 'les' },
  { id: 4,  date: daysFromNow(1),  title: 'Sportdag',                     time: '09:00 - 15:00', type: 'school' },
  { id: 5,  date: daysFromNow(2),  title: 'Toets Wiskunde H5',            time: '10:30',         type: 'toets' },
  { id: 6,  date: daysFromNow(3),  title: 'Excursie Rijksmuseum',         time: '08:30 - 14:00', type: 'school' },
  { id: 7,  date: daysFromNow(4),  title: 'Proefwerk Natuurkunde',        time: '11:20',         type: 'toets' },
  { id: 8,  date: daysFromNow(5),  title: 'Mentoruur',                    time: '12:10 - 13:00', type: 'school' },
  { id: 9,  date: daysFromNow(6),  title: 'Deadline essay Engels',        time: '23:59',         type: 'deadline' },
  { id: 10, date: daysFromNow(7),  title: 'SO Geschiedenis',              time: '08:30',         type: 'toets' },
  { id: 11, date: daysFromNow(10), title: 'Voorjaarsvakantie begint',     time: 'Hele dag',      type: 'school' },
  { id: 12, date: daysFromNow(14), title: 'Proefwerk Economie',           time: '09:20',         type: 'toets' },
  { id: 13, date: daysFromNow(21), title: 'Rapportvergadering',           time: '14:00 - 16:00', type: 'school' },
  { id: 14, date: daysFromNow(28), title: 'Open dag school',              time: '10:00 - 14:00', type: 'school' },
];

function loadEvents() {
  const saved = localStorage.getItem('sp_events');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      parsed.forEach(e => { e.date = new Date(e.date); });
      events = parsed;
    } catch(e) {}
  }
}

function saveEvents() {
  localStorage.setItem('sp_events', JSON.stringify(events));
}

const eventTypeColors = {
  school:   { bg: '#DBEAFE', text: '#1E40AF', label: 'School' },
  deadline: { bg: '#FEE2E2', text: '#991B1B', label: 'Deadline' },
  toets:    { bg: '#FEF3C7', text: '#92400E', label: 'Toets' },
  les:      { bg: '#D1FAE5', text: '#065F46', label: 'Les' },
  ical:     { bg: '#E0E7FF', text: '#3730A3', label: 'Agenda' },
};

// --- Streak ---
function loadStreak() {
  const saved = localStorage.getItem('sp_streak');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      const lastDate = new Date(data.lastDate);
      const todayStr = today.toDateString();
      const yesterdayStr = daysFromNow(-1).toDateString();

      if (lastDate.toDateString() === todayStr) {
        return data.count;
      } else if (lastDate.toDateString() === yesterdayStr) {
        return data.count; // still active, not yet bumped today
      }
      return 0; // streak broken
    } catch(e) { return 0; }
  }
  return 0;
}

function updateStreak() {
  const saved = localStorage.getItem('sp_streak');
  let count = 1;
  if (saved) {
    try {
      const data = JSON.parse(saved);
      const lastDate = new Date(data.lastDate);
      const todayStr = today.toDateString();
      const yesterdayStr = daysFromNow(-1).toDateString();

      if (lastDate.toDateString() === todayStr) {
        return data.count;
      } else if (lastDate.toDateString() === yesterdayStr) {
        count = data.count + 1;
      }
    } catch(e) {}
  }
  localStorage.setItem('sp_streak', JSON.stringify({ lastDate: today.toISOString(), count }));
  return count;
}

// --- Todos (separate from homework) ---
let todos = [
  { id: 1, text: 'Wiskunde opgaven maken',      done: false },
  { id: 2, text: 'Boekverslag afmaken',          done: true },
  { id: 3, text: 'Engels woordjes oefenen',       done: false },
  { id: 4, text: 'Scheikunde samenvatting',       done: false },
  { id: 5, text: 'Geschiedenis leren H6',         done: false },
];

function loadTodos() {
  const saved = localStorage.getItem('sp_todos');
  if (saved) {
    try { todos = JSON.parse(saved); } catch(e) {}
  }
}

function saveTodos() {
  localStorage.setItem('sp_todos', JSON.stringify(todos));
}

// --- Connection states ---
let magistarConnected = localStorage.getItem('sp_magister_connected') === 'true';
let magistarAccount = JSON.parse(localStorage.getItem('sp_magister_account') || '{}');
let calendarConnections = JSON.parse(localStorage.getItem('sp_calendar_connections') || '{}');
let calendarAccounts = JSON.parse(localStorage.getItem('sp_calendar_accounts') || '{}');

function saveMagisterConnection(connected, account) {
  magistarConnected = connected;
  localStorage.setItem('sp_magister_connected', connected.toString());
  if (account) {
    magistarAccount = account;
    localStorage.setItem('sp_magister_account', JSON.stringify(account));
  }
  if (!connected) {
    magistarAccount = {};
    localStorage.removeItem('sp_magister_account');
  }
}

function saveCalendarConnections() {
  localStorage.setItem('sp_calendar_connections', JSON.stringify(calendarConnections));
  localStorage.setItem('sp_calendar_accounts', JSON.stringify(calendarAccounts));
}

// --- Settings ---
const defaultSettings = {
  lessonDuration: 50,
  startTime: '08:30',
  breakAfter: 2,
  breakDuration: 20,
  lunchAfter: 4,
  lunchDuration: 30,
  schoolName: 'Het Nieuwe Lyceum',
  userName: 'Emma de Vries',
  userEmail: 'emma@leerling.nl',
  userClass: '4 VWO',
  theme: 'light',
  notifications: true,
  weekendHidden: true,
  examLevel: 'vwo',
  mySubjects: ['nederlands','engels','wiskundeb','natuurkunde','scheikunde','biologie','geschiedenis','economie'],
};

let appSettings = { ...defaultSettings };

function loadSettings() {
  const saved = localStorage.getItem('sp_settings');
  if (saved) {
    try { appSettings = { ...defaultSettings, ...JSON.parse(saved) }; } catch(e) {}
  }
  mergeCustomSubjects();
}

function saveSettings() {
  localStorage.setItem('sp_settings', JSON.stringify(appSettings));
}

// Docent per vak: eigen instelling gaat vóór de catalogus-default
function subjectTeacher(key) {
  if (appSettings.teachers && appSettings.teachers[key]) return appSettings.teachers[key];
  return (subjects[key] && subjects[key].teacher) || '';
}

function updateTeacher(key, value) {
  if (!appSettings.teachers) appSettings.teachers = {};
  appSettings.teachers[key] = value.trim();
  saveSettings();
  if (typeof showToast === 'function') showToast('Opgeslagen ✓');
}

// Lesuur-tijden gegenereerd uit de roosterinstellingen (één bron van waarheid)
function lessonHourTimes() {
  const start = appSettings.startTime.split(':').map(Number);
  let m = start[0] * 60 + start[1];
  const out = {};
  for (let i = 1; i <= 8; i++) {
    out[i] = `${minToTime(m)} - ${minToTime(m + appSettings.lessonDuration)}`;
    m += appSettings.lessonDuration;
    if (i === appSettings.breakAfter) m += appSettings.breakDuration;
    else if (i === appSettings.lunchAfter) m += appSettings.lunchDuration;
  }
  return out;
}

// --- Plan (gratis/pro) ---
let userPlan = localStorage.getItem('sp_user_plan') || 'pro';

function setUserPlan(plan) {
  userPlan = plan;
  localStorage.setItem('sp_user_plan', plan);
}

// ============================================================
// --- Planner (route naar toetsweek & examen) ---
// Plan vooraf een toetsweek of examen: vul je beschikbare tijd en je
// taken (met geschatte duur) in, dan verdelen we het werk over je
// beschikbare dagen en zie je of je voor of achter op schema loopt.
// Je dagelijkse huiswerk en taken (todos) blijven daarnaast bestaan.
// ============================================================

// plan = {
//   id, type: 'toetsweek'|'examen', name,
//   examDate: ISO,                  // eerste toets / examen
//   readyDaysBefore: number,        // zoveel dagen van tevoren klaar willen zijn
//   defaultDailyHours: number,      // standaard beschikbare uren per dag
//   availability: { [dateKey]: hours },   // losse dag-overrides
//   tasks: [ { id, subject, title, hours, hoursDone, done } ]
// }
let plans = [];
let activePlanId = null;

function loadPlans() {
  const saved = localStorage.getItem('sp_plans');
  if (saved) {
    try { plans = JSON.parse(saved); } catch (e) { plans = []; }
  }
  // Migratie: oudere plannen hebben nog geen vaste startdatum
  let migrated = false;
  plans.forEach(p => {
    if (!p.startDate) { p.startDate = new Date().toISOString(); migrated = true; }
  });
  if (migrated) savePlans();
  const ap = localStorage.getItem('sp_active_plan');
  if (ap) activePlanId = parseInt(ap) || null;
}

function savePlans() {
  localStorage.setItem('sp_plans', JSON.stringify(plans));
  if (activePlanId != null) localStorage.setItem('sp_active_plan', String(activePlanId));
}

function getPlan(id) {
  return plans.find(p => p.id === id);
}

// --- Date helpers voor de planner ---
function startOfDay(d) {
  d = new Date(d);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function dateKey(d) {
  d = new Date(d);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function daysBetween(a, b) {
  return Math.round((startOfDay(b) - startOfDay(a)) / 86400000);
}
function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}
function fmtHours(h) {
  const rounded = Math.round(h * 10) / 10;
  const str = (Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(1)).replace('.', ',');
  return `${str} uur`;
}

// Tijd-helpers voor de tijdblokken
function timeToMin(t) { const [h, m] = t.split(':').map(Number); return h * 60 + m; }
function minToTime(m) { m = Math.round(m); return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(((m % 60) + 60) % 60).padStart(2, '0')}`; }
function slotHours(s) { return Math.max(0, timeToMin(s.end) - timeToMin(s.start)) / 60; }
function daySlots(plan, d) { const k = dateKey(d); return (plan.slots && plan.slots[k]) || []; }

// ============================================================
// --- Leervoorkeuren & stuurregels ---
// De antwoorden uit "Maak mijn planning" bepalen HOE je schema eruitziet:
// hoe lang je per blok werkt, of vakken afwisselen, wanneer je het scherpst
// bent en op welke dagen je niks kunt. Oudere plannen hebben dit niet; dan
// gelden de standaarden hieronder.
// ============================================================
const defaultPlanPrefs = {
  blockMinutes: 45,     // lengte van één leerblok
  breakMinutes: 10,     // pauze tussen twee blokken
  variety: true,        // nooit twee blokken hetzelfde vak achter elkaar
  peak: 'any',          // 'morning' | 'afternoon' | 'evening' | 'any'
  hardSubjects: [],     // vakken die extra tijd en je scherpste blokken krijgen
  blockedDays: [],      // weekdagen (0=zo ... 6=za) waarop je niet leert
};

// Starttijd voor dagen zonder eigen tijdblokken, op basis van je topmoment.
const peakStartTime = { morning: '09:00', afternoon: '14:00', evening: '19:00', any: '16:00' };

const peakLabels = {
  morning: 'ochtend', afternoon: 'middag', evening: 'avond', any: 'maakt niet uit',
};

function planPrefs(plan) {
  const raw = (plan && plan.prefs) || {};
  const p = { ...defaultPlanPrefs, ...raw };
  p.blockMinutes = Math.min(180, Math.max(15, Number(p.blockMinutes) || 45));
  p.breakMinutes = Math.min(60, Math.max(0, Number(p.breakMinutes) || 0));
  if (!peakStartTime[p.peak]) p.peak = 'any';
  p.hardSubjects = Array.isArray(p.hardSubjects) ? p.hardSubjects.slice() : [];
  p.blockedDays = Array.isArray(p.blockedDays) ? p.blockedDays.slice() : [];
  return p;
}

// --- Stuurregels (de stuurbalk onder je schema) ---
// Elke regel is een klein, gecontroleerd object. Vrije tekst wordt eerst
// omgezet naar zulke regels (lokaal of door de AI); het schema zelf wordt
// altijd door de code hieronder gebouwd, nooit door tekst van buiten.
const steerKinds = ['blockDay', 'dayHours', 'subjectDay', 'subjectHours', 'blockMinutes', 'breakMinutes', 'variety', 'peak', 'noWeekend'];

function steerList(plan) {
  return Array.isArray(plan && plan.steer) ? plan.steer : [];
}

// Voorkeuren + stuurregels samen: hiermee wordt het schema echt gebouwd.
function effectivePrefs(plan) {
  const p = planPrefs(plan);
  const block = (d) => { if (!p.blockedDays.includes(d)) p.blockedDays.push(d); };
  steerList(plan).forEach(r => {
    if (r.kind === 'blockMinutes' && r.minutes) p.blockMinutes = Math.min(180, Math.max(15, r.minutes));
    else if (r.kind === 'breakMinutes' && r.minutes != null) p.breakMinutes = Math.min(60, Math.max(0, r.minutes));
    else if (r.kind === 'variety') p.variety = !!r.value;
    else if (r.kind === 'peak' && peakStartTime[r.value]) p.peak = r.value;
    else if (r.kind === 'blockDay' && r.day != null) block(r.day);
    else if (r.kind === 'noWeekend') { block(0); block(6); }
  });
  return p;
}

// Mag dit vak op deze weekdag ingepland worden?
function steerAllowsSubject(plan, subject, jsDay) {
  return !steerList(plan).some(r =>
    r.kind === 'subjectDay' && r.mode === 'avoid' && r.subject === subject && r.day === jsDay);
}

// Krijgt dit vak voorrang op deze weekdag?
function steerPrefersSubject(plan, subject, jsDay) {
  return steerList(plan).some(r =>
    r.kind === 'subjectDay' && r.mode === 'prefer' && r.subject === subject && r.day === jsDay);
}

// De relevante datum = vroegste examen/toets uit het rooster, anders het losse veld.
function planExamDate(plan) {
  if (plan.exams && plan.exams.length) {
    return startOfDay(new Date(Math.min(...plan.exams.map(e => +new Date(e.date)))));
  }
  return startOfDay(new Date(plan.examDate));
}

// Houd het losse examDate-veld gelijk aan de vroegste roosterdatum.
function syncPlanExamDate(plan) {
  if (plan.exams && plan.exams.length) {
    plan.examDate = planExamDate(plan).toISOString();
  }
}

// De LAATSTE toets/examen — bepaalt hoe ver de planning doorloopt (door de hele
// toetsweek heen), terwijl planExamDate (de vroegste) "je volgende toets" blijft.
function planLastExamDate(plan) {
  if (plan.exams && plan.exams.length) {
    return startOfDay(new Date(Math.max(...plan.exams.map(e => +new Date(e.date)))));
  }
  return startOfDay(new Date(plan.examDate));
}

function planDeadline(plan) {
  // Tot wanneer er nog gepland wordt: tot je laatste toets (minus 'readyDaysBefore'
  // als dat nog ná vandaag valt). Zo loopt de planner gewoon door de toetsweek heen.
  const last = planLastExamDate(plan);
  const ready = startOfDay(addDays(last, -(plan.readyDaysBefore || 0)));
  const today0 = startOfDay(today);
  return ready < today0 ? last : ready;
}

// Is de toets/het examen van dit vak al geweest? Dan hoeft er niks meer voor
// gedaan te worden — geen studietijd meer, en het telt niet als achterstand.
// Mét tijd ingevuld → het vak valt weg ná die tijd op de toetsdag zelf.
// Zónder tijd → pas de dag erna.
function subjectTestPassed(plan, subject) {
  if (!plan.exams || !plan.exams.length) return false;
  const exams = plan.exams.filter(e => e.subject === subject);
  if (!exams.length) return false;
  // De laatste toets van dit vak bepaalt of het vak klaar is.
  const last = exams.reduce((a, b) => (+new Date(a.date) >= +new Date(b.date) ? a : b));
  const d = new Date(last.date);
  if (last.time && /^\d{1,2}:\d{2}$/.test(last.time)) {
    const [h, m] = last.time.split(':').map(Number);
    const moment = new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m);
    return Date.now() > +moment; // na de ingevulde tijd
  }
  return +startOfDay(d) < +startOfDay(today); // geen tijd → de dag erna
}

function availabilityFor(plan, d) {
  // Heb je voor deze dag specifieke tijdblokken ingevuld? Dan tellen die uren.
  const sl = daySlots(plan, d);
  if (sl.length) return sl.reduce((s, b) => s + slotHours(b), 0);
  const jsDay = new Date(d).getDay();
  const key = dateKey(d);
  // Voor één losse dag zelf uren ingevuld? Die gaan vóór de weekdag-regels.
  let hours = (plan.availability && plan.availability[key] != null)
    ? plan.availability[key]
    : (effectivePrefs(plan).blockedDays.includes(jsDay)
        ? 0
        : (plan.defaultDailyHours != null ? plan.defaultDailyHours : 2));
  // Stuurregel "maximaal X uur op maandag" verlaagt het dagbudget.
  steerList(plan).forEach(r => {
    if (r.kind === 'dayHours' && r.day === jsDay && r.hours != null) hours = Math.min(hours, Math.max(0, r.hours));
  });
  return hours;
}

// Eigen deadline per taak: de dag vóór de toets van dat vak (als die in het
// rooster staat), anders de algemene plan-deadline.
function taskDue(plan, task, deadline) {
  if (plan.exams && plan.exams.length) {
    const examDates = plan.exams
      .filter(e => e.subject === task.subject)
      .map(e => startOfDay(new Date(e.date)))
      .sort((a, b) => a - b);
    if (examDates.length) {
      // Standaard: klaar de dag vóór de toets. Met 'studyOnExamDay' mag je
      // ook op de toetsdag zelf nog leren (tot en met die dag).
      const offset = plan.studyOnExamDay ? 0 : -1;
      const d = startOfDay(addDays(examDates[0], offset));
      return d < deadline ? d : deadline;
    }
  }
  return deadline;
}

// ============================================================
// --- De stuurbalk: vrije tekst omzetten naar stuurregels ---
// "minder wiskunde op maandag", "geen weekend", "blokken van 25 minuten".
// Deze parser werkt altijd en offline. Pro-gebruikers kunnen de tekst
// daarnaast door de AI laten begrijpen (zie steerWithAI in js/pages.js);
// die geeft exact dezelfde soort regels terug, zodat het schema altijd
// door onze eigen code gebouwd wordt.
// ============================================================
const steerDayNames = {
  zondag: 0, zo: 0, maandag: 1, ma: 1, dinsdag: 2, di: 2, woensdag: 3, wo: 3,
  donderdag: 4, do: 4, vrijdag: 5, vr: 5, zaterdag: 6, za: 6,
};
const dayLabelsNl = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];

// Welk vak bedoel je? Eerst de vakken die in dit plan zitten, langste naam
// eerst ("wiskunde b" vóór "wiskunde"), daarna de afkortingen als los woord.
function steerFindSubject(text, plan) {
  const t = ' ' + String(text).toLowerCase() + ' ';
  const keys = new Set();
  (plan.exams || []).forEach(e => keys.add(e.subject));
  (plan.tasks || []).forEach(x => keys.add(x.subject));
  const candidates = keys.size ? [...keys] : Object.keys(subjects);
  const byName = candidates
    .filter(k => subjects[k])
    .map(k => ({ key: k, name: subjects[k].name.toLowerCase() }))
    .sort((a, b) => b.name.length - a.name.length);
  for (const c of byName) if (t.includes(c.name)) return c.key;
  for (const [abbr, key] of Object.entries(magisterSubjectMap)) {
    if (!candidates.includes(key)) continue;
    if (new RegExp('\\b' + abbr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').test(t)) return key;
  }
  return null;
}

function parseSteerText(text, plan) {
  const raw = String(text || '').toLowerCase().trim();
  if (!raw) return [];
  const rules = [];
  const add = (r) => { if (!rules.some(x => x.kind === r.kind && x.day === r.day && x.subject === r.subject)) rules.push(r); };

  const negative = /\b(geen|niet|nooit|zonder)\b/.test(raw);
  const less = /\b(minder|korter|kortere|lichter|rustiger)\b/.test(raw);
  const more = /\b(meer|langer|langere|extra|zwaarder)\b/.test(raw);

  const days = [];
  Object.entries(steerDayNames).forEach(([word, d]) => {
    if (new RegExp('\\b' + word + '\\b').test(raw) && !days.includes(d)) days.push(d);
  });
  const subject = steerFindSubject(raw, plan);

  // "niet in het weekend"
  if (/\bweekend\b/.test(raw) && (negative || less)) add({ kind: 'noWeekend', text: 'Geen weekend' });

  // "max 1 uur op maandag"
  const cap = raw.match(/\b(?:max(?:imaal)?|hoogstens|niet meer dan)\s*(\d+(?:[.,]\d+)?)\s*(?:u\b|uur)/);
  if (cap) {
    const h = parseFloat(cap[1].replace(',', '.'));
    (days.length ? days : [0, 1, 2, 3, 4, 5, 6]).forEach(d =>
      add({ kind: 'dayHours', day: d, hours: h, text: `Max ${fmtHours(h)} op ${dayLabelsNl[d]}` }));
  }

  // Bloklengte & pauzes
  const mins = raw.match(/\b(\d{2,3})\s*(?:min|minuten)\b/);
  if (/\bpauze/.test(raw)) {
    const m = mins ? +mins[1] : (more ? 15 : (less ? 5 : null));
    if (m != null) add({ kind: 'breakMinutes', minutes: m, text: `Pauzes van ${m} min` });
  } else if (mins || /\bblok/.test(raw) || /pomodoro/.test(raw)) {
    const m = /pomodoro/.test(raw) ? 25 : (mins ? +mins[1] : (less ? 25 : (more ? 90 : null)));
    if (m != null) add({ kind: 'blockMinutes', minutes: m, text: `Blokken van ${m} min` });
  }

  // Afwisseling
  if (/\b(per vak|achter elkaar|een vak tegelijk)\b/.test(raw)) {
    add({ kind: 'variety', value: false, text: 'Per vak doorwerken' });
  } else if (/afwissel/.test(raw)) {
    const off = negative || less;
    add({ kind: 'variety', value: !off, text: off ? 'Minder afwisselen' : 'Meer afwisselen' });
  }

  // Topmoment — alleen als je het positief vraagt ("leren in de avond")
  if (!negative) {
    if (/ochtend|'s morgens|\bmorgens\b/.test(raw)) add({ kind: 'peak', value: 'morning', text: 'Leren in de ochtend' });
    else if (/middag/.test(raw)) add({ kind: 'peak', value: 'afternoon', text: 'Leren in de middag' });
    else if (/avond/.test(raw)) add({ kind: 'peak', value: 'evening', text: 'Leren in de avond' });
  }

  // Vak op een dag wel of juist niet
  if (subject && days.length) {
    const avoid = negative || less;
    days.forEach(d => add({
      kind: 'subjectDay', subject, day: d, mode: avoid ? 'avoid' : 'prefer',
      text: `${avoid ? 'Geen' : 'Juist'} ${subjects[subject].name} op ${dayLabelsNl[d]}`,
    }));
  } else if (!subject && days.length && (negative || less)) {
    days.forEach(d => add({ kind: 'blockDay', day: d, text: `Niet leren op ${dayLabelsNl[d]}` }));
  }

  // Meer of minder tijd voor één vak (past de uren van dat vak aan)
  if (subject && !days.length && (more || less)) {
    add({
      kind: 'subjectHours', subject, factor: more ? 1.3 : 0.7,
      text: `${more ? 'Meer' : 'Minder'} tijd voor ${subjects[subject].name}`,
    });
  }
  return rules;
}

// Twee regels die hetzelfde aansturen: de nieuwe vervangt de oude.
function sameSteerTarget(a, b) {
  if (a.kind !== b.kind) return false;
  if (a.kind === 'subjectDay') return a.subject === b.subject && a.day === b.day;
  if (a.kind === 'dayHours' || a.kind === 'blockDay') return a.day === b.day;
  if (a.kind === 'subjectHours') return a.subject === b.subject;
  return true; // bloklengte, pauze, afwisseling, topmoment, weekend: één per plan
}

function scaleSubjectHours(plan, subject, factor) {
  (plan.tasks || []).forEach(t => {
    if (t.subject !== subject) return;
    t.hours = Math.max(0.5, Math.round((t.hours || 0) * factor * 2) / 2);
  });
}

// Regels toevoegen aan het plan. Alleen bekende soorten komen erin — zo kan
// een antwoord van de AI nooit iets anders aanzetten dan deze knoppen.
function applySteerRules(plan, rules) {
  if (!Array.isArray(plan.steer)) plan.steer = [];
  let added = 0;
  (rules || []).forEach(r => {
    if (!r || !steerKinds.includes(r.kind)) return;
    if (r.kind === 'subjectHours') {
      if (!subjects[r.subject] || !r.factor) return;
      scaleSubjectHours(plan, r.subject, r.factor);
    }
    plan.steer = plan.steer.filter(x => !sameSteerTarget(x, r));
    plan.steer.push({ ...r, id: Date.now() * 1000 + Math.floor(Math.random() * 1000) });
    added++;
  });
  return added;
}

function removeSteerRule(plan, id) {
  const r = steerList(plan).find(x => x.id === id);
  if (!r) return;
  // Uren-bijstelling terugdraaien, zodat weghalen echt ongedaan maakt
  if (r.kind === 'subjectHours' && r.factor) scaleSubjectHours(plan, r.subject, 1 / r.factor);
  plan.steer = steerList(plan).filter(x => x.id !== id);
}

// Zet de leerblokken van één dag om in concrete tijden, met pauzes ertussen.
// Heeft de dag eigen tijdblokken? Dan blijven we daarbinnen. Anders beginnen
// we op het moment dat bij je topmoment past (ochtend/middag/avond).
function buildDayBlocks(plan, day) {
  const seq = (day.blocks && day.blocks.length) ? day.blocks : (day.assignments || []);
  if (!seq.length) return [];
  const prefs = effectivePrefs(plan);
  const slots = (day.slots && day.slots.length) ? day.slots : null;
  const out = [];
  let si = 0;
  let cursor = slots ? timeToMin(slots[0].start) : timeToMin(peakStartTime[prefs.peak]);

  // Schuif naar het eerstvolgende tijdblok met ruimte. False = dag is vol.
  const advance = () => {
    if (!slots) return true;
    while (si < slots.length && cursor >= timeToMin(slots[si].end)) {
      si++;
      if (si < slots.length) cursor = Math.max(cursor, timeToMin(slots[si].start));
    }
    return si < slots.length;
  };
  const roomLeft = () => (slots ? timeToMin(slots[si].end) - cursor : Infinity);

  for (let i = 0; i < seq.length; i++) {
    let rem = Math.round((seq[i].hours || 0) * 60);
    while (rem > 0.5) {
      if (!advance()) return out;
      const use = Math.min(rem, roomLeft());
      if (use <= 0.5) break;
      out.push({
        type: 'study', taskId: seq[i].taskId, subject: seq[i].subject, title: seq[i].title,
        start: minToTime(cursor), end: minToTime(cursor + use), minutes: use,
      });
      cursor += use;
      rem -= use;
    }
    // Pauze tussen twee leerblokken — niet achter het laatste blok van de dag.
    if (prefs.breakMinutes > 0 && i < seq.length - 1) {
      if (!advance()) return out;
      if (roomLeft() >= prefs.breakMinutes) {
        out.push({
          type: 'break',
          start: minToTime(cursor), end: minToTime(cursor + prefs.breakMinutes),
          minutes: prefs.breakMinutes,
        });
        cursor += prefs.breakMinutes;
      }
    }
  }
  return out;
}

// Verdeelt de taakuren over de beschikbare dagen vanaf vandaag t/m de
// deadline. Vakken worden afgewisseld (blokken van max 1 uur, round-robin)
// en elke taak wordt vóór de toets van het eigen vak gepland.
function buildSchedule(plan) {
  const today0 = startOfDay(today);
  const deadline = planDeadline(plan);

  const days = [];
  for (let d = new Date(today0); d <= deadline; d = addDays(d, 1)) {
    const slots = [...daySlots(plan, d)].sort((a, b) => timeToMin(a.start) - timeToMin(b.start));
    const key = dateKey(d);
    // Uren die je die dag al hebt gestudeerd gaan van je dagbudget af, zodat
    // het schema niet steeds opnieuw je dag tot het maximum volplant.
    const loggedToday = (plan.dailyLogged && plan.dailyLogged[key]) || 0;
    days.push({
      date: new Date(d),
      key,
      capacity: Math.max(0, availabilityFor(plan, d) - loggedToday),
      slots,
      used: 0,
      assignments: [],
      blocks: [],
    });
  }

  let overflow = 0;
  let unscheduled = 0;
  const manual = !!plan.manualSchedule;

  if (manual) {
    // Handmatig schema: plaats precies wat de gebruiker heeft ingedeeld
    const dayByKey = {};
    days.forEach(d => { dayByKey[d.key] = d; });
    Object.entries(plan.manualSchedule).forEach(([key, arr]) => {
      const day = dayByKey[key];
      if (!day) return;
      arr.forEach(a => {
        const t = plan.tasks.find(x => x.id === a.taskId);
        if (!t) return;
        day.assignments.push({ taskId: t.id, subject: t.subject, title: t.title, hours: a.hours });
        day.used += a.hours;
      });
    });
    // Hoeveel uur is er nog niet ingepland?
    plan.tasks.forEach(t => {
      if (subjectTestPassed(plan, t.subject)) return; // toets gehad → niks meer nodig
      let planned = 0;
      Object.values(plan.manualSchedule).forEach(arr => arr.forEach(a => { if (a.taskId === t.id) planned += a.hours; }));
      const need = Math.max(0, (t.hours || 0) - Math.max(0, t.hoursDone || 0));
      if (need - planned > 0.001) unscheduled += need - planned;
    });
  } else {
    // Automatisch: resterende uren per taak (op deadline gesorteerd)
    const items = plan.tasks
      .map(t => ({
        task: t,
        rem: Math.max(0, (t.hours || 0) - Math.max(0, t.hoursDone || 0)),
        due: taskDue(plan, t, deadline),
      }))
      // Vakken waarvan de toets al is geweest vallen weg uit de planning.
      .filter(i => i.rem > 0.0001 && !subjectTestPassed(plan, i.task.subject))
      .sort((a, b) => a.due - b.due);

    // Eén assignment per taak per dag (uren optellen) PLUS de echte
    // blokvolgorde, zodat het schema kan laten zien dat je afwisselt.
    const place = (day, it, hours) => {
      const ex = day.assignments.find(a => a.taskId === it.task.id);
      if (ex) ex.hours += hours;
      else day.assignments.push({ taskId: it.task.id, subject: it.task.subject, title: it.task.title, hours });
      day.blocks.push({ taskId: it.task.id, subject: it.task.subject, title: it.task.title, hours });
      day.used += hours;
      it.rem -= hours;
    };

    // Fase 1: taken met 'eerder doen' worden vooraan ingepland (vroegste dagen vol)
    const prio = items.filter(i => i.task.priority);
    if (prio.length) {
      for (const day of days) {
        let free = day.capacity - day.used;
        for (const it of prio) {
          if (free <= 0.0001) break;
          if (it.rem <= 0.0001 || it.due < day.date) continue;
          const chunk = Math.min(it.rem, free);
          place(day, it, chunk);
          free -= chunk;
        }
      }
    }

    // Fase 1b: taken met een voorkeursdag op die weekdag inplannen
    const pref = items.filter(i => i.task.prefDay != null);
    if (pref.length) {
      for (const day of days) {
        let free = day.capacity - day.used;
        for (const it of pref) {
          if (free <= 0.0001) break;
          if (it.rem <= 0.0001 || it.due < day.date) continue;
          if (day.date.getDay() !== it.task.prefDay) continue;
          const chunk = Math.min(it.rem, free);
          place(day, it, chunk);
          free -= chunk;
        }
      }
    }

    // Fase 2: de rest in BLOKKEN over de overgebleven tijd.
    //  - standaard: afwisselen. Per blok kiezen we het vak dat die dag nog
    //    het minst aan bod kwam, en nooit twee keer hetzelfde vak achter
    //    elkaar. Zo zit je niet drie uur op één vak vast.
    //  - 'blocked': juist wél doorwerken aan hetzelfde vak, maar nog steeds
    //    in blokken met pauzes ertussen.
    const prefs = effectivePrefs(plan);
    const blockH = prefs.blockMinutes / 60;
    const hardSet = new Set(prefs.hardSubjects);
    // Doorwerken aan één vak: via de schakelaar in de bewerk-balk, of doordat
    // je in de stuurbalk "per vak achter elkaar" hebt gevraagd.
    const keepTogether = plan.studyOrder === 'blocked' || prefs.variety === false;

    // Eerste toetsdatum per vak: vakken met de eerstvolgende toets gaan voor.
    const subjDue = {};
    items.forEach(i => {
      const cur = subjDue[i.task.subject];
      subjDue[i.task.subject] = cur != null ? Math.min(cur, i.due) : i.due;
    });

    for (const day of days) {
      const jsDay = day.date.getDay();
      const doneToday = {};               // vak -> aantal blokken vandaag
      let free = day.capacity - day.used;
      let last = null;
      let guard = 0;
      day.assignments.forEach(a => { doneToday[a.subject] = (doneToday[a.subject] || 0) + 1; });

      while (free > 0.0001 && guard++ < 400) {
        // Alles wat vandaag mag: nog uren over, deadline nog niet voorbij en
        // niet door een stuurregel van deze dag uitgesloten.
        let pool = items.filter(i => i.rem > 0.0001 && i.due >= day.date
          && steerAllowsSubject(plan, i.task.subject, jsDay));
        if (!pool.length) break;

        if (keepTogether && last) {
          const same = pool.filter(i => i.task.subject === last);
          if (same.length) pool = same;
        } else if (prefs.variety && last) {
          const other = pool.filter(i => i.task.subject !== last);
          if (other.length) pool = other;
        }

        pool = pool.slice().sort((a, b) => {
          // 1. "doe wiskunde op maandag" uit de stuurbalk
          const pa = steerPrefersSubject(plan, a.task.subject, jsDay) ? 1 : 0;
          const pb = steerPrefersSubject(plan, b.task.subject, jsDay) ? 1 : 0;
          if (pa !== pb) return pb - pa;
          // 2. eerlijk rondgaan: het vak dat vandaag het minst aan bod kwam
          if (!keepTogether) {
            const ca = doneToday[a.task.subject] || 0;
            const cb = doneToday[b.task.subject] || 0;
            if (ca !== cb) return ca - cb;
          }
          // 3. vak met de eerstvolgende toets
          const sd = subjDue[a.task.subject] - subjDue[b.task.subject];
          if (sd) return sd;
          // 4. moeilijke vakken vroeg op de dag, als je het scherpst bent
          const ha = hardSet.has(a.task.subject) ? 1 : 0;
          const hb = hardSet.has(b.task.subject) ? 1 : 0;
          if (ha !== hb) return hb - ha;
          return a.due - b.due;
        });

        const it = pool[0];
        let chunk = Math.min(blockH, it.rem, free);
        // Een paar losse minuten is geen leerblok. Blijft er na dit blok
        // minder dan 10 minuten over, plak die er dan bij (dus 55 min in
        // plaats van 45 + 10); past er niks zinnigs meer, stop dan de dag.
        const sliver = 10 / 60;
        if (free - chunk > 0.0001 && free - chunk < sliver) chunk = Math.min(free, it.rem);
        if (chunk <= 0.0001) break;
        if (chunk < sliver && chunk < it.rem - 0.0001) break;
        place(day, it, chunk);
        doneToday[it.task.subject] = (doneToday[it.task.subject] || 0) + 1;
        free -= chunk;
        last = it.task.subject;
      }
    }
    // Wat nergens meer past (vóór de eigen toets/deadline) telt als tekort
    overflow = items.reduce((s, i) => s + i.rem, 0);
  }

  // Zet de blokken van elke dag om in concrete tijden met pauzes ertussen.
  days.forEach(day => { day.timed = buildDayBlocks(plan, day); });

  const totalCapacity = days.reduce((s, d) => s + d.capacity, 0);
  return { days, overflow, unscheduled, manual, totalCapacity };
}

// Helpers voor het handmatige schema
function manualScheduleAdd(plan, key, taskId, hours) {
  if (!plan.manualSchedule) plan.manualSchedule = {};
  if (!plan.manualSchedule[key]) plan.manualSchedule[key] = [];
  const ex = plan.manualSchedule[key].find(a => a.taskId === taskId);
  if (ex) ex.hours = Math.round((ex.hours + hours) * 100) / 100;
  else plan.manualSchedule[key].push({ taskId, hours });
}

function manualScheduleRemove(plan, key, taskId, hours) {
  const ms = plan.manualSchedule;
  if (!ms || !ms[key]) return;
  const ex = ms[key].find(a => a.taskId === taskId);
  if (!ex) return;
  ex.hours = hours == null ? 0 : Math.round((ex.hours - hours) * 100) / 100;
  if (ex.hours <= 0.001) ms[key] = ms[key].filter(a => a !== ex);
  if (ms[key].length === 0) delete ms[key];
}

// Berekent voortgang en of je voor/achter op schema loopt.
// De verwachte voortgang is een VASTE lijn vanaf de startdatum van het plan:
// (verstreken beschikbare uren / totale beschikbare uren) × totaal benodigde
// uren. Een dag niets doen schuift die lijn dus niet op — je loopt dan echt
// achter en moet inhalen.
function planStatus(plan) {
  const today0 = startOfDay(today);
  const sched = buildSchedule(plan);

  const totalNeeded = plan.tasks.reduce((s, t) => s + Math.max(0, t.hours || 0), 0);
  const totalDone = plan.tasks.reduce((s, t) => s + Math.min(t.hours || 0, Math.max(0, t.hoursDone || 0)), 0);

  const deadline = planDeadline(plan);
  const start = startOfDay(plan.startDate ? new Date(plan.startDate) : today);

  let expectedByToday;
  if (sched.manual) {
    // Handmatig schema: wat je volgens je eigen indeling t/m vandaag gepland had
    expectedByToday = sched.days.reduce((s, d) => d.date <= today0 ? s + d.used : s, 0);
    expectedByToday = Math.min(totalNeeded, expectedByToday);
  } else {
    // Automatisch: vaste lijn op basis van verstreken beschikbare tijd
    let capTotal = 0, capElapsed = 0, guard = 0;
    for (let d = new Date(start); d <= deadline && guard++ < 400; d = addDays(d, 1)) {
      const c = Math.max(0, availabilityFor(plan, d));
      capTotal += c;
      if (d <= today0) capElapsed += c;
    }
    expectedByToday = capTotal > 0 ? Math.min(totalNeeded, totalNeeded * (capElapsed / capTotal)) : 0;
  }

  const diff = totalDone - expectedByToday; // positief = vóór op schema

  return {
    sched,
    totalNeeded,
    totalDone,
    remaining: Math.max(0, totalNeeded - totalDone),
    expectedByToday,
    diff,
    onSchedule: diff >= -0.001,
    pct: totalNeeded > 0 ? Math.round((totalDone / totalNeeded) * 100) : 0,
    overflow: sched.overflow,
    deadline,
    daysToDeadline: daysBetween(today0, deadline),
    daysToExam: daysBetween(today0, planExamDate(plan)),
  };
}

// Het plan dat op het dashboard getoond wordt: eerstvolgende met een
// deadline die nog niet ver voorbij is.
function getDashboardPlan() {
  const upcoming = [...plans]
    .filter(p => planDeadline(p) >= startOfDay(addDays(today, -7)))
    .sort((a, b) => new Date(planExamDate(a)) - new Date(planExamDate(b)));
  return upcoming[0] || null;
}

function statusLabel(st) {
  if (st.totalNeeded === 0) return { text: 'Nog geen taken', cls: 'neutral' };
  if (st.pct >= 100) return { text: 'Helemaal klaar! 🎉', cls: 'ahead' };
  if (Math.abs(st.diff) < 0.25) return { text: 'Precies op schema', cls: 'ontrack' };
  if (st.diff > 0) return { text: `${fmtHours(st.diff)} vóór op schema`, cls: 'ahead' };
  return { text: `${fmtHours(Math.abs(st.diff))} achter op schema`, cls: 'behind' };
}
