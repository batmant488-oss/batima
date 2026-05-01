import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import Auth from './Auth'
import Dashboard from './Dashboard'
import IncidentReport from './IncidentReport'
import Profile from './Profile'
import Settings from './Settings'
import Landing from './Landing'
import Navigation from './Navigation'
import ForgotPassword from './ForgotPassword'
import ChangePassword from './ChangePassword'
import './App.css'

function ProtectedRoute({ session, children }) {
  if (!session) {
    return <Navigate to="/auth" replace />
  }
  return children
}

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialDarkMode = savedTheme ? savedTheme === 'dark' : systemPrefersDark

    setDarkMode(initialDarkMode)
    document.documentElement.setAttribute('data-theme', initialDarkMode ? 'dark' : 'light')

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription?.unsubscribe()
  }, [])

  const toggleTheme = () => {
    const newTheme = !darkMode
    setDarkMode(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return (
      <div className="app-shell">
        <div className="loading-card">
          <div className="loading-spinner"></div>
          <p>Chargement en cours...</p>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="app-shell">
        {session && <Navigation onLogout={handleLogout} onToggleTheme={toggleTheme} darkMode={darkMode} />}
        <Routes>
          <Route path="/auth" element={!session ? <Auth /> : <Navigate to="/" replace />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route
            path="/"
            element={
              session ? (
                <ProtectedRoute session={session}>
                  <Dashboard session={session} />
                </ProtectedRoute>
              ) : (
                <Landing />
              )
            }
          />
          <Route
            path="/report"
            element={
              <ProtectedRoute session={session}>
                <IncidentReport session={session} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute session={session}>
                <Profile session={session} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute session={session}>
                <Settings session={session} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to={session ? '/' : '/auth'} replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
