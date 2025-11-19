/**
 * confetti.js
 *
 * Confetti celebrations pentru achievements, badges, streaks
 * Folosește canvas-confetti cu culorile din design system
 */

import confetti from 'canvas-confetti';

/**
 * Celebrate badge unlock
 * Explozie de confetti cu culorile neon din design system
 */
export const celebrateBadge = (badgeColor = '#FF0080') => {
  const colors = ['#FF0080', '#00FFFF', '#CCFF00', '#FF6B00', badgeColor];

  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors,
    scalar: 1.2,
    gravity: 1,
    ticks: 200
  });
};

/**
 * Celebrate streak milestone
 * Dual-sided confetti burst pentru streaks
 */
export const celebrateStreak = (days) => {
  const count = Math.min(days * 10, 200);
  const colors = days >= 30
    ? ['#FF0080', '#CCFF00', '#00FFFF'] // Legendary
    : days >= 7
    ? ['#FF6B00', '#FCBF49', '#E63946'] // Rare
    : ['#F77F00', '#FCBF49']; // Common

  // Left burst
  confetti({
    particleCount: count,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 0.6 },
    colors
  });

  // Right burst
  confetti({
    particleCount: count,
    angle: 120,
    spread: 55,
    origin: { x: 1, y: 0.6 },
    colors
  });
};

/**
 * Celebrate perfect score (100%)
 * Gold star confetti pentru scor perfect
 */
export const celebratePerfectScore = () => {
  confetti({
    particleCount: 150,
    spread: 360,
    startVelocity: 30,
    ticks: 100,
    gravity: 0.8,
    colors: ['#FFD700', '#FCBF49', '#FFEA00'],
    shapes: ['star'],
    scalar: 1.5
  });

  // Secondary burst după 300ms
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 90,
      spread: 45,
      origin: { y: 0.7 },
      colors: ['#FFD700', '#FCBF49'],
      shapes: ['circle']
    });
  }, 300);
};

/**
 * Celebrate level up
 * Firewerk-style confetti pentru level up
 */
export const celebrateLevelUp = () => {
  const duration = 2000;
  const animationEnd = Date.now() + duration;
  const colors = ['#FF0080', '#00FFFF', '#CCFF00'];

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors
    });

    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  };

  frame();
};

/**
 * Celebrate quiz completion
 * Quick confetti burst pentru finalizare quiz
 */
export const celebrateQuizComplete = (score) => {
  const colors = score >= 80
    ? ['#06A77D', '#CCFF00', '#39FF14'] // Green pentru scor mare
    : score >= 60
    ? ['#FCBF49', '#F77F00'] // Orange pentru scor mediu
    : ['#E63946', '#F77F00']; // Red pentru scor mic

  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.7 },
    colors,
    ticks: 150
  });
};

/**
 * Celebrate first quiz
 * Special celebration pentru primul quiz
 */
export const celebrateFirstQuiz = () => {
  // Rainbow confetti
  const colors = [
    '#E63946', '#F77F00', '#FCBF49',
    '#06A77D', '#1982C4', '#6A4C93',
    '#FF0080', '#00FFFF', '#CCFF00'
  ];

  confetti({
    particleCount: 200,
    spread: 180,
    startVelocity: 45,
    origin: { y: 0.5 },
    colors,
    ticks: 300,
    gravity: 0.6
  });
};

/**
 * Stop all confetti
 * Oprește toate animațiile de confetti
 */
export const stopConfetti = () => {
  confetti.reset();
};
