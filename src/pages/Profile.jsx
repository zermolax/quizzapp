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
  getProgressBySubject,
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
  const [subjectProgress, setSubjectProgress] = useState([]);
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
        const subjectProg = await getProgressBySubject(user.uid);
        const progress = await getProgressByTheme(user.uid);
        const history = await getQuizHistory(user.uid, 10);

        setUserProfile(profile);
        setSubjectProgress(subjectProg);
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
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p className="text-neutral-500">Se încarcă profil...</p>
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
   * RENDER: Profile Page
   */
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-brand-blue/10 p-4">

      {/* HEADER */}
      <header className="max-w-6xl mx-auto mb-8">
        <div className="flex justify-between items-center bg-white rounded-lg shadow p-6">
          <div>
            <h1 className="text-4xl font-bold text-brand-blue">👤 Profil</h1>
            <p className="text-neutral-500">Vizualizează progresul și statisticile tale</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-error hover:bg-error/90 text-white font-semibold py-2 px-6 rounded-lg"
          >
            Deconectare
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto">

        {/* SECTION 1: USER INFO */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">📋 Informații Personale</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-neutral-500">Email</p>
              <p className="text-xl font-semibold text-neutral-900">{userProfile?.email}</p>
            </div>

            <div>
              <p className="text-sm text-neutral-500">Membru din</p>
              <p className="text-xl font-semibold text-neutral-900">
                {userProfile?.createdAt ? formatDate(userProfile.createdAt) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: GLOBAL STATS */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">📊 Statistici Globale</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Stat 1: Total Quizzes */}
            <div className="bg-gradient-to-br from-brand-blue/5 to-brand-blue/10 p-4 rounded-lg border-l-4 border-brand-blue">
              <p className="text-sm text-neutral-500 mb-2">Quiz-uri jucate</p>
              <p className="text-4xl font-bold text-brand-blue">
                {userProfile?.stats.totalQuizzes || 0}
              </p>
            </div>

            {/* Stat 2: Average Score */}
            <div className="bg-gradient-to-br from-success/5 to-success/10 p-4 rounded-lg border-l-4 border-success">
              <p className="text-sm text-neutral-500 mb-2">Scor mediu</p>
              <p className="text-4xl font-bold text-success">
                {userProfile?.stats.averageScore || 0}%
              </p>
            </div>

            {/* Stat 3: Best Score */}
            <div className="bg-gradient-to-br from-brand-purple/5 to-brand-purple/10 p-4 rounded-lg border-l-4 border-brand-purple">
              <p className="text-sm text-neutral-500 mb-2">Cel mai bun scor</p>
              <p className="text-4xl font-bold text-brand-purple">
                {userProfile?.stats.bestScore || 0}%
              </p>
            </div>

            {/* Stat 4: Total Points */}
            <div className="bg-gradient-to-br from-brand-yellow/5 to-brand-yellow/10 p-4 rounded-lg border-l-4 border-brand-yellow">
              <p className="text-sm text-neutral-500 mb-2">Puncte totale</p>
              <p className="text-4xl font-bold text-brand-yellow">
                {userProfile?.stats.totalPoints || 0}
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 3: PROGRESS BY SUBJECT */}
        {subjectProgress.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">📚 Progres pe Materii</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {subjectProgress.map((subject) => (
                <div
                  key={subject.subjectId}
                  className="p-4 rounded-lg border-l-4"
                  style={{ borderLeftColor: subject.subjectColor, backgroundColor: `${subject.subjectColor}10` }}
                >
                  <div className="flex items-center mb-3">
                    <span className="text-4xl mr-3">{subject.subjectIcon}</span>
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900">{subject.subjectName}</h3>
                      <p className="text-sm text-neutral-500">{subject.totalQuizzes} quiz-uri</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white p-2 rounded text-center">
                      <p className="text-xs text-neutral-500">Mediu</p>
                      <p className="text-lg font-bold" style={{ color: subject.subjectColor }}>{subject.averageScore}%</p>
                    </div>
                    <div className="bg-white p-2 rounded text-center">
                      <p className="text-xs text-neutral-500">Maxim</p>
                      <p className="text-lg font-bold text-success">{subject.bestScore}%</p>
                    </div>
                    <div className="bg-white p-2 rounded text-center">
                      <p className="text-xs text-neutral-500">Puncte</p>
                      <p className="text-lg font-bold text-brand-purple">{subject.totalPoints}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4: PROGRESS BY THEME */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">📈 Progres pe Teme</h2>

          {themeProgress.length === 0 ? (
            <p className="text-neutral-500">Nu ai jucat niciun quiz încă. Mergi la teme!</p>
          ) : (
            <div className="space-y-4">
              {themeProgress.map((theme) => (
                <div key={theme.themeId} className="border-l-4 border-brand-blue bg-brand-blue/5 p-4 rounded">

                  {/* Theme Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900">{theme.themeName}</h3>
                      <p className="text-sm text-neutral-500">
                        {theme.totalQuizzes} quiz-uri jucate
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-brand-blue">{theme.averageScore}%</p>
                      <p className="text-xs text-neutral-500">Mediu</p>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-white p-2 rounded text-center">
                      <p className="text-xs text-neutral-500">Mediu</p>
                      <p className="text-lg font-bold text-brand-blue">{theme.averageScore}%</p>
                    </div>
                    <div className="bg-white p-2 rounded text-center">
                      <p className="text-xs text-neutral-500">Maxim</p>
                      <p className="text-lg font-bold text-success">{theme.bestScore}%</p>
                    </div>
                    <div className="bg-white p-2 rounded text-center">
                      <p className="text-xs text-neutral-500">Puncte</p>
                      <p className="text-lg font-bold text-brand-purple">{theme.totalPoints}</p>
                    </div>
                  </div>

                  {/* Difficulty Attempts */}
                  <div className="flex gap-2">
                    {theme.attempts.map((attempt) => (
                      <div key={attempt.difficulty} className="text-xs">
                        <span className={`
                          inline-block px-2 py-1 rounded font-semibold
                          ${attempt.difficulty === 'easy' && 'bg-success/20 text-success'}
                          ${attempt.difficulty === 'medium' && 'bg-warning/20 text-warning'}
                          ${attempt.difficulty === 'hard' && 'bg-error/20 text-error'}
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

        {/* SECTION 5: QUIZ HISTORY */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">⏰ Istoric Quiz-uri</h2>

          {quizHistory.length === 0 ? (
            <p className="text-neutral-500">Nu ai jucat niciun quiz încă.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-neutral-100 border-b-2 border-neutral-200">
                  <tr>
                    <th className="text-left p-3">Materie</th>
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
                    <tr key={index} className="border-b hover:bg-neutral-50">
                      <td className="p-3 text-neutral-500 text-xs">{quiz.subjectName}</td>
                      <td className="p-3 font-semibold text-neutral-900">{quiz.themeName}</td>
                      <td className="p-3">
                        <span className={`
                          inline-block px-2 py-1 rounded text-xs font-semibold
                          ${quiz.difficulty === 'easy' && 'bg-success/10 text-success'}
                          ${quiz.difficulty === 'medium' && 'bg-warning/10 text-warning'}
                          ${quiz.difficulty === 'hard' && 'bg-error/10 text-error'}
                        `}>
                          {quiz.difficulty === 'easy' && '🟢 Ușor'}
                          {quiz.difficulty === 'medium' && '🟡 Mediu'}
                          {quiz.difficulty === 'hard' && '🔴 Greu'}
                        </span>
                      </td>
                      <td className="p-3 text-center font-bold text-brand-blue">
                        {quiz.score}/{quiz.maxScore}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`
                          inline-block px-2 py-1 rounded font-bold
                          ${quiz.percentage >= 80 && 'bg-success/10 text-success'}
                          ${quiz.percentage >= 60 && quiz.percentage < 80 && 'bg-warning/10 text-warning'}
                          ${quiz.percentage < 60 && 'bg-error/10 text-error'}
                        `}>
                          {quiz.percentage}%
                        </span>
                      </td>
                      <td className="p-3 text-center text-neutral-500">
                        {formatDuration(quiz.duration)}
                      </td>
                      <td className="p-3 text-neutral-500 text-xs">
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
            onClick={() => navigate('/subjects')}
            className="bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold py-3 px-8 rounded-lg transition"
          >
            ← Înapoi la Materii
          </button>

          <button
            onClick={() => navigate('/subjects')}
            className="bg-success hover:bg-success/90 text-white font-semibold py-3 px-8 rounded-lg transition"
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