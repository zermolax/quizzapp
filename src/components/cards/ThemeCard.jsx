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
        border-4 border-warm-brown dark:border-sand
        p-6
        ${!showDifficultyButtons ? 'cursor-pointer hover:-translate-x-2 hover:-translate-y-2 hover:shadow-[10px_10px_0_#2D2416]' : ''}
        transition-all duration-150
        text-left
        ${className}
      `.trim()}
    >
      {/* Icon */}
      <div className="text-5xl mb-3">{theme.icon}</div>

      {/* Title */}
      <h3 className="text-2xl font-heading font-black uppercase text-deep-brown dark:text-off-white mb-2">
        {theme.name}
      </h3>

      {/* Question Count */}
      {showQuestionCount && (
        <p className="text-xs font-mono text-deep-brown/50 dark:text-off-white/50 mb-3">
          {theme.questionsCount || theme.totalQuestions || 0} întrebări
        </p>
      )}

      {/* Description */}
      {showDescription && theme.description && (
        <p className="text-sm font-body text-deep-brown/70 dark:text-off-white/70 mb-4">
          {theme.description}
        </p>
      )}

      {/* Difficulty Buttons */}
      {showDifficultyButtons && (
        <div className="flex gap-2">
          <button
            onClick={(e) => handleDifficultySelect(e, 'easy')}
            className="flex-1 bg-[#8B9B7A] text-off-white border-2 border-deep-brown py-2 px-3 font-heading font-bold text-sm uppercase hover:-translate-y-1 hover:shadow-brutal hover:shadow-deep-brown transition-all duration-150"
            title="Easy - 10 puncte per întrebare"
          >
            E
          </button>
          <button
            onClick={(e) => handleDifficultySelect(e, 'medium')}
            className="flex-1 bg-[#FF6B00] text-off-white border-2 border-deep-brown py-2 px-3 font-heading font-bold text-sm uppercase hover:-translate-y-1 hover:shadow-brutal hover:shadow-deep-brown transition-all duration-150"
            title="Medium - 30 puncte per întrebare"
          >
            M
          </button>
          <button
            onClick={(e) => handleDifficultySelect(e, 'hard')}
            className="flex-1 bg-[#FF0080] text-off-white border-2 border-deep-brown py-2 px-3 font-heading font-bold text-sm uppercase hover:-translate-y-1 hover:shadow-brutal hover:shadow-deep-brown transition-all duration-150"
            title="Hard - 50 puncte per întrebare"
          >
            H
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
