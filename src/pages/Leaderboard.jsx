/**
 * Leaderboard.jsx
 * 
 * SCOPUL:
 * Pagina leaderboard cu:
 * - Global leaderboard (top 100)
 * - Per-theme leaderboards
 * - User highlighted
 * - Real-time feel
 * 
 * FEATURES:
 * - Tabs: Global vs Per-Temă
 * - Medals for top 3
 * - User highlight (dacă nu e în top 100)
 * - Difficulty stats per temă
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  getGlobalLeaderboard,
  getThemeLeaderboard,
  getLeaderboardWithUserHighlight,
  getUserGlobalRank
} from '../services/leaderboardService';
import themesData from '../data/themes.json';

/**
 * COMPONENT: Leaderboard
 */
export function Leaderboard() {
  
  /**
   * HOOKS
   */
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  /**
   * STATE
   */
  const [activeTab, setActiveTab] = useState('global'); // 'global' or themeId
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * EFFECT: Load leaderboard data
   */
  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);

        if (activeTab === 'global') {
          // Global leaderboard with user highlighted
          const lb = await getLeaderboardWithUserHighlight(user.uid, 100);
          setLeaderboard(lb);
          
          // Get user rank
          const rank = await getUserGlobalRank(user.uid);
          setUserRank(rank);
        } else {
          // Theme-specific leaderboard
          const lb = await getThemeLeaderboard(activeTab, 50);
          setLeaderboard(lb);
        }

      } catch (err) {
        console.error('Error loading leaderboard:', err);
        setError('Error loading leaderboard');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadLeaderboard();
    }
  }, [activeTab, user]);

  /**
   * HANDLER: Logout
   */
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  /**
   * HELPER: Get row styling
   */
  const getRowStyle = (entry) => {
    if (entry.isCurrentUser) {
      return 'bg-yellow-50 border-l-4 border-yellow-500';
    }
    if (entry.rank <= 3) {
      return 'bg-blue-50 border-l-4 border-blue-500';
    }
    return 'border-b hover:bg-gray-50';
  };

  /**
   * RENDER: Loading
   */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Se încarcă clasament...</p>
        </div>
      </div>
    );
  }

  /**
   * RENDER: Error
   */
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">⚠️ Eroare</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/themes')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
          >
            ← Înapoi la Tematici
          </button>
        </div>
      </div>
    );
  }

  /**
   * RENDER: Leaderboard Page
   */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      
      {/* HEADER */}
      <header className="max-w-6xl mx-auto mb-8">
        <div className="flex justify-between items-center bg-white rounded-lg shadow p-6">
          <div>
            <h1 className="text-4xl font-bold text-blue-600">🏆 Clasament</h1>
            <p className="text-gray-600">Compară-te cu ceilalți utilizatori</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/profile')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              👤 Profil
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              Deconectare
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto">

        {/* USER RANK CARD */}
        {activeTab === 'global' && userRank && (
          <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg mb-8 shadow">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Locul tău</p>
                <p className="text-3xl font-bold text-yellow-600">
                  #{userRank.rank || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Din total</p>
                <p className="text-3xl font-bold text-blue-600">
                  {userRank.totalUsers}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Puncte</p>
                <p className="text-3xl font-bold text-green-600">
                  {userRank.userPoints}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Percentilă</p>
                <p className="text-3xl font-bold text-purple-600">
                  Top {userRank.percentile}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TABS */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-wrap gap-2">
            {/* Global Tab */}
            <button
              onClick={() => setActiveTab('global')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeTab === 'global'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              🌍 Global
            </button>

            {/* Theme Tabs */}
            {themesData.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setActiveTab(theme.id)}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  activeTab === theme.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {theme.icon} {theme.name.substring(0, 10)}...
              </button>
            ))}
          </div>
        </div>

        {/* LEADERBOARD TABLE */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          
          {/* Table Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-sm font-bold">
              <div className="md:col-span-1">#</div>
              <div className="md:col-span-4">Utilizator</div>
              <div className="md:col-span-2 text-center">Puncte</div>
              <div className="md:col-span-2 text-center">Quiz-uri</div>
              <div className="md:col-span-2 text-center">Mediu</div>
              <div className="md:col-span-1 text-center">Max</div>
            </div>
          </div>

          {/* Table Body */}
          <div>
            {leaderboard.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                Nu sunt date în clasament încă.
              </div>
            ) : (
              leaderboard.map((entry, index) => (
                <div
                  key={entry.userId || index}
                  className={`px-6 py-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center ${getRowStyle(entry)}`}
                >
                  {/* Rank */}
                  <div className="md:col-span-1 text-xl font-bold">
                    {entry.medal || `#${entry.rank}`}
                  </div>

                  {/* User Info */}
                  <div className="md:col-span-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-bold text-gray-800">
                          {entry.displayName}
                          {entry.isCurrentUser && ' (TU)'}
                        </p>
                        <p className="text-sm text-gray-600">{entry.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="md:col-span-2 text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {entry.totalPoints}
                    </p>
                  </div>

                  {/* Quizzes */}
                  <div className="md:col-span-2 text-center">
                    <p className="text-lg font-semibold text-gray-800">
                      {entry.totalQuizzes}
                    </p>
                  </div>

                  {/* Average Score */}
                  <div className="md:col-span-2 text-center">
                    <div className="inline-block px-3 py-1 rounded-full text-sm font-bold
                      ${entry.averageScore >= 80 ? 'bg-green-100 text-green-800' : 
                        entry.averageScore >= 60 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }
                    ">
                      {entry.averageScore}%
                    </div>
                  </div>

                  {/* Best Score */}
                  <div className="md:col-span-1 text-center">
                    <p className="text-lg font-bold text-purple-600">
                      {entry.bestScore}%
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => navigate('/themes')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition"
          >
            ← Înapoi la Tematici
          </button>
          
          <button
            onClick={() => navigate('/profile')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition"
          >
            👤 Vezi Profil
          </button>
        </div>

      </div>
    </div>
  );
}

export default Leaderboard;

/**
 * FEATURES IMPLEMENTATE:
 * 
 * 1. GLOBAL LEADERBOARD
 *    - Top 100 users
 *    - User highlighted dacă nu e în top 100
 *    - Medals for top 3
 *    - User rank card
 * 
 * 2. THEME LEADERBOARDS
 *    - Separate top 50 per tema
 *    - Click tab să schimbi tema
 * 
 * 3. COLUMNS:
 *    - Rank (# or medal)
 *    - User name + email
 *    - Total points
 *    - Quizzes played
 *    - Average score
 *    - Best score
 * 
 * 4. VISUAL FEEDBACK:
 *    - Top 3 highlighted (blue)
 *    - User highlighted (yellow)
 *    - Color-coded scores (green/yellow/red)
 *    - Responsive grid layout
 * 
 * 5. TABS:
 *    - Global tab
 *    - One tab per theme
 *    - Active tab highlighted
 */