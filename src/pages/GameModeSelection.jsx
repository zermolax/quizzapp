/**
 * GameModeSelection.jsx - Selectează Modul de Joc
 *
 * Pagina unde utilizatorii aleg între:
 * 1. MOD CLASIC - Învață pe tematici
 * 2. TRIVIA GLOBAL - Întrebări random din toate disciplinele
 * 3. TRIVIA PE DISCIPLINĂ - Alege disciplină, joacă random din toate tematicile
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

export function GameModeSelection() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTriviaSubjectModal, setShowTriviaSubjectModal] = useState(false);
  const [showTriviaGlobalModal, setShowTriviaGlobalModal] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
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
        const subjectsRef = collection(db, 'subjects');
        const q = query(subjectsRef, where('isPublished', '==', true));
        const snapshot = await getDocs(q);
        const subjectsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        const sortedSubjects = subjectsData.sort((a, b) => a.order - b.order);
        setSubjects(sortedSubjects);
      } catch (err) {
        console.error('Eroare fetch subjects:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSubjects();
  }, []);

  /**
   * HANDLER: Start Trivia Global
   */
  const handleStartTriviaGlobal = (difficulty) => {
    navigate(`/trivia/global?difficulty=${difficulty}`);
  };

  /**
   * HANDLER: Start Trivia Subject
   */
  const handleStartTriviaSubject = (subjectSlug, difficulty) => {
    navigate(`/trivia/${subjectSlug}?difficulty=${difficulty}`);
  };

  /**
   * HANDLER: Logout
   */
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream dark:bg-deep-brown">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-neon-cyan mx-auto mb-4"></div>
          <p className="font-body text-deep-brown dark:text-off-white">Se încarcă...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white dark:bg-deep-brown">

      {/* NAVIGATION */}
      <nav className="bg-off-white dark:bg-deep-brown border-b-4 border-deep-brown dark:border-off-white fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
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

            <div className="flex gap-1 sm:gap-2 items-center">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-deep-brown dark:bg-off-white text-off-white dark:text-deep-brown border-4 border-deep-brown dark:border-off-white hover:bg-neon-cyan hover:dark:bg-neon-cyan hover:text-deep-brown transition-all duration-150 hover:rotate-12 flex items-center justify-center text-xl"
              >
                <span>{isDarkMode ? '☀️' : '🌙'}</span>
              </button>

              {/* Profile */}
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

      {/* HERO SECTION */}
      <section className="py-16 sm:py-20 pt-24 sm:pt-32 bg-deep-brown dark:bg-off-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, currentColor 2px, currentColor 3px), repeating-linear-gradient(90deg, transparent, transparent 2px, currentColor 2px, currentColor 3px)'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="font-mono text-sm font-bold uppercase tracking-widest text-neon-cyan block mb-4">
            // Alege Modul de Joc
          </span>

          <h1 className="text-7xl font-heading font-black mb-6 uppercase leading-tight tracking-tighter text-off-white dark:text-deep-brown">
            <span className="block">Cum Vrei Să</span>
            <span className="inline-block bg-neon-pink text-off-white px-2 md:px-4 -rotate-2">Înveți?</span>
          </h1>

          <p className="text-xl font-body font-semibold max-w-3xl mx-auto text-off-white/90 dark:text-deep-brown/90 leading-relaxed">
            Alege modul de joc care ți se potrivește și pornește aventura cunoașterii!
          </p>
        </div>
      </section>

      {/* GAME MODES SECTION */}
      <section className="py-16 sm:py-20 bg-cream dark:bg-deep-brown">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">

            {/* MOD 1: CLASIC */}
            <div
              onClick={() => navigate('/subjects')}
              className="relative bg-cream dark:bg-warm-brown border-[6px] border-deep-brown dark:border-sand p-6 sm:p-8 cursor-pointer transition-all duration-200 hover:-translate-x-2 hover:-translate-y-2 hover:shadow-[10px_10px_0_#2D2416] min-h-[350px] flex flex-col group"
            >
              {/* Icon */}
              <div className="text-7xl mb-4 filter grayscale group-hover:grayscale-0 transition-all duration-300">
                📚
              </div>

              {/* Badge */}
              <div className="inline-block bg-neon-lime text-deep-brown px-3 py-1 font-mono text-xs font-bold uppercase mb-3">
                CLASIC
              </div>

              {/* Title */}
              <h3 className="text-3xl font-heading font-black uppercase tracking-tight text-deep-brown dark:text-off-white leading-tight mb-3">
                Învață pe Tematici
              </h3>

              {/* Description */}
              <p className="text-base font-body text-deep-brown/70 dark:text-off-white/70 leading-relaxed mb-4">
                Alege disciplină, temă și dificultate. Perfect pentru consolidarea cunoștințelor pe fiecare unitate de învățare.
              </p>

              {/* Arrow */}
              <div className="mt-auto flex justify-end">
                <div className="w-12 h-12 bg-deep-brown dark:bg-off-white flex items-center justify-center text-off-white dark:text-deep-brown text-2xl font-black transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                  →
                </div>
              </div>
            </div>

            {/* MOD 2: TRIVIA GLOBAL */}
            <div
              onClick={() => setShowTriviaGlobalModal(true)}
              className="relative border-[6px] border-deep-brown p-6 sm:p-8 cursor-pointer transition-all duration-200 hover:-translate-x-2 hover:-translate-y-2 hover:shadow-[10px_10px_0_#2D2416] min-h-[350px] flex flex-col group"
              style={{ backgroundColor: '#6A4C93' }}
            >
              {/* Icon */}
              <div className="text-7xl mb-4 animate-pulse">
                🎲
              </div>

              {/* Badge */}
              <div className="inline-block bg-deep-brown text-off-white px-3 py-1 font-mono text-xs font-bold uppercase mb-3">
                TRIVIA GLOBAL
              </div>

              {/* Title */}
              <h3 className="text-3xl font-heading font-black uppercase tracking-tight text-off-white leading-tight mb-3">
                Provocare Totală
              </h3>

              {/* Description */}
              <p className="text-base font-body text-off-white/90 leading-relaxed mb-4">
                Întrebări surpriză din TOATE disciplinele! Testează-ți cunoștințele generale și descoperă cât de mult știi.
              </p>

              {/* Arrow */}
              <div className="mt-auto flex justify-end">
                <div className="w-12 h-12 bg-deep-brown flex items-center justify-center text-off-white text-2xl font-black transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                  →
                </div>
              </div>
            </div>

            {/* MOD 3: TRIVIA PE DISCIPLINĂ */}
            <div
              onClick={() => setShowTriviaSubjectModal(true)}
              className="relative bg-cream dark:bg-warm-brown border-[6px] border-deep-brown dark:border-sand p-6 sm:p-8 cursor-pointer transition-all duration-200 hover:-translate-x-2 hover:-translate-y-2 hover:shadow-[10px_10px_0_#2D2416] min-h-[350px] flex flex-col group"
            >
              {/* Icon */}
              <div className="text-7xl mb-4 filter grayscale group-hover:grayscale-0 transition-all duration-300">
                🧠
              </div>

              {/* Badge */}
              <div className="inline-block bg-neon-cyan text-deep-brown px-3 py-1 font-mono text-xs font-bold uppercase mb-3">
                TRIVIA DISCIPLINĂ
              </div>

              {/* Title */}
              <h3 className="text-3xl font-heading font-black uppercase tracking-tight text-deep-brown dark:text-off-white leading-tight mb-3">
                Specialist
              </h3>

              {/* Description */}
              <p className="text-base font-body text-deep-brown/70 dark:text-off-white/70 leading-relaxed mb-4">
                Alege disciplina ta preferată și joacă cu întrebări random din toate tematicile. Devino expert!
              </p>

              {/* Arrow */}
              <div className="mt-auto flex justify-end">
                <div className="w-12 h-12 bg-deep-brown dark:bg-off-white flex items-center justify-center text-off-white dark:text-deep-brown text-2xl font-black transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                  →
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* MODAL: TRIVIA GLOBAL - Selectează Dificultate */}
      {showTriviaGlobalModal && (
        <div className="fixed inset-0 bg-deep-brown/90 flex items-center justify-center z-[2000] p-4">
          <div className="bg-cream border-6 border-deep-brown max-w-lg w-full p-6 sm:p-8">
            <h2 className="font-heading text-3xl font-black uppercase text-deep-brown mb-6">
              🎲 Trivia Global
            </h2>

            <p className="font-body text-base text-deep-brown mb-6">
              Alege dificultatea pentru quiz-ul tău:
            </p>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleStartTriviaGlobal('easy')}
                className="w-full bg-[#8B9B7A] text-off-white border-4 border-deep-brown px-6 py-4 font-heading font-bold uppercase text-base hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal hover:shadow-deep-brown transition-all duration-150"
              >
                🟢 Ușor
              </button>

              <button
                onClick={() => handleStartTriviaGlobal('medium')}
                className="w-full bg-[#FF6B00] text-off-white border-4 border-deep-brown px-6 py-4 font-heading font-bold uppercase text-base hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal hover:shadow-deep-brown transition-all duration-150"
              >
                🟡 Mediu
              </button>

              <button
                onClick={() => handleStartTriviaGlobal('hard')}
                className="w-full bg-[#FF0080] text-off-white border-4 border-deep-brown px-6 py-4 font-heading font-bold uppercase text-base hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal hover:shadow-deep-brown transition-all duration-150"
              >
                🔴 Dificil
              </button>
            </div>

            <button
              onClick={() => setShowTriviaGlobalModal(false)}
              className="w-full bg-sand text-deep-brown border-4 border-warm-brown px-6 py-3 font-heading font-bold uppercase text-sm hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal hover:shadow-warm-brown transition-all duration-150"
            >
              ← Înapoi
            </button>
          </div>
        </div>
      )}

      {/* MODAL: TRIVIA SUBJECT - Selectează Disciplina și Dificultate */}
      {showTriviaSubjectModal && (
        <div className="fixed inset-0 bg-deep-brown/90 flex items-center justify-center z-[2000] p-4 overflow-y-auto">
          <div className="bg-cream border-6 border-deep-brown max-w-2xl w-full p-6 sm:p-8 my-8">
            <h2 className="font-heading text-3xl font-black uppercase text-deep-brown mb-6">
              🧠 Trivia pe Disciplină
            </h2>

            <p className="font-body text-base text-deep-brown mb-4">
              Alege dificultatea:
            </p>

            {/* Difficulty selector */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setSelectedDifficulty('easy')}
                className={`flex-1 px-4 py-2 font-heading font-bold uppercase text-xs border-4 transition-all ${
                  selectedDifficulty === 'easy'
                    ? 'bg-[#8B9B7A] text-off-white border-deep-brown'
                    : 'bg-sand text-deep-brown border-warm-brown'
                }`}
              >
                🟢 Ușor
              </button>
              <button
                onClick={() => setSelectedDifficulty('medium')}
                className={`flex-1 px-4 py-2 font-heading font-bold uppercase text-xs border-4 transition-all ${
                  selectedDifficulty === 'medium'
                    ? 'bg-[#FF6B00] text-off-white border-deep-brown'
                    : 'bg-sand text-deep-brown border-warm-brown'
                }`}
              >
                🟡 Mediu
              </button>
              <button
                onClick={() => setSelectedDifficulty('hard')}
                className={`flex-1 px-4 py-2 font-heading font-bold uppercase text-xs border-4 transition-all ${
                  selectedDifficulty === 'hard'
                    ? 'bg-[#FF0080] text-off-white border-deep-brown'
                    : 'bg-sand text-deep-brown border-warm-brown'
                }`}
              >
                🔴 Dificil
              </button>
            </div>

            <p className="font-body text-base text-deep-brown mb-4">
              Alege disciplina:
            </p>

            {/* Subjects grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 max-h-[400px] overflow-y-auto">
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => handleStartTriviaSubject(subject.slug, selectedDifficulty)}
                  className="bg-sand border-4 border-warm-brown p-4 text-left font-body text-sm hover:bg-neon-cyan hover:border-deep-brown hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal hover:shadow-deep-brown transition-all duration-150"
                >
                  <span className="text-2xl mr-2">{subject.icon}</span>
                  <span className="font-heading font-bold text-deep-brown">{subject.name}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowTriviaSubjectModal(false)}
              className="w-full bg-sand text-deep-brown border-4 border-warm-brown px-6 py-3 font-heading font-bold uppercase text-sm hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal hover:shadow-warm-brown transition-all duration-150"
            >
              ← Înapoi
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default GameModeSelection;
