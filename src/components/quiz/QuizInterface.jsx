/**
 * QuizInterface.jsx - Unified Quiz Interface Component
 *
 * Componenta reutilizabilă pentru toate modurile de quiz:
 * - Normal Quiz (QuizPlay)
 * - Daily Challenge (DailyChallengePlay)
 * - 1v1 Challenge (ChallengePlay)
 *
 * Suportă diferite tipuri de întrebări (pregătit pentru viitor):
 * - Multiple choice (current)
 * - Matching (planned)
 * - Ordering (planned)
 */

import React from 'react';

/**
 * QuizInterface Component
 *
 * @param {Object} props
 * @param {Object} props.question - Current question object
 * @param {number} props.currentQuestionIndex - Index of current question (0-based)
 * @param {number} props.totalQuestions - Total number of questions
 * @param {number} props.score - Current score
 * @param {number|null} props.selectedAnswer - Index of selected answer (null if none)
 * @param {boolean} props.isAnswered - Whether the current question has been answered
 * @param {boolean} props.showExplanation - Whether to show the explanation
 * @param {Function} props.onAnswerSelect - Callback when answer is selected: (answerIndex) => void
 * @param {Function} props.onSubmitAnswer - Callback when answer is submitted: () => void
 * @param {Function} props.onNextQuestion - Callback for next question: () => void
 * @param {string} props.styleMode - 'tailwind' | 'brutalist' (default: 'tailwind')
 * @param {Object} props.header - Optional header configuration
 * @param {number} props.header.timeLeft - Time left in seconds (optional)
 * @param {Function} props.header.onQuit - Quit handler (optional)
 * @param {string} props.header.difficulty - Difficulty level (optional)
 * @param {string} props.header.subject - Subject name (optional)
 * @param {Object} props.points - Points configuration
 * @param {number} props.points.earned - Points earned for current question (shown after answer)
 * @param {string} props.submitButtonText - Text for submit button (default: "Trimite Răspuns")
 * @param {string} props.nextButtonText - Text for next button (default: "Următoarea Întrebare")
 */
export function QuizInterface({
  question,
  currentQuestionIndex,
  totalQuestions,
  score,
  selectedAnswer,
  isAnswered,
  showExplanation,
  onAnswerSelect,
  onSubmitAnswer,
  onNextQuestion,
  styleMode = 'tailwind',
  header = {},
  points = {},
  submitButtonText = 'Trimite Răspuns',
  nextButtonText = 'Următoarea Întrebare'
}) {

  const progressPercent = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const isBrutalist = styleMode === 'brutalist';

  // Helper: Get answer letter (A, B, C, D)
  const getAnswerLetter = (index) => String.fromCharCode(65 + index);

  // Helper: Get difficulty info
  const getDifficultyInfo = () => {
    if (!header.difficulty) return null;

    switch (header.difficulty) {
      case 'easy':
      case 'ușor':
        return { label: 'Ușor', color: '#8B9B7A', emoji: '🟢' };
      case 'medium':
      case 'mediu':
        return { label: 'Mediu', color: '#FF6B00', emoji: '🟡' };
      case 'hard':
      case 'dificil':
      case 'greu':
        return { label: 'Dificil', color: '#FF0080', emoji: '🔴' };
      default:
        return { label: header.difficulty, color: '#2D2416', emoji: '⚪' };
    }
  };

  const difficultyInfo = getDifficultyInfo();

  /**
   * BRUTALIST STYLE RENDERING
   */
  if (isBrutalist) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--cream)', fontFamily: 'var(--font-body)' }}>

        {/* Header */}
        <header style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          padding: '1.5rem',
          backgroundColor: 'var(--cream)',
          borderBottom: '4px solid var(--deep-brown)',
          zIndex: 50
        }}>
          <nav style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem'
          }}>
            {/* Left side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {header.onQuit && (
                <button
                  onClick={header.onQuit}
                  style={{
                    backgroundColor: 'transparent',
                    border: '3px solid var(--deep-brown)',
                    color: 'var(--deep-brown)',
                    padding: '0.5rem 1rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 'bold',
                    fontSize: '0.875rem',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--neon-pink)';
                    e.target.style.color = 'var(--cream)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = 'var(--deep-brown)';
                  }}
                >
                  ✕ Quit
                </button>
              )}

              {header.subject && (
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  color: 'var(--deep-brown)'
                }}>
                  {header.subject} {difficultyInfo && `• ${difficultyInfo.emoji}`}
                </div>
              )}
            </div>

            {/* Right side - Score & Timer */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {/* Timer */}
              {header.timeLeft !== undefined && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  border: `4px solid ${header.timeLeft <= 10 ? 'var(--error)' : 'var(--warm-brown)'}`,
                  backgroundColor: header.timeLeft <= 10 ? 'var(--error)' : 'var(--cream)',
                  color: header.timeLeft <= 10 ? 'white' : 'var(--deep-brown)',
                  animation: header.timeLeft <= 10 ? 'pulse 1s infinite' : 'none'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>⏱️</span>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '2rem',
                    fontWeight: 'black'
                  }}>
                    {header.timeLeft}s
                  </span>
                </div>
              )}

              {/* Score */}
              <div style={{
                backgroundColor: 'var(--deep-brown)',
                color: 'var(--neon-lime)',
                padding: '0.5rem 1.5rem',
                border: '4px solid var(--deep-brown)',
                fontFamily: 'var(--font-mono)',
                fontSize: '1.125rem',
                fontWeight: 'bold'
              }}>
                {score} pts
              </div>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main style={{ paddingTop: '6rem', paddingBottom: '2rem', padding: '6rem 1.5rem 2rem' }}>
          <div style={{ maxWidth: '1024px', margin: '0 auto' }}>

            {/* Progress Bar */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.75rem'
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  color: 'var(--deep-brown)'
                }}>
                  Întrebarea {currentQuestionIndex + 1} / {totalQuestions}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  color: 'var(--deep-brown)'
                }}>
                  {Math.round(progressPercent)}%
                </span>
              </div>
              <div style={{
                height: '1rem',
                backgroundColor: 'var(--sand)',
                border: '3px solid var(--deep-brown)'
              }}>
                <div style={{
                  height: '100%',
                  width: `${progressPercent}%`,
                  backgroundColor: 'var(--neon-cyan)',
                  transition: 'width 0.3s'
                }}></div>
              </div>
            </div>

            {/* Difficulty Badge */}
            {difficultyInfo && (
              <div style={{
                display: 'inline-block',
                padding: '0.5rem 1.5rem',
                border: '4px solid var(--deep-brown)',
                backgroundColor: difficultyInfo.color,
                color: 'var(--cream)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                marginBottom: '2rem'
              }}>
                {difficultyInfo.emoji} {difficultyInfo.label}
              </div>
            )}

            {/* Question Card */}
            <div style={{
              backgroundColor: 'var(--cream)',
              border: '6px solid var(--deep-brown)',
              padding: '3rem',
              marginBottom: '2rem'
            }}>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2rem',
                fontWeight: 'black',
                color: 'var(--deep-brown)',
                lineHeight: '1.2',
                marginBottom: '2rem'
              }}>
                {question.question}
              </h2>

              {/* Answers Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1rem'
              }}>
                {question.answers.map((answer, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrectAnswer = answer.correct === true; // Use 'correct' property
                  const showResult = isAnswered;

                  let bgColor = 'var(--cream)';
                  let borderColor = 'var(--deep-brown)';
                  let textColor = 'var(--deep-brown)';

                  if (showResult) {
                    if (isCorrectAnswer) {
                      bgColor = '#10B981'; // Green
                      textColor = 'white';
                    } else if (isSelected && !isCorrectAnswer) {
                      bgColor = 'var(--error)';
                      borderColor = 'var(--error)';
                      textColor = 'white';
                    }
                  } else if (isSelected) {
                    bgColor = 'var(--sand)';
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => !isAnswered && onAnswerSelect(index)}
                      disabled={isAnswered}
                      style={{
                        backgroundColor: bgColor,
                        color: textColor,
                        border: `4px solid ${borderColor}`,
                        padding: '1.5rem',
                        textAlign: 'left',
                        fontFamily: 'var(--font-body)',
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        cursor: isAnswered ? 'not-allowed' : 'pointer',
                        transition: 'all 0.15s',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        if (!isAnswered) {
                          e.target.style.transform = 'translate(-2px, -2px)';
                          e.target.style.boxShadow = '6px 6px 0 var(--deep-brown)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isAnswered) {
                          e.target.style.transform = 'translate(0, 0)';
                          e.target.style.boxShadow = 'none';
                        }
                      }}
                    >
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 'black',
                        fontSize: '1.125rem',
                        marginRight: '0.75rem'
                      }}>
                        {getAnswerLetter(index)}.
                      </span>
                      {answer.text}

                      {/* Checkmark/X for answered state */}
                      {isAnswered && isCorrectAnswer && (
                        <span style={{
                          position: 'absolute',
                          right: '1rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontSize: '1.5rem'
                        }}>✓</span>
                      )}
                      {isAnswered && !isCorrectAnswer && isSelected && (
                        <span style={{
                          position: 'absolute',
                          right: '1rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontSize: '1.5rem'
                        }}>✗</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Button */}
            {!isAnswered ? (
              <button
                onClick={onSubmitAnswer}
                disabled={selectedAnswer === null}
                style={{
                  width: '100%',
                  backgroundColor: selectedAnswer !== null ? 'var(--deep-brown)' : 'var(--sand)',
                  color: selectedAnswer !== null ? 'var(--neon-lime)' : 'var(--warm-brown)',
                  border: `6px solid ${selectedAnswer !== null ? 'var(--deep-brown)' : 'var(--warm-brown)'}`,
                  padding: '1.5rem',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 'black',
                  textTransform: 'uppercase',
                  cursor: selectedAnswer !== null ? 'pointer' : 'not-allowed',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => {
                  if (selectedAnswer !== null) {
                    e.target.style.backgroundColor = 'var(--neon-lime)';
                    e.target.style.color = 'var(--deep-brown)';
                    e.target.style.transform = 'translate(-2px, -2px)';
                    e.target.style.boxShadow = '6px 6px 0 var(--deep-brown)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedAnswer !== null) {
                    e.target.style.backgroundColor = 'var(--deep-brown)';
                    e.target.style.color = 'var(--neon-lime)';
                    e.target.style.transform = 'translate(0, 0)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                {submitButtonText}
              </button>
            ) : (
              <button
                onClick={onNextQuestion}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--deep-brown)',
                  color: 'var(--neon-lime)',
                  border: '6px solid var(--deep-brown)',
                  padding: '1.5rem',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 'black',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--neon-lime)';
                  e.target.style.color = 'var(--deep-brown)';
                  e.target.style.transform = 'translate(-2px, -2px)';
                  e.target.style.boxShadow = '6px 6px 0 var(--deep-brown)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'var(--deep-brown)';
                  e.target.style.color = 'var(--neon-lime)';
                  e.target.style.transform = 'translate(0, 0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {nextButtonText} →
              </button>
            )}

          </div>
        </main>

        {/* EXPLANATION MODAL */}
        {showExplanation && isAnswered && question.explanation && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(45, 36, 22, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '1rem',
            animation: 'fadeIn 0.3s ease'
          }}>
            <div style={{
              backgroundColor: 'var(--cream)',
              border: '6px solid var(--deep-brown)',
              maxWidth: '768px',
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
                  width: '4rem',
                  height: '4rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  border: '4px solid var(--deep-brown)',
                  backgroundColor: selectedAnswer !== null && question.answers[selectedAnswer].correct ? '#10B981' : 'var(--neon-pink)',
                  flexShrink: 0
                }}>
                  {selectedAnswer !== null && question.answers[selectedAnswer].correct ? '✓' : '✗'}
                </div>

                <div>
                  <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '2rem',
                    fontWeight: 'black',
                    color: 'var(--deep-brown)',
                    marginBottom: '0.5rem'
                  }}>
                    {selectedAnswer !== null && question.answers[selectedAnswer].correct ? 'Răspuns corect!' : 'Răspuns greșit'}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.125rem',
                    fontWeight: 'bold',
                    color: selectedAnswer !== null && question.answers[selectedAnswer].correct ? '#10B981' : 'var(--neon-pink)'
                  }}>
                    {points.earned !== undefined ? `${selectedAnswer !== null && question.answers[selectedAnswer].correct ? '+' : ''}${points.earned} puncte` : ''}
                  </p>
                </div>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '2rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    color: 'var(--warm-brown)',
                    marginBottom: '0.75rem'
                  }}>
                    Răspuns corect
                  </div>
                  <div style={{
                    backgroundColor: '#10B981',
                    padding: '1rem',
                    border: '4px solid var(--deep-brown)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: 'var(--deep-brown)'
                  }}>
                    {getAnswerLetter(question.answers.findIndex(a => a.correct))}. {question.answers.find(a => a.correct).text}
                  </div>
                </div>

                <div>
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    color: 'var(--warm-brown)',
                    marginBottom: '0.75rem'
                  }}>
                    Explicație
                  </div>
                  <div style={{
                    backgroundColor: 'var(--sand)',
                    padding: '1rem',
                    border: '4px solid var(--warm-brown)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    color: 'var(--deep-brown)'
                  }}>
                    {question.explanation}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{
                padding: '2rem',
                borderTop: '4px solid var(--deep-brown)',
                display: 'flex',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={onNextQuestion}
                  style={{
                    backgroundColor: 'var(--deep-brown)',
                    color: 'var(--cream)',
                    border: '6px solid var(--deep-brown)',
                    padding: '1rem 2rem',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1rem',
                    fontWeight: 'black',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--neon-lime)';
                    e.target.style.color = 'var(--deep-brown)';
                    e.target.style.transform = 'translate(-2px, -2px)';
                    e.target.style.boxShadow = '6px 6px 0 var(--deep-brown)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'var(--deep-brown)';
                    e.target.style.color = 'var(--cream)';
                    e.target.style.transform = 'translate(0, 0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Următoarea Întrebare →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CSS Animations */}
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
            50% { opacity: 0.7; }
          }
        `}</style>

      </div>
    );
  }

  /**
   * TAILWIND STYLE RENDERING
   */
  return (
    <div className="min-h-screen bg-off-white font-body">

      {/* FIXED HEADER */}
      <header className="fixed top-0 left-0 right-0 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 bg-off-white border-b-4 border-deep-brown z-50">
        <nav className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          {/* Left side */}
          <div className="flex items-center gap-2 sm:gap-4">
            {header.onQuit && (
              <button
                onClick={header.onQuit}
                className="bg-transparent border-3 border-deep-brown text-deep-brown px-3 sm:px-4 py-2 font-heading font-bold text-sm uppercase hover:bg-neon-pink hover:text-off-white hover:border-neon-pink transition-all duration-150"
              >
                ✕ <span className="hidden sm:inline">Quit</span>
              </button>
            )}

            {header.subject && difficultyInfo && (
              <div className="font-mono text-sm font-bold uppercase tracking-wider text-deep-brown">
                <span className="hidden sm:inline">{header.subject} • </span>{difficultyInfo.emoji}
              </div>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Timer */}
            {header.timeLeft !== undefined && (
              <div className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 border-4 ${
                header.timeLeft <= 10 ? 'bg-error border-error text-white animate-pulse' : 'bg-cream border-warm-brown text-deep-brown'
              }`}>
                <span className="text-3xl">⏱️</span>
                <span className="font-mono text-4xl font-black">
                  {header.timeLeft}s
                </span>
              </div>
            )}

            {/* Score */}
            <div className="bg-deep-brown text-neon-lime px-3 sm:px-6 py-2 border-4 border-deep-brown font-mono text-lg font-bold">
              {score} pts
            </div>
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
                Întrebarea {currentQuestionIndex + 1} / {totalQuestions}
              </span>
              <span className="font-mono text-sm font-bold text-deep-brown">
                {Math.round(progressPercent)}%
              </span>
            </div>
            <div className="h-3 sm:h-4 bg-sand border-3 border-deep-brown">
              <div
                className="h-full bg-neon-cyan transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Difficulty Badge */}
          {difficultyInfo && (
            <div
              className="inline-block px-4 sm:px-6 py-2 sm:py-3 border-4 border-deep-brown font-heading font-bold text-sm uppercase text-off-white mb-6 sm:mb-8"
              style={{ backgroundColor: difficultyInfo.color }}
            >
              {difficultyInfo.emoji} {difficultyInfo.label}
            </div>
          )}

          {/* Question Card */}
          <div className="bg-cream border-6 border-deep-brown p-6 sm:p-8 md:p-12 mb-6 sm:mb-8">
            <h2 className="font-heading text-4xl font-black text-deep-brown leading-tight mb-6 sm:mb-8">
              {question.question}
            </h2>

            {/* Answers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {question.answers.map((answer, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrectAnswer = answer.correct === true; // Use 'correct' property
                const showResult = isAnswered;

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
                    onClick={() => !isAnswered && onAnswerSelect(index)}
                    disabled={isAnswered}
                    className={`${bgColor} ${textColor} border-4 ${borderColor} p-4 sm:p-5 md:p-6 text-left font-body text-lg font-semibold transition-all duration-150 disabled:cursor-not-allowed hover:enabled:-translate-x-1 hover:enabled:-translate-y-1 hover:enabled:shadow-brutal hover:enabled:shadow-deep-brown relative`}
                  >
                    <span className="font-mono font-black text-lg mr-2 sm:mr-3">
                      {getAnswerLetter(index)}.
                    </span>
                    {answer.text}

                    {/* Checkmark/X for answered state */}
                    {isAnswered && isCorrectAnswer && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">✓</span>
                    )}
                    {isAnswered && !isCorrectAnswer && isSelected && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">✗</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          {!isAnswered ? (
            <button
              onClick={onSubmitAnswer}
              disabled={selectedAnswer === null}
              className={`w-full py-4 font-heading font-black text-lg uppercase border-6 transition-all duration-150 ${
                selectedAnswer !== null
                  ? 'bg-deep-brown text-neon-lime border-deep-brown hover:bg-neon-lime hover:text-deep-brown hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal hover:shadow-deep-brown cursor-pointer'
                  : 'bg-sand text-warm-brown border-warm-brown cursor-not-allowed'
              }`}
            >
              {submitButtonText}
            </button>
          ) : (
            <button
              onClick={onNextQuestion}
              className="w-full py-4 bg-deep-brown text-neon-lime border-6 border-deep-brown font-heading font-black text-lg uppercase hover:bg-neon-lime hover:text-deep-brown hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal hover:shadow-deep-brown transition-all duration-150 cursor-pointer"
            >
              {nextButtonText} →
            </button>
          )}

        </div>
      </main>

      {/* EXPLANATION MODAL */}
      {showExplanation && isAnswered && question.explanation && (
        <div className="fixed inset-0 bg-deep-brown/90 flex items-center justify-center z-[2000] p-4 animate-fadeIn">
          <div className="bg-cream border-6 border-deep-brown max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 md:p-8 border-b-4 border-deep-brown flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div
                className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-3xl border-4 border-deep-brown flex-shrink-0 ${
                  selectedAnswer !== null && question.answers[selectedAnswer].correct ? 'bg-[#10B981]' : 'bg-neon-pink'
                }`}
              >
                {selectedAnswer !== null && question.answers[selectedAnswer].correct ? '✓' : '✗'}
              </div>

              <div>
                <h3 className="font-heading text-3xl font-black text-deep-brown mb-1 sm:mb-2">
                  {selectedAnswer !== null && question.answers[selectedAnswer].correct ? 'Răspuns corect!' : 'Răspuns greșit'}
                </h3>
                <p className={`font-mono text-lg font-bold ${
                  selectedAnswer !== null && question.answers[selectedAnswer].correct ? 'text-[#10B981]' : 'text-neon-pink'
                }`}>
                  {points.earned !== undefined ? `${selectedAnswer !== null && question.answers[selectedAnswer].correct ? '+' : ''}${points.earned} puncte` : ''}
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
                  {getAnswerLetter(question.answers.findIndex(a => a.correct))}. {question.answers.find(a => a.correct).text}
                </div>
              </div>

              <div>
                <div className="font-heading text-sm font-bold uppercase tracking-wide text-warm-brown mb-2 sm:mb-3">
                  Explicație
                </div>
                <div className="bg-sand p-3 sm:p-4 border-4 border-warm-brown font-body text-base leading-relaxed text-deep-brown">
                  {question.explanation}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 md:p-8 border-t-4 border-deep-brown flex justify-end">
              <button
                onClick={onNextQuestion}
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

export default QuizInterface;
