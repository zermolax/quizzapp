/**
 * App.jsx - FINAL
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Home from './pages/Home';
import ThemeSelection from './pages/ThemeSelection';
import QuizPlay from './pages/QuizPlay';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';

export default function App() {
  
  const { user, loading } = useAuth();

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

        {/* RUTA 4: Profile (Protected) */}
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/" replace />}
        />

        {/* RUTA 5: Leaderboard (Protected) */}
        <Route
          path="/leaderboard"
          element={user ? <Leaderboard /> : <Navigate to="/" replace />}
        />

        {/* RUTA 6: Catch-all (404) */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}