// ============================================================
// SchoolPlanner — Reusable Components
// ============================================================

// --- SVG Icons (inline, no dependencies) ---
const icons = {
  home: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
  calendar: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',
  book: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>',
  clipboard: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>',
  fileText: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>',
  barChart: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>',
  bell: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
  check: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  chevronDown: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  chevronLeft: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
  chevronRight: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
  plus: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>',
  clock: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  mapPin: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  x: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  fire: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
  graduationCap: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>',
  target: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
  bookOpen: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
  listChecks: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/></svg>',
  trendingUp: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
  settings: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
};

// --- Icon helper ---
function icon(name, size = 18) {
  return `<span style="display:inline-flex;width:${size}px;height:${size}px">${icons[name] || ''}</span>`;
}

// --- HTML escape (voor alle door de gebruiker ingevoerde tekst) ---
function esc(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// --- Circular Progress Component ---
function renderCircularProgress(percentage, size = 140, strokeWidth = 10) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return `
    <div class="circular-progress" style="width:${size}px;height:${size}px">
      <svg width="${size}" height="${size}">
        <circle cx="${size/2}" cy="${size/2}" r="${radius}"
          fill="none" stroke="var(--gray-100)" stroke-width="${strokeWidth}"/>
        <circle cx="${size/2}" cy="${size/2}" r="${radius}"
          fill="none" stroke="var(--accent)" stroke-width="${strokeWidth}"
          stroke-linecap="round"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${offset}"
          style="transition: stroke-dashoffset 0.8s ease-in-out"/>
      </svg>
      <div class="progress-text">
        <div class="progress-percentage">${percentage}%</div>
        <div class="progress-label">voltooid</div>
      </div>
    </div>
  `;
}

// --- Checkbox Component ---
function renderCheckbox(checked, dataId, dataType) {
  return `
    <div class="todo-checkbox ${checked ? 'checked' : ''}" data-id="${dataId}" data-type="${dataType}">
      ${icons.check}
    </div>
  `;
}

// --- Subject Badge ---
function renderSubjectBadge(subjectId) {
  const s = subjects[subjectId];
  if (!s) return '';
  return `<span class="hw-subject-badge" style="background:${s.light};color:${s.color}">${s.name}</span>`;
}

// --- Due Text ---
function getDueText(date) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = Math.round((dueStart - todayStart) / 86400000);

  if (diff < 0) return { text: `${Math.abs(diff)} dagen geleden`, urgent: true };
  if (diff === 0) return { text: 'Vandaag', urgent: true };
  if (diff === 1) return { text: 'Morgen', urgent: true };
  if (diff <= 3) return { text: `Over ${diff} dagen`, urgent: false };
  return { text: formatDateShort(date), urgent: false };
}

// --- Mini Calendar ---
function renderMiniCalendar(year, month) {
  const months = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
                  'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];
  const dayNames = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];

  const firstDay = new Date(year, month, 1);
  let startDay = firstDay.getDay() - 1; // Monday = 0
  if (startDay < 0) startDay = 6;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  // Build event date set for this month
  const eventDates = new Set();
  allAgendaEvents().forEach(e => {
    const d = new Date(e.date);
    if (d.getMonth() === month && d.getFullYear() === year) {
      eventDates.add(d.getDate());
    }
  });

  let html = `
    <div class="mini-calendar">
      <div class="mini-calendar-header">
        <h4>${months[month]} ${year}</h4>
        <div class="mini-calendar-nav">
          <button onclick="navigateMiniCalendar(-1)">${icons.chevronLeft}</button>
          <button onclick="navigateMiniCalendar(1)">${icons.chevronRight}</button>
        </div>
      </div>
      <div class="mini-calendar-grid">
  `;

  dayNames.forEach(d => {
    html += `<div class="mini-calendar-day-name">${d}</div>`;
  });

  // Previous month days
  for (let i = startDay - 1; i >= 0; i--) {
    html += `<div class="mini-calendar-day other-month">${daysInPrevMonth - i}</div>`;
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === todayDate && month === todayMonth && year === todayYear;
    const hasEvent = eventDates.has(d);
    const classes = ['mini-calendar-day'];
    if (isToday) classes.push('today');
    if (hasEvent) classes.push('has-event');
    html += `<div class="${classes.join(' ')}">${d}</div>`;
  }

  // Next month days
  const totalCells = startDay + daysInMonth;
  const remaining = (7 - (totalCells % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    html += `<div class="mini-calendar-day other-month">${d}</div>`;
  }

  html += '</div></div>';
  return html;
}

let miniCalYear = today.getFullYear();
let miniCalMonth = today.getMonth();

function navigateMiniCalendar(delta) {
  miniCalMonth += delta;
  if (miniCalMonth > 11) { miniCalMonth = 0; miniCalYear++; }
  if (miniCalMonth < 0) { miniCalMonth = 11; miniCalYear--; }
  const calContainer = document.querySelector('.mini-calendar-container');
  if (calContainer) {
    calContainer.innerHTML = renderMiniCalendar(miniCalYear, miniCalMonth);
  }
}

// --- Modal ---
function openModal(title, bodyHtml) {
  const overlay = document.getElementById('modal-overlay');
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>${title}</h3>
        <button class="modal-close" onclick="closeModal()">${icons.x}</button>
      </div>
      <div class="modal-body">${bodyHtml}</div>
    </div>
  `;
  overlay.classList.add('open');
  overlay.onclick = (e) => { if (e.target === overlay) closeModal(); };
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

// --- Notification Dropdown (gegenereerd uit je echte data) ---
function buildNotifications() {
  const notifs = [];
  const today0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  // Huiswerk dat vandaag of morgen moet
  homework.filter(h => !h.done).forEach(h => {
    const diff = Math.round((new Date(h.due).setHours(0,0,0,0) - today0) / 86400000);
    if (diff === 0) notifs.push({ icon: '📝', bg: '#FEE2E2', text: `"${esc(h.title)}" moet vandaag af`, time: 'Vandaag' });
    else if (diff === 1) notifs.push({ icon: '📝', bg: '#FEF3C7', text: `"${esc(h.title)}" moet morgen af`, time: 'Morgen' });
  });

  // Toetsen binnen 2 dagen
  tests.forEach(t => {
    const diff = Math.round((new Date(t.date).setHours(0,0,0,0) - today0) / 86400000);
    const s = subjects[t.subject];
    if (diff >= 0 && diff <= 2) {
      notifs.push({ icon: '📅', bg: '#DBEAFE', text: `${s ? s.name : 'Toets'}: ${esc(t.title)} ${diff === 0 ? 'vandaag' : diff === 1 ? 'morgen' : 'over 2 dagen'}`, time: formatDateShort(new Date(t.date)) });
    }
  });

  // Loop je achter op je toetsweek/examen-planning?
  if (typeof getDashboardPlan === 'function') {
    const plan = getDashboardPlan();
    if (plan) {
      const st = planStatus(plan);
      if (st.totalNeeded > 0 && st.diff < -0.25 && st.pct < 100) {
        notifs.push({ icon: '⏰', bg: '#FEE2E2', text: `Je loopt ${fmtHours(Math.abs(st.diff))} achter op "${esc(plan.name)}"`, time: 'Planner' });
      }
    }
  }

  return notifs.slice(0, 6);
}

function renderNotifications() {
  const notifs = buildNotifications();
  return `
    <div class="notification-dropdown-header">🔔 Meldingen</div>
    <div class="notification-dropdown-sub">Huiswerk dat af moet, toetsen die eraan komen en of je achterloopt op je planning.</div>
    ${notifs.length === 0 ? '<div class="notification-empty">Geen meldingen — je bent helemaal bij! 🎉</div>' : notifs.map(n => `
      <div class="notification-item">
        <div class="notification-icon" style="background:${n.bg}">${n.icon}</div>
        <div>
          <div class="notification-text">${n.text}</div>
          <div class="notification-time">${n.time}</div>
        </div>
      </div>
    `).join('')}
  `;
}
