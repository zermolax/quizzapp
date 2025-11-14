/**
 * App.jsx - OPTIMIZED VERSION with Code Splitting + React Query
 *
 * OPTIMIZATIONS:
 * - Lazy loading for all route components
 * - Suspense fallback for loading states
 * - Reduced initial bundle size
 * - React Query caching for instant navigation (Part B of B+C optimization)
 */

import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './hooks/useAuth';

// Create QueryClient with caching configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
      cacheTime: 30 * 60 * 1000, // 30 minutes - data stays in cache
      refetchOnWindowFocus: false, // Don't refetch on window focus
      retry: 1, // Retry failed requests once
    },
  },
});

// Lazy load all page components
const Home = lazy(() => import('./pages/Home'));
const GameModeSelection = lazy(() => import('./pages/GameModeSelection'));
const SubjectSelection = lazy(() => import('./pages/SubjectSelection'));
const ThemeSelection = lazy(() => import('./pages/ThemeSelection'));
const QuizPlay = lazy(() => import('./pages/QuizPlay'));
const TriviaGlobal = lazy(() => import('./pages/TriviaGlobal'));
const TriviaSubject = lazy(() => import('./pages/TriviaSubject'));
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
    <QueryClientProvider client={queryClient}>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>

          {/* RUTA 1: Home - Landing Page */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* RUTA 2: Game Mode Selection (Protected) - NEW! */}
          {/* Alege modul de joc: Clasic, Trivia Global, Trivia per Disciplină */}
          <Route
            path="/game-mode"
            element={user ? <GameModeSelection /> : <Navigate to="/" replace />}
          />

          {/* RUTA 3: Subjects - Multi-disciplinary routes (Protected) */}
          {/* Step 1: Select Subject (accesat din Mod Clasic) */}
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

          {/* RUTA 4: TRIVIA MODE ROUTES (Protected) */}
          {/* Trivia Global - întrebări din toate disciplinele */}
          <Route
            path="/trivia/global"
            element={user ? <TriviaGlobal /> : <Navigate to="/" replace />}
          />

          {/* Trivia per Disciplină - întrebări din toate tematicile unei discipline */}
          <Route
            path="/trivia/:subjectSlug"
            element={user ? <TriviaSubject /> : <Navigate to="/" replace />}
          />

          {/* RUTA 5: Profile (Protected) */}
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/" replace />}
          />

          {/* RUTA 6: Leaderboard (Protected) */}
          <Route
            path="/leaderboard"
            element={user ? <Leaderboard /> : <Navigate to="/" replace />}
          />

          {/* RUTA 7: Privacy Policy (Public) */}
          <Route path="/privacy" element={<Privacy />} />

          {/* RUTA 8: Terms of Service (Public) */}
          <Route path="/terms" element={<Terms />} />

          {/* LEGACY REDIRECT: /themes → /game-mode */}
          <Route
            path="/themes"
            element={<Navigate to="/game-mode" replace />}
          />

          {/* RUTA 9: Catch-all (404) */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Suspense>
    </Router>
    </QueryClientProvider>
  );
}