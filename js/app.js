// ============================================================
// SchoolPlanner — App Router & Initialization
// ============================================================

let currentPage = 'dashboard';

const routes = {
  dashboard:    { title: 'Dashboard',    render: renderDashboard,    icon: 'home' },
  planner:      { title: 'Planner',      render: renderPlanner,      icon: 'target' },
  rooster:      { title: 'Rooster',      render: renderRooster,      icon: 'calendar' },
  huiswerk:     { title: 'Huiswerk',     render: renderHuiswerk,     icon: 'book' },
  toetsen:      { title: 'Toetsen',      render: renderToetsen,      icon: 'fileText' },
  agenda:       { title: 'Agenda',       render: renderAgenda,       icon: 'clipboard' },
  cijfers:      { title: 'Cijfers',      render: renderCijfers,      icon: 'barChart' },
  instellingen: { title: 'Instellingen', render: renderInstellingen, icon: 'settings', hideNav: true },
};

// --- Navigation ---
function navigate(page) {
  if (routes[page]) {
    currentPage = page;
    window.location.hash = page === 'dashboard' ? '' : page;
    renderPage(page);
  }
}

let lastRenderedPage = null;

function renderPage(page) {
  currentPage = page;
  const route = routes[page];
  if (!route) return;

  const content = document.getElementById('app-content');
  const keepScroll = lastRenderedPage === page;
  const scrollY = window.scrollY;
  content.innerHTML = route.render();

  // Update navbar active states
  document.querySelectorAll('.navbar-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });

  // Update mobile nav active states
  document.querySelectorAll('.mobile-nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });

  // Behoud scrollpositie bij her-render van dezelfde pagina (bijv. afvinken)
  if (keepScroll) window.scrollTo(0, scrollY);
  else window.scrollTo(0, 0);
  lastRenderedPage = page;
}

// --- Render Navbar ---
function renderNavbar() {
  const navLinks = Object.entries(routes)
    .filter(([key, route]) => !route.hideNav)
    .map(([key, route]) => `
    <div class="navbar-link ${currentPage === key ? 'active' : ''}" data-page="${key}" onclick="navigate('${key}')">
      ${route.title}
    </div>
  `).join('');

  return `
    <div class="navbar-logo">
      ${icons.graduationCap}
      Examen-Planner
    </div>
    <div class="navbar-links">
      ${navLinks}
    </div>
    <div class="navbar-right">
      <div class="navbar-icon-btn" onclick="openHelpModal()" title="Help">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          <line x1="12" x2="12.01" y1="17" y2="17"/>
        </svg>
      </div>
      <div class="navbar-icon-btn" onclick="navigate('instellingen')" title="Instellingen">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </div>
      <div class="navbar-notification" onclick="toggleNotifications(event)">
        ${icons.bell}
        ${buildNotifications().length > 0 ? '<div class="badge"></div>' : ''}
        <div class="notification-dropdown" id="notification-dropdown">
          ${renderNotifications()}
        </div>
      </div>
      <div class="navbar-profile" onclick="navigate('dashboard')">
        <div class="navbar-avatar">${appSettings.userName.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
        <span class="navbar-profile-name">${appSettings.userName}</span>
      </div>
    </div>
  `;
}

function toggleNotifications(e) {
  e.stopPropagation();
  const dropdown = document.getElementById('notification-dropdown');
  dropdown.classList.toggle('open');
}

// --- Render Mobile Nav ---
function renderMobileNav() {
  const items = Object.entries(routes)
    .filter(([key, route]) => !route.hideNav)
    .map(([key, route]) => `
    <div class="mobile-nav-item ${currentPage === key ? 'active' : ''}" data-page="${key}" onclick="navigate('${key}')">
      ${icon(route.icon, 22)}
      ${route.title}
    </div>
  `).join('');

  return `<div class="mobile-nav-inner">${items}</div>`;
}

function showApp() {
  // Render shell
  document.getElementById('navbar').innerHTML = renderNavbar();
  document.getElementById('mobile-nav').innerHTML = renderMobileNav();

  // Render initial page
  renderPage(currentPage);
}

// --- Initialize App ---
function initApp() {
  // Load persistent data
  loadSettings();
  loadTodos();
  loadHomework();
  loadSchedule();
  loadTests();
  loadEvents();
  loadPlans();
  loadGrades();
  loadIcalFeeds();
  loadGame();

  // Parse hash
  const hash = window.location.hash.slice(1);
  if (hash && routes[hash]) {
    currentPage = hash;
  }

  showApp();

  // Eerste bezoek? Toon de welkomst-wizard (niveau + vakken kiezen).
  // Bestaande gebruikers (met al opgeslagen gegevens) slaan we stilzwijgend over.
  const hasData = localStorage.getItem('sp_settings') || localStorage.getItem('sp_plans') || localStorage.getItem('sp_homework') || localStorage.getItem('sp_grades');
  if (!localStorage.getItem('sp_onboarded')) {
    if (hasData) localStorage.setItem('sp_onboarded', 'true');
    else showOnboarding();
  }

  // Close notification dropdown on outside click
  document.addEventListener('click', () => {
    const dropdown = document.getElementById('notification-dropdown');
    if (dropdown) dropdown.classList.remove('open');
  });
}

// --- Hash change listener ---
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.slice(1) || 'dashboard';
  if (routes[hash] && hash !== currentPage) {
    renderPage(hash);
  }
});

// --- Start ---
document.addEventListener('DOMContentLoaded', initApp);
