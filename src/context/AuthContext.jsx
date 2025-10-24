/**
 * AuthContext.jsx - COMPLETE VERSION
 * 
 * Context pentru authentication
 * Exportează: user, loading, login methods, logout
 */

import React, { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';

/**
 * STEP 1: Create Context
 * Asta e "container" pentru auth state
 */
export const AuthContext = React.createContext();

/**
 * STEP 2: Create Provider Component
 * Asta wraps entire app și provides auth state
 */
export function AuthProvider({ children }) {
  
  /**
   * STATE
   */
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * EFFECT: Listen for auth changes
   * Când user se loghează/deloghează, update state
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  /**
   * FUNCTION 1: Login with Email & Password
   */
  const loginWithEmail = async (email, password) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  /**
   * FUNCTION 2: Google Login
   */
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      
      // Check if user already exists in Firestore
      const { getDoc } = await import('firebase/firestore');
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      // If new user, create document
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          displayName: user.displayName || 'User',
          createdAt: new Date(),
          stats: {
            totalQuizzes: 0,
            totalPoints: 0,
            averageScore: 0,
            bestScore: 0
          }
        });
      }

      return userCredential;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  /**
   * FUNCTION 3: Sign Up with Email & Password
   */
  const signUpWithEmail = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: user.displayName || email.split('@')[0],
        createdAt: new Date(),
        stats: {
          totalQuizzes: 0,
          totalPoints: 0,
          averageScore: 0,
          bestScore: 0
        }
      });

      return userCredential;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  /**
   * FUNCTION 3: Anonymous Login
   *
   * NOTE: Anonymous users are NOT saved to Firestore to prevent database bloat.
   * They only exist in Firebase Auth and are automatically cleaned up after 30 days of inactivity.
   * Their session data (quiz scores) can be stored in localStorage if needed.
   */
  const loginAnonymous = async () => {
    try {
      const userCredential = await signInAnonymously(auth);
      // No Firestore document created for anonymous users
      return userCredential;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  /**
   * FUNCTION 4: Logout
   */
  const logout = async () => {
    try {
      return await signOut(auth);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  /**
   * RETURN: Provider with value
   * 
   * IMPORTANT: Trebuie să exporte EXACT aceste funcții
   * LoginModal.jsx și alte componente le vor folosi prin useAuth()
   */
  return (
    <AuthContext.Provider value={{
      user,
      loading,
      loginWithEmail,
      loginWithGoogle,
      signUpWithEmail,
      loginAnonymous,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * RECAP - What this does:
 * 
 * 1. AuthContext = Container pentru auth state
 * 2. AuthProvider = Component care provides state la toți copii
 * 3. useAuth hook (din hooks/useAuth.js) = Easy access to context
 * 
 * FLOW:
 * 1. main.jsx wraps app cu <AuthProvider>
 * 2. Orice component poate face: const { user } = useAuth()
 * 3. useAuth citește din AuthContext
 * 4. AuthContext are user, loading, login methods
 * 
 * EXEMPLU:
 * function LoginModal() {
 *   const { loginWithEmail, signUpWithEmail } = useAuth();
 *   
 *   const handleSignUp = async (email, pass) => {
 *     await signUpWithEmail(email, pass);
 *   };
 * }
 */