/**
 * SoundToggle.jsx
 *
 * Toggle button pentru sound effects în navigation/settings
 * Compatible cu design system semi-brutalist
 */

import React, { useState, useEffect } from 'react';
import { soundManager } from '../utils/sounds';

export function SoundToggle({ className = '' }) {
  const [isEnabled, setIsEnabled] = useState(soundManager.isEnabled());

  const handleToggle = () => {
    const newState = soundManager.toggle();
    setIsEnabled(newState);

    // Play a test sound când activezi
    if (newState) {
      soundManager.play('click');
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        w-12 h-12
        bg-deep-brown dark:bg-off-white
        text-off-white dark:text-deep-brown
        border-4 border-deep-brown dark:border-off-white
        flex items-center justify-center
        text-xl
        transition-all duration-150
        hover:bg-neon-cyan hover:text-deep-brown
        hover:rotate-12
        ${isEnabled ? '' : 'opacity-50'}
        ${className}
      `}
      aria-label={isEnabled ? 'Dezactivează sunetele' : 'Activează sunetele'}
      title={isEnabled ? 'Sunete activate' : 'Sunete dezactivate'}
    >
      {isEnabled ? '🔊' : '🔇'}
    </button>
  );
}

export default SoundToggle;
