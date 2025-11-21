/**
 * dailyChallengeService.js
 *
 * Service pentru Daily Challenge - generare deterministică de întrebări
 * Toți userii vor primi EXACT aceleași 12 întrebări pentru fiecare zi
 *
 * ARHITECTURĂ:
 * - Seed = hash(data zilei)
 * - Fetch toate întrebările eligible
 * - Shuffle deterministic cu seeded random
 * - Select primele 12
 */

import {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit as firestoreLimit
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Seeded Random Number Generator
 * Folosim Mulberry32 algorithm pentru reproducibility
 */
function seededRandom(seed) {
  return function() {
    seed |= 0;
    seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/**
 * Generate hash from string (simple hash function)
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Get today's date string (YYYY-MM-DD)
 */
export function getTodayDateString() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Generate deterministic daily questions
 * Toți userii vor primi aceleași întrebări pentru aceeași dată
 *
 * @param {string} dateString - Date in format YYYY-MM-DD
 * @param {number} count - Number of questions (default 12)
 * @returns {Array} Array of questions
 */
export async function generateDailyQuestions(dateString = getTodayDateString(), count = 12) {
  try {
    console.log('🌟 Generating daily questions for:', dateString);

    // Generate seed from date
    const seed = hashString(`daily-challenge-${dateString}-v1`);
    console.log('🎲 Seed:', seed);

    // Fetch ALL questions from Firestore (all subjects, all difficulties)
    const questionsRef = collection(db, 'questions');
    const snapshot = await getDocs(questionsRef);

    if (snapshot.empty) {
      console.warn('⚠️ No questions found in database');
      return [];
    }

    const allQuestions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log(`📦 Total questions available: ${allQuestions.length}`);

    // Shuffle deterministically using seeded random
    const rng = seededRandom(seed);
    const shuffled = [...allQuestions].sort(() => rng() - 0.5);

    // Take first 'count' questions
    const selectedQuestions = shuffled.slice(0, count);

    console.log(`✅ Selected ${selectedQuestions.length} questions for daily challenge`);

    return selectedQuestions;

  } catch (error) {
    console.error('❌ Error generating daily questions:', error);
    throw error;
  }
}

/**
 * Check if user completed today's challenge
 *
 * @param {string} userId - User ID
 * @param {string} dateString - Date string (default today)
 * @returns {Object|null} Challenge result or null
 */
export async function getUserDailyChallenge(userId, dateString = getTodayDateString()) {
  try {
    const challengeRef = doc(db, 'users', userId, 'dailyChallenges', dateString);
    const challengeDoc = await getDoc(challengeRef);

    if (!challengeDoc.exists()) {
      return null;
    }

    return {
      date: dateString,
      ...challengeDoc.data()
    };

  } catch (error) {
    console.error('❌ Error fetching user daily challenge:', error);
    return null;
  }
}

/**
 * Save user's daily challenge result
 *
 * @param {string} userId - User ID
 * @param {string} dateString - Date string
 * @param {Object} result - Challenge result
 * @returns {boolean} Success
 */
export async function saveDailyChallenge(userId, dateString, result) {
  try {
    const { score, maxScore, duration, answers, questionIds } = result;

    // Save in user's dailyChallenges subcollection
    const challengeRef = doc(db, 'users', userId, 'dailyChallenges', dateString);
    await setDoc(challengeRef, {
      completed: true,
      score,
      maxScore,
      percentage: Math.round((score / maxScore) * 100),
      duration,
      answers,
      questionIds,
      completedAt: new Date(),
      createdAt: new Date()
    });

    // Also save in global daily leaderboard
    const leaderboardRef = doc(db, 'dailyLeaderboard', dateString, 'scores', userId);
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userData = userDoc.data();

    await setDoc(leaderboardRef, {
      userId,
      displayName: userData?.displayName || 'Anonymous',
      photoURL: userData?.photoURL || null,
      score,
      maxScore,
      percentage: Math.round((score / maxScore) * 100),
      duration,
      completedAt: new Date()
    });

    console.log('✅ Daily challenge saved for user:', userId);
    return true;

  } catch (error) {
    console.error('❌ Error saving daily challenge:', error);
    return false;
  }
}

/**
 * Get daily leaderboard (Top 10 fastest with highest scores)
 *
 * @param {string} dateString - Date string
 * @returns {Array} Leaderboard array
 */
export async function getDailyLeaderboard(dateString = getTodayDateString()) {
  try {
    const scoresRef = collection(db, 'dailyLeaderboard', dateString, 'scores');
    const snapshot = await getDocs(scoresRef);

    if (snapshot.empty) {
      return [];
    }

    const scores = snapshot.docs.map(doc => ({
      userId: doc.id,
      ...doc.data()
    }));

    // Sort by score DESC, then by duration ASC (faster wins)
    scores.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.duration - b.duration;
    });

    // Return top 10
    return scores.slice(0, 10);

  } catch (error) {
    console.error('❌ Error fetching daily leaderboard:', error);
    return [];
  }
}

/**
 * Get user's daily challenge stats
 *
 * @param {string} userId - User ID
 * @returns {Object} Stats object
 */
export async function getUserDailyStats(userId) {
  try {
    const challengesRef = collection(db, 'users', userId, 'dailyChallenges');
    const snapshot = await getDocs(challengesRef);

    if (snapshot.empty) {
      return {
        totalCompleted: 0,
        currentStreak: 0,
        bestStreak: 0,
        averageScore: 0,
        bestScore: 0
      };
    }

    const challenges = snapshot.docs.map(doc => ({
      date: doc.id,
      ...doc.data()
    }));

    // Calculate stats
    const totalCompleted = challenges.length;

    // Calculate average score
    const totalScore = challenges.reduce((sum, c) => sum + (c.percentage || 0), 0);
    const averageScore = Math.round(totalScore / totalCompleted);

    // Calculate best score
    const bestScore = Math.max(...challenges.map(c => c.percentage || 0));

    // Calculate current streak
    const currentStreak = calculateDailyStreak(challenges);

    // Calculate best streak (simplified - would need historical data)
    const bestStreak = currentStreak; // TODO: Track historical best streak

    return {
      totalCompleted,
      currentStreak,
      bestStreak,
      averageScore,
      bestScore
    };

  } catch (error) {
    console.error('❌ Error fetching user daily stats:', error);
    return {
      totalCompleted: 0,
      currentStreak: 0,
      bestStreak: 0,
      averageScore: 0,
      bestScore: 0
    };
  }
}

/**
 * Calculate consecutive daily streak
 *
 * @param {Array} challenges - Array of challenge objects with date
 * @returns {number} Streak count
 */
function calculateDailyStreak(challenges) {
  if (challenges.length === 0) return 0;

  // Sort by date descending
  const sorted = challenges.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  let streak = 0;
  const today = new Date();
  let checkDate = new Date(today);

  // Start checking from today backwards
  for (let i = 0; i < sorted.length; i++) {
    const challengeDate = sorted[i].date;
    const expectedDate = checkDate.toISOString().split('T')[0];

    if (challengeDate === expectedDate) {
      streak++;
      // Move to previous day
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // Streak broken
      break;
    }
  }

  return streak;
}

/**
 * Get total participants for today's challenge
 *
 * @param {string} dateString - Date string
 * @returns {number} Participant count
 */
export async function getDailyParticipantCount(dateString = getTodayDateString()) {
  try {
    const scoresRef = collection(db, 'dailyLeaderboard', dateString, 'scores');
    const snapshot = await getDocs(scoresRef);
    return snapshot.size;
  } catch (error) {
    console.error('❌ Error fetching participant count:', error);
    return 0;
  }
}

/**
 * Get user's rank in today's challenge
 *
 * @param {string} userId - User ID
 * @param {string} dateString - Date string
 * @returns {number|null} Rank (1-indexed) or null
 */
export async function getUserDailyRank(userId, dateString = getTodayDateString()) {
  try {
    const leaderboard = await getDailyLeaderboard(dateString);
    const userIndex = leaderboard.findIndex(entry => entry.userId === userId);

    return userIndex >= 0 ? userIndex + 1 : null;
  } catch (error) {
    console.error('❌ Error fetching user rank:', error);
    return null;
  }
}
