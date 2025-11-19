/**
 * sounds.js
 *
 * Sound effects manager pentru gamification
 * Cu toggle pentru enable/disable în settings
 */

class SoundManager {
  constructor() {
    // Sound files map
    this.sounds = {
      correct: null,
      wrong: null,
      badgeUnlock: null,
      streak: null,
      perfect: null,
      levelUp: null,
      click: null
    };

    // Check if sounds are enabled (default: true)
    this.enabled = localStorage.getItem('soundsEnabled') !== 'false';

    // Volume (0.0 to 1.0)
    this.volume = parseFloat(localStorage.getItem('soundVolume') || '0.5');

    // Initialize sounds (lazy loading)
    this.initialized = false;
  }

  /**
   * Initialize audio files
   * Lazy loading - doar când e nevoie
   */
  init() {
    if (this.initialized) return;

    try {
      // Folosim placeholder sounds pentru moment
      // În producție, vor fi înlocuite cu sound-uri reale
      this.sounds = {
        correct: this.createBeep(800, 0.1, 'sine'),
        wrong: this.createBeep(200, 0.2, 'sawtooth'),
        badgeUnlock: this.createBeep(1000, 0.3, 'sine'),
        streak: this.createBeep(600, 0.2, 'triangle'),
        perfect: this.createBeep(1200, 0.4, 'sine'),
        levelUp: this.createBeep(900, 0.3, 'triangle'),
        click: this.createBeep(400, 0.05, 'square')
      };

      this.initialized = true;
    } catch (error) {
      console.error('Error initializing sounds:', error);
    }
  }

  /**
   * Create beep sound usando Web Audio API
   * Fallback pentru când nu avem MP3-uri
   */
  createBeep(frequency, duration, type = 'sine') {
    // Returnăm un obiect care mimează Audio API
    return {
      play: () => {
        if (!this.enabled) return Promise.resolve();

        try {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.frequency.value = frequency;
          oscillator.type = type;
          gainNode.gain.setValueAtTime(this.volume, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + duration);

          return Promise.resolve();
        } catch (error) {
          console.error('Error playing beep:', error);
          return Promise.reject(error);
        }
      },
      currentTime: 0
    };
  }

  /**
   * Play sound by name
   */
  play(soundName) {
    if (!this.enabled) return;

    // Lazy init
    if (!this.initialized) {
      this.init();
    }

    const sound = this.sounds[soundName];
    if (sound) {
      try {
        sound.currentTime = 0;
        sound.play().catch(() => {
          // Ignore autoplay errors (browser policy)
        });
      } catch (error) {
        // Silent fail pentru sound errors
      }
    }
  }

  /**
   * Toggle sounds on/off
   */
  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('soundsEnabled', this.enabled.toString());
    return this.enabled;
  }

  /**
   * Set volume (0.0 to 1.0)
   */
  setVolume(value) {
    this.volume = Math.max(0, Math.min(1, value));
    localStorage.setItem('soundVolume', this.volume.toString());
  }

  /**
   * Get current enabled state
   */
  isEnabled() {
    return this.enabled;
  }

  /**
   * Get current volume
   */
  getVolume() {
    return this.volume;
  }
}

// Singleton instance
export const soundManager = new SoundManager();

// Convenience exports
export const playCorrect = () => soundManager.play('correct');
export const playWrong = () => soundManager.play('wrong');
export const playBadgeUnlock = () => soundManager.play('badgeUnlock');
export const playStreak = () => soundManager.play('streak');
export const playPerfect = () => soundManager.play('perfect');
export const playLevelUp = () => soundManager.play('levelUp');
export const playClick = () => soundManager.play('click');
