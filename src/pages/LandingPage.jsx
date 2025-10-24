/**
 * LandingPage.jsx - UPDATED
 * 
 * Primește prop: onPlayNow
 * Când user clickează "Joacă acum", apelează onPlayNow()
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function LandingPage({ onPlayNow }) {
  
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600">
      
      {/* NAVIGATION */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">🎓 quizzfun.app</h1>
          <div className="flex gap-4">
            {user ? (
              <>
                <button
                  onClick={() => navigate('/themes')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  Joacă acum
                </button>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  Deconectare
                </button>
              </>
            ) : (
              <button
                onClick={onPlayNow || (() => {})}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-white">
        <h1 className="text-6xl font-bold mb-6">
          Invață și distrează-te inteligent! 🎉
        </h1>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Quiz-uri educaționale bazate pe programa școlară • Concurează cu alții • Înregistrează-te și urmărește-ți progresul
        </p>
        
        <div className="flex gap-4 justify-center mb-12">
          <button
            onClick={onPlayNow || (() => {})}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold text-lg transition"
          >
            ▶️ Începe Quiz
          </button>
          <button
            onClick={() => window.scrollTo(0, document.body.scrollHeight)}
            className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-bold text-lg transition"
          >
            Află Mai Mult
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="text-4xl font-bold">5+</p>
            <p className="text-lg opacity-90">Tematici</p>
          </div>
          <div>
            <p className="text-4xl font-bold">225+</p>
            <p className="text-lg opacity-90">Întrebări</p>
          </div>
          <div>
            <p className="text-4xl font-bold">∞</p>
            <p className="text-lg opacity-90">Gratuit Forever</p>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            De ce Quizz Fun?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-blue-50 p-8 rounded-lg border-l-4 border-blue-600">
              <p className="text-4xl mb-3">📚</p>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Conținut Calitativ</h3>
              <p className="text-gray-600">
                Quiz-uri create de profesori. Fiecare răspuns are și explicație.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-green-50 p-8 rounded-lg border-l-4 border-green-600">
              <p className="text-4xl mb-3">🎮</p>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Distractiv & Educativ</h3>
              <p className="text-gray-600">
                Gameplay cu feedback instantaneu. Înveți în timp ce te joci.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-purple-50 p-8 rounded-lg border-l-4 border-purple-600">
              <p className="text-4xl mb-3">🏆</p>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Competeție</h3>
              <p className="text-gray-600">
                Clasament global și pentru fiecare temă. Urcă în topul utilizatorilor.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-yellow-50 p-8 rounded-lg border-l-4 border-yellow-600">
              <p className="text-4xl mb-3">📊</p>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Urmărește Progresul</h3>
              <p className="text-gray-600">
                Dashboard cu statistici detaliate. Vezi cum evoluezi.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-pink-50 p-8 rounded-lg border-l-4 border-pink-600">
              <p className="text-4xl mb-3">📱</p>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Accesibil Peste Tot</h3>
              <p className="text-gray-600">
                Funcționează perfect pe telefon, tabletă, calculator.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-indigo-50 p-8 rounded-lg border-l-4 border-indigo-600">
              <p className="text-4xl mb-3">🔒</p>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Sigur & Privat</h3>
              <p className="text-gray-600">
                Datele tale sunt protejate. GDPR compliant.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Cum Funcționează? 🎯
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Înregistrare</h3>
              <p className="text-gray-600">Creează cont în câteva secunde (gratuit!)</p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Alege Temă</h3>
              <p className="text-gray-600">Selectează tema și dificultatea</p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Joacă Quiz</h3>
              <p className="text-gray-600">Răspunde la 10 întrebări</p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Urcă în Clasament</h3>
              <p className="text-gray-600">Concurează și colecționează puncte</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-20 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Gata să înveți jucându-te? 🚀
          </h2>
          <p className="text-xl mb-8 opacity-90">
            100% gratuit • Fără reclame • Distractiv • Educational
          </p>
          
          <button
            onClick={onPlayNow || (() => {})}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-bold text-lg transition"
          >
            ▶️ Începe Acum
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-white mb-4">🎓 quizzfun.app</h3>
              <p className="text-sm">Educație prin joc. Învață istoria distractiv.</p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-3">Navigare</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="hover:text-white">Home</a></li>
                <li><a href="/privacy" className="hover:text-white">Privacy</a></li>
                <li><a href="/terms" className="hover:text-white">Terms</a></li>
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

/**
 * FLUX FINAL:
 * 
 * 1. User vizită quizzfun.app
 * 2. Vede LandingPage cu "Joacă acum" button
 * 3. Click → onPlayNow() din Home.jsx
 * 4. Home checks: user logat?
 * 5. NU → Show LoginModal
 * 6. DA → Navigate to /themes
 * 
 * PERFECT UX! ✅
 */