/**
 * DailyChallengePlay.jsx
 *
 * Page pentru a juca Daily Challenge
 * Similar cu QuizPlay dar cu întrebări deterministe și 2x points
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
        alert('Not enough questions available for today\'s challenge');
        navigate('/');
        return;
      }

      // Shuffle answers for each question
      const questionsWithShuffledAnswers = dailyQuestions.map(q => ({
        ...q,
        answers: shuffleArray([...q.answers])
      }));

      setQuestions(questionsWithShuffledAnswers);

    } catch (error) {
      console.error('Error loading daily challenge:', error);
      alert('Failed to load daily challenge');
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

  function handleSubmitAnswer() {
    if (selectedAnswer === null) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = currentQuestion.answers[selectedAnswer].isCorrect;

    // Calculate points (2x multiplier for daily challenge)
    const points = isCorrect ? 20 : 0; // 10 * 2

    setScore(score + points);
    setIsAnswered(true);
    setShowExplanation(true);

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
    if (currentQuestionIndex < questions.length - 1) {
      // Next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setShowExplanation(false);
    } else {
      // Finish quiz
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
      alert('Failed to save results');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading today's challenge...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">No questions available</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🌟</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Daily Challenge</h1>
                <p className="text-sm text-gray-600">2x Points • Resets at midnight</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold text-orange-600">{score}</div>
              <div className="text-xs text-gray-500">points</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-amber-500 transition-all duration-300 rounded-full"
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
                bgColor = 'bg-orange-100';
                borderColor = 'border-orange-500';
                textColor = 'text-orange-800';
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
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:shadow-lg transform hover:scale-105'
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
              className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next Question →' : 'Finish & See Results 🏆'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DailyChallengePlay;
