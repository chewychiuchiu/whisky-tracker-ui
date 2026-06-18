import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getListings, createListing, deleteListing } from '../api/listings'
import { getWhiskies } from '../api/whiskies'
import { getRetailers } from '../api/retailers'
import { createSnapshot } from '../api/snapshots'
import PriceChart from '../components/PriceChart'

export default function Listings() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState({ whiskyId: '', retailerId: '', productUrl: '', sku: '' })
  const [priceInputs, setPriceInputs] = useState<Record<number, string>>({})

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['listings'],
    queryFn: getListings,
  })

  const { data: whiskies = [] } = useQuery({
    queryKey: ['whiskies'],
    queryFn: getWhiskies,
  })

  const { data: retailers = [] } = useQuery({
    queryKey: ['retailers'],
    queryFn: getRetailers,
  })

  const createMutation = useMutation({
    mutationFn: createListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] })
      setForm({ whiskyId: '', retailerId: '', productUrl: '', sku: '' })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteListing,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['listings'] }),
  })

  const snapshotMutation = useMutation({
    mutationFn: createSnapshot,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['listings'] }),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate({
      whiskyId: parseInt(form.whiskyId),
      retailerId: parseInt(form.retailerId),
      productUrl: form.productUrl,
      sku: form.sku || undefined,
      inStock: true,
    })
  }

  const handleAddPrice = (listingId: number) => {
    const price = parseFloat(priceInputs[listingId] || '')
    if (!price) return
    snapshotMutation.mutate({ listingId, price })
    setPriceInputs(prev => ({ ...prev, [listingId]: '' }))
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Listings</h1>

      <div className="bg-white rounded-xl shadow p-6 border border-amber-100 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Add Listing</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <select
            required
            value={form.whiskyId}
            onChange={e => setForm({ ...form, whiskyId: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="">Select Whisky *</option>
            {whiskies.map(w => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
          <select
            required
            value={form.retailerId}
            onChange={e => setForm({ ...form, retailerId: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="">Select Retailer *</option>
            {retailers.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          <input
            required
            placeholder="Product URL *"
            value={form.productUrl}
            onChange={e => setForm({ ...form, productUrl: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <input
            placeholder="SKU (optional)"
            value={form.sku}
            onChange={e => setForm({ ...form, sku: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="md:col-span-2 bg-amber-800 text-white rounded-lg py-2 text-sm font-medium hover:bg-amber-900 transition-colors disabled:opacity-50"
          >
            {createMutation.isPending ? 'Adding...' : 'Add Listing'}
          </button>
        </form>
      </div>

      <div>
        {isLoading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : listings.length === 0 ? (
          <p className="text-gray-400 text-sm">No listings yet. Add one above!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {listings.map(listing => (
              <div key={listing.id} className="bg-white rounded-xl shadow p-4 border border-amber-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-gray-800">{listing.whisky?.name}</p>
                    <p className="text-xs text-gray-500">{listing.retailer?.name}</p>
                    
                      <a href={listing.productUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-amber-700 hover:underline"
                    >
                      View product page
                    </a>
                  </div>
                  <button
                    onClick={() => deleteMutation.mutate(listing.id)}
                    className="text-red-400 hover:text-red-600 text-xs"
                  >
                    Delete
                  </button>
                </div>
                <div className="flex gap-2 mb-3">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Record price ($)"
                    value={priceInputs[listing.id] || ''}
                    onChange={e => setPriceInputs(prev => ({ ...prev, [listing.id]: e.target.value }))}
                    className="border rounded-lg px-3 py-1.5 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <button
                    onClick={() => handleAddPrice(listing.id)}
                    className="bg-amber-800 text-white rounded-lg px-3 py-1.5 text-sm hover:bg-amber-900 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <PriceChart snapshots={listing.snapshots ?? []} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}