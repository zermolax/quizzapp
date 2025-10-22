/**
 * AuthContext.jsx
 * 
 * SCOPUL ACESTUI FIȘIER:
 * Acesta e "centrul nervos" pentru autentificare în toată aplicația.
 * Îl gândesc ca o "centrală electrică" - trimite putere (user data) în toată casa (app).
 * 
 * CE PROBLEMI REZOLVĂ:
 * - Fără acest fișier, fiecare component ar trebui să comunice cu Firebase direct
 * - Asta ar genera cod duplicat și ar fi greu de urmat
 * - AuthContext e o soluție elegantă: "un loc pentru totul"
 * 
 * CUM FUNCȚIONEAZĂ:
 * 1. AuthContext e creat cu React.createContext()
 * 2. AuthProvider component (wrapper) gestionează toată logica
 * 3. Componente "fii" acceseaza data prin context hook
 */

import React, { createContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged,  // Ascultă schimbări în auth status
  signOut              // Logout function
} from 'firebase/auth';
import { auth } from '../services/firebase';

/**
 * STEP 1: CREAREA CONTEXTULUI
 * 
 * createContext() returnează un obiect cu 2 proprietăți:
 * - Provider: componenta care oferă data
 * - Consumer: componenta care consumă data (rar folosit în React modern, preferăm hooks)
 * 
 * Initial value: null (nu avem user încă)
 */
export const AuthContext = createContext(null);

/**
 * STEP 2: AUTHPROVIDER COMPONENT
 * 
 * Acesta e "wrapper-ul" care înfășoară toată aplicația.
 * 
 * Responsabilități:
 * 1. Tracker cand user se loghează/deloghează
 * 2. Stochează user data în state
 * 3. Oferă funcții pentru logout
 * 4. Oferă loading state (pentru cand Firebase se gândește)
 * 
 * ANALOGIE:
 * Dacă React tree e un copac, AuthProvider e rădăcina
 * care alimentează toți nodurile cu apă (user data)
 */
export function AuthProvider({ children }) {
  
  /**
   * STATE MANAGEMENT
   * 
   * STATE 1: user
   * - Valori posibile: null, User object
   * - null = user nu e logat / încă nu s-a verificat
   * - User object = { uid, email, displayName, etc }
   * 
   * STATE 2: loading
   * - true = Firebase se gândește dacă am user salvat
   * - false = Firebase a terminat verificarea
   * Asta e important pentru a nu arăta login page dacă user e deja logat
   */
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * EFFECT: ASCULTARE SCHIMBĂRI AUTH
   * 
   * onAuthStateChanged() = un "ascultător" care se activează:
   * - Când app se încarcă (verifi dacă am user din localStorage)
   * - Când user se loghează
   * - Când user se deloghează
   * 
   * FLUX:
   * 1. App se încarcă -> Effect rulează
   * 2. Firebase verifi dacă avem cookie/token salvat
   * 3. Dacă da -> setUser(firebaseUser)
   * 4. Dacă nu -> setUser(null)
   * 5. setLoading(false) -> app e gata să randeze
   */
  useEffect(() => {
    /**
     * Funcția callback care Firebase o apelează
     * 
     * Parametru: currentUser
     * - Dacă user e logat: currentUser = User object
     * - Dacă nu: currentUser = null
     */
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Actualizez state-ul user
      setUser(currentUser);
      
      // Spun app-ului că am terminat verificarea
      setLoading(false);
      
      // Log pentru debugging (optional, dar util)
      console.log('Auth state changed:', currentUser?.email || 'No user');
    });

    /**
     * CLEANUP FUNCTION
     * 
     * Când component se demontează, trebuie să "opresc ascultătorul"
     * Altfel ar continua să ascultă și ar cauza memory leaks
     * 
     * Analogie: Dacă te abonezi la un podcast, trebuie să te dezabonezi cand nu mai vrei
     */
    return () => unsubscribe();
    
    // [] = dependency array gol = Effect rulează o singură dată (la mount)
    // Nu adaug dependențe pentru că nu vreau ca Effect să ruleze din nou
  }, []);

  /**
   * LOGOUT FUNCTION
   * 
   * Această funcție va fi exportată și folosită de componente
   * Când user face click pe "Logout" button
   */
  const logout = async () => {
    try {
      await signOut(auth);
      // Dacă reușește, setUser(null) e apelat automat de onAuthStateChanged
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  /**
   * VALUE OBJECT
   * 
   * Acesta e obiectul pe care îl "livrezi" la toți copiii
   * Componente vor face: const { user, loading, logout } = useContext(AuthContext)
   * 
   * De ce e important să structurez bine asta:
   * - user: pentru a accesa email, uid, displayName
   * - loading: pentru a arăta spinner dacă se gândește Firebase
   * - logout: pentru a putea face logout
   */
  const value = {
    user,        // Cine e logat (sau null)
    loading,     // Gata cu verificarea?
    logout       // Funcție pentru delogare
  };

  /**
   * PROVIDER COMPONENT
   * 
   * <AuthContext.Provider> oferă value la toți copiii
   * 
   * {children} = componente nested în <AuthProvider>
   * 
   * EXEMPLU DE UTILIZARE:
   * 
   * <AuthProvider>
   *   <App />  ← App e "child", va primi value din AuthContext
   * </AuthProvider>
   */
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * REZUMAT - CE FACEM AICI:
 * 
 * 1. Creez un Context pentru auth
 * 2. Fac un Provider care:
 *    a) Ascultă Firebase pentru schimbări de login
 *    b) Stochează user data în state
 *    c) Oferă logout function
 * 3. Export Provider-ul
 * 
 * NEXT STEP:
 * In main.jsx, voi wrap App-ul cu AuthProvider
 * 
 * BENEFICII:
 * - Orice component din tree poate accesa user fără prop drilling
 * - Codul e centralizat și ușor de modificat
 * - Best practice în React community
 */