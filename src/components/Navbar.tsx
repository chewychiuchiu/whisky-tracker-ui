import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const links = [
  { to: '/', label: 'My Collection' },
  { to: '/whiskies', label: 'Add Bourbon' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-amber-900 text-white px-6 py-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-8">
        <span className="text-xl font-bold tracking-wide">🥃 Bourbon Tracker</span>
        <div className="flex gap-6">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium hover:text-amber-200 transition-colors ${
                pathname === link.to ? 'text-amber-200 underline underline-offset-4' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {user?.avatarUrl && (
          <img src={user.avatarUrl} alt={user.name} className="w-7 h-7 rounded-full" />
        )}
        <span className="text-sm">{user?.name}</span>
        <button
          onClick={handleLogout}
          className="text-xs bg-amber-800 hover:bg-amber-700 px-3 py-1.5 rounded-full transition-colors"
        >
          Sign out
        </button>
      </div>
    </nav>
  )
}