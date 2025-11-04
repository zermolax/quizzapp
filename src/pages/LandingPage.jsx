/**
 * LandingPage.jsx - REDESIGNED for Multi-Subject Architecture
 *
 * Subjects sunt acum vizibili direct pe landing page
 * Flow: Landing → Click subject → Themes → Quiz (2 clickuri în loc de 3)
 *
 * NEW: Bold design with light/dark mode toggle
 * UPDATED: Full-width hero pattern, vertical title layout, neon hover effects
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

export function LandingPage({ onPlayNow }) {

  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
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
   * Fetch subjects from Firestore
   */
  useEffect(() => {
    async function fetchSubjects() {
      try {
        const subjectsRef = collection(db, 'subjects');
        const q = query(subjectsRef, where('isPublished', '==', true));
        const snapshot = await getDocs(q);
        const subjectsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        const sorted = subjectsData.sort((a, b) => a.order - b.order);
        setSubjects(sorted);
      } catch (err) {
        console.error('Error fetching subjects:', err);
      } finally {
        setLoadingSubjects(false);
      }
    }
    fetchSubjects();
  }, []);

  /**
   * Scroll to subjects section
   */
  const scrollToSubjects = () => {
    const subjectsSection = document.getElementById('subjects-section');
    if (subjectsSection) {
      subjectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  /**
   * Handle subject click
   */
  const handleSubjectClick = (subjectSlug) => {
    if (!user) {
      // User not logged in - show login modal
      if (onPlayNow) onPlayNow();
    } else {
      // User logged in - go to themes
      navigate(`/subjects/${subjectSlug}`);
    }
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-deep-brown transition-colors duration-200">

      {/* NAVIGATION - BOLD STYLE */}
      <nav className="bg-cream dark:bg-deep-brown border-b-4 border-deep-brown dark:border-off-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center gap-2">
          {/* Logo - responsive */}
          <h1
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer text-lg sm:text-2xl font-heading font-black text-deep-brown dark:text-off-white whitespace-nowrap uppercase tracking-tight"
          >
            <span>Quizz<span className="text-neon-pink">Fun</span></span>
          </h1>

          {/* Navigation buttons - responsive */}
          <div className="flex gap-1 sm:gap-2 items-center">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="w-12 h-12 bg-deep-brown dark:bg-off-white text-off-white dark:text-deep-brown border-4 border-deep-brown dark:border-off-white hover:bg-neon-cyan hover:dark:bg-neon-cyan hover:text-deep-brown transition-all duration-150 hover:rotate-12 flex items-center justify-center text-xl"
              aria-label="Toggle dark mode"
              title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            >
              <span>{isDarkMode ? '☀️' : '🌙'}</span>
            </button>

            {user ? (
              <>
                {/* Profil */}
                <button
                  onClick={() => navigate('/profile')}
                  className="hidden md:block bg-deep-brown dark:bg-off-white text-off-white dark:text-deep-brown border-4 border-deep-brown dark:border-off-white px-4 py-2 font-heading font-bold uppercase tracking-wide text-sm hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal hover:shadow-deep-brown dark:hover:shadow-off-white transition-all duration-150"
                  title="Profil"
                >
                  Profil
                </button>

                {/* Materii */}
                <button
                  onClick={scrollToSubjects}
                  className="bg-deep-brown dark:bg-off-white text-off-white dark:text-deep-brown border-4 border-deep-brown dark:border-off-white px-3 sm:px-6 py-2 font-heading font-bold uppercase tracking-wide text-xs sm:text-sm hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal hover:shadow-deep-brown dark:hover:shadow-off-white transition-all duration-150"
                >
                  <span className="hidden sm:inline">Materii</span>
                  <span className="sm:hidden">📚</span>
                </button>

                {/* Logout */}
                <button
                  onClick={logout}
                  className="bg-error text-white border-4 border-error px-3 sm:px-6 py-2 font-heading font-bold uppercase tracking-wide text-xs sm:text-sm hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal hover:shadow-error transition-all duration-150"
                >
                  <span className="hidden sm:inline">Logout</span>
                  <span className="sm:hidden">🚪</span>
                </button>
              </>
            ) : (
              <button
                onClick={onPlayNow || (() => {})}
                className="bg-deep-brown dark:bg-off-white text-off-white dark:text-deep-brown border-4 border-deep-brown dark:border-off-white px-4 sm:px-6 py-2 font-heading font-bold uppercase tracking-wide text-sm hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal hover:shadow-deep-brown dark:hover:shadow-off-white transition-all duration-150"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION - BOLD STYLE WITH FULL-WIDTH PATTERN */}
      <section className="relative overflow-hidden">
        {/* Background grid pattern - FULL WIDTH */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, currentColor 2px, currentColor 3px), repeating-linear-gradient(90deg, transparent, transparent 2px, currentColor 2px, currentColor 3px)'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative z-10">
          {/* Titlu principal - layout VERTICAL */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-black mb-6 uppercase leading-tight tracking-tighter text-deep-brown dark:text-off-white">
            <span className="block">Învață</span>
            <span className="inline-block bg-neon-pink text-off-white px-2 md:px-4 -rotate-2">Jucându-te</span>
          </h1>
          
          <p className="text-xl sm:text-2xl mb-8 font-body font-semibold max-w-3xl mx-auto text-deep-brown dark:text-off-white leading-relaxed">
            Quiz-uri bold. Cunoștințe reale. Competiție intensă.
          </p>

          {/* Buton CTA - HOVER VERDE NEON #39FF14 */}
          <button
            onClick={user ? scrollToSubjects : onPlayNow}
            className="group bg-deep-brown dark:bg-off-white text-off-white dark:text-deep-brown border-6 border-deep-brown dark:border-off-white px-10 sm:px-16 py-5 font-heading font-black text-xl sm:text-2xl uppercase tracking-wide hover:bg-[#39FF14] hover:text-deep-brown hover:-translate-x-2 hover:-translate-y-2 hover:shadow-brutal-lg hover:shadow-deep-brown dark:hover:shadow-off-white transition-all duration-150 inline-flex items-center gap-3"
          >
            {user ? 'Start Now' : '🚀 Începe Acum'}
            <span className="inline-block transition-transform group-hover:translate-x-2">→</span>
          </button>

          {/* Stats - Bold Style */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-20">
            <div className="text-center">
              <p className="text-6xl sm:text-7xl font-mono font-bold text-deep-brown dark:text-off-white" style={{ textShadow: '4px 4px 0 #00FFFF' }}>
                500+
              </p>
              <p className="text-sm sm:text-base font-heading font-bold uppercase tracking-widest mt-2 text-deep-brown dark:text-off-white opacity-80">
                Questions
              </p>
            </div>
            <div className="text-center">
              <p className="text-6xl sm:text-7xl font-mono font-bold text-deep-brown dark:text-off-white" style={{ textShadow: '4px 4px 0 #FF0080' }}>
                10K+
              </p>
              <p className="text-sm sm:text-base font-heading font-bold uppercase tracking-widest mt-2 text-deep-brown dark:text-off-white opacity-80">
                Players
              </p>
            </div>
            <div className="text-center">
              <p className="text-6xl sm:text-7xl font-mono font-bold text-deep-brown dark:text-off-white" style={{ textShadow: '4px 4px 0 #CCFF00' }}>
                3
              </p>
              <p className="text-sm sm:text-base font-heading font-bold uppercase tracking-widest mt-2 text-deep-brown dark:text-off-white opacity-80">
                Subjects
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SUBJECTS SECTION - BOLD STYLE */}
      <section id="subjects-section" className="py-20 bg-deep-brown dark:bg-off-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            <span className="font-mono text-sm font-bold uppercase tracking-widest text-neon-cyan block mb-4">
              // Discipline Disponibile
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black mb-6 uppercase leading-tight tracking-tighter text-off-white dark:text-deep-brown">
              Alege Domeniul Tău
            </h2>
            <p className="text-lg sm:text-xl font-body text-off-white/80 dark:text-deep-brown/70">
              Trei lumi de explorat. Sute de provocări de depășit.
            </p>
          </div>

          {loadingSubjects ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-neon-cyan"></div>
            </div>
          ) : subjects.length === 0 ? (
            <p className="text-center text-off-white/70 dark:text-deep-brown/70">Nu există materii disponibile momentan.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {subjects.map((subject, index) => {
                // Assign neon colors to subjects
                const neonColors = ['#FF0080', '#00FFFF', '#CCFF00'];
                const neonColor = neonColors[index % neonColors.length];

                return (
                  <div
                    key={subject.id}
                    onClick={() => handleSubjectClick(subject.slug)}
                    className="bg-off-white dark:bg-warm-brown border-6 border-deep-brown dark:border-off-white p-8 cursor-pointer transition-all duration-200 hover:-translate-x-2 hover:-translate-y-2 min-h-[400px] flex flex-col group"
                    style={{
                      boxShadow: `0 0 0 0 ${neonColor}`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `8px 8px 0 ${neonColor}`;
                      e.currentTarget.style.borderColor = neonColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = `0 0 0 0 ${neonColor}`;
                      e.currentTarget.style.borderColor = '';
                    }}
                  >
                    {/* Top accent bar */}
                    <div
                      className="h-2 -mx-8 -mt-8 mb-6"
                      style={{ backgroundColor: neonColor }}
                    ></div>

                    {/* Icon */}
                    <div className="text-7xl mb-6 filter grayscale group-hover:grayscale-0 transition-all duration-300">
                      {subject.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-3xl sm:text-4xl font-heading font-black mb-4 uppercase tracking-tight text-deep-brown dark:text-off-white">
                      {subject.name}
                    </h3>

                    {/* Description */}
                    <p className="text-base sm:text-lg font-body mb-auto text-deep-brown/70 dark:text-off-white/70 leading-relaxed">
                      {subject.description}
                    </p>

                    {/* Meta */}
                    <div className="flex justify-between items-center mt-8 pt-6 border-t-3 border-deep-brown dark:border-off-white">
                      <span className="font-mono text-sm font-bold uppercase text-deep-brown dark:text-off-white">
                        {subject.totalThemes} Teme
                      </span>
                      <div
                        className="w-16 h-16 bg-deep-brown dark:bg-off-white flex items-center justify-center text-off-white dark:text-deep-brown text-3xl font-black transition-transform group-hover:translate-x-2 group-hover:-translate-y-2"
                        style={{
                          transition: 'all 0.3s ease'
                        }}
                      >
                        →
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* MATEMATICĂ CARD - COMING SOON */}
              <div className="relative bg-sand dark:bg-warm-brown border-6 border-dashed border-warm-brown dark:border-sand p-8 min-h-[400px] flex flex-col opacity-60">
                {/* Coming Soon Badge */}
                <div 
                  className="absolute top-8 right-8 bg-[#FF6B00] text-off-white px-4 py-2 font-heading font-black text-xs uppercase tracking-widest"
                  style={{ transform: 'rotate(5deg)' }}
                >
                  Coming Soon
                </div>

                {/* Top accent bar */}
                <div
                  className="h-2 -mx-8 -mt-8 mb-6 bg-[#B026FF]"
                ></div>

                {/* Icon */}
                <div className="text-7xl mb-6 filter grayscale">
                  🔢
                </div>

                {/* Title */}
                <h3 className="text-3xl sm:text-4xl font-heading font-black mb-4 uppercase tracking-tight text-deep-brown dark:text-off-white">
                  Matematică
                </h3>

                {/* Description */}
                <p className="text-base sm:text-lg font-body mb-auto text-deep-brown/70 dark:text-off-white/70 leading-relaxed">
                  Algebră, geometrie, analiză. Rezolvă probleme și dezvoltă gândirea logică.
                </p>

                {/* Meta */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t-3 border-deep-brown dark:border-off-white">
                  <span className="font-mono text-sm font-bold uppercase text-deep-brown dark:text-off-white">
                    În curând
                  </span>
                  <div className="w-16 h-16 bg-deep-brown dark:bg-off-white flex items-center justify-center text-off-white dark:text-deep-brown text-3xl font-black">
                    →
                  </div>
                </div>
              </div>

              {/* LIMBA ROMÂNĂ CARD - COMING SOON */}
              <div className="relative bg-sand dark:bg-warm-brown border-6 border-dashed border-warm-brown dark:border-sand p-8 min-h-[400px] flex flex-col opacity-60">
                {/* Coming Soon Badge */}
                <div 
                  className="absolute top-8 right-8 bg-[#FF6B00] text-off-white px-4 py-2 font-heading font-black text-xs uppercase tracking-widest"
                  style={{ transform: 'rotate(5deg)' }}
                >
                  Coming Soon
                </div>

                {/* Top accent bar */}
                <div
                  className="h-2 -mx-8 -mt-8 mb-6 bg-[#0066FF]"
                ></div>

                {/* Icon */}
                <div className="text-7xl mb-6 filter grayscale">
                  🗣️
                </div>

                {/* Title */}
                <h3 className="text-3xl sm:text-4xl font-heading font-black mb-4 uppercase tracking-tight text-deep-brown dark:text-off-white">
                  Limba Română
                </h3>

                {/* Description */}
                <p className="text-base sm:text-lg font-body mb-auto text-deep-brown/70 dark:text-off-white/70 leading-relaxed">
                  Gramatică, vocabular, autori clasici. Îmbunătățește-ți abilitățile lingvistice.
                </p>

                {/* Meta */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t-3 border-deep-brown dark:border-off-white">
                  <span className="font-mono text-sm font-bold uppercase text-deep-brown dark:text-off-white">
                    În curând
                  </span>
                  <div className="w-16 h-16 bg-deep-brown dark:bg-off-white flex items-center justify-center text-off-white dark:text-deep-brown text-3xl font-black">
                    →
                  </div>
                </div>
              </div>

              {/* MAI MULTE CARD */}
              <div
                onClick={() => navigate('/subjects')}
                className="bg-off-white dark:bg-warm-brown border-6 border-deep-brown dark:border-off-white p-8 cursor-pointer transition-all duration-200 hover:-translate-x-2 hover:-translate-y-2 min-h-[400px] flex flex-col group"
                style={{
                  boxShadow: `0 0 0 0 #FF6B00`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `8px 8px 0 #FF6B00`;
                  e.currentTarget.style.borderColor = '#FF6B00';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 0 0 #FF6B00`;
                  e.currentTarget.style.borderColor = '';
                }}
              >
                {/* Top accent bar */}
                <div
                  className="h-2 -mx-8 -mt-8 mb-6"
                  style={{ backgroundColor: '#FF6B00' }}
                ></div>

                {/* Icon */}
                <div className="text-7xl mb-6 filter grayscale group-hover:grayscale-0 transition-all duration-300">
                  ➕
                </div>

                {/* Title */}
                <h3 className="text-3xl sm:text-4xl font-heading font-black mb-4 uppercase tracking-tight text-deep-brown dark:text-off-white">
                  Mai Multe
                </h3>

                {/* Description */}
                <p className="text-base sm:text-lg font-body mb-auto text-deep-brown/70 dark:text-off-white/70 leading-relaxed">
                  Explorează mai multe discipline și descoperă noi provocări educaționale.
                </p>

                {/* Meta */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t-3 border-deep-brown dark:border-off-white">
                  <span className="font-mono text-sm font-bold uppercase text-deep-brown dark:text-off-white">
                    Descoperă
                  </span>
                  <div
                    className="w-16 h-16 bg-deep-brown dark:bg-off-white flex items-center justify-center text-off-white dark:text-deep-brown text-3xl font-black transition-transform group-hover:translate-x-2 group-hover:-translate-y-2"
                    style={{
                      transition: 'all 0.3s ease'
                    }}
                  >
                    →
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FEATURES SECTION - BOLD STYLE WITH INDIVIDUAL BROWN BORDERS */}
      <section className="py-20 bg-cream dark:bg-deep-brown">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            <span className="font-mono text-sm font-bold uppercase tracking-widest text-neon-pink block mb-4">
              // De Ce QuizzFun?
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black mb-6 uppercase leading-tight tracking-tighter text-deep-brown dark:text-off-white">
              Game Features
            </h2>
          </div>

          {/* Features Grid - Brutalist 2x2 WITH BROWN BORDERS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-off-white dark:bg-warm-brown p-8 sm:p-12 border-4 border-[#8B5A3C] hover:bg-deep-brown hover:dark:bg-off-white hover:text-off-white hover:dark:text-deep-brown transition-all duration-200 group">
              <div className="text-6xl mb-6 filter grayscale group-hover:grayscale-0 transition-all duration-300">🎯</div>
              <h3 className="text-2xl sm:text-3xl font-heading font-black mb-4 uppercase tracking-tight">Unlimited</h3>
              <p className="text-base sm:text-lg font-body opacity-80 leading-relaxed">
                Joacă cât vrei, când vrei. Zero limite, maximum impact.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-off-white dark:bg-warm-brown p-8 sm:p-12 border-4 border-[#8B5A3C] hover:bg-deep-brown hover:dark:bg-off-white hover:text-off-white hover:dark:text-deep-brown transition-all duration-200 group">
              <div className="text-6xl mb-6 filter grayscale group-hover:grayscale-0 transition-all duration-300">📊</div>
              <h3 className="text-2xl sm:text-3xl font-heading font-black mb-4 uppercase tracking-tight">Progress</h3>
              <p className="text-base sm:text-lg font-body opacity-80 leading-relaxed">
                Tracking complet. Vezi-ți evoluția și atingi obiective noi.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-off-white dark:bg-warm-brown p-8 sm:p-12 border-4 border-[#8B5A3C] hover:bg-deep-brown hover:dark:bg-off-white hover:text-off-white hover:dark:text-deep-brown transition-all duration-200 group">
              <div className="text-6xl mb-6 filter grayscale group-hover:grayscale-0 transition-all duration-300">🏆</div>
              <h3 className="text-2xl sm:text-3xl font-heading font-black mb-4 uppercase tracking-tight">Rankings</h3>
              <p className="text-base sm:text-lg font-body opacity-80 leading-relaxed">
                Competiție live. Compară-te cu cei mai buni jucători.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-off-white dark:bg-warm-brown p-8 sm:p-12 border-4 border-[#8B5A3C] hover:bg-deep-brown hover:dark:bg-off-white hover:text-off-white hover:dark:text-deep-brown transition-all duration-200 group">
              <div className="text-6xl mb-6 filter grayscale group-hover:grayscale-0 transition-all duration-300">⚡</div>
              <h3 className="text-2xl sm:text-3xl font-heading font-black mb-4 uppercase tracking-tight">Instant</h3>
              <p className="text-base sm:text-lg font-body opacity-80 leading-relaxed">
                Feedback imediat cu explicații detaliate pentru fiecare răspuns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL - BOLD STYLE WITH BORDER + ARROW */}
      <section className="bg-deep-brown dark:bg-off-white py-20 text-center border-t-6 border-neon-pink">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black mb-6 uppercase leading-tight tracking-tighter text-off-white dark:text-deep-brown">
            Gata să înveți jucându-te? 🚀
          </h2>
          <p className="text-xl sm:text-2xl mb-10 font-body font-semibold text-off-white/90 dark:text-deep-brown/90">
            100% gratuit • Fără reclame • Distractiv • Educational
          </p>

          {/* Buton CTA cu border hover + săgeată (ca Start Now) */}
          <button
            onClick={user ? scrollToSubjects : onPlayNow}
            className="group bg-off-white dark:bg-deep-brown text-deep-brown dark:text-off-white border-6 border-off-white dark:border-deep-brown px-12 sm:px-16 py-5 font-heading font-black text-xl sm:text-2xl uppercase tracking-wide hover:bg-[#39FF14] hover:text-deep-brown hover:border-deep-brown hover:-translate-x-2 hover:-translate-y-2 hover:shadow-brutal-lg hover:shadow-off-white dark:hover:shadow-deep-brown transition-all duration-150 inline-flex items-center gap-3"
          >
            {user ? '📚 Alege Materia' : '🎯 Începe Acum'}
            <span className="inline-block transition-transform group-hover:translate-x-2">→</span>
          </button>
        </div>
      </section>

      {/* FOOTER - BOLD STYLE */}
      <footer className="bg-deep-brown dark:bg-off-white py-12 border-t-6 border-neon-pink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-heading font-black text-2xl uppercase text-off-white dark:text-deep-brown mb-4">
                QUIZZFUN
              </h3>
              <p className="text-sm font-body text-off-white/80 dark:text-deep-brown/80">
                Educație prin joc. Învață istorie, geografie și biologie distractiv.
              </p>
            </div>

            <div>
              <h4 className="font-heading font-bold uppercase tracking-wide text-off-white dark:text-deep-brown mb-3">Materii</h4>
              <ul className="space-y-2 text-sm font-body">
                <li>
                  <button
                    onClick={scrollToSubjects}
                    className="text-off-white/80 dark:text-deep-brown/80 hover:text-neon-cyan transition-colors"
                  >
                    Istorie
                  </button>
                </li>
                <li>
                  <button
                    onClick={scrollToSubjects}
                    className="text-off-white/80 dark:text-deep-brown/80 hover:text-neon-cyan transition-colors"
                  >
                    Geografie
                  </button>
                </li>
                <li>
                  <button
                    onClick={scrollToSubjects}
                    className="text-off-white/80 dark:text-deep-brown/80 hover:text-neon-cyan transition-colors"
                  >
                    Biologie
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-bold uppercase tracking-wide text-off-white dark:text-deep-brown mb-3">Legal</h4>
              <ul className="space-y-2 text-sm font-body">
                <li>
                  <a
                    href="/privacy"
                    className="text-off-white/80 dark:text-deep-brown/80 hover:text-neon-cyan transition-colors"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="text-off-white/80 dark:text-deep-brown/80 hover:text-neon-cyan transition-colors"
                  >
                    Terms
                  </a>
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

export default LandingPage;