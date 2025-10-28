/**
 * ThemeCard.jsx - REDESIGNED & COMPACTED
 *
 * ÎMBUNĂTĂȚIRI v2:
 * - Design mai compact (mai puțin spațiu gol)
 * - Butoane dificultate pe orizontală
 * - Padding-uri reduse
 * - Icon mai mic
 */

import React from 'react';

// Paletă de culori închise pentru mai bună lizibilitate
const DARK_COLORS = {
  0: { bg: '#2C3E50', name: 'Albastru închis' },
  1: { bg: '#34495E', name: 'Gri albăstrui' },
  2: { bg: '#7D3C98', name: 'Mov închis' },
  3: { bg: '#117A65', name: 'Verde închis' },
  4: { bg: '#943126', name: 'Maro-roșu' },
  5: { bg: '#6E4C1E', name: 'Maro' },
  6: { bg: '#1B4F72', name: 'Albastru navy' },
  7: { bg: '#512E5F', name: 'Violet închis' },
  8: { bg: '#145A32', name: 'Verde pădure' },
  9: { bg: '#78281F', name: 'Roșu închis' }
};

export function ThemeCard({ theme, onSelectTheme, index = 0 }) {

  const handleDifficultyClick = (difficulty) => {
    onSelectTheme(theme.slug, difficulty);
  };

  const cardColor = DARK_COLORS[index % Object.keys(DARK_COLORS).length];

  return (
    <div className="rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white">

      {/* PARTEA DE SUS: Background colorat închis */}
      <div
        className="p-5 text-white"
        style={{ backgroundColor: cardColor.bg }}
      >
        {/* Iconiță + Nume - mai compact */}
        <div className="flex items-start gap-3 mb-3">
          <div className="text-4xl">{theme.icon}</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold leading-tight">{theme.name}</h3>
            <p className="text-xs opacity-80 mt-1">
              {theme.totalQuestions} întrebări
            </p>
          </div>
        </div>

        {/* Descriere - mai scurtă */}
        <p className="text-xs opacity-90 line-clamp-2">
          {theme.description}
        </p>
      </div>

      {/* PARTEA DE JOS: Background ALB cu butoane dificultate */}
      <div className="p-4 bg-white">
        <p className="text-xs font-semibold text-neutral-600 mb-2">
          🎯 Alege dificultatea:
        </p>

        {/* Butoane pe ORIZONTALĂ - mai compact */}
        <div className="flex gap-2">
          <button
            onClick={() => handleDifficultyClick('easy')}
            className="flex-1 py-2 px-2 rounded-lg font-semibold text-xs transition border-2 border-success text-success hover:bg-success hover:text-white"
            title="Ușor"
          >
            🟢
            <span className="hidden sm:inline ml-1">Ușor</span>
          </button>

          <button
            onClick={() => handleDifficultyClick('medium')}
            className="flex-1 py-2 px-2 rounded-lg font-semibold text-xs transition border-2 border-warning text-warning hover:bg-warning hover:text-white"
            title="Mediu"
          >
            🟡
            <span className="hidden sm:inline ml-1">Mediu</span>
          </button>

          <button
            onClick={() => handleDifficultyClick('hard')}
            className="flex-1 py-2 px-2 rounded-lg font-semibold text-xs transition border-2 border-error text-error hover:bg-error hover:text-white"
            title="Greu"
          >
            🔴
            <span className="hidden sm:inline ml-1">Greu</span>
          </button>
        </div>
      </div>

    </div>
  );
}

export default ThemeCard;

/**
 * ÎMBUNĂTĂȚIRI v2 - COMPACT:
 *
 * ✅ Padding redus: p-6 → p-5 (top), p-4 (bottom)
 * ✅ Icon mai mic: text-5xl → text-4xl
 * ✅ Nume + întrebări side-by-side cu icon
 * ✅ Descriere cu line-clamp-2 (max 2 rânduri)
 * ✅ Butoane pe ORIZONTALĂ în loc de vertical
 * ✅ Butoane mai mici: py-3 → py-2, text-sm → text-xs
 * ✅ Text buton ascuns pe mobile foarte mic (doar emoji)
 *
 * REZULTAT: Card ~40% mai compact, fără pierdere de funcționalitate
 */
