/**
 * DailyChallengeCard.jsx
 *
 * Card pentru Daily Challenge pe Home/LandingPage
 * Arată status: not completed (portocaliu) sau completed (verde)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  getTodayDateString,
  getUserDailyChallenge,
  getDailyParticipantCount
} from '../../services/dailyChallengeService';

export function DailyChallengeCard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [todayChallenge, setTodayChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [participantCount, setParticipantCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadTodayChallenge();
    } else {
      setLoading(false);
    }
  }, [user]);

  async function loadTodayChallenge() {
    try {
      const today = getTodayDateString();
      const challenge = await getUserDailyChallenge(user.uid, today);
      setTodayChallenge(challenge);

      // Load participant count
      const count = await getDailyParticipantCount(today);
      setParticipantCount(count);

    } catch (error) {
      console.error('Error loading daily challenge:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleClick() {
    if (!user) {
      // Redirect to login
      navigate('/');
      return;
    }

    if (todayChallenge?.completed) {
      // Already completed, show leaderboard
      navigate('/daily-leaderboard');
    } else {
      // Start daily challenge
      navigate('/daily-challenge');
    }
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl p-6 text-white shadow-lg animate-pulse">
        <div className="h-6 bg-white/20 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-white/20 rounded w-3/4"></div>
      </div>
    );
  }

  const isCompleted = todayChallenge?.completed;

  return (
    <div
      onClick={handleClick}
      className={`
        ${isCompleted
          ? 'bg-gradient-to-br from-green-400 to-emerald-500'
          : 'bg-gradient-to-br from-orange-400 to-amber-500'
        }
        rounded-2xl p-6 text-white shadow-lg cursor-pointer
        transform hover:scale-105 transition-all duration-300
        hover:shadow-2xl
        relative overflow-hidden
      `}
    >
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-white/10 animate-pulse"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🌟</span>
            <h3 className="text-xl font-bold">Daily Challenge</h3>
          </div>

          {isCompleted && (
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
              ✓ Completed
            </span>
          )}
        </div>

        {/* Status message */}
        {isCompleted ? (
          <div>
            <p className="text-lg font-semibold mb-1">
              🏆 {todayChallenge.score}/{todayChallenge.maxScore} pts
            </p>
            <p className="text-white/90 text-sm">
              You completed today's challenge! {todayChallenge.percentage}%
            </p>
            <p className="text-white/80 text-xs mt-2">
              👥 {participantCount} players completed today
            </p>
          </div>
        ) : (
          <div>
            <p className="text-lg font-semibold mb-1">
              Play today's challenge!
            </p>
            <p className="text-white/90 text-sm">
              12 questions • 2x points • New every day
            </p>
            <p className="text-white/80 text-xs mt-2">
              👥 {participantCount} players already playing
            </p>
          </div>
        )}

        {/* Call to action */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            {isCompleted ? (
              <>
                <span>View Leaderboard</span>
                <span>→</span>
              </>
            ) : (
              <>
                <span>Start Now</span>
                <span className="animate-bounce">→</span>
              </>
            )}
          </div>

          {/* Timer until next challenge (optional) */}
          <div className="text-xs text-white/70">
            <TimeUntilReset />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Component to show time until midnight (next challenge)
 */
function TimeUntilReset() {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    function calculateTimeLeft() {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);

      const diff = midnight - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft(`${hours}h ${minutes}m`);
    }

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return <span>Resets in {timeLeft}</span>;
}

export default DailyChallengeCard;
