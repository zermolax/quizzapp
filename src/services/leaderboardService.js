/**
 * leaderboardService.js
 * 
 * SCOPUL:
 * Funcții pentru a citi date leaderboard din Firestore
 * 
 * FUNCȚII:
 * 1. getGlobalLeaderboard() - Top 100 users (global)
 * 2. getThemeLeaderboard(themeId) - Top 100 per temă
 * 3. getUserRank() - Randul user-ului (global + per temă)
 * 4. getLeaderboardWithUserHighlight() - Top + user highlighted
 */

import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  where,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';
import themesData from '../data/themes.json';

/**
 * FUNCTION 1: Get Global Leaderboard
 * 
 * PARAMETRI:
 * - limitCount: Câți top users (default: 100)
 * 
 * RETURN:
 * Array cu top users:
 * [
 *   {
 *     rank: 1,
 *     userId: "uid123",
 *     email: "alex@example.com",
 *     totalPoints: 5420,
 *     totalQuizzes: 45,
 *     averageScore: 85,
 *     medal: "🥇"
 *   },
 *   ...
 * ]
 * 
 * EXEMPLU:
 * const leaderboard = await getGlobalLeaderboard(100);
 * console.log(leaderboard[0].email); // Top user
 */
export async function getGlobalLeaderboard(limitCount = 100) {
  try {
    // Query: Get users sorted by totalPoints (descending)
    const q = query(
      collection(db, 'users'),
      orderBy('stats.totalPoints', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    
    const leaderboard = querySnapshot.docs.map((doc, index) => {
      const userData = doc.data();
      const rank = index + 1;
      
      // Assign medals for top 3
      let medal = '';
      if (rank === 1) medal = '🥇';
      else if (rank === 2) medal = '🥈';
      else if (rank === 3) medal = '🥉';
      
      return {
        rank,
        userId: doc.id,
        email: userData.email || 'Unknown',
        displayName: userData.displayName || 'User',
        totalPoints: userData.stats?.totalPoints || 0,
        totalQuizzes: userData.stats?.totalQuizzes || 0,
        averageScore: userData.stats?.averageScore || 0,
        bestScore: userData.stats?.bestScore || 0,
        medal
      };
    });
    
    return leaderboard;

  } catch (error) {
    console.error('Error getting global leaderboard:', error);
    throw error;
  }
}

/**
 * FUNCTION 2: Get Theme Leaderboard
 * 
 * PARAMETRI:
 * - themeId: ID temei (ex: "wwi")
 * - limitCount: Câți top users (default: 50)
 * 
 * RETURN:
 * Array cu top users pe tema respectivă
 * [
 *   {
 *     rank: 1,
 *     userId: "uid123",
 *     email: "alex@example.com",
 *     themeName: "Primul Război Mondial",
 *     totalQuizzes: 8,
 *     averageScore: 87,
 *     bestScore: 95,
 *     totalPoints: 870,
 *     medal: "🥇"
 *   },
 *   ...
 * ]
 * 
 * EXEMPLU:
 * const wwiLeaderboard = await getThemeLeaderboard("wwi", 50);
 */
export async function getThemeLeaderboard(themeId, limitCount = 50) {
  try {
    // Query: Get all quiz sessions for this theme
    const q = query(
      collection(db, 'quizSessions'),
      where('themeId', '==', themeId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    // Group by userId and calculate stats
    const userStatsMap = {};
    
    querySnapshot.docs.forEach((doc) => {
      const session = doc.data();
      const { userId, percentage, score } = session;
      
      if (!userStatsMap[userId]) {
        userStatsMap[userId] = {
          userId,
          totalQuizzes: 0,
          totalPoints: 0,
          scores: [],
          maxScore: 0
        };
      }
      
      userStatsMap[userId].totalQuizzes += 1;
      userStatsMap[userId].totalPoints += score;
      userStatsMap[userId].scores.push(percentage);
      userStatsMap[userId].maxScore = Math.max(userStatsMap[userId].maxScore, percentage);
    });
    
    // Convert to array and get user emails
    const leaderboardPromises = Object.values(userStatsMap).map(async (userData) => {
      try {
        const userRef = doc(db, 'users', userData.userId);
        const userDoc = await getDoc(userRef);
        const userInfo = userDoc.exists() ? userDoc.data() : {};
        
        return {
          userId: userData.userId,
          email: userInfo.email || 'Unknown',
          displayName: userInfo.displayName || 'User',
          totalQuizzes: userData.totalQuizzes,
          averageScore: Math.round(
            userData.scores.reduce((a, b) => a + b, 0) / userData.scores.length
          ),
          bestScore: userData.maxScore,
          totalPoints: userData.totalPoints
        };
      } catch (err) {
        console.error('Error fetching user info:', err);
        return null;
      }
    });
    
    const leaderboardData = await Promise.all(leaderboardPromises);
    
    // Filter nulls and sort by totalPoints
    const sortedLeaderboard = leaderboardData
      .filter(item => item !== null)
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, limitCount)
      .map((item, index) => {
        const rank = index + 1;
        let medal = '';
        if (rank === 1) medal = '🥇';
        else if (rank === 2) medal = '🥈';
        else if (rank === 3) medal = '🥉';
        
        const theme = themesData.find(t => t.id === themeId);
        
        return {
          rank,
          ...item,
          themeName: theme?.name || 'Unknown',
          medal
        };
      });
    
    return sortedLeaderboard;

  } catch (error) {
    console.error('Error getting theme leaderboard:', error);
    throw error;
  }
}

/**
 * FUNCTION 3: Get User Global Rank
 * 
 * PARAMETRI:
 * - userId: ID-ul utilizatorului
 * 
 * RETURN:
 * {
 *   rank: 47,
 *   totalUsers: 150,
 *   userPoints: 850,
 *   percentile: 68  // Top 68%
 * }
 * 
 * EXEMPLU:
 * const myRank = await getUserGlobalRank(user.uid);
 * console.log(`Ești pe locul ${myRank.rank} din ${myRank.totalUsers}`);
 */
export async function getUserGlobalRank(userId) {
  try {
    // Get all users sorted by points
    const q = query(
      collection(db, 'users'),
      orderBy('stats.totalPoints', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    let userRank = null;
    let userPoints = 0;
    let totalUsers = querySnapshot.size;
    
    querySnapshot.docs.forEach((doc, index) => {
      if (doc.id === userId) {
        userRank = index + 1;
        userPoints = doc.data().stats?.totalPoints || 0;
      }
    });
    
    if (!userRank) {
      // User not in leaderboard (no quizzes yet)
      return {
        rank: null,
        totalUsers,
        userPoints: 0,
        percentile: 100 // Worst position
      };
    }
    
    const percentile = Math.round(((totalUsers - userRank) / totalUsers) * 100);
    
    return {
      rank: userRank,
      totalUsers,
      userPoints,
      percentile
    };

  } catch (error) {
    console.error('Error getting user rank:', error);
    throw error;
  }
}

/**
 * FUNCTION 4: Get Theme Rank
 * 
 * Similar cu getUserGlobalRank dar pentru o temă specifică
 */
export async function getUserThemeRank(userId, themeId) {
  try {
    const themeLeaderboard = await getThemeLeaderboard(themeId, 1000);
    
    const userPosition = themeLeaderboard.find(u => u.userId === userId);
    
    if (!userPosition) {
      return {
        rank: null,
        totalParticipants: themeLeaderboard.length,
        userPoints: 0,
        percentile: 100
      };
    }
    
    const percentile = Math.round(
      ((themeLeaderboard.length - userPosition.rank) / themeLeaderboard.length) * 100
    );
    
    return {
      rank: userPosition.rank,
      totalParticipants: themeLeaderboard.length,
      userPoints: userPosition.totalPoints,
      percentile
    };

  } catch (error) {
    console.error('Error getting user theme rank:', error);
    throw error;
  }
}

/**
 * FUNCTION 5: Get Leaderboard with User Highlighted
 * 
 * Dacă user-ul nu e în top 100, arată top 100 + user-ul
 */
export async function getLeaderboardWithUserHighlight(userId, limitCount = 100) {
  try {
    const globalLeaderboard = await getGlobalLeaderboard(limitCount);
    
    // Check dacă user e în leaderboard
    const isUserInLeaderboard = globalLeaderboard.some(u => u.userId === userId);
    
    if (isUserInLeaderboard) {
      return globalLeaderboard;
    }
    
    // User nu e în top, așa că îl adaug
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return globalLeaderboard;
    }
    
    const userData = userDoc.data();
    const userRank = await getUserGlobalRank(userId);
    
    // Creez user card
    const userCard = {
      rank: userRank.rank,
      userId,
      email: userData.email || 'Unknown',
      displayName: userData.displayName || 'User',
      totalPoints: userData.stats?.totalPoints || 0,
      totalQuizzes: userData.stats?.totalQuizzes || 0,
      averageScore: userData.stats?.averageScore || 0,
      bestScore: userData.stats?.bestScore || 0,
      medal: '',
      isCurrentUser: true
    };
    
    // Add la final
    return [...globalLeaderboard, userCard];

  } catch (error) {
    console.error('Error getting leaderboard with user highlight:', error);
    throw error;
  }
}

/**
 * EXEMPLU DE UTILIZARE - În Leaderboard.jsx:
 * 
 * useEffect(() => {
 *   const loadLeaderboard = async () => {
 *     if (activeTab === 'global') {
 *       const lb = await getLeaderboardWithUserHighlight(user.uid);
 *       setLeaderboard(lb);
 *     } else {
 *       const lb = await getThemeLeaderboard(selectedTheme);
 *       setLeaderboard(lb);
 *     }
 *   };
 *   
 *   loadLeaderboard();
 * }, [activeTab, selectedTheme, user]);
 */