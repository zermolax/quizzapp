/**
 * SubjectSelection.jsx - BOLD DESIGN Edition
 *
 * Pagina de selecție a materiei (Toate Disciplinele)
 * Prima oprire după login - user-ul alege materia
 *
 * NEW: Bold design with hero, stats, badges, and dark mode
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

// Neon colors for each subject
const SUBJECT_COLORS = {
  'istorie': '#FF0080',      // neon-pink
  'geografie': '#00FFFF',    // neon-cyan
  'biologie': '#CCFF00',     // neon-lime
  'matematica': '#0066FF',   // neon-blue
  'fizica': '#B026FF',       // neon-purple
  'chimie': '#FF6B00',       // neon-orange
};

export function SubjectSelection() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  /**
   * Load theme from localStorage
   */
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  /**
   * Toggle dark mode
   */
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  /**
   * EFFECT: Fetch subjects from Firestore
   */
  useEffect(() => {
    async function fetchSubjects() {
      try {
        setLoading(true);
        setError(null);

        const subjectsRef = collection(db, 'subjects');
        const q = query(
          subjectsRef,
          where('isPublished', '==', true)
        );

        const snapshot = await getDocs(q);
        const subjectsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Sort în JavaScript (nu avem nevoie de index Firestore pentru 3 materii)
        const sortedSubjects = subjectsData.sort((a, b) => a.order - b.order);

        setSubjects(sortedSubjects);
      } catch (err) {
        console.error('Eroare fetch subjects:', err);
        setError('Eroare la încărcarea materiilor. Te rugăm să încerci din nou.');
      } finally {
        setLoading(false);
      }
    }

    fetchSubjects();
  }, []);

  /**
   * HANDLER: Select subject
   */
  const handleSelectSubject = (subjectSlug) => {
    navigate(`/subjects/${subjectSlug}`);
  };

  /**
   * HANDLER: Logout
   */
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  /**
   * Calculate total stats from all subjects
   */
  const totalThemes = subjects.reduce((sum, s) => sum + (s.totalThemes || 0), 0);
  const totalQuestions = subjects.reduce((sum, s) => sum + (s.totalQuestions || 0), 0);

  /**
   * RENDER: Loading state
   */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream dark:bg-deep-brown">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-neon-cyan mx-auto mb-4"></div>
          <p className="font-body text-deep-brown dark:text-off-white">Se încarcă disciplinele...</p>
        </div>
      </div>
    );
  }

  /**
   * RENDER: Error state
   */
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream dark:bg-deep-brown">
        <div className="bg-off-white dark:bg-warm-brown p-8 border-6 border-error text-center max-w-md">
          <h2 className="text-3xl font-heading font-black uppercase text-error mb-4">⚠️ Eroare</h2>
          <p className="font-body text-deep-brown dark:text-off-white mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-deep-brown dark:bg-off-white text-off-white dark:text-deep-brown border-4 border-deep-brown dark:border-off-white px-6 py-3 font-heading font-bold uppercase tracking-wide hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal hover:shadow-deep-brown dark:hover:shadow-off-white transition-all duration-150"
          >
            Reîncearcă
          </button>
        </div>
      </div>
    );
  }

  /**
   * RENDER: Subject Selection Page
   */
  return (
    <div className="min-h-screen" style={{ background: 'var(--off-white)' }}>

      {/* NAVIGATION - BOLD STYLE */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'var(--off-white)', borderBottom: '4px solid var(--deep-brown)' }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            {/* Left side with back button and logo */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => navigate('/')}
                className="border-3 px-3 sm:px-4 py-2 font-heading font-bold uppercase text-xs sm:text-sm transition-all duration-150"
                style={{
                  background: 'transparent',
                  border: '3px solid var(--deep-brown)',
                  color: 'var(--deep-brown)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--deep-brown)';
                  e.currentTarget.style.color = 'var(--off-white)';
                  e.currentTarget.style.transform = 'translate(-3px, -3px)';
                  e.currentTarget.style.boxShadow = '3px 3px 0 var(--warm-brown)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--deep-brown)';
                  e.currentTarget.style.transform = 'translate(0, 0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                ← Back
              </button>

              <h1
                onClick={() => navigate('/')}
                className="cursor-pointer font-heading font-black text-lg sm:text-2xl uppercase tracking-tight"
                style={{ color: 'var(--deep-brown)' }}
              >
                Quizz<span className="text-neon-pink">Fun</span>
              </h1>
            </div>

            {/* Right side: Buttons */}
            <div className="flex gap-1 sm:gap-2 items-center">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="w-10 h-10 sm:w-12 sm:h-12 border-4 hover:rotate-12 flex items-center justify-center text-lg sm:text-xl transition-all duration-150"
                style={{
                  background: 'var(--deep-brown)',
                  color: 'var(--off-white)',
                  border: '4px solid var(--deep-brown)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--neon-cyan)';
                  e.currentTarget.style.color = 'var(--deep-brown)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--deep-brown)';
                  e.currentTarget.style.color = 'var(--off-white)';
                }}
                aria-label="Toggle dark mode"
                title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
              >
                <span>{isDarkMode ? '☀️' : '🌙'}</span>
              </button>

              {/* Profile - hidden on small screens */}
              <button
                onClick={() => navigate('/profile')}
                className="hidden md:block border-4 px-4 py-2 font-heading font-bold uppercase tracking-wide text-sm hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal transition-all duration-150"
                style={{
                  background: 'var(--deep-brown)',
                  color: 'var(--off-white)',
                  border: '4px solid var(--deep-brown)'
                }}
              >
                Profil
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="bg-error text-white border-4 border-error px-3 sm:px-4 py-2 font-heading font-bold uppercase tracking-wide text-xs sm:text-sm hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal hover:shadow-error transition-all duration-150"
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">🚪</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION - BOLD STYLE */}
      <section className="py-16 sm:py-20 pt-24 sm:pt-32 relative overflow-hidden" style={{ background: 'var(--deep-brown)', color: 'var(--off-white)' }}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255, 255, 255, 0.03) 50px, rgba(255, 255, 255, 0.03) 51px)'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <div className="mb-6 font-mono text-xs sm:text-sm uppercase tracking-wider" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            <a
              onClick={() => navigate('/')}
              className="cursor-pointer hover:text-neon-lime transition-colors"
            >
              Home
            </a>
            {' / '}
            <span>Toate Disciplinele</span>
          </div>

          {/* Label */}
          <div className="font-mono text-sm sm:text-base uppercase tracking-widest mb-4" style={{ color: 'var(--neon-lime)' }}>
            // Explore All Subjects
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-heading font-black mb-4 sm:mb-6 uppercase leading-tight tracking-tighter">
            Toate Disciplinele
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl md:text-2xl font-body font-semibold max-w-3xl mb-8 sm:mb-12 leading-relaxed" style={{ opacity: 0.9 }}>
            De la istorie la matematică, de la geografie la fizică. Alege domeniul care te pasionează și începe să înveți jucându-te.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 sm:gap-6">
            <div className="flex items-center gap-4 border-4 p-4 sm:p-6" style={{ background: 'var(--warm-brown)', borderColor: 'var(--off-white)' }}>
              <div className="text-4xl sm:text-5xl">📚</div>
              <div className="flex flex-col">
                <div className="font-mono text-3xl sm:text-4xl font-bold leading-none" style={{ color: 'var(--neon-lime)' }}>
                  {subjects.length}
                </div>
                <div className="font-body text-xs sm:text-sm uppercase tracking-wider mt-1" style={{ opacity: 0.8 }}>
                  Discipline
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 border-4 p-4 sm:p-6" style={{ background: 'var(--warm-brown)', borderColor: 'var(--off-white)' }}>
              <div className="text-4xl sm:text-5xl">❓</div>
              <div className="flex flex-col">
                <div className="font-mono text-3xl sm:text-4xl font-bold leading-none" style={{ color: 'var(--neon-lime)' }}>
                  {totalQuestions}+
                </div>
                <div className="font-body text-xs sm:text-sm uppercase tracking-wider mt-1" style={{ opacity: 0.8 }}>
                  Întrebări
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 border-4 p-4 sm:p-6" style={{ background: 'var(--warm-brown)', borderColor: 'var(--off-white)' }}>
              <div className="text-4xl sm:text-5xl">🎯</div>
              <div className="flex flex-col">
                <div className="font-mono text-3xl sm:text-4xl font-bold leading-none" style={{ color: 'var(--neon-lime)' }}>
                  {totalThemes}
                </div>
                <div className="font-body text-xs sm:text-sm uppercase tracking-wider mt-1" style={{ opacity: 0.8 }}>
                  Tematici
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DISCIPLINES SECTION */}
      <main className="py-12 sm:py-16" style={{ background: 'var(--off-white)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-12 sm:mb-16">
            <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-widest block mb-4" style={{ color: 'var(--neon-orange)' }}>
              // Disponibile Acum
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black mb-4 uppercase leading-tight tracking-tighter" style={{ color: 'var(--deep-brown)' }}>
              Discipline Active
            </h2>
            <p className="text-lg sm:text-xl font-body font-medium" style={{ color: 'var(--warm-brown)' }}>
              Alege o disciplină și începe aventura educațională
            </p>
          </div>

          {/* SUBJECTS GRID */}
          {subjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-body text-lg" style={{ color: 'var(--warm-brown)' }}>
                Nu există discipline disponibile momentan.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {subjects.map((subject, index) => {
                const neonColor = SUBJECT_COLORS[subject.slug] || '#FF0080';
                const isPopular = index === 0; // First subject is marked as popular
                const isNew = index === 1; // Second subject is marked as new

                return (
                  <div
                    key={subject.id}
                    onClick={() => handleSelectSubject(subject.slug)}
                    className="relative cursor-pointer flex flex-col"
                    style={{
                      background: 'var(--cream)',
                      border: '6px solid var(--deep-brown)',
                      padding: '3rem',
                      minHeight: '400px',
                      transition: 'all 0.2s ease',
                      boxShadow: `0 0 0 0 ${neonColor}`,
                      animation: `slideUp 0.5s ease ${0.05 * (index + 1)}s backwards`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `8px 8px 0 ${neonColor}`;
                      e.currentTarget.style.borderColor = neonColor;
                      e.currentTarget.style.transform = 'translate(-8px, -8px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = `0 0 0 0 ${neonColor}`;
                      e.currentTarget.style.borderColor = 'var(--deep-brown)';
                      e.currentTarget.style.transform = 'translate(0, 0)';
                    }}
                  >
                    {/* Top accent bar */}
                    <div
                      className="absolute top-0 left-0 right-0"
                      style={{
                        height: '10px',
                        background: neonColor
                      }}
                    ></div>

                    {/* Badge */}
                    {isPopular && (
                      <div className="absolute top-8 right-8 px-3 py-1.5 font-heading font-black text-xs uppercase tracking-wider" style={{ background: 'var(--neon-lime)', color: 'var(--deep-brown)' }}>
                        🔥 Popular
                      </div>
                    )}
                    {isNew && (
                      <div className="absolute top-8 right-8 px-3 py-1.5 font-heading font-black text-xs uppercase tracking-wider" style={{ background: 'var(--neon-lime)', color: 'var(--deep-brown)' }}>
                        ✨ Nou
                      </div>
                    )}

                    {/* Icon */}
                    <div className="text-7xl sm:text-8xl mb-6">
                      {subject.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl sm:text-3xl font-heading font-black mb-4 uppercase tracking-tight leading-tight" style={{ color: 'var(--deep-brown)' }}>
                      {subject.name}
                    </h3>

                    {/* Description */}
                    <p className="text-base sm:text-lg font-body mb-auto leading-relaxed" style={{ color: 'var(--warm-brown)' }}>
                      {subject.description}
                    </p>

                    {/* Meta */}
                    <div className="mt-8 pt-6 flex justify-between items-center" style={{ borderTop: '4px solid var(--sand)' }}>
                      <div className="flex flex-col gap-2">
                        <div className="font-mono text-xs sm:text-sm font-bold uppercase" style={{ color: 'var(--deep-brown)' }}>
                          {subject.totalThemes} Tematici
                        </div>
                        <div className="font-mono text-xs sm:text-sm font-bold uppercase" style={{ color: 'var(--deep-brown)' }}>
                          {subject.totalQuestions} Întrebări
                        </div>
                      </div>
                      <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-3xl sm:text-4xl font-black transition-transform" style={{ background: 'var(--deep-brown)', color: 'var(--off-white)' }}>
                        →
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

    </div>
  );
}

export default SubjectSelection;
