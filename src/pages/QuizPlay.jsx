/**
 * QuizPlay.jsx - REFACTORED to use unified QuizInterface component
 *
 * CHANGES:
 * 1. Uses QuizInterface component for quiz UI
 * 2. Business logic preserved (timer, scoring, saving)
 * 3. Results screen separate (not in QuizInterface)
 */

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BadgeCard } from '../components/BadgeCard';
import { saveQuizSession, updateUserStats, getQuestionsByTheme, getUserStats } from '../services/quizService';
import { checkBadgeAchievements, updateUserStreak } from '../services/badgeService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { QuizInterface } from '../components/quiz/QuizInterface';

/**
 * COMPONENT: QuizPlay
 */
export function QuizPlay() {

  const { subjectSlug, themeSlug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

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

  const [theme, setTheme] = useState(null);
  const [subject, setSubject] = useState(null);

  // Track points earned for current question (for modal display)
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
 * EFFECT: Load subject, theme, and questions from Firestore
 */
useEffect(() => {
  const loadQuizData = async () => {
    try {
      setLoading(true);
      console.log('📚 Loading quiz data for subject:', subjectSlug, 'theme:', themeSlug, 'difficulty:', difficulty);

      // 1. Fetch subject from Firestore
      const subjectDocRef = doc(db, 'subjects', subjectSlug);
      const subjectDoc = await getDoc(subjectDocRef);

      if (!subjectDoc.exists()) {
        console.error('❌ Subject not found!');
        setLoading(false);
        return;
      }

      const subjectData = { id: subjectDoc.id, ...subjectDoc.data() };
      setSubject(subjectData);
      console.log('✅ Subject loaded:', subjectData.name);

      // 2. Fetch theme from Firestore
      const themeDocRef = doc(db, 'themes', themeSlug);
      const themeDoc = await getDoc(themeDocRef);

      if (!themeDoc.exists()) {
        console.error('❌ Theme not found!');
        setLoading(false);
        return;
      }

      const themeData = { id: themeDoc.id, ...themeDoc.data() };
      setTheme(themeData);
      console.log('✅ Theme loaded:', themeData.name);

      // 3. Get ALL questions for theme from Firestore
      const allQuestions = await getQuestionsByTheme(subjectSlug, themeSlug, 100);

      if (!allQuestions || allQuestions.length === 0) {
        console.error('❌ No questions found!');
        setLoading(false);
        return;
      }

      // 4. Filter by difficulty
      const filteredQuestions = allQuestions.filter(
        q => q.difficulty === difficulty
      );

      if (filteredQuestions.length === 0) {
        console.warn('⚠️ No questions for this difficulty');
        setLoading(false);
        return;
      }

      // 5. Shuffle questions & take first 12
      const shuffled = filteredQuestions
        .sort(() => Math.random() - 0.5)
        .slice(0, 12);

      const questionsWithShuffledAnswers = shuffled.map(q => shuffleAnswers(q));

      console.log(`✅ Loaded ${questionsWithShuffledAnswers.length} questions`);
      setQuestions(questionsWithShuffledAnswers);

      setStartTime(Date.now());
      setLoading(false);

    } catch (error) {
      console.error('❌ Error loading quiz data:', error);
      setLoading(false);
    }
  };

  if (subjectSlug && themeSlug && difficulty) {
    loadQuizData();
  }
}, [subjectSlug, themeSlug, difficulty]);

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
  const points = correct ? getDifficultyPoints() : 0;

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
    navigate(`/subjects/${subjectSlug}`);
  }
};

/**
 * HELPER: Get difficulty points (new system: 10/30/50)
 */
const getDifficultyPoints = () => {
  switch (difficulty) {
    case 'easy': return 10;
    case 'medium': return 30;
    case 'hard': return 50;
    default: return 10;
  }
};

/**
 * HELPER: Get difficulty info
 */
const getDifficultyInfo = () => {
  switch (difficulty) {
    case 'easy':
      return { label: 'Ușor', color: '#8B9B7A', emoji: '🟢' };
    case 'medium':
      return { label: 'Mediu', color: '#FF6B00', emoji: '🟡' };
    case 'hard':
      return { label: 'Dificil', color: '#FF0080', emoji: '🔴' };
    default:
      return { label: 'Necunoscut', color: '#2D2416', emoji: '⚪' };
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
  console.log('🏁 Quiz finished!');
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
    const maxScore = questions.length * getDifficultyPoints();
    const percentage = Math.round((score / maxScore) * 100);

    const sessionData = {
      userId: user.uid,
      subjectId: subjectSlug,
      themeId: themeSlug,
      difficulty: difficulty,
      score: score,
      maxScore: maxScore,
      percentage: percentage,
      questionsTotal: questions.length,
      questionsCorrect: answersArray.filter(a => a.correct).length,
      duration: duration,
      answers: answersArray,
      completedAt: new Date()
    };

    await saveQuizSession(sessionData);
    console.log('✅ Quiz session saved');

    await updateUserStats(user.uid, {
      totalQuizzesTaken: 1,
      totalScore: score,
      subjectsPlayed: [subjectSlug],
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
    console.error('❌ Error saving quiz session:', error);
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
          <p className="font-body text-deep-brown text-base">Se încarcă quiz-ul...</p>
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
            Nu am găsit întrebări pentru această temă și dificultate.
          </p>
          <button
            onClick={() => navigate(`/subjects/${subjectSlug}`)}
            className="w-full bg-deep-brown text-off-white border-4 border-deep-brown px-6 py-3 font-heading font-bold uppercase text-base hover:bg-neon-cyan hover:text-deep-brown hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal hover:shadow-deep-brown transition-all duration-150"
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
    const maxScore = questions.length * getDifficultyPoints();
    const percentage = Math.round((score / maxScore) * 100);

    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center p-4 sm:p-8">
        <div className="bg-cream border-6 border-deep-brown p-6 sm:p-8 md:p-12 max-w-2xl w-full">

          {savingSession && (
            <div className="bg-neon-cyan text-deep-brown p-4 mb-6 border-4 border-deep-brown font-heading font-bold text-base">
              ⏳ Se salvează progresul...
            </div>
          )}

          <h1 className="font-heading text-5xl font-black text-center mb-6 sm:mb-8 text-deep-brown uppercase">
            🎉 Quiz Terminat!
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
                🌟 Excelent! Ai înțeles bine această temă!
              </p>
            )}
            {percentage >= 60 && percentage < 80 && (
              <p className="font-heading text-xl font-bold text-neon-orange">
                👍 Bun! Poți încerca din nou pentru a îmbunătăți.
              </p>
            )}
            {percentage < 60 && (
              <p className="font-heading text-xl font-bold text-neon-pink">
                📖 Mai mult de studiat! Revino la teme și recitește.
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
            <p><strong>Temă:</strong> {theme?.name}</p>
            <p><strong>Dificultate:</strong> {difficulty}</p>
            <p><strong>Întrebări:</strong> {questions.length}</p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <button
              onClick={() => navigate(`/subjects/${subjectSlug}`)}
              className="w-full bg-deep-brown text-off-white border-6 border-deep-brown px-6 py-3 sm:py-4 font-heading font-black text-base uppercase hover:bg-neon-cyan hover:text-deep-brown hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal hover:shadow-deep-brown transition-all duration-150"
            >
              ← Înapoi la Tematici
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
  if (questions.length > 0 && !quizFinished) {
    const currentQuestion = questions[currentQuestionIndex];
    const difficultyInfo = getDifficultyInfo();

    return (
      <QuizInterface
        question={currentQuestion}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        score={score}
        selectedAnswer={selectedAnswerIndex}
        isAnswered={answered}
        showExplanation={showExplanationModal}
        onAnswerSelect={handleAnswerSelect}
        onSubmitAnswer={() => {}} // Not needed - handleAnswerSelect already handles submission
        onNextQuestion={handleNextQuestion}
        styleMode="tailwind"
        header={{
          timeLeft: timeLeft,
          onQuit: handleQuit,
          difficulty: difficulty,
          subject: theme?.name
        }}
        points={{
          earned: currentQuestionPoints
        }}
        submitButtonText="Trimite Răspuns"
        nextButtonText="Următoarea Întrebare"
      />
    );
  }

  return null;
}

export default QuizPlay;