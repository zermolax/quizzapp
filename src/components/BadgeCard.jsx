/**
 * BadgeCard.jsx
 *
 * Component pentru afișare badge cu icon IconPark
 */

import React from 'react';
import * as Icons from '@icon-park/react';

/**
 * BadgeCard Component
 *
 * @param {Object} badge - Badge object cu: id, name, description, icon, color, rarity
 * @param {Boolean} earned - Dacă user-ul a câștigat badge-ul
 * @param {Date} earnedAt - Data când a fost câștigat (dacă earned=true)
 */
export function BadgeCard({ badge, earned = false, earnedAt = null }) {

  // Get IconPark component by name
  const IconComponent = Icons[badge.icon];

  // Rarity colors
  const rarityColors = {
    common: {
      border: 'border-neutral-400',
      bg: 'bg-neutral-50',
      text: 'text-neutral-600',
      glow: ''
    },
    rare: {
      border: 'border-blue-500',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      glow: 'shadow-blue-200'
    },
    epic: {
      border: 'border-purple-500',
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      glow: 'shadow-purple-200'
    },
    legendary: {
      border: 'border-yellow-500',
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      glow: 'shadow-yellow-200'
    }
  };

  const rarity = rarityColors[badge.rarity] || rarityColors.common;

  return (
    <div
      className={`
        relative rounded-xl p-4 transition-all duration-300
        border-2 ${rarity.border} ${rarity.bg}
        ${earned ? `${rarity.glow} shadow-lg hover:shadow-xl` : 'opacity-40 grayscale'}
        ${earned ? 'cursor-pointer hover:scale-105' : ''}
      `}
      title={earned ? `Câștigat: ${earnedAt ? new Date(earnedAt.seconds * 1000).toLocaleDateString('ro-RO') : ''}` : 'Locked'}
    >
      {/* Badge Icon */}
      <div className="flex justify-center mb-3">
        {IconComponent ? (
          <IconComponent
            theme="outline"
            size={48}
            fill={earned ? badge.color : '#9CA3AF'}
            strokeWidth={3}
          />
        ) : (
          <div className="text-4xl">{badge.icon}</div>
        )}
      </div>

      {/* Badge Name */}
      <h4 className={`text-center font-bold mb-1 ${earned ? rarity.text : 'text-neutral-500'}`}>
        {badge.name}
      </h4>

      {/* Badge Description */}
      <p className="text-xs text-center text-neutral-600 mb-2">
        {badge.description}
      </p>

      {/* Badge Points */}
      <div className="flex justify-center items-center gap-1">
        <span className="text-xs font-semibold text-neutral-700">
          +{badge.points}
        </span>
        <span className="text-xs text-neutral-500">pts</span>
      </div>

      {/* Rarity Badge */}
      <div className="absolute top-2 right-2">
        <span className={`
          text-xs font-bold px-2 py-1 rounded-full
          ${badge.rarity === 'legendary' && 'bg-yellow-200 text-yellow-800'}
          ${badge.rarity === 'epic' && 'bg-purple-200 text-purple-800'}
          ${badge.rarity === 'rare' && 'bg-blue-200 text-blue-800'}
          ${badge.rarity === 'common' && 'bg-neutral-200 text-neutral-700'}
        `}>
          {badge.rarity === 'legendary' && '✨'}
          {badge.rarity === 'epic' && '💜'}
          {badge.rarity === 'rare' && '💎'}
          {badge.rarity === 'common' && '⭐'}
        </span>
      </div>

      {/* Lock icon if not earned */}
      {!earned && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-neutral-900 bg-opacity-50 rounded-full p-3">
            <Icons.Lock theme="outline" size={32} fill="#ffffff" />
          </div>
        </div>
      )}
    </div>
  );
}

export default BadgeCard;
