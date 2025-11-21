/**
 * CreateChallengeModal.jsx
 *
 * Modal pentru crearea unui 1v1 Challenge
 * User alege difficulty + subject + theme (optional)
 * REDESIGNED: Bold/Brutalist + Română + Better Error Handling
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { createChallenge } from '../../services/challengeService';
import { getQuestionsByTheme } from '../../services/quizService';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../services/firebase';

export function CreateChallengeModal({ isOpen, onClose }) {
  const { user } = useAuth();

  const [difficulty, setDifficulty] = useState('medium');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: config, 2: share link

  const [challengeLink, setChallengeLink] = useState('');
  const [challengeId, setChallengeId] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadSubjects();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedSubject) {
      loadThemes();
    }
  }, [selectedSubject]);

  async function loadSubjects() {
    try {
      const subjectsRef = collection(db, 'subjects');
      const snapshot = await getDocs(subjectsRef);

      const subjectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log('📚 Subjects loaded:', subjectsData);

      setSubjects(subjectsData);

      // Auto-select first subject
      if (subjectsData.length > 0) {
        setSelectedSubject(subjectsData[0]);
      }

    } catch (error) {
      console.error('Error loading subjects:', error);
      alert('Eroare la încărcarea disciplinelor');
    }
  }

  async function loadThemes() {
    try {
      const themesRef = collection(db, 'themes');
      const q = query(themesRef, where('subjectId', '==', selectedSubject.id));
      const snapshot = await getDocs(q);

      const themesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log('📖 Themes loaded:', themesData);

      setThemes(themesData);
      setSelectedTheme(null); // Reset theme selection

    } catch (error) {
      console.error('Error loading themes:', error);
      alert('Eroare la încărcarea temelor');
    }
  }

  async function handleCreateChallenge() {
    if (!selectedSubject) {
      alert('Te rog selectează o disciplină');
      return;
    }

    setLoading(true);

    try {
      console.log('🎯 Creating challenge with:', {
        difficulty,
        subjectId: selectedSubject.id,
        themeId: selectedTheme?.id
      });

      // Fetch 12 random questions
      let questions = [];

      if (selectedTheme) {
        // Get questions from specific theme
        console.log('📝 Fetching questions for theme:', selectedTheme.id);
        const allQuestions = await getQuestionsByTheme(selectedSubject.id, selectedTheme.id);
        console.log('📦 All questions from theme:', allQuestions.length);

        const filteredQuestions = allQuestions.filter(q => q.difficulty === difficulty);
        console.log(`📦 Filtered ${difficulty} questions:`, filteredQuestions.length);

        if (filteredQuestions.length < 12) {
          alert(`Nu există suficiente întrebări de dificultate ${difficulty} pentru această temă. Găsite: ${filteredQuestions.length}/12. Încearcă o altă temă sau selectează "Toate Temele".`);
          setLoading(false);
          return;
        }

        // Shuffle and take 12
        questions = filteredQuestions.sort(() => Math.random() - 0.5).slice(0, 12);

      } else {
        // Get questions from entire subject
        console.log('📝 Fetching questions for entire subject:', selectedSubject.id);
        const questionsRef = collection(db, 'questions');
        const q = query(
          questionsRef,
          where('subjectId', '==', selectedSubject.id),
          where('difficulty', '==', difficulty)
        );
        const snapshot = await getDocs(q);

        console.log(`📦 Found ${snapshot.size} questions for subject ${selectedSubject.id} with difficulty ${difficulty}`);

        const allQuestions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        if (allQuestions.length < 12) {
          alert(`Nu există suficiente întrebări. Găsite: ${allQuestions.length}/12. Încearcă o altă dificultate.`);
          setLoading(false);
          return;
        }

        questions = allQuestions.sort(() => Math.random() - 0.5).slice(0, 12);
      }

      console.log('✅ Selected 12 questions:', questions);

      // Create challenge
      console.log('🚀 Creating challenge in Firestore...');
      const result = await createChallenge(user.uid, {
        difficulty,
        subjectId: selectedSubject.id,
        themeId: selectedTheme?.id || null,
        questions
      });

      console.log('✅ Challenge created successfully:', result);

      setChallengeId(result.id);
      setChallengeLink(result.link);
      setStep(2); // Move to share step

    } catch (error) {
      console.error('❌ Error creating challenge:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });

      if (error.message.includes('permission') || error.message.includes('PERMISSION_DENIED')) {
        alert('Eroare de permisiuni Firestore. Verifică Firebase Rules pentru collection "challenges".');
      } else {
        alert(`Eroare la crearea provocării: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(challengeLink);
    alert('Link copiat în clipboard!');
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: '⚔️ Provocare Quiz',
        text: `Te provoc la un duel de quiz! Poți să mă învingi?`,
        url: challengeLink
      }).catch(err => console.log('Error sharing:', err));
    } else {
      handleCopyLink();
    }
  }

  function handlePlayNow() {
    window.location.href = challengeLink;
  }

  function handleClose() {
    setStep(1);
    setDifficulty('medium');
    setSelectedSubject(null);
    setSelectedTheme(null);
    setChallengeLink('');
    setChallengeId('');
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: 'var(--off-white)',
        border: '6px solid var(--deep-brown)',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>

        {step === 1 && (
          <>
            {/* Header */}
            <div style={{
              background: 'var(--neon-pink)',
              padding: '2rem',
              borderBottom: '6px solid var(--deep-brown)',
              position: 'relative'
            }}>
              <button
                onClick={handleClose}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'var(--deep-brown)',
                  color: 'var(--off-white)',
                  border: 'none',
                  width: '2.5rem',
                  height: '2.5rem',
                  fontSize: '1.5rem',
                  fontWeight: 900,
                  cursor: 'pointer'
                }}
              >
                ×
              </button>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚔️</div>
                <h2 style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '2rem',
                  fontWeight: 900,
                  color: 'var(--deep-brown)',
                  textTransform: 'uppercase',
                  margin: '0 0 0.5rem'
                }}>
                  Provoacă un Prieten
                </h2>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '1rem',
                  color: 'var(--deep-brown)',
                  opacity: 0.8,
                  margin: 0
                }}>
                  Creează un duel 1v1
                </p>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '2rem' }}>
              {/* Difficulty */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--deep-brown)',
                  marginBottom: '1rem',
                  textTransform: 'uppercase'
                }}>
                  Alege Dificultatea
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                  {[
                    { value: 'easy', emoji: '😊', label: 'Ușor', color: 'var(--neon-green)' },
                    { value: 'medium', emoji: '🤔', label: 'Mediu', color: 'var(--neon-orange)' },
                    { value: 'hard', emoji: '🔥', label: 'Greu', color: 'var(--neon-pink)' }
                  ].map(level => (
                    <button
                      key={level.value}
                      onClick={() => setDifficulty(level.value)}
                      style={{
                        padding: '1rem',
                        background: difficulty === level.value ? level.color : 'var(--sand)',
                        border: `4px solid var(--deep-brown)`,
                        color: 'var(--deep-brown)',
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        transform: difficulty === level.value ? 'translate(-2px, -2px)' : 'none',
                        boxShadow: difficulty === level.value ? '4px 4px 0 var(--deep-brown)' : 'none'
                      }}
                    >
                      <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{level.emoji}</div>
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--deep-brown)',
                  marginBottom: '1rem',
                  textTransform: 'uppercase'
                }}>
                  Alege Disciplina
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                  {subjects.map(subject => (
                    <button
                      key={subject.id}
                      onClick={() => setSelectedSubject(subject)}
                      style={{
                        padding: '1rem',
                        background: selectedSubject?.id === subject.id ? 'var(--neon-cyan)' : 'var(--sand)',
                        border: `4px solid var(--deep-brown)`,
                        color: 'var(--deep-brown)',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                        transform: selectedSubject?.id === subject.id ? 'translate(-2px, -2px)' : 'none',
                        boxShadow: selectedSubject?.id === subject.id ? '4px 4px 0 var(--deep-brown)' : 'none'
                      }}
                    >
                      <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{subject.icon}</div>
                      <div style={{ fontSize: '0.75rem' }}>{subject.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme (optional) */}
              {themes.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{
                    display: 'block',
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--deep-brown)',
                    marginBottom: '1rem',
                    textTransform: 'uppercase'
                  }}>
                    Alege Tema (Opțional)
                  </label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '0.75rem',
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}>
                    <button
                      onClick={() => setSelectedTheme(null)}
                      style={{
                        padding: '0.75rem',
                        background: selectedTheme === null ? 'var(--neon-lime)' : 'var(--sand)',
                        border: `3px solid var(--deep-brown)`,
                        color: 'var(--deep-brown)',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        transform: selectedTheme === null ? 'translate(-2px, -2px)' : 'none',
                        boxShadow: selectedTheme === null ? '3px 3px 0 var(--deep-brown)' : 'none'
                      }}
                    >
                      Toate Temele
                    </button>
                    {themes.map(theme => (
                      <button
                        key={theme.id}
                        onClick={() => setSelectedTheme(theme)}
                        style={{
                          padding: '0.75rem',
                          background: selectedTheme?.id === theme.id ? 'var(--neon-lime)' : 'var(--sand)',
                          border: `3px solid var(--deep-brown)`,
                          color: 'var(--deep-brown)',
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s ease',
                          transform: selectedTheme?.id === theme.id ? 'translate(-2px, -2px)' : 'none',
                          boxShadow: selectedTheme?.id === theme.id ? '3px 3px 0 var(--deep-brown)' : 'none'
                        }}
                      >
                        {theme.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Create button */}
              <button
                onClick={handleCreateChallenge}
                disabled={loading || !selectedSubject}
                style={{
                  width: '100%',
                  padding: '1.25rem',
                  background: loading || !selectedSubject ? 'var(--warm-brown)' : 'var(--neon-pink)',
                  color: 'var(--deep-brown)',
                  border: '4px solid var(--deep-brown)',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 900,
                  fontSize: '1.125rem',
                  textTransform: 'uppercase',
                  cursor: loading || !selectedSubject ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => {
                  if (!loading && selectedSubject) {
                    e.currentTarget.style.transform = 'translate(-2px, -2px)';
                    e.currentTarget.style.boxShadow = '6px 6px 0 var(--deep-brown)';
                  }
                }}
                onMouseLeave={e => {
                  if (!loading && selectedSubject) {
                    e.currentTarget.style.transform = 'translate(0, 0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {loading ? '⚙️ Se creează...' : '⚔️ Creează Provocare'}
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            {/* Success Header */}
            <div style={{
              background: 'var(--neon-green)',
              padding: '2rem',
              borderBottom: '6px solid var(--deep-brown)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
              <h2 style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '2rem',
                fontWeight: 900,
                color: 'var(--deep-brown)',
                textTransform: 'uppercase',
                margin: '0 0 0.5rem'
              }}>
                Provocare Creată!
              </h2>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '1rem',
                color: 'var(--deep-brown)',
                opacity: 0.8,
                margin: 0
              }}>
                Distribuie acest link prietenilor tăi
              </p>
            </div>

            {/* Content */}
            <div style={{ padding: '2rem' }}>
              {/* Link */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: 'var(--deep-brown)',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase'
                }}>
                  Link Provocare
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={challengeLink}
                    readOnly
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'var(--sand)',
                      border: '3px solid var(--deep-brown)',
                      color: 'var(--deep-brown)',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '0.75rem'
                    }}
                  />
                  <button
                    onClick={handleCopyLink}
                    style={{
                      padding: '0.75rem 1rem',
                      background: 'var(--neon-cyan)',
                      border: '3px solid var(--deep-brown)',
                      color: 'var(--deep-brown)',
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    📋
                  </button>
                </div>
              </div>

              {/* Share buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  onClick={handleShare}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'var(--neon-cyan)',
                    border: '4px solid var(--deep-brown)',
                    color: 'var(--deep-brown)',
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 700,
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    cursor: 'pointer'
                  }}
                >
                  📱 Distribuie Link
                </button>

                <button
                  onClick={handlePlayNow}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'var(--neon-pink)',
                    border: '4px solid var(--deep-brown)',
                    color: 'var(--deep-brown)',
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 700,
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    cursor: 'pointer'
                  }}
                >
                  ▶️ Joacă Acum
                </button>

                <button
                  onClick={handleClose}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'var(--sand)',
                    border: '3px solid var(--warm-brown)',
                    color: 'var(--deep-brown)',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Închide
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CreateChallengeModal;
