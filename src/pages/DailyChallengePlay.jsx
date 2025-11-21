/**
 * DailyChallengePlay.jsx
 *
 * Page pentru a juca Daily Challenge
 * Similar cu QuizPlay dar cu întrebări deterministe și 2x points
 * REFACTORED to use unified QuizInterface component
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  getTodayDateString,
  generateDailyQuestions,
  getUserDailyChallenge,
  saveDailyChallenge
} from '../services/dailyChallengeService';
import { checkBadgeAchievements } from '../services/badgeService';
import { QuizInterface } from '../components/quiz/QuizInterface';

export function DailyChallengePlay() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [startTime] = useState(Date.now());
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    loadDailyChallenge();
  }, [user]);

  async function loadDailyChallenge() {
    try {
      // Check if already completed today
      const today = getTodayDateString();
      const existingChallenge = await getUserDailyChallenge(user.uid, today);

      if (existingChallenge?.completed) {
        // Already completed, redirect to leaderboard
        navigate('/daily-leaderboard');
        return;
      }

      // Generate today's questions (deterministic)
      const dailyQuestions = await generateDailyQuestions(today, 12);

      if (dailyQuestions.length < 12) {
        alert('Nu există suficiente întrebări pentru provocarea zilnică');
        navigate('/');
        return;
      }

      // Shuffle answers for each question
      // NOTE: Using 'correct' property (same as QuizPlay.jsx)
      const questionsWithShuffledAnswers = dailyQuestions.map(q => {
        console.log('✅ Question:', q.question);
        console.log('📝 Answers:', q.answers);

        return {
          ...q,
          answers: shuffleArray([...q.answers])
        };
      });

      setQuestions(questionsWithShuffledAnswers);

    } catch (error) {
      console.error('Error loading daily challenge:', error);
      alert('Eroare la încărcarea provocării zilnice');
      navigate('/');
    } finally {
      setLoading(false);
    }
  }

  function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  function handleAnswerSelect(answerIndex) {
    if (isAnswered) return;

    setSelectedAnswer(answerIndex);
  }

  const [currentQuestionPoints, setCurrentQuestionPoints] = useState(0);

  function handleSubmitAnswer() {
    if (selectedAnswer === null) return;

    const currentQuestion = questions[currentQuestionIndex];
    const selectedAnswerObj = currentQuestion.answers[selectedAnswer];

    // Use 'correct' property (same as QuizPlay.jsx)
    const isCorrect = Boolean(selectedAnswerObj.correct);

    console.log('📝 Answer submitted:', {
      selectedAnswer,
      selectedAnswerObj,
      correct: selectedAnswerObj.correct,
      isCorrect
    });

    // Calculate points (2x multiplier for daily challenge)
    const points = isCorrect ? 20 : 0; // 10 * 2

    setScore(score + points);
    setIsAnswered(true);
    setShowExplanation(true);
    setCurrentQuestionPoints(points);

    // Save answer
    setAnswers([
      ...answers,
      {
        questionId: currentQuestion.id,
        selectedAnswer: selectedAnswer,
        isCorrect,
        points
      }
    ]);
  }

  function handleNextQuestion() {
    // Close explanation modal first
    setShowExplanation(false);

    if (currentQuestionIndex < questions.length - 1) {
      // Next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setCurrentQuestionPoints(0);
    } else {
      // Finish quiz
      handleFinishQuiz();
    }
  }

  async function handleFinishQuiz() {
    try {
      const duration = Math.round((Date.now() - startTime) / 1000); // seconds
      const maxScore = questions.length * 20; // 12 * 20 = 240 points
      const today = getTodayDateString();

      // Save daily challenge result
      await saveDailyChallenge(user.uid, today, {
        score,
        maxScore,
        duration,
        answers,
        questionIds: questions.map(q => q.id)
      });

      // Check badge achievements
      await checkBadgeAchievements(user.uid);

      // Navigate to leaderboard
      navigate('/daily-leaderboard');

    } catch (error) {
      console.error('Error finishing daily challenge:', error);
      alert('Eroare la salvarea rezultatelor');
    }
  }

  // Loading state
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--cream)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '4rem',
            height: '4rem',
            border: '6px solid var(--deep-brown)',
            borderTop: '6px solid var(--neon-orange)',
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
            Se încarcă provocarea zilnică...
          </p>
        </div>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // No questions state
  if (questions.length === 0) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--cream)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '1.25rem',
            color: 'var(--warm-brown)',
            marginBottom: '1.5rem'
          }}>
            Nu există întrebări disponibile
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'var(--neon-orange)',
              color: 'var(--deep-brown)',
              border: '4px solid var(--deep-brown)',
              padding: '0.75rem 2rem',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              textTransform: 'uppercase'
            }}
          >
            Acasă
          </button>
        </div>
      </div>
    );
  }

  // Main quiz interface
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <QuizInterface
      question={currentQuestion}
      currentQuestionIndex={currentQuestionIndex}
      totalQuestions={questions.length}
      score={score}
      selectedAnswer={selectedAnswer}
      isAnswered={isAnswered}
      showExplanation={showExplanation}
      onAnswerSelect={handleAnswerSelect}
      onSubmitAnswer={handleSubmitAnswer}
      onNextQuestion={handleNextQuestion}
      styleMode="brutalist"
      header={{
        subject: '🌟 Provocare Zilnică'
      }}
      points={{
        earned: currentQuestionPoints
      }}
      submitButtonText="Trimite Răspuns"
      nextButtonText={currentQuestionIndex < questions.length - 1 ? 'Întrebarea Următoare' : 'Finalizează & Vezi Rezultate 🏆'}
    />
  );
}

export default DailyChallengePlay;
