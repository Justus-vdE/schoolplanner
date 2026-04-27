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

// --- Subjects ---
const subjects = {
  wiskunde:     { name: 'Wiskunde',     color: '#3B82F6', light: '#DBEAFE', teacher: 'Dhr. Bakker',    icon: '📐' },
  nederlands:   { name: 'Nederlands',   color: '#EF4444', light: '#FEE2E2', teacher: 'Mevr. Jansen',   icon: '📖' },
  engels:       { name: 'Engels',       color: '#8B5CF6', light: '#EDE9FE', teacher: 'Dhr. Williams',   icon: '🇬🇧' },
  natuurkunde:  { name: 'Natuurkunde',  color: '#F59E0B', light: '#FEF3C7', teacher: 'Mevr. de Boer',  icon: '⚡' },
  geschiedenis: { name: 'Geschiedenis', color: '#10B981', light: '#D1FAE5', teacher: 'Dhr. Vermeer',    icon: '🏛️' },
  biologie:     { name: 'Biologie',     color: '#06B6D4', light: '#CFFAFE', teacher: 'Mevr. Smit',     icon: '🧬' },
  scheikunde:   { name: 'Scheikunde',   color: '#EC4899', light: '#FCE7F3', teacher: 'Dhr. van Dijk',  icon: '🧪' },
  economie:     { name: 'Economie',     color: '#F97316', light: '#FFEDD5', teacher: 'Mevr. de Groot', icon: '📊' },
};

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

function loadHomework() {
  const saved = localStorage.getItem('sp_homework');
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
        item.due = new Date(item.due);
        homework.push(item);
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
const grades = {
  wiskunde:     { grades: [7.2, 6.8, 8.1, 7.5, 6.9], descriptions: ['Toets H1', 'SO H2', 'Proefwerk H3', 'Toets H4', 'SO H5'] },
  nederlands:   { grades: [6.5, 7.8, 7.0, 8.2],       descriptions: ['Opstel', 'Grammatica', 'Boekverslag', 'Spreekbeurt'] },
  engels:       { grades: [8.0, 7.5, 8.8, 7.2, 9.1], descriptions: ['Vocab T1', 'Writing', 'Vocab T2', 'Reading', 'Speaking'] },
  natuurkunde:  { grades: [6.2, 5.8, 7.4, 6.9],       descriptions: ['Toets H1', 'Practicum', 'Proefwerk H2-3', 'SO H4'] },
  geschiedenis: { grades: [7.8, 8.5, 6.7],             descriptions: ['Toets WO2', 'Werkstuk', 'SO Koude Oorlog'] },
  biologie:     { grades: [7.1, 6.4, 8.0, 7.3],       descriptions: ['Toets Cel', 'Practicum', 'Proefwerk Ecologie', 'SO Evolutie'] },
  scheikunde:   { grades: [5.9, 6.3, 7.1, 6.0],       descriptions: ['Toets Atoom', 'SO Reacties', 'Proefwerk H3', 'Practicum'] },
  economie:     { grades: [7.5, 8.0, 7.8],             descriptions: ['Toets Markt', 'Werkstuk', 'SO Conjunctuur'] },
};

function getAverage(arr) {
  return (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1);
}

function getOverallAverage() {
  const allGrades = Object.values(grades).flatMap(s => s.grades);
  return getAverage(allGrades);
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
};

let appSettings = { ...defaultSettings };

function loadSettings() {
  const saved = localStorage.getItem('sp_settings');
  if (saved) {
    try { appSettings = { ...defaultSettings, ...JSON.parse(saved) }; } catch(e) {}
  }
}

function saveSettings() {
  localStorage.setItem('sp_settings', JSON.stringify(appSettings));
}

// --- Auth ---
let isLoggedIn = localStorage.getItem('sp_logged_in') === 'true';
let userPlan = localStorage.getItem('sp_user_plan') || 'pro';

function setLoggedIn(val) {
  isLoggedIn = val;
  localStorage.setItem('sp_logged_in', val.toString());
}

function setUserPlan(plan) {
  userPlan = plan;
  localStorage.setItem('sp_user_plan', plan);
}
