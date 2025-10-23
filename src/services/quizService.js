/**
 * quizService.js
 * 
 * SCOPUL:
 * Funcții pentru a salva quiz sessions și actualiza statistici user
 * 
 * FOLOSIT ÎN: QuizPlay.jsx (la final de quiz)
 * 
 * FUNCȚII:
 * 1. saveQuizSession() - Salvează session completa
 * 2. updateUserStats() - Actualizează stats user
 * 3. getUserStats() - Citesc stats user
 */

import {
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * FUNCTION 1: Save Quiz Session
 * 
 * PARAMETRI:
 * - userId: ID-ul utilizatorului
 * - themeId: Tema jucată (ex: "wwi")
 * - difficulty: Dificultate (easy, medium, hard)
 * - score: Scor final (ex: 80 puncte)
 * - totalQuestions: Câte întrebări (ex: 10)
 * - answers: Array cu răspunsuri
 * - duration: Durată în secunde
 * 
 * FLOW:
 * 1. Creez obiect sessionData
 * 2. Adaug în Firestore collection "quizSessions"
 * 3. Return sessionId (pentru referință)
 * 
 * EXEMPLU:
 * await saveQuizSession(
 *   user.uid,
 *   "wwi",
 *   "easy",
 *   85,
 *   10,
 *   [{questionId: "q001", selectedAnswer: 0, correct: true}, ...],
 *   150 // 150 secunde
 * );
 */
export async function saveQuizSession(
  userId,
  themeId,
  difficulty,
  score,
  totalQuestions,
  answers,
  duration
) {
  try {
    // Calculez procentajul
    const maxScore = totalQuestions * 10;
    const percentage = Math.round((score / maxScore) * 100);

    // Obiectul sessionului
    const sessionData = {
      userId,                          // Cine a jucat
      themeId,                         // Ce temă
      difficulty,                      // Ce dificultate
      score,                           // Puncte câștigate
      maxScore,                        // Puncte maxime
      percentage,                      // Procentaj
      answers,                         // Detalii răspunsuri
      duration,                        // Durată joc
      startTime: new Date().getTime() - (duration * 1000), // Ora de start
      endTime: new Date().getTime(),   // Ora de final
      createdAt: serverTimestamp()     // Timestamp server (reliable)
    };

    // Adaug în Firestore
    const docRef = await addDoc(
      collection(db, 'quizSessions'),
      sessionData
    );

    console.log('Quiz session saved:', docRef.id);
    return docRef.id; // Return sessionId

  } catch (error) {
    console.error('Error saving quiz session:', error);
    throw error;
  }
}

/**
 * FUNCTION 2: Update User Stats
 * 
 * PARAMETRI:
 * - userId: ID-ul utilizatorului
 * - score: Score din quiz-ul nou
 * - totalQuestions: Câte întrebări în quiz
 * 
 * LOGICĂ:
 * 1. Citesc stats curente ale user-ului
 * 2. Calculez noile stats:
 *    - totalQuizzes += 1
 *    - totalPoints += score
 *    - averageScore = totalPoints / totalQuizzes
 *    - bestScore = max(bestScore, score)
 * 3. Salvez stats actualizate
 * 
 * EXEMPLU:
 * await updateUserStats(user.uid, 85, 10);
 */
export async function updateUserStats(userId, score, totalQuestions) {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // User document nu există - creez cu stats inițiale
      await setDoc(userRef, {
        stats: {
          totalQuizzes: 1,
          totalPoints: score,
          averageScore: Math.round(score / totalQuestions),
          bestScore: Math.round(score / totalQuestions),
          lastQuizDate: serverTimestamp()
        }
      });
      console.log('User stats created');
      return;
    }

    // User document există - actualizez stats
    const currentStats = userDoc.data().stats || {
      totalQuizzes: 0,
      totalPoints: 0,
      averageScore: 0,
      bestScore: 0
    };

    const newTotalQuizzes = currentStats.totalQuizzes + 1;
    const newTotalPoints = currentStats.totalPoints + score;
    const newAverageScore = Math.round(newTotalPoints / newTotalQuizzes);
    const newBestScore = Math.max(currentStats.bestScore, Math.round(score / totalQuestions));

    // Actualizez Firestore
    await updateDoc(userRef, {
      'stats.totalQuizzes': newTotalQuizzes,
      'stats.totalPoints': newTotalPoints,
      'stats.averageScore': newAverageScore,
      'stats.bestScore': newBestScore,
      'stats.lastQuizDate': serverTimestamp()
    });

    console.log('User stats updated:', {
      totalQuizzes: newTotalQuizzes,
      averageScore: newAverageScore,
      bestScore: newBestScore
    });

  } catch (error) {
    console.error('Error updating user stats:', error);
    throw error;
  }
}

/**
 * FUNCTION 3: Get User Stats
 * 
 * PARAMETRI:
 * - userId: ID-ul utilizatorului
 * 
 * RETURN:
 * - stats object sau null dacă nu există
 * 
 * EXEMPLU:
 * const stats = await getUserStats(user.uid);
 * console.log(stats.averageScore); // 82
 */
export async function getUserStats(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      console.log('User not found');
      return null;
    }

    return userDoc.data().stats || {
      totalQuizzes: 0,
      totalPoints: 0,
      averageScore: 0,
      bestScore: 0
    };

  } catch (error) {
    console.error('Error getting user stats:', error);
    throw error;
  }
}

/**
 * FUNCTION 4: Get User Quiz Sessions (Later)
 * 
 * PARAMETRI:
 * - userId: ID-ul utilizatorului
 * 
 * RETURN:
 * - Array cu toate sesiunile quiz ale user-ului
 * 
 * EXEMPLU:
 * const sessions = await getUserQuizSessions(user.uid);
 * sessions.forEach(s => console.log(s.themeId, s.score));
 */
export async function getUserQuizSessions(userId) {
  try {
    // NOTA: Asta necesită query() și where() din firebase
    // Implementez în viitor când avem nevoie pentru Profile page
    // Pentru acum e placeholder
    console.log('getUserQuizSessions - TODO: Implement with query()');
  } catch (error) {
    console.error('Error getting quiz sessions:', error);
    throw error;
  }
}

/**
 * EXEMPLU DE UTILIZARE COMPLET - În QuizPlay.jsx:
 * 
 * Când quiz termină (în handleQuizFinish):
 * 
 * const sessionId = await saveQuizSession(
 *   user.uid,
 *   themeId,
 *   difficulty,
 *   finalScore,
 *   questions.length,
 *   answersArray,
 *   duration
 * );
 * 
 * await updateUserStats(
 *   user.uid,
 *   finalScore,
 *   questions.length
 * );
 * 
 * // Now show results with updated stats
 * const stats = await getUserStats(user.uid);
 * setUserStats(stats);
 */