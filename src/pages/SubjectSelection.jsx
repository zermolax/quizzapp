/**
 * SubjectSelection.jsx - All Disciplines Page
 * Bold brutalist design for subjects overview
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import './SubjectSelection.css';

export function SubjectSelection() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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
        setLoading(true);
        setError(null);

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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSubjects();
  }, []);

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
      'matematica': 'matematica',
      'fizica': 'fizica',
      'chimie': 'chimie'
    };
    return classMap[slug] || 'default';
  };

  /**
   * Get badge for subject
   */
  const getSubjectBadge = (slug) => {
    if (slug === 'istorie') return { text: '🔥 Popular', type: 'status' };
    if (slug === 'geografie') return { text: '✨ Nou', type: 'status' };
    return null;
  };

  /**
   * Coming soon disciplines
   */
  const comingSoonDisciplines = [
    {
      id: 'matematica-cs',
      slug: 'matematica',
      name: 'Matematică',
      icon: '🔢',
      description: 'Algebră, geometrie, analiză. Rezolvă probleme și dezvoltă gândirea logică.',
      totalThemes: 8,
      totalQuestions: 100
    },
    {
      id: 'fizica-cs',
      slug: 'fizica',
      name: 'Fizică',
      icon: '⚛️',
      description: 'Mecanică, termodinamică, electromagnetism. Înțelege legile care guvernează universul.',
      totalThemes: 9,
      totalQuestions: 110
    },
    {
      id: 'chimie-cs',
      slug: 'chimie',
      name: 'Chimie',
      icon: '🧪',
      description: 'Elemente, reacții, structuri moleculare. Descoperă lumea substanțelor.',
      totalThemes: 7,
      totalQuestions: 90
    },
    {
      id: 'romana-cs',
      slug: 'romana',
      name: 'Limba Română',
      icon: '📖',
      description: 'Gramatică, vocabular, autori clasici. Îmbunătățește-ți abilitățile lingvistice.',
      totalThemes: 6,
      totalQuestions: 80
    },
    {
      id: 'engleza-cs',
      slug: 'engleza',
      name: 'Limba Engleză',
      icon: '🇬🇧',
      description: 'Vocabular, gramatică, conversație. Avansează-ți cunoștințele de engleză.',
      totalThemes: 8,
      totalQuestions: 100
    },
    {
      id: 'franceza-cs',
      slug: 'franceza',
      name: 'Limba Franceză',
      icon: '🇫🇷',
      description: 'Limba franceză pentru începători și avansați. Cultură și comunicare.',
      totalThemes: 7,
      totalQuestions: 85
    },
    {
      id: 'tic-cs',
      slug: 'tic',
      name: 'TIC',
      icon: '💻',
      description: 'Tehnologia informației și comunicațiilor. Programare, algoritmi, baze de date.',
      totalThemes: 10,
      totalQuestions: 120
    },
    {
      id: 'stiinte-sociale-cs',
      slug: 'stiinte-sociale',
      name: 'Științe Sociale',
      icon: '🌐',
      description: 'Sociologie, psihologie, economie. Înțelege societatea și comportamentul uman.',
      totalThemes: 6,
      totalQuestions: 75
    },
    {
      id: 'religie-cs',
      slug: 'religie',
      name: 'Religie',
      icon: '✝️',
      description: 'Religii mondiale, etică, valori morale. Cultură religioasă și spiritualitate.',
      totalThemes: 5,
      totalQuestions: 60
    },
    {
      id: 'istoria-religiilor-cs',
      slug: 'istoria-religiilor',
      name: 'Istoria Religiilor',
      icon: '🕉️',
      description: 'Evoluția religiilor de-a lungul timpului. Credințe și tradiții spirituale.',
      totalThemes: 5,
      totalQuestions: 65
    },
    {
      id: 'istoria-artei-cs',
      slug: 'istoria-artei',
      name: 'Istoria Artei',
      icon: '🎨',
      description: 'Pictură, sculptură, arhitectură. De la antichitate până în contemporary.',
      totalThemes: 6,
      totalQuestions: 70
    }
  ];

  /**
   * Handle subject click
   */
  const handleSubjectClick = (subjectSlug) => {
    navigate(`/subjects/${subjectSlug}`);
  };

  /**
   * Calculate total stats
   */
  const totalDisciplines = subjects.length + comingSoonDisciplines.length;
  const totalQuestions = subjects.reduce((sum, s) => sum + (s.totalQuestions || 0), 0) +
    comingSoonDisciplines.reduce((sum, d) => sum + d.totalQuestions, 0);
  const totalThemes = subjects.reduce((sum, s) => sum + (s.totalThemes || 0), 0) +
    comingSoonDisciplines.reduce((sum, d) => sum + d.totalThemes, 0);

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="subjects-page-wrapper">
      {/* NAVIGATION */}
      <nav className="subjects-nav">
        <div className="subjects-nav-inner">
          <div className="subjects-nav-left">
            <button
              onClick={() => navigate('/')}
              className="subjects-btn-back"
            >
              ← Back
            </button>
            <a href="/" className="subjects-logo">
              Quizz<span>Fun</span>
            </a>
          </div>

          <div className="subjects-nav-actions">
            <button
              onClick={toggleTheme}
              className="subjects-theme-toggle"
              aria-label="Toggle dark mode"
            >
              <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="subjects-hero">
        <div className="subjects-hero-content">
          <div className="subjects-breadcrumb">
            <a href="/">Home</a> / <span>Toate Disciplinele</span>
          </div>

          <div className="subjects-hero-label">// Explore All Subjects</div>
          <h1 className="subjects-hero-title">Toate Disciplinele</h1>
          <p className="subjects-hero-description">
            De la istorie la matematică, de la geografie la fizică. Alege domeniul care te pasionează și începe să înveți jucându-te.
          </p>

          <div className="subjects-stats-row">
            <div className="subjects-stat-box">
              <div className="subjects-stat-icon">📚</div>
              <div className="subjects-stat-info">
                <div className="subjects-stat-value">{totalDisciplines}</div>
                <div className="subjects-stat-label">Discipline</div>
              </div>
            </div>
            <div className="subjects-stat-box">
              <div className="subjects-stat-icon">❓</div>
              <div className="subjects-stat-info">
                <div className="subjects-stat-value">{totalQuestions}+</div>
                <div className="subjects-stat-label">Întrebări</div>
              </div>
            </div>
            <div className="subjects-stat-box">
              <div className="subjects-stat-icon">🎯</div>
              <div className="subjects-stat-info">
                <div className="subjects-stat-value">{totalThemes}</div>
                <div className="subjects-stat-label">Tematici</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DISCIPLINES SECTION */}
      <section className="subjects-disciplines-section">
        <div className="subjects-section-header">
          <span className="subjects-section-label">// Disponibile Acum</span>
          <h2 className="subjects-section-title">Discipline Active</h2>
          <p className="subjects-section-subtitle">Alege o disciplină și începe aventura educațională</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--neon-cyan)' }}></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Eroare: {error}</p>
          </div>
        ) : (
          <div className="subjects-disciplines-grid">
            {/* Available subjects */}
            {subjects.map((subject) => {
              const badge = getSubjectBadge(subject.slug);
              return (
                <div
                  key={subject.id}
                  onClick={() => handleSubjectClick(subject.slug)}
                  className={`subjects-discipline-card available ${getSubjectClassName(subject.slug)}`}
                >
                  {badge && (
                    <div className="subjects-status-badge">{badge.text}</div>
                  )}
                  <span className="subjects-discipline-icon">{subject.icon}</span>
                  <h3>{subject.name}</h3>
                  <p className="subjects-discipline-description">
                    {subject.description}
                  </p>
                  <div className="subjects-discipline-meta">
                    <div className="subjects-discipline-stats">
                      <div className="subjects-stat-item">{subject.totalThemes} Tematici</div>
                      <div className="subjects-stat-item">{subject.totalQuestions} Întrebări</div>
                    </div>
                    <div className="subjects-discipline-arrow">→</div>
                  </div>
                </div>
              );
            })}

            {/* Coming soon subjects */}
            {comingSoonDisciplines.map((discipline) => (
              <div
                key={discipline.id}
                className={`subjects-discipline-card coming-soon ${getSubjectClassName(discipline.slug)}`}
              >
                <div className="subjects-coming-soon-badge">Coming Soon</div>
                <span className="subjects-discipline-icon">{discipline.icon}</span>
                <h3>{discipline.name}</h3>
                <p className="subjects-discipline-description">
                  {discipline.description}
                </p>
                <div className="subjects-discipline-meta">
                  <div className="subjects-discipline-stats">
                    <div className="subjects-stat-item">{discipline.totalThemes} Tematici</div>
                    <div className="subjects-stat-item">{discipline.totalQuestions} Întrebări</div>
                  </div>
                  <div className="subjects-discipline-arrow">→</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA SECTION */}
      <section className="subjects-cta-section">
        <div className="subjects-cta-content">
          <h2 className="subjects-cta-title">Vrei o disciplină nouă?</h2>
          <p className="subjects-cta-description">
            Sugerează-ne ce discipline ți-ar plăcea să vezi pe platformă. Feedback-ul tău ne ajută să creștem!
          </p>
          <button
            className="subjects-btn-primary"
            onClick={() => {
              alert('Funcție în curând! Te rugăm să ne contactezi la perviat@gmail.com');
            }}
          >
            Trimite Sugestie
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="subjects-footer">
        <div className="subjects-footer-content">
          <div className="subjects-footer-logo">QUIZZFUN</div>

          <div className="subjects-footer-links">
            <a href="#">About</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="#">Contact</a>
          </div>

          <div className="subjects-footer-copyright">
            © 2025 QuizzFun — All Rights Reserved
          </div>
        </div>
      </footer>
    </div>
  );
}

export default SubjectSelection;
