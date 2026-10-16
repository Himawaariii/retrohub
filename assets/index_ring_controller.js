/**
 * RetroHub • Controlador Minimalista y Estilizado del Anillo 3D y Selector de Juegos
 * - Vista 1: Anillo 3D de Consolas flotantes con título, breve descripción y flechas laterales.
 * - Vista 2: Lista estilizada hacia abajo a la izquierda | Cartucho + Descripción + Pequeño Vídeo Trailer a la derecha.
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
  let customUploadedTrailers = {};

  function getGameRichDescription(game, consoleObj) {
    if (!game) return consoleObj ? consoleObj.synopsis : '';
    if (game.description) return game.description;
    const lowerTitle = (game.title || '').toLowerCase();
    for (const key of Object.keys(GAME_DESCRIPTIONS)) {
      if (lowerTitle.includes(key)) {
        return GAME_DESCRIPTIONS[key];
      }
    }
    return `Edición original para ${consoleObj ? consoleObj.name : 'consola retro'} (${game.genre || 'Aventura'} • ${game.year || consoleObj?.era || 'Clásico'}). Ejecución directa con soporte para guardado rápido SRAM y controles configurables.`;
  }

  function getGameTrailerPath(game) {
    if (!game) return '';
    if (customUploadedTrailers[game.title]) return customUploadedTrailers[game.title];
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

    // Mostrar 5 consolas bien espaciadas en el anillo (-2, -1, 0, 1, 2)
    Array.from(track.children).forEach((node, idx) => {
      const offset = getCircularOffset(idx, activeConsoleIndex, total);
      if (Math.abs(offset) <= 2) {
        node.setAttribute('data-ring-pos', String(offset));
      } else {
        node.setAttribute('data-ring-pos', 'hidden');
      }
    });

    // Actualizar textos minimalistas bajo la consola central
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

    // Actualizar puntos minimalistas
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
     3. RENDERIZADO DE LA VISTA INTERIOR ESTILIZADA
     ========================================================================== */
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

    const countBadge = document.getElementById('interiorGamesCountBadge');
    if (countBadge) {
      countBadge.textContent = `${filteredGames.length}`;
    }

    const listEl = document.getElementById('interiorGamesVerticalList');
    if (!listEl) return;
    listEl.innerHTML = '';

    if (filteredGames.length === 0) {
      listEl.innerHTML = `
        <div style="padding: 28px 18px; border-radius: 22px; background: rgba(255,255,255,0.62); border: 1px solid rgba(255,255,255,0.85); text-align: center; color: #64748b; display: flex; flex-direction: column; align-items: center; gap: 10px;">
          <div style="font-family: 'Space Grotesk', sans-serif; font-size: 15px; font-weight: 800; color: #0f172a;">
            Sin juegos en ${c.name}
          </div>
          <p style="font-size: 12.5px; line-height: 1.45; margin: 0;">
            Añade archivos en <code>ROMS/${c.id}/</code> o selecciona una ROM local.
          </p>
          <button class="btn-interior-action" onclick="document.getElementById('quickInteriorRomInput').click()" style="margin-top: 4px;">
            <span>Añadir ROM</span>
          </button>
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

      const coverSrc = g.cover || `assets/consoles/${c.img}`;

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

  function renderInteriorGameDetail(game, consoleObj) {
    const cartImg = document.getElementById('showcaseCartridgeImg');
    const sysChip = document.getElementById('showcaseSystemChip');
    const genreChip = document.getElementById('showcaseGenreChip');
    const yearChip = document.getElementById('showcaseYearChip');
    const titleEl = document.getElementById('showcaseGameTitle');
    const descEl = document.getElementById('showcaseGameDescription');
    const playBtn = document.getElementById('btnShowcasePlayNow');
    const trailerCaption = document.getElementById('trailerCaptionText');

    if (!game) {
      if (cartImg) cartImg.src = getDefaultCartridgeForConsole(consoleObj.id);
      if (sysChip) sysChip.textContent = consoleObj.name;
      if (genreChip) genreChip.textContent = consoleObj.maker || 'Retro';
      if (yearChip) yearChip.textContent = consoleObj.arch || '';
      if (titleEl) titleEl.textContent = consoleObj.name;
      if (descEl) descEl.textContent = consoleObj.synopsis;
      if (playBtn) {
        playBtn.onclick = () => document.getElementById('quickInteriorRomInput').click();
        const spanEl = playBtn.querySelector('span');
        if (spanEl) spanEl.textContent = 'Añadir ROM';
      }
      if (trailerCaption) {
        trailerCaption.textContent = `Coloca un vídeo MP4 en ROMS/trailers/ para previsualizar.`;
      }
      setupGameTrailerPlayer(null, consoleObj);
      return;
    }

    const cartSrc = game.cartridge || getDefaultCartridgeForConsole(consoleObj.id);

    if (cartImg) {
      cartImg.src = cartSrc;
      cartImg.onerror = () => {
        cartImg.src = getDefaultCartridgeForConsole(consoleObj.id);
      };
    }
    if (sysChip) sysChip.textContent = consoleObj.name;
    if (genreChip) genreChip.textContent = game.genre || 'Aventura';
    if (yearChip) yearChip.textContent = game.year || '';
    if (titleEl) titleEl.textContent = game.title;
    if (descEl) descEl.textContent = getGameRichDescription(game, consoleObj);

    if (playBtn) {
      playBtn.onclick = () => playSelectedGame(game, consoleObj);
      const spanEl = playBtn.querySelector('span');
      if (spanEl) spanEl.textContent = 'Jugar';
    }
    if (trailerCaption) {
      trailerCaption.textContent = `${game.title} (${consoleObj.name})`;
    }

    setupGameTrailerPlayer(game, consoleObj);
  }

  /* ==========================================================================
     4. REPRODUCTOR DE PEQUEÑO VÍDEO TRAILER (MP4 REAL + PREVIEW CINEMÁTICO LIMPIO)
     ========================================================================== */
  function setupGameTrailerPlayer(game, consoleObj) {
    const videoEl = document.getElementById('showcaseTrailerVideo');
    const canvasEl = document.getElementById('showcaseTrailerCanvas');
    const statusPill = document.getElementById('trailerLiveStatusText');
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
        if (statusPill) statusPill.textContent = 'TRAILER MP4';
        videoEl.play().catch(() => {});
      };

      videoEl.onerror = () => {
        videoEl.style.display = 'none';
        canvasEl.style.display = 'block';
        if (statusPill) statusPill.textContent = 'TRAILER';
        startTrailerCanvasPreview(game, consoleObj, canvasEl);
      };
    } else {
      videoEl.style.display = 'none';
      canvasEl.style.display = 'block';
      if (statusPill) statusPill.textContent = 'TRAILER';
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
    canvas.height = 248;

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

      // Paneo cinematográfico suave (Ken Burns) sin barras ni texto superpuesto
      if (trailerSecondaryImg && trailerSecondaryImg.complete && trailerSecondaryImg.naturalWidth > 0) {
        ctx.save();
        const scale = 1.14 + Math.sin(t * 0.6) * 0.05;
        const offsetX = Math.cos(t * 0.45) * 18;
        const offsetY = Math.sin(t * 0.35) * 10;
        ctx.translate(w / 2 + offsetX, h / 2 + offsetY);
        ctx.scale(scale, scale);
        ctx.globalAlpha = 0.65;
        ctx.drawImage(trailerSecondaryImg, -w / 2, -h / 2, w, h);
        ctx.restore();
      }

      // Viñeta oscura elegante
      const vig = ctx.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, w * 0.65);
      vig.addColorStop(0, 'rgba(15, 23, 42, 0.05)');
      vig.addColorStop(1, 'rgba(15, 23, 42, 0.72)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);

      // Arte central limpio con levitación sutil
      if (trailerPosterImg && trailerPosterImg.complete && trailerPosterImg.naturalWidth > 0) {
        ctx.save();
        const targetH = 148;
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

  window.handleCustomTrailerUpload = function (event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const c = CONSOLES[activeConsoleIndex];
    const games = typeof getGamesForConsole === 'function' ? getGamesForConsole(c.id) : [];
    const currentGame = games[activeGameIndex];
    const blobUrl = URL.createObjectURL(file);

    if (currentGame) {
      customUploadedTrailers[currentGame.title] = blobUrl;
    }

    setupGameTrailerPlayer(currentGame || { title: c.name, trailer: blobUrl }, c);
  };

  /* ==========================================================================
     5. LANZAR JUEGO SELECCIONADO Y NAVEGACIÓN DE TECLADO
     ========================================================================== */
  function playSelectedGame(game, consoleObj) {
    if (!game) return;
    if (typeof handleGameClick === 'function') {
      handleGameClick(game, consoleObj, activeGameIndex);
    }
  }

  window.handleInteriorSearch = function (event) {
    interiorSearchQuery = (event.target.value || '').trim().toLowerCase();
    activeGameIndex = 0;
    window.renderConsoleInteriorView();
  };

  window.handlePrimaryFooterAction = function () {
    if (window.isConsoleInteriorOpen) {
      const c = CONSOLES[activeConsoleIndex];
      const games = typeof getGamesForConsole === 'function' ? getGamesForConsole(c.id) : [];
      if (games[activeGameIndex]) {
        playSelectedGame(games[activeGameIndex], c);
      } else {
        document.getElementById('quickInteriorRomInput')?.click();
      }
    } else {
      window.enterSelectedConsole();
    }
  };

  /* ==========================================================================
     6. CONTROL DEL BOTÓN DE AUDIO MP3 EN LA BARRA SUPERIOR
     ========================================================================== */
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

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      window.renderConsoleRing3D();
    }, 60);
  });
})();
