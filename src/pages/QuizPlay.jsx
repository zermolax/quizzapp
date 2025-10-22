/**
 * QuizPlay.jsx
 * 
 * SCOPUL:
 * Pagina principală a jocului quiz.
 * 
 * FLOW EDUCAȚIONAL:
 * 1. Afișez întrebare + 4 răspunsuri (clickable buttons)
 * 2. User click pe răspuns
 * 3. Verific dacă e corect:
 *    - CORECT: Buton devine VERDE ✓
 *    - GREȘIT: Buton devine ROȘU ✗, răspunsul corect devine VERDE
 * 4. Afișez EXPLANATION (2-3 rânduri)
 * 5. PAUZĂ: 3 secunde (timp pentru citire)
 * 6. Automat mergi la următoarea întrebare
 * 7. La final: Rezultat final cu score
 * 
 * TIMING STRATEGY:
 * - 3 secunde: perfect pentru citit explanation (2 rânduri) + digest
 * - Nu prea puțin: user nu se simte grăbit
 * - Nu prea mult: nu se plictisește
 * - Automat: nu trebuie să apese "next" (smooth experience)
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import QuestionCard from '../components/QuestionCard';
import themesData from '../data/themes.json';

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

  /**
   * EFFECT: Load questions for selected theme
   * 
   * FLOW:
   * 1. Component mount sau themeId/difficulty change
   * 2. Importez questions din JSON (dynamic import)
   * 3. Filtrez după difficulty
   * 4. Set state
   */
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        
        // Map tema la fișier
        // Exemplu: themeId "wwi" → "questions-wwi.json"
        const questionFile = `questions-${themeId}.json`;
        
        // Dynamic import - incarcă JSON-ul
        // NOTA: Trebuie ca fișierul să existe în src/data/
        const allQuestions = await import(`../data/${questionFile}`).then(m => m.default);
        
        // Filtrez după difficulty
        const filteredQuestions = allQuestions.filter(q => q.difficulty === difficulty);
        
        // Shuffle întrebări (random order)
        const shuffled = filteredQuestions.sort(() => Math.random() - 0.5);
        
        setQuestions(shuffled.slice(0, 10)); // Limit la 10 întrebări per quiz (MVP)
        setLoading(false);
        
      } catch (error) {
        console.error('Error loading questions:', error);
        // Fallback: arăt error message
        setLoading(false);
      }
    };

    if (themeId && difficulty) {
      loadQuestions();
    }
  }, [themeId, difficulty]);

  /**
   * HANDLER: User selectează răspuns
   * 
   * FLOW:
   * 1. User click pe buton (index 0-3)
   * 2. Setez selectedAnswerIndex
   * 3. Verific dacă e correct
   * 4. Setez answered = true (disabledeze butoanele)
   * 5. Arăt explanation
   * 6. PAUZĂ: 3 secunde
   * 7. Automat merge la următoarea întrebare
   */
  const handleAnswerClick = (answerIndex) => {
    // Dacă deja a răspuns, ignore
    if (answered) return;

    setSelectedAnswerIndex(answerIndex);
    
    const currentQuestion = questions[currentQuestionIndex];
    const isAnswerCorrect = currentQuestion.answers[answerIndex].correct;
    
    setIsCorrect(isAnswerCorrect);
    setAnswered(true);
    setShowExplanation(true);

    // Incrementez score dacă corect
    if (isAnswerCorrect) {
      setScore(score + 10); // +10 puncte per întrebare corectă
    }

    // PAUZĂ: 3 secunde
    // După 3 secunde, automat mergi la următoarea întrebare
    setTimeout(() => {
      handleNextQuestion();
    }, 5000); // 3 secunde - TIMING PERFECT
  };

  /**
   * HANDLER: Merge la următoarea întrebare
   * 
   * Logică:
   * - Dacă mai sunt întrebări: merge la următoarea
   * - Dacă nu mai sunt: quiz finished
   */
  const handleNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex < questions.length) {
      // Reset state pentru următoarea întrebare
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswerIndex(null);
      setAnswered(false);
      setShowExplanation(false);
      setIsCorrect(false);
    } else {
      // Quiz terminat!
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
   */
  if (quizFinished) {
    const percentage = Math.round((score / (questions.length * 10)) * 100);
    const theme = themesData.find(t => t.id === themeId);

    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-pink-600">
        <div className="bg-white rounded-lg shadow-2xl p-8 text-center max-w-md">
          
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

          {/* Quiz stats */}
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
              // Refresh current quiz
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
 * GAME FLOW COMPLET - TIMELINE:
 * 
 * T=0s: Question appears
 *       - 4 answer buttons visible
 *       - User can click
 *       - Score visible
 * 
 * T=0.2s: User clicks answer
 *         - selectedAnswerIndex se setează
 *         - answered = true (buttons disabled)
 * 
 * T=0.3s: Visual feedback appears
 *         - Clicked button: RED or GREEN
 *         - Correct answer: GREEN (dacă greșit)
 *         - Explanation text appears
 * 
 * T=0.5s-3.0s: PAUSE for reading
 *              - Explanation visible
 *              - No interaction possible
 *              - Timer running silently
 *              - User reads explanation
 * 
 * T=3.0s: Auto-advance
 *         - Reset state
 *         - Next question loads
 *         - Back to T=0s
 * 
 * TIMING ANALYSIS:
 * - 2-3 líneas de explanation ≈ 6-10 seconds to read properly
 * - BUT: User already knows answer (corect/greșit), so reading is faster
 * - 3 seconds = perfect balance:
 *   * Enough to read and digest
 *   * Fast enough to maintain engagement
 *   * Not frustrating
 *   * Not boring
 * 
 * PSYCHOLOGY:
 * - Immediate feedback (0.2s): Satisfying
 * - Explanation (3s): Educational
 * - Auto-advance: No decision fatigue
 * - No "next button": Smooth, game-like feel
 * 
 * EDUCATIONAL VALUE:
 * - Answer validation: Learn immediately if wrong
 * - Explanation: Understand WHY (critical for learning)
 * - Pause: Time to think and digest
 * - Visual feedback: Reinforces learning
 */