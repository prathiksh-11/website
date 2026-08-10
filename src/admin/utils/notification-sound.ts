type AudioWindow = Window & {
  webkitAudioContext?: typeof AudioContext;
};

let sharedCtx: AudioContext | null = null;
let unlocked = false;

const getAudioContext = () => {
  if (sharedCtx) return sharedCtx;
  const AudioCtx =
    window.AudioContext || (window as AudioWindow).webkitAudioContext;
  if (!AudioCtx) return null;
  sharedCtx = new AudioCtx();
  return sharedCtx;
};

/** Call once after any user click/key — browsers block sound until then. */
export const unlockNotificationAudio = async () => {
  const ctx = getAudioContext();
  if (!ctx) return false;

  try {
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    // Silent blip so the context is fully primed
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    gain.gain.value = 0.00001;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.01);
    unlocked = ctx.state === 'running';
    console.log('[FCM] Audio unlocked:', ctx.state);
    return unlocked;
  } catch (error) {
    console.warn('[FCM] Audio unlock failed:', error);
    return false;
  }
};

export const isNotificationAudioUnlocked = () => unlocked;

/** Soft two-tone chime after audio has been unlocked by a user gesture. */
export const playNotificationSound = async () => {
  const ctx = getAudioContext();
  if (!ctx) {
    console.warn('[FCM] AudioContext not available');
    return;
  }

  try {
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    if (ctx.state !== 'running') {
      console.warn(
        '[FCM] Sound blocked — click anywhere in the app once, then try again. State:',
        ctx.state,
      );
      return;
    }

    const now = ctx.currentTime;

    const tone = (freq: number, start: number, dur: number, vol = 0.14) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(vol, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + dur + 0.02);
    };

    tone(880, now, 0.16, 0.16);
    tone(1175, now + 0.11, 0.26, 0.12);
    console.log('[FCM] Notification sound played');
  } catch (error) {
    console.warn('[FCM] playNotificationSound failed:', error);
  }
};
