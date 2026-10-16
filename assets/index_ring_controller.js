/**
 * RetroHub • Controlador Minimalista y Estilizado del Anillo 3D y Cartucho 3D
 * - Vista 1: Anillo 3D de Consolas flotantes con título, breve descripción y flechas laterales.
 * - Vista 2: Lista estilizada hacia abajo a la izquierda | Cartucho 3D con giro + Descripción + Pequeño Vídeo a la derecha.
 * REGLA INQUEBRANTABLE: CERO EMOJIS — 100% ICONOS VECTORIALES SVG
 */
(function () {
  const GAME_DESCRIPTIONS = {
    'paper mario':
      'Una obra maestra del RPG en Nintendo 64 desarrollada por Intelligent Systems. Combina personajes planos estilo diorama de papel sobre escenarios tridimensionales vibrantes y combates por turnos.',
    'anguna':
      'Aventura de acción y mazmorras de corte clásico estilo Zelda creada para Game Boy Advance por Nathan Tolbert. Explora tierras peligrosas, descubre artefactos ocultos y escapa de las mazmorras de Demrav.',
    '3 weeks in paradise':
      'Adaptación portátil para Game Boy Advance del clásico de aventuras y puzles de Mikro-Gen. Rescata a la familia de Wally Week en una isla tropical resolviendo ingeniosos acertijos.',
    '31 in 1':
      'Cartucho compilatorio clásico de 8 bits para Nintendo Entertainment System que reúne 31 juegos arcade de acción, plataformas, disparos espaciales y deportes.',
    '3 in 1':
      'Cartucho multijuego cooperativo y competitivo para Nintendo NES pensado para sesiones de acción directa y puntuación arcade.'
  };

  const GAME_TRAILERS = {
    'paper mario': 'ROMS/trailers/papermario.mp4',
    'anguna': 'ROMS/trailers/anguna.mp4',
    '3 weeks in paradise': 'ROMS/trailers/3weeksinparadise.mp4',
    '31 in 1': 'ROMS/trailers/31in1.mp4',
    '3 in 1': 'ROMS/trailers/3in1.mp4'
  };

  window.isConsoleInteriorOpen = false;
  let interiorSearchQuery = '';
  let trailerAnimFrame = null;
  let trailerPosterImg = null;
  let trailerSecondaryImg = null;

  function getGameRichDescription(game, consoleObj) {
    if (!game) return consoleObj ? consoleObj.synopsis : '';
    if (game.description) return game.description;
    const lowerTitle = (game.title || '').toLowerCase();
    for (const key of Object.keys(GAME_DESCRIPTIONS)) {
      if (lowerTitle.includes(key)) {
        return GAME_DESCRIPTIONS[key];
      }
    }
    return `Edición original para ${consoleObj ? consoleObj.name : 'consola retro'} (${game.genre || 'Aventura'} • ${game.year || consoleObj?.era || 'Clásico'}).`;
  }

  function getGameTrailerPath(game) {
    if (!game) return '';
    if (game.trailer) return game.trailer;
    const lowerTitle = (game.title || '').toLowerCase();
    for (const key of Object.keys(GAME_TRAILERS)) {
      if (lowerTitle.includes(key)) {
        return GAME_TRAILERS[key];
      }
    }
    const slug = lowerTitle.replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    return `ROMS/trailers/${slug}.mp4`;
  }

  function getDefaultCartridgeForConsole(consoleId) {
    if (typeof DEFAULT_MEDIA !== 'undefined' && DEFAULT_MEDIA[consoleId]) {
      return DEFAULT_MEDIA[consoleId];
    }
    const fallbacks = {
      n64: 'ROMS/cartridges/n64_clean.png',
      gba: 'ROMS/cartridges/gba_clean.png',
      snes: 'ROMS/cartridges/cart_snes.svg',
      nes: 'ROMS/cartridges/nes_clean.png',
      genesis: 'ROMS/cartridges/cart_genesis.svg',
      ps1: 'ROMS/cartridges/cd_disc.svg',
      sms: 'ROMS/cartridges/cart_sms.svg'
    };
    return fallbacks[consoleId] || `assets/consoles/${consoleId}.png`;
  }

  const CONSOLE_LOGOS = {
    n64: 'logos/Platform logo 16842 (Nintendo 64).png',
    gba: 'logos/Platform logo 13558 (Game Boy Advance).png',
    snes: 'logos/Platform logo 17575 (Super Nintendo Entertainment System).png',
    nes: 'logos/Platform logo 17465 (Nintendo Entertainment System).png',
    genesis: 'logos/Platform logo 21203 (Sega Mega Drive).png',
    ps1: 'logos/Platform logo 17551 (PlayStation).png',
    psp: 'logos/Platform logo 1164 (PlayStation Portable).png',
    arcade: 'logos/Platform logo 20147 (Multiple Arcade Machine Emulator).png',
    gbc: 'logos/Platform logo 40110 (Game Boy Color).png',
    sms: 'logos/Platform logo 21199 (Sega Master System).png',
    atari: 'logos/Platform logo 5088 (Atari 2600).png',
    pce: 'logos/Platform logo 17257 (NEC TurboGrafx-16).png',
    nds: 'logos/Platform logo 1161 (Nintendo DS).png',
    virtualboy: 'logos/Platform logo 27680 (Virtual Boy).webp'
  };

  function getActiveConsoleIdx() {
    return typeof window.activeConsoleIndex === 'number'
      ? window.activeConsoleIndex
      : (typeof activeConsoleIndex === 'number' ? activeConsoleIndex : 0);
  }

  /* ==========================================================================
     1. RENDERIZADO DEL ANILLO 3D DE CONSOLAS (VISTA 1)
     ========================================================================== */
  window.renderConsoleRing3D = function () {
    const track = document.getElementById('ringConsolesTrack');
    const dotsWrap = document.getElementById('ringPaginationDots');
    if (!track || typeof CONSOLES === 'undefined') return;

    const curIdx = getActiveConsoleIdx();
    const total = CONSOLES.length;

    const needsRebuild =
      track.children.length !== total ||
      Array.from(track.children).some((n, i) => n.dataset.consoleId !== CONSOLES[i]?.id);

    if (needsRebuild) {
      track.innerHTML = '';
      CONSOLES.forEach((c, idx) => {
        const node = document.createElement('div');
        node.className = 'ring-console-node';
        node.id = `ring-node-${c.id}`;
        node.dataset.index = String(idx);
        node.dataset.consoleId = c.id;

        node.innerHTML = `
          <div class="ring-node-hardware-card">
            <img src="assets/consoles_hires/${c.img}" class="ring-node-img" alt="${c.name}" onerror="this.src='assets/consoles/${c.img}'">
            <span class="ring-node-label-pill">${c.name}</span>
          </div>
        `;

        node.addEventListener('click', (e) => {
          e.stopPropagation();
          const currentIdx = getActiveConsoleIdx();
          if (idx === currentIdx) {
            window.enterSelectedConsole();
          } else {
            const diff = getCircularOffset(idx, currentIdx, total);
            updateFocusedConsole(idx, true, diff > 0 ? 'right' : 'left');
          }
        });

        track.appendChild(node);
      });
    }

    Array.from(track.children).forEach((node, idx) => {
      const offset = getCircularOffset(idx, curIdx, total);
      if (Math.abs(offset) <= 3) {
        node.setAttribute('data-ring-pos', String(offset));
      } else {
        node.setAttribute('data-ring-pos', 'hidden');
      }
    });

    const activeConsole = CONSOLES[curIdx];
    if (activeConsole) {
      const games = typeof getGamesForConsole === 'function' ? getGamesForConsole(activeConsole.id) : [];
      const makerEl = document.getElementById('ringMakerPill');
      const eraEl = document.getElementById('ringEraPill');
      const romsEl = document.getElementById('ringRomsPill');
      const logoEl = document.getElementById('ringConsoleLogoImg');
      const titleEl = document.getElementById('ringConsoleTitle');
      const descEl = document.getElementById('ringConsoleDesc');

      if (makerEl) makerEl.textContent = activeConsole.maker || 'Retro';
      const yearMatch = (activeConsole.era || '').match(/\b(19\d\d|20\d\d)\b/);
      if (eraEl) eraEl.textContent = yearMatch ? yearMatch[1] : activeConsole.arch || '';
      if (romsEl) {
        romsEl.textContent = `${games.length} ${games.length === 1 ? 'Juego' : 'Juegos'}`;
      }

      const logoUrl = activeConsole.logo || CONSOLE_LOGOS[activeConsole.id];
      if (logoEl) {
        if (logoUrl) {
          logoEl.src = logoUrl;
          logoEl.alt = activeConsole.name;
          logoEl.style.display = 'block';
          if (titleEl) titleEl.style.display = 'none';
        } else {
          logoEl.style.display = 'none';
          if (titleEl) {
            titleEl.textContent = activeConsole.name;
            titleEl.style.display = 'block';
          }
        }
      } else if (titleEl) {
        titleEl.textContent = activeConsole.name;
        titleEl.style.display = 'block';
      }

      if (descEl) descEl.textContent = activeConsole.synopsis || '';
    }

    if (dotsWrap) {
      if (dotsWrap.children.length !== total) {
        dotsWrap.innerHTML = '';
        CONSOLES.forEach((c, i) => {
          const dot = document.createElement('span');
          dot.className = `ring-page-dot ${i === curIdx ? 'active' : ''}`;
          dot.title = c.name;
          dot.onclick = () => updateFocusedConsole(i, true, i > curIdx ? 'right' : 'left');
          dotsWrap.appendChild(dot);
        });
      } else {
        Array.from(dotsWrap.children).forEach((dot, i) => {
          dot.classList.toggle('active', i === curIdx);
        });
      }
    }

    updateAudioPillStatus();
  };

  function getCircularOffset(itemIndex, currentIndex, total) {
    let diff = itemIndex - currentIndex;
    const half = Math.floor(total / 2);
    if (diff > half) diff -= total;
    if (diff < -half) diff += total;
    return diff;
  }

  /* ==========================================================================
     2. ENTRAR Y SALIR DE LA CONSOLA (TRANSICIÓN ANILLO <-> VISTA INTERIOR)
     ========================================================================== */
  window.enterSelectedConsole = function () {
    if (window.n3dsAudio) window.n3dsAudio.play('launch');
    window.isConsoleInteriorOpen = true;

    const ringStage = document.getElementById('consoleRingStage');
    const interiorStage = document.getElementById('consoleInteriorStage');
    if (ringStage) ringStage.style.display = 'none';
    if (interiorStage) {
      interiorStage.classList.add('active');
      interiorStage.style.display = 'flex';
    }

    interiorSearchQuery = '';
    activeGameIndex = 0;
    window.renderConsoleInteriorView();
  };

  window.exitConsoleInterior = function () {
    if (window.n3dsAudio) window.n3dsAudio.play('cancel');
    window.isConsoleInteriorOpen = false;
    stopTrailerPreviewLoop();

    const interiorStage = document.getElementById('consoleInteriorStage');
    const ringStage = document.getElementById('consoleRingStage');
    if (interiorStage) {
      interiorStage.classList.remove('active');
      interiorStage.style.display = 'none';
    }
    if (ringStage) {
      ringStage.style.display = 'flex';
    }

    window.renderConsoleRing3D();
  };

  /* ==========================================================================
     3. RENDERIZADO DE LA VISTA INTERIOR Y GIRO 3D DEL CARTUCHO
     ========================================================================== */
  let interiorViewMode = 'ring'; // 'ring' | 'grid' | 'list'
  let interiorSortMode = 'alpha'; // 'alpha' | 'recent'

  window.setInteriorViewMode = function (mode) {
    interiorViewMode = mode;
    ['ring', 'grid', 'list'].forEach((m) => {
      const btn = document.getElementById(`btnView${m.charAt(0).toUpperCase() + m.slice(1)}`);
      const panel = document.getElementById(`interiorView${m.charAt(0).toUpperCase() + m.slice(1)}`);
      if (btn) btn.classList.toggle('active', m === mode);
      if (panel) panel.classList.toggle('active', m === mode);
    });
    if (window.n3dsAudio) window.n3dsAudio.play('move');
    window.renderConsoleInteriorView();
  };

  window.setInteriorGameSort = function (sort) {
    interiorSortMode = sort;
    const btnAlpha = document.getElementById('btnSortAlpha');
    const btnRecent = document.getElementById('btnSortRecent');
    if (btnAlpha) btnAlpha.classList.toggle('active', sort === 'alpha');
    if (btnRecent) btnRecent.classList.toggle('active', sort === 'recent');
    if (window.n3dsAudio) window.n3dsAudio.play('move');
    activeGameIndex = 0;
    window.renderConsoleInteriorView();
  };

  window.navigateCartridgeRing = function (dir) {
    const curIdx = getActiveConsoleIdx();
    const c = CONSOLES[curIdx];
    if (!c) return;
    const games = getSortedInteriorGames(c.id);
    if (games.length <= 1) return;

    activeGameIndex = (activeGameIndex + dir + games.length) % games.length;
    if (window.n3dsAudio) window.n3dsAudio.play('move');
    window.renderConsoleInteriorView();
  };

  function getSortedInteriorGames(consoleId) {
    const raw = typeof getGamesForConsole === 'function' ? getGamesForConsole(consoleId) : [];
    let list = [...raw];

    if (interiorSortMode === 'alpha') {
      list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else if (interiorSortMode === 'recent') {
      list.sort((a, b) => (b.lastPlayed || 0) - (a.lastPlayed || 0));
    }

    if (interiorSearchQuery) {
      const q = interiorSearchQuery.toLowerCase();
      list = list.filter(
        (g) =>
          (g.title && g.title.toLowerCase().includes(q)) ||
          (g.genre && g.genre.toLowerCase().includes(q))
      );
    }
    return list;
  }
  window.getSortedInteriorGames = getSortedInteriorGames;

  // Compositor dinámico de cartuchos N64 usando n64_shell_base.png como carcasa base
  const n64CartCache = {};
  let n64ShellBaseImg = null;

  function renderN64CartridgeWithBase(artUrl, target) {
    if (!target || !artUrl) return;
    const deliver = (url) => {
      if (typeof target === 'function') target(url);
      else if (target && typeof target === 'object') target.src = url;
    };

    if (n64CartCache[artUrl]) {
      deliver(n64CartCache[artUrl]);
      return;
    }

    const ensureShell = (cb) => {
      if (n64ShellBaseImg && n64ShellBaseImg.complete && n64ShellBaseImg.naturalWidth > 0) {
        cb(n64ShellBaseImg);
      } else {
        n64ShellBaseImg = new Image();
        n64ShellBaseImg.crossOrigin = 'anonymous';
        n64ShellBaseImg.onload = () => cb(n64ShellBaseImg);
        n64ShellBaseImg.src = 'ROMS/cartridges/n64_shell_base.png';
      }
    };

    ensureShell((shellImg) => {
      const artImg = new Image();
      artImg.crossOrigin = 'anonymous';
      artImg.onload = () => {
        try {
          const w = shellImg.naturalWidth || 599;
          const h = shellImg.naturalHeight || 416;
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');

          // Coordenadas y curvatura exactas de la ventana del cartucho N64
          const winX = 166;
          const winY = 60;
          const winW = 274;
          const winH = 316;
          const radius = 6;

          // 1. Fondo oscuro neutral en la cavidad de la etiqueta
          ctx.save();
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(winX, winY, winW, winH, radius);
          } else {
            ctx.rect(winX, winY, winW, winH);
          }
          ctx.fillStyle = '#14161a';
          ctx.fill();
          ctx.clip();

          // 2. Dibujar carátula con ajuste cover (aspect-fill) centrado
          const scale = Math.max(winW / artImg.naturalWidth, winH / artImg.naturalHeight);
          const drawW = artImg.naturalWidth * scale;
          const drawH = artImg.naturalHeight * scale;
          const drawX = winX + (winW - drawW) / 2;
          const drawY = winY + (winH - drawH) / 2;
          ctx.drawImage(artImg, drawX, drawY, drawW, drawH);

          // 3. Sutil reflejo diagonal de pegatina para hiperrealismo
          const grad = ctx.createLinearGradient(winX, winY, winX + winW, winY + winH);
          grad.addColorStop(0, 'rgba(255, 255, 255, 0.24)');
          grad.addColorStop(0.35, 'rgba(255, 255, 255, 0.04)');
          grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.0)');
          grad.addColorStop(1, 'rgba(0, 0, 0, 0.32)');
          ctx.fillStyle = grad;
          ctx.fill();

          ctx.restore();

          // 4. Superponer la carcasa física N64 encima
          ctx.drawImage(shellImg, 0, 0, w, h);

          const dataUrl = canvas.toDataURL('image/png');
          n64CartCache[artUrl] = dataUrl;
          deliver(dataUrl);
        } catch (e) {
          console.warn('[Cartridge] Error componiendo cartucho:', e);
        }
      };
      artImg.src = artUrl;
    });
  }

  function setupCartridgeNodeTilt(node, idx) {
    const rig = document.getElementById(`cart-rig-${idx}`);
    const glare = document.getElementById(`cart-glare-${idx}`);
    if (!node || !rig) return;

    let isHovered = false;

    node.addEventListener('mouseenter', () => {
      isHovered = true;
      if (glare) glare.style.opacity = '0.65';
    });

    node.addEventListener('mousemove', (e) => {
      if (!isHovered) return;
      const rect = node.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      const rotY = nx * 22;
      const rotX = -ny * 16;
      const lift = -ny * 8;

      rig.style.transform = `translate3d(0, ${lift}px, 75px) rotateY(${rotY}deg) rotateX(${rotX}deg) scale(1.08)`;

      if (glare) {
        const gx = nx * 50;
        const gy = ny * 40;
        glare.style.transform = `translate(${gx}px, ${gy}px) translateZ(14px)`;
      }
    });

    node.addEventListener('mouseleave', () => {
      isHovered = false;
      rig.style.transform = '';
      if (glare) glare.style.opacity = '0';
    });
  }

  window.renderConsoleInteriorView = function () {
    const curIdx = getActiveConsoleIdx();
    const c = CONSOLES[curIdx];
    if (!c) return;

    const logoEl = document.getElementById('interiorConsoleLogo');
    const titleEl = document.getElementById('interiorConsoleTitle');
    const countEl = document.getElementById('interiorConsoleGameCount');
    const thumbEl = document.getElementById('interiorConsoleThumb');
    if (thumbEl) {
      thumbEl.style.display = 'none';
    }

    const logoUrl = c.logo || CONSOLE_LOGOS[c.id];
    if (logoEl) {
      if (logoUrl) {
        logoEl.src = logoUrl;
        logoEl.alt = c.name;
        logoEl.style.display = 'block';
        if (titleEl) titleEl.style.display = 'none';
      } else {
        logoEl.style.display = 'none';
        if (titleEl) {
          titleEl.textContent = c.name;
          titleEl.style.display = 'block';
        }
      }
    } else if (titleEl) {
      titleEl.textContent = c.name;
      titleEl.style.display = 'block';
    }

    const games = getSortedInteriorGames(c.id);
    if (countEl) {
      countEl.textContent = `${games.length} Juego${games.length !== 1 ? 's' : ''}`;
    }

    if (games.length === 0) {
      const track = document.getElementById('gamesCartridgeRingTrack');
      if (track) {
        track.innerHTML = `
          <div style="padding: 24px; text-align: center; color: #64748b; font-size: 15px; font-weight: 700; background: rgba(255,255,255,0.7); border-radius: 20px;">
            Sin juegos disponibles para ${c.name}
          </div>`;
      }
      const showTitle = document.getElementById('showcaseGameTitle');
      const showDesc = document.getElementById('showcaseGameDescription');
      const showCounter = document.getElementById('showcaseCounterChip');
      const showGenre = document.getElementById('showcaseGenreChip');
      const showYear = document.getElementById('showcaseYearChip');
      if (showTitle) showTitle.textContent = 'Sin juegos';
      if (showDesc) showDesc.textContent = `Aún no se han añadido ROMs para ${c.name}.`;
      if (showCounter) showCounter.textContent = '0 de 0';
      if (showGenre) showGenre.textContent = c.name;
      if (showYear) showYear.textContent = c.era || '';

      const grid = document.getElementById('interiorGamesGridLayout');
      if (grid) grid.innerHTML = '<div style="grid-column: 1/-1; padding: 32px; text-align: center; color: #64748b; font-weight: 600;">No hay juegos disponibles para esta consola.</div>';
      const list = document.getElementById('interiorGamesListLayout');
      if (list) list.innerHTML = '<div style="padding: 32px; text-align: center; color: #64748b; font-weight: 600;">No hay juegos disponibles para esta consola.</div>';
      return;
    }

    if (activeGameIndex >= games.length) {
      activeGameIndex = 0;
    }

    // 1. RENDERIZADO DEL ANILLO 3D DE CARTUCHOS
    renderCartridgeRingView(games, c);

    // 2. RENDERIZADO DE LA VISTA MOSAICO (GRID)
    renderInteriorGridView(games, c);

    // 3. RENDERIZADO DE LA VISTA LISTA
    renderInteriorListView(games, c);
  };

  function renderCartridgeRingView(games, c) {
    const track = document.getElementById('gamesCartridgeRingTrack');
    if (!track) return;

    const total = games.length;
    const needsBuild =
      track.children.length !== total || track.dataset.consoleId !== c.id;

    if (needsBuild) {
      track.innerHTML = '';
      track.dataset.consoleId = c.id;

      games.forEach((g, idx) => {
        const node = document.createElement('div');
        node.className = 'cart-ring-node';
        node.id = `cart-ring-node-${idx}`;
        node.dataset.gameIdx = String(idx);

        const coverSrc = g.cover || `assets/consoles/${c.img}`;
        const defaultCart = getDefaultCartridgeForConsole(c.id);
        const isN64 = c.id === 'n64';

        let initialFrontSrc = defaultCart;
        if (isN64) {
          if (n64CartCache[coverSrc]) {
            initialFrontSrc = n64CartCache[coverSrc];
          } else if (g.cartridge && g.cartridge.includes('cart_')) {
            initialFrontSrc = g.cartridge;
          } else {
            initialFrontSrc = 'ROMS/cartridges/cart_papermario.png';
          }
        } else {
          initialFrontSrc = g.cartridge || defaultCart;
        }

        const backSrc = isN64 ? 'ROMS/cartridges/n64_shell_back.png' : initialFrontSrc;

        // Cartucho limpio transparente sin bloques ni fondos rectangulares detrás
        node.innerHTML = `
          <div class="cartridge-3d-rig" id="cart-rig-${idx}">
            <img src="${initialFrontSrc}" class="showcase-cartridge-img face-front" id="cart-front-${idx}" alt="${g.title}" onerror="this.src='ROMS/cartridges/n64_shell_base.png'">
            <img src="${backSrc}" class="showcase-cartridge-img face-back" alt="Reverso" onerror="this.src='ROMS/cartridges/n64_shell_base.png'">
            <div class="cartridge-3d-shine"></div>
            <div class="cartridge-3d-glare" id="cart-glare-${idx}"></div>
          </div>
          <div class="cartridge-3d-shadow"></div>
        `;

        if (isN64 && !n64CartCache[coverSrc]) {
          renderN64CartridgeWithBase(coverSrc, (dataUrl) => {
            const frontImg = document.getElementById(`cart-front-${idx}`);
            if (frontImg) frontImg.src = dataUrl;
          });
        }

        setupCartridgeNodeTilt(node, idx);

        node.addEventListener('click', () => {
          if (activeGameIndex === idx) {
            playSelectedGame(g, c);
          } else {
            activeGameIndex = idx;
            if (window.n3dsAudio) window.n3dsAudio.play('move');
            window.renderConsoleInteriorView();
          }
        });

        track.appendChild(node);
      });
    }

    // Actualizar las posiciones 3D para una transición suave en arco sin recrear DOM
    games.forEach((g, idx) => {
      let diff = idx - activeGameIndex;
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;

      let posStr = 'hidden';
      if (diff === 0) posStr = '0';
      else if (diff === -1) posStr = '-1';
      else if (diff === 1) posStr = '1';
      else if (diff === -2) posStr = '-2';
      else if (diff === 2) posStr = '2';

      const node = track.children[idx];
      if (node) {
        node.className = `cart-ring-node ${diff === 0 ? 'active-center' : ''}`;
        node.dataset.cartPos = posStr;
        const rig = document.getElementById(`cart-rig-${idx}`);
        if (rig && diff !== 0) {
          rig.style.transform = '';
        }
      }
    });

    // Actualizar Información del Juego Hero Central
    const activeGame = games[activeGameIndex];
    if (activeGame) {
      const genreChip = document.getElementById('showcaseGenreChip');
      const yearChip = document.getElementById('showcaseYearChip');
      const counterChip = document.getElementById('showcaseCounterChip');
      const titleEl = document.getElementById('showcaseGameTitle');
      const descEl = document.getElementById('showcaseGameDescription');
      const playBtn = document.getElementById('btnShowcasePlayNow');

      if (genreChip) genreChip.textContent = activeGame.genre || 'Aventura';
      if (yearChip) yearChip.textContent = activeGame.year || '';
      if (counterChip) counterChip.textContent = `${activeGameIndex + 1} de ${games.length}`;
      if (titleEl) titleEl.textContent = activeGame.title;
      if (descEl) descEl.textContent = getGameRichDescription(activeGame, c);
      if (playBtn) {
        playBtn.onclick = () => playSelectedGame(activeGame, c);
      }
    }
  }

  function renderInteriorGridView(games, c) {
    const grid = document.getElementById('interiorGamesGridLayout');
    if (!grid) return;
    grid.innerHTML = '';

    games.forEach((g, idx) => {
      const card = document.createElement('div');
      card.className = `interior-grid-card ${idx === activeGameIndex ? 'active' : ''}`;
      const coverSrc = g.cover || `assets/consoles/${c.img}`;

      card.innerHTML = `
        <div class="grid-card-cover-wrap">
          <img src="${coverSrc}" id="grid-cover-${idx}" class="grid-card-cover-img" alt="${g.title}" onerror="this.src='assets/consoles/${c.img}'">
        </div>
        <div class="grid-card-title" title="${g.title}">${g.title}</div>
        <div class="grid-card-meta">${g.genre || 'Clásico'} • ${g.year || ''}</div>
        <button class="grid-card-play-btn">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          <span>Jugar</span>
        </button>
      `;

      card.addEventListener('click', () => {
        activeGameIndex = idx;
        playSelectedGame(g, c);
      });

      grid.appendChild(card);
    });
  }

  function renderInteriorListView(games, c) {
    const list = document.getElementById('interiorGamesListLayout');
    if (!list) return;
    list.innerHTML = '';

    games.forEach((g, idx) => {
      const row = document.createElement('div');
      row.className = `interior-list-row ${idx === activeGameIndex ? 'active' : ''}`;
      const coverSrc = g.cover || `assets/consoles/${c.img}`;

      row.innerHTML = `
        <img src="${coverSrc}" id="list-cover-${idx}" class="list-row-cover-thumb" alt="${g.title}" onerror="this.src='assets/consoles/${c.img}'">
        <div class="list-row-info">
          <div class="list-row-title">${g.title}</div>
          <div class="list-row-meta">${g.genre || 'Clásico'} • ${g.year || ''}</div>
        </div>
        <button class="list-row-play-btn">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          <span>Jugar</span>
        </button>
      `;

      row.addEventListener('click', () => {
        activeGameIndex = idx;
        playSelectedGame(g, c);
      });

      list.appendChild(row);
    });
  }

  /* ==========================================================================
     4. PEQUEÑO VÍDEO A MODO DE TRAILER (SIN ETIQUETAS SOBREEXPLICATIVAS)
     ========================================================================== */
  function setupGameTrailerPlayer(game, consoleObj) {
    const videoEl = document.getElementById('showcaseTrailerVideo');
    const canvasEl = document.getElementById('showcaseTrailerCanvas');
    if (!videoEl || !canvasEl) return;

    stopTrailerPreviewLoop();

    const trailerUrl = getGameTrailerPath(game);

    if (trailerUrl) {
      videoEl.src = trailerUrl;
      videoEl.muted = true;
      videoEl.playsInline = true;
      videoEl.loop = true;

      videoEl.onloadeddata = () => {
        stopTrailerPreviewLoop();
        canvasEl.style.display = 'none';
        videoEl.style.display = 'block';
        videoEl.play().catch(() => {});
      };

      videoEl.onerror = () => {
        videoEl.style.display = 'none';
        canvasEl.style.display = 'block';
        startTrailerCanvasPreview(game, consoleObj, canvasEl);
      };
    } else {
      videoEl.style.display = 'none';
      canvasEl.style.display = 'block';
      startTrailerCanvasPreview(game, consoleObj, canvasEl);
    }
  }

  function stopTrailerPreviewLoop() {
    if (trailerAnimFrame) {
      cancelAnimationFrame(trailerAnimFrame);
      trailerAnimFrame = null;
    }
    const videoEl = document.getElementById('showcaseTrailerVideo');
    if (videoEl) {
      try {
        videoEl.pause();
      } catch (e) {}
    }
  }

  function startTrailerCanvasPreview(game, consoleObj, canvas) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 480;
    canvas.height = 260;

    const wpList =
      typeof CONSOLE_GAME_WALLPAPERS !== 'undefined' && CONSOLE_GAME_WALLPAPERS[consoleObj.id]
        ? CONSOLE_GAME_WALLPAPERS[consoleObj.id]
        : [];
    const bgUrl = wpList[0]?.url || (game && game.cover) || `assets/consoles_hires/${consoleObj.img}`;
    const coverUrl = game && game.cover ? game.cover : `assets/consoles_hires/${consoleObj.img}`;

    trailerSecondaryImg = new Image();
    trailerSecondaryImg.src = bgUrl;

    trailerPosterImg = new Image();
    trailerPosterImg.src = coverUrl;

    let t = 0;
    function renderFrame() {
      t += 0.012;
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      if (trailerSecondaryImg && trailerSecondaryImg.complete && trailerSecondaryImg.naturalWidth > 0) {
        ctx.save();
        const scale = 1.15 + Math.sin(t * 0.6) * 0.05;
        const offsetX = Math.cos(t * 0.45) * 18;
        const offsetY = Math.sin(t * 0.35) * 10;
        ctx.translate(w / 2 + offsetX, h / 2 + offsetY);
        ctx.scale(scale, scale);
        ctx.globalAlpha = 0.72;
        ctx.drawImage(trailerSecondaryImg, -w / 2, -h / 2, w, h);
        ctx.restore();
      }

      const vig = ctx.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, w * 0.65);
      vig.addColorStop(0, 'rgba(15, 23, 42, 0.04)');
      vig.addColorStop(1, 'rgba(15, 23, 42, 0.68)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);

      if (trailerPosterImg && trailerPosterImg.complete && trailerPosterImg.naturalWidth > 0) {
        ctx.save();
        const targetH = 152;
        const ratio = trailerPosterImg.naturalWidth / Math.max(1, trailerPosterImg.naturalHeight);
        const targetW = Math.min(260, targetH * ratio);
        const x = (w - targetW) / 2;
        const y = (h - targetH) / 2 + Math.sin(t * 1.2) * 3;

        ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
        ctx.shadowBlur = 22;
        ctx.drawImage(trailerPosterImg, x, y, targetW, targetH);
        ctx.restore();
      }

      trailerAnimFrame = requestAnimationFrame(renderFrame);
    }

    renderFrame();
  }

  /* ==========================================================================
     5. LANZAR JUEGO SELECCIONADO Y CONTROL DE AUDIO
     ========================================================================== */
  function playSelectedGame(game, consoleObj) {
    if (!game) return;
    game.lastPlayed = Date.now();
    if (typeof handleGameClick === 'function') {
      handleGameClick(game, consoleObj, activeGameIndex);
    }
  }

  window.handlePrimaryFooterAction = function () {
    if (window.isConsoleInteriorOpen) {
      const curIdx = getActiveConsoleIdx();
      const c = CONSOLES[curIdx];
      const games = typeof getGamesForConsole === 'function' ? getGamesForConsole(c.id) : [];
      if (games[activeGameIndex]) {
        playSelectedGame(games[activeGameIndex], c);
      }
    } else {
      window.enterSelectedConsole();
    }
  };

  window.toggleTopBarAudioMute = function () {
    if (typeof RetroConsoleMusic === 'undefined') return;
    const isMuted = RetroConsoleMusic.toggleMute();
    updateAudioPillStatus(isMuted);
  };

  function updateAudioPillStatus() {
    const pill = document.getElementById('topAudioPill');
    const label = document.getElementById('topAudioPillText');
    if (!pill || !label || typeof RetroConsoleMusic === 'undefined') return;

    const curIdx = getActiveConsoleIdx();
    const c = typeof CONSOLES !== 'undefined' ? CONSOLES[curIdx] : null;
    const isMuted = RetroConsoleMusic.isMuted;
    pill.classList.toggle('muted', isMuted);

    if (isMuted) {
      label.textContent = 'Audio Silenciado';
    } else if (c) {
      label.textContent = `Audio • ${c.id.toUpperCase()}`;
    } else {
      label.textContent = 'Audio MP3';
    }
  }

  function initCartridge3DInteractiveTilt() {
    const stage = document.getElementById('showcaseCartridgeStage');
    const rig = document.getElementById('showcaseCartridgeRig');
    const glare = document.getElementById('cartridge3DGlare');
    if (!stage || !rig) return;

    let isHovered = false;

    stage.addEventListener('mouseenter', () => {
      isHovered = true;
      if (glare) glare.style.opacity = '0.65';
    });

    stage.addEventListener('mousemove', (e) => {
      if (!isHovered) return;
      const rect = stage.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1

      const rotY = -16 + nx * 24;
      const rotX = 7 - ny * 18;
      const lift = -ny * 10;

      rig.style.transform = `translateY(${lift}px) rotateY(${rotY}deg) rotateX(${rotX}deg)`;

      if (glare) {
        const gx = nx * 50;
        const gy = ny * 40;
        glare.style.transform = `translate(${gx}px, ${gy}px) translateZ(14px)`;
      }
    });

    stage.addEventListener('mouseleave', () => {
      isHovered = false;
      rig.style.transform = '';
      if (glare) glare.style.opacity = '0';
    });
  }

  function initCartridgeRingViewportTilt() {
    const viewport = document.querySelector('.games-cartridge-ring-viewport');
    const track = document.getElementById('gamesCartridgeRingTrack');
    if (!viewport || !track) return;

    let isHovered = false;

    viewport.addEventListener('mouseenter', () => {
      isHovered = true;
    });

    viewport.addEventListener('mousemove', (e) => {
      if (!isHovered) return;
      const rect = viewport.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1

      // Rotación e inclinación tridimensional reactiva del carrusel en anillo
      track.style.transform = `rotateY(${nx * 10}deg) rotateX(${-ny * 8}deg)`;

      // Iluminación dinámica y relieve en el cartucho central activo
      const centerRig = document.querySelector('.cart-ring-node[data-cart-pos="0"] .cartridge-3d-rig');
      const centerGlare = document.querySelector('.cart-ring-node[data-cart-pos="0"] .cartridge-3d-glare');
      if (centerRig) {
        centerRig.style.transform = `translate3d(0, ${-ny * 10}px, 20px) rotateY(${nx * 16}deg) rotateX(${-ny * 14}deg) scale(1.04)`;
      }
      if (centerGlare) {
        centerGlare.style.opacity = '0.55';
        centerGlare.style.transform = `translate(${nx * 60}px, ${ny * 40}px) translateZ(14px)`;
      }
    });

    viewport.addEventListener('mouseleave', () => {
      isHovered = false;
      track.style.transform = '';
      const centerRig = document.querySelector('.cart-ring-node[data-cart-pos="0"] .cartridge-3d-rig');
      const centerGlare = document.querySelector('.cart-ring-node[data-cart-pos="0"] .cartridge-3d-glare');
      if (centerRig) centerRig.style.transform = '';
      if (centerGlare) {
        centerGlare.style.opacity = '0';
        centerGlare.style.transform = '';
      }
    });
  }

  // El anillo de consolas se mantiene perfectamente estático y nítido sin animación de ratón
  function initConsoleRingArenaTilt() {
    // Desactivado: el usuario prefiere que el anillo de consolas no reaccione al ratón
  }

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      try {
        const params = new URLSearchParams(window.location.search);
        const autoConsole = params.get('console');
        if (autoConsole && Array.isArray(CONSOLES)) {
          const foundIdx = CONSOLES.findIndex((c) => c.id === autoConsole);
          if (foundIdx >= 0) {
            window.activeConsoleIndex = foundIdx;
            if (typeof updateFocusedConsole === 'function') {
              updateFocusedConsole(foundIdx, false);
            }
            window.enterSelectedConsole();
            return;
          }
        }
      } catch (e) {}

      window.renderConsoleRing3D();
      initCartridge3DInteractiveTilt();
      initCartridgeRingViewportTilt();
    }, 60);
  });
})();
