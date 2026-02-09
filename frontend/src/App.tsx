import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'

function App() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading GovGuide...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Allow login/signup even if already logged in */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      {/* Dashboard accessible to everyone (guest or authenticated) */}
      <Route path="/" element={<Dashboard isAuthenticated={!!session} />} />
    </Routes>
  )
}

export default App
