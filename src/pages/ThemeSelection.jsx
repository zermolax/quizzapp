/**
 * ThemeSelection.jsx - UPDATED for Multi-Subject Architecture
 *
 * Afișează tematicile pentru materia selectată
 * URL: /subjects/:subjectSlug
 *
 * NEW: Bold design with improved hero section
 */

import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSubject } from '../hooks/useSubjects';
import { useThemes } from '../hooks/useThemes';
import { useTheme } from '../hooks/useTheme';
import { ThemeCard } from '../components/cards/ThemeCard';

export function ThemeSelection() {
  const { subjectSlug } = useParams(); // Extract subject from URL
  const { subject, loading: loadingSubject, error: errorSubject } = useSubject(subjectSlug);
  const { themes, loading: loadingThemes, error: errorThemes } = useThemes(subjectSlug);
  const { isDark: isDarkMode, toggle: toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  /**
   * Adaugă articolul hotărât la numele disciplinei
   */
  const getSubjectNameWithArticle = (name) => {
    if (!name) return '';
    // Pentru "Educație X" → "Educația X"
    if (name.startsWith('Educație')) return name.replace('Educație', 'Educația');
    // Pentru "Limba X" → rămâne "Limba X" (are deja articol)
    if (name.startsWith('Limba')) return name;
    // Pentru cuvinte care se termină în "ie" → "ia"
    if (name.endsWith('ie')) return name.slice(0, -2) + 'ia';
    // Pentru cuvinte care se termină în "e" → "a"
    if (name.endsWith('e')) return name.slice(0, -1) + 'a';
    // Pentru cuvinte care se termină în "ă" → "a"
    if (name.endsWith('ă')) return name.slice(0, -1) + 'a';
    // Default (ex: TIC rămâne TIC)
    return name;
  };

  /**
   * HANDLER: Select theme and difficulty
   */
  const handleSelectTheme = (themeSlug, difficulty) => {
    // Navigate to quiz with BOTH subjectSlug and themeSlug
    navigate(`/subjects/${subjectSlug}/quiz/${themeSlug}?difficulty=${difficulty}`);
  };

  /**
   * HANDLER: Logout
   */
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  /**
   * Combined loading and error states
   */
  const loading = loadingSubject || loadingThemes;
  const error = errorSubject || errorThemes;

  /**
   * RENDER: Loading state
   */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream dark:bg-deep-brown">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-neon-cyan mx-auto mb-4"></div>
          <p className="font-body text-deep-brown dark:text-off-white">Se încarcă tematicile...</p>
        </div>
      </div>
    );
  }

  /**
   * RENDER: Error state
   */
  if (error || !subject) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream dark:bg-deep-brown">
        <div className="bg-off-white dark:bg-warm-brown p-8 border-6 border-error text-center max-w-md">
          <h2 className="text-3xl font-heading font-black uppercase text-error mb-4">⚠️ Eroare</h2>
          <p className="font-body text-deep-brown dark:text-off-white mb-6">
            {error || `Materia "${subjectSlug}" nu există.`}
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-deep-brown dark:bg-off-white text-off-white dark:text-deep-brown border-4 border-deep-brown dark:border-off-white px-6 py-3 font-heading font-bold uppercase tracking-wide hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal hover:shadow-deep-brown dark:hover:shadow-off-white transition-all duration-150"
          >
            ← Înapoi
          </button>
        </div>
      </div>
    );
  }

  /**
   * RENDER: Theme Selection Page
   */
  return (
    <div className="min-h-screen bg-cream dark:bg-deep-brown transition-colors duration-200">

      {/* NAVIGATION - BOLD STYLE */}
      <nav className="bg-cream dark:bg-deep-brown border-b-4 border-deep-brown dark:border-off-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            {/* Left side with back button and logo */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => navigate('/')}
                className="bg-transparent border-3 border-deep-brown dark:border-off-white text-deep-brown dark:text-off-white px-3 sm:px-4 py-2 font-heading font-bold uppercase text-sm hover:bg-deep-brown hover:dark:bg-off-white hover:text-off-white hover:dark:text-deep-brown hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal hover:shadow-warm-brown transition-all duration-150"
              >
                ← Back
              </button>

              <h1
                onClick={() => navigate('/')}
                className="cursor-pointer font-heading font-black text-2xl text-deep-brown dark:text-off-white uppercase tracking-tight"
              >
                Quizz<span className="text-neon-pink">Fun</span>
              </h1>
            </div>

            {/* Right side: Buttons */}
            <div className="flex gap-1 sm:gap-2 items-center">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-deep-brown dark:bg-off-white text-off-white dark:text-deep-brown border-4 border-deep-brown dark:border-off-white hover:bg-neon-cyan hover:dark:bg-neon-cyan hover:text-deep-brown transition-all duration-150 hover:rotate-12 flex items-center justify-center text-xl"
                aria-label="Toggle dark mode"
                title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
              >
                <span>{isDarkMode ? '☀️' : '🌙'}</span>
              </button>

              {/* Profile - hidden on small screens */}
              <button
                onClick={() => navigate('/profile')}
                className="hidden md:block bg-deep-brown dark:bg-off-white text-off-white dark:text-deep-brown border-4 border-deep-brown dark:border-off-white px-4 py-2 font-heading font-bold uppercase tracking-wide text-sm hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal hover:shadow-deep-brown dark:hover:shadow-off-white transition-all duration-150"
              >
                Profil
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="bg-error text-white border-4 border-error px-3 sm:px-4 py-2 font-heading font-bold uppercase tracking-wide text-sm hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal hover:shadow-error transition-all duration-150"
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">🚪</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION - BOLD STYLE */}
      <section className="py-16 sm:py-20 bg-deep-brown dark:bg-off-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, currentColor 2px, currentColor 3px), repeating-linear-gradient(90deg, transparent, transparent 2px, currentColor 2px, currentColor 3px)'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Title */}
          <h1 className="text-7xl font-heading font-black mb-6 uppercase leading-tight tracking-tighter text-off-white dark:text-deep-brown">
            <span className="block">Explorează</span>
            <span className="inline-block bg-neon-pink text-off-white px-2 md:px-4 -rotate-2">{getSubjectNameWithArticle(subject?.name)}</span>
          </h1>

          {/* Description */}
          <p className="text-xl font-body font-semibold max-w-3xl mx-auto text-off-white/90 dark:text-deep-brown/90 leading-relaxed mb-12">
            {subject?.descriptions?.educational || subject?.description || 'Învață și testează-ți cunoștințele'}
          </p>

          {/* Stats - Bold Style (matching SubjectSelection) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <p className="text-6xl font-mono font-bold text-off-white dark:text-deep-brown" style={{ textShadow: '3px 3px 0 #FF0080' }}>
                {themes.length}
              </p>
              <p className="text-sm font-heading font-bold uppercase tracking-widest mt-2 text-off-white/80 dark:text-deep-brown/80">
                Teme
              </p>
            </div>

            <div className="text-center">
              <p className="text-6xl font-mono font-bold text-off-white dark:text-deep-brown" style={{ textShadow: '3px 3px 0 #CCFF00' }}>
                {subject?.questionsCount || subject?.totalQuestions || 0}+
              </p>
              <p className="text-sm font-heading font-bold uppercase tracking-widest mt-2 text-off-white/80 dark:text-deep-brown/80">
                Întrebări
              </p>
            </div>

            <div className="text-center">
              <p className="text-6xl font-mono font-bold text-off-white dark:text-deep-brown" style={{ textShadow: '3px 3px 0 #00FFFF' }}>
                3
              </p>
              <p className="text-sm font-heading font-bold uppercase tracking-widest mt-2 text-off-white/80 dark:text-deep-brown/80">
                Nivele
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* THEMES SECTION */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

        {/* Section Header */}
        <div className="mb-12 sm:mb-16">
          <span className="font-mono text-sm font-bold uppercase tracking-widest text-neon-orange block mb-4">
            // Alege Tema Ta
          </span>
          <h2 className="text-5xl font-heading font-black mb-4 uppercase leading-tight tracking-tighter text-deep-brown dark:text-off-white">
            Tematici Disponibile
          </h2>
        </div>

        {/* THEMES GRID */}
        {themes.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-body text-lg mb-6 text-deep-brown dark:text-off-white">
              Nu există teme disponibile pentru această materie momentan.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-deep-brown dark:bg-off-white text-off-white dark:text-deep-brown border-4 border-deep-brown dark:border-off-white px-6 py-3 font-heading font-bold uppercase tracking-wide hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal hover:shadow-deep-brown dark:hover:shadow-off-white transition-all duration-150"
            >
              ← Înapoi
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {themes.map((theme) => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                onSelect={(themeSlug, difficulty) => handleSelectTheme(themeSlug, difficulty)}
                showQuestionCount={true}
                showDescription={true}
                showDifficultyButtons={true}
              />
            ))}

            {/* COMING SOON CARD */}
            <div
              className="relative flex flex-col cursor-not-allowed"
              style={{
                background: 'var(--sand)',
                border: '5px dashed var(--warm-brown)',
                padding: '3rem',
                minHeight: '350px',
                opacity: 0.6,
                transition: 'all 0.2s ease',
                animation: `fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${0.05 * (themes.length + 1)}s backwards`
              }}
            >
              {/* Coming Soon Label - centered and rotated */}
              <div
                className="absolute font-heading font-black uppercase tracking-wider"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%) rotate(-15deg)',
                  background: 'var(--neon-orange)',
                  color: 'var(--off-white)',
                  padding: '1rem 3rem',
                  fontSize: '1.5rem',
                  letterSpacing: '0.1em',
                  whiteSpace: 'nowrap'
                }}
              >
                În curând
              </div>

              {/* Theme number */}
              <div
                className="font-mono font-bold leading-none mb-4"
                style={{
                  fontSize: '4rem',
                  color: 'var(--warm-brown)',
                  opacity: 0.5
                }}
              >
                {String(themes.length + 1).padStart(2, '0')}
              </div>

              {/* Title */}
              <h3
                className="font-heading font-black mb-4 uppercase tracking-tight leading-tight"
                style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                  color: 'var(--deep-brown)',
                  opacity: 0.7
                }}
              >
                Alte teme
              </h3>

              {/* Description */}
              <p
                className="font-body mb-auto leading-relaxed"
                style={{
                  fontSize: '1rem',
                  color: 'var(--warm-brown)',
                  opacity: 0.7
                }}
              >
                Lucrăm la adăugarea de noi teme pasionante pentru această materie. Revino curând!
              </p>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}

export default ThemeSelection;
