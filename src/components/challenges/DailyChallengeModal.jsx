/**
 * DailyChallengeModal.jsx
 *
 * Pop-up modal pentru Daily Challenge
 * Apare DOAR la prima vizită a zilei (dismissable)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  getTodayDateString,
  getUserDailyChallenge
} from '../../services/dailyChallengeService';

export function DailyChallengeModal() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkShouldShow();
    } else {
      setLoading(false);
    }
  }, [user]);

  async function checkShouldShow() {
    try {
      // Check if already completed today
      const today = getTodayDateString();
      const challenge = await getUserDailyChallenge(user.uid, today);

      if (challenge?.completed) {
        // Already completed, don't show
        setIsOpen(false);
        setLoading(false);
        return;
      }

      // Check localStorage if dismissed today
      const dismissedDate = localStorage.getItem('dailyChallenge_dismissed');
      if (dismissedDate === today) {
        setIsOpen(false);
        setLoading(false);
        return;
      }

      // Show modal!
      setIsOpen(true);

    } catch (error) {
      console.error('Error checking daily challenge:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    // Mark as dismissed for today
    const today = getTodayDateString();
    localStorage.setItem('dailyChallenge_dismissed', today);
    setIsOpen(false);
  }

  function handlePlay() {
    navigate('/daily-challenge');
    setIsOpen(false);
  }

  if (loading || !isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transform animate-scaleIn">
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-orange-400 to-amber-500 p-8 text-white text-center relative">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition"
          >
            ×
          </button>

          {/* Icon */}
          <div className="text-6xl mb-4 animate-bounce">🌟</div>

          {/* Title */}
          <h2 className="text-3xl font-bold mb-2">
            Daily Challenge
          </h2>
          <p className="text-white/90 text-lg">
            New Challenge Available!
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="space-y-4 mb-6">
            {/* Feature 1 */}
            <div className="flex items-start gap-3">
              <div className="text-2xl">🎯</div>
              <div>
                <h3 className="font-semibold text-gray-800">12 Questions</h3>
                <p className="text-sm text-gray-600">
                  Same questions for everyone today
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚡</div>
              <div>
                <h3 className="font-semibold text-gray-800">2x Points</h3>
                <p className="text-sm text-gray-600">
                  Earn double points for completing
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-3">
              <div className="text-2xl">🏆</div>
              <div>
                <h3 className="font-semibold text-gray-800">Daily Leaderboard</h3>
                <p className="text-sm text-gray-600">
                  Compete with players worldwide
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-start gap-3">
              <div className="text-2xl">🔥</div>
              <div>
                <h3 className="font-semibold text-gray-800">Build Your Streak</h3>
                <p className="text-sm text-gray-600">
                  Play daily to earn streak badges
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={handlePlay}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              🎮 Play Now
            </button>

            <button
              onClick={handleClose}
              className="w-full text-gray-600 py-2 rounded-xl font-medium hover:bg-gray-100 transition"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyChallengeModal;
