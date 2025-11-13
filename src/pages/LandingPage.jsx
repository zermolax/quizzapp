/**
 * LandingPage.jsx - REDESIGNED v4
 *
 * NEW STRUCTURE - 3 sections:
 * 1. 📚 MODUL EDUCAȚIONAL - Learning mode with SubjectCard components
 * 2. 🎯 SPECIALIST - Trivia per subject with SubjectCard components
 * 3. 🎲 TRIVIA - Global trivia mode
 *
 * REFACTORED: Uses SubjectCard components and useSubjects hook
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSubjects } from '../hooks/useSubjects';
import { SubjectCard } from '../components/cards/SubjectCard';

export function LandingPage({ onPlayNow }) {

  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { subjects, loading: loadingSubjects } = useSubjects({ activeOnly: true });
  const [isDarkMode, setIsDarkMode] = useState(false);

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
   * Get featured subjects for each section
   */
  const istorie = subjects.find(s => s.slug === 'istorie');
  const biologie = subjects.find(s => s.slug === 'biologie');
  const popularSubjects = [istorie, subjects.find(s => s.slug === 'geografie')].filter(Boolean);

  /**
   * Handle trivia global start
   */
  const handleTriviaGlobal = (difficulty) => {
    if (!user) {
      if (onPlayNow) onPlayNow();
    } else {
      navigate(`/trivia/global?difficulty=${difficulty}`);
    }
  };

  /**
   * Handle trivia subject start
   */
  const handleTriviaSubject = (subjectSlug, difficulty) => {
    if (!user) {
      if (onPlayNow) onPlayNow();
    } else {
      navigate(`/trivia/${subjectSlug}?difficulty=${difficulty}`);
    }
  };

  /**
   * Handle explore all subjects
   */
  const handleExploreSubjects = () => {
    if (!user) {
      if (onPlayNow) onPlayNow();
    } else {
      navigate('/subjects');
    }
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-deep-brown transition-colors duration-200">

      {/* NAVIGATION */}
      <nav className="bg-cream dark:bg-deep-brown border-b-4 border-deep-brown dark:border-off-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* Logo */}
          <h1
            onClick={() => navigate('/')}
            className="cursor-pointer text-2xl font-heading font-black text-deep-brown dark:text-off-white uppercase tracking-tight"
          >
            Quizz<span className="text-neon-pink">Fun</span>
          </h1>

          {/* Right side buttons */}
          <div className="flex gap-2 items-center">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="w-12 h-12 bg-deep-brown dark:bg-off-white text-off-white dark:text-deep-brown border-4 border-deep-brown dark:border-off-white hover:bg-neon-cyan hover:text-deep-brown transition-all duration-150 hover:rotate-12 flex items-center justify-center text-xl"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>

            {user ? (
              <>
                {/* Profile */}
                <button
                  onClick={() => navigate('/profile')}
                  className="hidden md:block bg-deep-brown dark:bg-off-white text-off-white dark:text-deep-brown border-4 border-deep-brown dark:border-off-white px-4 py-2 font-heading font-bold uppercase text-sm hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal hover:shadow-deep-brown transition-all duration-150"
                >
                  Profil
                </button>

                {/* Logout */}
                <button
                  onClick={logout}
                  className="bg-error text-white border-4 border-error px-4 py-2 font-heading font-bold uppercase text-sm hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal hover:shadow-error transition-all duration-150"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={onPlayNow || (() => {})}
                className="bg-deep-brown dark:bg-off-white text-off-white dark:text-deep-brown border-4 border-deep-brown dark:border-off-white px-6 py-2 font-heading font-bold uppercase text-sm hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal hover:shadow-deep-brown transition-all duration-150"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-deep-brown dark:bg-off-white py-20">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, currentColor 2px, currentColor 3px), repeating-linear-gradient(90deg, transparent, transparent 2px, currentColor 2px, currentColor 3px)'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-7xl font-heading font-black mb-6 uppercase leading-tight text-off-white dark:text-deep-brown">
            <span className="block">Învață</span>
            <span className="inline-block bg-neon-pink text-off-white px-4 -rotate-2">Jucându-te</span>
          </h1>

          <p className="text-2xl font-body font-semibold max-w-3xl mx-auto text-off-white/90 dark:text-deep-brown/90 leading-relaxed">
            Quiz-uri bold. Cunoștințe reale. Competiție intensă.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT - 3 SECTIONS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* ===== SECTION 1: MODUL EDUCAȚIONAL (LEARNING MODE) ===== */}
        <section className="bg-sand dark:bg-warm-brown border-6 border-deep-brown dark:border-sand p-8 md:p-12">
          <div className="flex items-start gap-4 mb-6">
            <div className="text-6xl">📚</div>
            <div>
              <h2 className="text-4xl font-heading font-black uppercase text-deep-brown dark:text-off-white mb-2">
                Modul Educațional
              </h2>
              <p className="text-lg font-body text-deep-brown/70 dark:text-off-white/70">
                Învață lecțiile pas cu pas la fiecare disciplină
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Istorie */}
            {istorie && (
              <SubjectCard
                subject={istorie}
                variant="educational"
                onSelect={(slug) => navigate(`/subjects/${slug}`)}
                showThemeCount={true}
                showDescription={true}
              />
            )}

            {/* Biologie */}
            {biologie && (
              <SubjectCard
                subject={biologie}
                variant="educational"
                onSelect={(slug) => navigate(`/subjects/${slug}`)}
                showThemeCount={true}
                showDescription={true}
              />
            )}

            {/* "Mai Multe" card */}
            <button
              onClick={handleExploreSubjects}
              className="bg-neon-lime text-deep-brown border-4 border-deep-brown p-6 hover:-translate-x-2 hover:-translate-y-2 hover:shadow-[10px_10px_0_#2D2416] transition-all duration-150 text-left"
            >
              <div className="text-5xl mb-3">➕</div>
              <h3 className="text-2xl font-heading font-black uppercase mb-2">
                Mai Multe
              </h3>
              <p className="text-sm font-body mb-4">
                Explorează toate disciplinele disponibile
              </p>
              <div className="flex items-center gap-2 text-lg font-heading font-bold">
                Vezi toate <span className="text-2xl">→</span>
              </div>
            </button>
          </div>
        </section>

        {/* ===== SECTION 2: SPECIALIST ===== */}
        <section className="bg-off-white dark:bg-warm-brown border-6 border-deep-brown dark:border-sand p-8 md:p-12">
          <div className="flex items-start gap-4 mb-6">
            <div className="text-6xl">🎯</div>
            <div>
              <h2 className="text-4xl font-heading font-black uppercase text-deep-brown dark:text-off-white mb-2">
                Specialist
              </h2>
              <p className="text-lg font-body text-deep-brown/70 dark:text-off-white/70">
                Testează-ți cunoștințele circulare dintr-o singură disciplină
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Popular subjects */}
            {popularSubjects.map((subject) => {
              // Get description based on subject slug
              const getDescription = (slug) => {
                switch(slug) {
                  case 'istorie': return 'Testează cunoștințele istorice';
                  case 'geografie': return 'Explorează lumea și Geografia';
                  default: return 'Testează-ți cunoștințele';
                }
              };

              return (
                <div
                  key={subject.id}
                  className="bg-cream dark:bg-warm-brown border-4 border-warm-brown dark:border-sand p-6"
                >
                  {/* Header */}
                  <div className="text-5xl mb-3">{subject.icon}</div>
                  <h3 className="text-2xl font-heading font-black uppercase text-deep-brown dark:text-off-white mb-2">
                    {subject.name}
                  </h3>
                  <p className="text-sm font-body text-deep-brown/70 dark:text-off-white/70 mb-3">
                    {getDescription(subject.slug)}
                  </p>
                  <p className="text-xs font-mono text-deep-brown/50 dark:text-off-white/50 mb-4">
                    {subject.totalThemes || 0} teme disponibile
                  </p>

                {/* Difficulty buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleTriviaSubject(subject.slug, 'easy')}
                    className="flex-1 bg-[#8B9B7A] text-off-white border-2 border-deep-brown py-2 px-3 font-heading font-bold text-sm uppercase hover:-translate-y-1 hover:shadow-brutal hover:shadow-deep-brown transition-all duration-150"
                    title="Easy"
                  >
                    E
                  </button>
                  <button
                    onClick={() => handleTriviaSubject(subject.slug, 'medium')}
                    className="flex-1 bg-[#FF6B00] text-off-white border-2 border-deep-brown py-2 px-3 font-heading font-bold text-sm uppercase hover:-translate-y-1 hover:shadow-brutal hover:shadow-deep-brown transition-all duration-150"
                    title="Medium"
                  >
                    M
                  </button>
                  <button
                    onClick={() => handleTriviaSubject(subject.slug, 'hard')}
                    className="flex-1 bg-[#FF0080] text-off-white border-2 border-deep-brown py-2 px-3 font-heading font-bold text-sm uppercase hover:-translate-y-1 hover:shadow-brutal hover:shadow-deep-brown transition-all duration-150"
                    title="Hard"
                  >
                    H
                  </button>
                </div>
              </div>
            );
            })}

            {/* "Mai Multe" card */}
            <button
              onClick={handleExploreSubjects}
              className="bg-neon-cyan text-deep-brown border-4 border-deep-brown p-6 hover:-translate-x-2 hover:-translate-y-2 hover:shadow-[10px_10px_0_#2D2416] transition-all duration-150 text-left"
            >
              <div className="text-5xl mb-3">➕</div>
              <h3 className="text-2xl font-heading font-black uppercase mb-2">
                Mai Multe
              </h3>
              <p className="text-sm font-body mb-4">
                Explorează toate disciplinele disponibile
              </p>
              <div className="flex items-center gap-2 text-lg font-heading font-bold">
                Vezi toate <span className="text-2xl">→</span>
              </div>
            </button>
          </div>
        </section>

        {/* ===== SECTION 3: TRIVIA ===== */}
        <section className="bg-sand dark:bg-warm-brown border-6 border-deep-brown dark:border-sand p-8 md:p-12">
          <div className="flex items-start gap-4 mb-6">
            <div className="text-6xl">🎲</div>
            <div>
              <h2 className="text-4xl font-heading font-black uppercase text-deep-brown dark:text-off-white mb-2">
                Trivia
              </h2>
              <p className="text-lg font-body text-deep-brown/70 dark:text-off-white/70">
                Ai cunoștințe enciclopedice? Testează-te cu întrebări din toate disciplinele!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Easy */}
            <button
              onClick={() => handleTriviaGlobal('easy')}
              className="relative bg-[#8B9B7A] text-off-white border-4 border-deep-brown p-8 hover:-translate-x-2 hover:-translate-y-2 hover:shadow-[10px_10px_0_#2D2416] transition-all duration-150 text-left group overflow-hidden"
            >
              <div className="text-6xl mb-4">🟢</div>
              <h3 className="text-3xl font-heading font-black uppercase mb-3">EASY</h3>
              <p className="text-sm font-body mb-4 leading-relaxed">
                Pentru începători. Întrebări accesibile din toate materiile.
              </p>
              <div className="flex items-center gap-2 text-base font-heading font-bold">
                Începe testul
                <span className="text-2xl inline-block transition-transform group-hover:translate-x-2 duration-300">→</span>
              </div>
              <div className="absolute top-2 right-2 text-xs font-mono opacity-50">12 întrebări</div>
            </button>

            {/* Medium */}
            <button
              onClick={() => handleTriviaGlobal('medium')}
              className="relative bg-[#FF6B00] text-off-white border-4 border-deep-brown p-8 hover:-translate-x-2 hover:-translate-y-2 hover:shadow-[10px_10px_0_#2D2416] transition-all duration-150 text-left group overflow-hidden"
            >
              <div className="text-6xl mb-4">🟡</div>
              <h3 className="text-3xl font-heading font-black uppercase mb-3">MEDIUM</h3>
              <p className="text-sm font-body mb-4 leading-relaxed">
                Provocare moderată. Demonstrează-ți cunoștințele!
              </p>
              <div className="flex items-center gap-2 text-base font-heading font-bold">
                Acceptă provocarea
                <span className="text-2xl inline-block transition-transform group-hover:translate-x-2 duration-300">→</span>
              </div>
              <div className="absolute top-2 right-2 text-xs font-mono opacity-50">12 întrebări</div>
            </button>

            {/* Hard */}
            <button
              onClick={() => handleTriviaGlobal('hard')}
              className="relative bg-[#FF0080] text-off-white border-4 border-deep-brown p-8 hover:-translate-x-2 hover:-translate-y-2 hover:shadow-[10px_10px_0_#2D2416] transition-all duration-150 text-left group overflow-hidden"
            >
              <div className="text-6xl mb-4">🔴</div>
              <h3 className="text-3xl font-heading font-black uppercase mb-3">HARD</h3>
              <p className="text-sm font-body mb-4 leading-relaxed">
                Doar pentru experți. Vrei să fii cel mai bun?
              </p>
              <div className="flex items-center gap-2 text-base font-heading font-bold">
                Îndrăznește!
                <span className="text-2xl inline-block transition-transform group-hover:translate-x-2 duration-300">→</span>
              </div>
              <div className="absolute top-2 right-2 text-xs font-mono opacity-50">12 întrebări</div>
            </button>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-deep-brown dark:bg-off-white py-12 border-t-6 border-neon-pink mt-20">
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
              <h4 className="font-heading font-bold uppercase text-off-white dark:text-deep-brown mb-3">
                Links
              </h4>
              <ul className="space-y-2 text-sm font-body">
                <li>
                  <button
                    onClick={() => navigate('/')}
                    className="text-off-white/80 dark:text-deep-brown/80 hover:text-neon-cyan transition-colors"
                  >
                    Home
                  </button>
                </li>
                {user && (
                  <li>
                    <button
                      onClick={() => navigate('/profile')}
                      className="text-off-white/80 dark:text-deep-brown/80 hover:text-neon-cyan transition-colors"
                    >
                      Profil
                    </button>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-bold uppercase text-off-white dark:text-deep-brown mb-3">
                Contact
              </h4>
              <p className="text-sm font-body text-off-white/80 dark:text-deep-brown/80">
                📧 perviat@gmail.com
              </p>
            </div>
          </div>

          <hr className="border-2 border-off-white/20 dark:border-deep-brown/20 mb-6" />

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

export default LandingPage;
