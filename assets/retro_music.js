/**
 * RetroHub • Motor de Audio Real MP3 por Consola
 * Reproduce archivos MP3 reales alojados en la carpeta /audios/<consola>.mp3 o /audios/<consola>/*.mp3
 * Cero música sintetizada. Si una consola aún no tiene MP3 subido, permanece en silencio.
 */

class RetroConsoleMusicEngine {
  constructor() {
    this.currentConsole = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.volume = 0.45;
    this.audioEl = new Audio();
    this.audioEl.loop = true;
    this.audioEl.volume = this.volume;
    this.audiosCatalog = {};
    this.catalogLoaded = false;

    this.loadAudioCatalog();
  }

  async loadAudioCatalog() {
    try {
      const res = await fetch('/api/audios');
      const data = await res.json();
      if (data && data.success && data.audios) {
        this.audiosCatalog = data.audios;
        this.catalogLoaded = true;
      }
    } catch (e) {
      this.catalogLoaded = false;
    }
  }

  resolveTrackUrl(consoleId) {
    const cid = String(consoleId || '').toLowerCase();
    if (!cid) return null;
    const list = this.audiosCatalog[cid];
    if (Array.isArray(list) && list.length > 0) {
      return list[0];
    }
    return `audios/${cid}.mp3`;
  }

  playConsoleTheme(consoleId) {
    const cid = String(consoleId || '').toLowerCase();
    this.currentConsole = cid;

    if (this.isMuted || !cid) {
      this.stopCurrentTheme();
      return;
    }

    const list = this.audiosCatalog[cid];
    // Si ya cargó el catálogo de /api/audios y no hay archivo MP3 en esa consola, no reproducir nada
    if (this.catalogLoaded && (!Array.isArray(list) || list.length === 0)) {
      this.stopCurrentTheme();
      return;
    }

    const url = this.resolveTrackUrl(cid);
    if (!url) {
      this.stopCurrentTheme();
      return;
    }

    if (this.audioEl.src && this.audioEl.src.endsWith(url) && !this.audioEl.paused) {
      return;
    }

    this.audioEl.pause();
    this.audioEl.src = url;
    this.audioEl.volume = this.volume;
    this.audioEl.currentTime = 0;
    this.audioEl
      .play()
      .then(() => {
        this.isPlaying = true;
      })
      .catch(() => {
        this.isPlaying = false;
      });
  }

  stopCurrentTheme() {
    try {
      this.audioEl.pause();
      this.audioEl.currentTime = 0;
    } catch (e) {}
    this.isPlaying = false;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopCurrentTheme();
    } else if (this.currentConsole) {
      this.playConsoleTheme(this.currentConsole);
    }
    return this.isMuted;
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, Number(val) || 0));
    this.audioEl.volume = this.volume;
  }

  getTrackInfo(consoleId) {
    const cid = String(consoleId || '').toLowerCase();
    const list = this.audiosCatalog[cid];
    if (Array.isArray(list) && list.length > 0) {
      const fileName = list[0].split('/').pop().replace(/\.[^/.]+$/, '');
      return {
        game: cid.toUpperCase(),
        title: fileName,
        hasMp3: true
      };
    }
    return {
      game: cid.toUpperCase(),
      title: 'Sin MP3 en /audios/' + cid,
      hasMp3: false
    };
  }
}

window.retroConsoleMusic = new RetroConsoleMusicEngine();
