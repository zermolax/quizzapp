/**
 * ThemeSelection.jsx - UPDATED for Multi-Subject Architecture
 *
 * Afișează tematicile pentru materia selectată
 * URL: /subjects/:subjectSlug
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { collection, query, where, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import ThemeCard from '../components/ThemeCard';

export function ThemeSelection() {
  const { subjectSlug } = useParams(); // Extract subject from URL
  const [subject, setSubject] = useState(null);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  /**
   * EFFECT: Fetch subject info and themes from Firestore
   */
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch subject info
        const subjectDocRef = doc(db, 'subjects', subjectSlug);
        const subjectDoc = await getDoc(subjectDocRef);

        if (!subjectDoc.exists()) {
          setError(`Materia "${subjectSlug}" nu există.`);
          setLoading(false);
          return;
        }

        const subjectData = { id: subjectDoc.id, ...subjectDoc.data() };
        setSubject(subjectData);

        // 2. Fetch themes for this subject
        const themesRef = collection(db, 'themes');
        const q = query(
          themesRef,
          where('subjectId', '==', subjectSlug),
          where('isPublished', '==', true),
          orderBy('order', 'asc')
        );

        const snapshot = await getDocs(q);
        const themesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setThemes(themesData);

      } catch (err) {
        console.error('Eroare fetch themes:', err);
        setError('Eroare la încărcarea tematicilor. Te rugăm să încerci din nou.');
      } finally {
        setLoading(false);
      }
    }

    if (subjectSlug) {
      fetchData();
    }
  }, [subjectSlug]);

  /**
   * HANDLER: Select theme and difficulty
   */
  const handleSelectTheme = (themeSlug, difficulty) => {
    // Navigate to quiz with BOTH subjectSlug and themeSlug
    navigate(`/subjects/${subjectSlug}/quiz/${themeSlug}?difficulty=${difficulty}`);
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
          <p className="text-neutral-500">Se încarcă tematicile...</p>
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
            onClick={() => navigate('/subjects')}
            className="bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold py-2 px-6 rounded-lg"
          >
            ← Înapoi la Materii
          </button>
        </div>
      </div>
    );
  }

  /**
   * RENDER: Theme Selection Page
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
              <h1 className="text-3xl font-bold text-brand-blue">🎓 Quizz Fun</h1>
              <p className="text-neutral-500 text-sm">Alege o temă și testează-ți cunoștințele</p>
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

        {/* BREADCRUMBS */}
        <div className="mb-6 flex items-center gap-2 text-sm">
          <Link
            to="/subjects"
            className="text-brand-blue hover:underline font-semibold"
          >
            Materii
          </Link>
          <span className="text-neutral-500">/</span>
          <span className="text-neutral-900 font-semibold">
            {subject?.icon} {subject?.name}
          </span>
        </div>

        {/* HERO */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-neutral-900 mb-2">
            {subject?.icon} {subject?.name} - Tematici
          </h2>
          <p className="text-neutral-500 text-lg">
            {themes.length} {themes.length === 1 ? 'temă disponibilă' : 'tematici disponibile'} • Alege dificultatea și începe
          </p>
        </div>

        {/* THEMES GRID */}
        {themes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-500 text-lg mb-4">
              Nu există teme disponibile pentru această materie momentan.
            </p>
            <button
              onClick={() => navigate('/subjects')}
              className="bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold py-2 px-6 rounded-lg"
            >
              ← Înapoi la Materii
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {themes.map((theme) => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                onSelectTheme={(themeSlug, difficulty) => handleSelectTheme(themeSlug, difficulty)}
              />
            ))}
          </div>
        )}

        {/* FOOTER INFO */}
        <div className="mt-16 bg-info/10 border-l-4 border-info p-6 rounded">
          <h3 className="text-lg font-bold text-neutral-900 mb-2">
            💡 Cum funcționează?
          </h3>
          <ul className="text-neutral-700 space-y-2 text-sm">
            <li>✅ Alege o temă care te interesează</li>
            <li>✅ Selectează nivelul de dificultate (ușor, mediu, greu)</li>
            <li>✅ Răspunde la întrebări și acumulează puncte</li>
            <li>✅ Progresul tău este salvat automat</li>
            <li>✅ Urci în clasament și compară-te cu alții</li>
          </ul>
        </div>

      </main>

    </div>
  );
}

export default ThemeSelection;
