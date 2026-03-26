import confetti from 'canvas-confetti';

export const CELEBRATION_CONFETTI_COLORS = [
  '#FFD700',
  '#FF69B4',
  '#00FFFF',
  '#ADFF2F',
  '#FF6347',
  '#FFFFFF',
];

const BASE_CELEBRATION_OPTIONS = {
  spread: 80,
  particleCount: 120,
  startVelocity: 45,
  gravity: 1.2,
  ticks: 280,
  disableForReducedMotion: true,
};

export function launchDualSideCelebrationConfetti({
  colors = CELEBRATION_CONFETTI_COLORS,
  delayMs = 150,
} = {}) {
  if (typeof window === 'undefined') return;

  confetti({
    ...BASE_CELEBRATION_OPTIONS,
    angle: 55,
    origin: { x: 0, y: 1 },
    colors,
  });

  window.setTimeout(() => {
    confetti({
      ...BASE_CELEBRATION_OPTIONS,
      angle: 125,
      origin: { x: 1, y: 1 },
      colors,
    });
  }, delayMs);
}
