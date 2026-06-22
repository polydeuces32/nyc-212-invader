export type AudioEngine = {
  unlock: () => void;
  shoot: () => void;
  enemyHit: () => void;
  playerHit: () => void;
  waveClear: () => void;
  gameOver: () => void;
  menuConfirm: () => void;
};

export function createAudioEngine(): AudioEngine {
  let context: AudioContext | null = null;

  const ensureContext = (): AudioContext | null => {
    if (typeof window === "undefined") return null;
    if (!context) {
      context = new AudioContext();
    }
    if (context.state === "suspended") {
      void context.resume();
    }
    return context;
  };

  const playTone = (
    frequency: number,
    duration: number,
    type: OscillatorType = "square",
    volume = 0.08,
    frequencyEnd?: number
  ) => {
    const ac = ensureContext();
    if (!ac) return;

    const oscillator = ac.createOscillator();
    const gain = ac.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ac.currentTime);
    if (frequencyEnd !== undefined) {
      oscillator.frequency.exponentialRampToValueAtTime(
        Math.max(frequencyEnd, 40),
        ac.currentTime + duration
      );
    }
    gain.gain.setValueAtTime(volume, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(ac.destination);
    oscillator.start(ac.currentTime);
    oscillator.stop(ac.currentTime + duration);
  };

  return {
    unlock: () => {
      ensureContext();
    },
    shoot: () => playTone(920, 0.07, "square", 0.05, 640),
    enemyHit: () => playTone(220, 0.12, "sawtooth", 0.06, 80),
    playerHit: () => playTone(140, 0.25, "triangle", 0.09, 60),
    waveClear: () => {
      playTone(440, 0.1, "square", 0.05);
      setTimeout(() => playTone(660, 0.1, "square", 0.05), 90);
      setTimeout(() => playTone(880, 0.15, "square", 0.05), 180);
    },
    gameOver: () => playTone(110, 0.4, "triangle", 0.08, 55),
    menuConfirm: () => playTone(520, 0.08, "square", 0.04, 780),
  };
}
