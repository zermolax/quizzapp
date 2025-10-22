/**
 * ThemeSelection.jsx
 * 
 * SCOPUL:
 * Pagina unde user-ul selectează o temă pentru a juca quiz
 * 
 * FLOW:
 * 1. Component se montează
 * 2. Importez themes din JSON
 * 3. Randez grid cu ThemeCard-uri
 * 4. User face click pe temă + dificultate
 * 5. Navigate la QuizPlay page (cu theme + difficulty params)
 * 
 * IN MVP: Themes sunt din JSON static
 * IN FUTURE: Themes vor veni din Firestore
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ThemeCard from '../components/ThemeCard';
import themesData from '../data/themes.json';

/**
 * COMPONENT: ThemeSelection
 */
export function ThemeSelection() {
  
  /**
   * HOOKS
   */
  const navigate = useNavigate();  // Pentru navigare între pagini
  const { user, logout } = useAuth();  // Pentru info user + logout

  /**
   * HANDLER: User selectează temă + dificultate
   * 
   * FLOW:
   * 1. User face click pe "Easy" din "WWI" card
   * 2. onSelectTheme("wwi", "easy") se apelează
   * 3. Navigate la /quiz cu params: themeId=wwi, difficulty=easy
   * 4. QuizPlay page va folosi acei params
   */
  const handleSelectTheme = (themeId, difficulty) => {
    // Navigate cu query params
    // Format: /quiz?themeId=wwi&difficulty=easy
    navigate(`/quiz?themeId=${themeId}&difficulty=${difficulty}`);
  };

  /**
   * HANDLER: Logout
   */
  const handleLogout = async () => {
    await logout();
    navigate('/');  // Redirect la home (login page)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      
      {/* HEADER */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          
          <div>
            <h1 className="text-3xl font-bold text-blue-600">🎓 Storia Quiz</h1>
            <p className="text-gray-600 text-sm">Alege o temă și testează-ți cunoștințele</p>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-gray-700 text-sm">
              <strong>Logat ca:</strong> {user?.email || 'Vizitator'}
            </p>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              Deconectare
            </button>
          </div>

        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* TITULO */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            Tematici Disponibile
          </h2>
          <p className="text-gray-600 text-lg">
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
        <div className="mt-16 bg-blue-100 border-l-4 border-blue-500 p-6 rounded">
          <h3 className="text-lg font-bold text-blue-900 mb-2">
            💡 Cum funcționează?
          </h3>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li>✅ Alege o temă care te interesează</li>
            <li>✅ Selectează nivelul de dificultate (ușor, mediu, greu)</li>
            <li>✅ Răspunde la întrebări și acumulează puncte</li>
            <li>✅ Progresul tău este salvat automat</li>
            <li>✅ Urci în clasament și câștigi badge-uri</li>
          </ul>
        </div>

      </main>

    </div>
  );
}

export default ThemeSelection;

/**
 * EXPLICAȚIE FLOW:
 * 
 * 1. Component se montează
 * 2. Importez themesData din JSON
 * 3. .map() peste themes și creez ThemeCard pentru fiecare
 * 4. Pasez theme + onSelectTheme callback la fiecare card
 * 5. User face click pe "Easy" în "WWI" card
 * 6. ThemeCard apelează onSelectTheme("wwi", "easy")
 * 7. handleSelectTheme navigheaza la /quiz?themeId=wwi&difficulty=easy
 * 8. QuizPlay page citește query params și încarcă întrebări
 * 
 * NEXT STEPS:
 * - Add React Router la App.jsx
 * - Creez QuizPlay page
 * - Creez Question component
 */