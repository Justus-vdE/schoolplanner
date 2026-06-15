// ============================================================
// SchoolPlanner — Page Renderers
// ============================================================

// ==================== DASHBOARD ====================
function renderDashboard() {
  loadTodos();
  loadHomework();
  loadPlans();

  // Voortgang van je eerstvolgende toetsweek/examen voor de overzichtsbalk
  const dPlan = getDashboardPlan();
  const dSt = dPlan ? planStatus(dPlan) : null;
  const dLbl = dSt ? statusLabel(dSt) : null;

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
            ${Array.from({ length: 7 }, (_, i) => {
              const d = addDays(today, i - 6);
              const labels = ['Zo','Ma','Di','Wo','Do','Vr','Za'];
              const daysAgo = 6 - i;
              const isActive = streak > daysAgo;
              return `<div class="streak-day-dot ${isActive ? 'active' : ''}">${labels[d.getDay()]}</div>`;
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
        ${dPlan ? `
        <div class="progress-overview-divider"></div>
        <div class="progress-overview-item">
          <div class="progress-overview-ring">${renderCircularProgress(dSt.pct, 80, 7)}</div>
          <div class="progress-overview-info">
            <div class="progress-overview-label">Op schema</div>
            <div class="progress-overview-value ${dLbl.cls}">${dSt.pct >= 100 ? 'Klaar!' : dLbl.cls === 'behind' ? fmtHours(Math.abs(dSt.diff)) + ' achter' : dLbl.cls === 'ahead' ? fmtHours(dSt.diff) + ' vóór' : 'op schema'}</div>
          </div>
        </div>` : ''}
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
                const s = subjects[l.subject] || { name: l.subject, color: '#94A3B8' };
                const teacher = subjectTeacher(l.subject);
                return `
                  <div class="schedule-item">
                    <span class="schedule-time">${l.time}</span>
                    <span class="schedule-dot" style="background:${s.color}"></span>
                    <div class="schedule-info">
                      <div class="schedule-subject">${s.name}</div>
                      ${teacher ? `<div class="schedule-detail">${esc(teacher)}</div>` : ''}
                    </div>
                    <span class="schedule-room">${esc(l.room)}</span>
                  </div>
                `;
              }).join('') : '<div class="empty-state empty-state-compact"><p>Geen lessen vandaag!</p></div>'}
            </div>

            ${dPlan && dSt ? renderStudyTodayCard(dPlan, dSt) : ''}

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
                const s = subjects[h.subject] || { name: h.subject };
                return `
                  <div class="todo-item" onclick="toggleHomework(${h.id})">
                    ${renderCheckbox(h.done, h.id, 'hw')}
                    <div style="flex:1">
                      <div class="todo-text ${h.done ? 'done' : ''}">${esc(h.title)}</div>
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
                    <span class="todo-text ${t.done ? 'done' : ''}">${esc(t.text)}</span>
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
          ${renderPlannerDashboardCard()}
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
          <button class="btn ${getMagisterIcsUrl() ? 'btn-magister-connected' : 'btn-magister'} btn-sm" onclick="openMagisterIcsModal()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            ${getMagisterIcsUrl() ? 'Magister gekoppeld' : 'Koppel Magister'}
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
                  const s = subjects[l.subject] || { name: l.subject, color: '#94A3B8', light: '#F1F5F9' };
                  const teacher = subjectTeacher(l.subject);
                  return `
                    <div class="lesson-block" style="background:${s.light};border-color:${s.color}">
                      <div class="lesson-hour">${l.hour}e uur &middot; ${l.time}</div>
                      <div class="lesson-subject" style="color:${s.color}">${s.name}</div>
                      <div class="lesson-detail">${teacher ? `${esc(teacher)} &middot; ` : ''}${esc(l.room)}</div>
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
  const subjectOptions = mySubjectEntries().map(([key, s]) =>
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
          ${Object.entries(lessonHourTimes()).map(([h, t]) => `<option value="${h}">${h}e uur (${t})</option>`).join('')}
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

function addLesson(e) {
  e.preventDefault();
  const day = document.getElementById('lesson-day').value;
  const hour = parseInt(document.getElementById('lesson-hour').value);
  const subject = document.getElementById('lesson-subject').value;
  const room = document.getElementById('lesson-room').value;

  if (day && hour && subject && room) {
    if (!schedule[day]) schedule[day] = [];
    schedule[day].push({ hour, time: lessonHourTimes()[hour], subject, room });
    schedule[day].sort((a, b) => a.hour - b.hour);
    saveSchedule();
    closeModal();
    renderPage('rooster');
  }
}

function openEditLessonModal(day, index) {
  const lesson = schedule[day][index];
  const subjectOptions = mySubjectEntries().map(([key, s]) =>
    `<option value="${key}" ${key === lesson.subject ? 'selected' : ''}>${s.name}</option>`
  ).join('');

  openModal('Les bewerken', `
    <form onsubmit="editLesson(event,'${day}',${index})">
      <div class="form-group">
        <label class="form-label">Uur</label>
        <select class="form-select" id="edit-lesson-hour" required>
          ${Object.entries(lessonHourTimes()).map(([h, t]) =>
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
        <input type="text" class="form-input" id="edit-lesson-room" value="${esc(lesson.room)}" required>
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

  schedule[day][index] = { hour, time: lessonHourTimes()[hour], subject, room };
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

// --- Magister-rooster koppelen via agenda-link (iCal) ---
function openMagisterIcsModal() {
  const saved = getMagisterIcsUrl();
  openModal('Magister-rooster koppelen', `
    ${saved ? `
      <div class="connect-status connected" style="margin-bottom:12px">
        <span class="connect-status-dot active"></span> Gekoppeld via agenda-link
      </div>
      <div style="display:flex;gap:8px;margin-bottom:16px">
        <button class="btn btn-primary" style="flex:1;justify-content:center" onclick="importMagisterIcs(true)" id="ics-import-btn">
          &#128260; Rooster vernieuwen
        </button>
        <button class="btn btn-outline" onclick="saveMagisterIcsUrl('');closeModal();renderPage('rooster')">Ontkoppelen</button>
      </div>
      <div class="login-divider"><span>of nieuwe link plakken</span></div>
    ` : `
      <p class="connect-desc" style="text-align:left">Zo vind je jouw persoonlijke agenda-link in Magister:</p>
      <ol style="margin:0 0 14px;padding-left:20px;color:var(--gray-600);font-size:0.88rem;line-height:1.7">
        <li>Open <strong>Magister</strong> (web of app) en ga naar <strong>Agenda</strong></li>
        <li>Klik op het <strong>tandwiel / instellingen</strong> (of de drie puntjes)</li>
        <li>Kies <strong>"Agenda koppelen"</strong> en zet de koppeling <strong>aan</strong></li>
        <li><strong>Kopieer de link</strong> (begint met https:// of webcal://)</li>
      </ol>
    `}
    <div class="form-group">
      <label class="form-label">Plak hier je agenda-link</label>
      <input type="text" class="form-input" id="ics-url-input" placeholder="https://...magister.net/...">
    </div>
    <button class="btn btn-primary" style="width:100%;justify-content:center" onclick="importMagisterIcs(false)" id="ics-link-btn">
      Koppel &amp; importeer rooster
    </button>
    <p class="form-hint" style="margin-top:10px">Je rooster voor de komende week wordt overgenomen (ma t/m vr). Vernieuwen kan daarna met &eacute;&eacute;n klik. Je wachtwoord is niet nodig.</p>
  `);
}

async function importMagisterIcs(useStored) {
  let url = useStored ? getMagisterIcsUrl() : (document.getElementById('ics-url-input').value || '').trim();
  if (!url && useStored === false) { alert('Plak eerst je agenda-link uit Magister.'); return; }
  if (!url) return;
  url = url.replace(/^webcal:\/\//i, 'https://');
  if (!/^https:\/\//i.test(url)) { alert('Dat lijkt geen geldige link. Hij moet beginnen met https:// of webcal://'); return; }

  const btn = document.getElementById(useStored ? 'ics-import-btn' : 'ics-link-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Bezig met ophalen...'; }

  try {
    const resp = await fetch('/api/ics?url=' + encodeURIComponent(url));
    if (!resp.ok) throw new Error(await resp.text() || ('Fout ' + resp.status));
    const text = await resp.text();
    const events = parseIcs(text);
    if (!events.length) throw new Error('Geen agenda-items gevonden. Controleer of de koppeling in Magister aan staat.');

    const newSchedule = icsToWeekSchedule(events);
    const lessonCount = Object.values(newSchedule).reduce((s, d) => s + d.length, 0);
    if (!lessonCount) throw new Error('Geen lessen gevonden voor de komende week (vakantie?). Probeer het later opnieuw.');

    if (!confirm(`${lessonCount} lessen gevonden voor de komende week. Je huidige rooster wordt vervangen. Doorgaan?`)) {
      if (btn) { btn.disabled = false; btn.textContent = useStored ? '🔄 Rooster vernieuwen' : 'Koppel & importeer rooster'; }
      return;
    }

    schedule = newSchedule;
    saveSchedule();
    saveMagisterIcsUrl(url);
    closeModal();
    renderPage('rooster');
  } catch (err) {
    const offline = location.protocol === 'file:';
    alert('Importeren mislukt: ' + (offline
      ? 'deze koppeling werkt alleen op de online versie (examen-planner.nl).'
      : (err.message || 'onbekende fout')));
    if (btn) { btn.disabled = false; btn.textContent = useStored ? '🔄 Rooster vernieuwen' : 'Koppel & importeer rooster'; }
  }
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
        <div class="demo-note">&#9888;&#65039; Demo: er wordt geen echte verbinding gemaakt. Vul hier <strong>niet</strong> je echte Magister-wachtwoord in.</div>
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
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-primary" onclick="openAddHomeworkModal()">
            ${icon('plus', 16)} Toevoegen
          </button>
          <button class="btn btn-outline" onclick="openPasteHomeworkModal()">
            &#128203; Lijst plakken
          </button>
        </div>
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
                <div class="hw-title">${esc(h.title)}</div>
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
  const subjectOptions = mySubjectEntries().map(([key, s]) =>
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

function openPasteHomeworkModal() {
  const subjectOptions = mySubjectEntries().map(([key, s]) =>
    `<option value="${key}">${s.name}</option>`).join('');
  const todayStr = dateKey(today);
  openModal('Lijst met opgaves plakken', `
    <p style="color:var(--gray-500);font-size:0.85rem;margin:0 0 12px">
      Plak hieronder je opgaves — <strong>elke regel wordt een losse huiswerkopdracht</strong>.
      Begint een regel met een vak(afkorting), dan wordt dat vak gebruikt; anders het standaardvak hieronder.
    </p>
    <textarea class="form-input" id="paste-hw-input" rows="7" placeholder="Bijv.:&#10;wi H5 opgaven 1 t/m 15&#10;ne boekverslag afmaken&#10;Samenvatting paragraaf 3.2" style="resize:vertical;font-size:0.85rem"></textarea>
    <div style="display:flex;gap:10px;margin-top:12px">
      <div class="form-group" style="flex:1;margin:0">
        <label class="form-label">Standaardvak</label>
        <select class="form-select" id="paste-hw-subject" required>
          <option value="">Kies een vak...</option>
          ${subjectOptions}
        </select>
      </div>
      <div class="form-group" style="flex:1;margin:0">
        <label class="form-label">Deadline (voor alle regels)</label>
        <input type="date" class="form-input" id="paste-hw-due" value="${todayStr}" required>
      </div>
    </div>
    <button class="btn btn-primary" style="width:100%;justify-content:center;margin-top:14px" onclick="importPastedHomework()">
      ${icon('plus', 16)} Opgaves toevoegen
    </button>
  `);
}

function importPastedHomework() {
  const text = document.getElementById('paste-hw-input').value;
  const defaultSubject = document.getElementById('paste-hw-subject').value;
  const due = document.getElementById('paste-hw-due').value;
  const rows = parsePastedItems(text);
  if (!rows.length) { alert('Geen opgaves gevonden — plak minstens één regel tekst.'); return; }
  if (!due) { alert('Kies een deadline.'); return; }
  if (!defaultSubject && rows.some(r => !r.subject)) { alert('Kies een standaardvak (niet elke regel heeft een herkenbaar vak).'); return; }

  let nextId = Math.max(100, ...homework.map(h => h.id)) + 1;
  rows.forEach(r => {
    homework.push({
      id: nextId++,
      subject: r.subject || defaultSubject,
      title: r.title,
      due: new Date(due),
      done: false,
    });
  });
  saveHomework();
  closeModal();
  renderPage('huiswerk');
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
              <div class="test-title">${esc(t.title)}</div>
              <div class="test-meta">
                <span class="test-meta-item">${icon('calendar', 14)} ${formatDate(t.date)}</span>
                <span class="test-meta-item">${icon('book', 14)} ${esc(t.chapter)}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function openAddTestModal() {
  const subjectOptions = mySubjectEntries().map(([key, s]) =>
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
  const subjectOptions = mySubjectEntries().map(([key, s]) =>
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
        <input type="text" class="form-input" id="edit-test-title" value="${esc(t.title)}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Datum</label>
        <input type="date" class="form-input" id="edit-test-date" value="${dateStr}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Hoofdstuk / Stof</label>
        <input type="text" class="form-input" id="edit-test-chapter" value="${esc(t.chapter)}" required>
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

  // Build event map (eigen events + gekoppelde agenda's)
  const eventMap = {};
  allAgendaEvents().forEach(e => {
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

  // Gekoppelde agenda's
  loadIcalFeeds();
  const connectedCals = icalFeeds;

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
          ${connectedCals.map(f => `<span class="connected-cal-badge" style="background:#E0E7FF;color:#3730A3">&#128197; ${esc(f.name)}</span>`).join('')}
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
              const badgeLabel = e.type === 'ical' ? esc(e.source || 'Agenda') : typeInfo.label;
              return `
                <div class="event-item">
                  <span class="event-time">${e.time}</span>
                  <div class="event-info">
                    <div class="event-title">${esc(e.title)}</div>
                    <span class="event-type-badge" style="background:${typeInfo.bg};color:${typeInfo.text}">${badgeLabel}</span>
                  </div>
                  ${e.readonly ? '' : `<div class="event-actions">
                    <button class="lesson-action-btn" onclick="openEditEventModal(${e.id})" title="Bewerken">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                    </button>
                    <button class="lesson-action-btn delete" onclick="deleteEvent(${e.id})" title="Verwijderen">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  </div>`}
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
            ${allAgendaEvents().filter(e => new Date(e.date) >= today).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5).map(e => {
              const typeInfo = eventTypeColors[e.type] || { bg: '#F3F4F6', text: '#374151', label: 'Overig' };
              const badgeLabel = e.type === 'ical' ? esc(e.source || 'Agenda') : typeInfo.label;
              const due = getDueText(e.date);
              return `
                <div class="event-item" style="cursor:pointer" onclick="selectAgendaDate(${new Date(e.date).getFullYear()},${new Date(e.date).getMonth()},${new Date(e.date).getDate()})">
                  <span class="event-time">${due.text}</span>
                  <div class="event-info">
                    <div class="event-title">${esc(e.title)}</div>
                    <span class="event-type-badge" style="background:${typeInfo.bg};color:${typeInfo.text}">${badgeLabel}</span>
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
        <input type="text" class="form-input" id="edit-event-title" value="${esc(ev.title)}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Datum</label>
        <input type="date" class="form-input" id="edit-event-date" value="${dateStr}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Tijd</label>
        <input type="text" class="form-input" id="edit-event-time" value="${esc(ev.time)}" required>
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
function openCalendarConnectModal() {
  loadIcalFeeds();
  const dt = (iso) => { const d = new Date(iso); return `${d.getDate()}-${d.getMonth() + 1} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };

  openModal('Kalender koppelen', `
    ${icalFeeds.length ? `
      <div class="ical-feed-list">
        ${icalFeeds.map(f => `
          <div class="ical-feed-row">
            <div class="ical-feed-info">
              <strong>&#128197; ${esc(f.name)}</strong>
              <span>${(icalEventsCache[f.id] || []).length} afspraken · vernieuwd ${f.lastSync ? dt(f.lastSync) : 'nooit'}</span>
            </div>
            <button class="lesson-action-btn" onclick="refreshIcalFeed(${f.id})" title="Vernieuwen" id="ical-refresh-${f.id}">&#128260;</button>
            <button class="lesson-action-btn delete" onclick="removeIcalFeed(${f.id})" title="Ontkoppelen">${icons.x}</button>
          </div>
        `).join('')}
      </div>
      <div class="login-divider"><span>nieuwe agenda toevoegen</span></div>
    ` : `
      <p class="connect-desc" style="text-align:left">Koppel je agenda via een <strong>iCal-link</strong> — alleen-lezen, geen wachtwoord nodig. Zo vind je de link:</p>
    `}
    <div class="ical-help">
      <details>
        <summary>&#128197; Google Calendar</summary>
        <ol><li>Open <strong>calendar.google.com</strong> op een computer</li><li>Tandwiel &rarr; <strong>Instellingen</strong> &rarr; klik links op jouw agenda</li><li>Scroll naar <strong>"Agenda integreren"</strong></li><li>Kopieer het <strong>"Geheime adres in iCal-indeling"</strong></li></ol>
      </details>
      <details>
        <summary>&#127822; Apple / iCloud</summary>
        <ol><li>Ga naar <strong>icloud.com/calendar</strong> (of de Agenda-app op Mac)</li><li>Klik op het <strong>deel-icoontje</strong> naast je agenda</li><li>Zet <strong>"Openbare agenda"</strong> aan</li><li>Kopieer de link (begint met webcal://)</li></ol>
      </details>
      <details>
        <summary>&#128231; Outlook</summary>
        <ol><li>Open <strong>outlook.com</strong> &rarr; Agenda</li><li>Instellingen &rarr; <strong>Gedeelde agenda's</strong></li><li>Bij "Een agenda publiceren": kies je agenda &rarr; <strong>Publiceren</strong></li><li>Kopieer de <strong>ICS-link</strong></li></ol>
      </details>
    </div>
    <div style="display:flex;gap:10px;margin-top:14px">
      <div class="form-group" style="flex:0 0 35%;margin:0">
        <label class="form-label">Naam</label>
        <input type="text" class="form-input" id="ical-name" placeholder="Bijv. Privé">
      </div>
      <div class="form-group" style="flex:1;margin:0">
        <label class="form-label">iCal-link</label>
        <input type="text" class="form-input" id="ical-url" placeholder="https://... of webcal://...">
      </div>
    </div>
    <button class="btn btn-primary" style="width:100%;justify-content:center;margin-top:14px" onclick="addIcalFeed()" id="ical-add-btn">
      Koppel &amp; importeer
    </button>
  `);
}

async function addIcalFeed() {
  let url = (document.getElementById('ical-url').value || '').trim();
  const name = (document.getElementById('ical-name').value || '').trim();
  if (!url) { alert('Plak eerst de iCal-link van je agenda.'); return; }
  url = url.replace(/^webcal:\/\//i, 'https://');
  if (!/^https:\/\//i.test(url)) { alert('Dat lijkt geen geldige link. Hij moet beginnen met https:// of webcal://'); return; }

  const btn = document.getElementById('ical-add-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Bezig met ophalen...'; }
  try {
    const items = await fetchIcalItems(url);
    const id = Date.now();
    let feedName = name;
    if (!feedName) {
      try { feedName = new URL(url).hostname.replace('www.', '').split('.')[0]; } catch (e) { feedName = 'Agenda'; }
      feedName = feedName.charAt(0).toUpperCase() + feedName.slice(1);
    }
    icalFeeds.push({ id, name: feedName, url, lastSync: new Date().toISOString() });
    icalEventsCache[id] = items;
    saveIcalFeeds();
    openCalendarConnectModal();
    renderPage(currentPage);
  } catch (err) {
    const offline = location.protocol === 'file:';
    alert('Koppelen mislukt: ' + (offline
      ? 'dit werkt alleen op de online versie (examen-planner.nl).'
      : (err.message || 'onbekende fout')));
    if (btn) { btn.disabled = false; btn.textContent = 'Koppel & importeer'; }
  }
}

async function fetchIcalItems(url) {
  const resp = await fetch('/api/ics?url=' + encodeURIComponent(url));
  if (!resp.ok) throw new Error(await resp.text() || ('Fout ' + resp.status));
  const items = icalToAgendaItems(parseIcs(await resp.text()));
  if (!items.length) throw new Error('Geen afspraken gevonden in deze agenda (voor de komende 3 maanden).');
  return items;
}

async function refreshIcalFeed(id) {
  const feed = icalFeeds.find(f => f.id === id);
  if (!feed) return;
  const btn = document.getElementById('ical-refresh-' + id);
  if (btn) btn.textContent = '⏳';
  try {
    icalEventsCache[id] = await fetchIcalItems(feed.url);
    feed.lastSync = new Date().toISOString();
    saveIcalFeeds();
    openCalendarConnectModal();
    renderPage(currentPage);
  } catch (err) {
    alert('Vernieuwen mislukt: ' + (err.message || 'onbekende fout'));
    if (btn) btn.textContent = '🔄';
  }
}

function removeIcalFeed(id) {
  if (!confirm('Deze agenda ontkoppelen? De geïmporteerde afspraken verdwijnen uit je Agenda.')) return;
  icalFeeds = icalFeeds.filter(f => f.id !== id);
  delete icalEventsCache[id];
  saveIcalFeeds();
  openCalendarConnectModal();
  renderPage(currentPage);
}

// ==================== CIJFERS ====================
function renderCijfers() {
  loadGrades();
  const entries = Object.entries(grades).filter(([id, d]) => subjects[id] && d.grades.length);
  const allGrades = entries.flatMap(([, s]) => s.grades);
  let oSum = 0, oW = 0;
  entries.forEach(([, d]) => d.grades.forEach((g, i) => {
    const w = (d.weights && d.weights[i]) || 1;
    oSum += g * w; oW += w;
  }));
  const overallAvg = oW > 0 ? (oSum / oW).toFixed(1) : '-';
  const highest = allGrades.length ? Math.max(...allGrades).toFixed(1) : '-';
  const totalTests = allGrades.length;

  return `
    <div class="page-content">
      <div class="page-header">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
          <div>
            <h1>Cijfers</h1>
            <p>Overzicht van al je cijfers</p>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="btn btn-primary btn-sm" onclick="openAddGradeModal()">
              ${icon('plus', 14)} Cijfer toevoegen
            </button>
            <button class="btn btn-outline btn-sm" onclick="openPasteGradesModal()">
              &#128203; Plak uit Magister
            </button>
            <button class="btn btn-outline btn-sm" onclick="openTargetGradeModal()">
              &#127919; Wat moet ik halen?
            </button>
            ${entries.length > 0 ? `
            <button class="btn btn-outline btn-sm" onclick="openGradeDetailsModal()">
              &#128202; Uitgebreid overzicht
            </button>` : ''}
            ${entries.length > 0 ? `
            <button class="btn btn-outline btn-sm" style="color:#EF4444;border-color:#FCA5A5" onclick="deleteAllGrades()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              Alles verwijderen
            </button>` : ''}
            <button class="btn ${magistarConnected ? 'btn-magister-connected' : 'btn-magister'} btn-sm" onclick="openMagisterModal('cijfers')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              ${magistarConnected ? 'Magister gekoppeld' : 'Koppel Magister'}
            </button>
          </div>
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
        ${entries.length === 0 ? `
          <div class="card"><div class="empty-state">
            <p>Nog geen cijfers. Voeg je eerste cijfer toe!</p>
            <button class="btn btn-primary btn-sm" style="margin-top:10px" onclick="openAddGradeModal()">${icon('plus', 14)} Cijfer toevoegen</button>
          </div></div>
        ` : entries.map(([subjectId, data]) => {
          const s = subjects[subjectId];
          const teacher = subjectTeacher(subjectId);
          const avg = getWeightedAverage(data);
          const avgNum = parseFloat(avg);
          const avgClass = avgNum >= 7 ? 'grade-good' : avgNum >= 5.5 ? 'grade-ok' : 'grade-bad';

          return `
            <div class="subject-row">
              <div class="subject-row-header" onclick="toggleGrades('${subjectId}')">
                <div class="subject-color-bar" style="background:${s.color}"></div>
                <div class="subject-name">${s.name}</div>
                <div class="subject-teacher">${esc(teacher)}</div>
                <div class="subject-average ${avgClass}" style="padding:2px 10px;border-radius:6px">${avg}</div>
                <div class="subject-chevron" id="chevron-${subjectId}">${icons.chevronDown}</div>
              </div>
              <div class="subject-grades" id="grades-${subjectId}">
                ${data.grades.map((g, i) => {
                  const gClass = g >= 7 ? 'grade-good' : g >= 5.5 ? 'grade-ok' : 'grade-bad';
                  return `
                    <div class="grade-row">
                      <span class="grade-desc">${esc(data.descriptions[i])}</span>
                      <span class="grade-weight" title="Weging">${(data.weights && data.weights[i]) || 1}&times;</span>
                      <span class="grade-value ${gClass}">${g.toFixed(1)}</span>
                      <div class="grade-actions">
                        <button class="lesson-action-btn" onclick="event.stopPropagation();openEditGradeModal('${subjectId}',${i})" title="Bewerken">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                        </button>
                        <button class="lesson-action-btn delete" onclick="event.stopPropagation();deleteGrade('${subjectId}',${i})" title="Verwijderen">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>
                        </button>
                      </div>
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

function openAddGradeModal() {
  const subjectOptions = mySubjectEntries().map(([key, s]) =>
    `<option value="${key}">${s.name}</option>`).join('');
  openModal('Cijfer toevoegen', `
    <form onsubmit="addGrade(event)">
      <div class="form-group">
        <label class="form-label">Vak</label>
        <select class="form-select" id="grade-subject" required>
          <option value="">Kies een vak...</option>
          ${subjectOptions}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Omschrijving</label>
        <input type="text" class="form-input" id="grade-desc" placeholder="Bijv. Proefwerk H5" required>
      </div>
      <div style="display:flex;gap:10px">
        <div class="form-group" style="flex:1">
          <label class="form-label">Cijfer</label>
          <input type="number" class="form-input" id="grade-value" min="1" max="10" step="0.1" placeholder="Bijv. 7,5" required>
        </div>
        <div class="form-group" style="flex:1">
          <label class="form-label">Weging</label>
          <input type="number" class="form-input" id="grade-weight" min="0" max="20" step="0.5" value="1">
        </div>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:8px">
        ${icon('plus', 16)} Toevoegen
      </button>
    </form>
  `);
}

function addGrade(e) {
  e.preventDefault();
  const subject = document.getElementById('grade-subject').value;
  const desc = document.getElementById('grade-desc').value.trim();
  const value = parseFloat(document.getElementById('grade-value').value);
  const weight = parseFloat(document.getElementById('grade-weight').value);
  if (!subject || !desc || isNaN(value) || value < 1 || value > 10) return;
  if (!grades[subject]) grades[subject] = { grades: [], descriptions: [], weights: [] };
  if (!Array.isArray(grades[subject].weights)) grades[subject].weights = grades[subject].grades.map(() => 1);
  grades[subject].grades.push(Math.round(value * 10) / 10);
  grades[subject].descriptions.push(desc);
  grades[subject].weights.push(isNaN(weight) || weight < 0 ? 1 : weight);
  saveGrades();
  closeModal();
  renderPage('cijfers');
}

// --- Wat moet ik halen? ---
function openTargetGradeModal() {
  const subjectOptions = mySubjectEntries().map(([key, s]) =>
    `<option value="${key}">${s.name}</option>`).join('');
  openModal('Wat moet ik halen?', `
    <p style="color:var(--gray-500);font-size:0.85rem;margin:0 0 14px">
      Bereken welk cijfer je minimaal moet halen op je volgende toets om op je doelgemiddelde uit te komen.
    </p>
    <div class="form-group">
      <label class="form-label">Vak</label>
      <select class="form-select" id="target-subject" required>
        <option value="">Kies een vak...</option>
        ${subjectOptions}
      </select>
    </div>
    <div style="display:flex;gap:10px">
      <div class="form-group" style="flex:1">
        <label class="form-label">Doelgemiddelde</label>
        <input type="number" class="form-input" id="target-avg" min="1" max="10" step="0.1" value="5.5">
      </div>
      <div class="form-group" style="flex:1">
        <label class="form-label">Weging volgende toets</label>
        <input type="number" class="form-input" id="target-weight" min="0.5" max="20" step="0.5" value="1">
      </div>
    </div>
    <button class="btn btn-primary" style="width:100%;justify-content:center" onclick="calcTargetGrade()">Bereken</button>
    <div id="target-result"></div>
  `);
}

function calcTargetGrade() {
  const subjectId = document.getElementById('target-subject').value;
  const target = parseFloat(document.getElementById('target-avg').value);
  const weight = parseFloat(document.getElementById('target-weight').value);
  const box = document.getElementById('target-result');
  if (!box) return;
  if (!subjectId || isNaN(target) || isNaN(weight) || weight <= 0) {
    box.innerHTML = '<p style="color:#B91C1C;font-size:0.85rem;margin-top:12px">Kies een vak en vul een geldig doel en weging in.</p>';
    return;
  }

  const { sum, totalWeight } = gradeTotals(subjectId);
  const current = totalWeight > 0 ? (sum / totalWeight) : null;
  const req = requiredGradeFor(subjectId, target, weight);
  const reqRounded = Math.ceil(req * 10) / 10;
  const s = subjects[subjectId];

  let verdict, cls;
  if (req > 10) {
    verdict = `Helaas: zelfs met een 10 kom je nog niet op een ${target.toString().replace('.', ',')} gemiddeld. Je zou een ${reqRounded.toFixed(1).replace('.', ',')} nodig hebben. Met meerdere toetsen kan het nog wel — blijven knokken!`;
    cls = 'behind';
  } else if (req <= 1) {
    verdict = `Je staat al veilig! Zelfs met een 1,0 blijft je gemiddelde op of boven de ${target.toString().replace('.', ',')}.`;
    cls = 'ahead';
  } else {
    verdict = `Je moet minimaal een <strong style="font-size:1.4rem">${reqRounded.toFixed(1).replace('.', ',')}</strong> halen (weging ${weight}).`;
    cls = reqRounded >= 8 ? 'behind' : reqRounded >= 6.5 ? 'ontrack' : 'ahead';
  }

  box.innerHTML = `
    <div class="plan-status-banner ${cls}" style="margin-top:14px;display:block">
      <div style="font-size:0.8rem;color:var(--gray-500);margin-bottom:4px">
        ${s.name} — huidig gemiddelde: <strong>${current != null ? current.toFixed(1).replace('.', ',') : 'nog geen cijfers'}</strong> (totaalgewicht ${totalWeight})
      </div>
      <div style="font-size:0.95rem">${verdict}</div>
    </div>
  `;
}

// --- Uitgebreid cijferoverzicht ---
function openGradeDetailsModal() {
  const entries = Object.entries(grades).filter(([id, d]) => subjects[id] && d.grades.length);
  if (!entries.length) return;

  let oSum = 0, oW = 0, allCount = 0, failCount = 0;
  const rows = entries.map(([id, d]) => {
    let sum = 0, tw = 0, fails = 0;
    d.grades.forEach((g, i) => {
      const w = (d.weights && d.weights[i]) || 1;
      sum += g * w; tw += w;
      if (g < 5.5) fails++;
    });
    oSum += sum; oW += tw; allCount += d.grades.length; failCount += fails;
    const avg = tw > 0 ? sum / tw : 0;
    const need55 = requiredGradeFor(id, 5.5, 1);
    return {
      id,
      name: subjects[id].name,
      color: subjects[id].color,
      avg,
      count: d.grades.length,
      high: Math.max(...d.grades),
      low: Math.min(...d.grades),
      fails,
      last: d.grades[d.grades.length - 1],
      need55,
    };
  }).sort((a, b) => a.avg - b.avg); // laagste gemiddelde bovenaan: daar is werk

  const f = (n) => n.toFixed(1).replace('.', ',');
  const overall = oW > 0 ? oSum / oW : 0;

  openModal('Uitgebreid cijferoverzicht', `
    <div class="grades-detail-summary">
      <div><strong>${f(overall)}</strong><span>gewogen gemiddeld</span></div>
      <div><strong>${allCount}</strong><span>cijfers</span></div>
      <div><strong>${failCount}</strong><span>onvoldoendes</span></div>
      <div><strong>${rows.filter(r => r.avg < 5.5).length}</strong><span>vak${rows.filter(r => r.avg < 5.5).length !== 1 ? 'ken' : ''} onder 5,5</span></div>
    </div>
    <div class="grades-detail-table">
      <div class="grades-detail-row head">
        <span>Vak</span><span>Gem.</span><span>Aantal</span><span>Hoogste</span><span>Laagste</span><span>Onvold.</span><span>Nodig voor 5,5</span>
      </div>
      ${rows.map(r => `
        <div class="grades-detail-row">
          <span class="gd-name"><span class="schedule-dot" style="background:${r.color}"></span>${r.name}</span>
          <span class="gd-avg ${r.avg >= 7 ? 'grade-good' : r.avg >= 5.5 ? 'grade-ok' : 'grade-bad'}">${f(r.avg)}</span>
          <span>${r.count}</span>
          <span>${f(r.high)}</span>
          <span>${f(r.low)}</span>
          <span class="${r.fails > 0 ? 'gd-fails' : ''}">${r.fails}</span>
          <span>${r.need55 > 10 ? '<span class="gd-fails">>10</span>' : r.need55 <= 1 ? '<span style="color:#059669">veilig</span>' : f(Math.ceil(r.need55 * 10) / 10)}</span>
        </div>
      `).join('')}
    </div>
    <p class="form-hint" style="margin-top:10px">"Nodig voor 5,5" = het cijfer dat je op de volgende toets (weging 1) minimaal moet halen om gemiddeld op een 5,5 te staan of te komen. Vakken met het laagste gemiddelde staan bovenaan.</p>
  `);
}

// --- Cijfers plakken uit Magister ---
let pastedGradeRows = [];

function openPasteGradesModal() {
  pastedGradeRows = [];
  openModal('Cijfers plakken uit Magister', `
    <p style="color:var(--gray-500);font-size:0.85rem;margin:0 0 10px">
      Open Magister &rarr; Cijfers, selecteer je cijferoverzicht met de muis, kopieer (Cmd+C / Ctrl+C) en plak het hieronder (Cmd+V / Ctrl+V). De app herkent vakken en cijfers automatisch — je controleert het resultaat voordat het wordt opgeslagen.
    </p>
    <textarea class="form-input" id="paste-grades-input" rows="8" placeholder="Plak hier je cijfers uit Magister...&#10;&#10;Bijvoorbeeld:&#10;ne&#9;Boekverslag&#9;7,5&#10;wb&#9;PW H5&#9;6,8" style="resize:vertical;font-family:monospace;font-size:0.82rem"></textarea>
    <button class="btn btn-primary" style="width:100%;justify-content:center;margin-top:12px" onclick="previewPastedGrades()">
      Herken cijfers
    </button>
    <div id="paste-grades-preview"></div>
  `);
}

function previewPastedGrades() {
  const text = document.getElementById('paste-grades-input').value;
  pastedGradeRows = parsePastedGrades(text);
  renderPastedGradesPreview();
}

function removePastedGradeRow(i) {
  pastedGradeRows.splice(i, 1);
  renderPastedGradesPreview();
}

function renderPastedGradesPreview() {
  const box = document.getElementById('paste-grades-preview');
  if (!box) return;

  if (!pastedGradeRows.length) {
    box.innerHTML = '<p style="color:#B91C1C;font-size:0.85rem;margin-top:12px">Geen cijfers herkend. Controleer of er per regel een cijfer (zoals 7,5) in staat. Je kunt cijfers ook los toevoegen via "Cijfer toevoegen".</p>';
    return;
  }

  const subjectOptions = (sel) => mySubjectEntries().map(([key, s]) =>
    `<option value="${key}" ${key === sel ? 'selected' : ''}>${s.name}</option>`).join('');

  box.innerHTML = `
    <p style="font-weight:600;margin:16px 0 4px">${pastedGradeRows.length} cijfer${pastedGradeRows.length !== 1 ? 's' : ''} herkend — controleer en pas aan:</p>
    <div class="paste-preview-head"><span>Vak</span><span>Omschrijving</span><span>Weging</span><span>Cijfer</span><span></span></div>
    <div class="paste-preview-list">
      ${pastedGradeRows.map((r, i) => `
        <div class="paste-preview-row">
          <select class="form-select" onchange="pastedGradeRows[${i}].subject=this.value">
            <option value="" ${!r.subject ? 'selected' : ''}>Kies vak...</option>
            ${subjectOptions(r.subject)}
          </select>
          <input type="text" class="form-input" value="${esc(r.desc)}" onchange="pastedGradeRows[${i}].desc=this.value">
          <input type="number" class="form-input paste-grade-num" min="0" max="20" step="0.5" value="${r.weight || 1}" onchange="pastedGradeRows[${i}].weight=parseFloat(this.value)" title="Weging">
          <input type="number" class="form-input paste-grade-num" min="1" max="10" step="0.1" value="${r.grade}" onchange="pastedGradeRows[${i}].grade=parseFloat(this.value)" title="Cijfer">
          <button type="button" class="lesson-action-btn delete" onclick="removePastedGradeRow(${i})" title="Niet importeren">${icons.x}</button>
        </div>
      `).join('')}
    </div>
    <button class="btn btn-primary" style="width:100%;justify-content:center;margin-top:12px" onclick="importPastedGrades()">
      ${icon('plus', 16)} Importeer ${pastedGradeRows.length} cijfer${pastedGradeRows.length !== 1 ? 's' : ''}
    </button>
  `;
}

function importPastedGrades() {
  const valid = pastedGradeRows.filter(r => r.subject && r.desc && !isNaN(r.grade) && r.grade >= 1 && r.grade <= 10);
  if (!valid.length) { alert('Kies bij elk cijfer eerst een vak.'); return; }
  valid.forEach(r => {
    if (!grades[r.subject]) grades[r.subject] = { grades: [], descriptions: [], weights: [] };
    if (!Array.isArray(grades[r.subject].weights)) grades[r.subject].weights = grades[r.subject].grades.map(() => 1);
    grades[r.subject].grades.push(Math.round(r.grade * 10) / 10);
    grades[r.subject].descriptions.push(r.desc);
    grades[r.subject].weights.push(isNaN(r.weight) || r.weight < 0 ? 1 : r.weight);
  });
  saveGrades();
  pastedGradeRows = [];
  closeModal();
  renderPage('cijfers');
}

function deleteAllGrades() {
  const total = Object.values(grades).reduce((s, d) => s + d.grades.length, 0);
  if (!total) return;
  if (!confirm(`Weet je het zeker? Dit verwijdert al je ${total} cijfers definitief.`)) return;
  grades = {};
  saveGrades();
  renderPage('cijfers');
}

function deleteGrade(subjectId, index) {
  if (!grades[subjectId]) return;
  if (!confirm('Dit cijfer verwijderen?')) return;
  grades[subjectId].grades.splice(index, 1);
  grades[subjectId].descriptions.splice(index, 1);
  if (Array.isArray(grades[subjectId].weights)) grades[subjectId].weights.splice(index, 1);
  if (grades[subjectId].grades.length === 0) delete grades[subjectId];
  saveGrades();
  renderPage('cijfers');
}

function openEditGradeModal(subjectId, index) {
  const data = grades[subjectId];
  if (!data) return;
  const subjectOptions = mySubjectEntries().map(([key, s]) =>
    `<option value="${key}" ${key === subjectId ? 'selected' : ''}>${s.name}</option>`).join('');
  openModal('Cijfer bewerken', `
    <form onsubmit="editGrade(event,'${subjectId}',${index})">
      <div class="form-group">
        <label class="form-label">Vak</label>
        <select class="form-select" id="edit-grade-subject" required>${subjectOptions}</select>
      </div>
      <div class="form-group">
        <label class="form-label">Omschrijving</label>
        <input type="text" class="form-input" id="edit-grade-desc" value="${esc(data.descriptions[index])}" required>
      </div>
      <div style="display:flex;gap:10px">
        <div class="form-group" style="flex:1">
          <label class="form-label">Cijfer</label>
          <input type="number" class="form-input" id="edit-grade-value" min="1" max="10" step="0.1" value="${data.grades[index]}" required>
        </div>
        <div class="form-group" style="flex:1">
          <label class="form-label">Weging</label>
          <input type="number" class="form-input" id="edit-grade-weight" min="0" max="20" step="0.5" value="${(data.weights && data.weights[index]) || 1}">
        </div>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:8px">Opslaan</button>
    </form>
  `);
}

function editGrade(e, subjectId, index) {
  e.preventDefault();
  const data = grades[subjectId];
  if (!data) return;
  const newSubject = document.getElementById('edit-grade-subject').value;
  const desc = document.getElementById('edit-grade-desc').value.trim();
  const value = parseFloat(document.getElementById('edit-grade-value').value);
  const w = parseFloat(document.getElementById('edit-grade-weight').value);
  const weight = isNaN(w) || w < 0 ? 1 : w;
  if (!newSubject || !desc || isNaN(value) || value < 1 || value > 10) return;
  if (!Array.isArray(data.weights)) data.weights = data.grades.map(() => 1);

  if (newSubject === subjectId) {
    data.descriptions[index] = desc;
    data.grades[index] = Math.round(value * 10) / 10;
    data.weights[index] = weight;
  } else {
    // Verplaatst naar een ander vak
    data.grades.splice(index, 1);
    data.descriptions.splice(index, 1);
    data.weights.splice(index, 1);
    if (data.grades.length === 0) delete grades[subjectId];
    if (!grades[newSubject]) grades[newSubject] = { grades: [], descriptions: [], weights: [] };
    if (!Array.isArray(grades[newSubject].weights)) grades[newSubject].weights = grades[newSubject].grades.map(() => 1);
    grades[newSubject].grades.push(Math.round(value * 10) / 10);
    grades[newSubject].descriptions.push(desc);
    grades[newSubject].weights.push(weight);
  }
  saveGrades();
  closeModal();
  renderPage('cijfers');
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
  loadIcalFeeds();

  return `
    <div class="page-content">
      <div class="page-header" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
        <div>
          <h1>Instellingen</h1>
          <p>Pas je Examen-Planner aan naar jouw wensen</p>
        </div>
        <button class="btn btn-outline btn-sm" onclick="showOnboarding('tour')">
          &#128640; Rondleiding starten
        </button>
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
              <input type="text" class="form-input" id="setting-name" value="${esc(appSettings.userName)}" onchange="updateSetting('userName', this.value)">
            </div>
            <div class="form-group">
              <label class="form-label">E-mail</label>
              <input type="email" class="form-input" id="setting-email" value="${esc(appSettings.userEmail)}" onchange="updateSetting('userEmail', this.value)">
            </div>
            <div class="form-group">
              <label class="form-label">Klas</label>
              <input type="text" class="form-input" id="setting-class" value="${esc(appSettings.userClass)}" onchange="updateSetting('userClass', this.value)">
            </div>
            <div class="form-group">
              <label class="form-label">School</label>
              <input type="text" class="form-input" id="setting-school" value="${esc(appSettings.schoolName)}" onchange="updateSetting('schoolName', this.value)">
            </div>
          </div>
        </div>

        <!-- Mijn vakken & niveau -->
        <div class="card settings-card">
          <div class="card-header">
            <div class="card-title">
              ${icon('bookOpen')} Mijn vakken &amp; niveau
            </div>
          </div>
          <div class="settings-section">
            <div class="form-group">
              <label class="form-label">Examenniveau</label>
              <select class="form-select" id="setting-level" onchange="updateExamLevel(this.value)">
                ${Object.entries(examLevels).map(([k, v]) => `<option value="${k}" ${(appSettings.examLevel || 'vwo') === k ? 'selected' : ''}>${v}</option>`).join('')}
              </select>
              <span class="form-hint">Kies je niveau; hieronder verschijnen alle vakken die daarbij horen.</span>
            </div>
            <div class="form-group" style="margin:0">
              <label class="form-label">Welke vakken heb jij? (${mySubjectKeys().length} gekozen)</label>
              <div class="subject-picker">${renderSubjectPicker()}</div>
            </div>
            <div class="form-group" style="margin:16px 0 0">
              <label class="form-label">Docenten (optioneel)</label>
              <div class="teacher-list">
                ${mySubjectEntries().map(([key, s]) => `
                  <div class="teacher-row">
                    <span class="teacher-subject">${s.icon} ${s.name}</span>
                    <input type="text" class="form-input teacher-input" placeholder="Naam docent..."
                      value="${esc(subjectTeacher(key))}" onchange="updateTeacher('${key}', this.value)">
                  </div>
                `).join('')}
              </div>
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
            <div class="settings-connect-row">
              <div class="settings-connect-info">
                <strong>&#128197; Agenda's (Google, Apple, Outlook...)</strong>
                <span class="settings-connect-status ${icalFeeds.length ? 'active' : ''}">${icalFeeds.length ? `${icalFeeds.length} agenda${icalFeeds.length !== 1 ? "'s" : ''} gekoppeld` : 'Niet gekoppeld'}</span>
              </div>
              <button class="btn ${icalFeeds.length ? 'btn-outline' : 'btn-primary'} btn-sm" onclick="openCalendarConnectModal()">
                ${icalFeeds.length ? 'Beheren' : 'Koppelen'}
              </button>
            </div>
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
          <div class="settings-section" style="margin-top:20px;border-top:1px solid var(--gray-100);padding-top:20px">
            <div class="settings-toggle-label" style="margin-bottom:4px">&#128190; Back-up</div>
            <div class="settings-toggle-desc" style="margin-bottom:12px">Je gegevens staan in deze browser. Download regelmatig een back-up — die kun je hier (of op een ander apparaat) terugzetten.</div>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <button class="btn btn-primary btn-sm" onclick="exportBackup()">&#11015;&#65039; Download back-up</button>
              <label class="btn btn-outline btn-sm" style="cursor:pointer">
                &#11014;&#65039; Back-up terugzetten
                <input type="file" accept=".json,application/json" style="display:none" onchange="importBackup(this)">
              </label>
            </div>
          </div>
          ${!isDemoCleared() ? `
          <div style="margin-top:16px">
            <button class="btn btn-outline" style="width:100%;justify-content:center" onclick="confirmClearDemo()">
              &#129529; Wis voorbeelddata
            </button>
            <span class="form-hint" style="text-align:center">Verwijdert het demo-huiswerk, -toetsen, -events, -taken en -cijfers, zodat alleen jouw eigen invoer overblijft.</span>
          </div>` : ''}
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

// --- Help ---
function openHelpModal() {
  openModal('Help', `
    <div style="display:flex;gap:8px;margin-bottom:14px">
      <button class="btn btn-primary btn-sm" style="flex:1;justify-content:center" onclick="closeModal();showOnboarding('tour')">
        &#128640; Start de rondleiding
      </button>
      <button class="btn btn-outline btn-sm" style="flex:1;justify-content:center" onclick="closeModal();navigate('instellingen')">
        &#9881;&#65039; Naar instellingen
      </button>
    </div>
    <div class="ical-help">
      <details>
        <summary>&#127919; Hoe maak ik een planning voor mijn toetsweek of examen?</summary>
        <ol><li>Ga naar <strong>Planner</strong> &rarr; <strong>Nieuwe planning</strong></li><li>Kies type, datum en hoeveel dagen van tevoren je klaar wilt zijn</li><li>Voeg je toetsen toe (of <em>Importeer uit Toetsen</em>)</li><li>Vul je <strong>beschikbare tijd</strong> in en voeg <strong>taken</strong> toe met geschatte uren</li><li>Je studieschema wordt automatisch verdeeld over je dagen</li></ol>
      </details>
      <details>
        <summary>&#9201;&#65039; Wat betekent "voor/achter op schema"?</summary>
        <p style="margin:8px 0 4px">De app berekent hoeveel uur je volgens je planning gedaan zou moeten hebben. Log je uren na het leren (knop <em>Uren loggen</em> bij een taak), dan zie je het verschil in uren. Een dag overslaan = achterstand die je moet inhalen.</p>
      </details>
      <details>
        <summary>&#128279; Hoe koppel ik mijn Magister-rooster?</summary>
        <ol><li>Open Magister &rarr; <strong>Agenda</strong> &rarr; tandwiel &rarr; <strong>Agenda koppelen</strong> &rarr; zet aan en kopieer de link</li><li>In de app: <strong>Rooster</strong> &rarr; <strong>Koppel Magister</strong> &rarr; link plakken</li></ol>
        <p style="margin:4px 0">Geen wachtwoord nodig. Vernieuwen kan daarna met &eacute;&eacute;n klik.</p>
      </details>
      <details>
        <summary>&#128202; Hoe krijg ik mijn cijfers er snel in?</summary>
        <p style="margin:8px 0 4px">Selecteer je cijferoverzicht in Magister, kopieer het, en gebruik <strong>Cijfers</strong> &rarr; <strong>&#128203; Plak uit Magister</strong>. Vakken, cijfers en wegingen worden herkend; je controleert alles voordat het wordt opgeslagen.</p>
      </details>
      <details>
        <summary>&#128203; Kan ik een hele lijst opgaves tegelijk toevoegen?</summary>
        <p style="margin:8px 0 4px">Ja — bij <strong>Huiswerk</strong> en bij de <strong>Planner-taken</strong> zit een knop <em>Lijst plakken</em>. Elke regel wordt een losse opgave. Tip: begin een regel met een vakafkorting (wi, ne, bio...) en zet er bij taken een duur achter ("2u").</p>
      </details>
      <details>
        <summary>&#128198; Hoe koppel ik mijn Google/Apple/Outlook-agenda?</summary>
        <p style="margin:8px 0 4px"><strong>Agenda</strong> &rarr; <strong>Kalender koppelen</strong>. Daar staat per app uitgelegd waar je de iCal-link vindt. Plakken, klaar — je afspraken verschijnen alleen-lezen in je agenda.</p>
      </details>
      <details>
        <summary>&#128190; Raak ik mijn gegevens kwijt?</summary>
        <p style="margin:8px 0 4px">Je gegevens staan in deze browser op dit apparaat. Wis je je browsergeschiedenis, dan ben je ze kwijt — maak daarom regelmatig een back-up via <strong>Instellingen</strong> &rarr; <strong>Download back-up</strong>. Dat bestand kun je altijd (ook op een ander apparaat) terugzetten.</p>
      </details>
      <details>
        <summary>&#129529; Hoe kom ik van de voorbeelddata af?</summary>
        <p style="margin:8px 0 4px"><strong>Instellingen</strong> &rarr; <strong>Wis voorbeelddata</strong>. Je eigen invoer blijft staan.</p>
      </details>
    </div>
  `);
}

// --- Back-up: alle app-gegevens exporteren / terugzetten ---
function exportBackup() {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith('sp_')) data[k] = localStorage.getItem(k);
  }
  const payload = { app: 'examen-planner', version: 1, exportedAt: new Date().toISOString(), data };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  const d = new Date();
  a.download = `examen-planner-backup-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function importBackup(input) {
  const file = input.files && input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const p = JSON.parse(reader.result);
      if (!p || p.app !== 'examen-planner' || !p.data) throw new Error('dit is geen geldig Examen-Planner back-upbestand.');
      const count = Object.keys(p.data).filter(k => k.startsWith('sp_')).length;
      if (!count) throw new Error('het back-upbestand is leeg.');
      const when = p.exportedAt ? new Date(p.exportedAt).toLocaleDateString('nl-NL') : 'onbekend';
      if (!confirm(`Back-up van ${when} terugzetten? Je huidige gegevens in deze browser worden vervangen.`)) { input.value = ''; return; }
      Object.keys(localStorage).filter(k => k.startsWith('sp_')).forEach(k => localStorage.removeItem(k));
      Object.entries(p.data).forEach(([k, v]) => { if (k.startsWith('sp_')) localStorage.setItem(k, String(v)); });
      alert('Back-up teruggezet! De app wordt opnieuw geladen.');
      location.reload();
    } catch (e) {
      alert('Terugzetten mislukt: ' + e.message);
      input.value = '';
    }
  };
  reader.readAsText(file);
}

// --- Onboarding: eerste-keer-wizard & rondleiding ---
let wizardStep = 1;
let wizardMode = 'fresh'; // 'fresh' = nieuwe gebruiker, 'tour' = rondleiding vanuit Instellingen
const WIZARD_TOTAL = 10;
const wizardState = { level: 'havo', subjects: new Set(), name: '' };

function showOnboarding(mode) {
  wizardMode = mode || 'fresh';
  wizardStep = 1;
  if (wizardMode === 'tour') {
    // Vooraf invullen met je huidige instellingen
    wizardState.level = appSettings.examLevel || 'havo';
    wizardState.subjects = new Set(mySubjectKeys());
    wizardState.name = appSettings.userName || '';
  } else {
    wizardState.level = 'havo';
    wizardState.subjects = new Set();
    wizardState.name = '';
  }
  let el = document.getElementById('onboarding');
  if (!el) {
    el = document.createElement('div');
    el.id = 'onboarding';
    el.className = 'onboarding-overlay';
    document.body.appendChild(el);
  }
  renderOnboarding();
}

// Hulpje voor de uitleg-stappen van de rondleiding
function wizardInfoStep(iconChar, title, intro, items) {
  return `
    <div class="onb-icon">${iconChar}</div>
    <h2>${title}</h2>
    <p>${intro}</p>
    <ul class="onb-list">
      ${items.map(i => `<li>${i}</li>`).join('')}
    </ul>
    <button class="btn btn-primary onb-next" onclick="wizardNext()">Volgende &rarr;</button>
    <button class="onb-skip" onclick="wizardBack()">&larr; Terug</button>
  `;
}

function renderOnboarding() {
  const el = document.getElementById('onboarding');
  if (!el) return;
  const isTour = wizardMode === 'tour';

  let body = '';
  if (wizardStep === 1) {
    body = `
      <div class="onb-icon">&#127891;</div>
      <h2>${isTour ? 'Rondleiding door Examen-Planner' : 'Welkom bij Examen-Planner!'}</h2>
      <p>${isTour
        ? 'We lopen langs je instellingen en daarna langs elke pagina: wat je er doet en waar je alles vindt.'
        : 'Plan je route naar je toetsweek of examen: vul je tijd en taken in, en zie elke dag of je op schema loopt. Eerst even instellen, daarna een korte rondleiding.'}</p>
      <div class="form-group" style="text-align:left;margin-top:18px">
        <label class="form-label">Hoe heet je? (mag je overslaan)</label>
        <input type="text" class="form-input" id="onb-name" value="${esc(wizardState.name)}" placeholder="Je voornaam" onchange="wizardState.name=this.value">
      </div>
      <button class="btn btn-primary onb-next" onclick="wizardState.name=document.getElementById('onb-name').value;wizardNext()">${isTour ? 'Start de rondleiding' : 'Aan de slag'} &rarr;</button>
      <button class="onb-skip" onclick="finishOnboarding(false)">${isTour ? 'Rondleiding sluiten' : 'Overslaan en eerst rondkijken (met voorbeelddata)'}</button>
    `;
  } else if (wizardStep === 2) {
    body = `
      <div class="onb-icon">&#127919;</div>
      <h2>Op welk niveau zit je?</h2>
      <p>Dan laten we precies de vakken zien die bij jouw niveau horen.</p>
      <div class="onb-levels">
        ${Object.entries(examLevels).map(([k, v]) => `
          <button class="onb-level ${wizardState.level === k ? 'active' : ''}" onclick="wizardSetLevel('${k}')">${v}</button>
        `).join('')}
      </div>
      <button class="btn btn-primary onb-next" onclick="wizardNext()">Volgende &rarr;</button>
      <button class="onb-skip" onclick="wizardBack()">&larr; Terug</button>
    `;
  } else if (wizardStep === 3) {
    const keys = subjectsForLevel(wizardState.level).sort((a, b) => subjects[a].name.localeCompare(subjects[b].name, 'nl'));
    body = `
      <div class="onb-icon">&#128218;</div>
      <h2>Welke vakken heb jij?</h2>
      <p>Vink je vakkenpakket aan (${wizardState.subjects.size} gekozen) — aanpassen kan later altijd bij Instellingen.</p>
      <div class="subject-picker onb-subjects">
        ${keys.map(k => {
          const s = subjects[k];
          const on = wizardState.subjects.has(k);
          return `<button type="button" class="subject-pick ${on ? 'on' : ''}" onclick="wizardToggleSubject('${k}')">
            <span class="subject-pick-icon">${s.icon}</span>
            <span class="subject-pick-name">${s.name}</span>
            ${on ? `<span class="subject-pick-check">${icons.check}</span>` : ''}
          </button>`;
        }).join('')}
      </div>
      <button class="btn btn-primary onb-next" onclick="wizardNext()" ${wizardState.subjects.size === 0 ? 'disabled' : ''}>Volgende &rarr;</button>
      <button class="onb-skip" onclick="wizardBack()">&larr; Terug</button>
    `;
  } else if (wizardStep === 4) {
    body = wizardInfoStep('&#127968;', 'Het Dashboard', 'Je startpagina — in één blik zie je hoe je ervoor staat.', [
      '<strong>Bovenbalk:</strong> je taken, huiswerk, toetsen deze week en of je <strong>op schema</strong> loopt voor je toetsweek/examen',
      '<strong>Te leren vandaag:</strong> wat je vandaag moet doen volgens je studieschema',
      '<strong>Streak</strong> &#128293;: elke dag iets afvinken of uren loggen houdt je reeks in leven',
      '<strong>Op schema?-kaart:</strong> klik erop om direct naar je planning te gaan',
    ]);
  } else if (wizardStep === 5) {
    body = wizardInfoStep('&#127919;', 'De Planner (het hart van de app)', 'Hier plan je je route naar een toetsweek of examen. Te vinden als 2e knop in het menu.', [
      '<strong>Nieuwe planning:</strong> kies Toetsweek of Examen, de datum en hoeveel dagen van tevoren je klaar wilt zijn',
      '<strong>Toetsrooster:</strong> voeg je toetsen toe of klik <em>Importeer uit Toetsen</em>',
      '<strong>Beschikbare tijd:</strong> uren per dag, of via <em>&#128336; tijd</em> precies wanneer (bv. 15:00–17:00)',
      '<strong>Taken:</strong> wat je moet doen + hoelang; met <em>&#128203; Lijst plakken</em> maak je van elke regel een taak',
      '<strong>Uren loggen</strong> na het leren — zo zie je of je <strong>vóór of achter</strong> loopt (in uren)',
    ]);
  } else if (wizardStep === 6) {
    body = wizardInfoStep('&#128197;', 'Het Rooster', 'Je weekrooster, maandag t/m vrijdag.', [
      '<strong>Les toevoegen</strong> met vak, uur en lokaal — de lestijden stel je in bij Instellingen',
      '<strong>Koppel Magister:</strong> plak je agenda-link uit Magister (Agenda &rarr; instellingen &rarr; Agenda koppelen) en je rooster wordt automatisch gevuld — <strong>zonder wachtwoord</strong>',
      'Daarna is <em>Rooster vernieuwen</em> één klik',
    ]);
  } else if (wizardStep === 7) {
    body = wizardInfoStep('&#128214;', 'Huiswerk & Toetsen', 'Je dagelijkse werk naast de grote planning.', [
      '<strong>Huiswerk:</strong> opdrachten met deadline, filter op vandaag/deze week, afvinken voedt je streak',
      '<strong>&#128203; Lijst plakken:</strong> plak al je opgaves in één keer — elke regel wordt een losse opdracht',
      '<strong>Toetsen:</strong> alle aankomende toetsen, SO\'s en mondelingen met "nog X dagen" — ook losse toetsen tussen toetsweken door',
      'Toetsen van deze week verschijnen automatisch op je dashboard en in je meldingen &#128276;',
    ]);
  } else if (wizardStep === 8) {
    body = wizardInfoStep('&#128202;', 'Cijfers', 'Al je cijfers, met weging — net als op school.', [
      '<strong>Cijfer toevoegen</strong> met omschrijving en weging; gemiddelden zijn gewogen',
      '<strong>&#128203; Plak uit Magister:</strong> kopieer je cijferlijst en alles wordt herkend (vak, cijfer, weging)',
      '<strong>&#127919; Wat moet ik halen?:</strong> bereken wat je minimaal moet scoren voor je doelgemiddelde',
      '<strong>&#128202; Uitgebreid overzicht:</strong> per vak hoogste, laagste, onvoldoendes en wat je nodig hebt voor een 5,5',
    ]);
  } else if (wizardStep === 9) {
    body = wizardInfoStep('&#128198;', 'De Agenda', 'Maandoverzicht met al je events én je eigen kalenders.', [
      '<strong>Events toevoegen:</strong> excursies, deadlines, afspraken — met type en tijd',
      '<strong>Kalender koppelen:</strong> plak de iCal-link van Google Calendar, Apple/iCloud of Outlook (uitleg per app zit ingebouwd)',
      'Gekoppelde afspraken zijn alleen-lezen en krijgen een paars label met de bron',
      'Alles verschijnt ook in de mini-kalender op je dashboard',
    ]);
  } else {
    body = `
      <div class="onb-icon">&#9881;&#65039;</div>
      <h2>Instellingen &amp; klaar!</h2>
      <p>Rechtsboven bij het tandwiel vind je alles om de app van jou te maken:</p>
      <ul class="onb-list">
        <li><strong>Profiel, lesuren &amp; pauzes</strong> — bepalen de tijden in je rooster</li>
        <li><strong>Vakken &amp; niveau</strong> aanpassen en <strong>docenten</strong> per vak invullen</li>
        <li><strong>&#128190; Back-up:</strong> download regelmatig een back-up — je gegevens staan in deze browser, en met het bestand zet je alles terug (ook op een ander apparaat)</li>
        <li><strong>Wis voorbeelddata</strong> als je schoon wilt beginnen</li>
        <li>Deze <strong>rondleiding</strong> kun je daar altijd opnieuw starten</li>
      </ul>
      <button class="btn btn-primary onb-next" onclick="finishOnboarding(true)">Klaar ${isTour ? '' : ', start de app '}&#127881;</button>
      <button class="onb-skip" onclick="wizardBack()">&larr; Terug</button>
    `;
  }

  el.innerHTML = `
    <div class="onb-card">
      ${body}
      <div class="onb-dots">
        ${Array.from({ length: WIZARD_TOTAL }, (_, i) => `<span class="onb-dot ${i + 1 === wizardStep ? 'active' : i + 1 < wizardStep ? 'done' : ''}"></span>`).join('')}
      </div>
    </div>
  `;
}

function wizardSetLevel(level) {
  wizardState.level = level;
  // Vakken die op het nieuwe niveau niet bestaan eruit halen
  const valid = new Set(subjectsForLevel(level));
  wizardState.subjects = new Set([...wizardState.subjects].filter(k => valid.has(k)));
  renderOnboarding();
}

function wizardToggleSubject(key) {
  if (wizardState.subjects.has(key)) wizardState.subjects.delete(key);
  else wizardState.subjects.add(key);
  renderOnboarding();
}

function wizardNext() { wizardStep++; renderOnboarding(); }
function wizardBack() { wizardStep--; renderOnboarding(); }

function finishOnboarding(applied) {
  if (applied) {
    if (wizardState.name.trim()) appSettings.userName = wizardState.name.trim();
    appSettings.examLevel = wizardState.level;
    appSettings.mySubjects = Array.from(wizardState.subjects);
    saveSettings();
    // Alleen bij een echt nieuwe gebruiker: schoon beginnen zonder
    // voorbeelddata. Bij de rondleiding blijven alle gegevens staan.
    if (wizardMode === 'fresh') clearDemoData();
  }
  localStorage.setItem('sp_onboarded', 'true');
  const el = document.getElementById('onboarding');
  if (el) el.remove();
  showApp();
}

function confirmClearDemo() {
  if (!confirm('Alle voorbeelddata wissen? Je eigen toegevoegde huiswerk, toetsen en events blijven bewaard; demo-taken en demo-cijfers verdwijnen.')) return;
  clearDemoData();
  renderPage('instellingen');
}

// --- Vakken & niveau ---
function renderSubjectPicker() {
  const level = appSettings.examLevel || 'vwo';
  const mine = new Set(mySubjectKeys());
  const keys = subjectsForLevel(level).sort((a, b) => subjects[a].name.localeCompare(subjects[b].name, 'nl'));
  return keys.map(k => {
    const s = subjects[k];
    const on = mine.has(k);
    return `
      <button type="button" class="subject-pick ${on ? 'on' : ''}" onclick="toggleMySubject('${k}')">
        <span class="subject-pick-icon">${s.icon}</span>
        <span class="subject-pick-name">${s.name}</span>
        ${on ? `<span class="subject-pick-check">${icons.check}</span>` : ''}
      </button>`;
  }).join('');
}

function updateExamLevel(level) {
  appSettings.examLevel = level;
  // Behoud alleen gekozen vakken die op het nieuwe niveau bestaan
  const valid = new Set(subjectsForLevel(level));
  appSettings.mySubjects = mySubjectKeys().filter(k => valid.has(k));
  saveSettings();
  renderPage('instellingen');
}

function toggleMySubject(key) {
  const set = new Set(mySubjectKeys());
  if (set.has(key)) set.delete(key);
  else set.add(key);
  appSettings.mySubjects = Array.from(set);
  saveSettings();
  renderPage('instellingen');
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

// ==================== PLANNER (toetsweek & examen) ====================
function renderPlanner() {
  loadPlans();

  // Actief plan = expliciet gekozen, anders eerstvolgende met deadline >= vandaag
  let plan = activePlanId != null ? getPlan(activePlanId) : null;
  if (!plan) {
    const upcoming = [...plans]
      .filter(p => startOfDay(new Date(p.examDate)) >= startOfDay(today))
      .sort((a, b) => new Date(a.examDate) - new Date(b.examDate));
    plan = upcoming[0] || plans[0];
    if (plan) activePlanId = plan.id;
  }

  return `
    <div class="page-content">
      <div class="page-header" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
        <div>
          <h1>Planner</h1>
          <p>Je route naar toetsweken &amp; examens — plan vooruit en blijf op schema</p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-primary btn-sm" onclick="openGeneratePlanModal()">✨ Maak mijn planning</button>
          <button class="btn btn-outline btn-sm" onclick="openAddPlanModal()">${icon('plus', 14)} Handmatig</button>
        </div>
      </div>

      ${plans.length === 0 ? renderPlannerEmpty() : `
        ${renderPlanSelector(plan)}
        ${plan ? renderPlanDetail(plan) : ''}
      `}
    </div>
  `;
}

function renderPlannerEmpty() {
  return `
    <div class="card">
      <div class="empty-state">
        <div style="font-size:2.5rem;margin-bottom:8px">🎯</div>
        <h3 style="margin:0 0 6px">Laat je planning voor je maken</h3>
        <p style="margin:0 0 16px;color:var(--gray-500)">Voeg je toetsen toe en wij maken automatisch de leertaken en het schema.<br>Daarna zie je elke dag of je op schema loopt.</p>
        <button class="btn btn-primary" style="padding:12px 22px" onclick="openGeneratePlanModal()">✨ Maak mijn planning</button>
        <div style="margin-top:10px"><button class="btn btn-outline btn-sm" onclick="openAddPlanModal()">${icon('plus', 14)} Liever handmatig</button></div>
      </div>
    </div>
  `;
}

function renderPlanSelector(activePlan) {
  if (plans.length <= 1) return '';
  const sorted = [...plans].sort((a, b) => new Date(a.examDate) - new Date(b.examDate));
  return `
    <div class="plan-selector">
      ${sorted.map(p => `
        <button class="plan-chip ${activePlan && p.id === activePlan.id ? 'active' : ''}" onclick="selectPlan(${p.id})">
          <span class="plan-chip-type ${p.type}">${p.type === 'examen' ? 'Examen' : 'Toetsweek'}</span>
          ${esc(p.name)}
        </button>
      `).join('')}
    </div>
  `;
}

function selectPlan(id) {
  activePlanId = id;
  savePlans();
  renderPage('planner');
}

function renderPlanDetail(plan) {
  const st = planStatus(plan);
  const lbl = statusLabel(st);
  const examD = planExamDate(plan);

  return `
    <!-- Overzicht / status -->
    <div class="card plan-overview">
      <div class="plan-overview-head">
        <div>
          <span class="plan-chip-type ${plan.type}" style="margin-bottom:6px;display:inline-block">${plan.type === 'examen' ? 'Examen' : 'Toetsweek'}</span>
          <h2 style="margin:0">${esc(plan.name)}</h2>
          <p style="margin:4px 0 0;color:var(--gray-500)">
            ${plan.type === 'examen' ? 'Examen' : 'Eerste toets'} op ${formatDate(examD)}
            ${plan.readyDaysBefore > 0 ? ` · klaar willen zijn ${plan.readyDaysBefore} dag${plan.readyDaysBefore !== 1 ? 'en' : ''} van tevoren` : ''}
          </p>
        </div>
        <div style="display:flex;gap:8px">
          <button class="lesson-action-btn" onclick="openEditPlanModal(${plan.id})" title="Bewerken">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
          </button>
          <button class="lesson-action-btn delete" onclick="deletePlan(${plan.id})" title="Verwijderen">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </div>
      </div>

      <div class="plan-status-banner ${lbl.cls}">
        <div class="plan-status-main">
          <span class="plan-status-icon">${st.pct >= 100 ? '🎉' : lbl.cls === 'behind' ? '⚠️' : lbl.cls === 'ahead' ? '🚀' : '✅'}</span>
          <div>
            <div class="plan-status-text">${lbl.text}</div>
            <div class="plan-status-sub">${st.totalNeeded === 0 ? 'Voeg taken toe om je planning te starten' : `${fmtHours(st.totalDone)} van ${fmtHours(st.totalNeeded)} gedaan`}</div>
          </div>
        </div>
        ${st.totalNeeded > 0 ? renderCircularProgress(st.pct, 72, 6) : ''}
      </div>

      <div class="plan-stats">
        <div class="plan-stat">
          <div class="plan-stat-value">${st.daysToDeadline >= 0 ? st.daysToDeadline : 0}</div>
          <div class="plan-stat-label">dagen tot deadline</div>
        </div>
        <div class="plan-stat">
          <div class="plan-stat-value">${Math.max(0, st.daysToExam)}</div>
          <div class="plan-stat-label">dagen tot ${plan.type === 'examen' ? 'examen' : 'toetsweek'}</div>
        </div>
        <div class="plan-stat">
          <div class="plan-stat-value">${fmtHours(st.remaining).replace(' uur', '')}</div>
          <div class="plan-stat-label">uur te gaan</div>
        </div>
        <div class="plan-stat ${st.overflow > 0 ? 'warn' : ''}">
          <div class="plan-stat-value">${st.overflow > 0 ? fmtHours(st.overflow).replace(' uur', '') : Math.round(st.sched.totalCapacity)}</div>
          <div class="plan-stat-label">${st.overflow > 0 ? 'uur te weinig tijd' : 'uur beschikbaar'}</div>
        </div>
      </div>
      ${st.overflow > 0 ? `<div class="plan-warning">${icon('clock', 14)} Je hebt ${fmtHours(st.overflow)} te weinig ingepland. Voeg beschikbare tijd toe of verlaag je taakuren.</div>` : ''}
    </div>

    ${renderExamSchedule(plan)}

    ${renderSubjectOverview(plan)}

    <div class="plan-columns">
      <!-- Taken -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">${icon('listChecks')} Wat moet je doen</div>
          <div style="display:flex;gap:6px">
            <button class="btn btn-outline btn-sm" onclick="openPasteTasksModal(${plan.id})">&#128203; Lijst plakken</button>
            <button class="btn btn-primary btn-sm" onclick="openAddTaskModal(${plan.id})">${icon('plus', 14)} Taak</button>
          </div>
        </div>
        ${plan.tasks.length === 0
          ? '<div class="empty-state empty-state-compact"><p>Nog geen taken. Voeg toe wat je moet doen en hoelang het duurt.</p></div>'
          : plan.tasks.map(t => renderTaskRow(plan, t)).join('')}
      </div>

      <!-- Beschikbare tijd -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">${icon('clock')} Beschikbare tijd</div>
        </div>
        <div class="form-group" style="margin-bottom:14px">
          <label class="form-label">Standaard uren per dag</label>
          <input type="number" class="form-input" min="0" max="16" step="0.5" value="${plan.defaultDailyHours}"
            onchange="updatePlanField(${plan.id},'defaultDailyHours',Math.max(0,parseFloat(this.value)||0))">
          <span class="form-hint">Pas hieronder losse dagen aan (bijv. weekend meer, drukke dag minder).</span>
        </div>
        <div class="availability-list">
          ${renderAvailabilityRows(plan)}
        </div>
      </div>
    </div>

    <!-- Gegenereerd schema -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">${icon('calendar')} Jouw studieschema</div>
        <span style="font-size:0.8rem;color:var(--gray-400)">automatisch verdeeld</span>
      </div>
      ${renderPlanScheduleView(plan, st.sched)}
    </div>
  `;
}

function renderTaskRow(plan, t) {
  const s = subjects[t.subject];
  const done = Math.min(t.hours, Math.max(0, t.hoursDone || 0));
  const pct = t.hours > 0 ? Math.round((done / t.hours) * 100) : 0;
  const isDone = pct >= 100;
  return `
    <div class="plan-task ${isDone ? 'done' : ''}">
      <div class="plan-task-top">
        <span class="schedule-dot" style="background:${s ? s.color : 'var(--gray-300)'}"></span>
        <div class="plan-task-info">
          <div class="plan-task-title ${isDone ? 'done' : ''}">${t.priority ? '<span class="prio-star" title="Eerder doen">★</span> ' : ''}${esc(t.title)}</div>
          <div class="plan-task-sub">${s ? s.name : 'Algemeen'} · ${fmtHours(done)} / ${fmtHours(t.hours)}</div>
        </div>
        <div class="plan-task-actions">
          <button class="lesson-action-btn prio-btn ${t.priority ? 'on' : ''}" onclick="toggleTaskPriority(${plan.id},${t.id})" title="${t.priority ? 'Niet meer eerder doen' : 'Eerder doen'}">${t.priority ? '★' : '☆'}</button>
          ${!isDone ? `<button class="btn btn-outline btn-sm plan-log-btn" onclick="openLogHoursModal(${plan.id},${t.id})">${icon('clock', 13)} Uren loggen</button>` : ''}
          <button class="lesson-action-btn" onclick="openEditTaskModal(${plan.id},${t.id})" title="Bewerken">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
          </button>
          <button class="lesson-action-btn ${isDone ? 'done-btn' : ''}" onclick="toggleTaskDone(${plan.id},${t.id})" title="${isDone ? 'Niet klaar' : 'Klaar'}">${icons.check}</button>
          <button class="lesson-action-btn delete" onclick="deleteTask(${plan.id},${t.id})" title="Verwijderen">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>
          </button>
        </div>
      </div>
      <div class="plan-task-bar"><div class="plan-task-bar-fill" style="width:${pct}%;background:${s ? s.color : 'var(--accent)'}"></div></div>
    </div>
  `;
}

let availExpanded = false;

function toggleAvailExpanded(planId) {
  availExpanded = !availExpanded;
  renderPage('planner');
}

function renderAvailabilityRows(plan) {
  const today0 = startOfDay(today);
  const deadline = planDeadline(plan);
  if (deadline < today0) return '<p style="color:var(--gray-400);font-size:0.85rem">De deadline is verstreken.</p>';

  const totalDays = Math.min(60, daysBetween(today0, deadline) + 1);
  const maxRows = availExpanded ? 60 : Math.min(7, totalDays);

  const dayShort = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'];
  let rows = '';
  let count = 0;
  for (let d = new Date(today0); d <= deadline && count < maxRows; d = addDays(d, 1), count++) {
    const key = dateKey(d);
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const slots = daySlots(plan, d);
    const hasSlots = slots.length > 0;
    const val = availabilityFor(plan, d);
    const overridden = !hasSlots && plan.availability && plan.availability[key] != null;
    rows += `
      <div class="availability-row ${isWeekend ? 'weekend' : ''}">
        <div class="availability-main">
          <span class="availability-day">${dayShort[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}</span>
          <input type="number" class="availability-input ${overridden ? 'override' : ''}" min="0" max="16" step="0.5" value="${val}" ${hasSlots ? 'disabled title="Bepaald door tijdblokken"' : 'title="Beschikbare uren"'}
            onchange="setAvailability(${plan.id},'${key}',this.value)">
          <span class="availability-unit">uur</span>
          <button class="availability-slot-btn" onclick="openSlotModal(${plan.id},'${key}')" title="Specifieke tijd kiezen">${icon('clock', 13)} tijd</button>
        </div>
        ${hasSlots ? `<div class="availability-slots">${slots.map((s, i) => `<span class="slot-chip">${s.start}–${s.end}<button onclick="removeSlot(${plan.id},'${key}',${i})" title="Verwijderen">&times;</button></span>`).join('')}</div>` : ''}
      </div>`;
  }
  if (totalDays > 7) {
    rows += `<button class="availability-more-btn" onclick="toggleAvailExpanded(${plan.id})">${availExpanded ? 'Toon minder' : `Toon alle ${totalDays} dagen`}</button>`;
  }
  return rows;
}

// Compacte weekbalk: geplande uren per dag voor de komende 7 dagen
function renderWeekStrip(sched) {
  const today0 = startOfDay(today);
  const dayShort = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'];
  const cells = [];
  for (let i = 0; i < 7; i++) {
    const d = addDays(today0, i);
    const day = sched.days.find(x => +x.date === +d);
    const hours = day ? day.used : 0;
    cells.push(`
      <div class="week-strip-cell ${i === 0 ? 'today' : ''} ${hours === 0 ? 'free' : ''}">
        <span class="week-strip-day">${i === 0 ? 'Vandaag' : dayShort[d.getDay()] + ' ' + d.getDate()}</span>
        <span class="week-strip-hours">${hours > 0 ? fmtHours(hours).replace(' uur', '') + 'u' : 'vrij'}</span>
      </div>`);
  }
  return `<div class="week-strip">${cells.join('')}</div>`;
}

// Gekleurd vaklabel voor een schema-item (duidelijker dan alleen een bolletje)
function scheduleSubjectTag(s) {
  if (!s) return '<span class="sched-tag" style="background:var(--gray-100);color:var(--gray-500)">Overig</span>';
  return `<span class="sched-tag" style="background:${s.light};color:${s.color}">${s.icon} ${s.name}</span>`;
}

// Haalt de dubbele vaknaam ("... — Wiskunde B") uit de titel als die er al is
function scheduleItemLabel(a) {
  const s = subjects[a.subject];
  let title = a.title || '';
  if (s) {
    const suffix = '— ' + s.name;
    if (title.endsWith(suffix)) title = title.slice(0, -suffix.length).trim();
  }
  return { s, title: title || (s ? s.name : 'Taak') };
}

function renderPlanScheduleView(plan, sched) {
  const today0 = startOfDay(today);
  const manual = sched.manual;
  const daysWithWork = sched.days.filter(d => d.assignments.length > 0);

  // Bewerk-balk
  const editBar = `
    <div class="schedule-editbar">
      ${manual
        ? `<span class="schedule-mode">${icon('settings', 13)} Handmatig schema</span>
           <button class="btn btn-outline btn-sm" onclick="resetSchedule(${plan.id})">&#8635; Herstel automatisch</button>`
        : `<span class="schedule-mode auto">&#10024; Automatisch ingedeeld</span>
           <button class="btn btn-outline btn-sm" onclick="enterManualSchedule(${plan.id})">${icon('settings', 13)} Schema aanpassen</button>`}
    </div>`;

  if (daysWithWork.length === 0 && !manual) {
    return editBar + '<div class="empty-state empty-state-compact"><p>Voeg taken en beschikbare tijd toe — dan verschijnt hier je dagindeling.</p></div>';
  }

  const unschedBanner = (manual && sched.unscheduled > 0.05)
    ? `<div class="plan-warning" style="margin-bottom:12px">${icon('clock', 14)} ${fmtHours(sched.unscheduled)} nog niet ingepland. Voeg toe met &plus; bij een dag, of herstel automatisch.</div>`
    : '';

  // In handmatige modus tonen we alle dagen vanaf vandaag (ook lege, om aan toe te voegen)
  const shownDays = manual ? sched.days.filter(d => d.date >= today0) : daysWithWork;

  return `
    ${editBar}
    ${unschedBanner}
    ${renderWeekStrip(sched)}
    <div class="plan-schedule">
      ${shownDays.map(d => {
        const isToday = +d.date === +today0;
        const isPast = d.date < today0;
        const useTimed = d.timed && d.timed.length && !manual;
        return `
          <div class="plan-schedule-day ${isToday ? 'today' : ''} ${isPast ? 'past' : ''}">
            <div class="plan-schedule-date">
              ${isToday ? '<span class="plan-today-badge">Vandaag</span>' : ''}
              ${formatDate(d.date)}
              <span class="plan-schedule-total">${d.used > 0 ? fmtHours(d.used) : ''}</span>
              ${manual ? `<button class="schedule-add-btn" onclick="openAddToDayModal(${plan.id},'${d.key}')" title="Taak op deze dag">${icon('plus', 13)}</button>` : ''}
            </div>
            <div class="plan-schedule-items">
              ${d.assignments.length === 0 && manual ? '<div class="plan-schedule-empty">— vrij —</div>' : ''}
              ${useTimed ? d.timed.map(a => {
                const it = scheduleItemLabel(a);
                return `
                  <div class="plan-schedule-item" style="border-left-color:${it.s ? it.s.color : 'var(--gray-300)'}">
                    <span class="plan-schedule-item-time">${a.start}–${a.end}</span>
                    ${scheduleSubjectTag(it.s)}
                    <span class="plan-schedule-item-title">${esc(it.title)}</span>
                  </div>`;
              }).join('') : d.assignments.map(a => {
                const it = scheduleItemLabel(a);
                return `
                  <div class="plan-schedule-item" style="border-left-color:${it.s ? it.s.color : 'var(--gray-300)'}">
                    ${scheduleSubjectTag(it.s)}
                    <span class="plan-schedule-item-title">${esc(it.title)}</span>
                    <span class="plan-schedule-item-hours">${fmtHours(a.hours)}</span>
                    ${manual ? `
                      <button class="schedule-item-btn" onclick="openMoveBlockModal(${plan.id},'${d.key}',${a.taskId},${a.hours})" title="Verplaatsen">&#8596;</button>
                      <button class="schedule-item-btn delete" onclick="removeFromDay(${plan.id},'${d.key}',${a.taskId})" title="Van deze dag halen">${icons.x}</button>
                    ` : ''}
                  </div>`;
              }).join('')}
            </div>
          </div>`;
      }).join('')}
    </div>
  `;
}

// --- Studieschema handmatig aanpassen ---
function enterManualSchedule(planId) {
  const p = getPlan(planId);
  if (!p) return;
  const sched = buildSchedule(p); // huidige automatische indeling als startpunt
  const ms = {};
  sched.days.forEach(d => d.assignments.forEach(a => {
    if (!ms[d.key]) ms[d.key] = [];
    const ex = ms[d.key].find(x => x.taskId === a.taskId);
    if (ex) ex.hours += a.hours;
    else ms[d.key].push({ taskId: a.taskId, hours: a.hours });
  }));
  p.manualSchedule = ms;
  savePlans();
  renderPage('planner');
}

function resetSchedule(planId) {
  const p = getPlan(planId);
  if (!p) return;
  if (!confirm('Terug naar het automatische schema? Je handmatige aanpassingen gaan verloren.')) return;
  delete p.manualSchedule;
  savePlans();
  renderPage('planner');
}

function removeFromDay(planId, key, taskId) {
  const p = getPlan(planId);
  if (!p || !p.manualSchedule) return;
  manualScheduleRemove(p, key, taskId, null);
  savePlans();
  renderPage('planner');
}

function openMoveBlockModal(planId, fromKey, taskId, hours) {
  const p = getPlan(planId);
  const t = p && p.tasks.find(x => x.id === taskId);
  if (!t) return;
  const s = subjects[t.subject];
  const today0 = startOfDay(today);
  const deadline = planDeadline(p);
  let opts = '';
  for (let d = new Date(today0); d <= deadline; d = addDays(d, 1)) {
    const k = dateKey(d);
    if (k === fromKey) continue;
    opts += `<button class="move-day-btn" onclick="moveBlock(${planId},'${fromKey}','${k}',${taskId},${hours})">${formatDate(d)}</button>`;
  }
  openModal('Verplaatsen', `
    <p style="color:var(--gray-500);font-size:0.85rem;margin:0 0 12px">
      <span class="schedule-dot" style="background:${s ? s.color : '#ccc'};display:inline-block"></span>
      <strong>${esc(t.title)}</strong> (${fmtHours(hours)}) verplaatsen naar:
    </p>
    <div class="move-day-list">${opts || '<p style="color:var(--gray-400)">Geen andere dagen beschikbaar.</p>'}</div>
  `);
}

function moveBlock(planId, fromKey, toKey, taskId, hours) {
  const p = getPlan(planId);
  if (!p || !p.manualSchedule) return;
  manualScheduleRemove(p, fromKey, taskId, hours);
  manualScheduleAdd(p, toKey, taskId, hours);
  savePlans();
  closeModal();
  renderPage('planner');
}

function openAddToDayModal(planId, key) {
  const p = getPlan(planId);
  if (!p) return;
  // Toon per taak hoeveel er nog niet is ingepland
  const planned = {};
  Object.values(p.manualSchedule || {}).forEach(arr => arr.forEach(a => { planned[a.taskId] = (planned[a.taskId] || 0) + a.hours; }));
  const open = p.tasks
    .map(t => ({ t, left: Math.round((Math.max(0, (t.hours || 0) - Math.max(0, t.hoursDone || 0)) - (planned[t.id] || 0)) * 100) / 100 }))
    .filter(x => x.left > 0.05);

  const d = parseDateKey(key);
  openModal('Taak toevoegen op ' + formatDate(d), `
    ${open.length === 0
      ? '<p style="color:var(--gray-500);font-size:0.9rem">Alle taakuren zijn al ingepland. Voeg eerst een taak toe of verhoog de uren van een taak.</p>'
      : `<form onsubmit="addToDay(event,${planId},'${key}')">
          <div class="form-group">
            <label class="form-label">Taak</label>
            <select class="form-select" id="addday-task" onchange="document.getElementById('addday-hours').max=this.selectedOptions[0].dataset.left;document.getElementById('addday-hours').value=Math.min(parseFloat(this.selectedOptions[0].dataset.left),parseFloat(document.getElementById('addday-hours').value)||1)">
              ${open.map(x => {
                const s = subjects[x.t.subject];
                return `<option value="${x.t.id}" data-left="${x.left}">${s ? s.name + ' — ' : ''}${esc(x.t.title)} (${fmtHours(x.left)} over)</option>`;
              }).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Hoeveel uur op deze dag?</label>
            <input type="number" class="form-input" id="addday-hours" min="0.5" max="${open[0].left}" step="0.5" value="${Math.min(1, open[0].left)}" required>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:8px">${icon('plus', 16)} Toevoegen</button>
        </form>`}
  `);
}

function addToDay(e, planId, key) {
  e.preventDefault();
  const p = getPlan(planId);
  if (!p) return;
  const taskId = parseInt(document.getElementById('addday-task').value);
  const hours = Math.max(0.5, parseFloat(document.getElementById('addday-hours').value) || 0.5);
  if (!taskId) return;
  manualScheduleAdd(p, key, taskId, hours);
  savePlans();
  closeModal();
  renderPage('planner');
}

// --- Per vak: stof opschrijven & zien wat er nog te doen is ---
function subjectStats(plan, key) {
  const tasks = plan.tasks.filter(t => t.subject === key);
  const totalH = tasks.reduce((a, t) => a + Math.max(0, t.hours || 0), 0);
  const doneH = tasks.reduce((a, t) => a + Math.min(t.hours || 0, Math.max(0, t.hoursDone || 0)), 0);
  const remaining = tasks.filter(t => !(t.hoursDone >= t.hours)).length;
  const pct = totalH > 0 ? Math.round((doneH / totalH) * 100) : 0;
  const exam = (plan.exams || []).filter(e => e.subject === key).sort((a, b) => new Date(a.date) - new Date(b.date))[0];
  return { tasks, totalH, doneH, remaining, pct, exam };
}

function renderSubjectOverview(plan) {
  const keys = [...new Set([...(plan.exams || []).map(e => e.subject), ...plan.tasks.map(t => t.subject)])]
    .filter(k => subjects[k]);
  if (keys.length === 0) return '';
  // Sorteer op toetsdatum (vakken met toets eerst, op datum), dan op naam
  keys.sort((a, b) => {
    const ea = subjectStats(plan, a).exam, eb = subjectStats(plan, b).exam;
    if (ea && eb) return new Date(ea.date) - new Date(eb.date);
    if (ea) return -1;
    if (eb) return 1;
    return subjects[a].name.localeCompare(subjects[b].name, 'nl');
  });

  return `
    <div class="card">
      <div class="card-header">
        <div class="card-title">${icon('book')} Per vak</div>
        <span style="font-size:0.8rem;color:var(--gray-400)">klik een vak voor je stof</span>
      </div>
      <div class="subject-overview-grid">
        ${keys.map(k => {
          const s = subjects[k];
          const st = subjectStats(plan, k);
          const done = st.totalH > 0 && st.remaining === 0;
          return `
            <button class="subject-ov-card" onclick="openSubjectModal(${plan.id},'${k}')" style="border-left-color:${s.color}">
              <div class="subject-ov-head">${s.icon} ${s.name}</div>
              <div class="subject-ov-meta">${st.exam ? `${icon('fileText', 11)} toets ${formatDateShort(new Date(st.exam.date))}` : 'geen toetsdatum'}</div>
              <div class="subject-ov-status ${done ? 'done' : ''}">
                ${st.totalH === 0 ? 'nog geen stof' : done ? '✓ helemaal klaar' : `${st.remaining} te doen · ${fmtHours(st.totalH - st.doneH)}`}
              </div>
              <div class="plan-task-bar"><div class="plan-task-bar-fill" style="width:${st.pct}%;background:${s.color}"></div></div>
            </button>`;
        }).join('')}
      </div>
    </div>
  `;
}

function openSubjectModal(planId, subjectKey) {
  const p = getPlan(planId);
  const s = subjects[subjectKey];
  if (!p || !s) return;
  const st = subjectStats(p, subjectKey);

  openModal(`${s.icon} ${s.name}`, `
    ${st.exam ? `<div class="subject-modal-exam">${icon('fileText', 14)} Toets op <strong>${formatDate(new Date(st.exam.date))}</strong> — ${getDueText(new Date(st.exam.date)).text}</div>` : ''}
    ${st.totalH > 0 ? `
      <div class="subject-modal-progress">
        <div class="plan-task-bar"><div class="plan-task-bar-fill" style="width:${st.pct}%;background:${s.color}"></div></div>
        <span>${fmtHours(st.doneH)} / ${fmtHours(st.totalH)} · ${st.pct}%</span>
      </div>` : ''}

    <div class="subject-stof-label">Je stof voor dit vak — wat moet je nog doen?</div>
    <div class="subject-stof-list">
      ${st.tasks.length === 0
        ? '<p style="color:var(--gray-400);font-size:0.85rem;margin:4px 0 12px">Nog niks opgeschreven. Voeg hieronder toe wat je voor dit vak moet leren of maken.</p>'
        : st.tasks.map(t => {
            const done = t.hoursDone >= t.hours;
            const dh = Math.min(t.hours, Math.max(0, t.hoursDone || 0));
            return `
              <div class="stof-row ${done ? 'done' : ''}">
                <button class="stof-check ${done ? 'on' : ''}" onclick="stofToggle(${planId},'${subjectKey}',${t.id})" title="${done ? 'Niet klaar' : 'Klaar'}">${icons.check}</button>
                <div class="stof-info">
                  <div class="stof-title ${done ? 'done' : ''}">${esc(t.title)}</div>
                  <div class="stof-sub">${fmtHours(dh)} / ${fmtHours(t.hours)}</div>
                </div>
                ${!done ? `<button class="stof-mini" onclick="stofLog(${planId},'${subjectKey}',${t.id},0.5)" title="+30 min">+&frac12;u</button>
                <button class="stof-mini" onclick="stofLog(${planId},'${subjectKey}',${t.id},1)" title="+1 uur">+1u</button>` : ''}
                <button class="stof-mini delete" onclick="stofDelete(${planId},'${subjectKey}',${t.id})" title="Verwijderen">${icons.x}</button>
              </div>`;
          }).join('')}
    </div>

    <form onsubmit="addSubjectStof(event,${planId},'${subjectKey}')" class="subject-stof-add">
      <input type="text" class="form-input" id="stof-title" placeholder="Bijv. Samenvatting H5 maken" required>
      <input type="number" class="form-input" id="stof-hours" min="0.5" max="40" step="0.5" value="1" title="Geschatte uren">
      <button type="submit" class="btn btn-primary">${icon('plus', 14)}</button>
    </form>
    <p class="form-hint">Elke regel komt als taak in je planning en wordt automatisch ingepland in je studieschema.</p>
  `);
}

function addSubjectStof(e, planId, subjectKey) {
  e.preventDefault();
  const p = getPlan(planId);
  if (!p) return;
  const title = document.getElementById('stof-title').value.trim();
  const hours = Math.max(0.5, parseFloat(document.getElementById('stof-hours').value) || 1);
  if (!title) return;
  const id = Math.max(0, ...p.tasks.map(t => t.id)) + 1;
  p.tasks.push({ id, subject: subjectKey, title, hours, hoursDone: 0, done: false });
  savePlans();
  renderPage('planner');
  openSubjectModal(planId, subjectKey);
}

function stofLog(planId, subjectKey, taskId, h) {
  const p = getPlan(planId);
  const t = p && p.tasks.find(x => x.id === taskId);
  if (!t) return;
  t.hoursDone = Math.min(t.hours, Math.max(0, (t.hoursDone || 0) + h));
  t.done = t.hoursDone >= t.hours;
  if (h > 0) updateStreak();
  savePlans();
  renderPage('planner');
  openSubjectModal(planId, subjectKey);
}

function stofToggle(planId, subjectKey, taskId) {
  const p = getPlan(planId);
  const t = p && p.tasks.find(x => x.id === taskId);
  if (!t) return;
  t.done = !(t.hoursDone >= t.hours);
  t.hoursDone = t.done ? t.hours : 0;
  if (t.done) updateStreak();
  savePlans();
  renderPage('planner');
  openSubjectModal(planId, subjectKey);
}

function stofDelete(planId, subjectKey, taskId) {
  const p = getPlan(planId);
  if (!p) return;
  p.tasks = p.tasks.filter(t => t.id !== taskId);
  savePlans();
  renderPage('planner');
  openSubjectModal(planId, subjectKey);
}

// --- Examrooster ---
function renderExamSchedule(plan) {
  const exams = [...(plan.exams || [])].sort((a, b) => new Date(a.date) - new Date(b.date));
  return `
    <div class="card">
      <div class="card-header">
        <div class="card-title">${icon('fileText')} ${plan.type === 'examen' ? 'Examenrooster' : 'Toetsrooster'}</div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-outline btn-sm" onclick="openImportTestsModal(${plan.id})">Importeer uit Toetsen</button>
          <button class="btn btn-primary btn-sm" onclick="openAddExamModal(${plan.id})">${icon('plus', 14)} ${plan.type === 'examen' ? 'Examen' : 'Toets'}</button>
        </div>
      </div>
      ${exams.length === 0
        ? '<div class="empty-state empty-state-compact"><p>Voeg de toetsen/examens van deze periode toe. De eerste datum bepaalt je deadline.</p></div>'
        : exams.map(ex => {
            const s = subjects[ex.subject];
            const due = getDueText(new Date(ex.date));
            return `
              <div class="exam-row">
                <span class="schedule-dot" style="background:${s ? s.color : 'var(--gray-300)'}"></span>
                <div class="exam-row-info">
                  <div class="exam-row-title">${esc(ex.title) || (s ? s.name : 'Toets')}</div>
                  <div class="exam-row-sub">${s ? s.name : ''} · ${formatDate(new Date(ex.date))}${ex.time ? ` · ${ex.time}` : ''}</div>
                </div>
                <span class="todo-due ${due.urgent ? 'urgent' : ''}">${due.text}</span>
                <button class="lesson-action-btn" onclick="openEditExamModal(${plan.id},${ex.id})" title="Bewerken">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                </button>
                <button class="lesson-action-btn delete" onclick="deleteExam(${plan.id},${ex.id})" title="Verwijderen">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>
                </button>
              </div>`;
          }).join('')}
    </div>
  `;
}

function openAddExamModal(planId) {
  const p = getPlan(planId);
  const isExam = p && p.type === 'examen';
  const opts = mySubjectEntries().map(([k, s]) => `<option value="${k}">${s.name}</option>`).join('');
  openModal((isExam ? 'Examen' : 'Toets') + ' toevoegen', `
    <form onsubmit="addExam(event,${planId})">
      <div class="form-group">
        <label class="form-label">Vak</label>
        <select class="form-select" id="exam-subject" required>
          <option value="">Kies een vak...</option>${opts}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Titel (optioneel)</label>
        <input type="text" class="form-input" id="exam-title" placeholder="Bijv. Proefwerk H5">
      </div>
      <div class="form-group">
        <label class="form-label">Datum</label>
        <input type="date" class="form-input" id="exam-date" required>
      </div>
      <div class="form-group">
        <label class="form-label">Tijd (optioneel)</label>
        <input type="time" class="form-input" id="exam-time">
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:8px">${icon('plus', 16)} Toevoegen</button>
    </form>
  `);
}

function addExam(e, planId) {
  e.preventDefault();
  const p = getPlan(planId);
  if (!p) return;
  const subject = document.getElementById('exam-subject').value;
  const dateVal = document.getElementById('exam-date').value;
  if (!subject || !dateVal) return;
  if (!p.exams) p.exams = [];
  const id = Math.max(0, ...p.exams.map(x => x.id)) + 1;
  p.exams.push({
    id, subject,
    title: document.getElementById('exam-title').value.trim(),
    date: new Date(dateVal).toISOString(),
    time: document.getElementById('exam-time').value,
  });
  syncPlanExamDate(p);
  savePlans();
  closeModal();
  renderPage('planner');
}

function openEditExamModal(planId, examId) {
  const p = getPlan(planId);
  const ex = p && (p.exams || []).find(x => x.id === examId);
  if (!ex) return;
  const isExam = p.type === 'examen';
  const opts = mySubjectEntries().map(([k, s]) => `<option value="${k}" ${k === ex.subject ? 'selected' : ''}>${s.name}</option>`).join('');
  openModal((isExam ? 'Examen' : 'Toets') + ' bewerken', `
    <form onsubmit="editExam(event,${planId},${examId})">
      <div class="form-group">
        <label class="form-label">Vak</label>
        <select class="form-select" id="edit-exam-subject" required>
          <option value="">Kies een vak...</option>${opts}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Titel (optioneel)</label>
        <input type="text" class="form-input" id="edit-exam-title" value="${esc(ex.title || '')}" placeholder="Bijv. Proefwerk H5">
      </div>
      <div class="form-group">
        <label class="form-label">Datum</label>
        <input type="date" class="form-input" id="edit-exam-date" value="${dateKey(new Date(ex.date))}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Tijd (optioneel)</label>
        <input type="time" class="form-input" id="edit-exam-time" value="${ex.time || ''}">
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:8px">Opslaan</button>
    </form>
  `);
}

function editExam(e, planId, examId) {
  e.preventDefault();
  const p = getPlan(planId);
  const ex = p && (p.exams || []).find(x => x.id === examId);
  if (!ex) return;
  const subject = document.getElementById('edit-exam-subject').value;
  const dateVal = document.getElementById('edit-exam-date').value;
  if (!subject || !dateVal) return;
  ex.subject = subject;
  ex.title = document.getElementById('edit-exam-title').value.trim();
  ex.date = new Date(dateVal).toISOString();
  ex.time = document.getElementById('edit-exam-time').value;
  syncPlanExamDate(p);
  savePlans();
  closeModal();
  renderPage('planner');
}

// Importeer toetsen van de Toetsen-pagina in deze planning (geen dubbel werk)
function openImportTestsModal(planId) {
  const p = getPlan(planId);
  if (!p) return;
  loadTests();
  const existing = new Set((p.exams || []).map(x => `${x.subject}|${dateKey(new Date(x.date))}`));
  const candidates = tests
    .filter(t => startOfDay(new Date(t.date)) >= startOfDay(today))
    .filter(t => !existing.has(`${t.subject}|${dateKey(new Date(t.date))}`))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (!candidates.length) {
    openModal('Importeer uit Toetsen', '<p style="color:var(--gray-500)">Geen nieuwe toetsen gevonden — alles van de Toetsen-pagina staat al in deze planning (of er zijn geen aankomende toetsen).</p>');
    return;
  }

  openModal('Importeer uit Toetsen', `
    <p style="color:var(--gray-500);font-size:0.85rem;margin:0 0 12px">Vink aan welke toetsen je aan deze planning wilt toevoegen.</p>
    <form onsubmit="importTests(event,${planId})">
      <div class="import-test-list">
        ${candidates.map(t => {
          const s = subjects[t.subject];
          return `
            <label class="import-test-row">
              <input type="checkbox" name="import-test" value="${t.id}" checked>
              <span class="schedule-dot" style="background:${s ? s.color : 'var(--gray-300)'}"></span>
              <span class="import-test-title">${esc(t.title)}</span>
              <span class="import-test-date">${formatDateShort(new Date(t.date))}</span>
            </label>`;
        }).join('')}
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:14px">Importeren</button>
    </form>
  `);
}

function importTests(e, planId) {
  e.preventDefault();
  const p = getPlan(planId);
  if (!p) return;
  if (!p.exams) p.exams = [];
  const selected = Array.from(document.querySelectorAll('input[name="import-test"]:checked')).map(el => parseInt(el.value));
  let nextId = Math.max(0, ...p.exams.map(x => x.id)) + 1;
  selected.forEach(testId => {
    const t = tests.find(x => x.id === testId);
    if (!t) return;
    p.exams.push({ id: nextId++, subject: t.subject, title: t.title, date: new Date(t.date).toISOString(), time: '' });
  });
  syncPlanExamDate(p);
  savePlans();
  closeModal();
  renderPage('planner');
}

function deleteExam(planId, examId) {
  const p = getPlan(planId);
  if (!p) return;
  p.exams = (p.exams || []).filter(x => x.id !== examId);
  syncPlanExamDate(p);
  savePlans();
  renderPage('planner');
}

// --- Tijdblokken (wanneer op de dag) ---
function openSlotModal(planId, key) {
  openModal('Wanneer heb je tijd?', `
    <form onsubmit="addSlot(event,${planId},'${key}')">
      <p style="color:var(--gray-500);font-size:0.85rem;margin:0 0 12px">Kies een tijdblok waarop je deze dag kunt werken. Je kunt er meerdere toevoegen.</p>
      <div style="display:flex;gap:10px">
        <div class="form-group" style="flex:1;margin:0">
          <label class="form-label">Van</label>
          <input type="time" class="form-input" id="slot-start" value="15:00" required>
        </div>
        <div class="form-group" style="flex:1;margin:0">
          <label class="form-label">Tot</label>
          <input type="time" class="form-input" id="slot-end" value="17:00" required>
        </div>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:14px">${icon('plus', 16)} Tijdblok toevoegen</button>
    </form>
  `);
}

function addSlot(e, planId, key) {
  e.preventDefault();
  const p = getPlan(planId);
  if (!p) return;
  const start = document.getElementById('slot-start').value;
  const end = document.getElementById('slot-end').value;
  if (!start || !end || timeToMin(end) <= timeToMin(start)) { alert('Kies een geldige eindtijd na de starttijd.'); return; }
  if (!p.slots) p.slots = {};
  if (!p.slots[key]) p.slots[key] = [];
  p.slots[key].push({ start, end });
  p.slots[key].sort((a, b) => timeToMin(a.start) - timeToMin(b.start));
  savePlans();
  closeModal();
  renderPage('planner');
}

function removeSlot(planId, key, idx) {
  const p = getPlan(planId);
  if (!p || !p.slots || !p.slots[key]) return;
  p.slots[key].splice(idx, 1);
  if (p.slots[key].length === 0) delete p.slots[key];
  savePlans();
  renderPage('planner');
}

// --- Plan CRUD ---
function planFormFields(p) {
  const examD = p ? new Date(p.examDate) : addDays(today, 14);
  const dateStr = dateKey(examD);
  return `
    <div class="form-group">
      <label class="form-label">Type</label>
      <select class="form-select" id="plan-type">
        <option value="toetsweek" ${p && p.type === 'toetsweek' ? 'selected' : ''}>Toetsweek</option>
        <option value="examen" ${p && p.type === 'examen' ? 'selected' : ''}>Examen</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Naam</label>
      <input type="text" class="form-input" id="plan-name" value="${p ? esc(p.name) : ''}" placeholder="Bijv. Toetsweek 3 of Eindexamen wiskunde" required>
    </div>
    <div class="form-group">
      <label class="form-label">Startdatum (eerste toets / examen)</label>
      <input type="date" class="form-input" id="plan-date" value="${dateStr}" required>
      <span class="form-hint">Het volledige rooster met alle toetsen/examens vul je daarna in de planner in.</span>
    </div>
    <div class="form-group">
      <label class="form-label">Klaar zijn (dagen van tevoren)</label>
      <input type="number" class="form-input" id="plan-ready" min="0" max="30" value="${p ? p.readyDaysBefore : 1}">
      <span class="form-hint">Zo lang vóór de datum wil je al helemaal klaar zijn.</span>
    </div>
    <div class="form-group">
      <label class="form-label">Standaard beschikbare uren per dag</label>
      <input type="number" class="form-input" id="plan-daily" min="0" max="16" step="0.5" value="${p ? p.defaultDailyHours : 2}">
    </div>
  `;
}

function openAddPlanModal() {
  openModal('Nieuwe planning', `
    <form onsubmit="addPlan(event)">
      ${planFormFields(null)}
      <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:8px">${icon('plus', 16)} Aanmaken</button>
    </form>
  `);
}

// ===== "Maak mijn planning" — alles automatisch op basis van je toetsen =====
let genExams = [];

function openGeneratePlanModal() {
  // Begin met je aankomende toetsen uit de Toetsen-pagina (scheelt invullen)
  loadTests();
  genExams = tests
    .filter(t => startOfDay(new Date(t.date)) >= startOfDay(today))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 12)
    .map(t => ({ subject: t.subject, date: dateKey(new Date(t.date)), title: t.title || '' }));
  if (genExams.length === 0) genExams = [{ subject: '', date: '', title: '' }];

  openModal('✨ Maak mijn planning', `
    <p style="color:var(--gray-500);font-size:0.88rem;margin:0 0 14px">
      Voeg je toetsen toe — <strong>de rest doen wij</strong>. We maken automatisch leertaken (samenvatten, oefenen, herhalen) en zetten alles in een schema.
    </p>

    <div class="form-group">
      <label class="form-label">Wat plan je?</label>
      <div class="gen-type">
        <label><input type="radio" name="gen-type" value="toetsweek" checked> Toetsweek</label>
        <label><input type="radio" name="gen-type" value="examen"> Examen</label>
      </div>
    </div>

    <label class="form-label">Je toetsen ${tests.filter(t => startOfDay(new Date(t.date)) >= startOfDay(today)).length ? '<span style="font-weight:400;color:var(--gray-400)">(overgenomen uit Toetsen — pas aan of vul aan)</span>' : ''}</label>
    <div id="gen-exam-rows"></div>
    <button type="button" class="btn btn-outline btn-sm" style="margin:4px 0 16px" onclick="genAddRow()">${icon('plus', 14)} Toets toevoegen</button>

    <div class="form-group">
      <label class="form-label">Hoeveel wil je per toets leren?</label>
      <select class="form-select" id="gen-amount">
        <option value="2">Weinig — ±2 uur per toets</option>
        <option value="4" selected>Gemiddeld — ±4 uur per toets</option>
        <option value="6">Veel — ±6 uur per toets</option>
        <option value="8">Heel veel — ±8 uur per toets</option>
      </select>
    </div>
    <div style="display:flex;gap:10px">
      <div class="form-group" style="flex:1">
        <label class="form-label">Tijd per dag</label>
        <input type="number" class="form-input" id="gen-daily" min="0.5" max="16" step="0.5" value="2">
      </div>
      <div class="form-group" style="flex:1">
        <label class="form-label">Klaar (dagen vooraf)</label>
        <input type="number" class="form-input" id="gen-ready" min="0" max="14" value="1">
      </div>
    </div>

    <button class="btn btn-primary" style="width:100%;justify-content:center;margin-top:8px;padding:12px" onclick="generatePlan()">
      ✨ Maak mijn planning
    </button>
  `);
  renderGenExamRows();
}

function renderGenExamRows() {
  const box = document.getElementById('gen-exam-rows');
  if (!box) return;
  const opts = (sel) => mySubjectEntries().map(([k, s]) => `<option value="${k}" ${k === sel ? 'selected' : ''}>${s.name}</option>`).join('');
  box.innerHTML = genExams.map((ex, i) => `
    <div class="gen-exam-row">
      <select class="form-select" onchange="genExams[${i}].subject=this.value">
        <option value="">Vak...</option>${opts(ex.subject)}
      </select>
      <input type="date" class="form-input" value="${ex.date}" onchange="genExams[${i}].date=this.value">
      <button type="button" class="lesson-action-btn delete" onclick="genRemoveRow(${i})" title="Verwijderen">${icons.x}</button>
    </div>
  `).join('');
}

function genAddRow() {
  genExams.push({ subject: '', date: '', title: '' });
  renderGenExamRows();
}

function genRemoveRow(i) {
  genExams.splice(i, 1);
  if (genExams.length === 0) genExams.push({ subject: '', date: '', title: '' });
  renderGenExamRows();
}

// Splitst de uren van één toets in standaard leertaken
function genTasksForExam(subject, baseTitle, totalHours) {
  const parts = [
    { label: 'Samenvatting / aantekeningen maken', frac: 0.4 },
    { label: 'Oefenopgaven maken', frac: 0.4 },
    { label: 'Herhalen & oefentoets', frac: 0.2 },
  ];
  const out = [];
  let used = 0;
  parts.forEach((p, idx) => {
    let h = idx === parts.length - 1
      ? Math.max(0.5, Math.round((totalHours - used) * 2) / 2)
      : Math.max(0.5, Math.round(totalHours * p.frac * 2) / 2);
    used += h;
    out.push({ title: p.label, hours: h });
  });
  return out;
}

function generatePlan() {
  const valid = genExams.filter(e => e.subject && e.date);
  if (!valid.length) { alert('Voeg minstens één toets toe (vak + datum).'); return; }

  const type = (document.querySelector('input[name="gen-type"]:checked') || {}).value || 'toetsweek';
  const hoursPer = parseFloat(document.getElementById('gen-amount').value) || 4;
  const daily = Math.max(0.5, parseFloat(document.getElementById('gen-daily').value) || 2);
  const ready = Math.max(0, parseInt(document.getElementById('gen-ready').value) || 0);

  const sorted = [...valid].sort((a, b) => new Date(a.date) - new Date(b.date));
  const earliest = new Date(sorted[0].date);

  const id = Math.max(100, ...plans.map(p => p.id), 100) + 1;
  const plan = {
    id, type,
    name: type === 'examen' ? 'Mijn examens' : 'Toetsweek',
    startDate: new Date().toISOString(),
    examDate: earliest.toISOString(),
    readyDaysBefore: ready,
    defaultDailyHours: daily,
    availability: {}, slots: {}, exams: [], tasks: [],
  };

  let exId = 1, taskId = 1;
  sorted.forEach(e => {
    const s = subjects[e.subject];
    plan.exams.push({ id: exId++, subject: e.subject, title: e.title || '', date: new Date(e.date).toISOString(), time: '' });
    genTasksForExam(e.subject, e.title, hoursPer).forEach(t => {
      plan.tasks.push({ id: taskId++, subject: e.subject, title: `${t.title} — ${s ? s.name : ''}`.trim(), hours: t.hours, hoursDone: 0, done: false });
    });
  });

  plans.push(plan);
  activePlanId = id;
  savePlans();
  closeModal();
  renderPage('planner');

  // Korte uitleg na het genereren
  const st = planStatus(plan);
  setTimeout(() => {
    openModal('Klaar! 🎉', `
      <p style="margin:0 0 12px">Je planning <strong>${esc(plan.name)}</strong> staat klaar met <strong>${plan.exams.length} toets${plan.exams.length !== 1 ? 'en' : ''}</strong> en <strong>${plan.tasks.length} leertaken</strong>, automatisch ingepland.</p>
      <ul class="onb-list" style="margin-bottom:14px">
        <li>Vink taken af of log je uren — je ziet of je op schema loopt</li>
        <li>Niet genoeg tijd? Pas "Tijd per dag" of de taken aan</li>
        <li>Iets liever eerder doen? Tik op de ⭐ bij een taak</li>
        <li>Wil je zelf schuiven? Gebruik "Schema aanpassen"</li>
      </ul>
      <button class="btn btn-primary" style="width:100%;justify-content:center" onclick="closeModal()">Aan de slag</button>
    `);
  }, 200);
}

function readPlanForm() {
  return {
    type: document.getElementById('plan-type').value,
    name: document.getElementById('plan-name').value.trim(),
    examDate: new Date(document.getElementById('plan-date').value).toISOString(),
    readyDaysBefore: Math.max(0, parseInt(document.getElementById('plan-ready').value) || 0),
    defaultDailyHours: Math.max(0, parseFloat(document.getElementById('plan-daily').value) || 0),
  };
}

function addPlan(e) {
  e.preventDefault();
  if (!document.getElementById('plan-name').value.trim() || !document.getElementById('plan-date').value) return;
  const data = readPlanForm();
  const id = Math.max(100, ...plans.map(p => p.id), 100) + 1;
  plans.push({ id, ...data, startDate: new Date().toISOString(), availability: {}, tasks: [], exams: [] });
  activePlanId = id;
  savePlans();
  closeModal();
  renderPage('planner');
}

function openEditPlanModal(id) {
  const p = getPlan(id);
  if (!p) return;
  openModal('Planning bewerken', `
    <form onsubmit="editPlan(event,${id})">
      ${planFormFields(p)}
      <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:8px">Opslaan</button>
    </form>
  `);
}

function editPlan(e, id) {
  e.preventDefault();
  const p = getPlan(id);
  if (!p) return;
  Object.assign(p, readPlanForm());
  savePlans();
  closeModal();
  renderPage('planner');
}

function deletePlan(id) {
  if (!confirm('Deze planning verwijderen?')) return;
  plans = plans.filter(p => p.id !== id);
  if (activePlanId === id) activePlanId = null;
  savePlans();
  renderPage('planner');
}

function updatePlanField(id, field, value) {
  const p = getPlan(id);
  if (!p) return;
  p[field] = value;
  savePlans();
  renderPage('planner');
}

function setAvailability(id, key, value) {
  const p = getPlan(id);
  if (!p) return;
  if (!p.availability) p.availability = {};
  const v = parseFloat(value);
  if (isNaN(v)) delete p.availability[key];
  else p.availability[key] = Math.max(0, v);
  savePlans();
  renderPage('planner');
}

// --- Taken CRUD ---
function openAddTaskModal(planId) {
  const subjectOptions = mySubjectEntries().map(([key, s]) =>
    `<option value="${key}">${s.name}</option>`).join('');
  openModal('Taak toevoegen', `
    <form onsubmit="addTask(event,${planId})">
      <div class="form-group">
        <label class="form-label">Vak</label>
        <select class="form-select" id="task-subject" required>
          <option value="">Kies een vak...</option>
          ${subjectOptions}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Wat moet je doen?</label>
        <input type="text" class="form-input" id="task-title" placeholder="Bijv. Samenvatting H5 maken" required>
      </div>
      <div class="form-group">
        <label class="form-label">Geschatte tijd (uren)</label>
        <input type="number" class="form-input" id="task-hours" min="0.5" max="40" step="0.5" value="2" required>
      </div>
      <label class="prio-check"><input type="checkbox" id="task-prio"> ★ Eerder doen (vooraan in je schema)</label>
      <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:8px">${icon('plus', 16)} Toevoegen</button>
    </form>
  `);
}

function openPasteTasksModal(planId) {
  const subjectOptions = mySubjectEntries().map(([key, s]) =>
    `<option value="${key}">${s.name}</option>`).join('');
  openModal('Lijst met taken plakken', `
    <p style="color:var(--gray-500);font-size:0.85rem;margin:0 0 12px">
      Plak je leerwerk — <strong>elke regel wordt een losse taak</strong> in je planning.
      Tips: begin een regel met een vak(afkorting) en zet er een duur achter, bijv.
      <em>"wi samenvatting H5 2u"</em>. Zonder duur geldt het standaardaantal uren hieronder.
    </p>
    <textarea class="form-input" id="paste-task-input" rows="7" placeholder="Bijv.:&#10;wi samenvatting H5 maken 2u&#10;wi oefentoets H5 1,5u&#10;en woordjes unit 7 leren 1u&#10;gs aantekeningen doorlezen" style="resize:vertical;font-size:0.85rem"></textarea>
    <div style="display:flex;gap:10px;margin-top:12px">
      <div class="form-group" style="flex:1;margin:0">
        <label class="form-label">Standaardvak</label>
        <select class="form-select" id="paste-task-subject" required>
          <option value="">Kies een vak...</option>
          ${subjectOptions}
        </select>
      </div>
      <div class="form-group" style="flex:1;margin:0">
        <label class="form-label">Standaard uren per taak</label>
        <input type="number" class="form-input" id="paste-task-hours" min="0.5" max="20" step="0.5" value="1">
      </div>
    </div>
    <button class="btn btn-primary" style="width:100%;justify-content:center;margin-top:14px" onclick="importPastedTasks(${planId})">
      ${icon('plus', 16)} Taken toevoegen
    </button>
  `);
}

function importPastedTasks(planId) {
  const p = getPlan(planId);
  if (!p) return;
  const text = document.getElementById('paste-task-input').value;
  const defaultSubject = document.getElementById('paste-task-subject').value;
  const defaultHours = Math.max(0.5, parseFloat(document.getElementById('paste-task-hours').value) || 1);
  const rows = parsePastedItems(text);
  if (!rows.length) { alert('Geen taken gevonden — plak minstens één regel tekst.'); return; }
  if (!defaultSubject && rows.some(r => !r.subject)) { alert('Kies een standaardvak (niet elke regel heeft een herkenbaar vak).'); return; }

  let nextId = Math.max(0, ...p.tasks.map(t => t.id)) + 1;
  rows.forEach(r => {
    p.tasks.push({
      id: nextId++,
      subject: r.subject || defaultSubject,
      title: r.title,
      hours: r.hours && r.hours > 0 ? Math.min(40, r.hours) : defaultHours,
      hoursDone: 0,
      done: false,
    });
  });
  savePlans();
  closeModal();
  renderPage('planner');
}

function addTask(e, planId) {
  e.preventDefault();
  const p = getPlan(planId);
  if (!p) return;
  const subject = document.getElementById('task-subject').value;
  const title = document.getElementById('task-title').value.trim();
  const hours = Math.max(0, parseFloat(document.getElementById('task-hours').value) || 0);
  if (!subject || !title || !hours) return;
  const id = Math.max(0, ...p.tasks.map(t => t.id)) + 1;
  const priority = !!(document.getElementById('task-prio') && document.getElementById('task-prio').checked);
  p.tasks.push({ id, subject, title, hours, hoursDone: 0, done: false, priority });
  savePlans();
  closeModal();
  renderPage('planner');
}

function toggleTaskPriority(planId, taskId) {
  const p = getPlan(planId);
  const t = p && p.tasks.find(x => x.id === taskId);
  if (!t) return;
  t.priority = !t.priority;
  savePlans();
  renderPage('planner');
}

function openEditTaskModal(planId, taskId) {
  const p = getPlan(planId);
  const t = p && p.tasks.find(x => x.id === taskId);
  if (!t) return;
  const subjectOptions = mySubjectEntries().map(([key, s]) =>
    `<option value="${key}" ${key === t.subject ? 'selected' : ''}>${s.name}</option>`).join('');
  openModal('Taak bewerken', `
    <form onsubmit="editTask(event,${planId},${taskId})">
      <div class="form-group">
        <label class="form-label">Vak</label>
        <select class="form-select" id="edit-task-subject" required>${subjectOptions}</select>
      </div>
      <div class="form-group">
        <label class="form-label">Wat moet je doen?</label>
        <input type="text" class="form-input" id="edit-task-title" value="${esc(t.title)}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Geschatte tijd (uren)</label>
        <input type="number" class="form-input" id="edit-task-hours" min="0.5" max="40" step="0.5" value="${t.hours}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Al gedaan (uren)</label>
        <input type="number" class="form-input" id="edit-task-done" min="0" max="40" step="0.25" value="${Math.max(0, t.hoursDone || 0)}">
      </div>
      <label class="prio-check"><input type="checkbox" id="edit-task-prio" ${t.priority ? 'checked' : ''}> ★ Eerder doen (vooraan in je schema)</label>
      <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:8px">Opslaan</button>
    </form>
  `);
}

function editTask(e, planId, taskId) {
  e.preventDefault();
  const p = getPlan(planId);
  const t = p && p.tasks.find(x => x.id === taskId);
  if (!t) return;
  const hours = parseFloat(document.getElementById('edit-task-hours').value);
  const done = parseFloat(document.getElementById('edit-task-done').value);
  t.subject = document.getElementById('edit-task-subject').value;
  t.title = document.getElementById('edit-task-title').value.trim() || t.title;
  t.hours = isNaN(hours) ? t.hours : Math.min(40, Math.max(0.5, hours));
  t.hoursDone = isNaN(done) ? (t.hoursDone || 0) : Math.min(t.hours, Math.max(0, done));
  t.done = t.hoursDone >= t.hours;
  t.priority = !!document.getElementById('edit-task-prio').checked;
  savePlans();
  closeModal();
  renderPage('planner');
}

function openLogHoursModal(planId, taskId) {
  const p = getPlan(planId);
  const t = p && p.tasks.find(x => x.id === taskId);
  if (!t) return;
  const done = Math.min(t.hours, Math.max(0, t.hoursDone || 0));
  openModal('Uren loggen', `
    <p style="margin:0 0 4px;font-weight:600">${esc(t.title)}</p>
    <p style="margin:0 0 14px;color:var(--gray-500);font-size:0.85rem">${fmtHours(done)} van ${fmtHours(t.hours)} gedaan</p>
    <div class="log-quick-row">
      <button class="btn btn-outline" onclick="logTaskHours(${planId},${taskId},0.5)">+0,5 uur</button>
      <button class="btn btn-outline" onclick="logTaskHours(${planId},${taskId},1)">+1 uur</button>
      <button class="btn btn-outline" onclick="logTaskHours(${planId},${taskId},2)">+2 uur</button>
    </div>
    <form onsubmit="logTaskHoursExact(event,${planId},${taskId})" style="margin-top:14px">
      <div class="form-group">
        <label class="form-label">Of vul precies in hoeveel uur je erbij hebt gedaan</label>
        <input type="number" class="form-input" id="log-hours-input" min="-${done}" max="${t.hours}" step="0.25" placeholder="Bijv. 1,5 (negatief om te corrigeren)">
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center">Opslaan</button>
    </form>
  `);
}

function logTaskHours(planId, taskId, delta) {
  const p = getPlan(planId);
  if (!p) return;
  const t = p.tasks.find(x => x.id === taskId);
  if (!t) return;
  t.hoursDone = Math.min(t.hours, Math.max(0, (t.hoursDone || 0) + delta));
  t.done = t.hoursDone >= t.hours;
  if (delta > 0) updateStreak(); // studeren telt mee voor je streak
  savePlans();
  closeModal();
  renderPage('planner');
}

function logTaskHoursExact(e, planId, taskId) {
  e.preventDefault();
  const v = parseFloat(document.getElementById('log-hours-input').value);
  if (isNaN(v) || v === 0) { closeModal(); return; }
  logTaskHours(planId, taskId, v);
}

function toggleTaskDone(planId, taskId) {
  const p = getPlan(planId);
  if (!p) return;
  const t = p.tasks.find(x => x.id === taskId);
  if (!t) return;
  t.done = !(t.hoursDone >= t.hours);
  t.hoursDone = t.done ? t.hours : 0;
  if (t.done) updateStreak();
  savePlans();
  renderPage('planner');
}

function deleteTask(planId, taskId) {
  const p = getPlan(planId);
  if (!p) return;
  p.tasks = p.tasks.filter(t => t.id !== taskId);
  savePlans();
  renderPage('planner');
}

// --- Dashboard-kaart: wat moet je vandaag leren? ---
function renderStudyTodayCard(plan, st) {
  const today0 = startOfDay(today);
  const day = st.sched.days.find(d => +d.date === +today0);
  if (!day || day.assignments.length === 0) return '';
  const useTimed = day.timed && day.timed.length;

  return `
    <div class="card">
      <div class="card-header">
        <div class="card-title">${icon('bookOpen')} Te leren vandaag</div>
        <span class="card-action" onclick="navigate('planner')">${fmtHours(day.used)} &rarr;</span>
      </div>
      ${(useTimed ? day.timed : day.assignments).map(a => {
        const s = subjects[a.subject];
        return `
          <div class="schedule-item">
            ${useTimed ? `<span class="schedule-time">${a.start} - ${a.end}</span>` : ''}
            <span class="schedule-dot" style="background:${s ? s.color : 'var(--gray-300)'}"></span>
            <div class="schedule-info">
              <div class="schedule-subject">${esc(a.title)}</div>
              <div class="schedule-detail">${s ? s.name : ''}${!useTimed ? ` · ${fmtHours(a.hours)}` : ''}</div>
            </div>
          </div>`;
      }).join('')}
    </div>
  `;
}

// --- Dashboard-kaart: loop ik op schema? ---
function renderPlannerDashboardCard() {
  loadPlans();
  const plan = getDashboardPlan();

  if (!plan) {
    return `
      <div class="card">
        <div class="card-header">
          <div class="card-title">${icon('target')} Toetsweek &amp; examen</div>
          <span class="card-action" onclick="navigate('planner')">Planner &rarr;</span>
        </div>
        <div class="empty-state empty-state-compact">
          <p>Nog geen planning. Plan je toetsweek of examen vooruit.</p>
          <button class="btn btn-primary btn-sm" style="margin-top:8px" onclick="navigate('planner')">${icon('plus', 14)} Planning maken</button>
        </div>
      </div>`;
  }

  const st = planStatus(plan);
  const lbl = statusLabel(st);
  return `
    <div class="card">
      <div class="card-header">
        <div class="card-title">${icon('target')} Op schema?</div>
        <span class="card-action" onclick="navigate('planner')">Planner &rarr;</span>
      </div>
      <div class="dash-plan ${lbl.cls}" onclick="navigate('planner')">
        <div class="dash-plan-ring">${renderCircularProgress(st.pct, 76, 7)}</div>
        <div class="dash-plan-info">
          <div class="dash-plan-name">
            <span class="plan-chip-type ${plan.type}">${plan.type === 'examen' ? 'Examen' : 'Toetsweek'}</span>
            ${esc(plan.name)}
          </div>
          <div class="dash-plan-status ${lbl.cls}">${lbl.text}</div>
          <div class="dash-plan-meta">
            ${st.daysToDeadline >= 0 ? `Nog ${st.daysToDeadline} dag${st.daysToDeadline !== 1 ? 'en' : ''} tot deadline` : 'Deadline verstreken'}
            · ${fmtHours(st.remaining)} te gaan
          </div>
        </div>
      </div>
    </div>
  `;
}
