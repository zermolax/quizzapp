/**
 * BadgeUnlockModal.jsx
 *
 * Modal pentru celebration când user-ul primește un badge nou
 * Cu confetti, sound effects și design brutalist
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { celebrateBadge } from '../utils/confetti';
import { playBadgeUnlock } from '../utils/sounds';

// Icon mapping pentru badges (folosim emoji pentru moment)
const BADGE_ICONS = {
  'CheckOne': '✅',
  'Fire': '🔥',
  'FireTwo': '🔥',
  'Star': '⭐',
  'Trophy': '🏆',
  'Crown': '👑',
  'DiamondRing': '💎',
  'Lightning': '⚡',
  'BookOpen': '📖',
  'World': '🌍',
  'Leaves': '🌿',
  'Shield': '🛡️',
  'Speed': '💨',
  'Moon': '🌙'
};

export function BadgeUnlockModal({ badge, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show animation
    setIsVisible(true);

    // Trigger confetti and sound
    setTimeout(() => {
      celebrateBadge(badge.color);
      playBadgeUnlock();
    }, 100);

    // Auto-close după 5 secunde (opțional)
    // const timer = setTimeout(() => {
    //   handleClose();
    // }, 5000);

    // return () => clearTimeout(timer);
  }, [badge]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for fade out animation
  };

  /**
   * Get rarity color și label
   */
  const getRarityInfo = () => {
    switch (badge.rarity) {
      case 'common':
        return { color: '#8B9B7A', label: 'Comun', borderColor: '#4A3D2F' };
      case 'rare':
        return { color: '#1982C4', label: 'Rar', borderColor: '#6A4C93' };
      case 'epic':
        return { color: '#6A4C93', label: 'Epic', borderColor: '#FF0080' };
      case 'legendary':
        return { color: '#FF0080', label: 'Legendar', borderColor: '#00FFFF' };
      default:
        return { color: '#06A77D', label: 'Normal', borderColor: '#2D2416' };
    }
  };

  const rarityInfo = getRarityInfo();

  return (
    <div
      className={`
        fixed inset-0 bg-deep-brown/95 dark:bg-off-white/95
        flex items-center justify-center z-[9999] p-4
        transition-opacity duration-300
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
      onClick={handleClose}
    >
      <div
        className={`
          bg-cream dark:bg-warm-brown
          border-6 border-deep-brown dark:border-off-white
          max-w-md w-full p-8 text-center relative
          transform transition-all duration-300
          ${isVisible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-10'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top neon bar */}
        <div
          className="absolute top-0 left-0 right-0 h-4"
          style={{ backgroundColor: badge.color }}
        ></div>

        {/* Rarity badge */}
        <div className="absolute top-6 right-6">
          <div
            className="px-3 py-1 border-3 font-mono text-xs font-bold uppercase"
            style={{
              backgroundColor: rarityInfo.color,
              borderColor: rarityInfo.borderColor,
              color: '#FAFAF8'
            }}
          >
            {rarityInfo.label}
          </div>
        </div>

        {/* Badge icon (huge) */}
        <div className={`
          text-9xl mb-4
          ${badge.rarity === 'legendary' ? 'animate-pulse' : 'animate-bounce'}
        `}>
          {BADGE_ICONS[badge.icon] || '🎯'}
        </div>

        {/* "Badge Nou!" title */}
        <h2 className="font-heading text-4xl font-black uppercase
                       text-deep-brown dark:text-off-white mb-2
                       tracking-tighter">
          Badge Nou!
        </h2>

        {/* Badge name */}
        <p
          className="font-heading text-2xl font-bold mb-3"
          style={{ color: badge.color }}
        >
          {badge.name}
        </p>

        {/* Description */}
        <p className="font-body text-lg text-deep-brown/70
                      dark:text-off-white/70 mb-6 leading-relaxed">
          {badge.description}
        </p>

        {/* Points earned */}
        <div className="inline-block bg-neon-lime
                        border-4 border-deep-brown
                        px-6 py-3 mb-6
                        hover:-translate-x-1 hover:-translate-y-1
                        hover:shadow-brutal hover:shadow-deep-brown
                        transition-all duration-150">
          <span className="font-mono text-2xl font-black text-deep-brown">
            +{badge.points} puncte
          </span>
        </div>

        {/* Category tag */}
        <div className="mb-6">
          <span className="inline-block bg-sand border-3 border-warm-brown
                           px-4 py-2 font-heading font-bold uppercase text-xs
                           text-deep-brown">
            {badge.category === 'beginner' && '🎯 Începător'}
            {badge.category === 'quantity' && '📊 Cantitate'}
            {badge.category === 'score' && '⭐ Performanță'}
            {badge.category === 'streak' && '🔥 Streak'}
            {badge.category === 'subject' && '📚 Disciplină'}
            {badge.category === 'difficulty' && '🛡️ Dificultate'}
            {badge.category === 'speed' && '💨 Viteză'}
            {badge.category === 'special' && '✨ Special'}
          </span>
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="w-full bg-deep-brown dark:bg-off-white
                     text-off-white dark:text-deep-brown
                     border-4 border-deep-brown dark:border-off-white
                     px-6 py-3 font-heading font-bold uppercase text-sm
                     hover:-translate-x-1 hover:-translate-y-1
                     hover:shadow-brutal hover:shadow-deep-brown
                     dark:hover:shadow-off-white
                     transition-all duration-150">
          Continuă →
        </button>

        {/* Subtle instruction */}
        <p className="mt-3 text-xs font-mono text-warm-brown dark:text-sand">
          Click oriunde pentru a închide
        </p>
      </div>
    </div>
  );
}

BadgeUnlockModal.propTypes = {
  badge: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    rarity: PropTypes.oneOf(['common', 'rare', 'epic', 'legendary']).isRequired,
    category: PropTypes.string.isRequired,
    points: PropTypes.number.isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired
};

export default BadgeUnlockModal;
