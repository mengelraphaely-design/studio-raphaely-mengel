// Utilitário de Som do Sininho para Notificação de Novo Agendamento
// Usa Web Audio API nativa para tocar um sino cristalino e elegante

export function playNotificationBell() {
  if (typeof window === 'undefined') return;

  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Primeiro toque suave (Mi - 659Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);

    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.35, now + 0.03);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.85);

    // Segundo toque agudo harmonioso (Lá - 880Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.18);

    gain2.gain.setValueAtTime(0, now + 0.18);
    gain2.gain.linearRampToValueAtTime(0.4, now + 0.22);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.start(now + 0.18);
    osc2.stop(now + 1.25);
  } catch (err) {
    console.warn('[Sound] Não foi possível reproduzir som de notificação:', err);
  }
}

// Solicitar permissão de Notificação do Navegador (Push local)
export async function requestBrowserNotificationPermission() {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;

  try {
    if (Notification.permission === 'granted') return true;
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
  } catch {
    return false;
  }
  return false;
}

export function showBrowserNotification(title: string, body: string) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/pwa-192x192.svg',
        badge: '/favicon.svg'
      });
    } catch {
      // ignore
    }
  }
}
