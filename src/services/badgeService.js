/**
 * badgeService.js
 *
 * Service pentru badge achievements și streak tracking
 */

import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Get all badge definitions from Firestore
 */
export async function getAllBadges() {
  try {
    const badgesRef = collection(db, 'badges');
    const snapshot = await getDocs(badgesRef);

    const badges = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return badges;
  } catch (error) {
    console.error('Error fetching badges:', error);
    return [];
  }
}

/**
 * Get user's earned badges
 */
export async function getUserBadges(userId) {
  try {
    const userBadgesRef = doc(db, 'users', userId, 'badges', 'earned');
    const userBadgesDoc = await getDoc(userBadgesRef);

    if (!userBadgesDoc.exists()) {
      return [];
    }

    return userBadgesDoc.data().badges || [];
  } catch (error) {
    console.error('Error fetching user badges:', error);
    return [];
  }
}

/**
 * Award a badge to user
 */
export async function awardBadge(userId, badgeId) {
  try {
    const userBadgesRef = doc(db, 'users', userId, 'badges', 'earned');
    const userBadgesDoc = await getDoc(userBadgesRef);

    let earnedBadges = [];
    if (userBadgesDoc.exists()) {
      earnedBadges = userBadgesDoc.data().badges || [];
    }

    // Check if badge already earned
    if (earnedBadges.some(b => b.badgeId === badgeId)) {
      return false; // Already has this badge
    }

    // Add new badge
    earnedBadges.push({
      badgeId,
      earnedAt: new Date()
    });

    await setDoc(userBadgesRef, {
      badges: earnedBadges,
      updatedAt: new Date()
    });

    console.log(`✅ Badge awarded: ${badgeId} to user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error awarding badge:', error);
    return false;
  }
}

/**
 * Check badge requirements and award if met
 */
export async function checkBadgeAchievements(userId) {
  try {
    // Get all badges
    const allBadges = await getAllBadges();

    // Get user stats
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) return [];

    const userData = userDoc.data();
    const stats = userData.stats || {};

    // Get user's quiz sessions
    const sessionsQuery = query(
      collection(db, 'quizSessions'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const sessionsSnapshot = await getDocs(sessionsQuery);
    // Filter out old sessions without subjectId
    const sessions = sessionsSnapshot.docs
      .map(doc => doc.data())
      .filter(s => s.subjectId); // Only include sessions with subjectId

    // Get already earned badges
    const earnedBadges = await getUserBadges(userId);
    const earnedBadgeIds = earnedBadges.map(b => b.badgeId);

    const newBadges = [];

    for (const badge of allBadges) {
      // Skip if already earned
      if (earnedBadgeIds.includes(badge.id)) continue;

      const req = badge.requirement;
      let achieved = false;

      switch (req.type) {
        case 'totalQuizzes':
          achieved = (stats.totalQuizzes || 0) >= req.value;
          break;

        case 'perfectScore':
          achieved = sessions.some(s => s.percentage === 100);
          break;

        case 'averageScore':
          if ((stats.totalQuizzes || 0) >= (req.minQuizzes || 0)) {
            achieved = (stats.averageScore || 0) >= req.value;
          }
          break;

        case 'streak':
          // Check current streak (will implement streak tracking separately)
          const currentStreak = await getCurrentStreak(userId);
          achieved = currentStreak >= req.value;
          break;

        case 'subjectQuizzes':
          const subjectSessions = sessions.filter(s => s.subjectId === req.subjectId);
          achieved = subjectSessions.length >= req.value;
          break;

        case 'difficultyQuizzes':
          const difficultySessions = sessions.filter(s => s.difficulty === req.difficulty);
          achieved = difficultySessions.length >= req.value;
          break;

        case 'fastCompletion':
          achieved = sessions.some(s => s.duration <= req.value);
          break;

        case 'lateNightQuizzes':
          const lateNightSessions = sessions.filter(s => {
            const date = s.createdAt?.toDate();
            if (!date) return false;
            const hour = date.getHours();
            return hour >= 23 || hour < 6;
          });
          achieved = lateNightSessions.length >= req.value;
          break;

        default:
          break;
      }

      if (achieved) {
        const awarded = await awardBadge(userId, badge.id);
        if (awarded) {
          newBadges.push(badge);
        }
      }
    }

    return newBadges;
  } catch (error) {
    console.error('Error checking badge achievements:', error);
    return [];
  }
}

/**
 * Calculate current streak
 */
export async function getCurrentStreak(userId) {
  try {
    const sessionsQuery = query(
      collection(db, 'quizSessions'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(sessionsQuery);
    if (snapshot.empty) return 0;

    const sessions = snapshot.docs.map(doc => ({
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    }));

    // Group sessions by day
    const daysSessions = new Map();

    sessions.forEach(session => {
      if (!session.createdAt) return;

      const dateKey = session.createdAt.toISOString().split('T')[0]; // YYYY-MM-DD
      if (!daysSessions.has(dateKey)) {
        daysSessions.set(dateKey, []);
      }
      daysSessions.get(dateKey).push(session);
    });

    // Calculate streak
    let streak = 0;
    const today = new Date();
    let checkDate = new Date(today);

    while (true) {
      const dateKey = checkDate.toISOString().split('T')[0];

      if (daysSessions.has(dateKey)) {
        streak++;
        // Go to previous day
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        // Streak broken
        break;
      }
    }

    return streak;
  } catch (error) {
    console.error('Error calculating streak:', error);
    return 0;
  }
}

/**
 * Update user streak in profile
 */
export async function updateUserStreak(userId) {
  try {
    const currentStreak = await getCurrentStreak(userId);

    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      'stats.currentStreak': currentStreak,
      'stats.lastStreakUpdate': new Date()
    });

    return currentStreak;
  } catch (error) {
    console.error('Error updating streak:', error);
    return 0;
  }
}
