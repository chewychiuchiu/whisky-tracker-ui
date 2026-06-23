import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import BourbonDetail from './pages/BourbonDetail'
import Whiskies from './pages/Whiskies'
import Login from './pages/Login'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth()

  if (isLoading) return <div className="p-8 text-gray-400">Loading...</div>
  if (!token) return <Navigate to="/login" replace />

  return <>{children}</>
}

function AppRoutes() {
  const { token } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      {token && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/bourbon/:id" element={<ProtectedRoute><BourbonDetail /></ProtectedRoute>} />
        <Route path="/whiskies" element={<ProtectedRoute><Whiskies /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}