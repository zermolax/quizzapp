/**
 * SubjectSelection.jsx - BOLD DESIGN Edition with ALL DISCIPLINES
 *
 * Pagina de selecție a materiei (Toate Disciplinele)
 * Prima oprire după login - user-ul alege materia
 *
 * NEW: 
 * - 4 carduri per row (desktop)
 * - 8 discipline "Coming Soon" 
 * - Card special "Sugerează Disciplină"
 * - Total: 12 carduri (3 rows x 4 columns)
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

/**
 * DISCIPLINE COMING SOON - Static Data
 * Acestea vor fi afișate cu design "coming soon"
 */
const COMING_SOON_DISCIPLINES = [
  {
    id: 'matematica',
    name: 'Matematică',
    icon: '🔢',
    description: 'Algebră, geometrie, analiză. Dezvoltă gândirea logică prin probleme captivante.',
    color: '#B026FF', // neon purple
    themes: 8,
    questions: 120
  },
  {
    id: 'limba-romana',
    name: 'Limba Română',
    icon: '🗣️',
    description: 'Gramatică, vocabular, autori clasici. Stăpânește limba română cu stil.',
    color: '#0066FF', // neon blue
    themes: 6,
    questions: 90
  },
  {
    id: 'fizica',
    name: 'Fizică',
    icon: '⚛️',
    description: 'Mecanică, energie, unde. Descoperă legile care guvernează universul.',
    color: '#00AAFF', // bright blue
    themes: 9,
    questions: 130
  },
  {
    id: 'chimie',
    name: 'Chimie',
    icon: '🧪',
    description: 'Elemente, reacții, molecule. Explorează lumea transformărilor chimice.',
    color: '#00FF88', // turquoise green
    themes: 7,
    questions: 100
  },
  {
    id: 'istoria-religiilor',
    name: 'Istoria Religiilor',
    icon: '⛪',
    description: 'Credințe, ritualuri, doctrine. Înțelege diversitatea spirituală a lumii.',
    color: '#FFD700', // gold
    themes: 5,
    questions: 75
  },
  {
    id: 'istoria-artei',
    name: 'Istoria Artei',
    icon: '🎨',
    description: 'Pictură, sculptură, arhitectură. Călătorește prin mișcările artistice.',
    color: '#FF1493', // deep pink
    themes: 6,
    questions: 85
  },
  {
    id: 'limba-engleza',
    name: 'Limba Engleză',
    icon: '🇬🇧',
    description: 'Vocabular, gramatică, conversație. Vorbește engleza cu încredere.',
    color: '#FF4500', // orange red
    themes: 8,
    questions: 110
  },
  {
    id: 'limba-franceza',
    name: 'Limba Franceză',
    icon: '🇫🇷',
    description: 'Vocabular, cultură, gramatică. Stăpânește limba lui Molière.',
    color: '#8A2BE2', // blue violet
    themes: 7,
    questions: 95
  }
];

/**
 * Neon colors for active subjects (from Firestore)
 */
const ACTIVE_SUBJECT_COLORS = {
  'istorie': '#FF0080',      // neon pink
  'geografie': '#00FFFF',    // neon cyan
  'biologie': '#CCFF00',     // neon lime
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
   * EFFECT: Fetch active subjects from Firestore
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

        // Sort by order
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
   * HANDLER: Navigate to themes (Learning Mode)
   */
  const handleLearningMode = (subjectSlug) => {
    navigate(`/subjects/${subjectSlug}`);
  };

  /**
   * HANDLER: Start Trivia for specific subject
   */
  const handleTriviaSubject = (subjectSlug, difficulty) => {
    navigate(`/trivia/${subjectSlug}?difficulty=${difficulty}`);
  };

  /**
   * HANDLER: Suggest new discipline (mailto)
   */
  const handleSuggestDiscipline = () => {
    window.location.href = 'mailto:perviat@gmail.com?subject=Sugestie%20Disciplină%20Nouă%20-%20QuizzFun&body=Bună!%0A%0AAș%20dori%20să%20sugerez%20adăugarea%20următoarei%20discipline:%0A%0A[Scrie%20aici%20sugestia%20ta]%0A%0AMulțumesc!';
  };

  /**
   * HANDLER: Logout
   */
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  /**
   * Calculate total stats from active subjects
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
    <div className="min-h-screen bg-off-white dark:bg-deep-brown">

      {/* NAVIGATION - BOLD STYLE */}
      <nav className="bg-off-white dark:bg-deep-brown border-b-4 border-deep-brown dark:border-off-white fixed top-0 left-0 right-0 z-50">
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
                className="cursor-pointer font-heading font-black text-2xl uppercase tracking-tight text-deep-brown dark:text-off-white"
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
      <section className="py-16 sm:py-20 pt-24 sm:pt-32 bg-deep-brown dark:bg-off-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, currentColor 2px, currentColor 3px), repeating-linear-gradient(90deg, transparent, transparent 2px, currentColor 2px, currentColor 3px)'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="font-mono text-sm font-bold uppercase tracking-widest text-neon-cyan block mb-4">
            // Toate Disciplinele
          </span>
          
          <h1 className="text-7xl font-heading font-black mb-6 uppercase leading-tight tracking-tighter text-off-white dark:text-deep-brown">
            <span className="block">Explorează</span>
            <span className="inline-block bg-neon-pink text-off-white px-2 md:px-4 -rotate-2">Cunoașterea</span>
          </h1>
          
          <p className="text-xl font-body font-semibold max-w-3xl mx-auto text-off-white/90 dark:text-deep-brown/90 leading-relaxed mb-12">
            12 domenii de explorat. Sute de provocări de depășit. Învățare prin joc.
          </p>

          {/* Stats - Bold Style */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <p className="text-6xl font-mono font-bold text-off-white dark:text-deep-brown" style={{ textShadow: '3px 3px 0 #00FFFF' }}>
                {subjects.length}
              </p>
              <p className="text-sm font-heading font-bold uppercase tracking-widest mt-2 text-off-white/80 dark:text-deep-brown/80">
                Active
              </p>
            </div>
            <div className="text-center">
              <p className="text-6xl font-mono font-bold text-off-white dark:text-deep-brown" style={{ textShadow: '3px 3px 0 #FF0080' }}>
                {totalThemes}
              </p>
              <p className="text-sm font-heading font-bold uppercase tracking-widest mt-2 text-off-white/80 dark:text-deep-brown/80">
                Tematici
              </p>
            </div>
            <div className="text-center">
              <p className="text-6xl font-mono font-bold text-off-white dark:text-deep-brown" style={{ textShadow: '3px 3px 0 #CCFF00' }}>
                {totalQuestions}+
              </p>
              <p className="text-sm font-heading font-bold uppercase tracking-widest mt-2 text-off-white/80 dark:text-deep-brown/80">
                Întrebări
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DISCIPLINES GRID - 4 PER ROW */}
      <section className="py-16 sm:py-20 bg-cream dark:bg-deep-brown">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Grid: 1 column mobile, 2 tablet, 4 desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* ACTIVE SUBJECTS (from Firestore) - UNIVERSAL CARDS */}
            {subjects.map((subject, index) => {
              const neonColor = ACTIVE_SUBJECT_COLORS[subject.slug] || '#FF0080';

              return (
                <div
                  key={subject.id}
                  className="relative bg-cream dark:bg-warm-brown border-[5px] border-warm-brown dark:border-sand p-6 transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:border-deep-brown hover:dark:border-off-white min-h-[400px] flex flex-col group"
                  style={{
                    boxShadow: `0 0 0 0 transparent`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `6px 6px 0 #2D2416`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 0 0 transparent`;
                  }}
                >
                  {/* Left accent bar (vertical neon) */}
                  <div
                    className="absolute top-0 left-0 w-3 h-full transition-all duration-300 group-hover:w-5"
                    style={{ backgroundColor: neonColor }}
                  ></div>

                  {/* Header: Icon + Title (Horizontal Layout) */}
                  <div className="flex items-center gap-3 mb-3 relative z-10">
                    {/* Icon */}
                    <div className="text-5xl filter grayscale group-hover:grayscale-0 transition-all duration-300 flex-shrink-0">
                      {subject.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-heading font-black uppercase tracking-tight text-deep-brown dark:text-off-white leading-tight">
                      {subject.name}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm font-body text-deep-brown/70 dark:text-off-white/70 leading-snug relative z-10 mb-4">
                    {subject.description}
                  </p>

                  {/* TRIVIA MODE SECTION */}
                  <div className="bg-sand/50 dark:bg-deep-brown/20 p-3 mb-3 border-2 border-warm-brown dark:border-sand relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-heading font-bold text-xs uppercase text-deep-brown dark:text-off-white">
                        🎲 Trivia Rapid
                      </span>
                      <span className="font-mono text-xs text-warm-brown dark:text-sand">
                        12 întrebări
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {/* Easy Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTriviaSubject(subject.slug, 'easy');
                        }}
                        className="flex-1 bg-[#8B9B7A] text-off-white border-3 border-deep-brown px-3 py-2 font-heading font-bold uppercase text-xs hover:-translate-y-1 hover:shadow-[0_4px_0_#2D2416] transition-all duration-150"
                        title="Easy - 12 întrebări aleatorii"
                      >
                        E
                      </button>

                      {/* Medium Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTriviaSubject(subject.slug, 'medium');
                        }}
                        className="flex-1 bg-[#FF6B00] text-off-white border-3 border-deep-brown px-3 py-2 font-heading font-bold uppercase text-xs hover:-translate-y-1 hover:shadow-[0_4px_0_#2D2416] transition-all duration-150"
                        title="Medium - 12 întrebări aleatorii"
                      >
                        M
                      </button>

                      {/* Hard Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTriviaSubject(subject.slug, 'hard');
                        }}
                        className="flex-1 bg-[#FF0080] text-off-white border-3 border-deep-brown px-3 py-2 font-heading font-bold uppercase text-xs hover:-translate-y-1 hover:shadow-[0_4px_0_#2D2416] transition-all duration-150"
                        title="Hard - 12 întrebări aleatorii"
                      >
                        H
                      </button>
                    </div>
                  </div>

                  {/* LEARNING MODE SECTION */}
                  <div className="relative z-10 mt-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLearningMode(subject.slug);
                      }}
                      className="w-full bg-deep-brown dark:bg-off-white text-off-white dark:text-deep-brown border-3 border-deep-brown dark:border-off-white px-4 py-3 font-heading font-bold uppercase text-sm hover:-translate-y-1 hover:shadow-[0_4px_0_#2D2416] transition-all duration-150 flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <span>📚</span>
                        <span>Vezi Tematici</span>
                      </span>
                      <span className="text-lg">→</span>
                    </button>
                    <p className="text-xs font-mono text-warm-brown dark:text-sand text-center mt-1">
                      {subject.totalThemes} teme • {subject.totalQuestions}+ întrebări
                    </p>
                  </div>
                </div>
              );
            })}

            {/* COMING SOON DISCIPLINES */}
            {COMING_SOON_DISCIPLINES.map((discipline) => (
              <div
                key={discipline.id}
                className="relative bg-sand dark:bg-warm-brown border-[5px] border-dashed border-warm-brown dark:border-sand p-6 min-h-[280px] flex flex-col opacity-60 cursor-not-allowed"
              >
                {/* Coming Soon Badge */}
                <div 
                  className="absolute top-6 right-6 bg-[#FF6B00] text-off-white px-3 py-1.5 font-heading font-black text-xs uppercase tracking-widest z-10"
                  style={{ transform: 'rotate(5deg)' }}
                >
                  Coming Soon
                </div>

                {/* Header: Icon + Title (Horizontal Layout) */}
                <div className="flex items-center gap-3 mb-3 relative z-10">
                  {/* Icon */}
                  <div className="text-5xl filter grayscale flex-shrink-0">
                    {discipline.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-heading font-black uppercase tracking-tight text-deep-brown dark:text-off-white leading-tight">
                    {discipline.name}
                  </h3>
                </div>

                {/* Description - NO mb-auto */}
                <p className="text-base font-body text-deep-brown/70 dark:text-off-white/70 leading-relaxed mb-3">
                  {discipline.description}
                </p>

                {/* Meta */}
                <div className="flex justify-between items-center pt-3 border-t-[3px] border-warm-brown dark:border-sand mt-auto">
                  <span className="bg-warm-brown dark:bg-sand text-off-white dark:text-deep-brown px-2 py-1 font-mono text-xs font-bold uppercase">
                    În curând
                  </span>
                  <div className="w-12 h-12 bg-deep-brown dark:bg-off-white flex items-center justify-center text-off-white dark:text-deep-brown text-2xl font-black">
                    →
                  </div>
                </div>
              </div>
            ))}

            {/* SUGGEST DISCIPLINE CARD */}
            <div
              onClick={handleSuggestDiscipline}
              className="relative bg-gradient-to-br from-[#39FF14] to-[#00FF88] border-[5px] border-deep-brown dark:border-off-white p-6 cursor-pointer transition-all duration-200 hover:-translate-x-2 hover:-translate-y-2 hover:shadow-[8px_8px_0_#2D2416] min-h-[280px] flex flex-col group"
            >
              {/* Header: Icon + Title (Horizontal Layout) */}
              <div className="flex items-center gap-3 mb-3">
                {/* Icon with pulse animation */}
                <div className="text-5xl animate-pulse flex-shrink-0">
                  💡
                </div>

                {/* Title */}
                <h3 className="text-2xl font-heading font-black uppercase tracking-tight text-deep-brown leading-tight">
                  Sugerează Disciplină
                </h3>
              </div>

              {/* Description - NO mb-auto */}
              <p className="text-base font-body text-deep-brown/80 leading-relaxed mb-3">
                Ai o idee pentru o disciplină nouă? Trimite-ne sugestia ta și ajută-ne să extindem platforma!
              </p>

              {/* Meta */}
              <div className="flex justify-between items-center pt-3 border-t-[3px] border-deep-brown mt-auto">
                <span className="bg-deep-brown text-off-white px-2 py-1 font-mono text-xs font-bold uppercase">
                  Contact
                </span>
                <div className="w-12 h-12 bg-deep-brown flex items-center justify-center text-off-white text-2xl font-black transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                  ✉️
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER - BOLD STYLE */}
      <footer className="bg-deep-brown dark:bg-off-white py-12 border-t-6 border-neon-pink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-heading font-black text-xl uppercase text-off-white dark:text-deep-brown mb-4">
                QUIZZFUN
              </h3>
              <p className="text-sm font-body text-off-white/80 dark:text-deep-brown/80">
                Educație prin joc. Învață orice disciplină distractiv.
              </p>
            </div>

            <div>
              <h4 className="font-heading font-bold uppercase tracking-wide text-off-white dark:text-deep-brown mb-3">Rapid Links</h4>
              <ul className="space-y-2 text-sm font-body">
                <li>
                  <button
                    onClick={() => navigate('/')}
                    className="text-off-white/80 dark:text-deep-brown/80 hover:text-neon-cyan transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/profile')}
                    className="text-off-white/80 dark:text-deep-brown/80 hover:text-neon-cyan transition-colors"
                  >
                    Profil
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-bold uppercase tracking-wide text-off-white dark:text-deep-brown mb-3">Contact</h4>
              <p className="text-sm font-body text-off-white/80 dark:text-deep-brown/80">📧 perviat@gmail.com</p>
            </div>
          </div>

          <hr className="border-3 border-off-white/20 dark:border-deep-brown/20 mb-6" />

          <div className="text-center text-sm font-mono">
            <p className="text-off-white/70 dark:text-deep-brown/70">
              © 2025 QuizzFun — All Rights Reserved
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default SubjectSelection;