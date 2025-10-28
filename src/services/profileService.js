/**
 * profileService.js
 * 
 * SCOPUL:
 * Funcții pentru a citi date profile din Firestore
 * 
 * FUNCȚII:
 * 1. getUserProfile() - User info + overall stats
 * 2. getProgressByTheme() - Stats pentru fiecare temă
 * 3. getQuizHistory() - Ultimele 10 quiz-uri jucate
 * 4. calculateStats() - Helper pentru calcule
 */

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * FUNCTION 1: Get User Profile
 * 
 * PARAMETRI:
 * - userId: ID-ul utilizatorului
 * 
 * RETURN:
 * {
 *   email: string,
 *   createdAt: timestamp,
 *   stats: {
 *     totalQuizzes: number,
 *     totalPoints: number,
 *     averageScore: number,
 *     bestScore: number,
 *     lastQuizDate: timestamp
 *   }
 * }
 * 
 * EXEMPLU:
 * const profile = await getUserProfile(user.uid);
 * console.log(profile.email, profile.stats.averageScore);
 */
export async function getUserProfile(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      console.log('User not found');
      return null;
    }

    const userData = userDoc.data();
    
    return {
      email: userData.email || 'Unknown',
      displayName: userData.displayName || 'User',
      createdAt: userData.createdAt,
      stats: userData.stats || {
        totalQuizzes: 0,
        totalPoints: 0,
        averageScore: 0,
        bestScore: 0,
        lastQuizDate: null
      }
    };

  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
}

/**
 * FUNCTION 2: Get Progress By Subject
 * UPDATED for multi-subject architecture
 *
 * Returns stats grouped by subject
 */
export async function getProgressBySubject(userId) {
  try {
    // Query: Get all quiz sessions for this user
    const q = query(
      collection(db, 'quizSessions'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);

    // Group by subject
    const subjectMap = {};

    querySnapshot.docs.forEach((doc) => {
      const session = doc.data();
      const { subjectId, percentage, score } = session;

      if (!subjectMap[subjectId]) {
        subjectMap[subjectId] = {
          subjectId,
          sessions: []
        };
      }

      subjectMap[subjectId].sessions.push(session);
    });

    // Convert to array and calculate stats
    const progressArray = [];

    for (const subjectId in subjectMap) {
      const sessions = subjectMap[subjectId].sessions;

      // Fetch subject info from Firestore
      const subjectDocRef = doc(db, 'subjects', subjectId);
      const subjectDoc = await getDoc(subjectDocRef);
      const subjectData = subjectDoc.exists() ? subjectDoc.data() : null;

      const totalQuizzes = sessions.length;
      const totalPoints = sessions.reduce((sum, s) => sum + s.score, 0);
      const averageScore = Math.round(
        sessions.reduce((sum, s) => sum + s.percentage, 0) / totalQuizzes
      );
      const bestScore = Math.max(...sessions.map(s => s.percentage));

      progressArray.push({
        subjectId,
        subjectName: subjectData?.name || 'Unknown',
        subjectIcon: subjectData?.icon || '📚',
        subjectColor: subjectData?.color || '#1982C4',
        totalQuizzes,
        averageScore,
        bestScore,
        totalPoints
      });
    }

    // Sort by total quizzes (desc)
    return progressArray.sort((a, b) => b.totalQuizzes - a.totalQuizzes);

  } catch (error) {
    console.error('Error getting progress by subject:', error);
    throw error;
  }
}

/**
 * FUNCTION 3: Get Progress By Theme
 * 
 * PARAMETRI:
 * - userId: ID-ul utilizatorului
 * 
 * RETURN:
 * Array cu stats per temă:
 * [
 *   {
 *     themeId: "wwi",
 *     themeName: "Primul Război Mondial",
 *     totalQuizzes: 5,
 *     averageScore: 82,
 *     bestScore: 95,
 *     totalPoints: 410,
 *     attempts: [
 *       { difficulty: "easy", count: 2, avgScore: 85 },
 *       { difficulty: "medium", count: 2, avgScore: 80 },
 *       { difficulty: "hard", count: 1, avgScore: 75 }
 *     ]
 *   }
 * ]
 * 
 * EXEMPLU:
 * const progress = await getProgressByTheme(user.uid);
 * progress.forEach(p => console.log(p.themeName, p.averageScore));
 */
export async function getProgressByTheme(userId) {
  try {
    // Query: Get all quiz sessions for this user
    const q = query(
      collection(db, 'quizSessions'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    // Group by theme
    const themeMap = {};
    
    querySnapshot.docs.forEach((doc) => {
      const session = doc.data();
      const { themeId, difficulty, percentage } = session;
      
      if (!themeMap[themeId]) {
        themeMap[themeId] = {
          themeId,
          sessions: [],
          difficulties: {}
        };
      }
      
      themeMap[themeId].sessions.push(session);
      
      // Track by difficulty
      if (!themeMap[themeId].difficulties[difficulty]) {
        themeMap[themeId].difficulties[difficulty] = [];
      }
      themeMap[themeId].difficulties[difficulty].push(percentage);
    });
    
    // Convert to array and calculate stats
    const progressArray = [];

    for (const themeId in themeMap) {
      const themeData = themeMap[themeId];
      const sessions = themeData.sessions;

      // Fetch theme info from Firestore
      const themeDocRef = doc(db, 'themes', themeId);
      const themeDoc = await getDoc(themeDocRef);
      const theme = themeDoc.exists() ? themeDoc.data() : null;

      const totalQuizzes = sessions.length;
      const totalPoints = sessions.reduce((sum, s) => sum + s.score, 0);
      const averageScore = Math.round(
        sessions.reduce((sum, s) => sum + s.percentage, 0) / totalQuizzes
      );
      const bestScore = Math.max(...sessions.map(s => s.percentage));

      // Stats by difficulty
      const attempts = Object.entries(themeData.difficulties).map(([diff, percentages]) => ({
        difficulty: diff,
        count: percentages.length,
        avgScore: Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length)
      }));

      progressArray.push({
        themeId: themeData.themeId,
        themeName: theme?.name || 'Unknown',
        totalQuizzes,
        averageScore,
        bestScore,
        totalPoints,
        attempts: attempts.sort((a, b) => {
          const order = { easy: 0, medium: 1, hard: 2 };
          return order[a.difficulty] - order[b.difficulty];
        })
      });
    }

    // Sort by total quizzes (desc)
    return progressArray.sort((a, b) => b.totalQuizzes - a.totalQuizzes);

  } catch (error) {
    console.error('Error getting progress by theme:', error);
    throw error;
  }
}

/**
 * FUNCTION 3: Get Quiz History
 * 
 * PARAMETRI:
 * - userId: ID-ul utilizatorului
 * - limitCount: Câte quiz-uri să arate (default: 10)
 * 
 * RETURN:
 * Array cu ultimele N quiz-uri:
 * [
 *   {
 *     sessionId: "...",
 *     themeId: "wwi",
 *     themeName: "Primul Război Mondial",
 *     difficulty: "easy",
 *     score: 85,
 *     percentage: 85,
 *     duration: 120,
 *     createdAt: timestamp
 *   }
 * ]
 * 
 * EXEMPLU:
 * const history = await getQuizHistory(user.uid, 10);
 * history.forEach(h => console.log(h.themeName, h.percentage));
 */
export async function getQuizHistory(userId, limitCount = 10) {
  try {
    const q = query(
      collection(db, 'quizSessions'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);

    // Fetch theme names from Firestore
    const history = [];

    for (const docSnap of querySnapshot.docs) {
      const session = docSnap.data();

      // Fetch theme info
      const themeDocRef = doc(db, 'themes', session.themeId);
      const themeDoc = await getDoc(themeDocRef);
      const theme = themeDoc.exists() ? themeDoc.data() : null;

      // Fetch subject info
      const subjectDocRef = doc(db, 'subjects', session.subjectId);
      const subjectDoc = await getDoc(subjectDocRef);
      const subject = subjectDoc.exists() ? subjectDoc.data() : null;

      history.push({
        sessionId: docSnap.id,
        subjectId: session.subjectId,
        subjectName: subject?.name || 'Unknown',
        themeId: session.themeId,
        themeName: theme?.name || 'Unknown',
        difficulty: session.difficulty,
        score: session.score,
        maxScore: session.maxScore,
        percentage: session.percentage,
        duration: session.duration,
        createdAt: session.createdAt
      });
    }

    return history;

  } catch (error) {
    console.error('Error getting quiz history:', error);
    throw error;
  }
}

/**
 * FUNCTION 4: Format Date Helper
 * 
 * Convert Firestore timestamp to readable date
 */
export function formatDate(timestamp) {
  if (!timestamp) return 'N/A';
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('ro-RO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * FUNCTION 5: Format Duration Helper
 * 
 * Convert seconds to "1m 30s" format
 */
export function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

/**
 * EXEMPLU DE UTILIZARE COMPLET - În Profile.jsx:
 * 
 * useEffect(() => {
 *   const loadProfile = async () => {
 *     const profile = await getUserProfile(user.uid);
 *     const progress = await getProgressByTheme(user.uid);
 *     const history = await getQuizHistory(user.uid, 10);
 *     
 *     setUserProfile(profile);
 *     setThemeProgress(progress);
 *     setQuizHistory(history);
 *   };
 *   
 *   loadProfile();
 * }, [user]);
 */