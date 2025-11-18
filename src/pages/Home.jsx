/**
 * Home.jsx - FIXED v2
 * 
 * PROBLEMA: showLogin state nu se resetează când user se loghează
 * SOLUȚIE: UseEffect care observă user changes
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../components/auth/LoginModal';
import { LandingPage } from './LandingPage';
import logger from '../utils/logger';

export function Home() {
  
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);

  /**
   * EFFECT: Când user se schimbă, reset showLogin
   */
  useEffect(() => {
    if (user && showLogin) {
      logger.info('🟢 User detected, hiding login modal');
      setShowLogin(false);
    }
  }, [user, showLogin]);

  // Funcție pentru "Joacă acum" button
  const handlePlayNow = () => {
    logger.info('📢 Play now clicked, user:', user);

    if (user) {
      logger.info('✅ User is logged in, navigating to /game-mode');
      navigate('/game-mode');
    } else {
      logger.info('❌ User not logged in, showing login modal');
      setShowLogin(true);
    }
  };

  // Dacă showLogin e true, arată LoginModal
  if (showLogin && !user) {
    logger.info('🔵 Rendering LoginModal');
    return <LoginModal />;
  }

  // Dacă user e logat, arată LandingPage cu custom handlePlayNow
  if (user) {
    logger.info('🟢 Rendering LandingPage (user logged in)');
    return <LandingPage onPlayNow={handlePlayNow} />;
  }

  // Dacă loading, arată loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Default: Arată LandingPage cu handlePlayNow (care va deschide login)
  logger.info('⚪ Rendering LandingPage (user not logged in)');
  return <LandingPage onPlayNow={handlePlayNow} />;
}

export default Home;

/**
 * FLOW CORECT:
 * 
 * 1. User vizită /
 * 2. user = null, showLogin = false
 * 3. Render LandingPage
 * 4. Click "Joacă acum" → handlePlayNow()
 * 5. user = null → setShowLogin(true)
 * 6. Render LoginModal
 * 7. User se loghează → Firebase fires onAuthStateChanged
 * 8. useAuth hook updates → user = { ... }
 * 9. useEffect detectează user change
 * 10. setShowLogin(false)
 * 11. Re-render Home
 * 12. user exists && !showLogin → Render LandingPage (logged in)
 * 13. Now "Joacă acum" → navigate('/game-mode') - TRIVIA MODE ENABLED!
 *
 * PERFECT! ✅
 */