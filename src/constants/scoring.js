/**
 * scoring.js - Single source of truth pentru scoring și difficulty configuration
 *
 * Acest fișier centralizează toate constantele legate de:
 * - Punctaje pe difficulty
 * - Culori și labels pentru UI
 * - Configurație completă pentru fiecare nivel
 *
 * Folosit în: QuizPlay.jsx, TriviaGlobal.jsx, TriviaSubject.jsx
 */

/**
 * Punctajele pentru fiecare nivel de dificultate
 * Easy: 10 puncte, Medium: 30 puncte, Hard: 50 puncte
 */
export const DIFFICULTY_SCORES = {
  easy: 10,
  medium: 30,
  hard: 50,
};

/**
 * Configurație completă pentru fiecare nivel de dificultate
 * Include: puncte, label, culoare, emoji
 */
export const DIFFICULTY_CONFIG = {
  easy: {
    points: 10,
    label: 'Ușor',
    color: '#8B9B7A',
    emoji: '🟢',
  },
  medium: {
    points: 30,
    label: 'Mediu',
    color: '#FF6B00',
    emoji: '🟡',
  },
  hard: {
    points: 50,
    label: 'Greu',
    color: '#FF0080',
    emoji: '🔴',
  },
};

/**
 * Helper function: Obține punctajul pentru un nivel de dificultate
 * @param {string} difficulty - 'easy', 'medium', sau 'hard'
 * @returns {number} - Punctajul corespunzător
 */
export function getPointsForDifficulty(difficulty) {
  return DIFFICULTY_SCORES[difficulty] || 0;
}

/**
 * Helper function: Obține configurația completă pentru un nivel
 * @param {string} difficulty - 'easy', 'medium', sau 'hard'
 * @returns {object} - { points, label, color, emoji }
 */
export function getDifficultyInfo(difficulty) {
  return DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium;
}
