/**
 * firebase.js
 * 
 * IMPORTANT: Această fișie conține configurația Firebase pentru quizzapp
 * Aceasta e configurația pentru Fase 1 (MVP) - în producție, s-ar putea muta în .env
 * 
 * Ce face:
 * 1. Importă SDK-urile Firebase necesare
 * 2. Inițializează aplicația Firebase cu credențialele tale
 * 3. Exportă referințe către fiecare serviciu pentru a fi folosit în alte fișiere
 * 
 * Fluxul de date:
 * App.js -> useAuth() hook -> auth service -> firebase.js -> Firebase servers
 */

// Importă doar serviciile pe care le folosim
// Asta reduce dimensiunea bundle-ului (important pentru performance)
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';

/**
 * CONFIGURAȚIA FIREBASE
 * 
 * Aceste valori vin din Firebase Console > Project Settings
 * Sunt "publice" (vor fi vizibile și în code pe client), nu conțin parole
 * De aceea e OK să fie în cod - nu sunt sensitive
 */
const firebaseConfig = {
  apiKey: "AIzaSyAfOpufH_Je0IhQhRyX_RSWPDcP6FgL8mA",
  authDomain: "quizzapp-e45dc.firebaseapp.com",
  projectId: "quizzapp-e45dc",
  storageBucket: "quizzapp-e45dc.appspot.com",
  messagingSenderId: "128593704605",
  appId: "1:128593704605:web:a1b2c3d4e5f6g7h8i9j0k1",
  databaseURL: "https://quizzapp-e45dc-default-rtdb.europe-west1.firebasedatabase.app"
};

/**
 * INIȚIALIZAREA FIREBASE
 * 
 * initializeApp() face următoarele:
 * - Conectează aplicația React la proiectul Firebase
 * - Preîncarcă SDK-urile necesare
 * - Prepară serviciile pentru utilizare
 * 
 * Această linie rulează o singură dată când app-ul se încarcă
 */
const app = initializeApp(firebaseConfig);

/**
 * EXPORTAREA SERVICIILOR
 * 
 * Fiecare variabilă exportată e o "referință" la un serviciu Firebase
 * O vom folosi în alte fișiere de cod pentru a interacționa cu Firebase
 * 
 * EXEMPLU DE UTILIZARE:
 * 
 * În auth.js:
 *   import { auth } from './firebase';
 *   signInWithEmailAndPassword(auth, email, password)
 * 
 * În firestore.js:
 *   import { db } from './firebase';
 *   getDocs(collection(db, 'users'))
 */

/**
 * Authentication Service
 * 
 * Ce e: Serviciul de autentificare Firebase
 * Responsabil pentru: Sign-in, Sign-up, Logout, Session Management
 * 
 * Metode care vom folosi:
 * - signInWithEmailAndPassword() - login cu email
 * - signInWithPopup() - login cu Google
 * - signInAnonymously() - login anonimp (pentru vizitatori)
 * - onAuthStateChanged() - track cand user se loghează/deloghează
 */
export const auth = getAuth(app);

/**
 * Firestore Database Service
 * 
 * Ce e: Database NoSQL (document-based) pentru date structurate
 * Responsabil pentru: User profiles, themes, questions, leaderboards, badges
 * 
 * De ce Firestore și nu Realtime DB?
 * - Firestore e mai scalabil
 * - Mai ușor de queryat date
 * - Better for complex queries
 * - Realtime DB e mai bun pentru multiplayer real-time (pe care o vom folosi pe acolo)
 * 
 * Colecții pe care le vom crea:
 * - users/ - profiluri utilizatori
 * - themes/ - tematici quiz (WWI, Grecia, Roma)
 * - questions/ - Ã®ntrebÄƒri
 * - leaderboards/ - clasamente
 * - badges/ - realizÄƒri
 */
export const db = getFirestore(app);

/**
 * Realtime Database Service
 * 
 * Ce e: Database real-time (JSON-based)
 * Responsabil pentru: Multiplayer rooms, live scores, online users status
 * 
 * De ce Realtime DB pe acolo?
 * - e optimizat pentru sincronizarea real-time
 * - Perfect pentru multiplayer (players Ã®n acelaÈ™i room)
 * - Lower latency
 * 
 * Structuri pe care le vom folosi:
 * - multiplayerRooms/ - rooms active
 * - onlineUsers/ - status online
 * - liveScores/ - scores updating in real-time
 */
export const realtimeDB = getDatabase(app);

/**
 * Analytics Service (OPTIONAL)
 * 
 * Ce e: Tracking tool pentru user behavior
 * Responsabil pentru: Track events (quiz completed, user signed up, etc)
 * 
 * Utilitate: Analytics dashboard în Firebase Console
 * - Vedem metrics cum ar fi: "cati useri au terminat quiz azi?"
 * - "care e tema cea mai populara?"
 * 
 * NOTA: Analytics e optional - nu blochează app dacă nu e activ
 * Și nu afectează performance semnificativ
 */
export const analytics = getAnalytics(app);

/**
 * DEFAULT EXPORT
 * 
 * Exportăm app object ca default, în caz că o altă parte a codului
 * are nevoie de referința directă la app (rare, dar bun să avem)
 */
export default app;

/**
 * EXEMPLU DE FLUX COMPLET - Cum se conectează totul:
 * 
 * 1. User deschide app.jsx
 * 2. App.jsx importează useAuth hook
 * 3. useAuth importează auth din firebase.js
 * 4. useAuth folosește auth.signInWithEmailAndPassword()
 * 5. Firebase trimite request la server
 * 6. Server răspunde cu user data
 * 7. useAuth updatează state
 * 8. Component se re-render cu user data
 * 
 * Diagrama:
 * 
 * Component
 *    ↓
 * useAuth hook
 *    ↓
 * auth service
 *    ↓
 * firebase.js (THIS FILE)
 *    ↓
 * Firebase servers (Google Cloud)
 */