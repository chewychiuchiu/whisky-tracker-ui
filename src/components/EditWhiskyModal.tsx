import { useState } from 'react'
import type { Whisky } from '../types'

interface Props {
  whisky: Whisky
  onSave: (data: Partial<Whisky>) => void
  onClose: () => void
}

export default function EditWhiskyModal({ whisky, onSave, onClose }: Props) {
  const [form, setForm] = useState({
    name: whisky.name || '',
    distillery: whisky.distillery || '',
    country: whisky.country || '',
    region: whisky.region || '',
    ageYears: whisky.ageYears?.toString() || '',
    abv: whisky.abv?.toString() || '',
    type: whisky.type || '',
    sizeMl: whisky.sizeMl?.toString() || '',
    bottledYear: whisky.bottledYear?.toString() || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-800">Edit Whisky</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="text-xs font-medium text-gray-500 mb-1 block">Name *</label>
            <input
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Distillery *</label>
            <input
              required
              value={form.distillery}
              onChange={e => setForm({ ...form, distillery: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Country *</label>
            <input
              required
              value={form.country}
              onChange={e => setForm({ ...form, country: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Region</label>
            <input
              value={form.region}
              onChange={e => setForm({ ...form, region: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Age (years)</label>
            <input
              type="number"
              value={form.ageYears}
              onChange={e => setForm({ ...form, ageYears: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">ABV %</label>
            <input
              type="number"
              step="0.1"
              value={form.abv}
              onChange={e => setForm({ ...form, abv: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Type</label>
            <input
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
              placeholder="e.g. Single Malt"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Size (ml)</label>
            <input
              type="number"
              value={form.sizeMl}
              onChange={e => setForm({ ...form, sizeMl: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Bottled Year</label>
            <input
              type="number"
              value={form.bottledYear}
              onChange={e => setForm({ ...form, bottledYear: e.target.value })}
              placeholder="e.g. 2023"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div className="col-span-2 flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-600 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-amber-800 text-white rounded-lg py-2 text-sm font-medium hover:bg-amber-900 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}