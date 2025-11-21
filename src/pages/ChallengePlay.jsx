/**
 * ChallengePlay.jsx
 *
 * Page pentru a juca un 1v1 Challenge
 * Accessed via /challenge/:challengeId
 * REFACTORED to use unified QuizInterface component + FIXED validation bug
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  getChallengeById,
  validateChallenge,
  hasUserParticipated,
  saveParticipantResult
} from '../services/challengeService';
import { checkBadgeAchievements } from '../services/badgeService';
import ChallengeResults from '../components/challenges/ChallengeResults';
import { QuizInterface } from '../components/quiz/QuizInterface';

export function ChallengePlay() {
  const { challengeId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startTime] = useState(Date.now());
  const [showExplanation, setShowExplanation] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentQuestionPoints, setCurrentQuestionPoints] = useState(0);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        // Redirect to login with return URL
        navigate(`/?redirect=/challenge/${challengeId}`);
        return;
      }

      loadChallenge();
    }
  }, [user, authLoading, challengeId]);

  async function loadChallenge() {
    try {
      // Load challenge
      const challengeData = await getChallengeById(challengeId);

      if (!challengeData) {
        setError('Challenge not found');
        setLoading(false);
        return;
      }

      // Validate challenge
      const validation = validateChallenge(challengeData);

      if (!validation.valid) {
        setError(validation.reason);
        setLoading(false);
        return;
      }

      // Check if user already participated
      const participated = await hasUserParticipated(challengeId, user.uid);

      if (participated) {
        // Already played, show results
        setHasCompleted(true);
        setShowResults(true);
        setLoading(false);
        return;
      }

      // Load questions (with shuffled answers)
      const questionsWithShuffledAnswers = challengeData.questions.map(q => ({
        ...q,
        answers: shuffleArray([...q.answers])
      }));

      setChallenge(challengeData);
      setQuestions(questionsWithShuffledAnswers);

    } catch (error) {
      console.error('Error loading challenge:', error);
      setError('Failed to load challenge');
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

  function handleSubmitAnswer() {
    if (selectedAnswer === null) return;

    const currentQuestion = questions[currentQuestionIndex];
    const selectedAnswerObj = currentQuestion.answers[selectedAnswer];

    // FIXED: Use 'correct' property instead of 'isCorrect' (same as QuizPlay.jsx)
    const isCorrect = Boolean(selectedAnswerObj.correct);
    const points = isCorrect ? 10 : 0;

    setScore(score + points);
    setIsAnswered(true);
    setShowExplanation(true);
    setCurrentQuestionPoints(points);

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
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setCurrentQuestionPoints(0);
    } else {
      handleFinishQuiz();
    }
  }

  async function handleFinishQuiz() {
    try {
      const duration = Math.round((Date.now() - startTime) / 1000);
      const maxScore = questions.length * 10;

      // Save result
      await saveParticipantResult(challengeId, user.uid, {
        score,
        maxScore,
        duration,
        answers
      });

      // Check badges
      await checkBadgeAchievements(user.uid);

      // Show results
      setShowResults(true);

    } catch (error) {
      console.error('Error finishing challenge:', error);
      alert('Failed to save results');
    }
  }

  // Loading state
  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading challenge...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-bold hover:shadow-lg transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Show results if already completed
  if (showResults) {
    return <ChallengeResults challengeId={challengeId} />;
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
      styleMode="tailwind"
      header={{
        subject: `⚔️ Challenge de la ${challenge.createdBy.displayName}`
      }}
      points={{
        earned: currentQuestionPoints
      }}
      submitButtonText="Trimite Răspuns"
      nextButtonText={currentQuestionIndex < questions.length - 1 ? 'Întrebarea Următoare' : 'Finalizează & Vezi Rezultate 🏆'}
    />
  );
}

export default ChallengePlay;
