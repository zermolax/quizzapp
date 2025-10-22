/**
 * useAuth.js
 * 
 * SCOPUL:
 * Acesta e un "convenience hook" - face mai ușor să accesez AuthContext
 * 
 * PROBLEMA PE CARE O REZOLVĂ:
 * Dacă nu ar exista asta, fiecare component ar trebui să facă:
 * 
 * const authContext = useContext(AuthContext);
 * if (!authContext) throw new Error('useAuth must be used inside AuthProvider');
 * const { user, loading, logout } = authContext;
 * 
 * E LUNG și e REPETAT
 * 
 * CU ACEST HOOK, SIMPLU FACI:
 * const { user, loading, logout } = useAuth();
 * 
 * ADVANTAGE: Cod mai curat, mai ușor de citit, mai puțin error-prone
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * CUSTOM HOOK: useAuth
 * 
 * Hookuri sunt funcții React care "se cuplează" la React state/lifecycle
 * Pot face: useState, useEffect, useContext, etc.
 * 
 * By convention, toți hookuri încep cu "use"
 * Asta îi ajută pe alți dev-i să recunoască că e hook
 */
export function useAuth() {
  /**
   * STEP 1: Accesez AuthContext
   * 
   * useContext() e un hook React built-in
   * Parametru: AuthContext pe care l-am exportat din AuthContext.jsx
   * Returnează: value object { user, loading, logout }
   */
  const context = useContext(AuthContext);

  /**
   * STEP 2: ERROR HANDLING
   * 
   * Dacă cineva încearcă să folosească useAuth() fără AuthProvider wrapper,
   * context va fi null și va da eroare
   * 
   * Asta e o "gardă de siguranță"
   * Mesajul e clar și ajută dev-ul să-și dea seama imediat ce-a greșit
   */
  if (context === null) {
    throw new Error(
      'useAuth must be used within an AuthProvider. ' +
      'Wrap your app with <AuthProvider> in main.jsx'
    );
  }

  /**
   * STEP 3: RETURN context
   * 
   * Returnez value object direct
   * Acum componente pot face:
   * const { user, loading, logout } = useAuth();
   */
  return context;
}

/**
 * EXEMPLU DE UTILIZARE:
 * 
 * În orice component (trebuie să fie inside AuthProvider):
 * 
 * import { useAuth } from '../hooks/useAuth';
 * 
 * function MyComponent() {
 *   const { user, loading, logout } = useAuth();
 *   
 *   if (loading) return <div>Loading...</div>;
 *   
 *   if (!user) {
 *     return <button onClick={() => navigate('/login')}>Login</button>;
 *   }
 *   
 *   return (
 *     <div>
 *       <p>Welcome, {user.email}</p>
 *       <button onClick={logout}>Logout</button>
 *     </div>
 *   );
 * }
 * 
 * BENEFICII:
 * - Simplu de folosit
 * - Robust (error checking)
 * - Reutilizabil în 100+ componente
 * - Type-safe dacă voi folosi TypeScript mai târziu
 */