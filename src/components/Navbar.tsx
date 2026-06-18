import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/whiskies', label: 'Add Bourbon' },
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className="bg-amber-900 text-white px-6 py-4 flex items-center gap-8 shadow-lg">
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
    </nav>
  )
}