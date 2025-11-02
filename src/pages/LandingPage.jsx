/**
 * LandingPage.jsx - REDESIGNED for Multi-Subject Architecture
 * With BOLD Brutalist Design
 *
 * Subjects sunt acum vizibili direct pe landing page
 * Flow: Landing → Click subject → Themes → Quiz (2 clickuri în loc de 3)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import './LandingPage.css';

export function LandingPage({ onPlayNow }) {

  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  /**
   * Apply theme to document
   */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  /**
   * Toggle theme
   */
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
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

  /**
   * Get subject class name for styling
   */
  const getSubjectClassName = (slug) => {
    const classMap = {
      'istorie': 'istorie',
      'geografie': 'geografie',
      'biologie': 'biologie',
      'romana': 'romana',
      'limba-romana': 'romana',
      'matematica': 'matematica'
    };
    return classMap[slug] || 'default';
  };

  /**
   * Coming soon subjects - hardcoded for now
   */
  const comingSoonSubjects = [
    {
      id: 'romana-coming-soon',
      name: 'Limba Română',
      slug: 'romana',
      icon: '📖',
      description: 'Gramatică, literatură și exprimare corectă în limba română.',
      comingSoon: true
    },
    {
      id: 'matematica-coming-soon',
      name: 'Matematică',
      slug: 'matematica',
      icon: '🔢',
      description: 'Aritmetică, algebră, geometrie și rezolvare de probleme.',
      comingSoon: true
    }
  ];

  return (
    <div className="landing-page-wrapper min-h-screen">

      {/* NAVIGATION */}
      <nav className="landing-nav">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center gap-2">
          {/* Logo - responsive */}
          <a href="/" className="landing-logo">
            Quizz<span className="landing-logo-highlight">Fun</span>
          </a>

          {/* Navigation buttons - responsive */}
          <div className="flex gap-2 md:gap-4 items-center">
            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              className="landing-theme-toggle"
              aria-label="Toggle dark mode"
            >
              <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
            </button>

            {user ? (
              <>
                {/* Profil - ascuns pe mobile extra small, iconită pe mobile */}
                <button
                  onClick={() => navigate('/profile')}
                  className="landing-btn-login"
                  title="Profil"
                >
                  <span className="hidden md:inline">Profil</span>
                  <span className="md:hidden">👤</span>
                </button>

                {/* Logout - text scurt pe mobile */}
                <button
                  onClick={logout}
                  className="landing-btn-login"
                  style={{ background: 'var(--error, #E63946)', borderColor: 'var(--error, #E63946)' }}
                >
                  <span className="hidden sm:inline">Logout</span>
                  <span className="sm:hidden">↩️</span>
                </button>
              </>
            ) : (
              <button
                onClick={onPlayNow || (() => {})}
                className="landing-btn-login"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <h1>
            <span className="landing-hero-title-line">Învață</span>{' '}
            <span className="landing-hero-highlight">Jucându-te</span>
          </h1>
          <p className="landing-hero-subtitle">
            Quiz-uri bold. Cunoștințe reale. Competiție intensă.
          </p>
          <button
            onClick={user ? scrollToSubjects : onPlayNow}
            className="landing-btn-primary"
          >
            {user ? 'Alege Materia' : 'Start Now'}
          </button>

          {/* Stats */}
          <div className="landing-hero-stats">
            <div className="landing-stat-item">
              <span className="landing-stat-number">500+</span>
              <span className="landing-stat-label">Questions</span>
            </div>
            <div className="landing-stat-item">
              <span className="landing-stat-number">10K+</span>
              <span className="landing-stat-label">Players</span>
            </div>
            <div className="landing-stat-item">
              <span className="landing-stat-number">3</span>
              <span className="landing-stat-label">Subjects</span>
            </div>
          </div>
        </div>
      </section>

      {/* SUBJECTS SECTION - NOU! */}
      <section id="subjects-section" className="landing-subjects">
        <div className="landing-section-header" style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto 5rem' }}>
          <span className="landing-section-label">// Discipline Disponibile</span>
          <h2>Alege Domeniul Tău</h2>
          <p className="landing-section-description">
            Trei lumi de explorat. Sute de provocări de depășit.
          </p>
        </div>

        {loadingSubjects ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--neon-cyan)' }}></div>
          </div>
        ) : (
          <div className="landing-subjects-grid">
            {/* Real subjects from Firestore */}
            {subjects.map((subject) => (
              <div
                key={subject.id}
                onClick={() => handleSubjectClick(subject.slug)}
                className={`landing-subject-card ${getSubjectClassName(subject.slug)}`}
                data-subject={getSubjectClassName(subject.slug)}
              >
                <span className="landing-subject-icon">{subject.icon}</span>
                <h3>{subject.name}</h3>
                <p className="landing-subject-description">
                  {subject.description}
                </p>
                <div className="landing-subject-meta">
                  <span className="landing-quiz-count">{subject.totalThemes} Teme</span>
                  <div className="landing-subject-arrow">→</div>
                </div>
              </div>
            ))}

            {/* Coming soon subjects */}
            {comingSoonSubjects.map((subject) => (
              <div
                key={subject.id}
                className={`landing-subject-card coming-soon ${getSubjectClassName(subject.slug)}`}
                data-subject={getSubjectClassName(subject.slug)}
              >
                <div className="landing-coming-soon-badge">În Curând</div>
                <span className="landing-subject-icon">{subject.icon}</span>
                <h3>{subject.name}</h3>
                <p className="landing-subject-description">
                  {subject.description}
                </p>
                <div className="landing-subject-meta">
                  <span className="landing-quiz-count">Coming Soon</span>
                  <div className="landing-subject-arrow">→</div>
                </div>
              </div>
            ))}

            {/* More subjects card */}
            <div
              onClick={() => navigate('/subjects')}
              className="landing-subject-card more-card"
            >
              <span className="landing-more-icon">+</span>
              <h3>Mai Multe</h3>
              <p className="landing-subject-description">
                Explorează mai multe discipline
              </p>
            </div>
          </div>
        )}
      </section>

      {/* FEATURES SECTION */}
      <section className="landing-features">
        <div className="landing-section-header" style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
          <span className="landing-section-label" style={{ color: 'var(--deep-brown)' }}>// De Ce QuizzFun?</span>
          <h2 style={{ color: 'var(--deep-brown)' }}>Game Features</h2>
        </div>

        <div className="landing-features-grid">
          {/* Feature 1 */}
          <div className="landing-feature-item">
            <span className="landing-feature-icon">🎯</span>
            <h3>Unlimited</h3>
            <p className="landing-feature-description">
              Joacă cât vrei, când vrei. Zero limite, maximum impact.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="landing-feature-item">
            <span className="landing-feature-icon">📊</span>
            <h3>Progress</h3>
            <p className="landing-feature-description">
              Tracking complet. Vezi-ți evoluția și atingi obiective noi.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="landing-feature-item">
            <span className="landing-feature-icon">🏆</span>
            <h3>Rankings</h3>
            <p className="landing-feature-description">
              Competiție live. Compară-te cu cei mai buni jucători.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="landing-feature-item">
            <span className="landing-feature-icon">⚡</span>
            <h3>Instant</h3>
            <p className="landing-feature-description">
              Feedback imediat cu explicații detaliate pentru fiecare răspuns.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-neutral-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-neutral-900">
            Cum Funcționează? 🎯
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-brand-blue text-white rounded-full w-20 h-20 flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Alegi Materia</h3>
              <p className="text-neutral-600">Istorie, Geografie sau Biologie</p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-brand-blue text-white rounded-full w-20 h-20 flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Selectezi Tema</h3>
              <p className="text-neutral-600">Alegi tema și dificultatea</p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-brand-blue text-white rounded-full w-20 h-20 flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Joci Quiz</h3>
              <p className="text-neutral-600">10 întrebări, colectezi puncte</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="landing-cta">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2>
            Gata să înveți jucându-te? 🚀
          </h2>
          <p className="text-xl mb-10 opacity-90">
            100% gratuit • Fără reclame • Distractiv • Educational
          </p>

          <button
            onClick={user ? scrollToSubjects : onPlayNow}
            className="landing-btn-cta"
          >
            {user ? 'Alege Materia' : 'Începe Acum'}
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="landing-footer-logo">QUIZZFUN</div>
              <p className="text-sm mt-4">Educație prin joc. Învață istorie, geografie și biologie distractiv.</p>
            </div>

            <div>
              <h4 className="font-bold mb-3">Materii</h4>
              <ul className="landing-footer-links space-y-2 text-sm">
                <li><button onClick={scrollToSubjects}>Istorie</button></li>
                <li><button onClick={scrollToSubjects}>Geografie</button></li>
                <li><button onClick={scrollToSubjects}>Biologie</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-3">Legal</h4>
              <ul className="landing-footer-links space-y-2 text-sm">
                <li><a href="/privacy">Privacy</a></li>
                <li><a href="/terms">Terms</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-3">Contact</h4>
              <p className="text-sm">📧 perviat@gmail.com</p>
            </div>
          </div>

          <hr style={{ borderColor: 'rgba(255, 255, 255, 0.2)', borderWidth: '3px', marginBottom: '3rem', marginTop: '3rem' }} />

          <div className="landing-footer-copyright text-center">
            <p>&copy; 2025 QuizzFun — All Rights Reserved</p>
            <p className="mt-2">Created by <strong>Ghergheluca Eduard</strong></p>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default LandingPage;
