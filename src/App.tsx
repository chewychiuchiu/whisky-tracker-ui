import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import BourbonDetail from './pages/BourbonDetail'
import Whiskies from './pages/Whiskies'
import Retailers from './pages/Retailers'
import Listings from './pages/Listings'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/bourbon/:id" element={<BourbonDetail />} />
        <Route path="/whiskies" element={<Whiskies />} />
        <Route path="/retailers" element={<Retailers />} />
        <Route path="/listings" element={<Listings />} />
      </Routes>
    </div>
  )
}