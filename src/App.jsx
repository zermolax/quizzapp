/**
 * App.jsx
 * 
 * SCOPUL:
 * Componenta principală a aplicației.
 * De aici vor pornii rutele (route-uri) în viitor.
 * 
 * PENTRU MVP:
 * Doar randez Home component
 * 
 * ÎN VIITOR (Faza 2):
 * Voi adăuga React Router aici pentru a naviga între pagini
 * 
 * EXEMPLU VIITOR:
 * 
 * import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
 * import Home from './pages/Home';
 * import ThemeSelection from './pages/ThemeSelection';
 * 
 * export default function App() {
 *   return (
 *     <Router>
 *       <Routes>
 *         <Route path="/" element={<Home />} />
 *         <Route path="/themes" element={<ThemeSelection />} />
 *       </Routes>
 *     </Router>
 *   );
 * }
 */

import Home from './pages/Home'

/**
 * COMPONENT: App
 * 
 * Pentru MVP: doar randez Home
 * Home component are logica pentru a afișa:
 * - Login form (dacă nu e logat)
 * - Welcome + logout (dacă e logat)
 */
export default function App() {
  return (
    <div>
      <Home />
    </div>
  )
}

/**
 * FLOW COMPLET ACUM:
 * 
 * 1. Browser încarcă index.html
 * 2. index.html include <div id="root"></div>
 * 3. main.jsx:
 *    - Importează App
 *    - Wrap-lez cu AuthProvider
 *    - Randez în #root
 * 4. App.jsx: Randez Home
 * 5. Home.jsx:
 *    - Folosește useAuth() pentru a accesa user
 *    - Arată login sau welcome, depinde de auth status
 * 6. User face click pe Login
 * 7. Home apelează signInWithEmailAndPassword()
 * 8. Firebase verifi email/password
 * 9. onAuthStateChanged() se declanșează
 * 10. AuthContext se actualizează
 * 11. Home se re-render și arată welcome message
 * 
 * TOTUL E CONECTAT! 🚀
 */