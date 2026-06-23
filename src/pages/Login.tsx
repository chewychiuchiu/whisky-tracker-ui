import { GoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSuccess = async (credentialResponse: any) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080'
      const res = await fetch(`${apiUrl}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      })

      if (!res.ok) throw new Error('Login failed')

      const data = await res.json()
      login(data.token, data.user)
      navigate('/')
    } catch (err) {
      console.error('Login error:', err)
    }
  }

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-10 max-w-sm w-full text-center border border-amber-100">
        <div className="text-5xl mb-4">🥃</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Bourbon Tracker</h1>
        <p className="text-gray-500 text-sm mb-8">
          Sign in to track your own bourbon collection and prices
        </p>
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => console.error('Google login failed')}
          />
        </div>
      </div>
    </div>
  )
}