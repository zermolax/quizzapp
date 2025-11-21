/**
 * DailyChallengePlay.jsx
 *
 * Page pentru a juca Daily Challenge
 * Similar cu QuizPlay dar cu întrebări deterministe și 2x points
 * REDESIGNED with Bold/Brutalist design + Română
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
      alert('Eroare la salvarea rezultatelor');
    }
  }

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
      </div>
    );
  }

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

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--cream)',
      padding: '2rem 5%'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: 'var(--sand)',
          border: '6px solid var(--deep-brown)',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '2.5rem' }}>🌟</span>
              <div>
                <h1 style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '2rem',
                  fontWeight: 900,
                  color: 'var(--deep-brown)',
                  textTransform: 'uppercase',
                  margin: 0
                }}>
                  Provocare Zilnică
                </h1>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  color: 'var(--warm-brown)',
                  margin: '0.25rem 0 0'
                }}>
                  2x Puncte • Se resetează la miezul nopții
                </p>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '2.5rem',
                fontWeight: 900,
                color: 'var(--neon-orange)'
              }}>
                {score}
              </div>
              <div style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.75rem',
                color: 'var(--warm-brown)',
                textTransform: 'uppercase'
              }}>
                puncte
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{
            position: 'relative',
            height: '1.5rem',
            background: 'var(--cream)',
            border: '3px solid var(--deep-brown)'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              background: 'var(--neon-orange)',
              width: `${progress}%`,
              transition: 'width 0.3s ease'
            }} />
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--deep-brown)',
              zIndex: 10
            }}>
              {currentQuestionIndex + 1}/{questions.length}
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '0.5rem',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
            color: 'var(--warm-brown)'
          }}>
            <span>Întrebarea {currentQuestionIndex + 1}/{questions.length}</span>
            <span>{Math.round(progress)}% Completat</span>
          </div>
        </div>

        {/* Question */}
        <div style={{
          background: 'var(--off-white)',
          border: '6px solid var(--deep-brown)',
          padding: '2.5rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--deep-brown)',
            marginBottom: '2rem',
            lineHeight: 1.4
          }}>
            {currentQuestion.question}
          </h2>

          {/* Answers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {currentQuestion.answers.map((answer, index) => {
              let bgColor = 'var(--sand)';
              let borderColor = 'var(--warm-brown)';
              let textColor = 'var(--deep-brown)';

              if (isAnswered) {
                // Use 'correct' property (same as QuizPlay.jsx)
                if (answer.correct === true) {
                  bgColor = 'var(--neon-green)';
                  borderColor = 'var(--deep-brown)';
                  textColor = 'var(--deep-brown)';
                } else if (selectedAnswer === index) {
                  bgColor = 'var(--neon-pink)';
                  borderColor = 'var(--deep-brown)';
                  textColor = 'var(--deep-brown)';
                }
              } else if (selectedAnswer === index) {
                bgColor = 'var(--neon-orange)';
                borderColor = 'var(--deep-brown)';
                textColor = 'var(--deep-brown)';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isAnswered}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '1.25rem',
                    background: bgColor,
                    border: `4px solid ${borderColor}`,
                    color: textColor,
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    cursor: isAnswered ? 'default' : 'pointer',
                    transition: 'all 0.15s ease',
                    transform: !isAnswered && selectedAnswer !== index ? 'none' : 'translateX(0)',
                    boxShadow: !isAnswered && selectedAnswer === index ? '4px 4px 0 var(--deep-brown)' : 'none'
                  }}
                  onMouseEnter={e => {
                    if (!isAnswered) {
                      e.currentTarget.style.transform = 'translate(-2px, -2px)';
                      e.currentTarget.style.boxShadow = '6px 6px 0 var(--deep-brown)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isAnswered) {
                      e.currentTarget.style.transform = 'translate(0, 0)';
                      e.currentTarget.style.boxShadow = selectedAnswer === index ? '4px 4px 0 var(--deep-brown)' : 'none';
                    }
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{answer.text}</span>
                    {isAnswered && answer.correct === true && (
                      <span style={{ fontSize: '1.5rem' }}>✓</span>
                    )}
                    {isAnswered && answer.correct !== true && selectedAnswer === index && (
                      <span style={{ fontSize: '1.5rem' }}>✗</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {isAnswered && showExplanation && currentQuestion.explanation && (
            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              background: 'var(--neon-cyan)',
              border: '4px solid var(--deep-brown)'
            }}>
              <h3 style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                color: 'var(--deep-brown)',
                marginBottom: '0.75rem',
                textTransform: 'uppercase'
              }}>
                💡 Explicație
              </h3>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '1rem',
                color: 'var(--deep-brown)',
                lineHeight: 1.6,
                margin: 0
              }}>
                {currentQuestion.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          {!isAnswered ? (
            <>
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                style={{
                  flex: 1,
                  padding: '1.25rem',
                  background: selectedAnswer !== null ? 'var(--neon-orange)' : 'var(--warm-brown)',
                  color: 'var(--deep-brown)',
                  border: '4px solid var(--deep-brown)',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 900,
                  fontSize: '1.125rem',
                  textTransform: 'uppercase',
                  cursor: selectedAnswer !== null ? 'pointer' : 'not-allowed',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => {
                  if (selectedAnswer !== null) {
                    e.currentTarget.style.transform = 'translate(-2px, -2px)';
                    e.currentTarget.style.boxShadow = '6px 6px 0 var(--deep-brown)';
                  }
                }}
                onMouseLeave={e => {
                  if (selectedAnswer !== null) {
                    e.currentTarget.style.transform = 'translate(0, 0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                Trimite Răspuns
              </button>

              {currentQuestion.explanation && (
                <button
                  onClick={handleSkipExplanation}
                  style={{
                    padding: '1.25rem 2rem',
                    background: 'var(--sand)',
                    color: 'var(--deep-brown)',
                    border: '4px solid var(--warm-brown)',
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--warm-brown)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'var(--sand)';
                  }}
                >
                  Omite ⏭️
                </button>
              )}
            </>
          ) : (
            <button
              onClick={handleNextQuestion}
              style={{
                flex: 1,
                padding: '1.25rem',
                background: 'var(--neon-green)',
                color: 'var(--deep-brown)',
                border: '4px solid var(--deep-brown)',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 900,
                fontSize: '1.125rem',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translate(-2px, -2px)';
                e.currentTarget.style.boxShadow = '6px 6px 0 var(--deep-brown)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translate(0, 0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {currentQuestionIndex < questions.length - 1 ? 'Întrebarea Următoare →' : 'Finalizează & Vezi Rezultate 🏆'}
            </button>
          )}
        </div>
      </div>

      {/* Add keyframes for spin animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default DailyChallengePlay;
