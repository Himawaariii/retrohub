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
    check: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
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
    typingPollTimer: null
  };

  function getAuthHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('retrohub_jwt_token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
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
          CHAT_STATE.nicknames = Object.assign({}, parsed, CHAT_STATE.nicknames);
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
      if (userOrId.customNickname) return userOrId.customNickname;
      if (userOrId.senderCustomNickname) return userOrId.senderCustomNickname;
      return userOrId.displayName || userOrId.senderDisplayName || userOrId.username || userOrId.senderUsername || 'Usuario';
    }
    const uid = String(userOrId || '');
    if (uid && CHAT_STATE.nicknames[uid]) return CHAT_STATE.nicknames[uid];
    return fallbackDisplayName || fallbackUsername || 'Usuario';
  }

  function hasCustomNickname(userOrId) {
    if (typeof userOrId === 'object' && userOrId !== null) {
      const uid = String(userOrId.id || userOrId.senderId || '');
      return Boolean((uid && CHAT_STATE.nicknames[uid]) || userOrId.customNickname || userOrId.senderCustomNickname);
    }
    const uid = String(userOrId || '');
    return Boolean(uid && CHAT_STATE.nicknames[uid]);
  }

  async function setCustomNickname(targetUserId, newNickname) {
    const clean = String(newNickname || '').trim();
    const uidStr = String(targetUserId);
    try {
      const res = await fetch('/api/chat/nicknames', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          targetUserId: Number(targetUserId),
          nickname: clean
        })
      });
      const data = await res.json();
      if (data && data.success) {
        if (clean) {
          CHAT_STATE.nicknames[uidStr] = clean;
        } else {
          delete CHAT_STATE.nicknames[uidStr];
        }
        saveLocalNicknames();
        CHAT_STATE.editingNicknameUserId = null;
        CHAT_STATE.statusBanner = {
          type: 'success',
          text: clean ? `Apodo guardado: "${clean}" (solo tú lo verás).` : 'Apodo restablecido correctamente.'
        };
        await fetchChatOverview();
        if (CHAT_STATE.activeDM) {
          await loadDirectMessages(CHAT_STATE.activeDM.id);
        } else {
          renderChatSidebarBody();
        }
      }
    } catch (e) {
      CHAT_STATE.statusBanner = { type: 'error', text: 'Error al actualizar el apodo.' };
      renderChatSidebarBody();
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
      const uname = encodeURIComponent(getCurrentUsername());
      const res = await fetch(`/api/chat/overview?username=${uname}`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data && data.success) {
        if (data.nicknames && typeof data.nicknames === 'object') {
          CHAT_STATE.nicknames = Object.assign({}, CHAT_STATE.nicknames, data.nicknames);
          saveLocalNicknames();
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
          <button class="rh-chat-close-btn" id="rhChatCloseBtn" type="button" title="Cerrar chat lateral">
            ${ICONS.close}
          </button>
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
      const res = await fetch(`/api/chat/dm?friendId=${encodeURIComponent(friendId)}`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data && data.success) {
        if (data.nicknames && typeof data.nicknames === 'object') {
          CHAT_STATE.nicknames = Object.assign({}, CHAT_STATE.nicknames, data.nicknames);
          saveLocalNicknames();
        }
        if (data.typingUsers) {
          CHAT_STATE.typingUsers = data.typingUsers;
        }
        CHAT_STATE.messages = data.messages || [];
        renderChatSidebarBody();
        updateTypingUI();
        scrollToBottomMessages();
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
      const res = await fetch(`/api/chat/groups/messages?groupId=${encodeURIComponent(groupId)}`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data && data.success) {
        if (data.nicknames && typeof data.nicknames === 'object') {
          CHAT_STATE.nicknames = Object.assign({}, CHAT_STATE.nicknames, data.nicknames);
          saveLocalNicknames();
        }
        if (data.typingUsers) {
          CHAT_STATE.typingUsers = data.typingUsers;
        }
        CHAT_STATE.messages = data.messages || [];
        renderChatSidebarBody();
        updateTypingUI();
        scrollToBottomMessages();
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
          <button type="button" onclick="window.RetroHubChat.clearBanner()" style="background:none;border:none;cursor:pointer;color:inherit;font-weight:900;">✕</button>
        </div>`
      : '';

    // 4A. VISTA DE CONVERSACIÓN DIRECTA (1 A 1 CON AMIGO)
    if (CHAT_STATE.activeDM) {
      const f = CHAT_STATE.activeDM;
      const effectiveFriendName = getEffectiveName(f);
      const isCustomNick = hasCustomNickname(f);
      const currentNick = CHAT_STATE.nicknames[String(f.id)] || f.customNickname || '';

      const nicknameEditorHtml = CHAT_STATE.editingNicknameUserId === f.id
        ? `<div class="rh-nickname-card">
             <div class="rh-nickname-card-header">
               ${ICONS.tag}
               <span>Apodo Personal para @${escapeHtml(f.username)}</span>
             </div>
             <div class="rh-nickname-card-sub">
               Este nombre solo lo verás tú en tu cuenta. Nadie más sabrá qué apodo le pusiste.
             </div>
             <input type="text" id="rhNicknameInput" class="rh-chat-input" placeholder="Escribe un apodo único..." value="${escapeHtml(currentNick)}" maxlength="32" />
             <div style="display: flex; justify-content: flex-end; gap: 8px;">
               ${currentNick ? `<button type="button" class="rh-chat-btn-secondary danger" onclick="window.RetroHubChat.saveNickname(${f.id}, '')">Quitar apodo</button>` : ''}
               <button type="button" class="rh-chat-btn-secondary" onclick="window.RetroHubChat.closeNicknameEditor()">Cancelar</button>
               <button type="button" class="rh-chat-btn-primary" onclick="const v=document.getElementById('rhNicknameInput'); if(v) window.RetroHubChat.saveNickname(${f.id}, v.value);">
                 ${ICONS.check}
                 <span>Guardar apodo</span>
               </button>
             </div>
           </div>`
        : '';

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

      bodyEl.innerHTML = `
        <div class="rh-chat-conversation">
          <div class="rh-chat-conv-header">
            <div style="display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1;">
              <button class="rh-chat-btn-secondary" type="button" onclick="window.RetroHubChat.backToList()" style="padding: 6px 9px;">
                ${ICONS.back}
              </button>
              <img src="${escapeHtml(f.avatarUrl)}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2px solid #10b981;" alt="" />
              <div style="min-width: 0; flex: 1;">
                <div class="rh-chat-item-name-wrap">
                  <span class="rh-chat-item-name">${escapeHtml(effectiveFriendName)}</span>
                  ${isCustomNick ? `<span class="rh-custom-nick-pill" title="Apodo personal asignado por ti (solo tú lo ves)">${ICONS.tag} Apodo</span>` : ''}
                  <button class="rh-btn-edit-nick" type="button" onclick="window.RetroHubChat.toggleNicknameEditor(${f.id})" title="Poner o editar apodo personal (solo tú lo verás)">
                    ${ICONS.editPencil}
                  </button>
                </div>
                <div style="font-size: 11px; font-weight: 700; color: #64748b;">
                  ${isCustomNick ? `<span style="color: #334155;">${escapeHtml(f.displayName)} • </span>` : ''}
                  <span style="color: #0284c7;">@${escapeHtml(f.username)}</span> • <span style="color: #10b981;">En línea</span>
                </div>
              </div>
            </div>
          </div>

          ${bannerHtml}
          ${nicknameEditorHtml}

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
                          ? `<span class="rh-msg-sender"><strong>${escapeHtml(senderName)}</strong> ${
                              isCustom ? `<span class="rh-custom-nick-pill" style="font-size: 8.5px; padding: 1px 4px;">${ICONS.tag}</span>` : ''
                            } <span style="font-weight: 500; opacity: 0.75;">@${escapeHtml(m.senderUsername)}</span></span>`
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

      bodyEl.innerHTML = `
        <div class="rh-chat-conversation">
          <div class="rh-chat-conv-header">
            <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
              <button class="rh-chat-btn-secondary" type="button" onclick="window.RetroHubChat.backToList()" style="padding: 6px 9px;">
                ${ICONS.back}
              </button>
              <div class="rh-chat-group-avatar" style="width: 36px; height: 36px; border-radius: 11px; background: ${escapeHtml(g.iconColor)};">
                ${ICONS.users}
              </div>
              <div style="min-width: 0;">
                <div class="rh-chat-item-name">${escapeHtml(g.name)}</div>
                <div style="font-size: 11px; font-weight: 700; color: #0284c7;">
                  ${(g.members || []).length} miembros • Código: ${escapeHtml(g.inviteCode)}
                </div>
              </div>
            </div>

            <button class="rh-chat-btn-secondary" type="button" onclick="window.RetroHubChat.toggleInvitePanel()" title="Cualquier miembro puede invitar jugadores a este grupo">
              ${ICONS.userPlus}
              <span>Invitar</span>
            </button>
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
                        ${isCust ? `<span class="rh-custom-nick-pill" title="Apodo personal asignado por ti">${ICONS.tag} Apodo</span>` : ''}
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
                  <button type="button" class="rh-btn-edit-nick" onclick="event.stopPropagation(); window.RetroHubChat.openDM(${f.id}); setTimeout(() => window.RetroHubChat.openNicknameEditor(${f.id}), 120);" title="Poner o editar apodo personal">
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
    openNicknameEditor: (userId) => {
      CHAT_STATE.editingNicknameUserId = userId;
      renderChatSidebarBody();
      setTimeout(() => {
        const inp = document.getElementById('rhNicknameInput');
        if (inp) {
          inp.focus();
          inp.select();
        }
      }, 50);
    },
    closeNicknameEditor: () => {
      CHAT_STATE.editingNicknameUserId = null;
      renderChatSidebarBody();
    },
    toggleNicknameEditor: (userId) => {
      CHAT_STATE.editingNicknameUserId = (CHAT_STATE.editingNicknameUserId === userId) ? null : userId;
      renderChatSidebarBody();
      if (CHAT_STATE.editingNicknameUserId) {
        setTimeout(() => {
          const inp = document.getElementById('rhNicknameInput');
          if (inp) {
            inp.focus();
            inp.select();
          }
        }, 50);
      }
    },
    saveNickname: setCustomNickname,
    getEffectiveName: getEffectiveName,
    hasCustomNickname: hasCustomNickname,
    getState: () => CHAT_STATE,
    refresh: fetchChatOverview
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToolbar);
  } else {
    initToolbar();
  }
})();
