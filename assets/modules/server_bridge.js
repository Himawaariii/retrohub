/**
/**
 * RetroHub Remote Server Bridge Module (himawari@192.168.0.131)
 * Provides centralized server status, remote catalog scanning, and ticket submission.
 */

export const RetroServer = {
  host: '192.168.0.131',
  sshUser: 'himawari',
  dataPath: '/home/himawari/retrohub-data',
  status: {
    online: false,
    diskFree: 'N/A',
    checkedAt: null
  },

  async getStatus() {
    try {
      const res = await fetch('/api/server/status');
      const data = await res.json();
      if (data.success && data.server) {
        this.status = {
          online: data.server.online,
          diskFree: data.server.disk_free || '71G',
          diskUsage: data.server.disk_usage || '24%',
          checkedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        return this.status;
      }
    } catch (e) {
      this.status.online = false;
    }
    return this.status;
  },

  async triggerRemoteScan() {
    try {
      const res = await fetch('/api/server/scan', { method: 'POST' });
      return await res.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  async submitTicket(ticketData) {
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData)
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  async getTickets() {
    try {
      const res = await fetch('/api/tickets');
      const data = await res.json();
      return data.tickets || [];
    } catch (e) {
      return [];
    }
  }
};

if (typeof window !== 'undefined') {
  window.RetroServer = RetroServer;
}
