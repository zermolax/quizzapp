/**
 * Home.jsx
 * 
 * SCOPUL:
 * Landing page a aplicației.
 * - Dacă user e NOT logat: arată LOGIN button
 * - Dacă user e logat: arată LOGOUT button + welcome message
 * 
 * FLOW LOGICĂ:
 * Component se încarcă
 * ↓
 * useAuth() preia { user, loading, logout }
 * ↓
 * Dacă loading = true: arată "Loading..."
 * ↓
 * Dacă user = null: arată "Login button"
 * ↓
 * Dacă user = object: arată "Welcome, email + Logout button"
 */

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../services/firebase';

/**
 * COMPONENT: Home
 * Functional component - folosesc hooks
 */
export function Home() {
  
  /**
   * STATE LOCAL
   * Stări specifice acestui component (nu au nevoie de AuthContext)
   */
  const [email, setEmail] = useState('');           // Email input value
  const [password, setPassword] = useState('');     // Password input value
  const [error, setError] = useState('');           // Error message
  const [isSignUp, setIsSignUp] = useState(false);  // Toggle entre Login/Sign Up
  const [authLoading, setAuthLoading] = useState(false); // Loading state pentru btn

  /**
   * ACCESEZ AUTH CONTEXT
   * 
   * Destructuring: { user, loading, logout }
   * Asta e magia hookurilor - one line!
   */
  const { user, loading, logout } = useAuth();

  /**
   * HANDLER: Email/Password Login
   * 
   * FLOW:
   * 1. User click pe "Login" button
   * 2. Preiau email & password din input state
   * 3. Trimit la Firebase
   * 4. Firebase verifi dacă credentialele sunt corecte
   * 5. Dacă OK -> user state se updatează automat (via onAuthStateChanged)
   * 6. Dacă ERROR -> arăt message
   */
  const handleEmailLogin = async (e) => {
    e.preventDefault(); // Previne refresh implicit al form-ului
    setError(''); // Clear previous errors
    setAuthLoading(true);

    try {
      // Firebase function - verifi email/password
      await signInWithEmailAndPassword(auth, email, password);
      
      // Dacă ajunge aici = success
      // user state se va actualiza automat prin onAuthStateChanged
      setEmail('');
      setPassword('');
      
    } catch (err) {
      // Catch Firebase errors
      setError(err.message); // Arăt error message utilizatorului
      console.error('Login error:', err);
      
    } finally {
      // Indiferent dacă reușește sau nu, opresc loading
      setAuthLoading(false);
    }
  };

  /**
   * HANDLER: Email/Password Sign Up
   * 
   * Similar cu login, dar folosesc createUserWithEmailAndPassword
   * Asta creează user NOU în Firebase
   */
  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setAuthLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
      setIsSignUp(false); // Switch back to login after signup
      
    } catch (err) {
      setError(err.message);
      console.error('Sign up error:', err);
      
    } finally {
      setAuthLoading(false);
    }
  };

  /**
   * HANDLER: Google Sign In
   * 
   * Deschide Google login popup
   * User se loghează cu Google account
   * Firebase primește token-ul de la Google și mă identifică
   */
  const handleGoogleSignIn = async () => {
    setError('');
    setAuthLoading(true);

    try {
      // Creez provider pentru Google
      const provider = new GoogleAuthProvider();
      
      // Deschid popup cu Google login
      await signInWithPopup(auth, provider);
      
      // Dacă reușește, user state se actualizează automat
      
    } catch (err) {
      setError(err.message);
      console.error('Google sign in error:', err);
      
    } finally {
      setAuthLoading(false);
    }
  };

  /**
   * HANDLER: Anonymous Sign In
   * 
   * Permite vizitatorilor să facă quiz-uri FĂRĂ să se logheze
   * Progresul nu se salvează permanent, dar e OK pentru MVP
   */
  const handleAnonymousSignIn = async () => {
    setError('');
    setAuthLoading(true);

    try {
      await signInAnonymously(auth);
      
    } catch (err) {
      setError(err.message);
      console.error('Anonymous sign in error:', err);
      
    } finally {
      setAuthLoading(false);
    }
  };

  /**
   * RENDER LOGIC
   * 
   * Condițional rendering:
   * 1. Dacă loading = true: arată spinner
   * 2. Dacă user = null: arată login form
   * 3. Dacă user = object: arată welcome + logout
   */

  // CONDITION 1: LOADING STATE
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Inițializare...</p>
        </div>
      </div>
    );
  }

  // CONDITION 2: USER NOT LOGGED IN
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-blue-600">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-96">
          
          {/* Header */}
          <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">
            🎓 Storia Quiz
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Invață istoria în mod distractiv
          </p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={isSignUp ? handleEmailSignUp : handleEmailLogin} className="space-y-4">
            
            {/* Email Input */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Password Input */}
            <input
              type="password"
              placeholder="Parolă"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={authLoading}
              className={`w-full py-2 rounded-lg font-semibold text-white transition ${
                authLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {authLoading ? 'Se încarcă...' : isSignUp ? 'Înregistrare' : 'Conectare'}
            </button>
          </form>

          {/* Toggle Sign Up / Login */}
          <p className="text-center text-gray-600 text-sm mt-4">
            {isSignUp ? 'Ai deja cont?' : 'Nu ai cont?'}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-600 font-semibold ml-1 hover:underline"
            >
              {isSignUp ? 'Conectează-te' : 'Înregistrează-te'}
            </button>
          </p>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-2 text-gray-500 text-sm">SAU</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={authLoading}
            className={`w-full py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
              authLoading
                ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            🔍 Conectează-te cu Google
          </button>

          {/* Anonymous Sign In */}
          <button
            onClick={handleAnonymousSignIn}
            disabled={authLoading}
            className={`w-full py-2 mt-3 rounded-lg font-semibold transition ${
              authLoading
                ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                : 'bg-green-100 hover:bg-green-200 text-green-800'
            }`}
          >
            👤 Joacă fără cont
          </button>

        </div>
      </div>
    );
  }

  // CONDITION 3: USER IS LOGGED IN
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-500 to-green-600">
      <div className="bg-white rounded-lg shadow-2xl p-8 text-center">
        
        {/* Welcome Message */}
        <h1 className="text-3xl font-bold text-green-600 mb-2">
          🎉 Bun venit!
        </h1>
        <p className="text-gray-600 mb-6">
          {user.isAnonymous ? 'Ești logat ca vizitator' : `Email: ${user.email}`}
        </p>

        {/* User Info */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-600">
            <strong>User ID:</strong> {user.uid}
          </p>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition"
        >
          Deconectare
        </button>

        {/* Next Step Info */}
        <p className="text-gray-600 text-sm mt-6">
          🚀 Next: Theme selection page (coming soon)
        </p>

      </div>
    </div>
  );
}

export default Home;

/**
 * REZUMAT - CE FACEM AICI:
 * 
 * 1. Creez form pentru Login/Sign Up
 * 2. Implementez 4 metode de auth:
 *    - Email/Password Login
 *    - Email/Password Sign Up
 *    - Google Sign In
 *    - Anonymous Sign In
 * 3. Fiecare metodă se conectează la Firebase
 * 4. Dacă reușește, AuthContext se actualizează automat
 * 5. Component se re-render și arată welcome message
 * 
 * FLOW COMPLET:
 * User face click pe Login
 * ↓
 * handleEmailLogin() e apelat
 * ↓
 * Firebase verifi credentials
 * ↓
 * onAuthStateChanged() se declanșează
 * ↓
 * setUser(firebaseUser) în AuthContext
 * ↓
 * Component se re-render (user nu mai e null)
 * ↓
 * Se afișează welcome message
 */