// ============================================================
// SchoolPlanner — Page Renderers
// ============================================================

// ==================== DASHBOARD ====================
function renderDashboard() {
  loadTodos();
  loadHomework();

  const todayLessons = getTodaySchedule();
  const todayHw = homework.filter(h => {
    const d = new Date(h.due);
    return d.toDateString() === today.toDateString() && !h.done;
  });
  const weekTests = tests.filter(t => {
    const d = new Date(t.date);
    const diff = (d - today) / 86400000;
    return diff >= 0 && diff <= 7;
  });
  const totalTodos = todos.length;
  const doneTodos = todos.filter(t => t.done).length;
  const progressPct = totalTodos > 0 ? Math.round((doneTodos / totalTodos) * 100) : 0;
  const streak = loadStreak();
  const remaining = totalTodos - doneTodos;

  // Streak message
  let streakMessage = '';
  if (streak === 0) streakMessage = 'Begin je streak door een taak af te vinken!';
  else if (streak < 3) streakMessage = 'Goed begin! Blijf zo doorgaan!';
  else if (streak < 7) streakMessage = 'Je bent op dreef! Fantastisch!';
  else if (streak < 14) streakMessage = 'Wat een doorzetter! Indrukwekkend!';
  else streakMessage = 'Ongelooflijk! Je bent een machine!';

  // Progress bar segments
  const doneHw = homework.filter(h => h.done).length;
  const totalHw = homework.length;
  const hwPct = totalHw > 0 ? Math.round((doneHw / totalHw) * 100) : 0;

  const firstName = appSettings.userName.split(' ')[0];

  return `
    <div class="page-content">
      <!-- Streak Banner -->
      <div class="streak-banner ${streak > 0 ? 'active' : ''}">
        <div class="streak-banner-left">
          <div class="streak-fire">${streak > 0 ? '<span class="streak-fire-icon streak-pulse">&#128293;</span>' : '<span class="streak-fire-icon dim">&#128293;</span>'}</div>
          <div class="streak-banner-info">
            <div class="streak-banner-count">${streak} dag${streak !== 1 ? 'en' : ''} streak</div>
            <div class="streak-banner-msg">${streakMessage}</div>
          </div>
        </div>
        <div class="streak-banner-right">
          <div class="streak-days">
            ${['Ma','Di','Wo','Do','Vr','Za','Zo'].map((d, i) => {
              const dayNum = i + 1;
              const currentDay = today.getDay() === 0 ? 7 : today.getDay();
              const isActive = dayNum <= currentDay && dayNum > currentDay - streak;
              return `<div class="streak-day-dot ${isActive ? 'active' : ''}">${d}</div>`;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- Progress Overview Bar -->
      <div class="progress-overview">
        <div class="progress-overview-item">
          <div class="progress-overview-ring">
            ${renderCircularProgress(progressPct, 80, 7)}
          </div>
          <div class="progress-overview-info">
            <div class="progress-overview-label">Taken</div>
            <div class="progress-overview-value">${doneTodos}/${totalTodos}</div>
          </div>
        </div>
        <div class="progress-overview-divider"></div>
        <div class="progress-overview-item">
          <div class="progress-overview-ring">
            ${renderCircularProgress(hwPct, 80, 7)}
          </div>
          <div class="progress-overview-info">
            <div class="progress-overview-label">Huiswerk</div>
            <div class="progress-overview-value">${doneHw}/${totalHw}</div>
          </div>
        </div>
        <div class="progress-overview-divider"></div>
        <div class="progress-overview-item">
          <div class="progress-overview-stat">
            <div class="progress-overview-big">${weekTests.length}</div>
          </div>
          <div class="progress-overview-info">
            <div class="progress-overview-label">Toetsen</div>
            <div class="progress-overview-value">deze week</div>
          </div>
        </div>
        <div class="progress-overview-divider"></div>
        <div class="progress-overview-item">
          <div class="progress-overview-stat">
            <div class="progress-overview-big">${todayLessons.length}</div>
          </div>
          <div class="progress-overview-info">
            <div class="progress-overview-label">Lessen</div>
            <div class="progress-overview-value">vandaag</div>
          </div>
        </div>
      </div>

      <!-- Welcome Block -->
      <div class="welcome-block">
        <div class="welcome-text">
          <h1>${getGreeting()}, ${firstName}</h1>
          <p>Vandaag heb je ${todayLessons.length} lessen en ${todayHw.length} deadline${todayHw.length !== 1 ? 's' : ''}</p>
        </div>
        <div class="welcome-actions">
          <button class="btn btn-primary" onclick="navigate('rooster')">
            ${icon('calendar', 16)} Bekijk rooster
          </button>
          <button class="btn btn-secondary" onclick="navigate('huiswerk')">
            ${icon('plus', 16)} Huiswerk toevoegen
          </button>
        </div>
      </div>

      <!-- Dashboard Layout -->
      <div class="dashboard-layout">
        <!-- Left: two stacked columns -->
        <div class="dashboard-main">
          <div class="dashboard-col">
            <!-- Today's Schedule -->
            <div class="card">
              <div class="card-header">
                <div class="card-title">${icon('clock')} Vandaag</div>
                <span class="card-action" onclick="navigate('rooster')">Volledig rooster &rarr;</span>
              </div>
              ${todayLessons.length > 0 ? todayLessons.map(l => {
                const s = subjects[l.subject];
                return `
                  <div class="schedule-item">
                    <span class="schedule-time">${l.time}</span>
                    <span class="schedule-dot" style="background:${s.color}"></span>
                    <div class="schedule-info">
                      <div class="schedule-subject">${s.name}</div>
                      <div class="schedule-detail">${s.teacher}</div>
                    </div>
                    <span class="schedule-room">${l.room}</span>
                  </div>
                `;
              }).join('') : '<div class="empty-state empty-state-compact"><p>Geen lessen vandaag!</p></div>'}
            </div>

            <!-- Tests This Week -->
            <div class="card">
              <div class="card-header">
                <div class="card-title">${icon('fileText')} Toetsen deze week</div>
                <span class="card-action" onclick="navigate('toetsen')">Alle toetsen &rarr;</span>
              </div>
              ${weekTests.length > 0 ? weekTests.map(t => {
                const s = subjects[t.subject];
                const due = getDueText(t.date);
                return `
                  <div class="schedule-item">
                    <span class="schedule-dot" style="background:${s.color}"></span>
                    <div class="schedule-info">
                      <div class="schedule-subject">${s.name}</div>
                      <div class="schedule-detail">${t.title}</div>
                    </div>
                    <span class="todo-due ${due.urgent ? 'urgent' : ''}">${due.text}</span>
                  </div>
                `;
              }).join('') : '<div class="empty-state empty-state-compact"><p>Geen toetsen deze week!</p></div>'}
            </div>
          </div>

          <div class="dashboard-col">
            <!-- Deadline Today -->
            <div class="card">
              <div class="card-header">
                <div class="card-title">${icon('clipboard')} Vandaag inleveren</div>
                <span class="card-action" onclick="navigate('huiswerk')">Alle huiswerk &rarr;</span>
              </div>
              ${todayHw.length > 0 ? todayHw.map(h => {
                const s = subjects[h.subject];
                return `
                  <div class="todo-item" onclick="toggleHomework(${h.id})">
                    ${renderCheckbox(h.done, h.id, 'hw')}
                    <div style="flex:1">
                      <div class="todo-text ${h.done ? 'done' : ''}">${h.title}</div>
                      <div style="font-size:0.75rem;color:var(--gray-400);margin-top:2px">${s.name}</div>
                    </div>
                    <span class="todo-due urgent">Vandaag</span>
                  </div>
                `;
              }).join('') : '<div class="empty-state empty-state-compact"><p>Niets in te leveren vandaag!</p></div>'}
            </div>

            <!-- Todo List -->
            <div class="card">
              <div class="card-header">
                <div class="card-title">${icon('listChecks')} Nog te doen</div>
                <span style="font-size:0.8rem;color:var(--gray-400)">${doneTodos}/${totalTodos}</span>
              </div>
              <div id="todo-list">
                ${todos.map(t => `
                  <div class="todo-item" onclick="toggleTodo(${t.id})">
                    ${renderCheckbox(t.done, t.id, 'todo')}
                    <span class="todo-text ${t.done ? 'done' : ''}">${t.text}</span>
                  </div>
                `).join('')}
              </div>
              <div class="add-input-row">
                <input type="text" id="new-todo-input" placeholder="Nieuwe taak toevoegen..." onkeypress="if(event.key==='Enter')addTodo()">
                <button class="btn btn-primary btn-sm" onclick="addTodo()">${icon('plus', 14)}</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Calendar sidebar -->
        <div class="dashboard-sidebar">
          <div class="card">
            <div class="card-header">
              <div class="card-title">${icon('calendar')} Kalender</div>
              <span class="card-action" onclick="navigate('agenda')">Agenda &rarr;</span>
            </div>
            <div class="mini-calendar-container">
              ${renderMiniCalendar(today.getFullYear(), today.getMonth())}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ==================== ROOSTER ====================
function renderRooster() {
  loadSchedule();
  const jsDay = today.getDay();
  const todayIndex = (jsDay >= 1 && jsDay <= 5) ? jsDay - 1 : 0;
  const dayLabels = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag'];

  return `
    <div class="page-content">
      <div class="page-header" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
        <div>
          <h1>Rooster</h1>
          <p>Weekoverzicht &mdash; ${formatDate(today)}</p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-primary btn-sm" onclick="openAddLessonModal()">
            ${icon('plus', 14)} Les toevoegen
          </button>
          <button class="btn ${magistarConnected ? 'btn-magister-connected' : 'btn-magister'} btn-sm" onclick="openMagisterModal('rooster')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            ${magistarConnected ? 'Magister gekoppeld' : 'Koppel Magister'}
          </button>
        </div>
      </div>

      <!-- Mobile Day Tabs -->
      <div class="day-tabs" id="day-tabs">
        ${dayLabels.map((d, i) => `
          <button class="day-tab ${i === todayIndex ? 'active' : ''}" onclick="switchDay(${i})">${d}</button>
        `).join('')}
      </div>

      <div class="rooster-week" id="rooster-grid">
        ${dayNames.map((day, i) => {
          const lessons = schedule[day] || [];
          const isToday = i === todayIndex;
          return `
            <div class="rooster-day ${isToday ? 'active-day' : ''}" data-day="${i}">
              <div class="rooster-day-header ${isToday ? 'today' : ''}">${dayLabels[i]}</div>
              <div class="rooster-lessons">
                ${lessons.map((l, li) => {
                  const s = subjects[l.subject];
                  return `
                    <div class="lesson-block" style="background:${s.light};border-color:${s.color}">
                      <div class="lesson-hour">${l.hour}e uur &middot; ${l.time}</div>
                      <div class="lesson-subject" style="color:${s.color}">${s.name}</div>
                      <div class="lesson-detail">${s.teacher} &middot; ${l.room}</div>
                      <div class="lesson-actions">
                        <button class="lesson-action-btn" onclick="event.stopPropagation();openEditLessonModal('${day}',${li})" title="Bewerken">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                        </button>
                        <button class="lesson-action-btn delete" onclick="event.stopPropagation();deleteLesson('${day}',${li})" title="Verwijderen">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                      </div>
                    </div>
                  `;
                }).join('')}
                ${lessons.length === 0 ? '<div class="empty-state" style="padding:20px 0"><p>Vrij</p></div>' : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function switchDay(index) {
  document.querySelectorAll('.day-tab').forEach((tab, i) => {
    tab.classList.toggle('active', i === index);
  });
  document.querySelectorAll('.rooster-day').forEach((day, i) => {
    day.classList.toggle('active-day', i === index);
  });
}

function openAddLessonModal() {
  const subjectOptions = Object.entries(subjects).map(([key, s]) =>
    `<option value="${key}">${s.name}</option>`
  ).join('');
  const dayOptions = dayNames.map(d => `<option value="${d}">${d.charAt(0).toUpperCase() + d.slice(1)}</option>`).join('');

  openModal('Les toevoegen', `
    <form onsubmit="addLesson(event)">
      <div class="form-group">
        <label class="form-label">Dag</label>
        <select class="form-select" id="lesson-day" required>${dayOptions}</select>
      </div>
      <div class="form-group">
        <label class="form-label">Uur</label>
        <select class="form-select" id="lesson-hour" required>
          <option value="1">1e uur (08:30 - 09:20)</option>
          <option value="2">2e uur (09:20 - 10:10)</option>
          <option value="3">3e uur (10:30 - 11:20)</option>
          <option value="4">4e uur (11:20 - 12:10)</option>
          <option value="5">5e uur (12:10 - 13:00)</option>
          <option value="6">6e uur (12:40 - 13:30)</option>
          <option value="7">7e uur (13:30 - 14:20)</option>
          <option value="8">8e uur (14:20 - 15:10)</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Vak</label>
        <select class="form-select" id="lesson-subject" required>
          <option value="">Kies een vak...</option>
          ${subjectOptions}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Lokaal</label>
        <input type="text" class="form-input" id="lesson-room" placeholder="Bijv. A204" required>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:8px">
        ${icon('plus', 16)} Toevoegen
      </button>
    </form>
  `);
}

const hourTimes = {
  1: '08:30 - 09:20', 2: '09:20 - 10:10', 3: '10:30 - 11:20', 4: '11:20 - 12:10',
  5: '12:10 - 13:00', 6: '12:40 - 13:30', 7: '13:30 - 14:20', 8: '14:20 - 15:10'
};

function addLesson(e) {
  e.preventDefault();
  const day = document.getElementById('lesson-day').value;
  const hour = parseInt(document.getElementById('lesson-hour').value);
  const subject = document.getElementById('lesson-subject').value;
  const room = document.getElementById('lesson-room').value;

  if (day && hour && subject && room) {
    if (!schedule[day]) schedule[day] = [];
    schedule[day].push({ hour, time: hourTimes[hour], subject, room });
    schedule[day].sort((a, b) => a.hour - b.hour);
    saveSchedule();
    closeModal();
    renderPage('rooster');
  }
}

function openEditLessonModal(day, index) {
  const lesson = schedule[day][index];
  const subjectOptions = Object.entries(subjects).map(([key, s]) =>
    `<option value="${key}" ${key === lesson.subject ? 'selected' : ''}>${s.name}</option>`
  ).join('');

  openModal('Les bewerken', `
    <form onsubmit="editLesson(event,'${day}',${index})">
      <div class="form-group">
        <label class="form-label">Uur</label>
        <select class="form-select" id="edit-lesson-hour" required>
          ${Object.entries(hourTimes).map(([h, t]) =>
            `<option value="${h}" ${parseInt(h) === lesson.hour ? 'selected' : ''}>${h}e uur (${t})</option>`
          ).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Vak</label>
        <select class="form-select" id="edit-lesson-subject" required>${subjectOptions}</select>
      </div>
      <div class="form-group">
        <label class="form-label">Lokaal</label>
        <input type="text" class="form-input" id="edit-lesson-room" value="${lesson.room}" required>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:8px">
        Opslaan
      </button>
    </form>
  `);
}

function editLesson(e, day, index) {
  e.preventDefault();
  const hour = parseInt(document.getElementById('edit-lesson-hour').value);
  const subject = document.getElementById('edit-lesson-subject').value;
  const room = document.getElementById('edit-lesson-room').value;

  schedule[day][index] = { hour, time: hourTimes[hour], subject, room };
  schedule[day].sort((a, b) => a.hour - b.hour);
  saveSchedule();
  closeModal();
  renderPage('rooster');
}

function deleteLesson(day, index) {
  schedule[day].splice(index, 1);
  saveSchedule();
  renderPage('rooster');
}

// --- Magister Modal ---
function openMagisterModal(source) {
  const isConnected = magistarConnected;

  openModal('Koppel met Magister', `
    <div class="connect-modal">
      <div class="connect-icon-large">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="${isConnected ? '#22C55E' : '#3B82F6'}" stroke-width="1.5">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
      </div>
      ${isConnected ? `
        <div class="connect-status connected">
          <span class="connect-status-dot active"></span> Verbonden met Magister
        </div>
        <p class="connect-desc">Je gegevens worden automatisch gesynchroniseerd met Magister.</p>
        <div class="connect-info-box">
          <div class="connect-info-row"><span>Account</span><strong>${magistarAccount.user || 'Onbekend'}</strong></div>
          <div class="connect-info-row"><span>School</span><strong>${magistarAccount.school || 'Onbekend'}</strong></div>
          <div class="connect-info-row"><span>Laatst gesync</span><strong>Vandaag, ${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')}</strong></div>
        </div>
        <button class="btn btn-outline" style="width:100%;justify-content:center;margin-top:12px" onclick="disconnectMagister()">
          Ontkoppelen
        </button>
      ` : `
        <p class="connect-desc">Koppel je Magister account om je gegevens automatisch te importeren en up-to-date te houden.</p>
        <form onsubmit="connectMagister(event)">
          <div class="form-group">
            <label class="form-label">School</label>
            <input type="text" class="form-input" id="magister-school" placeholder="Naam van je school..." required>
          </div>
          <div class="form-group">
            <label class="form-label">Gebruikersnaam</label>
            <input type="text" class="form-input" id="magister-user" placeholder="Leerlingnummer of email..." required>
          </div>
          <div class="form-group">
            <label class="form-label">Wachtwoord</label>
            <input type="password" class="form-input" id="magister-pass" placeholder="Je Magister wachtwoord..." required>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:8px">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            Verbinden
          </button>
        </form>
      `}
    </div>
  `);
}

function connectMagister(e) {
  e.preventDefault();
  const school = document.getElementById('magister-school').value.trim();
  const user = document.getElementById('magister-user').value.trim();
  saveMagisterConnection(true, { school, user });
  closeModal();
  renderPage(currentPage);
}

function disconnectMagister() {
  saveMagisterConnection(false);
  closeModal();
  renderPage(currentPage);
}

// ==================== HUISWERK ====================
let hwFilter = 'alles';

function renderHuiswerk() {
  loadHomework();

  const filtered = homework.filter(h => {
    if (hwFilter === 'vandaag') {
      return new Date(h.due).toDateString() === today.toDateString();
    }
    if (hwFilter === 'week') {
      const diff = (new Date(h.due) - today) / 86400000;
      return diff >= 0 && diff <= 7;
    }
    return true;
  }).sort((a, b) => new Date(a.due) - new Date(b.due));

  return `
    <div class="page-content">
      <div class="page-header" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
        <div>
          <h1>Huiswerk</h1>
          <p>${homework.filter(h => !h.done).length} taken open</p>
        </div>
        <button class="btn btn-primary" onclick="openAddHomeworkModal()">
          ${icon('plus', 16)} Toevoegen
        </button>
      </div>

      <div class="hw-filters">
        <button class="btn btn-outline btn-sm ${hwFilter === 'alles' ? 'active' : ''}" onclick="setHwFilter('alles')">Alles</button>
        <button class="btn btn-outline btn-sm ${hwFilter === 'vandaag' ? 'active' : ''}" onclick="setHwFilter('vandaag')">Vandaag</button>
        <button class="btn btn-outline btn-sm ${hwFilter === 'week' ? 'active' : ''}" onclick="setHwFilter('week')">Deze week</button>
      </div>

      <div class="hw-list">
        ${filtered.length > 0 ? filtered.map(h => {
          const s = subjects[h.subject];
          const due = getDueText(h.due);
          return `
            <div class="hw-item ${h.done ? 'done' : ''}" onclick="toggleHomework(${h.id})">
              ${renderCheckbox(h.done, h.id, 'hw')}
              ${renderSubjectBadge(h.subject)}
              <div class="hw-info">
                <div class="hw-title">${h.title}</div>
                <div class="hw-due ${due.urgent ? 'urgent' : ''}">${due.text}</div>
              </div>
            </div>
          `;
        }).join('') : '<div class="empty-state"><p>Geen huiswerk gevonden voor dit filter</p></div>'}
      </div>
    </div>
  `;
}

function setHwFilter(filter) {
  hwFilter = filter;
  renderPage('huiswerk');
}

function toggleHomework(id) {
  const hw = homework.find(h => h.id === id);
  if (hw) {
    hw.done = !hw.done;
    saveHomework();
    if (hw.done) updateStreak();
    renderPage(currentPage);
  }
}

function openAddHomeworkModal() {
  const subjectOptions = Object.entries(subjects).map(([key, s]) =>
    `<option value="${key}">${s.name}</option>`
  ).join('');

  openModal('Huiswerk toevoegen', `
    <form onsubmit="addHomework(event)">
      <div class="form-group">
        <label class="form-label">Vak</label>
        <select class="form-select" id="hw-subject" required>
          <option value="">Kies een vak...</option>
          ${subjectOptions}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Opdracht</label>
        <input type="text" class="form-input" id="hw-title" placeholder="Beschrijf de opdracht..." required>
      </div>
      <div class="form-group">
        <label class="form-label">Deadline</label>
        <input type="date" class="form-input" id="hw-due" required>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:8px">
        ${icon('plus', 16)} Toevoegen
      </button>
    </form>
  `);
}

function addHomework(e) {
  e.preventDefault();
  const subject = document.getElementById('hw-subject').value;
  const title = document.getElementById('hw-title').value;
  const due = document.getElementById('hw-due').value;

  if (subject && title && due) {
    const newId = Math.max(100, ...homework.map(h => h.id)) + 1;
    homework.push({
      id: newId,
      subject: subject,
      title: title,
      due: new Date(due),
      done: false
    });
    saveHomework();
    closeModal();
    renderPage('huiswerk');
  }
}

// ==================== TOETSEN ====================
function renderToetsen() {
  loadTests();
  const sortedTests = [...tests].sort((a, b) => new Date(a.date) - new Date(b.date));

  return `
    <div class="page-content">
      <div class="page-header" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
        <div>
          <h1>Toetsen</h1>
          <p>${tests.length} aankomende toetsen</p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-primary btn-sm" onclick="openAddTestModal()">
            ${icon('plus', 14)} Toets toevoegen
          </button>
          <button class="btn ${magistarConnected ? 'btn-magister-connected' : 'btn-magister'} btn-sm" onclick="openMagisterModal('toetsen')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            ${magistarConnected ? 'Magister gekoppeld' : 'Koppel Magister'}
          </button>
        </div>
      </div>

      <div class="tests-list">
        ${sortedTests.map(t => {
          const s = subjects[t.subject];
          const due = getDueText(t.date);
          const daysLeft = Math.max(0, Math.round((new Date(t.date) - today) / 86400000));
          let badgeBg, badgeText;
          if (daysLeft <= 2) { badgeBg = '#FEE2E2'; badgeText = '#991B1B'; }
          else if (daysLeft <= 5) { badgeBg = '#FEF3C7'; badgeText = '#92400E'; }
          else { badgeBg = '#DCFCE7'; badgeText = '#166534'; }

          return `
            <div class="test-card" style="border-top-color:${s.color}">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
                <div class="test-subject" style="color:${s.color}">${s.name}</div>
                <div style="display:flex;align-items:center;gap:6px">
                  <span class="test-days-badge" style="background:${badgeBg};color:${badgeText}">
                    ${daysLeft === 0 ? 'Vandaag!' : `Nog ${daysLeft} dag${daysLeft !== 1 ? 'en' : ''}`}
                  </span>
                  <button class="lesson-action-btn" onclick="openEditTestModal(${t.id})" title="Bewerken">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                  </button>
                  <button class="lesson-action-btn delete" onclick="deleteTest(${t.id})" title="Verwijderen">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </div>
              </div>
              <div class="test-title">${t.title}</div>
              <div class="test-meta">
                <span class="test-meta-item">${icon('calendar', 14)} ${formatDate(t.date)}</span>
                <span class="test-meta-item">${icon('book', 14)} ${t.chapter}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function openAddTestModal() {
  const subjectOptions = Object.entries(subjects).map(([key, s]) =>
    `<option value="${key}">${s.name}</option>`
  ).join('');

  openModal('Toets toevoegen', `
    <form onsubmit="addTest(event)">
      <div class="form-group">
        <label class="form-label">Vak</label>
        <select class="form-select" id="test-subject" required>
          <option value="">Kies een vak...</option>
          ${subjectOptions}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Titel</label>
        <input type="text" class="form-input" id="test-title" placeholder="Bijv. Proefwerk H5" required>
      </div>
      <div class="form-group">
        <label class="form-label">Datum</label>
        <input type="date" class="form-input" id="test-date" required>
      </div>
      <div class="form-group">
        <label class="form-label">Hoofdstuk / Stof</label>
        <input type="text" class="form-input" id="test-chapter" placeholder="Bijv. H5-6" required>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:8px">
        ${icon('plus', 16)} Toevoegen
      </button>
    </form>
  `);
}

function addTest(e) {
  e.preventDefault();
  const subject = document.getElementById('test-subject').value;
  const title = document.getElementById('test-title').value;
  const date = document.getElementById('test-date').value;
  const chapter = document.getElementById('test-chapter').value;

  if (subject && title && date && chapter) {
    const newId = Math.max(100, ...tests.map(t => t.id)) + 1;
    tests.push({ id: newId, subject, title, date: new Date(date), chapter });
    saveTests();
    closeModal();
    renderPage('toetsen');
  }
}

function openEditTestModal(id) {
  const t = tests.find(x => x.id === id);
  if (!t) return;
  const subjectOptions = Object.entries(subjects).map(([key, s]) =>
    `<option value="${key}" ${key === t.subject ? 'selected' : ''}>${s.name}</option>`
  ).join('');
  const dateVal = new Date(t.date);
  const dateStr = `${dateVal.getFullYear()}-${String(dateVal.getMonth()+1).padStart(2,'0')}-${String(dateVal.getDate()).padStart(2,'0')}`;

  openModal('Toets bewerken', `
    <form onsubmit="editTest(event,${id})">
      <div class="form-group">
        <label class="form-label">Vak</label>
        <select class="form-select" id="edit-test-subject" required>${subjectOptions}</select>
      </div>
      <div class="form-group">
        <label class="form-label">Titel</label>
        <input type="text" class="form-input" id="edit-test-title" value="${t.title}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Datum</label>
        <input type="date" class="form-input" id="edit-test-date" value="${dateStr}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Hoofdstuk / Stof</label>
        <input type="text" class="form-input" id="edit-test-chapter" value="${t.chapter}" required>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:8px">
        Opslaan
      </button>
    </form>
  `);
}

function editTest(e, id) {
  e.preventDefault();
  const t = tests.find(x => x.id === id);
  if (!t) return;
  t.subject = document.getElementById('edit-test-subject').value;
  t.title = document.getElementById('edit-test-title').value;
  t.date = new Date(document.getElementById('edit-test-date').value);
  t.chapter = document.getElementById('edit-test-chapter').value;
  saveTests();
  closeModal();
  renderPage('toetsen');
}

function deleteTest(id) {
  tests = tests.filter(t => t.id !== id);
  saveTests();
  renderPage('toetsen');
}

// ==================== AGENDA ====================
let agendaYear = today.getFullYear();
let agendaMonth = today.getMonth();
let agendaSelectedDate = today;

function renderAgenda() {
  loadEvents();
  const months = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
                  'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];
  const dayLabels = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];

  const firstDay = new Date(agendaYear, agendaMonth, 1);
  let startDay = firstDay.getDay() - 1;
  if (startDay < 0) startDay = 6;

  const daysInMonth = new Date(agendaYear, agendaMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(agendaYear, agendaMonth, 0).getDate();

  // Build event map
  const eventMap = {};
  events.forEach(e => {
    const d = new Date(e.date);
    const key = d.toDateString();
    if (!eventMap[key]) eventMap[key] = [];
    eventMap[key].push(e);
  });

  const selectedKey = agendaSelectedDate.toDateString();
  const selectedEvents = eventMap[selectedKey] || [];

  let calendarDays = '';

  // Previous month
  for (let i = startDay - 1; i >= 0; i--) {
    calendarDays += `<div class="calendar-full-day other-month">${daysInPrevMonth - i}</div>`;
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(agendaYear, agendaMonth, d);
    const dateKey = date.toDateString();
    const isToday = dateKey === today.toDateString();
    const isSelected = dateKey === selectedKey;
    const dayEvents = eventMap[dateKey] || [];

    const classes = ['calendar-full-day'];
    if (isToday) classes.push('today');
    if (isSelected) classes.push('selected');

    const dots = dayEvents.length > 0 ? `
      <div class="calendar-event-dots">
        ${dayEvents.slice(0, 3).map(e => {
          const c = eventTypeColors[e.type];
          return `<span class="calendar-event-dot" style="background:${c ? c.text : '#6B7280'}"></span>`;
        }).join('')}
      </div>
    ` : '';

    calendarDays += `<div class="${classes.join(' ')}" onclick="selectAgendaDate(${agendaYear},${agendaMonth},${d})">${d}${dots}</div>`;
  }

  // Next month
  const totalCells = startDay + daysInMonth;
  const remaining = (7 - (totalCells % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    calendarDays += `<div class="calendar-full-day other-month">${d}</div>`;
  }

  // Calendar connections
  const connectedCals = Object.entries(calendarConnections).filter(([k,v]) => v);

  return `
    <div class="page-content">
      <div class="page-header" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
        <div>
          <h1>Agenda</h1>
          <p>${formatDate(agendaSelectedDate)}</p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-primary btn-sm" onclick="openAddEventModal()">
            ${icon('plus', 14)} Event toevoegen
          </button>
          <button class="btn btn-outline btn-sm" onclick="openCalendarConnectModal()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            Kalender koppelen ${connectedCals.length > 0 ? `(${connectedCals.length})` : ''}
          </button>
        </div>
      </div>

      ${connectedCals.length > 0 ? `
        <div class="connected-calendars-bar">
          ${connectedCals.map(([key]) => {
            const info = calendarApps[key];
            return `<span class="connected-cal-badge" style="background:${info.lightBg};color:${info.color}">
              ${info.icon} ${info.name}
            </span>`;
          }).join('')}
        </div>
      ` : ''}

      <div class="agenda-layout">
        <div class="card">
          <div class="calendar-full-header">
            <h2>${months[agendaMonth]} ${agendaYear}</h2>
            <div class="calendar-full-nav">
              <button onclick="navigateAgenda(-1)">${icons.chevronLeft}</button>
              <button onclick="navigateAgenda(1)">${icons.chevronRight}</button>
            </div>
          </div>
          <div class="calendar-full-grid">
            ${dayLabels.map(d => `<div class="calendar-full-day-name">${d}</div>`).join('')}
            ${calendarDays}
          </div>
        </div>

        <div>
          <div class="card">
            <div class="card-header">
              <div class="card-title">${icon('calendar')} ${isDateToday(agendaSelectedDate) ? 'Vandaag' : formatDate(agendaSelectedDate)}</div>
            </div>
            ${selectedEvents.length > 0 ? selectedEvents.map(e => {
              const typeInfo = eventTypeColors[e.type] || { bg: '#F3F4F6', text: '#374151', label: 'Overig' };
              return `
                <div class="event-item">
                  <span class="event-time">${e.time}</span>
                  <div class="event-info">
                    <div class="event-title">${e.title}</div>
                    <span class="event-type-badge" style="background:${typeInfo.bg};color:${typeInfo.text}">${typeInfo.label}</span>
                  </div>
                  <div class="event-actions">
                    <button class="lesson-action-btn" onclick="openEditEventModal(${e.id})" title="Bewerken">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                    </button>
                    <button class="lesson-action-btn delete" onclick="deleteEvent(${e.id})" title="Verwijderen">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  </div>
                </div>
              `;
            }).join('') : `
              <div class="empty-state">
                <p>Geen events op deze dag</p>
              </div>
            `}
          </div>

          <div class="card" style="margin-top:16px">
            <div class="card-header">
              <div class="card-title">${icon('clock')} Binnenkort</div>
            </div>
            ${events.filter(e => new Date(e.date) >= today).slice(0, 5).map(e => {
              const typeInfo = eventTypeColors[e.type] || { bg: '#F3F4F6', text: '#374151', label: 'Overig' };
              const due = getDueText(e.date);
              return `
                <div class="event-item" style="cursor:pointer" onclick="selectAgendaDate(${new Date(e.date).getFullYear()},${new Date(e.date).getMonth()},${new Date(e.date).getDate()})">
                  <span class="event-time">${due.text}</span>
                  <div class="event-info">
                    <div class="event-title">${e.title}</div>
                    <span class="event-type-badge" style="background:${typeInfo.bg};color:${typeInfo.text}">${typeInfo.label}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function isDateToday(date) {
  return date.toDateString() === today.toDateString();
}

function navigateAgenda(delta) {
  agendaMonth += delta;
  if (agendaMonth > 11) { agendaMonth = 0; agendaYear++; }
  if (agendaMonth < 0) { agendaMonth = 11; agendaYear--; }
  renderPage('agenda');
}

function selectAgendaDate(year, month, day) {
  agendaSelectedDate = new Date(year, month, day);
  agendaYear = year;
  agendaMonth = month;
  renderPage('agenda');
}

// --- Agenda Event CRUD ---
function openAddEventModal() {
  const dateVal = agendaSelectedDate;
  const dateStr = `${dateVal.getFullYear()}-${String(dateVal.getMonth()+1).padStart(2,'0')}-${String(dateVal.getDate()).padStart(2,'0')}`;

  openModal('Event toevoegen', `
    <form onsubmit="addEvent(event)">
      <div class="form-group">
        <label class="form-label">Titel</label>
        <input type="text" class="form-input" id="event-title" placeholder="Naam van het event..." required>
      </div>
      <div class="form-group">
        <label class="form-label">Datum</label>
        <input type="date" class="form-input" id="event-date" value="${dateStr}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Tijd</label>
        <input type="text" class="form-input" id="event-time" placeholder="Bijv. 09:00 - 10:00 of Hele dag" required>
      </div>
      <div class="form-group">
        <label class="form-label">Type</label>
        <select class="form-select" id="event-type" required>
          <option value="school">School</option>
          <option value="deadline">Deadline</option>
          <option value="toets">Toets</option>
          <option value="les">Les</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:8px">
        ${icon('plus', 16)} Toevoegen
      </button>
    </form>
  `);
}

function addEvent(e) {
  e.preventDefault();
  const title = document.getElementById('event-title').value;
  const date = document.getElementById('event-date').value;
  const time = document.getElementById('event-time').value;
  const type = document.getElementById('event-type').value;

  if (title && date && time && type) {
    const newId = Math.max(100, ...events.map(ev => ev.id)) + 1;
    events.push({ id: newId, date: new Date(date), title, time, type });
    saveEvents();
    closeModal();
    renderPage('agenda');
  }
}

function openEditEventModal(id) {
  const ev = events.find(e => e.id === id);
  if (!ev) return;
  const dateVal = new Date(ev.date);
  const dateStr = `${dateVal.getFullYear()}-${String(dateVal.getMonth()+1).padStart(2,'0')}-${String(dateVal.getDate()).padStart(2,'0')}`;

  openModal('Event bewerken', `
    <form onsubmit="editEvent(event,${id})">
      <div class="form-group">
        <label class="form-label">Titel</label>
        <input type="text" class="form-input" id="edit-event-title" value="${ev.title}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Datum</label>
        <input type="date" class="form-input" id="edit-event-date" value="${dateStr}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Tijd</label>
        <input type="text" class="form-input" id="edit-event-time" value="${ev.time}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Type</label>
        <select class="form-select" id="edit-event-type" required>
          <option value="school" ${ev.type === 'school' ? 'selected' : ''}>School</option>
          <option value="deadline" ${ev.type === 'deadline' ? 'selected' : ''}>Deadline</option>
          <option value="toets" ${ev.type === 'toets' ? 'selected' : ''}>Toets</option>
          <option value="les" ${ev.type === 'les' ? 'selected' : ''}>Les</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:8px">
        Opslaan
      </button>
    </form>
  `);
}

function editEvent(e, id) {
  e.preventDefault();
  const ev = events.find(x => x.id === id);
  if (!ev) return;
  ev.title = document.getElementById('edit-event-title').value;
  ev.date = new Date(document.getElementById('edit-event-date').value);
  ev.time = document.getElementById('edit-event-time').value;
  ev.type = document.getElementById('edit-event-type').value;
  saveEvents();
  closeModal();
  renderPage('agenda');
}

function deleteEvent(id) {
  events = events.filter(e => e.id !== id);
  saveEvents();
  renderPage('agenda');
}

// --- Calendar Connections ---
const calendarApps = {
  google:  { name: 'Google Calendar',    icon: '&#x1F7E2;', color: '#1A73E8', lightBg: '#E8F0FE' },
  apple:   { name: 'Apple Kalender',     icon: '&#x1F34E;', color: '#333333', lightBg: '#F5F5F5' },
  outlook: { name: 'Outlook Kalender',   icon: '&#x1F4E7;', color: '#0078D4', lightBg: '#E1F0FF' },
  ical:    { name: 'iCal / CalDAV',      icon: '&#x1F4C5;', color: '#5856D6', lightBg: '#EEEDFC' },
};

function openCalendarConnectModal() {
  openModal('Kalender koppelen', `
    <div class="connect-modal">
      <p class="connect-desc">Verbind je agenda met externe kalender apps om events automatisch te synchroniseren.</p>
      <div class="calendar-connect-list">
        ${Object.entries(calendarApps).map(([key, app]) => {
          const isConnected = calendarConnections[key] === true;
          const account = calendarAccounts[key] || {};
          return `
            <div class="calendar-connect-item ${isConnected ? 'connected' : ''}">
              <div class="calendar-connect-info">
                <span class="calendar-connect-icon" style="color:${app.color}">${app.icon}</span>
                <div>
                  <div class="calendar-connect-name">${app.name}</div>
                  <div class="calendar-connect-status">${isConnected ? `Verbonden als ${account.email || 'onbekend'}` : 'Niet verbonden'}</div>
                </div>
              </div>
              <button class="btn ${isConnected ? 'btn-outline' : 'btn-primary'} btn-sm"
                onclick="${isConnected ? `disconnectCalendar('${key}')` : `openCalendarLoginModal('${key}')`}">
                ${isConnected ? 'Ontkoppelen' : 'Verbinden'}
              </button>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `);
}

function openCalendarLoginModal(key) {
  const app = calendarApps[key];
  openModal(`Inloggen bij ${app.name}`, `
    <div class="connect-modal">
      <div class="connect-icon-large">
        <span style="font-size:48px;color:${app.color}">${app.icon}</span>
      </div>
      <p class="connect-desc">Log in met je ${app.name} account om je agenda te synchroniseren.</p>
      <form onsubmit="connectCalendar(event, '${key}')">
        <div class="form-group">
          <label class="form-label">E-mailadres</label>
          <input type="email" class="form-input" id="cal-email-${key}" placeholder="je@email.com" required>
        </div>
        <div class="form-group">
          <label class="form-label">Wachtwoord</label>
          <input type="password" class="form-input" id="cal-pass-${key}" placeholder="Je wachtwoord..." required>
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:8px;background:${app.color}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          Verbinden met ${app.name}
        </button>
      </form>
      <button class="btn btn-outline btn-sm" style="width:100%;justify-content:center;margin-top:8px" onclick="openCalendarConnectModal()">
        ← Terug naar overzicht
      </button>
    </div>
  `);
}

function connectCalendar(e, key) {
  e.preventDefault();
  const email = document.getElementById('cal-email-' + key).value.trim();
  calendarConnections[key] = true;
  calendarAccounts[key] = { email, connectedAt: new Date().toISOString() };
  saveCalendarConnections();
  openCalendarConnectModal();
  renderPage(currentPage);
}

function disconnectCalendar(key) {
  calendarConnections[key] = false;
  delete calendarAccounts[key];
  saveCalendarConnections();
  openCalendarConnectModal();
  renderPage(currentPage);
}

// ==================== CIJFERS ====================
function renderCijfers() {
  const overallAvg = getOverallAverage();
  const allGrades = Object.values(grades).flatMap(s => s.grades);
  const highest = Math.max(...allGrades).toFixed(1);
  const totalTests = allGrades.length;

  return `
    <div class="page-content">
      <div class="page-header">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
          <div>
            <h1>Cijfers</h1>
            <p>Overzicht van al je cijfers</p>
          </div>
          <button class="btn ${magistarConnected ? 'btn-magister-connected' : 'btn-magister'} btn-sm" onclick="openMagisterModal('cijfers')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            ${magistarConnected ? 'Magister gekoppeld' : 'Koppel Magister'}
          </button>
        </div>
      </div>

      <div class="grades-overview">
        <div class="grade-stat-card">
          <div class="grade-stat-value">${overallAvg}</div>
          <div class="grade-stat-label">Gemiddeld</div>
        </div>
        <div class="grade-stat-card">
          <div class="grade-stat-value">${highest}</div>
          <div class="grade-stat-label">Hoogste cijfer</div>
        </div>
        <div class="grade-stat-card">
          <div class="grade-stat-value">${totalTests}</div>
          <div class="grade-stat-label">Toetsen gemaakt</div>
        </div>
      </div>

      <div id="grades-list">
        ${Object.entries(grades).map(([subjectId, data]) => {
          const s = subjects[subjectId];
          const avg = getAverage(data.grades);
          const avgNum = parseFloat(avg);
          const avgClass = avgNum >= 7 ? 'grade-good' : avgNum >= 5.5 ? 'grade-ok' : 'grade-bad';

          return `
            <div class="subject-row">
              <div class="subject-row-header" onclick="toggleGrades('${subjectId}')">
                <div class="subject-color-bar" style="background:${s.color}"></div>
                <div class="subject-name">${s.name}</div>
                <div class="subject-teacher">${s.teacher}</div>
                <div class="subject-average ${avgClass}" style="padding:2px 10px;border-radius:6px">${avg}</div>
                <div class="subject-chevron" id="chevron-${subjectId}">${icons.chevronDown}</div>
              </div>
              <div class="subject-grades" id="grades-${subjectId}">
                ${data.grades.map((g, i) => {
                  const gClass = g >= 7 ? 'grade-good' : g >= 5.5 ? 'grade-ok' : 'grade-bad';
                  return `
                    <div class="grade-row">
                      <span class="grade-desc">${data.descriptions[i]}</span>
                      <span class="grade-value ${gClass}">${g.toFixed(1)}</span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function toggleGrades(subjectId) {
  const gradesEl = document.getElementById(`grades-${subjectId}`);
  const chevron = document.getElementById(`chevron-${subjectId}`);
  if (gradesEl) {
    gradesEl.classList.toggle('open');
    chevron.classList.toggle('open');
  }
}

// ==================== TODO FUNCTIONS ====================
function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.done = !todo.done;
    saveTodos();
    if (todo.done) updateStreak();
    renderPage(currentPage);
  }
}

function addTodo() {
  const input = document.getElementById('new-todo-input');
  const text = input.value.trim();
  if (text) {
    const newId = Math.max(0, ...todos.map(t => t.id)) + 1;
    todos.push({ id: newId, text: text, done: false });
    saveTodos();
    renderPage(currentPage);
  }
}

// ==================== INSTELLINGEN ====================
function renderInstellingen() {
  loadSettings();

  return `
    <div class="page-content">
      <div class="page-header">
        <h1>Instellingen</h1>
        <p>Pas je SchoolPlanner aan naar jouw wensen</p>
      </div>

      <div class="settings-grid">
        <!-- Profiel -->
        <div class="card settings-card">
          <div class="card-header">
            <div class="card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Profiel
            </div>
          </div>
          <div class="settings-section">
            <div class="form-group">
              <label class="form-label">Naam</label>
              <input type="text" class="form-input" id="setting-name" value="${appSettings.userName}" onchange="updateSetting('userName', this.value)">
            </div>
            <div class="form-group">
              <label class="form-label">E-mail</label>
              <input type="email" class="form-input" id="setting-email" value="${appSettings.userEmail}" onchange="updateSetting('userEmail', this.value)">
            </div>
            <div class="form-group">
              <label class="form-label">Klas</label>
              <input type="text" class="form-input" id="setting-class" value="${appSettings.userClass}" onchange="updateSetting('userClass', this.value)">
            </div>
            <div class="form-group">
              <label class="form-label">School</label>
              <input type="text" class="form-input" id="setting-school" value="${appSettings.schoolName}" onchange="updateSetting('schoolName', this.value)">
            </div>
          </div>
        </div>

        <!-- Rooster instellingen -->
        <div class="card settings-card">
          <div class="card-header">
            <div class="card-title">
              ${icon('clock')} Lesuren &amp; Rooster
            </div>
          </div>
          <div class="settings-section">
            <div class="form-group">
              <label class="form-label">Lesduur (minuten)</label>
              <input type="number" class="form-input" id="setting-duration" value="${appSettings.lessonDuration}" min="30" max="90" onchange="updateSetting('lessonDuration', parseInt(this.value))">
            </div>
            <div class="form-group">
              <label class="form-label">Eerste les begint om</label>
              <input type="time" class="form-input" id="setting-start" value="${appSettings.startTime}" onchange="updateSetting('startTime', this.value)">
            </div>
            <div class="form-group">
              <label class="form-label">Pauze na uur</label>
              <input type="number" class="form-input" id="setting-break-after" value="${appSettings.breakAfter}" min="1" max="8" onchange="updateSetting('breakAfter', parseInt(this.value))">
            </div>
            <div class="form-group">
              <label class="form-label">Pauzeduur (minuten)</label>
              <input type="number" class="form-input" id="setting-break-dur" value="${appSettings.breakDuration}" min="5" max="30" onchange="updateSetting('breakDuration', parseInt(this.value))">
            </div>
            <div class="form-group">
              <label class="form-label">Lunch na uur</label>
              <input type="number" class="form-input" id="setting-lunch-after" value="${appSettings.lunchAfter}" min="1" max="8" onchange="updateSetting('lunchAfter', parseInt(this.value))">
            </div>
            <div class="form-group">
              <label class="form-label">Lunchduur (minuten)</label>
              <input type="number" class="form-input" id="setting-lunch-dur" value="${appSettings.lunchDuration}" min="15" max="60" onchange="updateSetting('lunchDuration', parseInt(this.value))">
            </div>
          </div>
          <div class="settings-timetable-preview">
            <div class="settings-timetable-title">Uuroverzicht</div>
            ${generateTimetablePreview()}
          </div>
        </div>

        <!-- Koppelingen -->
        <div class="card settings-card">
          <div class="card-header">
            <div class="card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              Koppelingen
            </div>
          </div>
          <div class="settings-section">
            <div class="settings-connect-row">
              <div class="settings-connect-info">
                <strong>Magister</strong>
                <span class="settings-connect-status ${magistarConnected ? 'active' : ''}">${magistarConnected ? `Verbonden als ${magistarAccount.user || 'onbekend'}` : 'Niet verbonden'}</span>
              </div>
              <button class="btn ${magistarConnected ? 'btn-outline' : 'btn-primary'} btn-sm" onclick="openMagisterModal('instellingen')">
                ${magistarConnected ? 'Beheren' : 'Verbinden'}
              </button>
            </div>
            ${Object.entries(calendarApps).map(([key, app]) => {
              const isConn = calendarConnections[key] === true;
              const account = calendarAccounts[key] || {};
              return `
                <div class="settings-connect-row">
                  <div class="settings-connect-info">
                    <strong>${app.icon} ${app.name}</strong>
                    <span class="settings-connect-status ${isConn ? 'active' : ''}">${isConn ? `Verbonden als ${account.email || 'onbekend'}` : 'Niet verbonden'}</span>
                  </div>
                  <button class="btn ${isConn ? 'btn-outline' : 'btn-primary'} btn-sm" onclick="${isConn ? `disconnectCalendar('${key}')` : `openCalendarLoginModal('${key}')`}">
                    ${isConn ? 'Ontkoppelen' : 'Verbinden'}
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Meldingen & Overig -->
        <div class="card settings-card">
          <div class="card-header">
            <div class="card-title">
              ${icon('bell')} Meldingen &amp; Overig
            </div>
          </div>
          <div class="settings-section">
            <div class="settings-toggle-row">
              <div>
                <div class="settings-toggle-label">Meldingen</div>
                <div class="settings-toggle-desc">Ontvang notificaties voor deadlines en toetsen</div>
              </div>
              <label class="settings-toggle">
                <input type="checkbox" ${appSettings.notifications ? 'checked' : ''} onchange="updateSetting('notifications', this.checked)">
                <span class="settings-toggle-slider"></span>
              </label>
            </div>
            <div class="settings-toggle-row">
              <div>
                <div class="settings-toggle-label">Weekend verbergen</div>
                <div class="settings-toggle-desc">Verberg zaterdag en zondag in het rooster</div>
              </div>
              <label class="settings-toggle">
                <input type="checkbox" ${appSettings.weekendHidden ? 'checked' : ''} onchange="updateSetting('weekendHidden', this.checked)">
                <span class="settings-toggle-slider"></span>
              </label>
            </div>
          </div>
          <div class="settings-section" style="margin-top:20px;border-top:1px solid var(--gray-100);padding-top:20px">
            <div class="settings-plan-info">
              <div class="settings-plan-badge">${userPlan === 'pro' ? 'Pro' : userPlan === 'school' ? 'School' : 'Gratis'}</div>
              <div class="settings-plan-desc">
                ${userPlan === 'pro' ? 'Je hebt toegang tot alle functies inclusief koppelingen en onbeperkte opslag.' : 'Upgrade naar Pro voor koppelingen en meer functies.'}
              </div>
            </div>
          </div>
          <div style="margin-top:16px">
            <button class="btn btn-outline" style="width:100%;justify-content:center;color:#EF4444;border-color:#FCA5A5" onclick="handleLogout()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
              Uitloggen
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function updateSetting(key, value) {
  appSettings[key] = value;
  saveSettings();
  // Re-render navbar if name changed
  if (key === 'userName') {
    document.getElementById('navbar').innerHTML = renderNavbar();
  }
}

function generateTimetablePreview() {
  const start = appSettings.startTime.split(':').map(Number);
  let minutes = start[0] * 60 + start[1];
  let rows = '';

  for (let i = 1; i <= 8; i++) {
    const startH = Math.floor(minutes / 60);
    const startM = minutes % 60;
    const endMin = minutes + appSettings.lessonDuration;
    const endH = Math.floor(endMin / 60);
    const endM = endMin % 60;
    const timeStr = `${String(startH).padStart(2,'0')}:${String(startM).padStart(2,'0')} - ${String(endH).padStart(2,'0')}:${String(endM).padStart(2,'0')}`;

    rows += `<div class="timetable-preview-row"><span class="timetable-preview-hour">${i}e uur</span><span class="timetable-preview-time">${timeStr}</span></div>`;

    minutes = endMin;

    // Add breaks
    if (i === appSettings.breakAfter) {
      const breakEnd = minutes + appSettings.breakDuration;
      rows += `<div class="timetable-preview-row break"><span class="timetable-preview-hour">Pauze</span><span class="timetable-preview-time">${appSettings.breakDuration} min</span></div>`;
      minutes = breakEnd;
    } else if (i === appSettings.lunchAfter) {
      const lunchEnd = minutes + appSettings.lunchDuration;
      rows += `<div class="timetable-preview-row break"><span class="timetable-preview-hour">Lunch</span><span class="timetable-preview-time">${appSettings.lunchDuration} min</span></div>`;
      minutes = lunchEnd;
    }
  }

  return `<div class="timetable-preview">${rows}</div>`;
}
