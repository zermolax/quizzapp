/**
 * StreakDisplay.jsx
 *
 * Component pentru afișarea streak-ului cu animații și efecte
 * Compatibil cu design system-ul semi-brutalist
 */

import React from 'react';
import PropTypes from 'prop-types';

export function StreakDisplay({ days, size = 'medium', showLabel = true }) {
  // Size classes pentru diferite variante
  const sizeClasses = {
    small: {
      container: 'w-12 h-12',
      fire: 'text-2xl',
      badge: 'w-6 h-6 text-xs',
      label: 'text-xs'
    },
    medium: {
      container: 'w-16 h-16',
      fire: 'text-4xl',
      badge: 'w-8 h-8 text-sm',
      label: 'text-sm'
    },
    large: {
      container: 'w-24 h-24',
      fire: 'text-6xl',
      badge: 'w-10 h-10 text-base',
      label: 'text-base'
    }
  };

  const classes = sizeClasses[size];

  /**
   * Determină intensitatea flăcării bazat pe număr de zile
   */
  const getFlameIntensity = () => {
    if (days >= 30) {
      return {
        color: 'text-neon-pink',
        animation: 'animate-pulse',
        glow: true,
        label: 'Legendary!'
      };
    }
    if (days >= 7) {
      return {
        color: 'text-neon-orange',
        animation: 'animate-bounce',
        glow: true,
        label: 'On Fire!'
      };
    }
    if (days >= 3) {
      return {
        color: 'text-[#FF6B00]',
        animation: '',
        glow: false,
        label: 'Keep Going!'
      };
    }
    return {
      color: 'text-[#F77F00]',
      animation: '',
      glow: false,
      label: 'Just Started'
    };
  };

  const intensity = getFlameIntensity();

  /**
   * Get color pentru badge number
   */
  const getBadgeColor = () => {
    if (days >= 30) return 'bg-neon-pink border-neon-pink';
    if (days >= 7) return 'bg-neon-orange border-neon-orange';
    return 'bg-deep-brown dark:bg-off-white border-deep-brown dark:border-off-white';
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Fire display */}
      <div className={`relative ${classes.container} flex items-center justify-center`}>
        {/* Fire icon */}
        <div className={`
          absolute inset-0 flex items-center justify-center
          ${classes.fire}
          ${intensity.color}
          ${intensity.animation}
          transition-all duration-300
        `}>
          🔥
        </div>

        {/* Glow effect pentru streaks mari */}
        {intensity.glow && (
          <div className={`
            absolute inset-0 animate-ping opacity-20
            rounded-full
            ${days >= 30 ? 'bg-neon-pink' : 'bg-neon-orange'}
          `}></div>
        )}

        {/* Streak number badge */}
        <div className={`
          absolute bottom-0 right-0
          ${classes.badge}
          ${getBadgeColor()}
          ${days >= 7 ? 'text-off-white' : 'text-off-white dark:text-deep-brown'}
          border-2
          rounded-full
          flex items-center justify-center
          font-heading font-black
          shadow-brutal shadow-deep-brown
          transition-all duration-300
        `}>
          {days}
        </div>
      </div>

      {/* Label (optional) */}
      {showLabel && (
        <div className="text-center">
          <p className={`
            ${classes.label}
            font-heading font-bold uppercase tracking-wide
            ${intensity.color}
          `}>
            {days} {days === 1 ? 'zi' : 'zile'}
          </p>
          {days >= 3 && (
            <p className="text-xs font-mono text-warm-brown dark:text-sand">
              {intensity.label}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

StreakDisplay.propTypes = {
  days: PropTypes.number.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  showLabel: PropTypes.bool
};

export default StreakDisplay;
