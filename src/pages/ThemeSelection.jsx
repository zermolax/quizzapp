/**
 * ThemeSelection.jsx - UPDATED
 * 
 * NOUTATE: Adaug link la Leaderboard
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ThemeCard from '../components/ThemeCard';
import themesData from '../data/themes.json';

export function ThemeSelection() {
  
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSelectTheme = (themeId, difficulty) => {
    navigate(`/quiz?themeId=${themeId}&difficulty=${difficulty}`);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-brand-blue/10">

      {/* HEADER */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">

            <div
              onClick={() => navigate('/')}
              className="cursor-pointer hover:opacity-80 transition"
            >
              <h1 className="text-3xl font-bold text-brand-blue">🎓 Quizz Fun</h1>
              <p className="text-neutral-500 text-sm">Alege o temă și testează-ți cunoștințele</p>
            </div>

            {/* RIGHT SIDE: Buttons */}
            <div className="flex items-center gap-3">

              {/* Leaderboard Button - NEW */}
              <button
                onClick={() => navigate('/leaderboard')}
                className="bg-brand-yellow hover:bg-brand-yellow/90 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2"
              >
                🏆 Clasament
              </button>

              {/* Profile Button */}
              <button
                onClick={() => navigate('/profile')}
                className="bg-brand-purple hover:bg-brand-purple/90 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2"
              >
                👤 Profil
              </button>

              <p className="text-neutral-700 text-sm">
                <strong>{user?.email || 'Vizitator'}</strong>
              </p>

              <button
                onClick={handleLogout}
                className="bg-error hover:bg-error/90 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                Deconectare
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* TITULO */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-neutral-900 mb-2">
            Tematici Disponibile
          </h2>
          <p className="text-neutral-500 text-lg">
            {themesData.length} tematici de învățat • Alege dificultatea și începe
          </p>
        </div>

        {/* GRID CU CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themesData.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              onSelectTheme={handleSelectTheme}
            />
          ))}
        </div>

        {/* FOOTER INFO */}
        <div className="mt-16 bg-info/10 border-l-4 border-info p-6 rounded">
          <h3 className="text-lg font-bold text-neutral-900 mb-2">
            💡 Cum funcționează?
          </h3>
          <ul className="text-neutral-700 space-y-2 text-sm">
            <li>✅ Alege o temă care te interesează</li>
            <li>✅ Selectează nivelul de dificultate (ușor, mediu, greu)</li>
            <li>✅ Răspunde la întrebări și acumulează puncte</li>
            <li>✅ Progresul tău este salvat automat</li>
            <li>✅ Urci în clasament și compară-te cu alții</li>
          </ul>
        </div>

      </main>

    </div>
  );
}

export default ThemeSelection;