/**
 * DailyLeaderboard.jsx
 *
 * Leaderboard pentru Daily Challenge
 * Top 10 players + user's rank
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  getTodayDateString,
  getDailyLeaderboard,
  getUserDailyChallenge,
  getUserDailyRank,
  getUserDailyStats
} from '../services/dailyChallengeService';

export function DailyLeaderboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [leaderboard, setLeaderboard] = useState([]);
  const [userChallenge, setUserChallenge] = useState(null);
  const [userRank, setUserRank] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    loadLeaderboard();
  }, [user]);

  async function loadLeaderboard() {
    try {
      const today = getTodayDateString();

      // Load leaderboard
      const leaderboardData = await getDailyLeaderboard(today);
      setLeaderboard(leaderboardData);

      // Load user's challenge
      const challenge = await getUserDailyChallenge(user.uid, today);
      setUserChallenge(challenge);

      // Load user's rank
      if (challenge?.completed) {
        const rank = await getUserDailyRank(user.uid, today);
        setUserRank(rank);
      }

      // Load user's stats
      const stats = await getUserDailyStats(user.uid);
      setUserStats(stats);

    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🏆</span>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Daily Leaderboard</h1>
                <p className="text-gray-600">Today's Top Players</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              ← Home
            </button>
          </div>

          {/* User Stats Summary */}
          {userStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-blue-700">{userStats.currentStreak}</div>
                <div className="text-xs text-blue-600 font-medium">🔥 Streak</div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-green-700">{userStats.totalCompleted}</div>
                <div className="text-xs text-green-600 font-medium">✓ Completed</div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-purple-700">{userStats.averageScore}%</div>
                <div className="text-xs text-purple-600 font-medium">📊 Average</div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-amber-700">{userStats.bestScore}%</div>
                <div className="text-xs text-amber-600 font-medium">⭐ Best</div>
              </div>
            </div>
          )}
        </div>

        {/* User's Result */}
        {userChallenge?.completed && (
          <div className="bg-gradient-to-br from-orange-400 to-amber-500 text-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">Your Result</h2>
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-3xl font-bold">{userChallenge.score}</div>
                    <div className="text-sm text-white/80">points</div>
                  </div>
                  <div className="h-12 w-px bg-white/30"></div>
                  <div>
                    <div className="text-3xl font-bold">{userChallenge.percentage}%</div>
                    <div className="text-sm text-white/80">accuracy</div>
                  </div>
                  <div className="h-12 w-px bg-white/30"></div>
                  <div>
                    <div className="text-3xl font-bold">{userChallenge.duration}s</div>
                    <div className="text-sm text-white/80">time</div>
                  </div>
                </div>
              </div>

              {userRank && (
                <div className="text-center bg-white/20 px-6 py-4 rounded-xl">
                  <div className="text-4xl font-bold">#{userRank}</div>
                  <div className="text-sm text-white/80">Your Rank</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4">
            <h2 className="text-xl font-bold">🏆 Top 10 Players</h2>
          </div>

          {leaderboard.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p className="text-lg mb-2">No one has completed today's challenge yet</p>
              <p className="text-sm">Be the first! 🚀</p>
              <button
                onClick={() => navigate('/daily-challenge')}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-bold hover:shadow-lg transition"
              >
                Play Now
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {leaderboard.map((entry, index) => {
                const isCurrentUser = user && entry.userId === user.uid;
                const medalEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : null;

                return (
                  <div
                    key={entry.userId}
                    className={`
                      p-4 flex items-center gap-4 transition
                      ${isCurrentUser ? 'bg-orange-50' : 'hover:bg-gray-50'}
                    `}
                  >
                    {/* Rank */}
                    <div className="w-12 text-center">
                      {medalEmoji ? (
                        <span className="text-3xl">{medalEmoji}</span>
                      ) : (
                        <span className="text-xl font-bold text-gray-600">#{index + 1}</span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {entry.photoURL ? (
                        <img
                          src={entry.photoURL}
                          alt={entry.displayName}
                          className="w-12 h-12 rounded-full border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                          {entry.displayName?.[0]?.toUpperCase() || '?'}
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 truncate">
                        {entry.displayName || 'Anonymous'}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs bg-orange-500 text-white px-2 py-1 rounded-full">You</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {entry.duration}s • {entry.percentage}% accuracy
                      </div>
                    </div>

                    {/* Score */}
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-600">{entry.score}</div>
                      <div className="text-xs text-gray-500">points</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Call to action if not played */}
        {!userChallenge?.completed && (
          <div className="mt-6 bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Haven't played today's challenge yet?
            </h3>
            <p className="text-gray-600 mb-6">
              Join {leaderboard.length} other players and compete for the top spot!
            </p>
            <button
              onClick={() => navigate('/daily-challenge')}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all"
            >
              🎮 Play Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DailyLeaderboard;
