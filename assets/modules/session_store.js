/**
 * RetroHub Unified Session & Profile Store
 * Consolidates profile data, authentic user state, and UI themes across all views.
 */

export const SessionStore = {
  // Datos del único usuario real
  currentUser: {
    id: 1,
    username: 'Sariwiiwi',
    email: 'saragomezmanzanares@gmail.com',
    displayName: 'Sariwiiwi',
    bio: 'Coleccionista de joyas en caja original y perseguidora de los 60 FPS.',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=SaraRetro',
    bannerUrl: 'assets/game_wallpapers/n64/sm64.png',
    titleHonor: '🎮 Maestra de los 64-Bits',
    systemAura: 'mint',
    favoriteSystem: 'n64',
    friendCode: 'SW-7824-9102-3318'
  },

  AURA_PALETTES: {
    mint: { id: 'mint', name: 'Mint Cyan', color: '#00d2be', glow: 'rgba(0, 210, 190, 0.45)' },
    scarlet: { id: 'scarlet', name: 'Joy-Con Scarlet', color: '#ff3c28', glow: 'rgba(255, 60, 40, 0.45)' },
    electric: { id: 'electric', name: 'Electric Blue', color: '#00a2ed', glow: 'rgba(0, 162, 237, 0.45)' },
    neon: { id: 'neon', name: 'Neon Purple', color: '#818cf8', glow: 'rgba(129, 140, 248, 0.45)' },
    gold: { id: 'gold', name: 'Retro Gold', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.45)' }
  },

  getUserProfile() {
    const saved = localStorage.getItem('retrohub_profile');
    if (saved) {
      try {
        return { ...this.currentUser, ...JSON.parse(saved) };
      } catch (e) {}
    }
    return { ...this.currentUser };
  },

  saveUserProfile(updatedProfile) {
    const merged = { ...this.getUserProfile(), ...updatedProfile };
    localStorage.setItem('retrohub_profile', JSON.stringify(merged));
    return merged;
  },

  getPlayActivity() {
    const saved = localStorage.getItem('retrohub_play_activity');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    // Retorna array vacío real (sin mock fake)
    return [];
  },

  recordPlayActivity(gameId, title, systemId, minutes) {
    const current = this.getPlayActivity();
    const existing = current.find(x => x.id === gameId);
    if (existing) {
      existing.minutesPlayed = (existing.minutesPlayed || 0) + minutes;
      existing.lastPlayed = 'Hoy';
    } else {
      current.unshift({
        id: gameId,
        title: title,
        system: systemId,
        minutesPlayed: minutes,
        lastPlayed: 'Hoy',
        firstPlayed: 'Hoy'
      });
    }
    localStorage.setItem('retrohub_play_activity', JSON.stringify(current));
    return current;
  },

  getFriends() {
    const saved = localStorage.getItem('retrohub_friends');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    // Retorna array vacío real (sin amigos fake)
    return [];
  }
};

if (typeof window !== 'undefined') {
  window.SessionStore = SessionStore;
}
