/**
 * RetroHub • Controlador del Anillo 3D de Consolas y Vista Interior Split
 * - Vista 1: Anillo 3D de Emuladores con consola central, descripción corta y flechas laterales.
 * - Vista 2: Interior de Consola con lista vertical de juegos a la izquierda y Cartucho + Descripción + Vídeo Trailer a la derecha.
 * REGLA INQUEBRANTABLE: CERO EMOJIS — 100% ICONOS VECTORIALES SVG COLORIDOS
 */
(function () {
  const GAME_DESCRIPTIONS = {
    'paper mario':
      'Una obra maestra del RPG en Nintendo 64 desarrollada por Intelligent Systems. Combina personajes planos estilo diorama de papel sobre escenarios tridimensionales vibrantes, combates por turnos con comandos de acción precisos y una aventura inolvidable por el Reino Champiñón para rescatar a los Siete Espíritus Estelares.',
    'anguna':
      'Aventura de acción y mazmorras de corte clásico estilo Zelda creada para Game Boy Advance por Nathan Tolbert. Explora tierras peligrosas, derrota monstruos en tiempo real, descubre artefactos ocultos en criptas subterráneas y escapa de las mazmorras de Demrav.',
    '3 weeks in paradise':
      'Adaptación portátil para Game Boy Advance del clásico de aventuras y puzles de Mikro-Gen. Rescata a la familia de Wally Week varada en una isla tropical resolviendo ingeniosos acertijos con objetos del entorno y esquivando peligros.',
    '31 in 1':
      'Cartucho compilatorio clásico de 8 bits para Nintendo Entertainment System que reúne 31 juegos arcade de acción, plataformas, disparos espaciales y deportes listos para partidas rápidas de salón recreativo.',
    '3 in 1':
      'Cartucho multijuego cooperativo y competitivo para Nintendo NES pensado para sesiones de dos jugadores en local, con clásicos de acción directa y puntuación arcade.'
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
    return `Edición original para ${consoleObj ? consoleObj.name : 'consola retro'} (${game.genre || 'Aventura'} • ${game.year || consoleObj?.era || 'Clásico'}). Ejecución directa en alta precisión con soporte para guardado rápido SRAM, controles configurables y pantalla completa.`;
  }

  function getGameTrailerPath(game, consoleObj) {
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

    // Crear nodos si aún no existen para que las transiciones CSS 3D sean fluidas
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

    // Actualizar posición en el anillo 3D para cada nodo
    Array.from(track.children).forEach((node, idx) => {
      const offset = getCircularOffset(idx, activeConsoleIndex, total);
      if (Math.abs(offset) <= 3) {
        node.setAttribute('data-ring-pos', String(offset));
      } else {
        node.setAttribute('data-ring-pos', 'hidden');
      }
    });

    // Actualizar tarjeta inferior de la consola activa
    const activeConsole = CONSOLES[activeConsoleIndex];
    if (activeConsole) {
      const games = typeof getGamesForConsole === 'function' ? getGamesForConsole(activeConsole.id) : [];
      const makerEl = document.getElementById('ringMakerPill');
      const eraEl = document.getElementById('ringEraPill');
      const romsEl = document.getElementById('ringRomsPill');
      const titleEl = document.getElementById('ringConsoleTitle');
      const descEl = document.getElementById('ringConsoleDesc');

      if (makerEl) makerEl.textContent = activeConsole.maker || 'Retro System';
      if (eraEl) eraEl.textContent = activeConsole.era || activeConsole.arch || '';
      if (romsEl) {
        romsEl.textContent =
          games.length > 0
            ? `${games.length} ${games.length === 1 ? 'Juego Instalado' : 'Juegos Instalados'}`
            : 'Catálogo Abierto (0 ROMs)';
      }
      if (titleEl) titleEl.textContent = activeConsole.name;
      if (descEl) descEl.textContent = activeConsole.synopsis || '';
    }

    // Actualizar puntos del anillo
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
    const searchInput = document.getElementById('interiorGameSearchInput');
    if (searchInput) searchInput.value = '';

    activeGameIndex = 0;
    window.renderConsoleInteriorView();
    updateBottomFooterPrompts();
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
    updateBottomFooterPrompts();
  };

  /* ==========================================================================
     3. RENDERIZADO DE LA VISTA INTERIOR (LISTA VERTICAL + CARTUCHO/DESC/TRAILER)
     ========================================================================== */
  window.renderConsoleInteriorView = function () {
    const c = CONSOLES[activeConsoleIndex];
    if (!c) return;

    // Cabecera de consola
    const thumbEl = document.getElementById('interiorConsoleThumb');
    const titleEl = document.getElementById('interiorConsoleTitle');
    const subEl = document.getElementById('interiorConsoleSub');

    if (thumbEl) {
      thumbEl.src = `assets/consoles_hires/${c.img}`;
      thumbEl.onerror = () => {
        thumbEl.src = `assets/consoles/${c.img}`;
      };
    }
    if (titleEl) titleEl.textContent = c.name;
    if (subEl) subEl.textContent = `${c.maker} • ${c.arch} • ${c.era}`;

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
      countBadge.textContent = `${filteredGames.length} ${filteredGames.length === 1 ? 'Juego' : 'Juegos'}`;
    }

    const listEl = document.getElementById('interiorGamesVerticalList');
    if (!listEl) return;
    listEl.innerHTML = '';

    if (filteredGames.length === 0) {
      listEl.innerHTML = `
        <div style="padding: 32px 18px; text-align: center; color: #64748b; display: flex; flex-direction: column; align-items: center; gap: 12px;">
          <div style="width: 52px; height: 52px; border-radius: 16px; background: rgba(2, 132, 199, 0.1); color: #0284c7; display: flex; align-items: center; justify-content: center;">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              <line x1="12" y1="11" x2="12" y2="17"></line>
              <line x1="9" y1="14" x2="15" y2="14"></line>
            </svg>
          </div>
          <div style="font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 800; color: #0f172a;">
            No hay ROMs en ${c.name}
          </div>
          <p style="font-size: 12.5px; line-height: 1.5; margin: 0;">
            Coloca tus archivos ROM en <code>ROMS/${c.id}/</code> o carga un archivo local directamente para jugar.
          </p>
          <div style="display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-top: 4px;">
            <button class="btn-interior-action" onclick="document.getElementById('quickInteriorRomInput').click()" style="border-color: #00d2be; color: #0f766e;">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              <span>Cargar ROM Local</span>
            </button>
            <button class="btn-interior-action" onclick="triggerServerSync()">
              <span>Escanear Servidor</span>
            </button>
          </div>
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

      const numStr = String(idx + 1).padStart(2, '0');
      const coverSrc = g.cover || `assets/consoles/${c.img}`;

      row.innerHTML = `
        <div class="game-row-index">${numStr}</div>
        <img src="${coverSrc}" class="game-row-thumb" alt="${g.title}" onerror="this.src='assets/consoles/${c.img}'">
        <div class="game-row-info">
          <div class="game-row-title">${g.title}</div>
          <div class="game-row-meta">${g.genre || 'Clásico Retro'} • ${g.year || c.era}</div>
        </div>
        <div class="game-row-play-badge">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          <span>${isActive ? 'Elegido' : 'Ver'}</span>
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
    const coverImg = document.getElementById('showcaseBoxCoverImg');
    const cartImg = document.getElementById('showcaseCartridgeImg');
    const sysChip = document.getElementById('showcaseSystemChip');
    const genreChip = document.getElementById('showcaseGenreChip');
    const yearChip = document.getElementById('showcaseYearChip');
    const titleEl = document.getElementById('showcaseGameTitle');
    const descEl = document.getElementById('showcaseGameDescription');
    const playBtn = document.getElementById('btnShowcasePlayNow');
    const trailerCaption = document.getElementById('trailerCaptionText');

    if (!game) {
      if (coverImg) coverImg.src = `assets/consoles_hires/${consoleObj.img}`;
      if (cartImg) cartImg.src = getDefaultCartridgeForConsole(consoleObj.id);
      if (sysChip) sysChip.textContent = consoleObj.name;
      if (genreChip) genreChip.textContent = consoleObj.arch || 'Hardware Original';
      if (yearChip) yearChip.textContent = consoleObj.era || '';
      if (titleEl) titleEl.textContent = `${consoleObj.name} — Esperando ROM`;
      if (descEl) descEl.textContent = consoleObj.synopsis;
      if (playBtn) {
        playBtn.onclick = () => document.getElementById('quickInteriorRomInput').click();
        playBtn.querySelector('span').textContent = 'Cargar Archivo ROM';
      }
      if (trailerCaption) {
        trailerCaption.textContent = `${consoleObj.name} • Vista previa del sistema`;
      }
      setupGameTrailerPlayer(null, consoleObj);
      return;
    }

    const coverSrc = game.cover || `assets/consoles/${consoleObj.img}`;
    const cartSrc = game.cartridge || getDefaultCartridgeForConsole(consoleObj.id);

    if (coverImg) {
      coverImg.src = coverSrc;
      coverImg.onerror = () => {
        coverImg.src = `assets/consoles/${consoleObj.img}`;
      };
    }
    if (cartImg) {
      cartImg.src = cartSrc;
      cartImg.onerror = () => {
        cartImg.src = getDefaultCartridgeForConsole(consoleObj.id);
      };
    }
    if (sysChip) sysChip.textContent = consoleObj.name;
    if (genreChip) genreChip.textContent = game.genre || 'Aventura Retro';
    if (yearChip) yearChip.textContent = game.year || consoleObj.era;
    if (titleEl) titleEl.textContent = game.title;
    if (descEl) descEl.textContent = getGameRichDescription(game, consoleObj);

    if (playBtn) {
      playBtn.onclick = () => playSelectedGame(game, consoleObj);
      playBtn.querySelector('span').textContent = 'Jugar Ahora';
    }
    if (trailerCaption) {
      trailerCaption.textContent = `${game.title} • Gameplay Trailer (${consoleObj.id.toUpperCase()})`;
    }

    if (typeof setDynamicBg === 'function') {
      setDynamicBg(coverSrc, game.title);
    }

    setupGameTrailerPlayer(game, consoleObj);
  }

  /* ==========================================================================
     4. REPRODUCTOR DE VÍDEO TRAILER (MP4 REAL + FALLBACK ANIMADO EN VIVO)
     ========================================================================== */
  function setupGameTrailerPlayer(game, consoleObj) {
    const videoEl = document.getElementById('showcaseTrailerVideo');
    const canvasEl = document.getElementById('showcaseTrailerCanvas');
    const statusPill = document.getElementById('trailerLiveStatusText');
    if (!videoEl || !canvasEl) return;

    stopTrailerPreviewLoop();

    const trailerUrl = getGameTrailerPath(game, consoleObj);

    if (trailerUrl) {
      videoEl.src = trailerUrl;
      videoEl.muted = true;
      videoEl.playsInline = true;
      videoEl.loop = true;

      videoEl.onloadeddata = () => {
        stopTrailerPreviewLoop();
        canvasEl.style.display = 'none';
        videoEl.style.display = 'block';
        if (statusPill) statusPill.textContent = 'TRAILER MP4 EN VIVO';
        videoEl.play().catch(() => {});
      };

      videoEl.onerror = () => {
        videoEl.style.display = 'none';
        canvasEl.style.display = 'block';
        if (statusPill) statusPill.textContent = 'PREVIEW EN VIVO';
        startTrailerCanvasPreview(game, consoleObj, canvasEl);
      };
    } else {
      videoEl.style.display = 'none';
      canvasEl.style.display = 'block';
      if (statusPill) statusPill.textContent = 'PREVIEW EN VIVO';
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

    canvas.width = 640;
    canvas.height = 300;

    trailerPosterImg = new Image();
    const wpList =
      typeof CONSOLE_GAME_WALLPAPERS !== 'undefined' && CONSOLE_GAME_WALLPAPERS[consoleObj.id]
        ? CONSOLE_GAME_WALLPAPERS[consoleObj.id]
        : [];
    const primaryUrl = game && game.cover ? game.cover : wpList[0]?.url || `assets/consoles_hires/${consoleObj.img}`;
    const secondaryUrl = wpList[0]?.url || `assets/consoles_hires/${consoleObj.img}`;

    trailerPosterImg.src = primaryUrl;
    trailerSecondaryImg = new Image();
    trailerSecondaryImg.src = secondaryUrl;

    let t = 0;
    function renderFrame() {
      t += 0.015;
      const w = canvas.width;
      const h = canvas.height;

      // Fondo degradado oscuro de cine
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#0b132b');
      grad.addColorStop(0.5, '#1e293b');
      grad.addColorStop(1, '#090d16');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Imagen de fondo con paneo Ken Burns suave
      if (trailerSecondaryImg && trailerSecondaryImg.complete && trailerSecondaryImg.naturalWidth > 0) {
        ctx.save();
        ctx.globalAlpha = 0.42;
        const scale = 1.12 + Math.sin(t * 0.7) * 0.06;
        const offsetX = Math.cos(t * 0.5) * 24;
        const offsetY = Math.sin(t * 0.4) * 14;
        ctx.translate(w / 2 + offsetX, h / 2 + offsetY);
        ctx.scale(scale, scale);
        ctx.drawImage(trailerSecondaryImg, -w / 2, -h / 2, w, h);
        ctx.restore();
      }

      // Carátula / Arte del juego flotando en el centro-izquierda del trailer
      if (trailerPosterImg && trailerPosterImg.complete && trailerPosterImg.naturalWidth > 0) {
        ctx.save();
        const boxH = 190;
        const ratio = trailerPosterImg.naturalWidth / Math.max(1, trailerPosterImg.naturalHeight);
        const boxW = Math.min(240, boxH * ratio);
        const x = 58 + Math.sin(t * 1.1) * 6;
        const y = (h - boxH) / 2 + Math.cos(t * 1.3) * 5;

        ctx.shadowColor = consoleObj.color || '#00d2be';
        ctx.shadowBlur = 24;
        ctx.drawImage(trailerPosterImg, x, y, boxW, boxH);
        ctx.restore();
      }

      // Textos dinámicos a la derecha del canvas
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.font = '800 22px "Space Grotesk", sans-serif';
      const titleStr = game ? game.title : consoleObj.name;
      ctx.fillText(titleStr.slice(0, 28), 290, h / 2 - 12);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '700 13px "Outfit", sans-serif';
      ctx.fillText(
        game ? `${game.genre || 'Aventura'} • ${consoleObj.name}` : consoleObj.era || '',
        290,
        h / 2 + 14
      );

      // Barra de ecualizador / pulso visual en el trailer
      const barBaseX = 290;
      const barBaseY = h / 2 + 48;
      for (let i = 0; i < 18; i++) {
        const barH = 6 + Math.abs(Math.sin(t * 3 + i * 0.45)) * 22;
        ctx.fillStyle = i % 2 === 0 ? consoleObj.color || '#e60012' : '#00d2be';
        ctx.fillRect(barBaseX + i * 11, barBaseY - barH, 6, barH);
      }
      ctx.restore();

      // Líneas scanline sutiles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
      for (let y = 0; y < h; y += 4) {
        ctx.fillRect(0, y, w, 1);
      }

      trailerAnimFrame = requestAnimationFrame(renderFrame);
    }

    renderFrame();
  }

  window.handleCustomTrailerUpload = function (event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const blobUrl = URL.createObjectURL(file);
    const c = CONSOLES[activeConsoleIndex];
    const games = typeof getGamesForConsole === 'function' ? getGamesForConsole(c.id) : [];
    const currentGame = games[activeGameIndex];
    if (currentGame) {
      customUploadedTrailers[currentGame.title] = blobUrl;
      setupGameTrailerPlayer(currentGame, c);
    }
  };

  window.handleInteriorSearch = function (event) {
    interiorSearchQuery = (event.target.value || '').trim().toLowerCase();
    activeGameIndex = 0;
    window.renderConsoleInteriorView();
  };

  /* ==========================================================================
     5. INDICADOR DE AUDIO MP3 EN BARRA SUPERIOR Y PROMPTS INFERIORES
     ========================================================================== */
  function updateAudioPillStatus() {
    const pill = document.getElementById('topAudioPill');
    const textEl = document.getElementById('topAudioPillText');
    if (!pill || !textEl || typeof CONSOLES === 'undefined') return;

    const c = CONSOLES[activeConsoleIndex];
    const music = window.retroConsoleMusic;
    if (!music) return;

    pill.classList.toggle('muted', !!music.isMuted);
    if (music.isMuted) {
      textEl.textContent = 'Audio Silenciado';
      return;
    }

    const tracks = music.consoleAudioMap && c ? music.consoleAudioMap[c.id] : null;
    if (tracks && tracks.length > 0) {
      const fileName = tracks[0].split('/').pop();
      textEl.textContent = `MP3: ${fileName}`;
    } else {
      textEl.textContent = `Sin MP3 (/audios/${c ? c.id : ''})`;
    }
  }

  window.toggleTopBarAudioMute = function () {
    if (!window.retroConsoleMusic) return;
    const isMuted = window.retroConsoleMusic.toggleMute();
    if (!isMuted && typeof CONSOLES !== 'undefined') {
      const c = CONSOLES[activeConsoleIndex];
      if (c) window.retroConsoleMusic.playConsoleTheme(c.id);
    }
    updateAudioPillStatus();
  };

  function updateBottomFooterPrompts() {
    const promptNavText = document.getElementById('footerPromptNavText');
    const promptActionText = document.getElementById('footerPromptActionText');
    const promptBackWrap = document.getElementById('footerPromptBackWrap');

    if (window.isConsoleInteriorOpen) {
      if (promptNavText) promptNavText.textContent = 'Elegir Juego (Arriba / Abajo)';
      if (promptActionText) promptActionText.textContent = 'Jugar Ahora';
      if (promptBackWrap) promptBackWrap.style.display = 'flex';
    } else {
      if (promptNavText) promptNavText.textContent = 'Girar Anillo (Izquierda / Derecha)';
      if (promptActionText) promptActionText.textContent = 'Entrar a Consola';
      if (promptBackWrap) promptBackWrap.style.display = 'none';
    }
  }

  window.handlePrimaryFooterAction = function () {
    if (window.isConsoleInteriorOpen) {
      playActiveShelfGame();
    } else {
      window.enterSelectedConsole();
    }
  };

  window.addEventListener('retrohub_audio_state', () => {
    updateAudioPillStatus();
  });
})();
