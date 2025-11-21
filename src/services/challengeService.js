/**
 * challengeService.js
 *
 * Service pentru 1v1 Async Challenges
 * User A creează challenge → primește link → îl trimite către User B → amândoi joacă
 *
 * ARHITECTURĂ:
 * - Challenge doc în Firestore cu întrebări fixate
 * - Participants tracking (max 10 players)
 * - Link sharing cu challengeId
 * - Comparative results
 */

import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  addDoc
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Create new 1v1 challenge
 *
 * @param {string} userId - Creator user ID
 * @param {Object} config - Challenge configuration
 * @returns {Object} Challenge object with ID and link
 */
export async function createChallenge(userId, config) {
  try {
    const { difficulty, subjectId, themeId, questions } = config;

    // Get user data
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userData = userDoc.data();

    // Create challenge document
    const challengesRef = collection(db, 'challenges');
    const challengeDoc = await addDoc(challengesRef, {
      createdBy: {
        uid: userId,
        displayName: userData?.displayName || 'Anonymous',
        photoURL: userData?.photoURL || null
      },
      status: 'pending', // pending | active | completed
      difficulty,
      subjectId,
      themeId: themeId || null,
      questions, // Store full question objects (fixed)
      participants: {},
      maxPlayers: 10,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    });

    console.log('✅ Challenge created:', challengeDoc.id);

    // Generate shareable link
    const link = `${window.location.origin}/challenge/${challengeDoc.id}`;

    return {
      id: challengeDoc.id,
      link,
      ...config
    };

  } catch (error) {
    console.error('❌ Error creating challenge:', error);
    throw error;
  }
}

/**
 * Get challenge by ID
 *
 * @param {string} challengeId - Challenge ID
 * @returns {Object|null} Challenge object or null
 */
export async function getChallengeById(challengeId) {
  try {
    const challengeRef = doc(db, 'challenges', challengeId);
    const challengeDoc = await getDoc(challengeRef);

    if (!challengeDoc.exists()) {
      console.warn('⚠️ Challenge not found:', challengeId);
      return null;
    }

    return {
      id: challengeDoc.id,
      ...challengeDoc.data()
    };

  } catch (error) {
    console.error('❌ Error fetching challenge:', error);
    return null;
  }
}

/**
 * Check if challenge is valid (not expired, not full)
 *
 * @param {Object} challenge - Challenge object
 * @returns {Object} Validation result
 */
export function validateChallenge(challenge) {
  if (!challenge) {
    return {
      valid: false,
      reason: 'Challenge not found'
    };
  }

  // Check if expired
  const expiresAt = challenge.expiresAt?.toDate() || new Date(challenge.expiresAt);
  if (expiresAt < new Date()) {
    return {
      valid: false,
      reason: 'Challenge expired (7 days old)'
    };
  }

  // Check if full (max 10 players)
  const participantCount = Object.keys(challenge.participants || {}).length;
  if (participantCount >= challenge.maxPlayers) {
    return {
      valid: false,
      reason: 'Challenge is full (max 10 players)'
    };
  }

  return {
    valid: true,
    reason: null
  };
}

/**
 * Check if user already participated in challenge
 *
 * @param {string} challengeId - Challenge ID
 * @param {string} userId - User ID
 * @returns {boolean} True if participated
 */
export async function hasUserParticipated(challengeId, userId) {
  try {
    const challenge = await getChallengeById(challengeId);
    if (!challenge) return false;

    return challenge.participants && challenge.participants[userId] !== undefined;

  } catch (error) {
    console.error('❌ Error checking participation:', error);
    return false;
  }
}

/**
 * Save participant result to challenge
 *
 * @param {string} challengeId - Challenge ID
 * @param {string} userId - User ID
 * @param {Object} result - Quiz result
 * @returns {boolean} Success
 */
export async function saveParticipantResult(challengeId, userId, result) {
  try {
    const { score, maxScore, duration, answers } = result;

    // Get user data
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userData = userDoc.data();

    // Update challenge with participant result
    const challengeRef = doc(db, 'challenges', challengeId);
    const challenge = await getChallengeById(challengeId);

    if (!challenge) {
      throw new Error('Challenge not found');
    }

    const participants = challenge.participants || {};
    participants[userId] = {
      uid: userId,
      displayName: userData?.displayName || 'Anonymous',
      photoURL: userData?.photoURL || null,
      score,
      maxScore,
      percentage: Math.round((score / maxScore) * 100),
      duration,
      answers,
      completedAt: new Date()
    };

    // Update status to 'active' (at least one person played)
    const participantCount = Object.keys(participants).length;
    const status = participantCount >= 2 ? 'active' : 'pending';

    await updateDoc(challengeRef, {
      participants,
      status
    });

    console.log('✅ Participant result saved:', userId);

    // Also save to user's challenge history
    await saveChallengeToHistory(userId, challengeId, 'participant', result);

    return true;

  } catch (error) {
    console.error('❌ Error saving participant result:', error);
    return false;
  }
}

/**
 * Save challenge to user's history
 *
 * @param {string} userId - User ID
 * @param {string} challengeId - Challenge ID
 * @param {string} role - 'creator' | 'participant'
 * @param {Object} result - Quiz result
 */
async function saveChallengeToHistory(userId, challengeId, role, result) {
  try {
    const historyRef = doc(db, 'users', userId, 'challengeHistory', challengeId);

    await setDoc(historyRef, {
      challengeId,
      role,
      score: result.score,
      percentage: Math.round((result.score / result.maxScore) * 100),
      duration: result.duration,
      completedAt: new Date()
    });

    console.log('✅ Challenge saved to history:', userId);

  } catch (error) {
    console.error('❌ Error saving to history:', error);
  }
}

/**
 * Get comparative results for a challenge
 *
 * @param {string} challengeId - Challenge ID
 * @param {string} currentUserId - Current user ID
 * @returns {Object} Comparative results
 */
export async function getComparativeResults(challengeId, currentUserId) {
  try {
    const challenge = await getChallengeById(challengeId);

    if (!challenge) {
      return null;
    }

    const participants = challenge.participants || {};
    const participantList = Object.values(participants);

    // Sort by score DESC, then by duration ASC
    participantList.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.duration - b.duration;
    });

    // Find current user's result
    const currentUserResult = participants[currentUserId];

    // Calculate rank
    const rank = participantList.findIndex(p => p.uid === currentUserId) + 1;

    // Get winner
    const winner = participantList[0];

    return {
      challenge,
      participants: participantList,
      currentUserResult,
      rank,
      winner,
      totalParticipants: participantList.length
    };

  } catch (error) {
    console.error('❌ Error getting comparative results:', error);
    return null;
  }
}

/**
 * Get user's challenge history
 *
 * @param {string} userId - User ID
 * @returns {Array} Challenge history
 */
export async function getUserChallengeHistory(userId) {
  try {
    const historyRef = collection(db, 'users', userId, 'challengeHistory');
    const snapshot = await getDocs(historyRef);

    if (snapshot.empty) {
      return [];
    }

    const history = [];

    for (const doc of snapshot.docs) {
      const historyData = doc.data();
      const challengeId = doc.id;

      // Fetch full challenge data
      const challenge = await getChallengeById(challengeId);

      if (challenge) {
        const participants = Object.values(challenge.participants || {});

        // Calculate result
        const currentUserParticipant = challenge.participants[userId];
        const winner = participants.sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return a.duration - b.duration;
        })[0];

        const result = currentUserParticipant?.uid === winner?.uid ? 'won' : 'lost';

        history.push({
          challengeId,
          role: historyData.role,
          result,
          score: historyData.score,
          percentage: historyData.percentage,
          duration: historyData.duration,
          completedAt: historyData.completedAt,
          createdBy: challenge.createdBy,
          difficulty: challenge.difficulty,
          participantCount: participants.length
        });
      }
    }

    // Sort by completedAt DESC
    history.sort((a, b) => {
      const dateA = a.completedAt?.toDate() || new Date(a.completedAt);
      const dateB = b.completedAt?.toDate() || new Date(b.completedAt);
      return dateB - dateA;
    });

    return history;

  } catch (error) {
    console.error('❌ Error fetching challenge history:', error);
    return [];
  }
}

/**
 * Get challenges created by user
 *
 * @param {string} userId - User ID
 * @returns {Array} Challenges created by user
 */
export async function getUserCreatedChallenges(userId) {
  try {
    const challengesRef = collection(db, 'challenges');
    const q = query(
      challengesRef,
      where('createdBy.uid', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

  } catch (error) {
    console.error('❌ Error fetching created challenges:', error);
    return [];
  }
}

/**
 * Get new completions for challenges created by user
 * (for notification badge)
 *
 * @param {string} userId - User ID
 * @returns {number} Count of new completions
 */
export async function getNewChallengeCompletions(userId) {
  try {
    const challenges = await getUserCreatedChallenges(userId);

    let newCompletions = 0;

    for (const challenge of challenges) {
      const participants = Object.values(challenge.participants || {});

      // Count participants who completed after creator (excluding creator)
      const otherParticipants = participants.filter(p => p.uid !== userId);

      newCompletions += otherParticipants.length;
    }

    return newCompletions;

  } catch (error) {
    console.error('❌ Error getting new completions:', error);
    return 0;
  }
}
