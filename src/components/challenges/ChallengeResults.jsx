/**
 * ChallengeResults.jsx
 *
 * Comparative results pentru 1v1 Challenge
 * Side-by-side comparison + question breakdown
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  getChallengeById,
  getComparativeResults
} from '../../services/challengeService';

export function ChallengeResults({ challengeId }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && challengeId) {
      loadResults();
    }
  }, [user, challengeId]);

  async function loadResults() {
    try {
      const resultsData = await getComparativeResults(challengeId, user.uid);
      setResults(resultsData);
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500"></div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Results not available</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const { challenge, participants, currentUserResult, rank, winner, totalParticipants } = results;

  const isWinner = currentUserResult?.uid === winner?.uid;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="text-center">
            <div className="text-6xl mb-4">
              {isWinner ? '🏆' : '⚔️'}
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {isWinner ? 'Victory!' : 'Challenge Complete'}
            </h1>
            <p className="text-gray-600">
              {totalParticipants} {totalParticipants === 1 ? 'player' : 'players'} completed this challenge
            </p>
          </div>
        </div>

        {/* Your Result */}
        <div className={`
          rounded-2xl shadow-lg p-6 mb-6 text-white
          ${isWinner
            ? 'bg-gradient-to-br from-amber-400 to-orange-500'
            : 'bg-gradient-to-br from-purple-500 to-indigo-600'
          }
        `}>
          <h2 className="text-xl font-bold mb-4">Your Result</h2>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/20 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">{currentUserResult.score}</div>
              <div className="text-sm text-white/80">Points</div>
            </div>

            <div className="bg-white/20 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">{currentUserResult.percentage}%</div>
              <div className="text-sm text-white/80">Accuracy</div>
            </div>

            <div className="bg-white/20 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">{currentUserResult.duration}s</div>
              <div className="text-sm text-white/80">Time</div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <div className="inline-block bg-white/20 px-4 py-2 rounded-full">
              <span className="font-bold">Rank: #{rank}</span> / {totalParticipants}
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4">
            <h2 className="text-xl font-bold">🏆 Leaderboard</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {participants.map((participant, index) => {
              const isCurrentUser = participant.uid === user.uid;
              const isFirst = index === 0;
              const medalEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : null;

              return (
                <div
                  key={participant.uid}
                  className={`
                    p-4 flex items-center gap-4
                    ${isCurrentUser ? 'bg-purple-50' : 'bg-white'}
                    ${isFirst && 'bg-gradient-to-r from-amber-50 to-orange-50'}
                  `}
                >
                  {/* Rank */}
                  <div className="w-12 text-center">
                    {medalEmoji ? (
                      <span className="text-3xl">{medalEmoji}</span>
                    ) : (
                      <span className="text-lg font-bold text-gray-600">#{index + 1}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {participant.photoURL ? (
                      <img
                        src={participant.photoURL}
                        alt={participant.displayName}
                        className="w-12 h-12 rounded-full border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                        {participant.displayName?.[0]?.toUpperCase() || '?'}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">
                      {participant.displayName || 'Anonymous'}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs bg-purple-500 text-white px-2 py-1 rounded-full">You</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {participant.duration}s • {participant.percentage}% accuracy
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">
                      {participant.score}
                    </div>
                    <div className="text-xs text-gray-500">points</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Question-by-Question Breakdown */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📊 Question Breakdown
          </h2>

          <div className="space-y-2">
            {challenge.questions.map((question, index) => {
              const userAnswer = currentUserResult.answers[index];
              const isCorrect = userAnswer?.isCorrect;

              return (
                <div
                  key={index}
                  className={`
                    p-3 rounded-lg flex items-center justify-between
                    ${isCorrect ? 'bg-green-50' : 'bg-red-50'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center font-bold
                      ${isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
                    `}>
                      {index + 1}
                    </div>

                    <div className="text-sm text-gray-700 truncate max-w-md">
                      {question.question}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`
                      text-2xl
                      ${isCorrect ? 'text-green-600' : 'text-red-600'}
                    `}>
                      {isCorrect ? '✓' : '✗'}
                    </span>
                    <span className={`
                      font-bold
                      ${isCorrect ? 'text-green-700' : 'text-red-700'}
                    `}>
                      {userAnswer?.points || 0} pts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition"
          >
            🏠 Home
          </button>

          <button
            onClick={() => window.location.reload()}
            className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition"
          >
            🔄 View Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChallengeResults;
