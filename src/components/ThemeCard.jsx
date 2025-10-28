/**
 * ThemeCard.jsx
 * 
 * SCOPUL:
 * Componentă pentru a afișa o singură temă
 * E ca un "card" într-un grid
 * 
 * CE ARATĂ:
 * - Iconiță temă
 * - Nume temă
 * - Descriere scurtă
 * - Nr. de întrebări
 * - Butoane pentru dificultate
 * 
 * USAGE:
 * <ThemeCard 
 *   theme={themeData} 
 *   onSelectTheme={handleSelectTheme}
 * />
 */

import React from 'react';

/**
 * COMPONENT: ThemeCard
 * 
 * Props:
 * - theme: obiectul temei cu: name, description, icon, totalQuestions, etc
 * - onSelectTheme: callback function când user selectează o dificultate
 */
export function ThemeCard({ theme, onSelectTheme }) {
  
  /**
   * HANDLER: Selectare dificultate
   *
   * Când user face click pe "Easy", "Medium", sau "Hard"
   * Trimit tema + dificultatea la parent component
   * Parent-ul va naviga la quiz page
   */
  const handleDifficultyClick = (difficulty) => {
    onSelectTheme(theme.slug, difficulty);
  };

  return (
    <div className={`${theme.color} rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition transform hover:scale-105 cursor-pointer h-full flex flex-col`}>
      
      {/* HEADER: Iconiță + Nume */}
      <div className="mb-4">
        <div className="text-4xl mb-3">{theme.icon}</div>
        <h3 className="text-2xl font-bold">{theme.name}</h3>
      </div>

      {/* DESCRIPȚIE */}
      <p className="text-sm opacity-90 mb-4 flex-grow">
        {theme.description}
      </p>

      {/* INFO: Număr de întrebări */}
      <div className="bg-black bg-opacity-20 rounded p-3 mb-4">
        <p className="text-xs opacity-80">Total întrebări disponibile</p>
        <p className="text-2xl font-bold">{theme.totalQuestions}</p>
      </div>

      {/* BUTOANE: Dificultate */}
      <div className="space-y-2">
        <p className="text-xs opacity-75 font-semibold uppercase tracking-wide">Alege dificultatea:</p>
        <div className="flex gap-2">
          {['easy', 'medium', 'hard'].map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => handleDifficultyClick(difficulty)}
              className={`
                flex-1 py-2 rounded font-semibold text-sm transition
                ${difficulty === 'easy' && 'bg-green-400 hover:bg-green-300 text-black'}
                ${difficulty === 'medium' && 'bg-yellow-400 hover:bg-yellow-300 text-black'}
                ${difficulty === 'hard' && 'bg-red-400 hover:bg-red-300 text-black'}
              `}
            >
              {difficulty === 'easy' && '🟢 Ușor'}
              {difficulty === 'medium' && '🟡 Mediu'}
              {difficulty === 'hard' && '🔴 Greu'}
            </button>
          ))}
        </div>
      </div>

      {/* FOOTER: Info topic-uri (opțional) */}
      <div className="mt-4 pt-4 border-t border-white border-opacity-20">
        <p className="text-xs opacity-75">
          <strong>Subiecte:</strong> {theme.topics.slice(0, 2).join(', ')}...
        </p>
      </div>

    </div>
  );
}

export default ThemeCard;

/**
 * EXPLICAȚIE DESIGN:
 * 
 * 1. Card pe background colorat (roșu, albastru, etc)
 * 2. Iconiță mare (emoji) pentru recunoaștere rapidă
 * 3. Nume + descriere clar
 * 4. Info: cât de multe întrebări
 * 5. 3 butoane colorate pentru dificultate:
 *    - Green pentru Easy
 *    - Yellow pentru Medium
 *    - Red pentru Hard
 * 6. Hover effect: card crește și shadow-ul se intensifică
 * 
 * RESPONSIVE:
 * Pe mobile: card se vor stack vertical (datorită grid-ului din ThemeGrid)
 * Pe desktop: grid cu 3 coloane
 * 
 * ACCESSIBILITY:
 * - Text clar și vizibil
 * - Butoane mari pentru click ușor
 * - Culori contrast bun (text alb pe background colorat)
 */