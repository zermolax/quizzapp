/**
 * QuizPlay.jsx - UPDATED cu Firestore Integration
 * 
 * NOUTĂȚI:
 * 1. Import quizService functions
 * 2. Track answers array (pentru salvare)
 * 3. Track start time (pentru duration)
 * 4. La final: saveQuizSession() + updateUserStats()
 * 5. Display user stats în results screen
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import QuestionCard from '../components/QuestionCard';
import { saveQuizSession, updateUserStats } from '../services/quizService';

/**
 * COMPONENT: QuizPlay
 */
export function QuizPlay() {
  
  /**
   * HOOKS
   */
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  /**
   * EXTRACT PARAMS FROM URL
   * URL format: /quiz?themeId=wwi&difficulty=easy
   */
  const themeId = searchParams.get('themeId');
  const difficulty = searchParams.get('difficulty');

  /**
   * STATE VARIABLES
   */
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  
  // NEW: Track answers array for saving
  const [answersArray, setAnswersArray] = useState([]);
  
  // NEW: Track start time for duration
  const [startTime, setStartTime] = useState(null);
  
  // NEW: User stats display
  const [userStats, setUserStats] = useState(null);
  const [savingSession, setSavingSession] = useState(false);

/**
 * EFFECT: Load questions from Firestore when theme changes
 */
useEffect(() => {
  const loadQuestions = async () => {
    try {
      setLoading(true);
      console.log('📚 Loading questions for theme:', themeId, 'difficulty:', difficulty);
      
      // Import function from quizService
      const { getQuestionsByTheme } = await import('../services/quizService');
      
      // Get ALL questions for theme from Firestore
      const allQuestions = await getQuestionsByTheme(themeId, 100);
      
      if (!allQuestions || allQuestions.length === 0) {
        console.error('❌ No questions found!');
        setLoading(false);
        return;
      }
      
      // Filter by difficulty
      const filteredQuestions = allQuestions.filter(
        q => q.difficulty === difficulty
      );
      
      if (filteredQuestions.length === 0) {
        console.warn('⚠️ No questions for this difficulty');
        setLoading(false);
        return;
      }
      
      // Shuffle & take first 10
      const shuffled = filteredQuestions
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);
      
      console.log(`✅ Loaded ${shuffled.length} questions`);
      setQuestions(shuffled);
      
      // Set start time when quiz begins
      setStartTime(Date.now());
      setLoading(false);
      
    } catch (error) {
      console.error('❌ Error loading questions:', error);
      setLoading(false);
    }
  };
  
  // Load only if we have both theme and difficulty
  if (themeId && difficulty) {
    loadQuestions();
  }
}, [themeId, difficulty]);

  /**
   * HANDLER: User selectează răspuns
   * 
   * MODIFIED: Track answer în answersArray
   */
  const handleAnswerClick = (answerIndex) => {
    if (answered) return;

    setSelectedAnswerIndex(answerIndex);
    
    const currentQuestion = questions[currentQuestionIndex];
    const isAnswerCorrect = currentQuestion.answers[answerIndex].correct;
    
    setIsCorrect(isAnswerCorrect);
    setAnswered(true);
    setShowExplanation(true);

    // NEW: Add answer to array for saving
    const answerData = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      selectedAnswerIndex: answerIndex,
      selectedAnswer: currentQuestion.answers[answerIndex].text,
      correct: isAnswerCorrect,
      correctAnswer: currentQuestion.answers.find(a => a.correct).text,
      explanation: currentQuestion.explanation
    };
    
    setAnswersArray([...answersArray, answerData]);

    // Increment score if correct
    if (isAnswerCorrect) {
      setScore(score + 10);
    }

    // PAUZĂ: 3 secunde - schimbat din 3000 la 4000 daca vrei
    setTimeout(() => {
      handleNextQuestion();
    }, 4000);
  };

  /**
   * HANDLER: Merge la următoarea întrebare
   */
  const handleNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswerIndex(null);
      setAnswered(false);
      setShowExplanation(false);
      setIsCorrect(false);
    } else {
      // NEW: Quiz terminat - apelezi saveQuizSession
      handleQuizFinish();
    }
  };

  /**
   * NEW FUNCTION: Handle Quiz Finish
   * 
   * FLOW:
   * 1. Calculate duration
   * 2. Save session în Firestore
   * 3. Update user stats
   * 4. Fetch updated stats
   * 5. Set quizFinished = true
   */
  const handleQuizFinish = async () => {
    try {
      setSavingSession(true);

      // Calculate duration
      const endTime = Date.now();
      const duration = Math.round((endTime - startTime) / 1000); // seconds

      console.log('Saving quiz session...', {
        userId: user.uid,
        themeId,
        difficulty,
        score,
        totalQuestions: questions.length,
        duration
      });

      // Save quiz session
      await saveQuizSession(
        user.uid,
        themeId,
        difficulty,
        score,
        questions.length,
        answersArray,
        duration
      );

      // Update user stats
      await updateUserStats(
        user.uid,
        score,
        questions.length
      );

      // Fetch updated stats
      const stats = await getUserStats(user.uid);
      setUserStats(stats);

      console.log('Session saved and stats updated');
      setSavingSession(false);
      setQuizFinished(true);

    } catch (error) {
      console.error('Error finishing quiz:', error);
      setSavingSession(false);
      // Still show results even if save failed
      setQuizFinished(true);
    }
  };

  /**
   * HANDLER: Back to themes
   */
  const handleBackToThemes = () => {
    navigate('/themes');
  };

  /**
   * RENDER: Loading state
   */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Se încarcă întrebările...</p>
        </div>
      </div>
    );
  }

  /**
   * RENDER: Error state (fișier not found)
   */
  if (questions.length === 0 && !loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">⚠️ Eroare</h2>
          <p className="text-gray-600 mb-6">
            Întrebările pentru această temă nu au fost încărcate încă.
          </p>
          <button
            onClick={handleBackToThemes}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
          >
            ← Înapoi la Tematici
          </button>
        </div>
      </div>
    );
  }

  /**
   * RENDER: Quiz finished - Results
   * 
   * MODIFIED: Arată user stats dacă disponibile
   */
  if (quizFinished) {
    const percentage = Math.round((score / (questions.length * 10)) * 100);
    const theme = themesData.find(t => t.id === themeId);

    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-pink-600">
        <div className="bg-white rounded-lg shadow-2xl p-8 text-center max-w-md">
          
          {/* Saving indicator */}
          {savingSession && (
            <div className="mb-4 bg-blue-100 p-3 rounded text-blue-700">
              ⏳ Se salvează progresul...
            </div>
          )}

          {/* Score Display */}
          <h1 className="text-4xl font-bold text-purple-600 mb-2">
            🎉 Quiz Terminat!
          </h1>
          
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg mb-6">
            <p className="text-gray-600 text-sm mb-2">Scor final</p>
            <p className="text-5xl font-bold text-purple-600">{percentage}%</p>
            <p className="text-gray-600 text-sm mt-2">
              {score} / {questions.length * 10} puncte
            </p>
          </div>

          {/* Performance message */}
          <div className="mb-6">
            {percentage >= 80 && (
              <p className="text-lg font-semibold text-green-600">
                🌟 Excelent! Ai înțeles bine această temă!
              </p>
            )}
            {percentage >= 60 && percentage < 80 && (
              <p className="text-lg font-semibold text-yellow-600">
                👍 Bun! Poți încerca din nou pentru a îmbunătăți.
              </p>
            )}
            {percentage < 60 && (
              <p className="text-lg font-semibold text-orange-600">
                📖 Mai mult de studiat! Revino la teme și recitește.
              </p>
            )}
          </div>

          {/* NEW: User Stats */}
          {userStats && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-6 text-sm">
              <p className="font-bold text-blue-900 mb-3">📊 Statistici personale:</p>
              <div className="grid grid-cols-2 gap-2 text-left">
                <div>
                  <p className="text-xs text-gray-600">Quiz-uri jucate</p>
                  <p className="text-xl font-bold text-blue-600">{userStats.totalQuizzes}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Scor mediu</p>
                  <p className="text-xl font-bold text-blue-600">{userStats.averageScore}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Cel mai bun scor</p>
                  <p className="text-xl font-bold text-green-600">{userStats.bestScore}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Puncte totale</p>
                  <p className="text-xl font-bold text-purple-600">{userStats.totalPoints}</p>
                </div>
              </div>
            </div>
          )}

          {/* Quiz info */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6 text-sm">
            <p className="text-gray-600">
              <strong>Temă:</strong> {theme?.name}
            </p>
            <p className="text-gray-600">
              <strong>Dificultate:</strong> {difficulty}
            </p>
            <p className="text-gray-600">
              <strong>Întrebări:</strong> {questions.length}
            </p>
          </div>

          {/* Buttons */}
          <button
            onClick={() => navigate('/themes')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg mb-3 transition"
          >
            ← Înapoi la Tematici
          </button>
          
          <button
            onClick={() => {
              window.location.reload();
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            🔄 Încearcă din nou
          </button>

        </div>
      </div>
    );
  }

  /**
   * RENDER: Quiz in progress
   */
  if (questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const theme = themesData.find(t => t.id === themeId);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        
        {/* HEADER */}
        <header className="max-w-2xl mx-auto mb-6">
          <div className="flex justify-between items-center bg-white rounded-lg shadow p-4">
            <div>
              <h1 className="text-xl font-bold text-blue-600">{theme?.name}</h1>
              <p className="text-sm text-gray-600">Dificultate: {difficulty}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">{score}</p>
              <p className="text-xs text-gray-600">puncte</p>
            </div>
          </div>
        </header>

        {/* PROGRESS BAR */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-semibold text-gray-700">
              Întrebarea {currentQuestionIndex + 1} / {questions.length}
            </p>
            <p className="text-sm text-gray-600">
              {answered ? '✅ Răspuns' : '⏳ Așteapt...'}
            </p>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`
              }}
            />
          </div>
        </div>

        {/* QUESTION CARD */}
        <div className="max-w-2xl mx-auto">
          <QuestionCard
            question={currentQuestion}
            onAnswerClick={handleAnswerClick}
            selectedAnswerIndex={selectedAnswerIndex}
            answered={answered}
            isCorrect={isCorrect}
            showExplanation={showExplanation}
          />
        </div>

      </div>
    );
  }

  return null;
}

export default QuizPlay;

/**
 * NOUTĂȚI IMPLEMENTATE:
 * 
 * 1. Import quizService functions
 * 2. State: answersArray, startTime, userStats, savingSession
 * 3. handleAnswerClick: Adaug answer la answersArray
 * 4. handleQuizFinish: 
 *    - Calculate duration
 *    - Save session
 *    - Update stats
 *    - Fetch stats
 * 5. Results screen: Arăt userStats
 * 
 * FLOW COMPLET:
 * 1. User termină quiz
 * 2. handleQuizFinish se apelează
 * 3. Duration se calculează
 * 4. saveQuizSession() trimite la Firestore
 * 5. updateUserStats() actualizează stats
 * 6. getUserStats() citesc stats
 * 7. Results screen arată stats
 * 
 * FIRESTORE DATA SAVED:
 * 
 * Collection: quizSessions
 * └─ {sessionId}/
 *    ├── userId: "lXbfRG6eSSXMGKSGD134LohyKWq1"
 *    ├── themeId: "wwi"
 *    ├── difficulty: "easy"
 *    ├── score: 85
 *    ├── maxScore: 100
 *    ├── percentage: 85
 *    ├── answers: [...]
 *    ├── duration: 120 (secunde)
 *    └── createdAt: 2024-10-22T10:30:00Z
 * 
 * Collection: users/{userId}
 * └─ stats/
 *    ├── totalQuizzes: 5
 *    ├── totalPoints: 420
 *    ├── averageScore: 84
 *    ├── bestScore: 90
 *    └── lastQuizDate: 2024-10-22T10:30:00Z
 */