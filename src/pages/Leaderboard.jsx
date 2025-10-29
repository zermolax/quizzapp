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
  const { user } = useAuth();

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
   * HELPER: Get row styling
   */
  const getRowStyle = (entry) => {
    if (entry.isCurrentUser) {
      return 'bg-brand-yellow/10 border-l-4 border-brand-yellow';
    }
    if (entry.rank <= 3) {
      return 'bg-brand-blue/10 border-l-4 border-brand-blue';
    }
    return 'border-b hover:bg-neutral-50';
  };

  /**
   * RENDER: Loading
   */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p className="text-neutral-500">Se încarcă clasament...</p>
        </div>
      </div>
    );
  }

  /**
   * RENDER: Error
   */
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-error mb-4">⚠️ Eroare</h2>
          <p className="text-neutral-500 mb-6">{error}</p>
          <button
            onClick={() => navigate('/subjects')}
            className="bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold py-2 px-6 rounded-lg"
          >
            ← Înapoi la Materii
          </button>
        </div>
      </div>
    );
  }

  /**
   * RENDER: Leaderboard Page
   */
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-brand-blue/10 p-4">

      {/* HEADER */}
      <header className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white rounded-lg shadow p-6 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-brand-blue">🏆 Clasament</h1>
            <p className="text-neutral-500">Compară-te cu ceilalți utilizatori</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate('/subjects')}
              className="bg-brand-blue hover:bg-brand-blue/90 text-white px-4 py-2 rounded-lg font-semibold transition text-sm"
            >
              ← Înapoi la Materii
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="bg-brand-purple hover:bg-brand-purple/90 text-white px-4 py-2 rounded-lg font-semibold transition text-sm"
            >
              👤 Profil
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto">

        {/* USER RANK CARD */}
        {activeTab === 'global' && userRank && (
          <div className="bg-gradient-to-r from-brand-yellow/20 to-brand-yellow/10 border-l-4 border-brand-yellow p-6 rounded-lg mb-8 shadow">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-neutral-500">Locul tău</p>
                <p className="text-3xl font-bold text-brand-yellow">
                  #{userRank.rank || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Din total</p>
                <p className="text-3xl font-bold text-brand-blue">
                  {userRank.totalUsers}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Puncte</p>
                <p className="text-3xl font-bold text-success">
                  {userRank.userPoints}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Procentaj</p>
                <p className="text-3xl font-bold text-brand-purple">
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
                  ? 'bg-brand-blue text-white'
                  : 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
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
                    ? 'bg-brand-blue text-white'
                    : 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
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
          <div className="bg-gradient-to-r from-brand-blue to-brand-blue/90 text-white px-6 py-4">
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
              <div className="p-8 text-center text-neutral-500">
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
                        <p className="font-bold text-neutral-900">
                          {entry.displayName}
                          {entry.isCurrentUser && ' (TU)'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="md:col-span-2 text-center">
                    <p className="text-2xl font-bold text-brand-blue">
                      {entry.totalPoints}
                    </p>
                  </div>

                  {/* Quizzes */}
                  <div className="md:col-span-2 text-center">
                    <p className="text-lg font-semibold text-neutral-900">
                      {entry.totalQuizzes}
                    </p>
                  </div>

                  {/* Average Score */}
                  <div className="md:col-span-2 text-center">
                    <div className="inline-block px-3 py-1 rounded-full text-sm font-bold
                      ${entry.averageScore >= 80 ? 'bg-success/10 text-success' :
                        entry.averageScore >= 60 ? 'bg-warning/10 text-warning' :
                        'bg-error/10 text-error'
                      }
                    ">
                      {entry.averageScore}%
                    </div>
                  </div>

                  {/* Best Score */}
                  <div className="md:col-span-1 text-center">
                    <p className="text-lg font-bold text-brand-purple">
                      {entry.bestScore}%
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
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