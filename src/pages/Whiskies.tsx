import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getWhiskies, createWhisky, deleteWhisky } from '../api/whiskies'
import { lookupBarcode } from '../api/whiskies'
import LabelScanner from '../components/LabelScanner'

export default function Whiskies() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    distillery: '',
    country: '',
    region: '',
    ageYears: '',
    abv: '',
    type: '',
    sizeMl: '',
    bottledYear: '',
  })
  const [showScanner, setShowScanner] = useState(false)
  const [scanError, setScanError] = useState('')

  const { data: whiskies = [], isLoading } = useQuery({
    queryKey: ['whiskies'],
    queryFn: getWhiskies,
  })

  const createMutation = useMutation({
    mutationFn: createWhisky,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whiskies'] })
      setForm({ name: '', distillery: '', country: '', region: '', ageYears: '', abv: '', type: '', sizeMl: '', bottledYear: '' })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteWhisky,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['whiskies'] }),
  })

  const handleLabelScan = (data: {
    name: string
    distillery: string
    country: string
    region?: string
    ageYears?: number
    abv?: number
    type?: string
    sizeMl?: number
    bottledYear?: number
  }) => {
    setShowScanner(false)
    setScanError('')
    setForm({
      name: data.name || '',
      distillery: data.distillery || '',
      country: data.country || '',
      region: data.region || '',
      ageYears: data.ageYears?.toString() || '',
      abv: data.abv?.toString() || '',
      type: data.type || '',
      sizeMl: data.sizeMl?.toString() || '',
      bottledYear: data.bottledYear?.toString() || '',
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate({
      name: form.name,
      distillery: form.distillery,
      country: form.country,
      region: form.region || undefined,
      ageYears: form.ageYears ? parseInt(form.ageYears) : undefined,
      abv: form.abv ? parseFloat(form.abv) : undefined,
      type: form.type || undefined,
      sizeMl: form.sizeMl ? parseInt(form.sizeMl) : undefined,
      bottledYear: form.bottledYear ? parseInt(form.bottledYear) : undefined,
    })
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Whiskies</h1>

      <div className="bg-white rounded-xl shadow p-6 border border-amber-100 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Add Bourbon</h2>
          <button
            type="button"
            onClick={() => setShowScanner(true)}
            className="flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-amber-200 transition-colors"
          >
            📷 Scan Label
          </button>
        </div>
        {scanError && (
          <p className="text-red-400 text-xs mb-3">{scanError}</p>
        )}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <input
            required
            placeholder="Name *"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <input
            required
            placeholder="Distillery *"
            value={form.distillery}
            onChange={e => setForm({ ...form, distillery: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <input
            required
            placeholder="Country *"
            value={form.country}
            onChange={e => setForm({ ...form, country: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <input
            placeholder="Region"
            value={form.region}
            onChange={e => setForm({ ...form, region: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <input
            placeholder="Age (years)"
            type="number"
            value={form.ageYears}
            onChange={e => setForm({ ...form, ageYears: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <input
            placeholder="ABV %"
            type="number"
            step="0.1"
            value={form.abv}
            onChange={e => setForm({ ...form, abv: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <input
            placeholder="Type (e.g. Single Malt)"
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <input
            placeholder="Size (ml)"
            type="number"
            value={form.sizeMl}
            onChange={e => setForm({ ...form, sizeMl: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <input
            placeholder="Bottled Year (e.g. 2023)"
            type="number"
            value={form.bottledYear}
            onChange={e => setForm({ ...form, bottledYear: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="col-span-2 md:col-span-4 bg-amber-800 text-white rounded-lg py-2 text-sm font-medium hover:bg-amber-900 transition-colors disabled:opacity-50"
          >
            {createMutation.isPending ? 'Adding...' : 'Add Whisky'}
          </button>
        </form>
      </div>

      {isLoading ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : whiskies.length === 0 ? (
        <p className="text-gray-400 text-sm">No whiskies yet. Add one above!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {whiskies.map(whisky => (
            <div
              key={whisky.id}
              onClick={() => navigate(`/bourbon/${whisky.id}`)}
              className="bg-white rounded-xl shadow p-4 border border-amber-100 cursor-pointer hover:shadow-md hover:border-amber-300 transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800">{whisky.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{whisky.distillery}</p>
                </div>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    deleteMutation.mutate(whisky.id)
                  }}
                  className="text-red-400 hover:text-red-600 text-xs"
                >
                  Delete
                </button>
              </div>
              <div className="flex gap-1 mt-2 flex-wrap">
                {whisky.ageYears && (
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
                    {whisky.ageYears}yr
                  </span>
                )}
                {whisky.type && (
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                    {whisky.type}
                  </span>
                )}
                {whisky.country && (
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                    {whisky.country}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showScanner && (
        <LabelScanner
          onScan={handleLabelScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  )
}