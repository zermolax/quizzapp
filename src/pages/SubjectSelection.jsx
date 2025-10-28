/**
 * SubjectSelection.jsx
 *
 * Pagina de selecție a materiei
 * Prima oprire după login - user-ul alege materia (Istorie, Geografie, Biologie)
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

export function SubjectSelection() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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
   * RENDER: Loading state
   */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p className="text-neutral-500">Se încarcă materiile...</p>
        </div>
      </div>
    );
  }

  /**
   * RENDER: Error state
   */
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-bold text-error mb-4">⚠️ Eroare</h2>
          <p className="text-neutral-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold py-2 px-6 rounded-lg"
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
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-brand-blue/10">

      {/* HEADER */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">

            <div
              onClick={() => navigate('/')}
              className="cursor-pointer hover:opacity-80 transition"
            >
              <h1 className="text-3xl font-bold text-brand-blue">📚 Quizz Fun</h1>
              <p className="text-neutral-500 text-sm">Alege materia și învață jucându-te</p>
            </div>

            {/* RIGHT SIDE: Buttons */}
            <div className="flex items-center gap-3">

              {/* Leaderboard Button */}
              <button
                onClick={() => navigate('/leaderboard')}
                className="bg-brand-yellow hover:bg-brand-yellow/90 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2"
              >
                🏆 Clasament
              </button>

              {/* Profile Button */}
              <button
                onClick={() => navigate('/profile')}
                className="bg-brand-purple hover:bg-brand-purple/90 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2"
              >
                👤 Profil
              </button>

              <p className="text-neutral-700 text-sm">
                <strong>{user?.email || 'Vizitator'}</strong>
              </p>

              <button
                onClick={handleLogout}
                className="bg-error hover:bg-error/90 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                Deconectare
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* HERO */}
        <div className="mb-12 text-center">
          <h2 className="text-5xl font-bold text-neutral-900 mb-4">
            Alege Materia 📖
          </h2>
          <p className="text-neutral-500 text-xl">
            Selectează materia pentru care vrei să rezolvi quiz-uri educaționale
          </p>
        </div>

        {/* SUBJECTS GRID */}
        {subjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-500 text-lg">Nu există materii disponibile momentan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                onClick={() => handleSelectSubject(subject.slug)}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 overflow-hidden group"
                style={{ borderLeft: `6px solid ${subject.color}` }}
              >
                {/* Subject Icon */}
                <div
                  className="p-8 text-center transition-all duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: `${subject.color}15`
                  }}
                >
                  <span className="text-7xl">{subject.icon}</span>
                </div>

                {/* Subject Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                    {subject.name}
                  </h3>
                  <p className="text-neutral-500 mb-4 text-sm">
                    {subject.description}
                  </p>

                  {/* Stats */}
                  <div className="flex justify-between items-center text-sm border-t border-neutral-200 pt-4">
                    <div>
                      <p className="text-neutral-500">Teme</p>
                      <p className="text-xl font-bold text-brand-blue">{subject.totalThemes}</p>
                    </div>
                    <div>
                      <p className="text-neutral-500">Întrebări</p>
                      <p className="text-xl font-bold text-brand-purple">{subject.totalQuestions || 0}</p>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    className="w-full mt-4 bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold py-3 rounded-lg transition"
                  >
                    Începe Quiz →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* INFO BOX */}
        <div className="mt-16 bg-info/10 border-l-4 border-info p-6 rounded">
          <h3 className="text-lg font-bold text-neutral-900 mb-2">
            💡 Cum funcționează?
          </h3>
          <ul className="text-neutral-700 space-y-2 text-sm">
            <li>1️⃣ Alege materia care te interesează</li>
            <li>2️⃣ Selectează o temă din acea materie</li>
            <li>3️⃣ Alege dificultatea (ușor, mediu, greu)</li>
            <li>4️⃣ Răspunde la întrebări și acumulează puncte</li>
            <li>5️⃣ Urcă în clasament și compară-te cu alții!</li>
          </ul>
        </div>

      </main>

    </div>
  );
}

export default SubjectSelection;
