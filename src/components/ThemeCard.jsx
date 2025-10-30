/**
 * ThemeCard.jsx - BRUTAL DESIGN Edition
 *
 * NEW v3 - Bold/Brutal Design:
 * - Thick borders (5px)
 * - Box shadow offset on hover
 * - Theme number with mono font
 * - Questions badge instead of difficulty badge
 * - Three difficulty buttons in footer (Easy, Medium, Hard)
 * - Accent bar at top
 * - Grayscale icon that becomes color on hover
 */

import React from 'react';

// Neon colors for accent bars (cycling through themes)
const NEON_COLORS = ['#FF0080', '#00FFFF', '#CCFF00', '#FF6B00'];

export function ThemeCard({ theme, onSelectTheme, index = 0 }) {

  const handleDifficultyClick = (difficulty) => {
    onSelectTheme(theme.slug, difficulty);
  };

  const neonColor = NEON_COLORS[index % NEON_COLORS.length];

  return (
    <div
      className="bg-cream dark:bg-deep-brown border-5 border-warm-brown dark:border-off-white p-6 sm:p-8 cursor-pointer transition-all duration-200 hover:-translate-x-2 hover:-translate-y-2 min-h-[400px] flex flex-col group relative"
      style={{
        boxShadow: `0 0 0 0 ${neonColor}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `8px 8px 0 ${neonColor}`;
        e.currentTarget.style.borderColor = neonColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 0 0 0 ${neonColor}`;
        e.currentTarget.style.borderColor = '';
      }}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-2"
        style={{ backgroundColor: neonColor }}
      ></div>

      {/* Question count badge (top right) */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 px-3 py-1.5 bg-deep-brown dark:bg-off-white font-mono text-xs font-bold uppercase tracking-wider text-off-white dark:text-deep-brown">
        {theme.totalQuestions} Q
      </div>

      {/* Theme number - large mono font */}
      <div className="font-mono text-6xl sm:text-7xl font-bold text-sand dark:text-sand leading-none mb-4">
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Title */}
      <h3 className="text-2xl sm:text-3xl font-heading font-black mb-3 uppercase tracking-tight text-deep-brown dark:text-off-white leading-tight">
        {theme.name}
      </h3>

      {/* Description */}
      <p className="text-sm sm:text-base font-body mb-auto text-deep-brown/70 dark:text-off-white/70 leading-relaxed line-clamp-3">
        {theme.description}
      </p>

      {/* Meta - Difficulty Buttons */}
      <div className="mt-6 pt-4 border-t-3 border-sand dark:border-warm-brown">
        <p className="text-xs font-mono font-bold uppercase tracking-wider text-deep-brown dark:text-off-white mb-3 opacity-70">
          Selectează Dificultatea:
        </p>

        {/* Three difficulty buttons */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDifficultyClick('easy');
            }}
            className="flex-1 py-2 px-1 font-mono text-xs font-bold uppercase border-3 border-sage text-sage hover:bg-sage hover:text-off-white transition-all duration-150 hover:-translate-y-0.5"
            title="Ușor"
          >
            Easy
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDifficultyClick('medium');
            }}
            className="flex-1 py-2 px-1 font-mono text-xs font-bold uppercase border-3 border-neon-orange text-neon-orange hover:bg-neon-orange hover:text-off-white transition-all duration-150 hover:-translate-y-0.5"
            title="Mediu"
          >
            Medium
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDifficultyClick('hard');
            }}
            className="flex-1 py-2 px-1 font-mono text-xs font-bold uppercase border-3 border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-off-white transition-all duration-150 hover:-translate-y-0.5"
            title="Greu"
          >
            Hard
          </button>
        </div>
      </div>

    </div>
  );
}

export default ThemeCard;

/**
 * BRUTAL DESIGN v3 Features:
 *
 * ✅ Thick 5px borders with hover neon color
 * ✅ Box shadow offset (8px 8px) on hover
 * ✅ Large theme number with mono font (01, 02, 03...)
 * ✅ Questions badge in top right corner
 * ✅ Three difficulty buttons: Easy (sage), Medium (orange), Hard (pink)
 * ✅ Accent bar at top with cycling neon colors
 * ✅ Dark mode support
 * ✅ Responsive design
 *
 * RESULT: Bold, modern, consistent with landing page design
 */
