/**
 * Profile.jsx
 * 
 * SCOPUL:
 * Pagina profil a utilizatorului
 * Arăta:
 * - User info (email, data înregistrare)
 * - Stats globale (total quizzes, avg score, best score, total points)
 * - Progres per temă (stats pe fiecare temă jucată)
 * - Quiz history (ultimele 10 quiz-uri)
 * 
 * FLOW:
 * 1. Component mount
 * 2. Load user profile, theme progress, quiz history
 * 3. Display all data
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  getUserProfile,
  getProgressByTheme,
  getQuizHistory,
  formatDate,
  formatDuration
} from '../services/profileService';

/**
 * COMPONENT: Profile
 */
export function Profile() {
  
  /**
   * HOOKS
   */
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  /**
   * STATE
   */
  const [userProfile, setUserProfile] = useState(null);
  const [themeProgress, setThemeProgress] = useState([]);
  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * EFFECT: Load all profile data
   */
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        const profile = await getUserProfile(user.uid);
        const progress = await getProgressByTheme(user.uid);
        const history = await getQuizHistory(user.uid, 10);

        setUserProfile(profile);
        setThemeProgress(progress);
        setQuizHistory(history);

      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Error loading profile data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadProfileData();
    }
  }, [user]);

  /**
   * HANDLER: Logout
   */
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  /**
   * RENDER: Loading
   */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Se încarcă profil...</p>
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
   * RENDER: Profile Page
   */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      
      {/* HEADER */}
      <header className="max-w-6xl mx-auto mb-8">
        <div className="flex justify-between items-center bg-white rounded-lg shadow p-6">
          <div>
            <h1 className="text-4xl font-bold text-blue-600">👤 Profil</h1>
            <p className="text-gray-600">Vizualizează progresul și statisticile tale</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg"
          >
            Deconectare
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto">

        {/* SECTION 1: USER INFO */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 Informații Personale</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-xl font-semibold text-gray-800">{userProfile?.email}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Membru din</p>
              <p className="text-xl font-semibold text-gray-800">
                {userProfile?.createdAt ? formatDate(userProfile.createdAt) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: GLOBAL STATS */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Statistici Globale</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Stat 1: Total Quizzes */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm text-gray-600 mb-2">Quiz-uri jucate</p>
              <p className="text-4xl font-bold text-blue-600">
                {userProfile?.stats.totalQuizzes || 0}
              </p>
            </div>

            {/* Stat 2: Average Score */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border-l-4 border-green-500">
              <p className="text-sm text-gray-600 mb-2">Scor mediu</p>
              <p className="text-4xl font-bold text-green-600">
                {userProfile?.stats.averageScore || 0}%
              </p>
            </div>

            {/* Stat 3: Best Score */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border-l-4 border-purple-500">
              <p className="text-sm text-gray-600 mb-2">Cel mai bun scor</p>
              <p className="text-4xl font-bold text-purple-600">
                {userProfile?.stats.bestScore || 0}%
              </p>
            </div>

            {/* Stat 4: Total Points */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border-l-4 border-yellow-500">
              <p className="text-sm text-gray-600 mb-2">Puncte totale</p>
              <p className="text-4xl font-bold text-yellow-600">
                {userProfile?.stats.totalPoints || 0}
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 3: PROGRESS BY THEME */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📈 Progres pe Teme</h2>
          
          {themeProgress.length === 0 ? (
            <p className="text-gray-600">Nu ai jucat niciun quiz încă. Mergi la teme!</p>
          ) : (
            <div className="space-y-4">
              {themeProgress.map((theme) => (
                <div key={theme.themeId} className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
                  
                  {/* Theme Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{theme.themeName}</h3>
                      <p className="text-sm text-gray-600">
                        {theme.totalQuizzes} quiz-uri jucate
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{theme.averageScore}%</p>
                      <p className="text-xs text-gray-600">Mediu</p>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-white p-2 rounded text-center">
                      <p className="text-xs text-gray-600">Mediu</p>
                      <p className="text-lg font-bold text-blue-600">{theme.averageScore}%</p>
                    </div>
                    <div className="bg-white p-2 rounded text-center">
                      <p className="text-xs text-gray-600">Maxim</p>
                      <p className="text-lg font-bold text-green-600">{theme.bestScore}%</p>
                    </div>
                    <div className="bg-white p-2 rounded text-center">
                      <p className="text-xs text-gray-600">Puncte</p>
                      <p className="text-lg font-bold text-purple-600">{theme.totalPoints}</p>
                    </div>
                  </div>

                  {/* Difficulty Attempts */}
                  <div className="flex gap-2">
                    {theme.attempts.map((attempt) => (
                      <div key={attempt.difficulty} className="text-xs">
                        <span className={`
                          inline-block px-2 py-1 rounded font-semibold
                          ${attempt.difficulty === 'easy' && 'bg-green-200 text-green-800'}
                          ${attempt.difficulty === 'medium' && 'bg-yellow-200 text-yellow-800'}
                          ${attempt.difficulty === 'hard' && 'bg-red-200 text-red-800'}
                        `}>
                          {attempt.difficulty === 'easy' && '🟢'}
                          {attempt.difficulty === 'medium' && '🟡'}
                          {attempt.difficulty === 'hard' && '🔴'}
                          {' '}{attempt.count} × {attempt.avgScore}%
                        </span>
                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 4: QUIZ HISTORY */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">⏰ Istoric Quiz-uri</h2>
          
          {quizHistory.length === 0 ? (
            <p className="text-gray-600">Nu ai jucat niciun quiz încă.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b-2 border-gray-300">
                  <tr>
                    <th className="text-left p-3">Temă</th>
                    <th className="text-left p-3">Dificultate</th>
                    <th className="text-center p-3">Scor</th>
                    <th className="text-center p-3">Procent</th>
                    <th className="text-center p-3">Durată</th>
                    <th className="text-left p-3">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {quizHistory.map((quiz, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-semibold text-gray-800">{quiz.themeName}</td>
                      <td className="p-3">
                        <span className={`
                          inline-block px-2 py-1 rounded text-xs font-semibold
                          ${quiz.difficulty === 'easy' && 'bg-green-100 text-green-800'}
                          ${quiz.difficulty === 'medium' && 'bg-yellow-100 text-yellow-800'}
                          ${quiz.difficulty === 'hard' && 'bg-red-100 text-red-800'}
                        `}>
                          {quiz.difficulty === 'easy' && '🟢 Ușor'}
                          {quiz.difficulty === 'medium' && '🟡 Mediu'}
                          {quiz.difficulty === 'hard' && '🔴 Greu'}
                        </span>
                      </td>
                      <td className="p-3 text-center font-bold text-blue-600">
                        {quiz.score}/{quiz.maxScore}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`
                          inline-block px-2 py-1 rounded font-bold
                          ${quiz.percentage >= 80 && 'bg-green-100 text-green-800'}
                          ${quiz.percentage >= 60 && quiz.percentage < 80 && 'bg-yellow-100 text-yellow-800'}
                          ${quiz.percentage < 60 && 'bg-red-100 text-red-800'}
                        `}>
                          {quiz.percentage}%
                        </span>
                      </td>
                      <td className="p-3 text-center text-gray-600">
                        {formatDuration(quiz.duration)}
                      </td>
                      <td className="p-3 text-gray-600 text-xs">
                        {quiz.createdAt ? formatDate(quiz.createdAt) : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => navigate('/themes')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition"
          >
            ← Înapoi la Tematici
          </button>
          
          <button
            onClick={() => navigate('/themes')}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition"
          >
            ▶️ Joacă Alt Quiz
          </button>
        </div>

      </div>
    </div>
  );
}

export { Profile as default };

/**
 * SECȚIUNI AFIȘATE:
 * 
 * 1. User Info
 *    - Email
 *    - Member since (data înregistrare)
 * 
 * 2. Global Stats (4 cards)
 *    - Total quizzes
 *    - Average score
 *    - Best score
 *    - Total points
 * 
 * 3. Progress by Theme
 *    - Pentru fiecare temă jucată:
 *      * Nume temă
 *      * Total quizzes
 *      * Average score
 *      * Best score
 *      * Total points
 *      * Breakdown by difficulty
 * 
 * 4. Quiz History (Table)
 *    - Ultimele 10 quiz-uri
 *    - Temă, dificultate, scor, procent, durată, dată
 * 
 * FLOW COMPLET:
 * 1. User merge la /profile
 * 2. Component mount
 * 3. Load profile, theme progress, quiz history
 * 4. Display all data beautifully
 * 5. User poate naviga la alte pagini
 */