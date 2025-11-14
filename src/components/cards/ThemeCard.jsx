/**
 * ThemeCard.jsx - Reusable Theme Card Component
 *
 * Usage:
 * <ThemeCard
 *   theme={theme}
 *   onSelect={(themeSlug, difficulty) => navigate(`/subjects/${subjectSlug}/quiz/${themeSlug}?difficulty=${difficulty}`)}
 *   showQuestionCount={true}
 *   showDescription={true}
 *   showDifficultyButtons={true}
 * />
 */

import React from 'react';
import PropTypes from 'prop-types';

export function ThemeCard({
  theme,
  onSelect,
  showQuestionCount = true,
  showDescription = true,
  showDifficultyButtons = true,
  className = '',
}) {
  if (!theme) return null;

  const handleDifficultySelect = (e, difficulty) => {
    e.stopPropagation(); // Prevent card click
    if (onSelect) {
      onSelect(theme.slug, difficulty);
    }
  };

  const handleCardClick = () => {
    // If no difficulty buttons, just select with default difficulty
    if (!showDifficultyButtons && onSelect) {
      onSelect(theme.slug, 'easy');
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`
        bg-cream dark:bg-warm-brown
        border-[5px] border-warm-brown dark:border-sand
        p-6
        ${!showDifficultyButtons ? 'cursor-pointer hover:-translate-x-2 hover:-translate-y-2 hover:shadow-[10px_10px_0_#2D2416]' : ''}
        transition-all duration-200
        hover:-translate-x-1 hover:-translate-y-1 hover:border-deep-brown hover:dark:border-off-white
        hover:shadow-[6px_6px_0_#2D2416]
        text-left
        min-h-[400px]
        flex flex-col
        ${className}
      `.trim()}
    >
      {/* Header: Icon + Title (Horizontal Layout - matching SubjectCard) */}
      <div className="flex items-center gap-3 mb-3 relative z-10">
        {/* Icon */}
        <div className="text-5xl flex-shrink-0">
          {theme.icon}
        </div>

        {/* Title */}
        <h3 className="text-xl font-heading font-black uppercase tracking-tight text-deep-brown dark:text-off-white leading-tight">
          {theme.name}
        </h3>
      </div>

      {/* Description */}
      {showDescription && theme.description && (
        <p className="text-sm font-body text-deep-brown/70 dark:text-off-white/70 leading-snug relative z-10 mb-3">
          {theme.description}
        </p>
      )}

      {/* STATS SECTION - PROMINENT */}
      {showQuestionCount && (
        <div className="text-center py-4 mb-3 relative z-10">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl font-mono font-black text-deep-brown dark:text-off-white"
                 style={{ textShadow: '2px 2px 0 #C8FF00' }}>
                {theme.questionsCount || theme.totalQuestions || 0}+
              </p>
              <p className="text-xs font-heading font-bold uppercase tracking-wide text-deep-brown/70 dark:text-off-white/70 mt-1">
                Întrebări
              </p>
            </div>
          </div>
        </div>
      )}

      {/* DIFFICULTY BUTTONS SECTION - VERTICAL LAYOUT */}
      {showDifficultyButtons && (
        <div className="flex flex-col gap-2 mt-auto">
          <button
            onClick={(e) => handleDifficultySelect(e, 'easy')}
            className="w-full bg-[#8B9B7A] text-off-white border-3 border-deep-brown py-3 px-4 font-heading font-bold text-sm uppercase hover:-translate-y-1 hover:shadow-[0_4px_0_#2D2416] transition-all duration-150"
            title="Easy - 10 puncte per întrebare"
          >
            Easy
          </button>
          <button
            onClick={(e) => handleDifficultySelect(e, 'medium')}
            className="w-full bg-[#FF6B00] text-off-white border-3 border-deep-brown py-3 px-4 font-heading font-bold text-sm uppercase hover:-translate-y-1 hover:shadow-[0_4px_0_#2D2416] transition-all duration-150"
            title="Medium - 30 puncte per întrebare"
          >
            Medium
          </button>
          <button
            onClick={(e) => handleDifficultySelect(e, 'hard')}
            className="w-full bg-[#FF0080] text-off-white border-3 border-deep-brown py-3 px-4 font-heading font-bold text-sm uppercase hover:-translate-y-1 hover:shadow-[0_4px_0_#2D2416] transition-all duration-150"
            title="Hard - 50 puncte per întrebare"
          >
            Hard
          </button>
        </div>
      )}
    </div>
  );
}

ThemeCard.propTypes = {
  theme: PropTypes.shape({
    id: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string,
    description: PropTypes.string,
    totalQuestions: PropTypes.number,
    questionsCount: PropTypes.number,
  }).isRequired,
  onSelect: PropTypes.func,
  showQuestionCount: PropTypes.bool,
  showDescription: PropTypes.bool,
  showDifficultyButtons: PropTypes.bool,
  className: PropTypes.string,
};

export default ThemeCard;
