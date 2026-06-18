import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getRetailers, createRetailer, deleteRetailer } from '../api/retailers'

export default function Retailers() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState({ name: '', baseUrl: '', country: '' })

  const { data: retailers = [], isLoading } = useQuery({
    queryKey: ['retailers'],
    queryFn: getRetailers,
  })

  const createMutation = useMutation({
    mutationFn: createRetailer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['retailers'] })
      setForm({ name: '', baseUrl: '', country: '' })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteRetailer,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['retailers'] }),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate({
      name: form.name,
      baseUrl: form.baseUrl,
      country: form.country || undefined,
      active: true,
    })
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Retailers</h1>

      {/* Add form */}
      <div className="bg-white rounded-xl shadow p-6 border border-amber-100 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Add Retailer</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            required
            placeholder="Name *"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <input
            required
            placeholder="Base URL * (e.g. https://totalwine.com)"
            value={form.baseUrl}
            onChange={e => setForm({ ...form, baseUrl: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <input
            placeholder="Country"
            value={form.country}
            onChange={e => setForm({ ...form, country: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="md:col-span-3 bg-amber-800 text-white rounded-lg py-2 text-sm font-medium hover:bg-amber-900 transition-colors disabled:opacity-50"
          >
            {createMutation.isPending ? 'Adding...' : 'Add Retailer'}
          </button>
        </form>
      </div>

      {/* Retailer list */}
      {isLoading ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : retailers.length === 0 ? (
        <p className="text-gray-400 text-sm">No retailers yet. Add one above!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {retailers.map(retailer => (
            <div
              key={retailer.id}
              className="bg-white rounded-xl shadow p-4 border border-amber-100 flex justify-between items-start"
            >
              <div>
                <p className="font-semibold text-gray-800">{retailer.name}</p>
                
                  <a href={retailer.baseUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-amber-700 hover:underline"
                >
                  {retailer.baseUrl}
                </a>
                {retailer.country && (
                  <p className="text-xs text-gray-400 mt-1">{retailer.country}</p>
                )}
              </div>
              <button
                onClick={() => deleteMutation.mutate(retailer.id)}
                className="text-red-400 hover:text-red-600 text-xs"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}