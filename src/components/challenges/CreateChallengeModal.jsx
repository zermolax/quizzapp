/**
 * CreateChallengeModal.jsx
 *
 * Modal pentru crearea unui 1v1 Challenge
 * User alege difficulty + subject + theme (optional)
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

      setSubjects(subjectsData);

      // Auto-select first subject
      if (subjectsData.length > 0) {
        setSelectedSubject(subjectsData[0]);
      }

    } catch (error) {
      console.error('Error loading subjects:', error);
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

      setThemes(themesData);
      setSelectedTheme(null); // Reset theme selection

    } catch (error) {
      console.error('Error loading themes:', error);
    }
  }

  async function handleCreateChallenge() {
    if (!selectedSubject) {
      alert('Please select a subject');
      return;
    }

    setLoading(true);

    try {
      // Fetch 12 random questions
      let questions = [];

      if (selectedTheme) {
        // Get questions from specific theme
        const allQuestions = await getQuestionsByTheme(selectedSubject.id, selectedTheme.id);
        const filteredQuestions = allQuestions.filter(q => q.difficulty === difficulty);

        if (filteredQuestions.length < 12) {
          alert(`Not enough ${difficulty} questions for this theme. Found ${filteredQuestions.length}/12.`);
          setLoading(false);
          return;
        }

        // Shuffle and take 12
        questions = filteredQuestions.sort(() => Math.random() - 0.5).slice(0, 12);

      } else {
        // Get questions from entire subject
        const questionsRef = collection(db, 'questions');
        const q = query(
          questionsRef,
          where('subjectId', '==', selectedSubject.id),
          where('difficulty', '==', difficulty)
        );
        const snapshot = await getDocs(q);

        const allQuestions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        if (allQuestions.length < 12) {
          alert(`Not enough questions. Found ${allQuestions.length}/12.`);
          setLoading(false);
          return;
        }

        questions = allQuestions.sort(() => Math.random() - 0.5).slice(0, 12);
      }

      // Create challenge
      const result = await createChallenge(user.uid, {
        difficulty,
        subjectId: selectedSubject.id,
        themeId: selectedTheme?.id || null,
        questions
      });

      setChallengeId(result.id);
      setChallengeLink(result.link);
      setStep(2); // Move to share step

    } catch (error) {
      console.error('Error creating challenge:', error);
      alert('Failed to create challenge');
    } finally {
      setLoading(false);
    }
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(challengeLink);
    alert('Link copied to clipboard!');
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: '⚔️ Quiz Challenge',
        text: `I challenge you to a quiz battle! Can you beat my score?`,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden transform animate-scaleIn max-h-[90vh] overflow-y-auto">

        {step === 1 && (
          <>
            {/* Header */}
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 text-white relative">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl font-bold"
              >
                ×
              </button>

              <div className="text-center">
                <div className="text-5xl mb-3">⚔️</div>
                <h2 className="text-2xl font-bold">Challenge a Friend</h2>
                <p className="text-white/90 text-sm mt-1">Create a 1v1 quiz battle</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Difficulty */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Choose Difficulty
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['easy', 'medium', 'hard'].map(level => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`
                        py-3 rounded-xl font-semibold text-sm transition
                        ${difficulty === level
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                    >
                      {level === 'easy' && '😊'} {level === 'medium' && '🤔'} {level === 'hard' && '🔥'}
                      <br />
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Choose Subject
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {subjects.map(subject => (
                    <button
                      key={subject.id}
                      onClick={() => setSelectedSubject(subject)}
                      className={`
                        p-4 rounded-xl font-semibold text-sm transition text-left
                        ${selectedSubject?.id === subject.id
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                    >
                      <div className="text-2xl mb-1">{subject.icon}</div>
                      <div className="text-xs">{subject.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme (optional) */}
              {themes.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Choose Theme (Optional)
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                    <button
                      onClick={() => setSelectedTheme(null)}
                      className={`
                        p-3 rounded-xl font-semibold text-xs transition
                        ${selectedTheme === null
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                    >
                      All Themes
                    </button>
                    {themes.map(theme => (
                      <button
                        key={theme.id}
                        onClick={() => setSelectedTheme(theme)}
                        className={`
                          p-3 rounded-xl font-semibold text-xs transition text-left
                          ${selectedTheme?.id === theme.id
                            ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }
                        `}
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
                className={`
                  w-full py-4 rounded-xl font-bold text-lg transition
                  ${loading || !selectedSubject
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:shadow-lg transform hover:scale-105'
                  }
                `}
              >
                {loading ? '⚙️ Creating...' : '⚔️ Create Challenge'}
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            {/* Success Header */}
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 text-white text-center">
              <div className="text-6xl mb-3">🎉</div>
              <h2 className="text-2xl font-bold">Challenge Created!</h2>
              <p className="text-white/90 text-sm mt-1">Share this link with your friends</p>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Link */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Challenge Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={challengeLink}
                    readOnly
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-800 rounded-xl text-sm font-mono"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
                  >
                    📋 Copy
                  </button>
                </div>
              </div>

              {/* Share buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleShare}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition"
                >
                  📱 Share Link
                </button>

                <button
                  onClick={handlePlayNow}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition"
                >
                  ▶️ Play Now
                </button>

                <button
                  onClick={handleClose}
                  className="w-full py-3 text-gray-600 rounded-xl font-medium hover:bg-gray-100 transition"
                >
                  Close
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
