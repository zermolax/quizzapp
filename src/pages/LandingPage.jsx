/**
 * LandingPage.jsx - REDESIGNED for Multi-Subject Architecture
 *
 * Subjects sunt acum vizibili direct pe landing page
 * Flow: Landing → Click subject → Themes → Quiz (2 clickuri în loc de 3)
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
    <div className="min-h-screen bg-gradient-to-br from-brand-blue via-brand-blue/90 to-brand-purple">

      {/* NAVIGATION */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-brand-blue">🎓 quizzfun.app</h1>
          <div className="flex gap-4">
            {user ? (
              <>
                <button
                  onClick={() => navigate('/profile')}
                  className="text-brand-blue hover:text-brand-blue/80 font-semibold px-4 py-2"
                >
                  Profil
                </button>
                <button
                  onClick={scrollToSubjects}
                  className="bg-brand-blue hover:bg-brand-blue/90 text-white px-6 py-2 rounded-lg font-semibold transition"
                >
                  Materii
                </button>
                <button
                  onClick={logout}
                  className="bg-error hover:bg-error/90 text-white px-6 py-2 rounded-lg font-semibold transition"
                >
                  Deconectare
                </button>
              </>
            ) : (
              <button
                onClick={onPlayNow || (() => {})}
                className="bg-brand-blue hover:bg-brand-blue/90 text-white px-6 py-2 rounded-lg font-semibold transition"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Învață jucându-te! 🎓
        </h1>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Quiz-uri educaționale pentru Istorie, Geografie și Biologie • Bazate pe programa școlară • 100% gratuit
        </p>

        <button
          onClick={user ? scrollToSubjects : onPlayNow}
          className="bg-white text-brand-blue hover:bg-neutral-100 px-10 py-4 rounded-lg font-bold text-xl transition shadow-xl hover:shadow-2xl"
        >
          {user ? '🎯 Alege Materia' : '🚀 Începe Acum'}
        </button>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div>
            <p className="text-5xl font-bold">3</p>
            <p className="text-lg opacity-90">Materii</p>
          </div>
          <div>
            <p className="text-5xl font-bold">225+</p>
            <p className="text-lg opacity-90">Întrebări</p>
          </div>
          <div>
            <p className="text-5xl font-bold">∞</p>
            <p className="text-lg opacity-90">Gratuit Forever</p>
          </div>
        </div>
      </section>

      {/* SUBJECTS SECTION - NOU! */}
      <section id="subjects-section" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4 text-neutral-900">
            📚 Alege Materia
          </h2>
          <p className="text-center text-neutral-600 mb-12 max-w-2xl mx-auto">
            Selectează materia pentru care vrei să rezolvi quiz-uri educaționale
          </p>

          {loadingSubjects ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
            </div>
          ) : subjects.length === 0 ? (
            <p className="text-center text-neutral-500">Nu există materii disponibile momentan.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {subjects.map((subject) => (
                <div
                  key={subject.id}
                  onClick={() => handleSubjectClick(subject.slug)}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border-2 border-transparent hover:border-brand-blue"
                >
                  {/* Header with gradient */}
                  <div
                    className="p-8 text-center text-white"
                    style={{
                      background: `linear-gradient(135deg, ${subject.color} 0%, ${subject.color}dd 100%)`
                    }}
                  >
                    <div className="text-7xl mb-4">{subject.icon}</div>
                    <h3 className="text-3xl font-bold mb-2">{subject.name}</h3>
                    <p className="text-sm opacity-90">{subject.description}</p>
                  </div>

                  {/* Stats */}
                  <div className="p-6 bg-neutral-50">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-brand-blue">{subject.totalThemes}</p>
                        <p className="text-xs text-neutral-500">Teme</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-success">{subject.totalQuestions}</p>
                        <p className="text-xs text-neutral-500">Întrebări</p>
                      </div>
                    </div>

                    <button
                      className="w-full py-3 px-6 rounded-lg font-bold text-white transition"
                      style={{ backgroundColor: subject.color }}
                    >
                      {user ? 'Începe Quiz →' : 'Login pentru a juca →'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="bg-gradient-to-br from-neutral-50 to-neutral-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-neutral-900">
            De ce Quizz Fun?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <p className="text-5xl mb-4">📚</p>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Conținut Calitativ</h3>
              <p className="text-neutral-600">
                Quiz-uri create de profesori, bazate pe programa școlară. Fiecare răspuns are explicație detaliată.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <p className="text-5xl mb-4">🎮</p>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Distractiv & Educativ</h3>
              <p className="text-neutral-600">
                Învățare gamificată cu feedback instantaneu. 3 niveluri de dificultate pentru fiecare temă.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <p className="text-5xl mb-4">🏆</p>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Urmărește Progresul</h3>
              <p className="text-neutral-600">
                Statistici detaliate per materie și temă. Vezi cum evoluezi și unde trebuie să mai studiezi.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <p className="text-5xl mb-4">⚡</p>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Rapid & Eficient</h3>
              <p className="text-neutral-600">
                10 întrebări per quiz, 20 secunde per întrebare. Perfect pentru sesiuni scurte de învățare.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <p className="text-5xl mb-4">📱</p>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Funcționează Peste Tot</h3>
              <p className="text-neutral-600">
                Responsive design - funcționează perfect pe telefon, tabletă și calculator.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <p className="text-5xl mb-4">🆓</p>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">100% Gratuit</h3>
              <p className="text-neutral-600">
                Fără costuri ascunse, fără reclame, fără abonamente. Educație gratuită pentru toți.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-20">
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
      <section className="bg-gradient-to-r from-brand-blue to-brand-purple py-20 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Gata să înveți jucându-te? 🚀
          </h2>
          <p className="text-xl mb-10 opacity-90">
            100% gratuit • Fără reclame • Distractiv • Educational
          </p>

          <button
            onClick={user ? scrollToSubjects : onPlayNow}
            className="bg-white text-brand-blue hover:bg-neutral-100 px-12 py-5 rounded-xl font-bold text-xl transition shadow-2xl hover:scale-105"
          >
            {user ? '📚 Alege Materia' : '🎯 Începe Acum'}
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-white mb-4">🎓 quizzfun.app</h3>
              <p className="text-sm">Educație prin joc. Învață istorie, geografie și biologie distractiv.</p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3">Materii</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={scrollToSubjects} className="hover:text-white">Istorie</button></li>
                <li><button onClick={scrollToSubjects} className="hover:text-white">Geografie</button></li>
                <li><button onClick={scrollToSubjects} className="hover:text-white">Biologie</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3">Contact</h4>
              <p className="text-sm">📧 perviat@gmail.com</p>
            </div>
          </div>

          <hr className="border-gray-700 mb-6" />

          <div className="text-center text-sm">
            <p>&copy; 2024 quizzfun.app. Created by <strong>Ghergheluca Eduard</strong>.</p>
            <p className="mt-2">All rights reserved.</p>
          </div>

        </div>
      </footer>

    </div>
  );
}

export default LandingPage;
