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
    <div className="min-h-screen bg-gradient-to-br from-brand-blue via-brand-blue/90 to-brand-purple">

      {/* NAVIGATION */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-brand-blue">🎓 quizzfun.app</h1>
          <div className="flex gap-4">
            {user ? (
              <>
                <button
                  onClick={() => navigate('/themes')}
                  className="bg-brand-blue hover:bg-brand-blue/90 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  Joacă acum
                </button>
                <button
                  onClick={logout}
                  className="bg-error hover:bg-error/90 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  Deconectare
                </button>
              </>
            ) : (
              <button
                onClick={onPlayNow || (() => {})}
                className="bg-brand-blue hover:bg-brand-blue/90 text-white px-6 py-2 rounded-lg font-semibold"
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
            className="bg-white text-brand-blue hover:bg-neutral-100 px-8 py-3 rounded-lg font-bold text-lg transition"
          >
            ▶️ Începe Quiz
          </button>
          <button
            onClick={() => window.scrollTo(0, document.body.scrollHeight)}
            className="border-2 border-white text-white hover:bg-white hover:text-brand-blue px-8 py-3 rounded-lg font-bold text-lg transition"
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
          <h2 className="text-4xl font-bold text-center mb-12 text-neutral-900">
            De ce Quizz Fun?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-brand-blue/5 p-8 rounded-lg border-l-4 border-brand-blue">
              <p className="text-4xl mb-3">📚</p>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Conținut Calitativ</h3>
              <p className="text-neutral-500">
                Quiz-uri create de profesori. Fiecare răspuns are și explicație.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-success/5 p-8 rounded-lg border-l-4 border-success">
              <p className="text-4xl mb-3">🎮</p>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Distractiv & Educativ</h3>
              <p className="text-neutral-500">
                Gameplay cu feedback instantaneu. Înveți în timp ce te joci.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-brand-purple/5 p-8 rounded-lg border-l-4 border-brand-purple">
              <p className="text-4xl mb-3">🏆</p>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Competeție</h3>
              <p className="text-neutral-500">
                Clasament global și pentru fiecare temă. Urcă în topul utilizatorilor.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-brand-yellow/5 p-8 rounded-lg border-l-4 border-brand-yellow">
              <p className="text-4xl mb-3">📊</p>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Urmărește Progresul</h3>
              <p className="text-neutral-500">
                Dashboard cu statistici detaliate. Vezi cum evoluezi.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-brand-red/5 p-8 rounded-lg border-l-4 border-brand-red">
              <p className="text-4xl mb-3">📱</p>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Accesibil Peste Tot</h3>
              <p className="text-neutral-500">
                Funcționează perfect pe telefon, tabletă, calculator.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-brand-orange/5 p-8 rounded-lg border-l-4 border-brand-orange">
              <p className="text-4xl mb-3">🔒</p>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Sigur & Privat</h3>
              <p className="text-neutral-500">
                Datele tale sunt protejate. GDPR compliant.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-gradient-to-br from-neutral-50 to-neutral-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-neutral-900">
            Cum Funcționează? 🎯
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-brand-blue text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Înregistrare</h3>
              <p className="text-neutral-500">Creează cont în câteva secunde (gratuit!)</p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-brand-blue text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Alege Temă</h3>
              <p className="text-neutral-500">Selectează tema și dificultatea</p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-brand-blue text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Joacă Quiz</h3>
              <p className="text-neutral-500">Răspunde la 10 întrebări</p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="bg-brand-blue text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Urcă în Clasament</h3>
              <p className="text-neutral-500">Concurează și colecționează puncte</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-gradient-to-r from-brand-blue to-brand-purple py-20 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Gata să înveți jucându-te? 🚀
          </h2>
          <p className="text-xl mb-8 opacity-90">
            100% gratuit • Fără reclame • Distractiv • Educational
          </p>

          <button
            onClick={onPlayNow || (() => {})}
            className="bg-white text-brand-blue hover:bg-neutral-100 px-8 py-4 rounded-lg font-bold text-lg transition"
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