/**
 * App.jsx - UPDATED cu React Router
 * 
 * SCOPUL:
 * Router-ul principal al aplicației.
 * Definesc rutele (routes) și ce component se randează pentru fiecare rută.
 * 
 * RUTE DEFINTE:
 * / → Home (login page)
 * /themes → ThemeSelection
 * /quiz → QuizPlay (coming soon)
 * 
 * CONCEPTE:
 * - <BrowserRouter> = wrapper pentru toată aplicația cu routing
 * - <Routes> = container pentru rutele
 * - <Route path="/" element={<Home />} /> = mapare url → component
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Home from './pages/Home';
import ThemeSelection from './pages/ThemeSelection';
import QuizPlay from './pages/QuizPlay';

/**
 * COMPONENT: App
 * 
 * Acesta e "root router" al app-ului.
 * Fiecare URL merge la o rută definită aici.
 */
export default function App() {
  
  /**
   * PROTECTED ROUTE LOGIC
   * 
   * Sunt zone ale app-ului care necesită autentificare
   * (spre exemplu: ThemeSelection - user trebuie logat)
   * 
   * FLOW:
   * 1. User accesează /themes
   * 2. Verific cu useAuth() dacă e logat
   * 3. Dacă logat → arăt ThemeSelection
   * 4. Dacă nu → redirect la Home (login)
   */
  const { user, loading } = useAuth();

  // Dacă Firebase încă verifi autentificarea, arăt loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        
        {/* RUTA 1: Home */}
        <Route path="/" element={<Home />} />
        
        {/* RUTA 2: Theme Selection (Protected) */}
        <Route
          path="/themes"
          element={user ? <ThemeSelection /> : <Navigate to="/" replace />}
        />

        {/* RUTA 3: Quiz Play (Protected) */}
        <Route
          path="/quiz"
          element={user ? <QuizPlay /> : <Navigate to="/" replace />}
        />

        {/* RUTA 4: Catch-all (404) */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

/**
 * EXPLICAȚIE FLUX COMPLET:
 * 
 * 1. User accesează http://localhost:5173/
 * 2. Router verifi ruta: "/" → element={<Home />}
 * 3. Home se randează (cu login form)
 * 4. User se loghează
 * 5. AuthContext se actualizează (user nu mai e null)
 * 6. Home component arată welcome message + "next" info
 * 7. User navigheaza la /themes (prin click sau manual)
 * 8. Router verifi: path="/themes"
 * 9. Condiția: user ? <ThemeSelection /> : <Navigate to="/" />
 * 10. Dacă user logat → ThemeSelection se randează
 * 11. User vede tema grid
 * 12. User selectează temă + dificultate
 * 13. ThemeCard apelează navigate("/quiz?themeId=wwi&difficulty=easy")
 * 14. Router merge la /quiz (QuizPlay page - coming soon)
 * 
 * PROTECTED ROUTES:
 * Dacă user se deloghează, /themes redirect automat la /
 * Asta e bun pentru UX - previne accesul la pagini fără user
 */