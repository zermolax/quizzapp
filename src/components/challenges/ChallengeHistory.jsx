/**
 * ChallengeHistory.jsx
 *
 * Component pentru a afișa istoricul challenge-urilor în Profile
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  getUserChallengeHistory,
  getUserCreatedChallenges
} from '../../services/challengeService';
import { useNavigate } from 'react-router-dom';

export function ChallengeHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [createdChallenges, setCreatedChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('played'); // 'played' or 'created'

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  async function loadHistory() {
    try {
      const [historyData, createdData] = await Promise.all([
        getUserChallengeHistory(user.uid),
        getUserCreatedChallenges(user.uid)
      ]);

      setHistory(historyData);
      setCreatedChallenges(createdData);

    } catch (error) {
      console.error('Error loading challenge history:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleChallengeClick(challengeId) {
    navigate(`/challenge/${challengeId}`);
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  const totalPlayed = history.length;
  const totalCreated = createdChallenges.length;
  const wins = history.filter(h => h.result === 'won').length;
  const winRate = totalPlayed > 0 ? Math.round((wins / totalPlayed) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">⚔️ Challenge History</h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white/20 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">{totalPlayed}</div>
            <div className="text-xs text-white/80">Played</div>
          </div>

          <div className="bg-white/20 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">{wins}</div>
            <div className="text-xs text-white/80">Wins</div>
          </div>

          <div className="bg-white/20 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">{winRate}%</div>
            <div className="text-xs text-white/80">Win Rate</div>
          </div>

          <div className="bg-white/20 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">{totalCreated}</div>
            <div className="text-xs text-white/80">Created</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('played')}
          className={`
            flex-1 py-3 px-4 font-semibold text-sm transition
            ${activeTab === 'played'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-500 hover:text-gray-700'
            }
          `}
        >
          Played ({totalPlayed})
        </button>

        <button
          onClick={() => setActiveTab('created')}
          className={`
            flex-1 py-3 px-4 font-semibold text-sm transition
            ${activeTab === 'created'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-500 hover:text-gray-700'
            }
          `}
        >
          Created ({totalCreated})
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'played' && (
          <>
            {history.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-5xl mb-3">⚔️</div>
                <p className="mb-2">No challenges played yet</p>
                <p className="text-sm">Accept a challenge to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((item) => {
                  const isWon = item.result === 'won';

                  return (
                    <div
                      key={item.challengeId}
                      onClick={() => handleChallengeClick(item.challengeId)}
                      className={`
                        p-4 rounded-xl border-2 cursor-pointer transition hover:shadow-md
                        ${isWon
                          ? 'border-green-200 bg-green-50 hover:border-green-300'
                          : 'border-red-200 bg-red-50 hover:border-red-300'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`
                            text-3xl
                            ${isWon ? '🏆' : '💪'}
                          `}>
                            {isWon ? '🏆' : '💪'}
                          </div>

                          <div>
                            <div className="font-semibold text-gray-800">
                              vs {item.createdBy.displayName}
                            </div>
                            <div className="text-sm text-gray-600">
                              {item.difficulty} • {item.participantCount} players
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className={`
                            text-xl font-bold
                            ${isWon ? 'text-green-600' : 'text-red-600'}
                          `}>
                            {item.score}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.percentage}%
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeTab === 'created' && (
          <>
            {createdChallenges.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-5xl mb-3">🎯</div>
                <p className="mb-2">No challenges created yet</p>
                <p className="text-sm">Create your first challenge!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {createdChallenges.map((challenge) => {
                  const participantCount = Object.keys(challenge.participants || {}).length;
                  const isActive = challenge.status === 'active';

                  return (
                    <div
                      key={challenge.id}
                      onClick={() => handleChallengeClick(challenge.id)}
                      className="p-4 rounded-xl border-2 border-gray-200 bg-gray-50 hover:border-purple-300 cursor-pointer transition hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">
                            {isActive ? '🎮' : '⏳'}
                          </div>

                          <div>
                            <div className="font-semibold text-gray-800">
                              {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)} Challenge
                            </div>
                            <div className="text-sm text-gray-600">
                              {participantCount} {participantCount === 1 ? 'player' : 'players'}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className={`
                            text-xs font-semibold px-2 py-1 rounded-full
                            ${isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-200 text-gray-700'
                            }
                          `}>
                            {challenge.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ChallengeHistory;
