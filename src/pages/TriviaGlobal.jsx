/**
 * TriviaGlobal.jsx - TRIVIA MODE (Global - toate disciplinele)
 *
 * Întrebări RANDOM din TOATE disciplinele și tematicile
 * Similar cu QuizPlay.jsx dar cu logică diferită de încărcare
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BadgeCard } from '../components/BadgeCard';
import { saveQuizSession, updateUserStats, getGlobalTriviaQuestions, getUserStats } from '../services/quizService';
import { checkBadgeAchievements, updateUserStreak } from '../services/badgeService';
import { getPointsForDifficulty, getDifficultyInfo as getDifficultyConfig } from '../constants/scoring';

/**
 * COMPONENT: TriviaGlobal
 */
export function TriviaGlobal() {

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const difficulty = searchParams.get('difficulty') || 'medium';

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
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const [answersArray, setAnswersArray] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [savingSession, setSavingSession] = useState(false);
  const [newBadgesEarned, setNewBadgesEarned] = useState([]);
  const [sessionStreak, setSessionStreak] = useState(0);

  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(true);

  const [currentQuestionPoints, setCurrentQuestionPoints] = useState(0);

/**
 * HELPER: Shuffle answers for a question
 */
const shuffleAnswers = (question) => {
  const shuffledAnswers = [...question.answers].sort(() => Math.random() - 0.5);
  return {
    ...question,
    answers: shuffledAnswers
  };
};

/**
 * EFFECT: Load GLOBAL TRIVIA questions from Firestore
 */
useEffect(() => {
  const loadTriviaQuestions = async () => {
    try {
      setLoading(true);
      console.log('🎲 Loading GLOBAL TRIVIA questions, difficulty:', difficulty);

      // Get random questions from ALL subjects
      const triviaQuestions = await getGlobalTriviaQuestions(difficulty, 12);

      if (!triviaQuestions || triviaQuestions.length === 0) {
        console.error('❌ No trivia questions found!');
        setLoading(false);
        return;
      }

      // Shuffle answers for each question
      const questionsWithShuffledAnswers = triviaQuestions.map(q => shuffleAnswers(q));

      console.log(`✅ Loaded ${questionsWithShuffledAnswers.length} trivia questions`);
      setQuestions(questionsWithShuffledAnswers);

      setStartTime(Date.now());
      setLoading(false);

    } catch (error) {
      console.error('❌ Error loading trivia questions:', error);
      setLoading(false);
    }
  };

  if (difficulty) {
    loadTriviaQuestions();
  }
}, [difficulty]);

/**
 * EFFECT: Countdown timer for each question
 */
useEffect(() => {
  if (!timerActive || answered || questions.length === 0) {
    return;
  }

  const timer = setInterval(() => {
    setTimeLeft((prevTime) => {
      if (prevTime <= 1) {
        handleTimeOut();
        return 0;
      }
      return prevTime - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [timerActive, answered, currentQuestionIndex, questions.length]);

/**
 * HANDLER: Time out - auto-submit as incorrect
 */
const handleTimeOut = () => {
  if (answered) return;

  console.log('⏰ Time out!');

  const currentQuestion = questions[currentQuestionIndex];

  setAnswered(true);
  setIsCorrect(false);
  setShowExplanationModal(true);
  setTimerActive(false);
  setCurrentQuestionPoints(0);

  const answerData = {
    questionId: currentQuestion.id,
    question: currentQuestion.question,
    selectedAnswerIndex: null,
    selectedAnswer: 'TIMEOUT - Nu a răspuns',
    correct: false,
    correctAnswer: currentQuestion.answers.find(a => a.correct).text,
    explanation: currentQuestion.explanation
  };

  setAnswersArray([...answersArray, answerData]);
};

/**
 * HANDLER: Answer selection
 */
const handleAnswerSelect = (answerIndex) => {
  if (answered) return;

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = currentQuestion.answers[answerIndex];
  const correct = selectedAnswer.correct;

  setSelectedAnswerIndex(answerIndex);
  setAnswered(true);
  setIsCorrect(correct);
  setTimerActive(false);

  // Calculate points (new system: 10/30/50 - no time bonus)
  const points = correct ? getPointsForDifficulty(difficulty) : 0;

  setCurrentQuestionPoints(points);

  if (correct) {
    setScore(score + points);
  }

  // Save answer
  const answerData = {
    questionId: currentQuestion.id,
    question: currentQuestion.question,
    selectedAnswerIndex: answerIndex,
    selectedAnswer: selectedAnswer.text,
    correct: correct,
    correctAnswer: currentQuestion.answers.find(a => a.correct).text,
    explanation: currentQuestion.explanation,
    timeLeft: timeLeft,
    pointsEarned: points
  };

  setAnswersArray([...answersArray, answerData]);

  // Show modal after short delay
  setTimeout(() => {
    setShowExplanationModal(true);
  }, 500);
};

/**
 * HANDLER: Next question
 */
const handleNextQuestion = () => {
  setShowExplanationModal(false);

  if (currentQuestionIndex < questions.length - 1) {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setSelectedAnswerIndex(null);
    setAnswered(false);
    setIsCorrect(false);
    setTimeLeft(30);
    setTimerActive(true);
  } else {
    finishQuiz();
  }
};

/**
 * HANDLER: Quit quiz
 */
const handleQuit = () => {
  if (window.confirm('Sigur vrei să părăsești quiz-ul? Progresul va fi pierdut.')) {
    navigate('/subjects');
  }
};


/**
 * HELPER: Get answer letter (A, B, C, D)
 */
const getAnswerLetter = (index) => {
  return String.fromCharCode(65 + index); // 65 = 'A'
};

/**
 * HANDLER: Finish quiz and save session
 */
const finishQuiz = async () => {
  console.log('🏁 Trivia finished!');
  setQuizFinished(true);
  setSavingSession(true);

  if (!user) {
    console.log('⚠️ No user logged in, skipping save.');
    setSavingSession(false);
    return;
  }

  try {
    const endTime = Date.now();
    const duration = Math.floor((endTime - startTime) / 1000);
    const maxScore = questions.length * getPointsForDifficulty(difficulty);
    const percentage = Math.round((score / maxScore) * 100);

    const sessionData = {
      userId: user.uid,
      subjectId: 'trivia-global', // Special ID for trivia global
      themeId: 'trivia-global',
      difficulty: difficulty,
      score: score,
      maxScore: maxScore,
      percentage: percentage,
      questionsTotal: questions.length,
      questionsCorrect: answersArray.filter(a => a.correct).length,
      duration: duration,
      answers: answersArray,
      completedAt: new Date(),
      mode: 'trivia-global' // Flag pentru trivia mode
    };

    await saveQuizSession(sessionData);
    console.log('✅ Trivia session saved');

    await updateUserStats(user.uid, {
      totalQuizzesTaken: 1,
      totalScore: score,
      subjectsPlayed: ['trivia-global'],
      lastPlayedAt: new Date()
    });
    console.log('✅ User stats updated');

    const stats = await getUserStats(user.uid);
    setUserStats(stats);

    const newBadges = await checkBadgeAchievements(user.uid);
    if (newBadges.length > 0) {
      setNewBadgesEarned(newBadges);
      console.log('🏅 New badges earned:', newBadges);
    }

    const streakDays = await updateUserStreak(user.uid);
    setSessionStreak(streakDays);
    console.log('🔥 Current streak:', streakDays);

    setSavingSession(false);

  } catch (error) {
    console.error('❌ Error saving trivia session:', error);
    setSavingSession(false);
  }
};

  /**
   * RENDER: Loading state
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-body text-deep-brown text-base">Se încarcă trivia...</p>
        </div>
      </div>
    );
  }

  /**
   * RENDER: No questions found
   */
  if (!loading && questions.length === 0) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center p-4 sm:p-8">
        <div className="bg-cream border-6 border-error p-6 sm:p-8 max-w-md w-full">
          <h2 className="text-3xl font-heading font-black uppercase text-error mb-4">
            ⚠️ Eroare
          </h2>
          <p className="font-body text-deep-brown mb-6 text-base">
            Nu am găsit întrebări pentru această dificultate în trivia global.
          </p>
          <button
            onClick={() => navigate('/subjects')}
            className="w-full bg-deep-brown text-off-white border-4 border-deep-brown px-6 py-3 font-heading font-bold uppercase text-base hover:bg-neon-cyan hover:text-deep-brown hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal hover:shadow-deep-brown transition-all duration-150"
          >
            ← Înapoi
          </button>
        </div>
      </div>
    );
  }

  /**
   * RENDER: Quiz finished - Results
   */
  if (quizFinished) {
    const maxScore = questions.length * getPointsForDifficulty(difficulty);
    const percentage = Math.round((score / maxScore) * 100);

    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center p-4 sm:p-8">
        <div className="bg-cream border-6 border-deep-brown p-6 sm:p-8 md:p-12 max-w-2xl w-full">

          {savingSession && (
            <div className="bg-neon-cyan text-deep-brown p-4 mb-6 border-4 border-deep-brown font-heading font-bold text-base">
              ⏳ Se salvează progresul...
            </div>
          )}

          <div className="text-center mb-6">
            <span className="inline-block bg-gradient-to-r from-neon-pink via-neon-orange to-neon-cyan text-deep-brown px-4 py-2 font-heading font-black text-sm uppercase tracking-wide mb-4">
              🎲 TRIVIA GLOBAL
            </span>
          </div>

          <h1 className="font-heading text-5xl font-black text-center mb-6 sm:mb-8 text-deep-brown uppercase">
            🎉 Trivia Terminat!
          </h1>

          <div className="bg-deep-brown text-neon-lime p-6 sm:p-8 border-6 border-deep-brown mb-6 sm:mb-8 text-center">
            <p className="font-mono text-sm font-bold mb-2 text-off-white uppercase">
              SCOR FINAL
            </p>
            <p className="font-heading text-7xl font-black text-neon-lime">
              {percentage}%
            </p>
            <p className="font-mono text-lg font-bold text-sand mt-2">
              {score} / {maxScore} puncte
            </p>
          </div>

          {/* Performance message */}
          <div className="mb-6 sm:mb-8 text-center">
            {percentage === 100 && (
              <p className="font-heading text-xl font-bold text-[#10B981]">
                🌟 {difficulty === 'hard'
                  ? 'Felicitări! Ești pregătit pentru tema următoare!'
                  : 'Felicitari! Ai știut tot! Acum încearcă nivelul următor!'}
              </p>
            )}
            {percentage >= 80 && percentage < 100 && (
              <p className="font-heading text-xl font-bold text-[#10B981]">
                🌟 Excelent! Cunoștințe impresionante!
              </p>
            )}
            {percentage >= 60 && percentage < 80 && (
              <p className="font-heading text-xl font-bold text-neon-orange">
                👍 Bun! Încearcă din nou pentru a îmbunătăți!
              </p>
            )}
            {percentage < 60 && (
              <p className="font-heading text-xl font-bold text-neon-pink">
                📖 Mai mult de învățat! Continuă să exersezi!
              </p>
            )}
          </div>

          {/* User Stats */}
          {userStats && (
            <div className="bg-sand border-4 border-warm-brown p-4 sm:p-6 mb-6 sm:mb-8">
              <p className="font-heading text-lg font-black mb-3 sm:mb-4 text-deep-brown uppercase">
                📊 Statistici
              </p>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 font-body text-sm text-deep-brown">
                <div>
                  <strong>Total quiz-uri:</strong> {userStats.totalQuizzesTaken || 0}
                </div>
                <div>
                  <strong>Scor total:</strong> {userStats.totalScore || 0}
                </div>
                <div>
                  <strong>Streak curent:</strong> {sessionStreak} zile 🔥
                </div>
                <div>
                  <strong>Discipline:</strong> {userStats.subjectsPlayed?.length || 0}
                </div>
              </div>
            </div>
          )}

          {/* New badges earned */}
          {newBadgesEarned.length > 0 && (
            <div className="bg-neon-lime border-4 border-deep-brown p-4 sm:p-6 mb-6 sm:mb-8">
              <p className="font-heading text-lg font-black mb-3 sm:mb-4 text-deep-brown uppercase">
                🏅 Insigne Noi Câștigate!
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {newBadgesEarned.map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
              </div>
            </div>
          )}

          {/* Quiz details */}
          <div className="bg-cream border-4 border-sand p-4 sm:p-6 mb-6 sm:mb-8 font-body text-sm text-deep-brown space-y-2">
            <p><strong>Mod:</strong> Trivia Global (Toate Disciplinele)</p>
            <p><strong>Dificultate:</strong> {difficulty}</p>
            <p><strong>Întrebări:</strong> {questions.length}</p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <button
              onClick={() => navigate('/subjects')}
              className="w-full bg-deep-brown text-off-white border-6 border-deep-brown px-6 py-3 sm:py-4 font-heading font-black text-base uppercase hover:bg-neon-cyan hover:text-deep-brown hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal hover:shadow-deep-brown transition-all duration-150"
            >
              ← Înapoi la Discipline
            </button>

            <button
              onClick={() => window.location.reload()}
              className="w-full bg-[#10B981] text-deep-brown border-6 border-[#10B981] px-6 py-3 sm:py-4 font-heading font-black text-base uppercase hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal hover:shadow-deep-brown transition-all duration-150"
            >
              🔄 Încearcă din nou
            </button>
          </div>

        </div>
      </div>
    );
  }

  /**
   * RENDER: Quiz in progress
   */
  if (questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const difficultyInfo = getDifficultyConfig(difficulty);
    const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-off-white font-body">

        {/* FIXED HEADER - RESPONSIVE */}
        <header className="fixed top-0 left-0 right-0 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 bg-off-white border-b-4 border-deep-brown z-50">
          <nav className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 sm:gap-4">
            {/* Left side */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={handleQuit}
                className="bg-transparent border-3 border-deep-brown text-deep-brown px-3 sm:px-4 py-2 font-heading font-bold text-sm uppercase hover:bg-neon-pink hover:text-off-white hover:border-neon-pink transition-all duration-150"
              >
                ✕ <span className="hidden sm:inline">Quit</span>
              </button>

              <div className="font-mono text-sm font-bold uppercase tracking-wider text-deep-brown">
                <span className="hidden sm:inline">🎲 TRIVIA GLOBAL • </span>{difficultyInfo.emoji}
              </div>
            </div>

            {/* Right side - Score */}
            <div className="bg-deep-brown text-neon-lime px-3 sm:px-6 py-2 border-4 border-deep-brown font-mono text-lg font-bold">
              {score} pts
            </div>
          </nav>
        </header>

        {/* MAIN QUIZ CONTENT */}
        <main className="pt-20 sm:pt-24 lg:pt-28 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">

            {/* Progress Bar */}
            <div className="mb-6 sm:mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="font-mono text-sm font-bold uppercase text-deep-brown">
                  Întrebarea {currentQuestionIndex + 1} / {questions.length}
                </span>
                <span className="font-mono text-sm font-bold text-deep-brown">
                  {Math.round(progressPercent)}%
                </span>
              </div>
              <div className="h-3 sm:h-4 bg-sand border-3 border-deep-brown">
                <div
                  className="h-full bg-gradient-to-r from-neon-pink via-neon-orange to-neon-cyan transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Timer & Difficulty */}
            <div className="flex flex-wrap gap-3 sm:gap-4 justify-between items-center mb-6 sm:mb-8">
              {/* Timer */}
              <div className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 border-4 ${
                timeLeft <= 10 ? 'bg-error border-error text-white animate-pulse' : 'bg-cream border-warm-brown text-deep-brown'
              }`}>
                <span className="text-3xl">⏱️</span>
                <span className="font-mono text-4xl font-black">
                  {timeLeft}s
                </span>
              </div>

              {/* Difficulty Badge */}
              <div
                className="px-4 sm:px-6 py-2 sm:py-3 border-4 border-deep-brown font-heading font-bold text-sm uppercase text-off-white"
                style={{ backgroundColor: difficultyInfo.color }}
              >
                {difficultyInfo.emoji} {difficultyInfo.label}
              </div>
            </div>

            {/* Subject/Theme Badge for current question */}
            {currentQuestion.subjectId && (
              <div className="mb-4">
                <span className="inline-block bg-neon-cyan text-deep-brown px-3 py-1 font-mono text-xs font-bold uppercase">
                  📚 {currentQuestion.subjectId}
                </span>
              </div>
            )}

            {/* Question Card */}
            <div className="bg-cream border-6 border-deep-brown p-6 sm:p-8 md:p-12 mb-6 sm:mb-8">
              <h2 className="font-heading text-4xl font-black text-deep-brown leading-tight mb-6 sm:mb-8">
                {currentQuestion.question}
              </h2>

              {/* Answers Grid - RESPONSIVE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {currentQuestion.answers.map((answer, index) => {
                  const isSelected = selectedAnswerIndex === index;
                  const isCorrectAnswer = answer.correct;
                  const showResult = answered;

                  let bgColor = 'bg-off-white';
                  let borderColor = 'border-deep-brown';
                  let textColor = 'text-deep-brown';

                  if (showResult) {
                    if (isCorrectAnswer) {
                      bgColor = 'bg-[#10B981]';
                      borderColor = 'border-deep-brown';
                      textColor = 'text-off-white';
                    } else if (isSelected && !isCorrectAnswer) {
                      bgColor = 'bg-error';
                      borderColor = 'border-error';
                      textColor = 'text-off-white';
                    }
                  } else if (isSelected) {
                    bgColor = 'bg-sand';
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={answered}
                      className={`${bgColor} ${textColor} border-4 ${borderColor} p-4 sm:p-5 md:p-6 text-left font-body text-lg font-semibold transition-all duration-150 disabled:cursor-not-allowed hover:enabled:-translate-x-1 hover:enabled:-translate-y-1 hover:enabled:shadow-brutal hover:enabled:shadow-deep-brown`}
                    >
                      <span className="font-mono font-black text-lg mr-2 sm:mr-3">
                        {getAnswerLetter(index)}.
                      </span>
                      {answer.text}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </main>

        {/* EXPLANATION MODAL - RESPONSIVE */}
        {showExplanationModal && (
          <div className="fixed inset-0 bg-deep-brown/90 flex items-center justify-center z-[2000] p-4 animate-fadeIn">
            <div className="bg-cream border-6 border-deep-brown max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
              {/* Modal Header */}
              <div className="p-4 sm:p-6 md:p-8 border-b-4 border-deep-brown flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <div
                  className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-3xl border-4 border-deep-brown flex-shrink-0 ${
                    isCorrect ? 'bg-[#10B981]' : 'bg-neon-pink'
                  }`}
                >
                  {isCorrect ? '✓' : '✗'}
                </div>

                <div>
                  <h3 className="font-heading text-3xl font-black text-deep-brown mb-1 sm:mb-2">
                    {isCorrect ? 'Răspuns corect!' : 'Răspuns greșit'}
                  </h3>
                  <p className={`font-mono text-lg font-bold ${
                    isCorrect ? 'text-[#10B981]' : 'text-neon-pink'
                  }`}>
                    {isCorrect ? `+${currentQuestionPoints} puncte` : '+0 puncte'}
                  </p>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-4 sm:p-6 md:p-8">
                <div className="mb-4 sm:mb-6">
                  <div className="font-heading text-sm font-bold uppercase tracking-wide text-warm-brown mb-2 sm:mb-3">
                    Răspuns corect
                  </div>
                  <div className="bg-[#10B981] p-3 sm:p-4 border-4 border-deep-brown font-body text-base font-semibold text-deep-brown">
                    {getAnswerLetter(currentQuestion.answers.findIndex(a => a.correct))}. {currentQuestion.answers.find(a => a.correct).text}
                  </div>
                </div>

                <div>
                  <div className="font-heading text-sm font-bold uppercase tracking-wide text-warm-brown mb-2 sm:mb-3">
                    Explicație
                  </div>
                  <div className="bg-sand p-3 sm:p-4 border-4 border-warm-brown font-body text-base leading-relaxed text-deep-brown">
                    {currentQuestion.explanation}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-6 md:p-8 border-t-4 border-deep-brown flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="bg-deep-brown text-off-white border-6 border-deep-brown px-6 sm:px-8 py-3 sm:py-4 font-heading font-black text-base uppercase hover:bg-neon-lime hover:text-deep-brown hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal hover:shadow-deep-brown transition-all duration-150"
                >
                  Următoarea Întrebare →
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Tailwind Animations */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }

          .animate-fadeIn {
            animation: fadeIn 0.3s ease;
          }

          .animate-slideUp {
            animation: slideUp 0.3s ease;
          }
        `}</style>

      </div>
    );
  }

  return null;
}

export default TriviaGlobal;
