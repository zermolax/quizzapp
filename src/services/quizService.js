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

/**
 * Fetch questions by theme and difficulty
 */
export async function fetchQuestionsByTheme(themeId, difficulty = null) {
  try {
    console.log('📚 Fetching questions for themeId:', themeId, 'difficulty:', difficulty);

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
    
    console.log('📦 Found questions:', querySnapshot.size);

    if (querySnapshot.empty) {
      console.warn('⚠️ No questions found');
      return [];
    }

    const questions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log('✅ Loaded questions:', questions.length);
    return questions;

  } catch (error) {
    console.error('❌ Error fetching questions:', error);
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
    console.error('❌ Error loading questions:', error);
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
 */
export async function saveQuizSession(userId, sessionData) {
  try {
    const sessionsRef = collection(db, 'quizSessions');
    const docRef = await addDoc(sessionsRef, {
      ...sessionData,
      userId,
      createdAt: serverTimestamp()
    });
    
    console.log('✅ Quiz session saved:', docRef.id);
    
    await updateUserStats(userId, sessionData);
    
    return docRef.id;
    
  } catch (error) {
    console.error('❌ Error saving quiz session:', error);
    throw error;
  }
}

/**
 * Update user stats
 */
export async function updateUserStats(userId, quizData) {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      'stats.totalQuizzes': increment(1),
      'stats.totalPoints': increment(quizData.score || 0),
      'stats.averageScore': quizData.percentage || 0,
      'stats.bestScore': Math.max(quizData.percentage || 0, 0)
    });
    
    console.log('✅ User stats updated');
    
  } catch (error) {
    console.error('❌ Error updating stats:', error);
  }
}