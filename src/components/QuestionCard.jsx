/**
 * QuestionCard.jsx
 * 
 * SCOPUL:
 * Componentă care randează o singură întrebare cu:
 * - Textul întrebării
 * - 4 butoane de răspuns (clickable)
 * - Feedback visual (verde/roșu)
 * - Explanation text
 * 
 * PROPS:
 * - question: Obiectul întrebării
 * - onAnswerClick: Callback când user click pe răspuns
 * - selectedAnswerIndex: Index-ul răspunsului selectat
 * - answered: Bool - user deja răspuns?
 * - isCorrect: Bool - răspunsul e corect?
 * - showExplanation: Bool - afișez explanation?
 */

import React from 'react';

export function QuestionCard({
  question,
  onAnswerClick,
  selectedAnswerIndex,
  answered,
  isCorrect,
  showExplanation,
  timeLeft = 20
}) {

  /**
   * HELPER: Determină culoarea și starea unui buton
   * 
   * LOGICĂ:
   * - Dacă nu e răspuns: gri normal (clickable)
   * - Dacă răspunsul selectat e corect: VERDE
   * - Dacă răspunsul selectat e greșit: ROȘU
   * - Dacă nu e selectat dar e răspunsul corect: VERDE (dacă greșit)
   */
  const getButtonStyle = (answerIndex) => {
    const answer = question.answers[answerIndex];

    // Nu e răspuns încă
    if (!answered) {
      return 'bg-neutral-200 hover:bg-neutral-100 hover:border-brand-blue text-neutral-900 border-2 border-neutral-200';
    }

    // Răspunsul selectat e corect
    if (selectedAnswerIndex === answerIndex && isCorrect) {
      return 'bg-success text-white border-2 border-success';
    }

    // Răspunsul selectat e greșit
    if (selectedAnswerIndex === answerIndex && !isCorrect) {
      return 'bg-error text-white border-2 border-error';
    }

    // Arăt răspunsul corect dacă user a greșit
    if (answer.correct && !isCorrect) {
      return 'bg-success text-white border-2 border-success';
    }

    // Alte răspunsuri după ce e răspuns
    if (answered) {
      return 'bg-neutral-100 text-neutral-500 border-2 border-neutral-200';
    }

    return 'bg-neutral-200 hover:bg-neutral-100 text-neutral-900 border-2 border-neutral-200';
  };

  /**
   * HELPER: Determină dacă butonul e disabled
   */
  const isButtonDisabled = answered;

  /**
   * HELPER: Get timer color based on time left
   */
  const getTimerColor = () => {
    if (timeLeft > 10) return 'text-success';
    if (timeLeft > 5) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">

      {/* TIMER */}
      {!answered && (
        <div className="flex justify-center mb-6">
          <div className={`text-center ${getTimerColor()}`}>
            <div className="text-5xl font-bold mb-1">
              {timeLeft}
            </div>
            <div className="text-sm font-semibold uppercase tracking-wide">
              secunde
            </div>
          </div>
        </div>
      )}

      {/* QUESTION TEXT */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">
          {question.question}
        </h2>
        {question.imageUrl && (
          <img
            src={question.imageUrl}
            alt="Question visual"
            className="w-full max-h-48 object-cover rounded-lg mb-4"
          />
        )}
      </div>

      {/* ANSWER BUTTONS - Grid 2x2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {question.answers.map((answer, index) => (
          <button
            key={index}
            onClick={() => !isButtonDisabled && onAnswerClick(index)}
            disabled={isButtonDisabled}
            className={`
              p-4 rounded-lg font-semibold text-left transition-all
              ${getButtonStyle(index)}
              ${isButtonDisabled ? 'cursor-default' : 'cursor-pointer'}
              transform hover:scale-105 disabled:hover:scale-100
            `}
          >
            {/* ANSWER TEXT */}
            <p className="text-lg">
              {answer.text}
            </p>

            {/* VISUAL INDICATOR */}
            {answered && (
              <div className="mt-2 text-sm">
                {answer.correct && (
                  <span className="font-bold">✓ Corect</span>
                )}
                {selectedAnswerIndex === index && !answer.correct && (
                  <span className="font-bold">✗ Greșit</span>
                )}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* EXPLANATION - Apare după răspuns */}
      {showExplanation && (
        <div
          className={`
            p-6 rounded-lg border-l-4 animate-fadeIn
            ${isCorrect
              ? 'bg-success/10 border-success text-success'
              : 'bg-error/10 border-error text-error'
            }
          `}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">
              {isCorrect ? '✓' : '✗'}
            </span>
            <div>
              <p className="font-bold mb-2">
                {isCorrect ? 'Răspuns Corect!' : 'Răspuns Incorect'}
              </p>
              <p className="text-sm leading-relaxed text-neutral-700">
                {question.explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TIMER VISUAL (opțional - arată cât timp rămâne) */}
      {answered && (
        <div className="mt-6 text-center">
          <p className="text-sm text-neutral-500">
            ⏳ Se trece la următoarea întrebare în 3 secunde...
          </p>
        </div>
      )}

    </div>
  );
}

export default QuestionCard;

/**
 * FLOW VISUAL - CE SE ÎNTÂMPLĂ:
 * 
 * STAREA 1: BEFORE ANSWER
 * ┌─────────────────────────────────┐
 * │ Ce este Primul Război Mondial?  │
 * │                                 │
 * │ ┌──────────┐  ┌──────────┐     │
 * │ │ 1914     │  │ 1912     │     │ ← All gray, clickable
 * │ │          │  │          │     │
 * │ └──────────┘  └──────────┘     │
 * │                                 │
 * │ ┌──────────┐  ┌──────────┐     │
 * │ │ 1916     │  │ 1918     │     │
 * │ │          │  │          │     │
 * │ └──────────┘  └──────────┘     │
 * └─────────────────────────────────┘
 * 
 * STAREA 2A: CORRECT ANSWER
 * ┌─────────────────────────────────┐
 * │ Ce este Primul Război Mondial?  │
 * │                                 │
 * │ ┌──────────┐  ┌──────────┐     │
 * │ │ 1914 ✓   │  │ 1912 ✗   │     │ ← GREEN (selected, correct)
 * │ │  Corect  │  │ Greșit   │     │
 * │ └──────────┘  └──────────┘     │
 * │                                 │
 * │ ┌──────────┐  ┌──────────┐     │
 * │ │ 1916     │  │ 1918     │     │ ← Disabled, gray
 * │ │ (disabled)  │ (disabled)    │
 * │ └──────────┘  └──────────┘     │
 * │                                 │
 * │ ┌─────────────────────────────┐ │
 * │ │ ✓ Răspuns Corect!           │ │ ← EXPLANATION APPEARS
 * │ │ Primul Război Mondial a     │ │
 * │ │ început în 1914 cu asasinatul │ │
 * │ │ Arhiducelui Franz Ferdinand... │ │
 * │ └─────────────────────────────┘ │
 * │ ⏳ Se trece la următoarea...   │
 * └─────────────────────────────────┘
 * 
 * STAREA 2B: INCORRECT ANSWER
 * ┌─────────────────────────────────┐
 * │ Ce este Primul Război Mondial?  │
 * │                                 │
 * │ ┌──────────┐  ┌──────────┐     │
 * │ │ 1914 ✓   │  │ 1912     │     │ ← GREEN (correct answer shown)
 * │ │  Corect  │  │ (disabled)    │
 * │ └──────────┘  └──────────┘     │
 * │                                 │
 * │ ┌──────────┐  ┌──────────┐     │
 * │ │ 1916 ✗   │  │ 1918     │     │ ← RED (selected, incorrect)
 * │ │ Greșit   │  │ (disabled)    │
 * │ └──────────┘  └──────────┘     │
 * │                                 │
 * │ ┌─────────────────────────────┐ │
 * │ │ ✗ Răspuns Incorect          │ │ ← EXPLANATION APPEARS
 * │ │ Răspunsul corect este 1914. │ │
 * │ │ Primul Război Mondial a     │ │
 * │ │ început pe 28 iunie 1914...  │ │
 * │ └─────────────────────────────┘ │
 * │ ⏳ Se trece la următoarea...   │
 * └─────────────────────────────────┘
 * 
 * DUPĂ 3 SECUNDE:
 * - Auto-advance la următoarea întrebare
 * - Reset state (înapoi la STAREA 1)
 * - Score actualizat
 */