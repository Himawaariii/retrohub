/**
 * RetroHub • Módulo de Barra de Herramientas Común (Common Web Toolbar)
 * Estética: Nintendo Wii + Frutiger Aero Glass Moderno
 * Proporciona una barra superior consistente en toda la web con:
 * - Logo oficial de RetroHub a la izquierda
 * - Píldoras de navegación centrales (Consolas, Comunidad, Mi Perfil)
 * - Reloj en tiempo real y Perfil de Usuario autenticado a la derecha
 */
(function () {
  function getCurrentPageKey() {
    const path = (window.location.pathname || '').toLowerCase();
    if (path.includes('profile')) return 'profile';
    if (path.includes('iisu_network') || path.includes('network')) return 'community';
    return 'launcher';
  }

  function formatNowTime() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  function buildToolbarHTML() {
    const pageKey = getCurrentPageKey();
    const username = localStorage.getItem('retrohub_user_name') || 'himawari';
    const displayName = localStorage.getItem('retrohub_display_name') || username;
    const avatarUrl =
      localStorage.getItem('retrohub_user_avatar') ||
      `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`;

    return `
      <div class="rh-common-toolbar-wrap">
        <header class="rh-common-toolbar" role="banner">
          <!-- IZQUIERDA: LOGO DEL SITIO -->
          <div class="rh-toolbar-left">
            <a href="index.html" class="rh-brand-link" title="Ir al inicio de RetroHub">
              <div class="rh-brand-orb">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M7 2h-1a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h1a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm-2 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm1 7H4v-2h2v2z"/>
                  <path d="M17 2h1a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5h-1a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm2 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-1-7h2V6h-2v2z"/>
                </svg>
              </div>
              <div class="rh-brand-text">
                <span class="rh-brand-title">RetroHub</span>
                <span class="rh-brand-sub">Aero Gaming OS</span>
              </div>
            </a>
          </div>

          <!-- CENTRO: NAVEGACIÓN PRINCIPAL EN CÁPSULAS CRISTALINAS -->
          <nav class="rh-toolbar-nav" aria-label="Navegación Principal">
            <a href="index.html" class="rh-nav-pill ${pageKey === 'launcher' ? 'active' : ''}">
              <span>🕹️</span>
              <span>Consolas</span>
            </a>
            <a href="iisu_network.html" class="rh-nav-pill ${pageKey === 'community' ? 'active' : ''}">
              <span>🌐</span>
              <span>Comunidad</span>
            </a>
            <a href="profile.html" class="rh-nav-pill ${pageKey === 'profile' ? 'active' : ''}">
              <span>👤</span>
              <span>Mi Perfil</span>
            </a>
          </nav>

          <!-- DERECHA: RELOJ + PERFIL DE USUARIO -->
          <div class="rh-toolbar-right">
            <div class="rh-status-clock-pill" title="Servidor RetroHub Activo">
              <span class="rh-aero-pearl-dot"></span>
              <span id="rhToolbarClock">${formatNowTime()}</span>
            </div>

            <a href="profile.html" class="rh-user-profile-pill ${pageKey === 'profile' ? 'active-page' : ''}" id="rhToolbarUserPill" title="Ver y personalizar mi perfil">
              <div class="rh-user-avatar-wrap">
                <img id="rhToolbarAvatar" src="${avatarUrl}" class="rh-user-avatar-img" alt="Avatar" onerror="this.src='https://api.dicebear.com/7.x/bottts/svg?seed=SaraHimawari'" />
                <span class="rh-user-online-badge"></span>
              </div>
              <div class="rh-user-meta">
                <span class="rh-user-name" id="rhToolbarDisplayName">${displayName}</span>
                <span class="rh-user-handle" id="rhToolbarUsername">@${username}</span>
              </div>
            </a>

            <button class="rh-btn-logout" id="rhToolbarLogoutBtn" title="Cerrar sesión">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </header>
      </div>
    `;
  }

  function updateToolbarUser(userObj) {
    if (!userObj) return;
    const dNameEl = document.getElementById('rhToolbarDisplayName');
    const uNameEl = document.getElementById('rhToolbarUsername');
    const avEl = document.getElementById('rhToolbarAvatar');

    if (dNameEl && (userObj.displayName || userObj.username)) {
      dNameEl.textContent = userObj.displayName || userObj.username;
    }
    if (uNameEl && userObj.username) {
      uNameEl.textContent = `@${userObj.username}`;
    }
    if (avEl && userObj.avatarUrl) {
      avEl.src = userObj.avatarUrl;
    }
  }

  function syncAuthenticatedUser() {
    const token = localStorage.getItem('retrohub_jwt_token');
    const storedUser = localStorage.getItem('retrohub_user_name');
    const headers = {};
    let url = '/api/users/profile';

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else if (storedUser) {
      url = `/api/users/profile/${encodeURIComponent(storedUser.trim().toLowerCase())}`;
    } else {
      return;
    }

    fetch(url, { headers })
      .then((r) => r.json())
      .then((data) => {
        if (data && data.success && data.user) {
          const u = data.user;
          localStorage.setItem('retrohub_user_name', u.username);
          localStorage.setItem('retrohub_display_name', u.displayName || u.username);
          if (u.avatarUrl) localStorage.setItem('retrohub_user_avatar', u.avatarUrl);
          updateToolbarUser({
            username: u.username,
            displayName: u.displayName || u.username,
            avatarUrl: u.avatarUrl
          });
        }
      })
      .catch(() => {});
  }

  function initToolbar() {
    let mount = document.getElementById('retrohubGlobalToolbar');
    if (mount) {
      mount.innerHTML = buildToolbarHTML();
    }

    const logoutBtn = document.getElementById('rhToolbarLogoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('retrohub_jwt_token');
        localStorage.removeItem('retrohub_token');
        window.location.href = 'login.html';
      });
    }

    setInterval(() => {
      const clockEl = document.getElementById('rhToolbarClock');
      if (clockEl) clockEl.textContent = formatNowTime();
    }, 1000);

    syncAuthenticatedUser();

    if (typeof BroadcastChannel !== 'undefined') {
      const ch = new BroadcastChannel('retrohub_profile_sync');
      ch.onmessage = (event) => {
        if (event.data && event.data.type === 'PROFILE_UPDATED') {
          updateToolbarUser(event.data);
        }
      };
    }

    window.addEventListener('storage', (e) => {
      if (e.key === 'retrohub_display_name' || e.key === 'retrohub_user_name' || e.key === 'retrohub_user_avatar') {
        updateToolbarUser({
          username: localStorage.getItem('retrohub_user_name'),
          displayName: localStorage.getItem('retrohub_display_name'),
          avatarUrl: localStorage.getItem('retrohub_user_avatar')
        });
      }
    });
  }

  window.RetroHubToolbar = {
    init: initToolbar,
    updateUser: updateToolbarUser
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToolbar);
  } else {
    initToolbar();
  }
})();
