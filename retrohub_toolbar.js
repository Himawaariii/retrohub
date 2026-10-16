/**
 * RetroHub • Barra de Herramientas Común + Sistema de Chat Lateral (Amigos & Grupos)
 * REGLA ESTRICTA: CERO EMOJIS — 100% ICONOS VECTORIALES SVG COLORIDOS
 */
(function () {
  /* ========================================================================
     1. LIBRERÍA DE ICONOS SVG COLORIDOS (LUCIDE / PHOSPHOR STYLE)
     ======================================================================== */
  const ICONS = {
    gamepad: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="6"></rect><line x1="6" y1="12" x2="10" y2="12"></line><line x1="8" y1="10" x2="8" y2="14"></line><circle cx="15.5" cy="13.5" r="1.2" fill="currentColor"></circle><circle cx="18.5" cy="10.5" r="1.2" fill="currentColor"></circle></svg>`,
    globe: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
    user: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
    chat: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>`,
    users: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
    plus: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
    userPlus: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>`,
    send: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`,
    back: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>`,
    close: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    copy: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
    logout: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>`,
    joycons: `<svg viewBox="0 0 24 24" width="21" height="21" fill="currentColor"><path d="M7 2h-1a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h1a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm-2 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm1 7H4v-2h2v2z"/><path d="M17 2h1a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5h-1a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm2 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-1-7h2V6h-2v2z"/></svg>`,
    ticket: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"></path><path d="M13 5v2"></path><path d="M13 11v2"></path><path d="M13 17v2"></path></svg>`,
    shieldCheck: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>`,
    editPencil: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 2 2h14a2 2 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
    tag: `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>`,
    check: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    trash: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
    palette: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C21.437 6.426 17.202 2 12 2z"></path></svg>`,
    sparkles: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>`,
    layers: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`
  };

  function getCurrentPageKey() {
    const path = (window.location.pathname || '').toLowerCase();
    if (path.includes('profile')) return 'profile';
    if (path.includes('iisu_network') || path.includes('network')) return 'community';
    if (path.includes('incidencia') || path.includes('ticket')) return 'incidencias';
    return 'launcher';
  }

  function formatNowTime() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ========================================================================
     2. BARRA SUPERIOR COMÚN (#retrohubGlobalToolbar)
     ======================================================================== */
  function buildToolbarHTML() {
    const pageKey = getCurrentPageKey();
    const username = localStorage.getItem('retrohub_user_name') || 'himawari';
    const displayName = localStorage.getItem('retrohub_display_name') || username;
    const role = localStorage.getItem('retrohub_user_role') || (username.toLowerCase() === 'sariwiiwi' ? 'admin' : 'user');
    const avatarUrl =
      localStorage.getItem('retrohub_user_avatar') ||
      `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`;

    const adminBadgeHTML = role === 'admin' 
      ? `<span class="rh-user-role-badge admin" title="Administradora del Sistema">${ICONS.shieldCheck} Admin</span>` 
      : '';

    return `
      <div class="rh-common-toolbar-wrap">
        <header class="rh-common-toolbar" role="banner">
          <!-- IZQUIERDA: LOGO DEL SITIO -->
          <div class="rh-toolbar-left">
            <a href="index.html" class="rh-brand-link" title="Ir al inicio de RetroHub">
              <div class="rh-brand-orb">
                ${ICONS.joycons}
              </div>
              <div class="rh-brand-text">
                <span class="rh-brand-title">RetroHub</span>
                <span class="rh-brand-sub">Nintendo Clean OS</span>
              </div>
            </a>
          </div>

          <!-- CENTRO: NAVEGACIÓN PRINCIPAL CON ICONOS COLORIDOS -->
          <nav class="rh-toolbar-nav" aria-label="Navegación Principal">
            <a href="index.html" class="rh-nav-pill ${pageKey === 'launcher' ? 'active' : ''}">
              <span class="rh-nav-icon-circle icon-consoles">${ICONS.gamepad}</span>
              <span>Consolas</span>
            </a>
            <a href="iisu_network.html" class="rh-nav-pill ${pageKey === 'community' ? 'active' : ''}">
              <span class="rh-nav-icon-circle icon-community">${ICONS.globe}</span>
              <span>Comunidad</span>
            </a>
            <a href="incidencias.html" class="rh-nav-pill ${pageKey === 'incidencias' ? 'active' : ''}">
              <span class="rh-nav-icon-circle icon-incidencias">${ICONS.ticket}</span>
              <span>Incidencias</span>
            </a>
            <a href="profile.html" class="rh-nav-pill ${pageKey === 'profile' ? 'active' : ''}">
              <span class="rh-nav-icon-circle icon-profile">${ICONS.user}</span>
              <span>Mi Perfil</span>
            </a>
          </nav>

          <!-- DERECHA: BOTÓN CHAT LATERAL + RELOJ + PERFIL DE USUARIO -->
          <div class="rh-toolbar-right">
            <button class="rh-chat-toggle-btn" id="rhToolbarChatBtn" type="button" title="Abrir Chat de Amigos y Grupos">
              <span class="rh-chat-toggle-icon-wrap">${ICONS.chat}</span>
              <span>Chat y Grupos</span>
              <span class="rh-chat-unread-badge" id="rhToolbarChatUnread" style="display: none;">0</span>
            </button>

            <div class="rh-status-clock-pill" title="Servidor RetroHub Activo">
              <span class="rh-aero-pearl-dot"></span>
              <span id="rhToolbarClock">${formatNowTime()}</span>
            </div>

            <a href="profile.html" class="rh-user-profile-pill ${pageKey === 'profile' ? 'active-page' : ''}" id="rhToolbarUserPill" title="Ver y personalizar mi perfil">
              <div class="rh-user-avatar-wrap">
                <img id="rhToolbarAvatar" src="${escapeHtml(avatarUrl)}" class="rh-user-avatar-img" alt="Avatar" onerror="this.src='https://api.dicebear.com/7.x/bottts/svg?seed=himawari'" />
                <span class="rh-user-online-badge"></span>
              </div>
              <div class="rh-user-meta">
                <div class="rh-user-name-line" style="display: flex; align-items: center; gap: 5px;">
                  <span class="rh-user-name" id="rhToolbarDisplayName">${escapeHtml(displayName)}</span>
                  ${adminBadgeHTML}
                </div>
                <span class="rh-user-handle" id="rhToolbarUsername">@${escapeHtml(username)}</span>
              </div>
            </a>

            <button class="rh-btn-logout" id="rhToolbarLogoutBtn" type="button" title="Cerrar sesión">
              ${ICONS.logout}
            </button>
          </div>
        </header>
      </div>
    `;
  }

  /* ========================================================================
     3. ESTADO Y CONTROLADOR DEL MENÚ LATERAL DE CHAT (AMIGOS Y GRUPOS)
     ======================================================================== */
  const CHAT_STATE = {
    isOpen: false,
    activeTab: 'friends', // 'friends' | 'groups'
    activeDM: null, // friend object
    activeGroup: null, // group object
    showCreateGroup: false,
    showJoinGroup: false,
    showInviteToGroup: false,
    newGroupColor: '#00a2ed',
    friends: [],
    allUsers: [],
    groups: [],
    messages: [],
    statusBanner: null,
    pollTimer: null,
    // Apodos únicos personales (solo visibles para el usuario que los pone)
    nicknames: {},
    editingNicknameUserId: null,
    // Indicadores de "Escribiendo..." (WhatsApp Bubble + Discord status bar)
    typingUsers: [],
    lastTypingSentAt: 0,
    typingTimeout: null,
    typingPollTimer: null,
    // Temas personalizados de chat, fondos y formatos de burbuja
    themes: {},
    themeModalDraft: null
  };

  function getAuthHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('retrohub_jwt_token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const uid = localStorage.getItem('retrohub_user_id');
    if (uid) headers['X-User-Id'] = String(uid);
    const uname = getCurrentUsername();
    if (uname) headers['X-User-Name'] = uname;
    return headers;
  }

  function getCurrentUsername() {
    return (localStorage.getItem('retrohub_user_name') || 'himawari').trim();
  }

  /* ========================================================================
     GESTIÓN DE APODOS PERSONALIZADOS (ESTRICTAMENTE PRIVADOS AL USUARIO)
     ======================================================================== */
  function loadLocalNicknames() {
    try {
      const myU = getCurrentUsername().toLowerCase();
      const raw = localStorage.getItem(`rh_custom_nicknames_${myU}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          CHAT_STATE.nicknames = Object.assign({}, parsed);
        }
      }
    } catch (e) {}
  }

  function saveLocalNicknames() {
    try {
      const myU = getCurrentUsername().toLowerCase();
      localStorage.setItem(`rh_custom_nicknames_${myU}`, JSON.stringify(CHAT_STATE.nicknames));
    } catch (e) {}
  }

  function getEffectiveName(userOrId, fallbackUsername, fallbackDisplayName) {
    if (typeof userOrId === 'object' && userOrId !== null) {
      const uid = String(userOrId.id || userOrId.senderId || '');
      if (uid && CHAT_STATE.nicknames[uid]) return CHAT_STATE.nicknames[uid];
      if (userOrId.customNickname && !CHAT_STATE.nicknames.hasOwnProperty(uid)) return userOrId.customNickname;
      if (userOrId.senderCustomNickname && !CHAT_STATE.nicknames.hasOwnProperty(uid)) return userOrId.senderCustomNickname;
      return userOrId.displayName || userOrId.senderDisplayName || userOrId.username || userOrId.senderUsername || 'Usuario';
    }
    const uid = String(userOrId || '');
    if (uid && CHAT_STATE.nicknames[uid]) return CHAT_STATE.nicknames[uid];
    return fallbackDisplayName || fallbackUsername || 'Usuario';
  }

  function hasCustomNickname(userOrId) {
    if (typeof userOrId === 'object' && userOrId !== null) {
      const uid = String(userOrId.id || userOrId.senderId || '');
      if (uid && CHAT_STATE.nicknames[uid]) return true;
      if (uid && CHAT_STATE.nicknames.hasOwnProperty(uid) && !CHAT_STATE.nicknames[uid]) return false;
      return Boolean(userOrId.customNickname || userOrId.senderCustomNickname);
    }
    const uid = String(userOrId || '');
    return Boolean(uid && CHAT_STATE.nicknames[uid]);
  }

  async function setCustomNickname(targetUserId, newNickname) {
    const clean = String(newNickname || '').trim();
    const uidStr = String(targetUserId);

    // 1. Actualización optimista inmediata en memoria local
    if (clean) {
      CHAT_STATE.nicknames[uidStr] = clean;
    } else {
      delete CHAT_STATE.nicknames[uidStr];
    }
    saveLocalNicknames();

    // 2. Actualizar activeDM si está abierto
    if (CHAT_STATE.activeDM && String(CHAT_STATE.activeDM.id) === uidStr) {
      CHAT_STATE.activeDM.customNickname = clean || null;
      CHAT_STATE.activeDM.effectiveDisplayName = clean || CHAT_STATE.activeDM.displayName || CHAT_STATE.activeDM.username;
    }

    // 3. Actualizar en lista de amigos
    const fr = CHAT_STATE.friends.find((f) => String(f.id) === uidStr);
    if (fr) {
      fr.customNickname = clean || null;
      fr.effectiveDisplayName = clean || fr.displayName || fr.username;
    }

    // 4. Actualizar en allUsers
    const usr = CHAT_STATE.allUsers.find((u) => String(u.id) === uidStr);
    if (usr) {
      usr.customNickname = clean || null;
      usr.effectiveDisplayName = clean || usr.displayName || usr.username;
    }

    // 5. Actualizar en mensajes activos
    if (Array.isArray(CHAT_STATE.messages)) {
      CHAT_STATE.messages.forEach((m) => {
        if (String(m.senderId) === uidStr) {
          m.senderCustomNickname = clean || null;
          m.senderEffectiveName = clean || m.senderDisplayName || m.senderUsername;
        }
      });
    }

    CHAT_STATE.statusBanner = {
      type: 'success',
      text: clean ? `Apodo guardado: "${clean}" (solo tú lo verás).` : 'Apodo restablecido correctamente.'
    };

    // Refrescar UI del chat inmediatamente
    renderChatSidebarBody();

    // 6. Persistir en el servidor
    try {
      const res = await fetch('/api/chat/nicknames', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          targetUserId: Number(targetUserId),
          nickname: clean,
          username: getCurrentUsername(),
          userId: localStorage.getItem('retrohub_user_id')
        })
      });
      const data = await res.json();
      if (data && data.success) {
        if (data.nicknames && typeof data.nicknames === 'object') {
          CHAT_STATE.nicknames = Object.assign({}, data.nicknames);
          saveLocalNicknames();
        }
        fetchChatOverview();
      }
    } catch (e) {
      console.warn('[RetroHub Chat] Error guardando apodo:', e);
    }
  }

  function openNicknameModal(targetUserId, targetUsername, targetDisplayName, targetAvatarUrl) {
    if (!targetUserId) return;
    const uidStr = String(targetUserId);
    const uname = targetUsername || 'Usuario';
    const dname = targetDisplayName || uname;
    const avatar = targetAvatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${uname}`;
    const currentNick = CHAT_STATE.nicknames[uidStr] || '';

    let modalEl = document.getElementById('rhNicknameModalBackdrop');
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.id = 'rhNicknameModalBackdrop';
      modalEl.className = 'rh-nickname-modal-backdrop';
      document.body.appendChild(modalEl);
    }

    modalEl.innerHTML = `
      <div class="rh-nickname-modal-card" role="dialog" aria-modal="true" aria-labelledby="rhNickModalTitle">
        <div class="rh-nickname-modal-head">
          <div class="rh-nickname-modal-title" id="rhNickModalTitle">
            <span class="rh-nickname-icon-wrap">${ICONS.tag}</span>
            <span>Apodo Personal Privado</span>
          </div>
          <button type="button" class="rh-nickname-btn-close" onclick="window.RetroHubChat.closeNicknameModal()" aria-label="Cerrar">
            ${ICONS.close}
          </button>
        </div>

        <div class="rh-nickname-user-preview">
          <img src="${escapeHtml(avatar)}" class="rh-nickname-preview-avatar" alt="" onerror="this.src='https://api.dicebear.com/7.x/bottts/svg?seed=user'" />
          <div class="rh-nickname-preview-info">
            <div class="rh-nickname-preview-display">${escapeHtml(dname)}</div>
            <div class="rh-nickname-preview-user">@${escapeHtml(uname)}</div>
          </div>
        </div>

        <div class="rh-nickname-notice">
          <span class="rh-notice-icon">${ICONS.shieldCheck}</span>
          <span><strong>Estrictamente privado:</strong> Este apodo solo lo verás tú en toda la web. Nadie más sabrá qué apodo le pusiste.</span>
        </div>

        <div class="rh-nickname-input-group">
          <label for="rhNicknameModalInput" class="rh-nickname-label">Escribe el apodo que prefieras:</label>
          <div class="rh-nickname-input-wrap">
            <input type="text" id="rhNicknameModalInput" class="rh-nickname-input" placeholder="Ej: Mejor Amigo, ProGamer, Juan..." value="${escapeHtml(currentNick)}" maxlength="32" autofocus autocomplete="off" />
            ${currentNick ? `<button type="button" class="rh-nickname-input-clear" onclick="document.getElementById('rhNicknameModalInput').value='';document.getElementById('rhNicknameModalInput').focus();" title="Borrar texto">${ICONS.close}</button>` : ''}
          </div>
          <div class="rh-nickname-hint">Pulsa Enter para guardar o Escape para cancelar</div>
        </div>

        <div class="rh-nickname-actions">
          <div style="margin-right: auto;">
            ${currentNick ? `<button type="button" class="rh-chat-btn-secondary danger" id="rhBtnRemoveNick" onclick="window.RetroHubChat.submitNicknameModal(${targetUserId}, '')">${ICONS.trash} Quitar apodo</button>` : ''}
          </div>
          <button type="button" class="rh-chat-btn-secondary" onclick="window.RetroHubChat.closeNicknameModal()">Cancelar</button>
          <button type="button" class="rh-chat-btn-primary" id="rhBtnSaveNick" onclick="const val = document.getElementById('rhNicknameModalInput'); window.RetroHubChat.submitNicknameModal(${targetUserId}, val ? val.value : '');">
            ${ICONS.check}
            <span>Guardar apodo</span>
          </button>
        </div>
      </div>
    `;

    modalEl.style.display = 'flex';

    setTimeout(() => {
      const input = document.getElementById('rhNicknameModalInput');
      if (input) {
        input.focus();
        input.select();
      }
    }, 40);

    modalEl.onkeydown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeNicknameModal();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const input = document.getElementById('rhNicknameModalInput');
        if (input) {
          submitNicknameModal(targetUserId, input.value);
        }
      }
    };

    modalEl.onclick = (e) => {
      if (e.target === modalEl) {
        closeNicknameModal();
      }
    };
  }

  function closeNicknameModal() {
    const modalEl = document.getElementById('rhNicknameModalBackdrop');
    if (modalEl) {
      modalEl.style.display = 'none';
      modalEl.innerHTML = '';
    }
  }

  async function submitNicknameModal(targetUserId, newNickname) {
    const clean = String(newNickname || '').trim();
    const btnSave = document.getElementById('rhBtnSaveNick');
    const btnRemove = document.getElementById('rhBtnRemoveNick');
    if (btnSave) {
      btnSave.disabled = true;
      btnSave.innerHTML = `<span>Guardando...</span>`;
    }
    if (btnRemove) btnRemove.disabled = true;

    await setCustomNickname(targetUserId, clean);
    closeNicknameModal();
  }

  /* ========================================================================
     GESTIÓN DE TEMAS, FONDOS, PATRONES Y FORMATOS DE BURBUJA
     ======================================================================== */
  const CHAT_THEME_PRESETS = [
    { id: 'porcelain', name: 'RetroHub Porcelana', bgTheme: 'porcelain', bgPattern: 'dots', bubbleStyle: 'modern', bubbleColor: 'sky', color: '#00a2ed' },
    { id: 'gameboy', name: 'Game Boy 1989', bgTheme: 'gameboy', bgPattern: 'grid', bubbleStyle: 'pixel', bubbleColor: 'olive', color: '#8bac0f' },
    { id: 'cyberpunk', name: 'Cyberpunk Neón', bgTheme: 'cyberpunk', bgPattern: 'circuits', bubbleStyle: 'neon', bubbleColor: 'teal', color: '#00d2be' },
    { id: 'famicon', name: 'NES / Famicom', bgTheme: 'famicon', bgPattern: 'grid', bubbleStyle: 'pixel', bubbleColor: 'scarlet', color: '#e60012' },
    { id: 'playstation', name: 'PlayStation Deep', bgTheme: 'playstation', bgPattern: 'scanlines', bubbleStyle: 'sleek', bubbleColor: 'sky', color: '#0284c7' },
    { id: 'sakura', name: 'Sakura Dream', bgTheme: 'sakura', bgPattern: 'dots', bubbleStyle: 'sleek', bubbleColor: 'rose', color: '#f43f5e' },
    { id: 'arcade', name: 'Arcade CRT', bgTheme: 'arcade', bgPattern: 'scanlines', bubbleStyle: 'pixel', bubbleColor: 'amber', color: '#f59e0b' },
    { id: 'midnight', name: 'Medianoche OLED', bgTheme: 'midnight', bgPattern: 'none', bubbleStyle: 'minimal', bubbleColor: 'teal', color: '#09090b' }
  ];

  const BUBBLE_STYLES = [
    { id: 'modern', title: 'Suave Porcelana', desc: 'Bordes suaves y sombra natural' },
    { id: 'pixel', title: 'Retro 8-Bit Pixel', desc: 'Esquinas cuadradas y sombra sólida' },
    { id: 'sleek', title: 'Cápsula Flotante', desc: 'Curvatura estilizada profunda' },
    { id: 'neon', title: 'Neón Cyberpunk', desc: 'Borde luminescente con halo' },
    { id: 'comic', title: 'Manga Ink Cómic', desc: 'Tinta gruesa y sombra sólida' },
    { id: 'minimal', title: 'Plano Minimal', desc: 'Limpio y ultracompacto' }
  ];

  const BUBBLE_COLORS = [
    { id: 'sky', title: 'Azul Cielo', bg: 'linear-gradient(135deg, #00a2ed 0%, #0284c7 100%)' },
    { id: 'teal', title: 'Turquesa', bg: 'linear-gradient(135deg, #00d2be 0%, #0d9488 100%)' },
    { id: 'scarlet', title: 'Rojo Mario', bg: 'linear-gradient(135deg, #ff3b30 0%, #e60012 100%)' },
    { id: 'emerald', title: 'Esmeralda', bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
    { id: 'amber', title: 'Ámbar Dorado', bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
    { id: 'violet', title: 'Púrpura Real', bg: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)' },
    { id: 'rose', title: 'Rosa Sakura', bg: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)' },
    { id: 'olive', title: 'Game Boy', bg: 'linear-gradient(135deg, #306230 0%, #0f380f 100%)' }
  ];

  const BG_THEMES = [
    { id: 'porcelain', title: 'Porcelana', swatch: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)' },
    { id: 'gameboy', title: 'Game Boy 1989', swatch: 'linear-gradient(135deg, #8bac0f 0%, #9bbc0f 100%)' },
    { id: 'cyberpunk', title: 'Cyberpunk Neón', swatch: 'linear-gradient(135deg, #0b0d19 0%, #151a2e 100%)' },
    { id: 'famicon', title: 'Famicom 8-Bit', swatch: 'linear-gradient(135deg, #16161f 0%, #222230 100%)' },
    { id: 'playstation', title: 'PlayStation Deep', swatch: 'linear-gradient(135deg, #070d1e 0%, #0f1c3f 100%)' },
    { id: 'sakura', title: 'Sakura Pastel', swatch: 'linear-gradient(135deg, #fff1f5 0%, #fecdd3 100%)' },
    { id: 'arcade', title: 'Arcade Ámbar', swatch: 'linear-gradient(135deg, #130f08 0%, #221b0e 100%)' },
    { id: 'midnight', title: 'OLED Puro', swatch: 'linear-gradient(135deg, #000000 0%, #18181b 100%)' }
  ];

  const BG_PATTERNS = [
    { id: 'none', title: 'Liso' },
    { id: 'dots', title: 'Puntos' },
    { id: 'grid', title: 'Cuadrícula' },
    { id: 'scanlines', title: 'Scanlines CRT' },
    { id: 'circuits', title: 'Circuitos' }
  ];

  function loadLocalThemes() {
    try {
      const myU = getCurrentUsername().toLowerCase();
      const raw = localStorage.getItem(`rh_chat_themes_${myU}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          CHAT_STATE.themes = Object.assign({}, parsed);
        }
      }
    } catch (e) {}
  }

  function saveLocalThemes() {
    try {
      const myU = getCurrentUsername().toLowerCase();
      localStorage.setItem(`rh_chat_themes_${myU}`, JSON.stringify(CHAT_STATE.themes));
    } catch (e) {}
  }

  function getCurrentConversationKey() {
    if (CHAT_STATE.activeDM) return `dm_${CHAT_STATE.activeDM.id}`;
    if (CHAT_STATE.activeGroup) return `group_${CHAT_STATE.activeGroup.id}`;
    return 'global';
  }

  function getEffectiveTheme(convKey) {
    const key = convKey || getCurrentConversationKey();
    if (key && CHAT_STATE.themes[key]) {
      return Object.assign({
        bgTheme: 'porcelain',
        bgPattern: 'dots',
        bubbleStyle: 'modern',
        bubbleColor: 'sky'
      }, CHAT_STATE.themes[key]);
    }
    if (CHAT_STATE.themes['global']) {
      return Object.assign({
        bgTheme: 'porcelain',
        bgPattern: 'dots',
        bubbleStyle: 'modern',
        bubbleColor: 'sky'
      }, CHAT_STATE.themes['global']);
    }
    return {
      bgTheme: 'porcelain',
      bgPattern: 'dots',
      bubbleStyle: 'modern',
      bubbleColor: 'sky'
    };
  }

  function getThemeClassNames(theme) {
    const t = theme || getEffectiveTheme();
    return `rh-theme-${t.bgTheme || 'porcelain'} rh-pattern-${t.bgPattern || 'none'} rh-bubble-${t.bubbleStyle || 'modern'} rh-color-${t.bubbleColor || 'sky'}`;
  }

  function openThemeModal() {
    const currentKey = getCurrentConversationKey();
    const isSpecific = currentKey !== 'global';
    const activeTheme = getEffectiveTheme(currentKey);

    CHAT_STATE.themeModalDraft = {
      targetKey: isSpecific ? currentKey : 'global',
      scope: isSpecific ? 'current' : 'global',
      bgTheme: activeTheme.bgTheme || 'porcelain',
      bgPattern: activeTheme.bgPattern || 'dots',
      bubbleStyle: activeTheme.bubbleStyle || 'modern',
      bubbleColor: activeTheme.bubbleColor || 'sky',
      presetId: null
    };

    let modalEl = document.getElementById('rhThemeModalBackdrop');
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.id = 'rhThemeModalBackdrop';
      modalEl.className = 'rh-theme-modal-backdrop';
      document.body.appendChild(modalEl);
    }

    const d = CHAT_STATE.themeModalDraft;
    const convName = CHAT_STATE.activeDM 
      ? getEffectiveName(CHAT_STATE.activeDM) 
      : (CHAT_STATE.activeGroup ? CHAT_STATE.activeGroup.name : 'Esta conversación');

    modalEl.innerHTML = `
      <div class="rh-theme-modal-card" role="dialog" aria-modal="true" aria-labelledby="rhThemeModalTitle">
        <div class="rh-theme-modal-head">
          <div class="rh-theme-modal-title" id="rhThemeModalTitle">
            <span class="rh-theme-icon-wrap">${ICONS.palette}</span>
            <span>Personalizar Tema y Burbujas</span>
          </div>
          <button type="button" class="rh-chat-close-btn" onclick="window.RetroHubChat.closeThemeModal()" aria-label="Cerrar">
            ${ICONS.close}
          </button>
        </div>

        <div class="rh-theme-modal-body">
          <!-- Vista Previa Interactiva en Vivo -->
          <div>
            <div class="rh-theme-preview-box ${getThemeClassNames(d)}" id="rhThemeLivePreview">
              <div class="rh-theme-preview-label">Vista Previa en Vivo</div>
              <div class="rh-msg-row">
                <div class="rh-msg-bubble-wrap">
                  <div class="rh-msg-bubble">¡Hola! ¿Echamos una partida retro hoy?</div>
                  <span class="rh-msg-time">16:40</span>
                </div>
              </div>
              <div class="rh-msg-row mine">
                <div class="rh-msg-bubble-wrap">
                  <div class="rh-msg-bubble">¡Por supuesto! Me encanta este nuevo estilo.</div>
                  <span class="rh-msg-time">16:41</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Presets Rápidos (1 clic) -->
          <div>
            <div class="rh-theme-section-title">
              ${ICONS.sparkles}
              <span>Presets Temáticos (1 Clic)</span>
            </div>
            <div class="rh-theme-presets-grid">
              ${CHAT_THEME_PRESETS.map((p) => `
                <button type="button" class="rh-theme-preset-card ${d.presetId === p.id ? 'active' : ''}" data-preset-id="${p.id}" onclick="window.RetroHubChat.applyPreset('${p.id}')">
                  <span class="rh-theme-preset-orb" style="background: ${p.color}; color: #ffffff;">${ICONS.gamepad}</span>
                  <span>${escapeHtml(p.name)}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Formato de Burbuja -->
          <div>
            <div class="rh-theme-section-title">
              ${ICONS.chat}
              <span>Formato y Estilo de Burbujas</span>
            </div>
            <div class="rh-bubble-style-grid">
              ${BUBBLE_STYLES.map((b) => `
                <button type="button" class="rh-bubble-style-card ${d.bubbleStyle === b.id ? 'active' : ''}" data-bubble-style="${b.id}" onclick="window.RetroHubChat.setThemeOption('bubbleStyle', '${b.id}')">
                  <div class="rh-bubble-style-sample rh-bubble-${b.id}">Texto demo</div>
                  <div class="rh-bubble-style-title">${escapeHtml(b.title)}</div>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Color de Acento (Burbujas Propias) -->
          <div>
            <div class="rh-theme-section-title">
              ${ICONS.palette}
              <span>Color de Burbujas Enviadas (Tus Mensajes)</span>
            </div>
            <div class="rh-color-chips-row">
              ${BUBBLE_COLORS.map((c) => `
                <button type="button" class="rh-color-chip ${d.bubbleColor === c.id ? 'active' : ''}" data-bubble-color="${c.id}" style="background: ${c.bg};" onclick="window.RetroHubChat.setThemeOption('bubbleColor', '${c.id}')" title="${escapeHtml(c.title)}">
                  ${d.bubbleColor === c.id ? ICONS.check : ''}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Fondo y Wallpaper -->
          <div>
            <div class="rh-theme-section-title">
              ${ICONS.gamepad}
              <span>Ambiente y Fondo del Chat</span>
            </div>
            <div class="rh-bg-theme-grid">
              ${BG_THEMES.map((bg) => `
                <button type="button" class="rh-bg-theme-card ${d.bgTheme === bg.id ? 'active' : ''}" data-bg-theme="${bg.id}" onclick="window.RetroHubChat.setThemeOption('bgTheme', '${bg.id}')">
                  <div class="rh-bg-theme-swatch" style="background: ${bg.swatch};"></div>
                  <span class="rh-bg-theme-title">${escapeHtml(bg.title)}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Textura / Patrón -->
          <div>
            <div class="rh-theme-section-title">
              ${ICONS.layers}
              <span>Textura y Patrón del Fondo</span>
            </div>
            <div class="rh-pattern-chips-row">
              ${BG_PATTERNS.map((pt) => `
                <button type="button" class="rh-pattern-chip ${d.bgPattern === pt.id ? 'active' : ''}" data-bg-pattern="${pt.id}" onclick="window.RetroHubChat.setThemeOption('bgPattern', '${pt.id}')">
                  ${escapeHtml(pt.title)}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Ámbito de Aplicación -->
          ${isSpecific ? `
            <div>
              <div class="rh-theme-section-title">
                ${ICONS.users}
                <span>Aplicar Configuración a</span>
              </div>
              <div class="rh-scope-toggle">
                <button type="button" class="rh-scope-btn ${d.scope === 'current' ? 'active' : ''}" data-scope="current" onclick="window.RetroHubChat.setThemeScope('current')">
                  ${ICONS.chat}
                  <span>Solo para ${escapeHtml(convName)}</span>
                </button>
                <button type="button" class="rh-scope-btn ${d.scope === 'global' ? 'active' : ''}" data-scope="global" onclick="window.RetroHubChat.setThemeScope('global')">
                  ${ICONS.globe}
                  <span>Todos los chats (Global)</span>
                </button>
              </div>
            </div>
          ` : `
            <div style="font-size: 11.5px; color: #64748b; font-weight: 600; padding: 4px 2px; display: flex; align-items: center; gap: 6px;">
              <span style="color: #0284c7;">${ICONS.globe}</span>
              <span>Este tema se guardará como tema <strong>Global</strong> predeterminado para todas tus conversaciones.</span>
            </div>
          `}
        </div>

        <div class="rh-theme-modal-footer">
          <div style="margin-right: auto;">
            <button type="button" class="rh-chat-btn-secondary danger" onclick="window.RetroHubChat.resetThemeModal()">
              ${ICONS.trash}
              <span>Restablecer predeterminado</span>
            </button>
          </div>
          <button type="button" class="rh-chat-btn-secondary" onclick="window.RetroHubChat.closeThemeModal()">Cancelar</button>
          <button type="button" class="rh-chat-btn-primary" onclick="window.RetroHubChat.saveThemeModal()">
            ${ICONS.check}
            <span>Guardar Tema</span>
          </button>
        </div>
      </div>
    `;

    modalEl.style.display = 'flex';

    modalEl.onclick = (e) => {
      if (e.target === modalEl) closeThemeModal();
    };

    modalEl.onkeydown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeThemeModal();
      }
    };
  }

  function closeThemeModal() {
    const modalEl = document.getElementById('rhThemeModalBackdrop');
    if (modalEl) {
      modalEl.style.display = 'none';
      modalEl.innerHTML = '';
    }
    CHAT_STATE.themeModalDraft = null;
  }

  function updateThemeModalUI() {
    const d = CHAT_STATE.themeModalDraft;
    if (!d) return;

    const previewBox = document.getElementById('rhThemeLivePreview');
    if (previewBox) {
      previewBox.className = `rh-theme-preview-box ${getThemeClassNames(d)}`;
    }

    document.querySelectorAll('.rh-theme-preset-card').forEach((el) => {
      el.classList.toggle('active', el.dataset.presetId === d.presetId);
    });

    document.querySelectorAll('.rh-bubble-style-card').forEach((el) => {
      el.classList.toggle('active', el.dataset.bubbleStyle === d.bubbleStyle);
    });

    document.querySelectorAll('.rh-color-chip').forEach((el) => {
      const isAct = el.dataset.bubbleColor === d.bubbleColor;
      el.classList.toggle('active', isAct);
      el.innerHTML = isAct ? ICONS.check : '';
    });

    document.querySelectorAll('.rh-bg-theme-card').forEach((el) => {
      el.classList.toggle('active', el.dataset.bgTheme === d.bgTheme);
    });

    document.querySelectorAll('.rh-pattern-chip').forEach((el) => {
      el.classList.toggle('active', el.dataset.bgPattern === d.bgPattern);
    });

    document.querySelectorAll('.rh-scope-btn').forEach((el) => {
      el.classList.toggle('active', el.dataset.scope === d.scope);
    });
  }

  function applyThemePreset(presetId) {
    const p = CHAT_THEME_PRESETS.find((x) => x.id === presetId);
    if (!p || !CHAT_STATE.themeModalDraft) return;
    CHAT_STATE.themeModalDraft.presetId = presetId;
    CHAT_STATE.themeModalDraft.bgTheme = p.bgTheme;
    CHAT_STATE.themeModalDraft.bgPattern = p.bgPattern;
    CHAT_STATE.themeModalDraft.bubbleStyle = p.bubbleStyle;
    CHAT_STATE.themeModalDraft.bubbleColor = p.bubbleColor;
    updateThemeModalUI();
  }

  function setThemeOption(key, val) {
    if (!CHAT_STATE.themeModalDraft) return;
    CHAT_STATE.themeModalDraft[key] = val;
    CHAT_STATE.themeModalDraft.presetId = null;
    updateThemeModalUI();
  }

  function setThemeScope(scope) {
    if (!CHAT_STATE.themeModalDraft) return;
    CHAT_STATE.themeModalDraft.scope = scope;
    updateThemeModalUI();
  }

  async function saveThemeModal() {
    const d = CHAT_STATE.themeModalDraft;
    if (!d) return;

    const currentKey = getCurrentConversationKey();
    const targetKey = d.scope === 'global' ? 'global' : currentKey;
    const themeObj = {
      bgTheme: d.bgTheme,
      bgPattern: d.bgPattern,
      bubbleStyle: d.bubbleStyle,
      bubbleColor: d.bubbleColor
    };

    CHAT_STATE.themes[targetKey] = themeObj;
    saveLocalThemes();
    closeThemeModal();
    renderChatSidebarBody();

    try {
      await fetch('/api/chat/themes', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          targetKey: targetKey,
          theme: themeObj
        })
      });
    } catch (e) {
      console.warn('[RetroHub Chat] Error guardando tema:', e);
    }
  }

  async function resetThemeModal() {
    const d = CHAT_STATE.themeModalDraft;
    const currentKey = getCurrentConversationKey();
    const targetKey = d && d.scope === 'global' ? 'global' : currentKey;

    delete CHAT_STATE.themes[targetKey];
    saveLocalThemes();
    closeThemeModal();
    renderChatSidebarBody();

    try {
      await fetch('/api/chat/themes', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          targetKey: targetKey,
          theme: null
        })
      });
    } catch (e) {
      console.warn('[RetroHub Chat] Error restableciendo tema:', e);
    }
  }

  /* ========================================================================
     GESTIÓN DEL ESTADO "ESCRIBIENDO..." (TYPING INDICATOR)
     ======================================================================== */
  function handleComposerInput() {
    const input = document.getElementById('rhChatComposerInput');
    if (!input) return;
    const text = input.value;
    const now = Date.now();

    if (text.length > 0) {
      if (now - (CHAT_STATE.lastTypingSentAt || 0) > 1800) {
        sendTypingSignal(true);
        CHAT_STATE.lastTypingSentAt = now;
      }
      if (CHAT_STATE.typingTimeout) clearTimeout(CHAT_STATE.typingTimeout);
      CHAT_STATE.typingTimeout = setTimeout(() => {
        sendTypingSignal(false);
      }, 3500);
    } else {
      if (CHAT_STATE.typingTimeout) clearTimeout(CHAT_STATE.typingTimeout);
      sendTypingSignal(false);
    }
  }

  function sendTypingSignal(isTyping) {
    let convType = null;
    let targetId = null;
    if (CHAT_STATE.activeDM) {
      convType = 'dm';
      targetId = CHAT_STATE.activeDM.id;
    } else if (CHAT_STATE.activeGroup) {
      convType = 'group';
      targetId = CHAT_STATE.activeGroup.id;
    }
    if (!convType || !targetId) return;

    fetch('/api/chat/typing', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        conversationType: convType,
        targetId: targetId,
        isTyping: Boolean(isTyping)
      })
    }).catch(() => {});
  }

  async function pollTypingStatus() {
    if (!CHAT_STATE.isOpen) return;
    let convType = null;
    let targetId = null;
    if (CHAT_STATE.activeDM) {
      convType = 'dm';
      targetId = CHAT_STATE.activeDM.id;
    } else if (CHAT_STATE.activeGroup) {
      convType = 'group';
      targetId = CHAT_STATE.activeGroup.id;
    }
    if (!convType || !targetId) return;

    try {
      const res = await fetch(`/api/chat/typing?conversationType=${convType}&targetId=${encodeURIComponent(targetId)}`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data && data.success) {
        const newTyping = data.typingUsers || [];
        const changed = JSON.stringify(newTyping) !== JSON.stringify(CHAT_STATE.typingUsers);
        CHAT_STATE.typingUsers = newTyping;
        if (changed) {
          updateTypingUI();
        }
      }
    } catch (e) {}
  }

  function updateTypingUI() {
    const typingBar = document.getElementById('rhChatTypingBar');
    const typingText = document.getElementById('rhChatTypingText');
    const messagesBox = document.getElementById('rhChatMessagesBox');

    // 1. Barra estilo Discord sobre el compositor
    if (typingBar && typingText) {
      if (CHAT_STATE.typingUsers.length > 0) {
        const names = CHAT_STATE.typingUsers.map((u) => getEffectiveName(u, u.username, u.displayName)).join(', ');
        typingText.innerHTML = `<strong>${escapeHtml(names)}</strong> está escribiendo...`;
        typingBar.classList.add('visible');
      } else {
        typingBar.classList.remove('visible');
        typingText.textContent = '';
      }
    }

    // 2. Burbuja de escritura estilo WhatsApp en el flujo de mensajes
    if (messagesBox) {
      const existingBubble = document.getElementById('rhChatTypingBubbleRow');
      if (CHAT_STATE.typingUsers.length > 0) {
        const firstU = CHAT_STATE.typingUsers[0];
        const avatarUrl = firstU.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(firstU.username)}`;
        if (!existingBubble) {
          const row = document.createElement('div');
          row.id = 'rhChatTypingBubbleRow';
          row.className = 'rh-msg-row-typing';
          row.innerHTML = `
            <img src="${escapeHtml(avatarUrl)}" class="rh-msg-avatar" alt="" onerror="this.src='https://api.dicebear.com/7.x/bottts/svg?seed=user'" />
            <div class="rh-typing-bubble" title="${escapeHtml(getEffectiveName(firstU, firstU.username, firstU.displayName))} está escribiendo...">
              <span class="rh-typing-dot"></span>
              <span class="rh-typing-dot"></span>
              <span class="rh-typing-dot"></span>
            </div>
          `;
          messagesBox.appendChild(row);
          messagesBox.scrollTop = messagesBox.scrollHeight;
        }
      } else if (existingBubble) {
        existingBubble.remove();
      }
    }
  }

  async function fetchChatOverview() {
    try {
      loadLocalNicknames();
      loadLocalThemes();
      const uname = encodeURIComponent(getCurrentUsername());
      const res = await fetch(`/api/chat/overview?username=${uname}`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data && data.success) {
        if (data.nicknames && typeof data.nicknames === 'object') {
          CHAT_STATE.nicknames = Object.assign({}, data.nicknames);
          saveLocalNicknames();
        }
        if (data.themes && typeof data.themes === 'object') {
          CHAT_STATE.themes = Object.assign({}, data.themes);
          saveLocalThemes();
        }
        CHAT_STATE.friends = data.friends || [];
        CHAT_STATE.allUsers = data.allUsers || [];
        CHAT_STATE.groups = data.groups || [];
        updateUnreadBadge();
        if (CHAT_STATE.activeGroup) {
          const updatedG = CHAT_STATE.groups.find((g) => g.id === CHAT_STATE.activeGroup.id);
          if (updatedG) CHAT_STATE.activeGroup = updatedG;
        }
        if (CHAT_STATE.isOpen && !CHAT_STATE.activeDM && !CHAT_STATE.activeGroup) {
          renderChatSidebarBody();
        }
        if (typeof window.onRetroHubChatSync === 'function') {
          window.onRetroHubChatSync(CHAT_STATE);
        }
      }
    } catch (e) {}
  }

  function updateUnreadBadge() {
    const totalUnread = CHAT_STATE.friends.reduce((acc, f) => acc + (f.unreadCount || 0), 0);
    const badge = document.getElementById('rhToolbarChatUnread');
    if (badge) {
      if (totalUnread > 0) {
        badge.textContent = totalUnread;
        badge.style.display = 'inline-flex';
      } else {
        badge.style.display = 'none';
      }
    }
    const tabFriendsCount = document.getElementById('rhChatTabFriendsCount');
    if (tabFriendsCount) tabFriendsCount.textContent = CHAT_STATE.friends.length;
    const tabGroupsCount = document.getElementById('rhChatTabGroupsCount');
    if (tabGroupsCount) tabGroupsCount.textContent = CHAT_STATE.groups.length;
  }

  function ensureChatSidebarMounted() {
    if (document.getElementById('rhChatSidebar')) return;

    const backdrop = document.createElement('div');
    backdrop.id = 'rhChatBackdrop';
    backdrop.className = 'rh-chat-backdrop';
    backdrop.addEventListener('click', closeChatSidebar);

    const edgeBtn = document.createElement('button');
    edgeBtn.id = 'rhChatEdgeLauncher';
    edgeBtn.className = 'rh-chat-edge-launcher';
    edgeBtn.type = 'button';
    edgeBtn.title = 'Abrir menú lateral de Chat y Grupos';
    edgeBtn.innerHTML = `
      <div class="rh-chat-edge-icon">${ICONS.chat}</div>
      <span class="rh-chat-edge-label">Chat & Grupos</span>
    `;
    edgeBtn.addEventListener('click', openChatSidebar);

    const sidebar = document.createElement('aside');
    sidebar.id = 'rhChatSidebar';
    sidebar.className = 'rh-chat-sidebar';
    sidebar.setAttribute('aria-label', 'Menú lateral de Chat y Grupos');
    sidebar.innerHTML = `
      <div class="rh-chat-header">
        <div class="rh-chat-header-top">
          <div class="rh-chat-brand">
            <div class="rh-chat-brand-badge">${ICONS.chat}</div>
            <div>
              <div class="rh-chat-title">Chat & Salas RetroHub</div>
              <div class="rh-chat-subtitle">Mensajes directos y grupos abiertos</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <button class="rh-btn-chat-theme" id="rhChatGlobalThemeBtn" type="button" onclick="window.RetroHubChat.openThemeModal()" title="Personalizar temas y burbujas de chat">
              ${ICONS.palette}
              <span>Temas</span>
            </button>
            <button class="rh-chat-close-btn" id="rhChatCloseBtn" type="button" title="Cerrar chat lateral">
              ${ICONS.close}
            </button>
          </div>
        </div>

        <div class="rh-chat-tabs">
          <button class="rh-chat-tab active" id="rhChatTabFriends" type="button">
            ${ICONS.user}
            <span>Amigos</span>
            <span class="rh-chat-tab-count" id="rhChatTabFriendsCount">0</span>
          </button>
          <button class="rh-chat-tab" id="rhChatTabGroups" type="button">
            ${ICONS.users}
            <span>Grupos</span>
            <span class="rh-chat-tab-count" id="rhChatTabGroupsCount">0</span>
          </button>
        </div>
      </div>

      <div class="rh-chat-body" id="rhChatBody"></div>
    `;

    document.body.appendChild(backdrop);
    document.body.appendChild(edgeBtn);
    document.body.appendChild(sidebar);

    document.getElementById('rhChatCloseBtn').addEventListener('click', closeChatSidebar);
    document.getElementById('rhChatTabFriends').addEventListener('click', () => switchChatTab('friends'));
    document.getElementById('rhChatTabGroups').addEventListener('click', () => switchChatTab('groups'));
  }

  function openChatSidebar() {
    ensureChatSidebarMounted();
    CHAT_STATE.isOpen = true;
    document.getElementById('rhChatSidebar').classList.add('open');
    document.getElementById('rhChatBackdrop').classList.add('open');
    fetchChatOverview().then(() => {
      if (CHAT_STATE.activeDM) {
        loadDirectMessages(CHAT_STATE.activeDM.id);
      } else if (CHAT_STATE.activeGroup) {
        loadGroupMessages(CHAT_STATE.activeGroup.id);
      } else {
        renderChatSidebarBody();
      }
    });
  }

  function closeChatSidebar() {
    CHAT_STATE.isOpen = false;
    if (CHAT_STATE.typingTimeout) clearTimeout(CHAT_STATE.typingTimeout);
    sendTypingSignal(false);
    const sb = document.getElementById('rhChatSidebar');
    const bd = document.getElementById('rhChatBackdrop');
    if (sb) sb.classList.remove('open');
    if (bd) bd.classList.remove('open');
  }

  function toggleChatSidebar() {
    if (CHAT_STATE.isOpen) closeChatSidebar();
    else openChatSidebar();
  }

  function switchChatTab(tab) {
    CHAT_STATE.activeTab = tab;
    CHAT_STATE.activeDM = null;
    CHAT_STATE.activeGroup = null;
    CHAT_STATE.showCreateGroup = false;
    CHAT_STATE.showJoinGroup = false;
    CHAT_STATE.showInviteToGroup = false;
    CHAT_STATE.statusBanner = null;

    const btnF = document.getElementById('rhChatTabFriends');
    const btnG = document.getElementById('rhChatTabGroups');
    if (btnF) btnF.classList.toggle('active', tab === 'friends');
    if (btnG) btnG.classList.toggle('active', tab === 'groups');

    renderChatSidebarBody();
  }

  async function addFriendByIdentifier(identifier) {
    const clean = String(identifier || '').trim();
    if (!clean) return;
    try {
      const res = await fetch('/api/friends/add', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ username: clean })
      });
      const data = await res.json();
      CHAT_STATE.statusBanner = {
        type: data.success ? 'success' : 'error',
        text: data.message || (data.success ? 'Amigo añadido.' : 'No encontrado.')
      };
      await fetchChatOverview();
      renderChatSidebarBody();
    } catch (e) {
      CHAT_STATE.statusBanner = { type: 'error', text: 'Error al conectar con el servidor.' };
      renderChatSidebarBody();
    }
  }

  async function openDMConversation(friendId) {
    ensureChatSidebarMounted();
    if (!CHAT_STATE.isOpen) openChatSidebar();
    let friend = CHAT_STATE.friends.find((f) => Number(f.id) === Number(friendId));
    if (!friend) {
      await fetchChatOverview();
      friend = CHAT_STATE.friends.find((f) => Number(f.id) === Number(friendId));
    }
    if (!friend) return;
    CHAT_STATE.activeTab = 'friends';
    CHAT_STATE.activeDM = friend;
    CHAT_STATE.activeGroup = null;
    const btnF = document.getElementById('rhChatTabFriends');
    const btnG = document.getElementById('rhChatTabGroups');
    if (btnF) btnF.classList.add('active');
    if (btnG) btnG.classList.remove('active');
    await loadDirectMessages(friend.id);
  }

  async function loadDirectMessages(friendId) {
    try {
      const uname = encodeURIComponent(getCurrentUsername());
      const res = await fetch(`/api/chat/dm?friendId=${encodeURIComponent(friendId)}&username=${uname}`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data && data.success) {
        if (data.nicknames && typeof data.nicknames === 'object') {
          CHAT_STATE.nicknames = Object.assign({}, data.nicknames);
          saveLocalNicknames();
        }
        if (data.typingUsers) {
          CHAT_STATE.typingUsers = data.typingUsers;
        }
        const prevCount = CHAT_STATE.messages ? CHAT_STATE.messages.length : 0;
        CHAT_STATE.messages = data.messages || [];

        const composer = document.getElementById('rhChatComposerInput');
        const hadFocus = composer && document.activeElement === composer;
        const curVal = composer ? composer.value : '';

        renderChatSidebarBody();
        updateTypingUI();

        if (hadFocus) {
          const newComp = document.getElementById('rhChatComposerInput');
          if (newComp) {
            newComp.value = curVal;
            newComp.focus();
          }
        }

        if (CHAT_STATE.messages.length !== prevCount) {
          scrollToBottomMessages();
        }
      }
    } catch (e) {}
  }

  async function sendDirectMessage() {
    const input = document.getElementById('rhChatComposerInput');
    if (!input || !CHAT_STATE.activeDM) return;
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    if (CHAT_STATE.typingTimeout) clearTimeout(CHAT_STATE.typingTimeout);
    sendTypingSignal(false);
    try {
      const res = await fetch('/api/chat/dm', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          receiverId: CHAT_STATE.activeDM.id,
          content: text
        })
      });
      const data = await res.json();
      if (data && data.success && data.message) {
        CHAT_STATE.messages.push(data.message);
        renderChatSidebarBody();
        scrollToBottomMessages();
        fetchChatOverview();
      }
    } catch (e) {}
  }

  async function createNewGroup() {
    const nameInput = document.getElementById('rhNewGroupName');
    const descInput = document.getElementById('rhNewGroupDesc');
    const name = nameInput ? nameInput.value.trim() : '';
    const description = descInput ? descInput.value.trim() : '';
    if (!name) {
      CHAT_STATE.statusBanner = { type: 'error', text: 'Escribe un nombre para el grupo.' };
      renderChatSidebarBody();
      return;
    }
    const checkedBoxes = document.querySelectorAll('.rh-new-group-member-cb:checked');
    const memberIds = Array.from(checkedBoxes).map((cb) => Number(cb.value));

    try {
      const res = await fetch('/api/chat/groups', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name,
          description,
          iconColor: CHAT_STATE.newGroupColor,
          memberIds
        })
      });
      const data = await res.json();
      if (data && data.success && data.group) {
        CHAT_STATE.showCreateGroup = false;
        CHAT_STATE.statusBanner = {
          type: 'success',
          text: `Grupo "${data.group.name}" creado (${data.group.inviteCode}).`
        };
        await fetchChatOverview();
        openGroupConversation(data.group.id);
      }
    } catch (e) {}
  }

  async function joinGroupByCode() {
    const codeInput = document.getElementById('rhJoinGroupCodeInput');
    const code = codeInput ? codeInput.value.trim() : '';
    if (!code) return;
    try {
      const res = await fetch('/api/chat/groups/join', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ inviteCode: code })
      });
      const data = await res.json();
      if (data && data.success) {
        CHAT_STATE.showJoinGroup = false;
        await fetchChatOverview();
        openGroupConversation(data.groupId);
      } else {
        CHAT_STATE.statusBanner = { type: 'error', text: data.error || 'Código no válido.' };
        renderChatSidebarBody();
      }
    } catch (e) {}
  }

  async function openGroupConversation(groupId) {
    ensureChatSidebarMounted();
    if (!CHAT_STATE.isOpen) openChatSidebar();
    let group = CHAT_STATE.groups.find((g) => Number(g.id) === Number(groupId));
    if (!group) {
      await fetchChatOverview();
      group = CHAT_STATE.groups.find((g) => Number(g.id) === Number(groupId));
    }
    if (!group) return;
    CHAT_STATE.activeTab = 'groups';
    CHAT_STATE.activeGroup = group;
    CHAT_STATE.activeDM = null;
    CHAT_STATE.showInviteToGroup = false;
    const btnF = document.getElementById('rhChatTabFriends');
    const btnG = document.getElementById('rhChatTabGroups');
    if (btnF) btnF.classList.remove('active');
    if (btnG) btnG.classList.add('active');
    await loadGroupMessages(group.id);
  }

  async function loadGroupMessages(groupId) {
    try {
      const uname = encodeURIComponent(getCurrentUsername());
      const res = await fetch(`/api/chat/groups/messages?groupId=${encodeURIComponent(groupId)}&username=${uname}`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data && data.success) {
        if (data.nicknames && typeof data.nicknames === 'object') {
          CHAT_STATE.nicknames = Object.assign({}, data.nicknames);
          saveLocalNicknames();
        }
        if (data.typingUsers) {
          CHAT_STATE.typingUsers = data.typingUsers;
        }
        const prevCount = CHAT_STATE.messages ? CHAT_STATE.messages.length : 0;
        CHAT_STATE.messages = data.messages || [];

        const composer = document.getElementById('rhChatComposerInput');
        const hadFocus = composer && document.activeElement === composer;
        const curVal = composer ? composer.value : '';

        renderChatSidebarBody();
        updateTypingUI();

        if (hadFocus) {
          const newComp = document.getElementById('rhChatComposerInput');
          if (newComp) {
            newComp.value = curVal;
            newComp.focus();
          }
        }

        if (CHAT_STATE.messages.length !== prevCount) {
          scrollToBottomMessages();
        }
      }
    } catch (e) {}
  }

  async function sendGroupMessage() {
    const input = document.getElementById('rhChatComposerInput');
    if (!input || !CHAT_STATE.activeGroup) return;
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    if (CHAT_STATE.typingTimeout) clearTimeout(CHAT_STATE.typingTimeout);
    sendTypingSignal(false);
    try {
      const res = await fetch('/api/chat/groups/messages', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          groupId: CHAT_STATE.activeGroup.id,
          content: text
        })
      });
      const data = await res.json();
      if (data && data.success && data.message) {
        CHAT_STATE.messages.push(data.message);
        renderChatSidebarBody();
        scrollToBottomMessages();
        fetchChatOverview();
      }
    } catch (e) {}
  }

  async function inviteUserToActiveGroup(targetUsernameOrId) {
    if (!CHAT_STATE.activeGroup) return;
    const payload = { groupId: CHAT_STATE.activeGroup.id };
    if (typeof targetUsernameOrId === 'number' || /^\d+$/.test(String(targetUsernameOrId))) {
      payload.targetUserId = Number(targetUsernameOrId);
    } else {
      payload.targetUsername = String(targetUsernameOrId).trim();
    }
    try {
      const res = await fetch('/api/chat/groups/invite', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      CHAT_STATE.statusBanner = {
        type: data.success ? 'success' : 'error',
        text: data.message || data.error || 'Invitación procesada.'
      };
      await fetchChatOverview();
      await loadGroupMessages(CHAT_STATE.activeGroup.id);
    } catch (e) {}
  }

  function scrollToBottomMessages() {
    const box = document.getElementById('rhChatMessagesBox');
    if (box) {
      box.scrollTop = box.scrollHeight;
    }
  }

  function formatMsgTime(ts) {
    if (!ts) return '';
    try {
      const d = new Date(ts.includes('T') ? ts : ts.replace(' ', 'T') + 'Z');
      if (isNaN(d.getTime())) return ts.slice(11, 16);
      return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  }

  /* ========================================================================
     4. RENDERIZADO DEL CUERPO DEL MENÚ LATERAL DE CHAT
     ======================================================================== */
  function renderChatSidebarBody() {
    const bodyEl = document.getElementById('rhChatBody');
    if (!bodyEl) return;

    const sidebarEl = document.getElementById('rhChatSidebar');
    if (sidebarEl) {
      sidebarEl.classList.toggle('in-conversation', Boolean(CHAT_STATE.activeDM || CHAT_STATE.activeGroup));
    }

    const myUsername = getCurrentUsername().toLowerCase();

    const bannerHtml = CHAT_STATE.statusBanner
      ? `<div style="padding: 9px 12px; border-radius: 11px; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: space-between; background: ${
          CHAT_STATE.statusBanner.type === 'success' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)'
        }; color: ${
          CHAT_STATE.statusBanner.type === 'success' ? '#047857' : '#b91c1c'
        }; border: 1px solid ${
          CHAT_STATE.statusBanner.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'
        };">
          <span>${escapeHtml(CHAT_STATE.statusBanner.text)}</span>
          <button type="button" onclick="window.RetroHubChat.clearBanner()" style="background:none;border:none;cursor:pointer;color:inherit;display:inline-flex;align-items:center;">${ICONS.close}</button>
        </div>`
      : '';

    // 4A. VISTA DE CONVERSACIÓN DIRECTA (1 A 1 CON AMIGO)
    if (CHAT_STATE.activeDM) {
      const f = CHAT_STATE.activeDM;
      const effectiveFriendName = getEffectiveName(f);
      const isCustomNick = hasCustomNickname(f);
      const currentNick = CHAT_STATE.nicknames[String(f.id)] || f.customNickname || '';

      const msgsHtml =
        CHAT_STATE.messages.length === 0
          ? `<div style="text-align: center; padding: 36px 16px; color: #64748b; font-size: 12.5px;">
               <div style="width: 44px; height: 44px; border-radius: 50%; background: rgba(0,162,237,0.1); color: #0284c7; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px auto;">
                 ${ICONS.chat}
               </div>
               <div style="font-weight: 800; color: #0f172a; margin-bottom: 4px;">Conversación con ${escapeHtml(effectiveFriendName)}</div>
               <div>Envía el primer mensaje directo para hablar o quedar a jugar.</div>
             </div>`
          : CHAT_STATE.messages
              .map((m) => {
                const isMine = (m.senderUsername || '').toLowerCase() === myUsername;
                return `
                  <div class="rh-msg-row ${isMine ? 'mine' : ''}">
                    <img src="${escapeHtml(m.senderAvatar)}" class="rh-msg-avatar" alt="" onerror="this.src='https://api.dicebear.com/7.x/bottts/svg?seed=user'" />
                    <div class="rh-msg-bubble-wrap">
                      <div class="rh-msg-bubble">${escapeHtml(m.content)}</div>
                      <span class="rh-msg-time">${formatMsgTime(m.sentAt)}</span>
                    </div>
                  </div>
                `;
              })
              .join('');

      const typingNames = CHAT_STATE.typingUsers.map((u) => getEffectiveName(u, u.username, u.displayName)).join(', ');
      const dmTheme = getEffectiveTheme(`dm_${f.id}`);
      const dmThemeClasses = getThemeClassNames(dmTheme);

      bodyEl.innerHTML = `
        <div class="rh-chat-conversation ${dmThemeClasses}">
          <div class="rh-chat-conv-header">
            <div style="display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1;">
              <button class="rh-chat-btn-secondary" type="button" onclick="window.RetroHubChat.backToList()" style="padding: 7px 10px; border-radius: 12px;" title="Volver a la lista de amigos">
                ${ICONS.back}
              </button>
              <img src="${escapeHtml(f.avatarUrl)}" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover; border: 2px solid #10b981; flex-shrink: 0;" alt="" />
              <div style="min-width: 0; flex: 1;">
                <div class="rh-chat-item-name-wrap">
                  <span class="rh-chat-item-name">${escapeHtml(effectiveFriendName)}</span>
                  ${isCustomNick ? `<span class="rh-custom-nick-pill" onclick="window.RetroHubChat.openNicknameModal(${f.id}, '${escapeHtml(f.username)}', '${escapeHtml(f.displayName || f.username)}', '${escapeHtml(f.avatarUrl)}')" style="cursor: pointer;" title="Apodo personal asignado por ti (solo tú lo verás)">${ICONS.tag} Apodo</span>` : ''}
                  <button class="rh-btn-edit-nick" type="button" onclick="window.RetroHubChat.openNicknameModal(${f.id}, '${escapeHtml(f.username)}', '${escapeHtml(f.displayName || f.username)}', '${escapeHtml(f.avatarUrl)}')" title="Poner o editar apodo personal (solo tú lo verás)">
                    ${ICONS.editPencil}
                  </button>
                </div>
                <div style="font-size: 11px; font-weight: 700; color: #64748b;">
                  ${isCustomNick ? `<span style="color: #334155;">${escapeHtml(f.displayName)} • </span>` : ''}
                  <span style="color: #0284c7;">@${escapeHtml(f.username)}</span> • <span style="color: #10b981;">En línea</span>
                </div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
              <button class="rh-btn-chat-theme" type="button" onclick="window.RetroHubChat.openThemeModal()" title="Personalizar tema de fondo y formato de burbujas">
                ${ICONS.palette}
                <span>Tema</span>
              </button>
              <button class="rh-chat-close-btn" type="button" onclick="window.RetroHubChat.close()" title="Cerrar chat lateral">
                ${ICONS.close}
              </button>
            </div>
          </div>

          ${bannerHtml}

          <div class="rh-chat-messages-box" id="rhChatMessagesBox">
            ${msgsHtml}
          </div>

          <div class="rh-chat-typing-discord-bar ${CHAT_STATE.typingUsers.length > 0 ? 'visible' : ''}" id="rhChatTypingBar">
            <span class="rh-discord-dots"><span></span><span></span><span></span></span>
            <span class="rh-discord-typing-text" id="rhChatTypingText">
              ${CHAT_STATE.typingUsers.length > 0 ? `<strong>${escapeHtml(typingNames)}</strong> está escribiendo...` : ''}
            </span>
          </div>

          <div class="rh-chat-composer">
            <input type="text" id="rhChatComposerInput" class="rh-chat-input" placeholder="Escribe un mensaje a ${escapeHtml(effectiveFriendName)}..." />
            <button type="button" class="rh-chat-btn-primary" id="rhChatSendBtn">
              ${ICONS.send}
            </button>
          </div>
        </div>
      `;

      updateTypingUI();

      const inp = document.getElementById('rhChatComposerInput');
      const sendBtn = document.getElementById('rhChatSendBtn');
      if (inp) {
        if (!CHAT_STATE.editingNicknameUserId) inp.focus();
        inp.addEventListener('input', handleComposerInput);
        inp.addEventListener('blur', () => {
          if (!inp.value.trim()) sendTypingSignal(false);
        });
        inp.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') sendDirectMessage();
        });
      }
      if (sendBtn) sendBtn.addEventListener('click', sendDirectMessage);
      return;
    }

    // 4B. VISTA DE SALA DE GRUPO (CON INVITACIÓN ABIERTA PARA CUALQUIER MIEMBRO)
    if (CHAT_STATE.activeGroup) {
      const g = CHAT_STATE.activeGroup;
      const memberIds = new Set((g.members || []).map((m) => Number(m.id)));
      const invitableUsers = CHAT_STATE.allUsers.filter((u) => !memberIds.has(Number(u.id)));

      const inviteDrawerHtml = CHAT_STATE.showInviteToGroup
        ? `<div class="rh-chat-drawer-card" style="margin-top: 8px;">
             <div style="display: flex; align-items: center; justify-content: space-between;">
               <span style="font-family: 'Space Grotesk', sans-serif; font-size: 12.5px; font-weight: 800; color: #0f172a;">
                 Invitar jugadores al grupo (Abierto a todos)
               </span>
               <span style="font-family: 'Space Grotesk', monospace; font-size: 11px; font-weight: 800; color: #0284c7; background: rgba(0,162,237,0.1); padding: 3px 8px; border-radius: 6px;">
                 ${escapeHtml(g.inviteCode)}
               </span>
             </div>
             <div class="rh-chat-quick-bar">
               <input type="text" id="rhGroupInviteInput" class="rh-chat-input" placeholder="Usuario o @gamertag para invitar..." />
               <button type="button" class="rh-chat-btn-primary" onclick="const v=document.getElementById('rhGroupInviteInput'); if(v && v.value.trim()) window.RetroHubChat.inviteToGroup(v.value.trim());">
                 ${ICONS.userPlus}
                 <span>Invitar</span>
               </button>
             </div>
             ${
               invitableUsers.length > 0
                 ? `<div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 2px;">
                      ${invitableUsers
                        .map(
                          (u) => `
                        <button type="button" class="rh-chat-btn-secondary" style="padding: 4px 10px; font-size: 11px;" onclick="window.RetroHubChat.inviteToGroup(${u.id})">
                          ${ICONS.plus}
                          <span>Invitar a ${escapeHtml(getEffectiveName(u))} (@${escapeHtml(u.username)})</span>
                        </button>`
                        )
                        .join('')}
                    </div>`
                 : `<div style="font-size: 11px; color: #64748b;">Todos los jugadores registrados ya están en este grupo.</div>`
             }
           </div>`
        : '';

      const msgsHtml =
        CHAT_STATE.messages.length === 0
          ? `<div style="text-align: center; padding: 34px 16px; color: #64748b; font-size: 12.5px;">
               <div style="width: 44px; height: 44px; border-radius: 14px; background: ${escapeHtml(g.iconColor)}; color: #ffffff; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px auto;">
                 ${ICONS.users}
               </div>
               <div style="font-weight: 800; color: #0f172a; margin-bottom: 4px;">Sala de Grupo: ${escapeHtml(g.name)}</div>
               <div>Cualquier miembro puede escribir e invitar a nuevos jugadores con el botón superior.</div>
             </div>`
          : CHAT_STATE.messages
              .map((m) => {
                const isMine = (m.senderUsername || '').toLowerCase() === myUsername;
                const senderName = getEffectiveName(m, m.senderUsername, m.senderDisplayName);
                const isCustom = hasCustomNickname(m);
                return `
                  <div class="rh-msg-row ${isMine ? 'mine' : ''}">
                    <img src="${escapeHtml(m.senderAvatar)}" class="rh-msg-avatar" alt="" onerror="this.src='https://api.dicebear.com/7.x/bottts/svg?seed=user'" />
                    <div class="rh-msg-bubble-wrap">
                      ${
                        !isMine
                          ? `<span class="rh-msg-sender" style="display: inline-flex; align-items: center; gap: 5px;">
                              <strong>${escapeHtml(senderName)}</strong>
                              ${
                                isCustom
                                  ? `<span class="rh-custom-nick-pill" style="font-size: 8.5px; padding: 1px 4px; cursor: pointer;" onclick="window.RetroHubChat.openNicknameModal(${m.senderId}, '${escapeHtml(m.senderUsername)}', '${escapeHtml(m.senderDisplayName || m.senderUsername)}', '${escapeHtml(m.senderAvatar)}')" title="Apodo personal asignado por ti (solo tú lo verás)">${ICONS.tag}</span>`
                                  : ''
                              }
                              <span style="font-weight: 500; opacity: 0.75;">@${escapeHtml(m.senderUsername)}</span>
                              <button type="button" class="rh-btn-edit-nick" style="width: 18px; height: 18px; padding: 1px; border-radius: 6px;" onclick="window.RetroHubChat.openNicknameModal(${m.senderId}, '${escapeHtml(m.senderUsername)}', '${escapeHtml(m.senderDisplayName || m.senderUsername)}', '${escapeHtml(m.senderAvatar)}')" title="Poner apodo personal a @${escapeHtml(m.senderUsername)}">${ICONS.editPencil}</button>
                            </span>`
                          : ''
                      }
                      <div class="rh-msg-bubble">${escapeHtml(m.content)}</div>
                      <span class="rh-msg-time">${formatMsgTime(m.sentAt)}</span>
                    </div>
                  </div>
                `;
              })
              .join('');

      const groupTypingNames = CHAT_STATE.typingUsers.map((u) => getEffectiveName(u, u.username, u.displayName)).join(', ');
      const groupTheme = getEffectiveTheme(`group_${g.id}`);
      const groupThemeClasses = getThemeClassNames(groupTheme);

      bodyEl.innerHTML = `
        <div class="rh-chat-conversation ${groupThemeClasses}">
          <div class="rh-chat-conv-header">
            <div style="display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1;">
              <button class="rh-chat-btn-secondary" type="button" onclick="window.RetroHubChat.backToList()" style="padding: 7px 10px; border-radius: 12px;" title="Volver a la lista de grupos">
                ${ICONS.back}
              </button>
              <div class="rh-chat-group-avatar" style="width: 38px; height: 38px; border-radius: 12px; background: ${escapeHtml(g.iconColor)}; flex-shrink: 0;">
                ${ICONS.users}
              </div>
              <div style="min-width: 0; flex: 1;">
                <div class="rh-chat-item-name">${escapeHtml(g.name)}</div>
                <div style="font-size: 11px; font-weight: 700; color: #0284c7;">
                  ${(g.members || []).length} miembros • Código: ${escapeHtml(g.inviteCode)}
                </div>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
              <button class="rh-btn-chat-theme" type="button" onclick="window.RetroHubChat.openThemeModal()" title="Personalizar tema de fondo y formato de burbujas">
                ${ICONS.palette}
                <span>Tema</span>
              </button>
              <button class="rh-chat-btn-secondary" type="button" onclick="window.RetroHubChat.toggleInvitePanel()" title="Cualquier miembro puede invitar jugadores a este grupo">
                ${ICONS.userPlus}
                <span>Invitar</span>
              </button>
              <button class="rh-chat-close-btn" type="button" onclick="window.RetroHubChat.close()" title="Cerrar chat lateral">
                ${ICONS.close}
              </button>
            </div>
          </div>

          ${bannerHtml}
          ${inviteDrawerHtml}

          <div class="rh-chat-messages-box" id="rhChatMessagesBox">
            ${msgsHtml}
          </div>

          <div class="rh-chat-typing-discord-bar ${CHAT_STATE.typingUsers.length > 0 ? 'visible' : ''}" id="rhChatTypingBar">
            <span class="rh-discord-dots"><span></span><span></span><span></span></span>
            <span class="rh-discord-typing-text" id="rhChatTypingText">
              ${CHAT_STATE.typingUsers.length > 0 ? `<strong>${escapeHtml(groupTypingNames)}</strong> está escribiendo...` : ''}
            </span>
          </div>

          <div class="rh-chat-composer">
            <input type="text" id="rhChatComposerInput" class="rh-chat-input" placeholder="Mensaje para el grupo ${escapeHtml(g.name)}..." />
            <button type="button" class="rh-chat-btn-primary" id="rhChatSendBtn">
              ${ICONS.send}
            </button>
          </div>
        </div>
      `;

      updateTypingUI();

      const inp = document.getElementById('rhChatComposerInput');
      const sendBtn = document.getElementById('rhChatSendBtn');
      if (inp) {
        inp.focus();
        inp.addEventListener('input', handleComposerInput);
        inp.addEventListener('blur', () => {
          if (!inp.value.trim()) sendTypingSignal(false);
        });
        inp.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') sendGroupMessage();
        });
      }
      if (sendBtn) sendBtn.addEventListener('click', sendGroupMessage);
      return;
    }

    // 4C. LISTA DE PESTAÑA 1: AMIGOS (MENSAJES DIRECTOS)
    if (CHAT_STATE.activeTab === 'friends') {
      const friendIds = new Set(CHAT_STATE.friends.map((f) => Number(f.id)));
      const suggested = CHAT_STATE.allUsers.filter((u) => !friendIds.has(Number(u.id)));

      const friendsListHtml =
        CHAT_STATE.friends.length === 0
          ? `<div style="text-align: center; padding: 32px 16px; color: #64748b; background: #f8fafc; border: 1.5px dashed #cbd5e1; border-radius: 16px;">
               <div style="width: 44px; height: 44px; border-radius: 50%; background: rgba(0,210,190,0.12); color: #00a896; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px auto;">
                 ${ICONS.userPlus}
               </div>
               <div style="font-weight: 800; color: #0f172a; font-size: 14px;">Tu lista de amigos está vacía</div>
               <div style="font-size: 12px; margin-top: 4px;">Añade a un jugador por su @usuario arriba para chatear en privado.</div>
             </div>`
          : CHAT_STATE.friends
              .map(
                (f) => {
                  const effName = getEffectiveName(f);
                  const isCust = hasCustomNickname(f);
                  return `
                <div class="rh-chat-item-card" onclick="window.RetroHubChat.openDM(${f.id})">
                  <div class="rh-chat-item-avatar-wrap">
                    <img src="${escapeHtml(f.avatarUrl)}" class="rh-chat-item-avatar" alt="${escapeHtml(effName)}" onerror="this.src='https://api.dicebear.com/7.x/bottts/svg?seed=user'" />
                    <span class="rh-chat-item-status ${f.status === 'offline' ? 'offline' : ''}"></span>
                  </div>
                  <div class="rh-chat-item-info">
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px;">
                      <div class="rh-chat-item-name-wrap">
                        <span class="rh-chat-item-name">${escapeHtml(effName)}</span>
                        ${isCust ? `<span class="rh-custom-nick-pill" onclick="event.stopPropagation(); window.RetroHubChat.openNicknameModal(${f.id}, '${escapeHtml(f.username)}', '${escapeHtml(f.displayName || f.username)}', '${escapeHtml(f.avatarUrl)}');" style="cursor: pointer;" title="Apodo personal asignado por ti (solo tú lo verás)">${ICONS.tag} Apodo</span>` : ''}
                      </div>
                      <span style="font-size: 10.5px; font-weight: 700; color: #0284c7;">@${escapeHtml(f.username)}</span>
                    </div>
                    <div class="rh-chat-item-sub">
                      ${
                        f.lastMessage
                          ? escapeHtml(f.lastMessage)
                          : f.game
                          ? `Jugando a ${escapeHtml(f.game)}`
                          : isCust
                          ? `Nombre real: ${escapeHtml(f.displayName)}`
                          : 'Haz clic para enviar un mensaje directo'
                      }
                    </div>
                  </div>
                  <button type="button" class="rh-btn-edit-nick" onclick="event.stopPropagation(); window.RetroHubChat.openNicknameModal(${f.id}, '${escapeHtml(f.username)}', '${escapeHtml(f.displayName || f.username)}', '${escapeHtml(f.avatarUrl)}');" title="Poner o editar apodo personal (solo tú lo verás)">
                    ${ICONS.editPencil}
                  </button>
                  ${
                    f.unreadCount > 0
                      ? `<span class="rh-chat-unread-badge">${f.unreadCount}</span>`
                      : `<span style="color: #0284c7; display: flex;">${ICONS.chat}</span>`
                  }
                </div>
              `;
                }
              )
              .join('');

      const suggestedHtml =
        suggested.length > 0
          ? `<div style="margin-top: 8px;">
               <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; color: #64748b; margin-bottom: 8px;">
                 Jugadores en RetroHub disponibles
               </div>
               <div style="display: flex; flex-direction: column; gap: 8px;">
                 ${suggested
                   .map(
                     (u) => `
                   <div class="rh-chat-item-card" style="cursor: default;">
                     <img src="${escapeHtml(u.avatarUrl)}" class="rh-chat-item-avatar" style="width: 36px; height: 36px;" alt="" />
                     <div class="rh-chat-item-info">
                       <div class="rh-chat-item-name" style="font-size: 13px;">${escapeHtml(u.displayName)}</div>
                       <div class="rh-chat-item-sub">@${escapeHtml(u.username)}</div>
                     </div>
                     <button type="button" class="rh-chat-btn-secondary" onclick="window.RetroHubChat.addFriend('${escapeHtml(u.username)}')">
                       ${ICONS.userPlus}
                       <span>Añadir</span>
                     </button>
                   </div>
                 `
                   )
                   .join('')}
               </div>
             </div>`
          : '';

      bodyEl.innerHTML = `
        ${bannerHtml}
        <div class="rh-chat-quick-bar">
          <input type="text" id="rhQuickAddFriendInput" class="rh-chat-input" placeholder="Añadir amigo por @usuario (ej. Sariwiiwi)..." />
          <button type="button" class="rh-chat-btn-primary" onclick="const i=document.getElementById('rhQuickAddFriendInput'); if(i && i.value.trim()) window.RetroHubChat.addFriend(i.value.trim());">
            ${ICONS.userPlus}
            <span>Añadir</span>
          </button>
        </div>

        <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; color: #64748b; margin-top: 4px;">
          Mensajes Directos (${CHAT_STATE.friends.length})
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${friendsListHtml}
        </div>

        ${suggestedHtml}
      `;
      return;
    }

    // 4D. LISTA DE PESTAÑA 2: GRUPOS (CREAR GRUPO, UNIRSE E INVITAR)
    const colors = ['#00a2ed', '#e60012', '#00d2be', '#ff7300', '#8b5cf6', '#10b981'];
    const createGroupCardHtml = CHAT_STATE.showCreateGroup
      ? `<div class="rh-chat-drawer-card">
           <div style="font-family: 'Space Grotesk', sans-serif; font-size: 13.5px; font-weight: 800; color: #0f172a;">
             Crear Nuevo Grupo de Chat
           </div>
           <input type="text" id="rhNewGroupName" class="rh-chat-input" placeholder="Nombre del grupo (ej. Torneo Mario Kart 64)" />
           <input type="text" id="rhNewGroupDesc" class="rh-chat-input" placeholder="Descripción o tema del grupo (opcional)" />
           <div>
             <div style="font-size: 11px; font-weight: 700; color: #64748b; margin-bottom: 6px;">Color de insignia del grupo</div>
             <div class="rh-color-swatches">
               ${colors
                 .map(
                   (c) => `
                 <button type="button" class="rh-color-swatch ${CHAT_STATE.newGroupColor === c ? 'active' : ''}" style="background: ${c};" onclick="window.RetroHubChat.setGroupColor('${c}')"></button>
               `
                 )
                 .join('')}
             </div>
           </div>
           ${
             CHAT_STATE.friends.length > 0
               ? `<div>
                    <div style="font-size: 11px; font-weight: 700; color: #64748b; margin-bottom: 6px;">Invitar amigos iniciales</div>
                    <div style="display: flex; flex-direction: column; gap: 6px; max-height: 110px; overflow-y: auto;">
                      ${CHAT_STATE.friends
                        .map(
                          (f) => `
                        <label style="display: flex; align-items: center; gap: 8px; font-size: 12.5px; font-weight: 700; color: #1e293b; cursor: pointer;">
                          <input type="checkbox" class="rh-new-group-member-cb" value="${f.id}" checked />
                          <span>${escapeHtml(f.displayName)} (@${escapeHtml(f.username)})</span>
                        </label>
                      `
                        )
                        .join('')}
                    </div>
                  </div>`
               : ''
           }
           <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 4px;">
             <button type="button" class="rh-chat-btn-secondary" onclick="window.RetroHubChat.toggleCreateGroup(false)">Cancelar</button>
             <button type="button" class="rh-chat-btn-primary" onclick="window.RetroHubChat.submitCreateGroup()">
               ${ICONS.plus}
               <span>Crear Grupo</span>
             </button>
           </div>
         </div>`
      : '';

    const joinGroupCardHtml = CHAT_STATE.showJoinGroup
      ? `<div class="rh-chat-drawer-card">
           <div style="font-family: 'Space Grotesk', sans-serif; font-size: 13px; font-weight: 800; color: #0f172a;">
             Unirse a un Grupo con Código de Invitación
           </div>
           <div class="rh-chat-quick-bar">
             <input type="text" id="rhJoinGroupCodeInput" class="rh-chat-input" placeholder="Ej. GRP-1234-5678" />
             <button type="button" class="rh-chat-btn-primary" onclick="window.RetroHubChat.submitJoinGroup()">Unirse</button>
           </div>
         </div>`
      : '';

    const groupsListHtml =
      CHAT_STATE.groups.length === 0
        ? `<div style="text-align: center; padding: 32px 16px; color: #64748b; background: #f8fafc; border: 1.5px dashed #cbd5e1; border-radius: 16px;">
             <div style="width: 44px; height: 44px; border-radius: 14px; background: rgba(0,162,237,0.12); color: #0284c7; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px auto;">
               ${ICONS.users}
             </div>
             <div style="font-weight: 800; color: #0f172a; font-size: 14px;">Aún no hay grupos creados</div>
             <div style="font-size: 12px; margin-top: 4px;">Crea un grupo con el botón superior. Cualquier miembro podrá invitar a más amigos.</div>
           </div>`
        : CHAT_STATE.groups
            .map(
              (g) => `
            <div class="rh-chat-item-card" onclick="window.RetroHubChat.openGroup(${g.id})">
              <div class="rh-chat-group-avatar" style="background: ${escapeHtml(g.iconColor || '#00a2ed')};">
                ${ICONS.users}
              </div>
              <div class="rh-chat-item-info">
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px;">
                  <span class="rh-chat-item-name">${escapeHtml(g.name)}</span>
                  <span style="font-size: 10.5px; font-weight: 800; color: #0284c7;">${(g.members || []).length} miembros</span>
                </div>
                <div class="rh-chat-item-sub">
                  ${
                    g.lastMessage
                      ? escapeHtml(g.lastMessage)
                      : g.description
                      ? escapeHtml(g.description)
                      : `Código de invitación: ${escapeHtml(g.inviteCode)}`
                  }
                </div>
              </div>
            </div>
          `
            )
            .join('');

    bodyEl.innerHTML = `
      ${bannerHtml}
      <div style="display: flex; gap: 8px;">
        <button type="button" class="rh-chat-btn-primary" style="flex: 1;" onclick="window.RetroHubChat.toggleCreateGroup()">
          ${ICONS.plus}
          <span>Crear Grupo</span>
        </button>
        <button type="button" class="rh-chat-btn-secondary" onclick="window.RetroHubChat.toggleJoinGroup()">
          <span>Código Invitación</span>
        </button>
      </div>

      ${createGroupCardHtml}
      ${joinGroupCardHtml}

      <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; color: #64748b; margin-top: 4px;">
        Salas y Grupos Activos (${CHAT_STATE.groups.length})
      </div>

      <div style="display: flex; flex-direction: column; gap: 8px;">
        ${groupsListHtml}
      </div>
    `;
  }

  /* ========================================================================
     5. SINCRONIZACIÓN DE USUARIO EN LA BARRA SUPERIOR
     ======================================================================== */
  function updateToolbarUser(userObj) {
    if (!userObj) return;
    const dNameEl = document.getElementById('rhToolbarDisplayName');
    const uNameEl = document.getElementById('rhToolbarUsername');
    const avEl = document.getElementById('rhToolbarAvatar');
    const nameLineEl = document.querySelector('.rh-user-name-line');

    if (dNameEl && (userObj.displayName || userObj.username)) {
      dNameEl.textContent = userObj.displayName || userObj.username;
    }
    if (uNameEl && userObj.username) {
      uNameEl.textContent = `@${userObj.username}`;
    }
    if (avEl && userObj.avatarUrl) {
      avEl.src = userObj.avatarUrl;
    }

    const currentUsername = userObj.username || localStorage.getItem('retrohub_user_name') || '';
    const role = userObj.role || localStorage.getItem('retrohub_user_role') || (currentUsername.toLowerCase() === 'sariwiiwi' ? 'admin' : 'user');
    if (userObj.role) {
      localStorage.setItem('retrohub_user_role', userObj.role);
    }
    if (nameLineEl) {
      let badge = nameLineEl.querySelector('.rh-user-role-badge');
      if (role === 'admin') {
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'rh-user-role-badge admin';
          badge.title = 'Administradora del Sistema';
          badge.innerHTML = `${ICONS.shieldCheck} Admin`;
          nameLineEl.appendChild(badge);
        }
      } else if (badge) {
        badge.remove();
      }
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
          if (u.id) localStorage.setItem('retrohub_user_id', String(u.id));
          localStorage.setItem('retrohub_user_name', u.username);
          localStorage.setItem('retrohub_display_name', u.displayName || u.username);
          if (u.role) localStorage.setItem('retrohub_user_role', u.role);
          if (u.avatarUrl) localStorage.setItem('retrohub_user_avatar', u.avatarUrl);
          updateToolbarUser({
            username: u.username,
            displayName: u.displayName || u.username,
            avatarUrl: u.avatarUrl,
            role: u.role
          });
          fetchChatOverview();
        }
      })
      .catch(() => {});
  }

  function initToolbar() {
    let mount = document.getElementById('retrohubGlobalToolbar');
    if (mount) {
      mount.innerHTML = buildToolbarHTML();
    }

    ensureChatSidebarMounted();

    const chatBtn = document.getElementById('rhToolbarChatBtn');
    if (chatBtn) {
      chatBtn.addEventListener('click', toggleChatSidebar);
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
    fetchChatOverview();

    // Polling ligero para mantener mensajes de amigos y grupos al día
    setInterval(() => {
      if (CHAT_STATE.isOpen) {
        if (CHAT_STATE.activeDM) loadDirectMessages(CHAT_STATE.activeDM.id);
        else if (CHAT_STATE.activeGroup) loadGroupMessages(CHAT_STATE.activeGroup.id);
        else fetchChatOverview();
      }
    }, 4000);

    // Polling rápido para indicadores en tiempo real de "Escribiendo..."
    setInterval(() => {
      if (CHAT_STATE.isOpen && (CHAT_STATE.activeDM || CHAT_STATE.activeGroup)) {
        pollTypingStatus();
      }
    }, 1800);

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

  window.RetroHubChat = {
    open: openChatSidebar,
    close: closeChatSidebar,
    toggle: toggleChatSidebar,
    switchTab: switchChatTab,
    openDM: openDMConversation,
    openGroup: openGroupConversation,
    addFriend: addFriendByIdentifier,
    backToList: () => {
      CHAT_STATE.activeDM = null;
      CHAT_STATE.activeGroup = null;
      CHAT_STATE.statusBanner = null;
      CHAT_STATE.editingNicknameUserId = null;
      sendTypingSignal(false);
      const sb = document.getElementById('rhChatSidebar');
      if (sb) sb.classList.remove('in-conversation');
      fetchChatOverview().then(renderChatSidebarBody);
    },
    toggleCreateGroup: (force) => {
      CHAT_STATE.showCreateGroup = typeof force === 'boolean' ? force : !CHAT_STATE.showCreateGroup;
      CHAT_STATE.showJoinGroup = false;
      renderChatSidebarBody();
    },
    toggleJoinGroup: (force) => {
      CHAT_STATE.showJoinGroup = typeof force === 'boolean' ? force : !CHAT_STATE.showJoinGroup;
      CHAT_STATE.showCreateGroup = false;
      renderChatSidebarBody();
    },
    setGroupColor: (color) => {
      CHAT_STATE.newGroupColor = color;
      renderChatSidebarBody();
    },
    submitCreateGroup: createNewGroup,
    submitJoinGroup: joinGroupByCode,
    toggleInvitePanel: () => {
      CHAT_STATE.showInviteToGroup = !CHAT_STATE.showInviteToGroup;
      renderChatSidebarBody();
    },
    inviteToGroup: inviteUserToActiveGroup,
    clearBanner: () => {
      CHAT_STATE.statusBanner = null;
      renderChatSidebarBody();
    },
    // Métodos para apodos personalizados (estrictamente privados)
    openNicknameModal: openNicknameModal,
    closeNicknameModal: closeNicknameModal,
    submitNicknameModal: submitNicknameModal,
    setNickname: setCustomNickname,
    saveNickname: setCustomNickname,
    openNicknameEditor: (userId) => {
      const u = CHAT_STATE.friends.find((f) => f.id === userId) || CHAT_STATE.allUsers.find((x) => x.id === userId) || (CHAT_STATE.activeDM && CHAT_STATE.activeDM.id === userId ? CHAT_STATE.activeDM : null);
      if (u) openNicknameModal(u.id, u.username, u.displayName, u.avatarUrl);
    },
    closeNicknameEditor: closeNicknameModal,
    toggleNicknameEditor: (userId) => {
      const u = CHAT_STATE.friends.find((f) => f.id === userId) || CHAT_STATE.allUsers.find((x) => x.id === userId) || (CHAT_STATE.activeDM && CHAT_STATE.activeDM.id === userId ? CHAT_STATE.activeDM : null);
      if (u) openNicknameModal(u.id, u.username, u.displayName, u.avatarUrl);
    },
    getEffectiveName: getEffectiveName,
    hasCustomNickname: hasCustomNickname,
    // Métodos para temas y formatos de burbuja personalizados
    openThemeModal: openThemeModal,
    closeThemeModal: closeThemeModal,
    saveThemeModal: saveThemeModal,
    resetThemeModal: resetThemeModal,
    applyPreset: applyThemePreset,
    setThemeOption: setThemeOption,
    setThemeScope: setThemeScope,
    getEffectiveTheme: getEffectiveTheme,
    getState: () => CHAT_STATE,
    refresh: fetchChatOverview
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToolbar);
  } else {
    initToolbar();
  }
})();
