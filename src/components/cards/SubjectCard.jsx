/**
 * SubjectCard.jsx - Reusable Subject Card Component
 *
 * Usage:
 * <SubjectCard
 *   subject={subject}
 *   variant="educational|specialist|compact"
 *   onSelect={(slug) => navigate(`/subjects/${slug}`)}
 *   showThemeCount={true}
 *   showDescription={true}
 * />
 */

import React from 'react';
import PropTypes from 'prop-types';

export function SubjectCard({
  subject,
  variant = 'educational',
  onSelect,
  showThemeCount = true,
  showDescription = true,
  className = '',
}) {
  if (!subject) return null;

  const handleClick = () => {
    if (onSelect) {
      onSelect(subject.slug);
    }
  };

  // Get description based on variant
  const description = subject.descriptions?.[variant] || subject.descriptions?.educational || '';

  return (
    <button
      onClick={handleClick}
      disabled={!subject.isActive}
      className={`
        bg-cream dark:bg-warm-brown
        border-4 border-warm-brown dark:border-sand
        p-6
        hover:-translate-x-2 hover:-translate-y-2
        hover:shadow-[10px_10px_0_#2D2416]
        transition-all duration-150
        text-left
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `.trim()}
    >
      {/* Icon */}
      <div className="text-5xl mb-3">{subject.icon}</div>

      {/* Title */}
      <h3 className="text-2xl font-heading font-black uppercase text-deep-brown dark:text-off-white mb-2">
        {subject.name}
      </h3>

      {/* Theme Count */}
      {showThemeCount && (
        <p className="text-xs font-mono text-deep-brown/50 dark:text-off-white/50 mb-3">
          {subject.themesCount || 0} teme disponibile
        </p>
      )}

      {/* Description */}
      {showDescription && description && (
        <p className="text-sm font-body text-deep-brown/70 dark:text-off-white/70 mb-4">
          {description}
        </p>
      )}

      {/* CTA */}
      <div className="flex items-center gap-2 text-lg font-heading font-bold text-deep-brown dark:text-off-white">
        Începe lecția <span className="text-2xl">→</span>
      </div>

      {/* Coming Soon Badge */}
      {!subject.isActive && (
        <div className="absolute top-2 right-2 bg-neon-orange text-off-white text-xs font-mono font-bold px-2 py-1 border-2 border-deep-brown">
          SOON
        </div>
      )}
    </button>
  );
}

SubjectCard.propTypes = {
  subject: PropTypes.shape({
    id: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    color: PropTypes.string,
    descriptions: PropTypes.object,
    isActive: PropTypes.bool,
    themesCount: PropTypes.number,
    questionsCount: PropTypes.number,
  }).isRequired,
  variant: PropTypes.oneOf(['educational', 'specialist', 'compact']),
  onSelect: PropTypes.func,
  showThemeCount: PropTypes.bool,
  showDescription: PropTypes.bool,
  className: PropTypes.string,
};

export default SubjectCard;
