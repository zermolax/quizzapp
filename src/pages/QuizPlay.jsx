/**
 * QuizPlay.jsx - REFACTORED with Bold Design + Modal Explanation
 *
 * CHANGES:
 * 1. Modal pop-up for answer explanation (instead of inline panel)
 * 2. Bold/brutalist design system applied
 * 3. CSS variables for consistent styling
 * 4. Improved UX with modal overlay
 */

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BadgeCard } from '../components/BadgeCard';
import { saveQuizSession, updateUserStats, getQuestionsByTheme, getUserStats } from '../services/quizService';
import { checkBadgeAchievements, updateUserStreak } from '../services/badgeService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

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
   * HANDLER: User selectează răspuns
   */
  const handleAnswerClick = (answerIndex) => {
    if (answered) return;

    setTimerActive(false);
    setSelectedAnswerIndex(answerIndex);

    const currentQuestion = questions[currentQuestionIndex];
    const isAnswerCorrect = currentQuestion.answers[answerIndex].correct;

    setIsCorrect(isAnswerCorrect);
    setAnswered(true);

    // Calculate points based on time left
    const points = isAnswerCorrect ? Math.max(50, timeLeft * 5) : 0;
    setCurrentQuestionPoints(points);

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
      setScore(score + points);
    }

    // Show modal with animation delay
    setTimeout(() => {
      setShowExplanationModal(true);
    }, 500);
  };

  /**
   * HANDLER: Next question from modal
   */
  const handleNextQuestion = () => {
    setShowExplanationModal(false);

    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswerIndex(null);
      setAnswered(false);
      setIsCorrect(false);
      setCurrentQuestionPoints(0);

      setTimeLeft(30);
      setTimerActive(true);
    } else {
      handleQuizFinish();
    }
  };

  /**
   * HANDLER: Handle Quiz Finish
   */
  const handleQuizFinish = async () => {
    try {
      setSavingSession(true);

      const endTime = Date.now();
      const duration = Math.round((endTime - startTime) / 1000);

      console.log('Saving quiz session...', {
        userId: user.uid,
        subjectId: subjectSlug,
        themeId: themeSlug,
        difficulty,
        score,
        totalQuestions: questions.length,
        duration
      });

      await saveQuizSession(
        user.uid,
        subjectSlug,
        themeSlug,
        difficulty,
        score,
        questions.length,
        answersArray,
        duration
      );

      await updateUserStats(
        user.uid,
        score,
        questions.length
      );

      const stats = await getUserStats(user.uid);
      setUserStats(stats);

      console.log('🎖️ Checking for badge achievements...');
      const newBadges = await checkBadgeAchievements(user.uid);

      if (newBadges.length > 0) {
        console.log('🎉 New badges earned:', newBadges);
        setNewBadgesEarned(newBadges);
      }

      const currentStreak = await updateUserStreak(user.uid);
      console.log('🔥 Current streak:', currentStreak, 'days');
      setSessionStreak(currentStreak);

      console.log('Session saved and stats updated');
      setSavingSession(false);
      setQuizFinished(true);

    } catch (error) {
      console.error('Error finishing quiz:', error);
      setSavingSession(false);
      setQuizFinished(true);
    }
  };

  /**
   * HANDLER: Quit quiz
   */
  const handleQuit = () => {
    if (window.confirm('Sigur vrei să părăsești quiz-ul? Progresul nu va fi salvat.')) {
      navigate(`/subjects/${subjectSlug}`);
    }
  };

  /**
   * HELPER: Get difficulty display info
   */
  const getDifficultyInfo = () => {
    switch (difficulty) {
      case 'easy':
        return { label: 'EASY', color: 'var(--sage)', emoji: '🟢' };
      case 'medium':
        return { label: 'MEDIUM', color: 'var(--neon-orange)', emoji: '🟡' };
      case 'hard':
        return { label: 'HARD', color: 'var(--neon-pink)', emoji: '🔴' };
      default:
        return { label: 'MEDIUM', color: 'var(--neon-orange)', emoji: '🟡' };
    }
  };

  /**
   * HELPER: Get answer button style
   */
  const getAnswerButtonStyle = (answerIndex) => {
    const answer = questions[currentQuestionIndex]?.answers[answerIndex];
    if (!answer) return {};

    if (!answered) {
      return {
        background: 'var(--off-white)',
        border: '5px solid var(--deep-brown)',
        color: 'var(--deep-brown)'
      };
    }

    // Correct answer selected
    if (selectedAnswerIndex === answerIndex && isCorrect) {
      return {
        background: 'var(--neon-green)',
        border: '5px solid var(--neon-green)',
        color: 'var(--deep-brown)'
      };
    }

    // Wrong answer selected
    if (selectedAnswerIndex === answerIndex && !isCorrect) {
      return {
        background: 'var(--neon-pink)',
        border: '5px solid var(--neon-pink)',
        color: 'var(--off-white)'
      };
    }

    // Show correct answer if user got it wrong
    if (answer.correct && !isCorrect) {
      return {
        background: 'var(--neon-green)',
        border: '5px solid var(--neon-green)',
        color: 'var(--deep-brown)'
      };
    }

    // Other answers after submission
    return {
      background: 'var(--sand)',
      border: '5px solid var(--warm-brown)',
      color: 'var(--warm-brown)',
      opacity: 0.6
    };
  };

  /**
   * HELPER: Get answer letter
   */
  const getAnswerLetter = (index) => {
    return String.fromCharCode(65 + index); // A, B, C, D
  };

  /**
   * RENDER: Loading state
   */
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--off-white)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '6px solid var(--sand)',
            borderTop: '6px solid var(--deep-brown)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--deep-brown)'
          }}>
            Se încarcă quiz-ul...
          </p>
        </div>
      </div>
    );
  }

  /**
   * RENDER: Error state
   */
  if (questions.length === 0 && !loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--off-white)',
        padding: '2rem'
      }}>
        <div style={{
          background: 'var(--cream)',
          border: '6px solid var(--deep-brown)',
          padding: '3rem',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '2rem',
            fontWeight: 900,
            color: 'var(--neon-pink)',
            marginBottom: '1.5rem'
          }}>
            ⚠️ Eroare
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: 'var(--deep-brown)',
            marginBottom: '2rem'
          }}>
            Întrebările pentru această temă nu au fost încărcate încă.
          </p>
          <button
            onClick={() => navigate(`/subjects/${subjectSlug}`)}
            style={{
              background: 'var(--deep-brown)',
              color: 'var(--off-white)',
              border: '6px solid var(--deep-brown)',
              padding: '1rem 2rem',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 900,
              fontSize: '1rem',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--neon-cyan)';
              e.currentTarget.style.color = 'var(--deep-brown)';
              e.currentTarget.style.transform = 'translate(-5px, -5px)';
              e.currentTarget.style.boxShadow = '5px 5px 0 var(--deep-brown)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--deep-brown)';
              e.currentTarget.style.color = 'var(--off-white)';
              e.currentTarget.style.transform = 'translate(0, 0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
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
    const maxScore = questions.length * 150; // Max points per question
    const percentage = Math.round((score / maxScore) * 100);

    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--off-white)',
        padding: '2rem 5%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'var(--cream)',
          border: '6px solid var(--deep-brown)',
          padding: '3rem',
          maxWidth: '600px',
          width: '100%'
        }}>

          {savingSession && (
            <div style={{
              background: 'var(--neon-cyan)',
              color: 'var(--deep-brown)',
              padding: '1rem',
              marginBottom: '2rem',
              border: '4px solid var(--deep-brown)',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700
            }}>
              ⏳ Se salvează progresul...
            </div>
          )}

          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '3rem',
            fontWeight: 900,
            textAlign: 'center',
            marginBottom: '2rem',
            color: 'var(--deep-brown)'
          }}>
            🎉 Quiz Terminat!
          </h1>

          <div style={{
            background: 'var(--deep-brown)',
            color: 'var(--neon-lime)',
            padding: '2rem',
            border: '6px solid var(--deep-brown)',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <p style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.875rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
              color: 'var(--off-white)'
            }}>
              SCOR FINAL
            </p>
            <p style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '4rem',
              fontWeight: 900,
              color: 'var(--neon-lime)'
            }}>
              {percentage}%
            </p>
            <p style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '1.125rem',
              fontWeight: 700,
              color: 'var(--sand)'
            }}>
              {score} / {maxScore} puncte
            </p>
          </div>

          {/* Performance message */}
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            {percentage >= 80 && (
              <p style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--neon-green)'
              }}>
                🌟 Excelent! Ai înțeles bine această temă!
              </p>
            )}
            {percentage >= 60 && percentage < 80 && (
              <p style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--neon-orange)'
              }}>
                👍 Bun! Poți încerca din nou pentru a îmbunătăți.
              </p>
            )}
            {percentage < 60 && (
              <p style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--neon-pink)'
              }}>
                📖 Mai mult de studiat! Revino la teme și recitește.
              </p>
            )}
          </div>

          {/* User Stats */}
          {userStats && (
            <div style={{
              background: 'var(--sand)',
              border: '4px solid var(--warm-brown)',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <p style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '1rem',
                fontWeight: 900,
                marginBottom: '1rem',
                color: 'var(--deep-brown)'
              }}>
                📊 Statistici personale
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem'
              }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--warm-brown)', marginBottom: '0.25rem' }}>
                    Quiz-uri jucate
                  </p>
                  <p style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'var(--deep-brown)'
                  }}>
                    {userStats.totalQuizzes}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--warm-brown)', marginBottom: '0.25rem' }}>
                    Scor mediu
                  </p>
                  <p style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'var(--deep-brown)'
                  }}>
                    {userStats.averageScore}%
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--warm-brown)', marginBottom: '0.25rem' }}>
                    Cel mai bun scor
                  </p>
                  <p style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'var(--neon-green)'
                  }}>
                    {userStats.bestScore}%
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--warm-brown)', marginBottom: '0.25rem' }}>
                    Puncte totale
                  </p>
                  <p style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'var(--deep-brown)'
                  }}>
                    {userStats.totalPoints}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Streak Display */}
          {sessionStreak > 0 && (
            <div style={{
              background: 'var(--neon-orange)',
              border: '4px solid var(--deep-brown)',
              padding: '1.5rem',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔥</div>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.875rem',
                fontWeight: 700,
                color: 'var(--deep-brown)',
                marginBottom: '0.25rem'
              }}>
                STREAK ACTUAL
              </p>
              <p style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '2.5rem',
                fontWeight: 900,
                color: 'var(--deep-brown)'
              }}>
                {sessionStreak} {sessionStreak === 1 ? 'zi' : 'zile'}
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--deep-brown)', marginTop: '0.5rem' }}>
                {sessionStreak >= 7
                  ? '🎯 Impresionant! Continui să înveți în fiecare zi!'
                  : sessionStreak >= 3
                  ? '👏 Foarte bine! Continuă așa!'
                  : '💪 Joacă în fiecare zi pentru a-ți crește streak-ul!'}
              </p>
            </div>
          )}

          {/* Badges Earned */}
          {newBadgesEarned.length > 0 && (
            <div style={{
              background: 'var(--neon-lime)',
              border: '4px solid var(--deep-brown)',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <p style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '1.25rem',
                fontWeight: 900,
                marginBottom: '1rem',
                textAlign: 'center',
                color: 'var(--deep-brown)'
              }}>
                🎖️ Badge-uri noi câștigate!
              </p>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '1rem'
              }}>
                {newBadgesEarned.map((badge) => (
                  <div key={badge.id} style={{ transform: 'scale(0.9)' }}>
                    <BadgeCard
                      badge={badge}
                      earned={true}
                      earnedAt={new Date()}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quiz info */}
          <div style={{
            background: 'var(--sand)',
            border: '4px solid var(--warm-brown)',
            padding: '1.5rem',
            marginBottom: '2rem',
            fontSize: '0.875rem'
          }}>
            <p style={{ marginBottom: '0.5rem', color: 'var(--deep-brown)' }}>
              <strong>Temă:</strong> {theme?.name}
            </p>
            <p style={{ marginBottom: '0.5rem', color: 'var(--deep-brown)' }}>
              <strong>Dificultate:</strong> {difficulty}
            </p>
            <p style={{ color: 'var(--deep-brown)' }}>
              <strong>Întrebări:</strong> {questions.length}
            </p>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button
              onClick={() => navigate(`/subjects/${subjectSlug}`)}
              style={{
                background: 'var(--deep-brown)',
                color: 'var(--off-white)',
                border: '6px solid var(--deep-brown)',
                padding: '1rem 2rem',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 900,
                fontSize: '1rem',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--neon-cyan)';
                e.currentTarget.style.color = 'var(--deep-brown)';
                e.currentTarget.style.transform = 'translate(-5px, -5px)';
                e.currentTarget.style.boxShadow = '5px 5px 0 var(--deep-brown)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--deep-brown)';
                e.currentTarget.style.color = 'var(--off-white)';
                e.currentTarget.style.transform = 'translate(0, 0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              ← Înapoi la Tematici
            </button>

            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'var(--neon-green)',
                color: 'var(--deep-brown)',
                border: '6px solid var(--neon-green)',
                padding: '1rem 2rem',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 900,
                fontSize: '1rem',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(-5px, -5px)';
                e.currentTarget.style.boxShadow = '5px 5px 0 var(--deep-brown)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(0, 0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
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
    const difficultyInfo = getDifficultyInfo();
    const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--off-white)',
        fontFamily: 'Inter, sans-serif'
      }}>

        {/* FIXED HEADER */}
        <header style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          padding: '1.5rem 5%',
          background: 'var(--off-white)',
          borderBottom: '4px solid var(--deep-brown)',
          zIndex: 1000
        }}>
          <nav style={{
            maxWidth: '1600px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <button
                onClick={handleQuit}
                style={{
                  background: 'transparent',
                  border: '3px solid var(--deep-brown)',
                  color: 'var(--deep-brown)',
                  padding: '0.5rem 1.5rem',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700,
                  fontSize: '1rem',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--neon-pink)';
                  e.currentTarget.style.color = 'var(--off-white)';
                  e.currentTarget.style.borderColor = 'var(--neon-pink)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--deep-brown)';
                  e.currentTarget.style.borderColor = 'var(--deep-brown)';
                }}
              >
                ✕ Quit
              </button>

              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.875rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--deep-brown)'
              }}>
                {theme?.name} • {difficultyInfo.label}
              </div>
            </div>

            <div style={{
              background: 'var(--deep-brown)',
              color: 'var(--neon-lime)',
              padding: '0.75rem 2rem',
              border: '4px solid var(--deep-brown)',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '1.5rem',
              fontWeight: 700
            }}>
              <span id="scoreValue">{score}</span> pts
            </div>
          </nav>
        </header>

        {/* QUIZ CONTAINER */}
        <main style={{
          minHeight: '100vh',
          padding: '8rem 5% 4rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ maxWidth: '1000px', width: '100%' }}>

            {/* PROGRESS BAR CONTAINER */}
            <div style={{ marginBottom: '3rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <div style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  color: 'var(--deep-brown)'
                }}>
                  Întrebarea <span id="currentQuestion">{currentQuestionIndex + 1}</span> / <span id="totalQuestions">{questions.length}</span>
                </div>

                <div style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: timeLeft <= 10 ? 'var(--neon-pink)' : 'var(--neon-orange)',
                  animation: timeLeft <= 10 ? 'pulse 0.5s infinite' : 'none'
                }}>
                  {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>
              </div>

              <div style={{
                height: '20px',
                background: 'var(--sand)',
                border: '4px solid var(--deep-brown)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  background: 'var(--neon-lime)',
                  transition: 'width 0.3s ease',
                  width: `${progressPercent}%`,
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)'
                  }}></div>
                </div>
              </div>
            </div>

            {/* QUESTION CARD */}
            <div style={{
              background: 'var(--cream)',
              border: '6px solid var(--deep-brown)',
              padding: '4rem',
              marginBottom: '3rem',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '12px',
                background: difficultyInfo.color
              }}></div>

              <div style={{
                display: 'inline-block',
                background: difficultyInfo.color,
                color: 'var(--off-white)',
                padding: '0.5rem 1.5rem',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 900,
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '2rem'
              }}>
                {difficultyInfo.emoji} {difficultyInfo.label}
              </div>

              <h2 style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '2rem',
                fontWeight: 900,
                lineHeight: 1.3,
                marginBottom: '1rem',
                color: 'var(--deep-brown)'
              }}>
                {currentQuestion.question}
              </h2>

              {currentQuestion.hint && (
                <p style={{
                  fontSize: '1.125rem',
                  color: 'var(--warm-brown)',
                  fontStyle: 'italic'
                }}>
                  {currentQuestion.hint}
                </p>
              )}
            </div>

            {/* ANSWERS GRID */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '2rem'
            }}>
              {currentQuestion.answers.map((answer, index) => {
                const buttonStyle = getAnswerButtonStyle(index);
                const letter = getAnswerLetter(index);
                const isSelected = selectedAnswerIndex === index;
                const isCorrectAnswer = answer.correct;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerClick(index)}
                    disabled={answered}
                    data-letter={letter}
                    style={{
                      ...buttonStyle,
                      padding: '2.5rem 2rem',
                      textAlign: 'left',
                      cursor: answered ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '1.125rem',
                      fontWeight: 600
                    }}
                    onMouseEnter={(e) => {
                      if (!answered) {
                        e.currentTarget.style.transform = 'translate(-5px, -5px)';
                        e.currentTarget.style.boxShadow = '5px 5px 0 var(--deep-brown)';
                        const letterEl = e.currentTarget.querySelector('.answer-letter');
                        if (letterEl) {
                          letterEl.style.background = 'var(--neon-cyan)';
                          letterEl.style.color = 'var(--deep-brown)';
                        }
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!answered) {
                        e.currentTarget.style.transform = 'translate(0, 0)';
                        e.currentTarget.style.boxShadow = 'none';
                        const letterEl = e.currentTarget.querySelector('.answer-letter');
                        if (letterEl) {
                          letterEl.style.background = 'var(--deep-brown)';
                          letterEl.style.color = 'var(--off-white)';
                        }
                      }
                    }}
                  >
                    <div
                      className="answer-letter"
                      style={{
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                        width: '40px',
                        height: '40px',
                        background: answered && isCorrectAnswer ? 'var(--deep-brown)' :
                                    answered && isSelected && !isCorrectAnswer ? 'var(--deep-brown)' :
                                    'var(--deep-brown)',
                        color: answered && isCorrectAnswer ? 'var(--neon-green)' :
                               answered && isSelected && !isCorrectAnswer ? 'var(--neon-pink)' :
                               'var(--off-white)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontWeight: 900,
                        fontSize: '1.25rem',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {answered && isCorrectAnswer ? '✓' :
                       answered && isSelected && !isCorrectAnswer ? '✗' :
                       letter}
                    </div>

                    <div style={{ paddingLeft: '3rem', paddingTop: '0.5rem' }}>
                      {answer.text}
                    </div>
                  </button>
                );
              })}
            </div>

          </div>
        </main>

        {/* EXPLANATION MODAL */}
        {showExplanationModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '1rem',
            animation: 'fadeIn 0.3s ease'
          }}>
            <div style={{
              background: 'var(--cream)',
              border: '6px solid var(--deep-brown)',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              animation: 'slideUp 0.3s ease'
            }}>
              {/* Modal Header */}
              <div style={{
                padding: '2rem',
                borderBottom: '4px solid var(--deep-brown)',
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: isCorrect ? 'var(--neon-green)' : 'var(--neon-pink)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  border: '4px solid var(--deep-brown)'
                }}>
                  {isCorrect ? '✓' : '✗'}
                </div>

                <div>
                  <h3 style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '1.5rem',
                    fontWeight: 900,
                    color: 'var(--deep-brown)',
                    marginBottom: '0.25rem'
                  }}>
                    {isCorrect ? 'Răspuns corect!' : 'Răspuns greșit'}
                  </h3>
                  <p style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: isCorrect ? 'var(--neon-green)' : 'var(--neon-pink)'
                  }}>
                    {isCorrect ? `+${currentQuestionPoints} puncte` : '+0 puncte'}
                  </p>
                </div>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '2rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'var(--warm-brown)',
                    marginBottom: '0.75rem'
                  }}>
                    Răspuns corect
                  </div>
                  <div style={{
                    background: 'var(--neon-green)',
                    padding: '1rem',
                    border: '4px solid var(--deep-brown)',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'var(--deep-brown)'
                  }}>
                    {getAnswerLetter(currentQuestion.answers.findIndex(a => a.correct))}. {currentQuestion.answers.find(a => a.correct).text}
                  </div>
                </div>

                <div>
                  <div style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'var(--warm-brown)',
                    marginBottom: '0.75rem'
                  }}>
                    Explicație
                  </div>
                  <div style={{
                    background: 'var(--sand)',
                    padding: '1rem',
                    border: '4px solid var(--warm-brown)',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1rem',
                    lineHeight: 1.6,
                    color: 'var(--deep-brown)'
                  }}>
                    {currentQuestion.explanation}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{
                padding: '1rem 2rem',
                borderTop: '4px solid var(--deep-brown)',
                display: 'flex',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={handleNextQuestion}
                  style={{
                    background: 'var(--deep-brown)',
                    color: 'var(--off-white)',
                    border: '6px solid var(--deep-brown)',
                    padding: '1rem 2rem',
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 900,
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--neon-lime)';
                    e.currentTarget.style.color = 'var(--deep-brown)';
                    e.currentTarget.style.transform = 'translate(-5px, -5px)';
                    e.currentTarget.style.boxShadow = '5px 5px 0 var(--deep-brown)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--deep-brown)';
                    e.currentTarget.style.color = 'var(--off-white)';
                    e.currentTarget.style.transform = 'translate(0, 0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Următoarea Întrebare →
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Add keyframes for animations */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes correctShake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }

          @keyframes wrongShake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }

          @media (max-width: 768px) {
            .answers-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>

      </div>
    );
  }

  return null;
}

export default QuizPlay;
