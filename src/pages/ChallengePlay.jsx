/**
 * ChallengePlay.jsx
 *
 * Page pentru a juca un 1v1 Challenge
 * Accessed via /challenge/:challengeId
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
    const isCorrect = currentQuestion.answers[selectedAnswer].isCorrect;
    const points = isCorrect ? 10 : 0;

    setScore(score + points);
    setIsAnswered(true);
    setShowExplanation(true);

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
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setShowExplanation(false);
    } else {
      handleFinishQuiz();
    }
  }

  function handleSkipExplanation() {
    setShowExplanation(false);
    if (!isAnswered) {
      handleSubmitAnswer();
    } else {
      handleNextQuestion();
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

  // Quiz play screen
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚔️</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Challenge</h1>
                <p className="text-sm text-gray-600">
                  From {challenge.createdBy.displayName}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold text-purple-600">{score}</div>
              <div className="text-xs text-gray-500">points</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Question {currentQuestionIndex + 1}/{questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {currentQuestion.question}
          </h2>

          {/* Answers */}
          <div className="space-y-3">
            {currentQuestion.answers.map((answer, index) => {
              let bgColor = 'bg-gray-50 hover:bg-gray-100';
              let borderColor = 'border-gray-200';
              let textColor = 'text-gray-800';

              if (isAnswered) {
                if (answer.isCorrect) {
                  bgColor = 'bg-green-100';
                  borderColor = 'border-green-500';
                  textColor = 'text-green-800';
                } else if (selectedAnswer === index) {
                  bgColor = 'bg-red-100';
                  borderColor = 'border-red-500';
                  textColor = 'text-red-800';
                }
              } else if (selectedAnswer === index) {
                bgColor = 'bg-purple-100';
                borderColor = 'border-purple-500';
                textColor = 'text-purple-800';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isAnswered}
                  className={`
                    w-full text-left p-4 rounded-xl border-2 transition-all
                    ${bgColor} ${borderColor} ${textColor}
                    ${!isAnswered && 'hover:scale-102 hover:shadow-md'}
                    ${isAnswered && 'cursor-default'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{answer.text}</span>
                    {isAnswered && answer.isCorrect && (
                      <span className="text-green-600 text-xl">✓</span>
                    )}
                    {isAnswered && !answer.isCorrect && selectedAnswer === index && (
                      <span className="text-red-600 text-xl">✗</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {isAnswered && showExplanation && currentQuestion.explanation && (
            <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <h3 className="font-semibold text-blue-900 mb-2">💡 Explanation</h3>
              <p className="text-blue-800 text-sm">{currentQuestion.explanation}</p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-4">
          {!isAnswered ? (
            <>
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className={`
                  flex-1 py-4 rounded-xl font-bold text-lg transition-all
                  ${selectedAnswer !== null
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:shadow-lg transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                Submit Answer
              </button>

              {currentQuestion.explanation && (
                <button
                  onClick={handleSkipExplanation}
                  className="px-6 py-4 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition"
                >
                  Skip ⏭️
                </button>
              )}
            </>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next Question →' : 'Finish & See Results 🏆'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChallengePlay;
