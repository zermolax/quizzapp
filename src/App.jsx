/**
 * App.jsx - OPTIMIZED VERSION with Code Splitting
 *
 * OPTIMIZATIONS:
 * - Lazy loading for all route components
 * - Suspense fallback for loading states
 * - Reduced initial bundle size
 */

import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Lazy load all page components
const Home = lazy(() => import('./pages/Home'));
const SubjectSelection = lazy(() => import('./pages/SubjectSelection'));
const ThemeSelection = lazy(() => import('./pages/ThemeSelection'));
const QuizPlay = lazy(() => import('./pages/QuizPlay'));
const Profile = lazy(() => import('./pages/Profile'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

export default function App() {

  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>

          {/* RUTA 1: Home - Landing Page */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* RUTA 2: Subjects - Multi-disciplinary routes (Protected) */}
          {/* Step 1: Select Subject */}
          <Route
            path="/subjects"
            element={user ? <SubjectSelection /> : <Navigate to="/" replace />}
          />

          {/* Step 2: Select Theme within Subject */}
          <Route
            path="/subjects/:subjectSlug"
            element={user ? <ThemeSelection /> : <Navigate to="/" replace />}
          />

          {/* Step 3: Play Quiz */}
          <Route
            path="/subjects/:subjectSlug/quiz/:themeSlug"
            element={user ? <QuizPlay /> : <Navigate to="/" replace />}
          />

          {/* RUTA 3: Profile (Protected) */}
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/" replace />}
          />

          {/* RUTA 4: Leaderboard (Protected) */}
          <Route
            path="/leaderboard"
            element={user ? <Leaderboard /> : <Navigate to="/" replace />}
          />

          {/* RUTA 5: Privacy Policy (Public) */}
          <Route path="/privacy" element={<Privacy />} />

          {/* RUTA 6: Terms of Service (Public) */}
          <Route path="/terms" element={<Terms />} />

          {/* LEGACY REDIRECT: /themes → /subjects */}
          <Route
            path="/themes"
            element={<Navigate to="/subjects" replace />}
          />

          {/* RUTA 7: Catch-all (404) */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Suspense>
    </Router>
  );
}