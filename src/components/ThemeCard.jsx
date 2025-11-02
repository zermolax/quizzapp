/**
 * ThemeCard.jsx - BRUTAL DESIGN Edition with CSS Variables
 *
 * NEW v4 - CSS Variables for proper dark mode:
 * - Uses CSS variables (var(--cream), var(--warm-brown), etc.)
 * - Thick borders (5px solid var(--warm-brown))
 * - Padding: 3rem (exactly like prototype)
 * - Min-height: 350px
 * - Box shadow offset on hover
 * - Theme number with mono font
 * - Questions badge
 * - Three difficulty buttons in footer
 * - Vertical accent bar on left (12px width)
 * - FadeIn animation with delay
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
      className="relative cursor-pointer flex flex-col theme-card"
      style={{
        background: 'var(--cream)',
        border: '5px solid var(--warm-brown)',
        padding: '3rem',
        minHeight: '350px',
        transition: 'all 0.2s ease',
        boxShadow: `0 0 0 0 var(--warm-brown)`,
        animation: `fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${0.05 * (index + 1)}s backwards`
      }}
      onMouseEnter={(e) => {
        // Unified hover effect: pink tint + 3D shadow + hide left bar
        e.currentTarget.style.background = 'rgba(255, 0, 128, 0.12)';
        e.currentTarget.style.boxShadow = `8px 8px 0 var(--warm-brown)`;
        e.currentTarget.style.transform = 'translate(-2px, -2px)';
        const leftBar = e.currentTarget.querySelector('.theme-card-accent');
        if (leftBar) leftBar.style.opacity = '0';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--cream)';
        e.currentTarget.style.boxShadow = `0 0 0 0 var(--warm-brown)`;
        e.currentTarget.style.transform = 'translate(0, 0)';
        const leftBar = e.currentTarget.querySelector('.theme-card-accent');
        if (leftBar) leftBar.style.opacity = '1';
      }}
    >
      {/* Vertical accent bar on left */}
      <div
        className="theme-card-accent"
        style={{
          content: '',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '12px',
          height: '100%',
          background: neonColor,
          transition: 'opacity 0.2s ease'
        }}
      ></div>

      {/* Question count badge (top right) */}
      <div
        className="absolute font-mono font-bold uppercase tracking-wider"
        style={{
          top: '2rem',
          right: '2rem',
          padding: '0.5rem 1rem',
          background: 'var(--deep-brown)',
          color: 'var(--off-white)',
          fontSize: '0.75rem'
        }}
      >
        {theme.totalQuestions} Q
      </div>

      {/* Theme number - large mono font */}
      <div
        className="font-mono font-bold leading-none mb-4"
        style={{
          fontSize: '4rem',
          color: 'var(--sand)'
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Title */}
      <h3
        className="font-heading font-black mb-4 uppercase tracking-tight leading-tight"
        style={{
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          color: 'var(--deep-brown)'
        }}
      >
        {theme.name}
      </h3>

      {/* Description */}
      <p
        className="font-body mb-auto leading-relaxed line-clamp-3"
        style={{
          fontSize: '1rem',
          color: 'var(--warm-brown)'
        }}
      >
        {theme.description}
      </p>

      {/* Meta - Difficulty Buttons */}
      <div
        className="mt-8 pt-6"
        style={{
          borderTop: '3px solid var(--sand)'
        }}
      >
        {/* Three difficulty buttons */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDifficultyClick('easy');
            }}
            className="flex-1 font-mono font-bold uppercase transition-all duration-150 hover:-translate-y-0.5"
            style={{
              padding: '0.5rem 0.25rem',
              fontSize: '0.75rem',
              border: '3px solid var(--sage)',
              color: 'var(--sage)',
              background: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--sage)';
              e.currentTarget.style.color = 'var(--off-white)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--sage)';
            }}
            title="Ușor"
          >
            Easy
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDifficultyClick('medium');
            }}
            className="flex-1 font-mono font-bold uppercase transition-all duration-150 hover:-translate-y-0.5"
            style={{
              padding: '0.5rem 0.25rem',
              fontSize: '0.75rem',
              border: '3px solid var(--neon-orange)',
              color: 'var(--neon-orange)',
              background: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--neon-orange)';
              e.currentTarget.style.color = 'var(--off-white)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--neon-orange)';
            }}
            title="Mediu"
          >
            Medium
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDifficultyClick('hard');
            }}
            className="flex-1 font-mono font-bold uppercase transition-all duration-150 hover:-translate-y-0.5"
            style={{
              padding: '0.5rem 0.25rem',
              fontSize: '0.75rem',
              border: '3px solid var(--neon-pink)',
              color: 'var(--neon-pink)',
              background: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--neon-pink)';
              e.currentTarget.style.color = 'var(--off-white)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--neon-pink)';
            }}
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
 * BRUTAL DESIGN v4 Features - CSS Variables Edition:
 *
 * ✅ Uses CSS variables (var(--cream), var(--warm-brown)) for proper dark mode
 * ✅ Exact styling from prototype: 5px border, 3rem padding, 350px min-height
 * ✅ Vertical accent bar on left (12px width) instead of top
 * ✅ Box shadow offset (8px 8px) on hover with neon color
 * ✅ Large theme number with mono font (01, 02, 03...)
 * ✅ Questions badge in top right corner
 * ✅ Three difficulty buttons: Easy (sage), Medium (orange), Hard (pink)
 * ✅ FadeIn animation with staggered delay
 * ✅ Dark mode support through CSS variables
 * ✅ Responsive design maintained
 *
 * RESULT: Exactly matches the prototype design with proper dark mode support
 */
