/**
 * Home.jsx - FIXED
 * 
 * LOGICA:
 * - Dacă user e logat → Arată LandingPage
 * - Dacă user NU e logat → Arată Login form
 */

import React from 'react';
import { useAuth } from '../hooks/useAuth';
import LoginModal from '../components/auth/LoginModal';
import { LandingPage } from './LandingPage';

export function Home() {
  
  const { user } = useAuth();

  // If logged in, show landing page
  if (user) {
    return <LandingPage />;
  }

  // If not logged in, show login modal
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600">
      <LoginModal />
    </div>
  );
}

export default Home;

/**
 * FLUX:
 * 
 * 1. User accesează /
 * 2. App.jsx arată Home
 * 3. Home.jsx verifică:
 *    - user logat? → LandingPage
 *    - user NU logat? → LoginModal
 * 
 * 4. User se loghează
 * 5. Home rerender → Acum vede LandingPage
 * 6. In LandingPage: "Joacă acum" → /themes
 */