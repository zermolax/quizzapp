/**
 * ThemeCard.jsx - REDESIGNED
 *
 * ÎMBUNĂTĂȚIRI:
 * - Paletă de culori închise (maro, albastru, gri, violet)
 * - Secțiune dificultate cu background alb (mai bună lizibilitate)
 * - Eliminat câmpul "Subiecte" (inutil)
 * - Contrast îmbunătățit pentru text
 */

import React from 'react';

// Paletă de culori închise pentru mai bună lizibilitate
const DARK_COLORS = {
  0: { bg: '#2C3E50', name: 'Albastru închis' },      // Albastru-gri închis
  1: { bg: '#34495E', name: 'Gri albăstrui' },        // Gri
  2: { bg: '#7D3C98', name: 'Mov închis' },           // Mov
  3: { bg: '#117A65', name: 'Verde închis' },         // Verde-turcoaz
  4: { bg: '#943126', name: 'Maro-roșu' },            // Maro-roșu
  5: { bg: '#6E4C1E', name: 'Maro' },                 // Maro
  6: { bg: '#1B4F72', name: 'Albastru navy' },        // Navy
  7: { bg: '#512E5F', name: 'Violet închis' },        // Violet
  8: { bg: '#145A32', name: 'Verde pădure' },         // Verde închis
  9: { bg: '#78281F', name: 'Roșu închis' }           // Roșu închis
};

/**
 * COMPONENT: ThemeCard
 *
 * Props:
 * - theme: obiectul temei cu: name, description, icon, totalQuestions, etc
 * - onSelectTheme: callback function când user selectează o dificultate
 * - index: index pentru selectare culoare
 */
export function ThemeCard({ theme, onSelectTheme, index = 0 }) {

  /**
   * HANDLER: Selectare dificultate
   */
  const handleDifficultyClick = (difficulty) => {
    onSelectTheme(theme.slug, difficulty);
  };

  // Selectează culoare bazată pe index
  const cardColor = DARK_COLORS[index % Object.keys(DARK_COLORS).length];

  return (
    <div className="rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col bg-white">

      {/* PARTEA DE SUS: Background colorat închis */}
      <div
        className="p-6 text-white"
        style={{ backgroundColor: cardColor.bg }}
      >
        {/* Iconiță + Nume */}
        <div className="mb-4">
          <div className="text-5xl mb-3">{theme.icon}</div>
          <h3 className="text-2xl font-bold">{theme.name}</h3>
        </div>

        {/* Descriere */}
        <p className="text-sm opacity-90 mb-4">
          {theme.description}
        </p>

        {/* Info: Număr de întrebări */}
        <div className="bg-black bg-opacity-20 rounded-lg p-3 inline-block">
          <p className="text-xs opacity-80 mb-1">Întrebări disponibile</p>
          <p className="text-2xl font-bold">{theme.totalQuestions}</p>
        </div>
      </div>

      {/* PARTEA DE JOS: Background ALB cu butoane dificultate */}
      <div className="p-6 bg-white flex-grow">
        <p className="text-sm font-semibold text-neutral-700 mb-3">
          🎯 Alege dificultatea:
        </p>

        <div className="space-y-2">
          {/* Easy */}
          <button
            onClick={() => handleDifficultyClick('easy')}
            className="w-full py-3 px-4 rounded-lg font-semibold text-sm transition border-2 border-success text-success hover:bg-success hover:text-white"
          >
            🟢 Ușor
          </button>

          {/* Medium */}
          <button
            onClick={() => handleDifficultyClick('medium')}
            className="w-full py-3 px-4 rounded-lg font-semibold text-sm transition border-2 border-warning text-warning hover:bg-warning hover:text-white"
          >
            🟡 Mediu
          </button>

          {/* Hard */}
          <button
            onClick={() => handleDifficultyClick('hard')}
            className="w-full py-3 px-4 rounded-lg font-semibold text-sm transition border-2 border-error text-error hover:bg-error hover:text-white"
          >
            🔴 Greu
          </button>
        </div>
      </div>

    </div>
  );
}

export default ThemeCard;

/**
 * ÎMBUNĂTĂȚIRI DESIGN:
 *
 * ✅ Culori închise pentru background (maro, albastru închis, gri, violet)
 *    - Contrast excelent cu text alb
 *    - Coeziune vizuală - culori armonioase
 *    - Lizibilitate îmbunătățită
 *
 * ✅ Secțiune dificultate cu background alb
 *    - Butoane doar cu contur (border)
 *    - Text colorat care devine alb la hover
 *    - Lizibilitate perfectă
 *
 * ✅ Eliminat câmpul "Subiecte"
 *    - Nu adăuga valoare
 *    - Card mai curat
 *
 * ✅ Flow vizual clar:
 *    Partea sus (colorată) = Info temă
 *    Partea jos (albă) = Acțiune (selectare dificultate)
 */
