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

  /* ==========================================================================
     1. RENDERIZADO DEL ANILLO 3D DE CONSOLAS (VISTA 1)
     ========================================================================== */
  window.renderConsoleRing3D = function () {
    const track = document.getElementById('ringConsolesTrack');
    const dotsWrap = document.getElementById('ringPaginationDots');
    if (!track || typeof CONSOLES === 'undefined') return;

    const total = CONSOLES.length;

    if (track.children.length !== total) {
      track.innerHTML = '';
      CONSOLES.forEach((c, idx) => {
        const node = document.createElement('div');
        node.className = 'ring-console-node';
        node.id = `ring-node-${c.id}`;
        node.dataset.index = String(idx);

        node.innerHTML = `
          <div class="ring-node-hardware-card">
            <img src="assets/consoles_hires/${c.img}" class="ring-node-img" alt="${c.name}" onerror="this.src='assets/consoles/${c.img}'">
            <span class="ring-node-label-pill">${c.name}</span>
          </div>
        `;

        node.addEventListener('click', (e) => {
          e.stopPropagation();
          if (idx === activeConsoleIndex) {
            window.enterSelectedConsole();
          } else {
            const diff = getCircularOffset(idx, activeConsoleIndex, total);
            updateFocusedConsole(idx, true, diff > 0 ? 'right' : 'left');
          }
        });

        track.appendChild(node);
      });
    }

    Array.from(track.children).forEach((node, idx) => {
      const offset = getCircularOffset(idx, activeConsoleIndex, total);
      if (Math.abs(offset) <= 2) {
        node.setAttribute('data-ring-pos', String(offset));
      } else {
        node.setAttribute('data-ring-pos', 'hidden');
      }
    });

    const activeConsole = CONSOLES[activeConsoleIndex];
    if (activeConsole) {
      const games = typeof getGamesForConsole === 'function' ? getGamesForConsole(activeConsole.id) : [];
      const makerEl = document.getElementById('ringMakerPill');
      const eraEl = document.getElementById('ringEraPill');
      const romsEl = document.getElementById('ringRomsPill');
      const titleEl = document.getElementById('ringConsoleTitle');
      const descEl = document.getElementById('ringConsoleDesc');

      if (makerEl) makerEl.textContent = activeConsole.maker || 'Retro';
      const yearMatch = (activeConsole.era || '').match(/\b(19\d\d|20\d\d)\b/);
      if (eraEl) eraEl.textContent = yearMatch ? yearMatch[1] : activeConsole.arch || '';
      if (romsEl) {
        romsEl.textContent = `${games.length} ${games.length === 1 ? 'Juego' : 'Juegos'}`;
      }
      if (titleEl) titleEl.textContent = activeConsole.name;
      if (descEl) descEl.textContent = activeConsole.synopsis || '';
    }

    if (dotsWrap) {
      if (dotsWrap.children.length !== total) {
        dotsWrap.innerHTML = '';
        CONSOLES.forEach((c, i) => {
          const dot = document.createElement('span');
          dot.className = `ring-page-dot ${i === activeConsoleIndex ? 'active' : ''}`;
          dot.title = c.name;
          dot.onclick = () => updateFocusedConsole(i, true, i > activeConsoleIndex ? 'right' : 'left');
          dotsWrap.appendChild(dot);
        });
      } else {
        Array.from(dotsWrap.children).forEach((dot, i) => {
          dot.classList.toggle('active', i === activeConsoleIndex);
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
  function triggerCartridge3DSpin() {
    const rig = document.getElementById('showcaseCartridgeRig');
    if (!rig) return;
    rig.classList.remove('spin-on-select');
    // Forzar reflow para reiniciar la animación 3D de giro en cada selección
    void rig.offsetWidth;
    rig.classList.add('spin-on-select');
  }

  window.renderConsoleInteriorView = function () {
    const c = CONSOLES[activeConsoleIndex];
    if (!c) return;

    const thumbEl = document.getElementById('interiorConsoleThumb');
    const titleEl = document.getElementById('interiorConsoleTitle');

    if (thumbEl) {
      thumbEl.src = `assets/consoles_hires/${c.img}`;
      thumbEl.onerror = () => {
        thumbEl.src = `assets/consoles/${c.img}`;
      };
    }
    if (titleEl) titleEl.textContent = c.name;

    const allGames = typeof getGamesForConsole === 'function' ? getGamesForConsole(c.id) : [];
    const filteredGames = interiorSearchQuery
      ? allGames.filter(
          (g) =>
            (g.title && g.title.toLowerCase().includes(interiorSearchQuery)) ||
            (g.genre && g.genre.toLowerCase().includes(interiorSearchQuery))
        )
      : allGames;

    const listEl = document.getElementById('interiorGamesVerticalList');
    if (!listEl) return;
    listEl.innerHTML = '';

    if (filteredGames.length === 0) {
      listEl.innerHTML = `
        <div style="padding: 24px 18px; border-radius: 20px; background: rgba(255,255,255,0.58); border: 1px solid rgba(255,255,255,0.82); text-align: center; color: #64748b; font-size: 13.5px; font-weight: 600;">
          Sin juegos disponibles en ${c.name}
        </div>
      `;
      renderInteriorGameDetail(null, c);
      return;
    }

    if (activeGameIndex >= filteredGames.length) {
      activeGameIndex = 0;
    }

    filteredGames.forEach((g, idx) => {
      const isActive = idx === activeGameIndex;
      const row = document.createElement('div');
      row.className = `interior-game-row ${isActive ? 'active' : ''}`;
      row.id = `interior-game-row-${idx}`;

      const rawCover = g.cover || `assets/consoles/${c.img}`;
      const coverSrc = rawCover.includes('papermario') ? `${rawCover}?v=2` : rawCover;

      row.innerHTML = `
        <img src="${coverSrc}" class="game-row-thumb" alt="${g.title}" onerror="this.src='assets/consoles/${c.img}'">
        <div class="game-row-info">
          <div class="game-row-title">${g.title}</div>
          <div class="game-row-meta">${g.genre || 'Clásico'} • ${g.year || ''}</div>
        </div>
        <div class="game-row-arrow">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      `;

      row.addEventListener('click', () => {
        if (activeGameIndex === idx) {
          playSelectedGame(g, c);
        } else {
          activeGameIndex = idx;
          if (window.n3dsAudio) window.n3dsAudio.play('move');
          window.renderConsoleInteriorView();
        }
      });

      listEl.appendChild(row);
    });

    const activeRowEl = document.getElementById(`interior-game-row-${activeGameIndex}`);
    if (activeRowEl) {
      activeRowEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    renderInteriorGameDetail(filteredGames[activeGameIndex], c);
  };

  // Compositor dinámico de cartuchos N64 usando n64_shell_base.png como carcasa base
  const n64CartCache = {};
  let n64ShellBaseImg = null;

  function renderN64CartridgeWithBase(artUrl, targetImgEl) {
    if (!targetImgEl || !artUrl) return;
    if (n64CartCache[artUrl]) {
      targetImgEl.src = n64CartCache[artUrl];
      return;
    }

    const ensureShell = (cb) => {
      if (n64ShellBaseImg && n64ShellBaseImg.complete && n64ShellBaseImg.naturalWidth > 0) {
        cb(n64ShellBaseImg);
      } else {
        n64ShellBaseImg = new Image();
        n64ShellBaseImg.crossOrigin = 'anonymous';
        n64ShellBaseImg.onload = () => cb(n64ShellBaseImg);
        n64ShellBaseImg.src = 'ROMS/cartridges/n64_shell_base.png?v=2';
      }
    };

    ensureShell((shellImg) => {
      const artImg = new Image();
      artImg.crossOrigin = 'anonymous';
      artImg.onload = () => {
        const w = shellImg.naturalWidth || 599;
        const h = shellImg.naturalHeight || 416;
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');

        // Coordenadas exactas de la ventana central del cartucho N64
        const winX = 160;
        const winY = 56;
        const winW = 285;
        const winH = 326;

        const scale = Math.max(winW / artImg.naturalWidth, winH / artImg.naturalHeight);
        const drawW = artImg.naturalWidth * scale;
        const drawH = artImg.naturalHeight * scale;
        const drawX = winX + (winW - drawW) / 2;
        const drawY = winY + (winH - drawH) / 2;

        ctx.save();
        ctx.beginPath();
        ctx.rect(winX, winY, winW, winH);
        ctx.clip();
        ctx.drawImage(artImg, drawX, drawY, drawW, drawH);
        ctx.restore();

        // Superponer la carcasa N64 original encima
        ctx.drawImage(shellImg, 0, 0, w, h);

        try {
          const dataUrl = canvas.toDataURL('image/png');
          n64CartCache[artUrl] = dataUrl;
          targetImgEl.src = dataUrl;
        } catch (e) {}
      };
      artImg.src = artUrl;
    });
  }

  function renderInteriorGameDetail(game, consoleObj) {
    const cartImg = document.getElementById('showcaseCartridgeImg');
    const cartImgBack = document.getElementById('showcaseCartridgeImgBack');
    const genreChip = document.getElementById('showcaseGenreChip');
    const yearChip = document.getElementById('showcaseYearChip');
    const titleEl = document.getElementById('showcaseGameTitle');
    const descEl = document.getElementById('showcaseGameDescription');
    const playBtn = document.getElementById('btnShowcasePlayNow');

    triggerCartridge3DSpin();

    if (!game) {
      const fallbackCart =
        consoleObj.id === 'n64'
          ? 'ROMS/cartridges/n64_shell_base.png?v=2'
          : getDefaultCartridgeForConsole(consoleObj.id);
      if (cartImg) cartImg.src = fallbackCart;
      if (cartImgBack) {
        cartImgBack.src =
          consoleObj.id === 'n64' ? 'ROMS/cartridges/n64_shell_back.png?v=2' : fallbackCart;
      }
      if (genreChip) genreChip.textContent = consoleObj.maker || 'Retro';
      if (yearChip) yearChip.textContent = consoleObj.arch || '';
      if (titleEl) titleEl.textContent = consoleObj.name;
      if (descEl) descEl.textContent = consoleObj.synopsis;
      if (playBtn) {
        playBtn.style.display = 'none';
      }
      setupGameTrailerPlayer(null, consoleObj);
      return;
    }

    if (playBtn) {
      playBtn.style.display = 'inline-flex';
      playBtn.onclick = () => playSelectedGame(game, consoleObj);
    }

    if (consoleObj.id === 'n64') {
      const isPaperMario = (game.title || '').toLowerCase().includes('paper mario');
      if (isPaperMario) {
        if (cartImg) cartImg.src = 'ROMS/cartridges/cart_papermario.png?v=2';
      } else if (game.cover) {
        if (cartImg) cartImg.src = 'ROMS/cartridges/n64_shell_base.png?v=2';
        renderN64CartridgeWithBase(game.cover, cartImg);
      } else {
        if (cartImg) cartImg.src = 'ROMS/cartridges/n64_shell_base.png?v=2';
      }
      if (cartImgBack) {
        cartImgBack.src = 'ROMS/cartridges/n64_shell_back.png?v=2';
      }
    } else {
      const cartSrc = game.cartridge || getDefaultCartridgeForConsole(consoleObj.id);
      if (cartImg) {
        cartImg.src = cartSrc;
        cartImg.onerror = () => {
          cartImg.src = getDefaultCartridgeForConsole(consoleObj.id);
        };
      }
      if (cartImgBack) {
        cartImgBack.src = cartSrc;
        cartImgBack.onerror = () => {
          cartImgBack.src = getDefaultCartridgeForConsole(consoleObj.id);
        };
      }
    }

    if (genreChip) genreChip.textContent = game.genre || 'Aventura';
    if (yearChip) yearChip.textContent = game.year || '';
    if (titleEl) titleEl.textContent = game.title;
    if (descEl) descEl.textContent = getGameRichDescription(game, consoleObj);

    setupGameTrailerPlayer(game, consoleObj);
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
    if (typeof handleGameClick === 'function') {
      handleGameClick(game, consoleObj, activeGameIndex);
    }
  }

  window.handlePrimaryFooterAction = function () {
    if (window.isConsoleInteriorOpen) {
      const c = CONSOLES[activeConsoleIndex];
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

    const c = typeof CONSOLES !== 'undefined' ? CONSOLES[activeConsoleIndex] : null;
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

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      window.renderConsoleRing3D();
      initCartridge3DInteractiveTilt();
    }, 60);
  });
})();
