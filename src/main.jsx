/**
 * main.jsx
 * 
 * SCOPUL:
 * Acesta e entry point-ul aplicației React.
 * Locul unde:
 * 1. Importez App component
 * 2. Wrap-lez cu AuthProvider (contextul de autentificare)
 * 3. Randez în DOM
 * 
 * DE CE IMPORTANT:
 * AuthProvider trebuie să fie DEASUPRA App component
 * Altfel, componente din App nu vor putea folosi useAuth()
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'

/**
 * FLOW:
 * 1. ReactDOM.createRoot() e gâtul aplicației React
 * 2. .render() randează componenta root
 * 
 * STRUCTURA COMPONENT:
 * <AuthProvider>  ← Aceasta îi oferă { user, loading, logout } tuturor copiilor
 *   <App />       ← App și toți copiii ei au acces la AuthContext
 * </AuthProvider>
 * 
 * IMPORTANT: Ordinea e VITALĂ
 * Dacă pun App DEASUPRA AuthProvider, va da eroare
 * Pentru că Home va încerca să facă useAuth() dar nu va găsi contextul
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)

/**
 * EXPLICAȚIE ELEMENT cu ELEMENT:
 * 
 * ReactDOM.createRoot(document.getElementById('root'))
 * ↓
 * Găsesc div#root din index.html
 * ↓
 * Crează un "root" React pe care pot randeza
 * ↓
 * .render() spune: "Randează asta în root"
 * ↓
 * <React.StrictMode> = modul strict development
 *   - Verifi dacă am probleme în cod
 *   - Nu afectează producția
 * ↓
 * <AuthProvider> = contextul de autentificare
 * ↓
 * <App /> = componenta principală
 * 
 * REZULTAT: Toți copiii App pot folosi useAuth()
 */