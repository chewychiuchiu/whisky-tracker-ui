import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getWhiskies, scrapeWhiskyPrices, deleteWhisky, updateWhisky } from '../api/whiskies'
import EditWhiskyModal from '../components/EditWhiskyModal'
import type { Whisky } from '../types'
import { Trash2 } from 'lucide-react'

export default function Dashboard() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [editingWhisky, setEditingWhisky] = useState<Whisky | null>(null)

  const { data: whiskies = [] } = useQuery({
    queryKey: ['whiskies'],
    queryFn: getWhiskies,
  })

  const scrapeMutation = useMutation({
    mutationFn: scrapeWhiskyPrices,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteWhisky,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['whiskies'] }),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Whisky> }) =>
      updateWhisky(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whiskies'] })
      setEditingWhisky(null)
    },
  })

  const filtered = whiskies.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.distillery.toLowerCase().includes(search.toLowerCase())
  )

  const handleBourbonClick = (whisky: Whisky) => {
  scrapeMutation.mutate(whisky.id)
  navigate(`/bourbon/${whisky.id}`)
}

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Bourbon Price Tracker</h1>
      <p className="text-gray-500 mb-8">Track and compare bourbon prices across retailers over time</p>

      <div className="flex gap-2 mb-10">
        <input
          type="text"
          placeholder="Search by bourbon name or distillery..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
        />
        <button className="bg-amber-700 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-amber-800 transition-colors">
          Search
        </button>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
          {search ? `Results for "${search}"` : 'Recently Added'}
        </h2>

        {filtered.length === 0 ? (
          <p className="text-gray-400 text-sm">No bourbons found. Add one in the Whiskies page first.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filtered.map(whisky => (
              <BourbonCard
                key={whisky.id}
                whisky={whisky}
                loading={scrapeMutation.isPending && scrapeMutation.variables === whisky.id}
                onClick={() => handleBourbonClick(whisky)}
                onDelete={id => deleteMutation.mutate(id)}
                onEdit={() => setEditingWhisky(whisky)}
              />
            ))}
          </div>
        )}
      </div>

      {editingWhisky && (
        <EditWhiskyModal
          whisky={editingWhisky}
          onClose={() => setEditingWhisky(null)}
          onSave={data => updateMutation.mutate({ id: editingWhisky.id, data })}
        />
      )}
    </div>
  )
}

function BourbonCard({
  whisky,
  onClick,
  onDelete,
  onEdit,
  loading,
}: {
  whisky: Whisky
  onClick: () => void
  onDelete: (id: number) => void
  onEdit: () => void
  loading: boolean
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-amber-300 transition-all relative">
      <div className="absolute top-2 right-2 flex gap-1">
        <button
          onClick={e => {
            e.stopPropagation()
            onEdit()
          }}
          className="text-xs text-amber-600 hover:text-amber-800 bg-white px-2 py-0.5 rounded-full border border-amber-200 hover:border-amber-400 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={e => {
            e.stopPropagation()
            onDelete(whisky.id)
          }}
          className="text-red-400 hover:text-red-600 bg-white p-1.5 rounded-full border border-red-200 hover:border-red-400 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <div onClick={onClick} className="cursor-pointer">
        <div className="w-full h-32 bg-amber-50 rounded-lg flex items-center justify-center mb-3 overflow-hidden">
          {loading ? (
            <span className="text-sm text-amber-700 animate-pulse">Fetching prices...</span>
          ) : whisky.imageUrl ? (
            <img
              src={whisky.imageUrl}
              alt={whisky.name}
              className="w-full h-full object-contain p-2"
            />
          ) : (
            <span className="text-4xl">🥃</span>
          )}
        </div>
        <p className="font-semibold text-gray-800 text-sm">{whisky.name}</p>
        <p className="text-xs text-gray-500 mt-0.5">{whisky.distillery}</p>
        <div className="flex gap-1 mt-2 flex-wrap">
          {whisky.ageYears && (
            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
              {whisky.ageYears}yr
            </span>
          )}
          {whisky.bottledYear && (
            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
              {whisky.bottledYear}
            </span>
          )}
          {whisky.abv && (
            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
              {whisky.abv}% ABV
            </span>
          )}
          {whisky.type && (
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
              {whisky.type}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}