/**
 * quizService.js
 */

import { db } from './firebase';
import {
  collection,
  query,
  where,
  getDocs,
  limit,
  addDoc,
  doc,
  updateDoc,
  increment,
  serverTimestamp
} from 'firebase/firestore';
import logger from '../utils/logger';

/**
 * Fetch questions by theme and difficulty
 */
export async function fetchQuestionsByTheme(themeId, difficulty = null) {
  try {
    logger.info('📚 Fetching questions for themeId:', themeId, 'difficulty:', difficulty);

    const questionsRef = collection(db, 'questions');

    let q;
    if (difficulty) {
      q = query(
        questionsRef,
        where('themeId', '==', themeId),
        where('difficulty', '==', difficulty)
      );
    } else {
      q = query(
        questionsRef,
        where('themeId', '==', themeId)
      );
    }

    const querySnapshot = await getDocs(q);

    logger.info('📦 Found questions:', querySnapshot.size);

    if (querySnapshot.empty) {
      logger.warn('⚠️ No questions found');
      return [];
    }

    const questions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    logger.info('✅ Loaded questions:', questions.length);
    return questions;

  } catch (error) {
    logger.error('❌ Error fetching questions:', error);
    throw error;
  }
}

/**
 * Get questions by subject and theme
 * UPDATED for multi-subject architecture
 */
export async function getQuestionsByTheme(subjectId, themeId, limitCount = 100) {
  try {
    logger.info('📚 Fetching questions for subjectId:', subjectId, 'themeId:', themeId);

    const questionsRef = collection(db, 'questions');

    const q = query(
      questionsRef,
      where('subjectId', '==', subjectId),
      where('themeId', '==', themeId)
    );

    const querySnapshot = await getDocs(q);

    logger.info('📦 Found questions:', querySnapshot.size);

    if (querySnapshot.empty) {
      logger.warn('⚠️ No questions found');
      return [];
    }

    const questions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    logger.info('✅ Loaded questions:', questions.length);
    return questions;

  } catch (error) {
    logger.error('❌ Error fetching questions:', error);
    throw error;
  }
}

/**
 * Get questions by difficulty
 */
export async function getQuestionsByDifficulty(difficulty, limitCount = 10) {
  try {
    const questionsRef = collection(db, 'questions');
    const q = query(
      questionsRef,
      where('difficulty', '==', difficulty),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
  } catch (error) {
    logger.error('❌ Error loading questions:', error);
    throw error;
  }
}

/**
 * Shuffle questions
 */
export function shuffleQuestions(questions) {
  return [...questions].sort(() => Math.random() - 0.5);
}

/**
 * Shuffle answers
 */
export function shuffleAnswers(question) {
  return {
    ...question,
    answers: [...question.answers].sort(() => Math.random() - 0.5)
  };
}

/**
 * Save quiz session
 * UPDATED for multi-subject architecture
 * @param {string} userId - User ID
 * @param {string} subjectId - Subject ID
 * @param {string} themeId - Theme ID
 * @param {string} difficulty - Difficulty level
 * @param {number} score - Score achieved
 * @param {number} totalQuestions - Total questions in quiz
 * @param {Array} answersArray - Array of answers
 * @param {number} duration - Duration in seconds
 */
export async function saveQuizSession(userId, subjectId, themeId, difficulty, score, totalQuestions, answersArray, duration) {
  try {
    const maxScore = totalQuestions * 10;
    const percentage = Math.round((score / maxScore) * 100);

    const sessionsRef = collection(db, 'quizSessions');
    const docRef = await addDoc(sessionsRef, {
      userId,
      subjectId,
      themeId,
      difficulty,
      score,
      maxScore,
      percentage,
      answers: answersArray,
      duration,
      createdAt: serverTimestamp()
    });

    logger.info('✅ Quiz session saved:', docRef.id);

    return docRef.id;

  } catch (error) {
    logger.error('❌ Error saving quiz session:', error);
    throw error;
  }
}

/**
 * Update user stats
 * @param {string} userId - User ID
 * @param {number} score - Score achieved
 * @param {number} totalQuestions - Total questions
 */
export async function updateUserStats(userId, score, totalQuestions) {
  try {
    const maxScore = totalQuestions * 10;
    const percentage = Math.round((score / maxScore) * 100);

    const userRef = doc(db, 'users', userId);

    await updateDoc(userRef, {
      'stats.totalQuizzes': increment(1),
      'stats.totalPoints': increment(score),
      'stats.lastQuizDate': serverTimestamp()
    });

    logger.info('✅ User stats updated');

  } catch (error) {
    logger.error('❌ Error updating stats:', error);
  }
}

/**
 * Get user stats
 * @param {string} userId - User ID
 * @returns {Object} User stats object
 */
export async function getUserStats(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDocs(query(collection(db, 'users'), where('__name__', '==', userId)));

    if (userDoc.empty) {
      return {
        totalQuizzes: 0,
        totalPoints: 0,
        averageScore: 0,
        bestScore: 0
      };
    }

    const userData = userDoc.docs[0].data();
    const stats = userData.stats || {};

    // Calculate average score from quiz sessions
    const sessionsRef = collection(db, 'quizSessions');
    const sessionsQuery = query(sessionsRef, where('userId', '==', userId));
    const sessionsSnapshot = await getDocs(sessionsQuery);

    let totalPercentage = 0;
    let maxPercentage = 0;

    sessionsSnapshot.forEach(doc => {
      const session = doc.data();
      totalPercentage += session.percentage || 0;
      maxPercentage = Math.max(maxPercentage, session.percentage || 0);
    });

    const averageScore = sessionsSnapshot.size > 0 ? Math.round(totalPercentage / sessionsSnapshot.size) : 0;

    return {
      totalQuizzes: stats.totalQuizzes || 0,
      totalPoints: stats.totalPoints || 0,
      averageScore,
      bestScore: maxPercentage
    };

  } catch (error) {
    logger.error('❌ Error getting user stats:', error);
    return {
      totalQuizzes: 0,
      totalPoints: 0,
      averageScore: 0,
      bestScore: 0
    };
  }
}

/**
 * TRIVIA MODE: Get random questions from ALL subjects and ALL themes
 * @param {string} difficulty - Difficulty level (easy, medium, hard)
 * @param {number} limitCount - Number of questions to return (default 12)
 * @returns {Array} Array of random questions
 */
export async function getGlobalTriviaQuestions(difficulty, limitCount = 12) {
  try {
    logger.info('🎲 Fetching GLOBAL trivia questions, difficulty:', difficulty);

    const questionsRef = collection(db, 'questions');
    const q = query(
      questionsRef,
      where('difficulty', '==', difficulty)
    );

    const snapshot = await getDocs(q);
    logger.info(`📦 Found ${snapshot.size} questions across all subjects`);

    if (snapshot.empty) {
      logger.warn('⚠️ No questions found for this difficulty');
      return [];
    }

    const allQuestions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Shuffle and take first limitCount
    const shuffled = allQuestions.sort(() => Math.random() - 0.5).slice(0, limitCount);

    logger.info(`✅ Returning ${shuffled.length} random trivia questions`);
    return shuffled;

  } catch (error) {
    logger.error('❌ Error fetching global trivia questions:', error);
    throw error;
  }
}

/**
 * TRIVIA MODE: Get random questions from ALL themes within a specific subject
 * @param {string} subjectId - Subject ID (slug)
 * @param {string} difficulty - Difficulty level (easy, medium, hard)
 * @param {number} limitCount - Number of questions to return (default 12)
 * @returns {Array} Array of random questions
 */
export async function getSubjectTriviaQuestions(subjectId, difficulty, limitCount = 12) {
  try {
    logger.info('🎲 Fetching SUBJECT trivia questions for:', subjectId, 'difficulty:', difficulty);

    const questionsRef = collection(db, 'questions');
    const q = query(
      questionsRef,
      where('subjectId', '==', subjectId),
      where('difficulty', '==', difficulty)
    );

    const snapshot = await getDocs(q);
    logger.info(`📦 Found ${snapshot.size} questions for subject: ${subjectId}`);

    if (snapshot.empty) {
      logger.warn('⚠️ No questions found for this subject and difficulty');
      return [];
    }

    const allQuestions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Shuffle and take first limitCount
    const shuffled = allQuestions.sort(() => Math.random() - 0.5).slice(0, limitCount);

    logger.info(`✅ Returning ${shuffled.length} random trivia questions for ${subjectId}`);
    return shuffled;

  } catch (error) {
    logger.error('❌ Error fetching subject trivia questions:', error);
    throw error;
  }
}