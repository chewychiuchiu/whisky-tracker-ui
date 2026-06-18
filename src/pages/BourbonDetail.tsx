import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteWhisky, getWhiskyPrices, updateWhisky, scrapeWhiskyPrices } from '../api/whiskies'
import type { Whisky, RetailerPriceHistory } from '../types'
import EditWhiskyModal from '../components/EditWhiskyModal'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const COLORS = ['#92400e', '#1d4ed8', '#15803d', '#7e22ce', '#b45309', '#0f766e']
const RANGES = ['6m', '1y', 'All'] as const
type Range = typeof RANGES[number]

function filterByRange(data: { price: number; recordedAt: string }[], range: Range) {
  if (range === 'All') return data
  const now = new Date()
  const cutoff = new Date()
  if (range === '6m') cutoff.setMonth(now.getMonth() - 6)
  if (range === '1y') cutoff.setFullYear(now.getFullYear() - 1)
  return data.filter(d => new Date(d.recordedAt) >= cutoff)
}

export default function BourbonDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [range, setRange] = useState<Range>('All')
  const queryClient = useQueryClient()
  const [showEdit, setShowEdit] = useState(false)

  const { data, isLoading, isError } = useQuery({
  queryKey: ['whisky-prices', id],
  queryFn: () => getWhiskyPrices(parseInt(id!)),
  refetchInterval: 5000, // refetch every 5 seconds
  refetchIntervalInBackground: false,
})

  const updateMutation = useMutation({
    mutationFn: async (formData: Partial<Whisky>) => {
      await updateWhisky(data!.whisky.id, formData)
      await scrapeWhiskyPrices(data!.whisky.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whisky-prices', id] })
      setShowEdit(false)
    },
  })

  const refreshMutation = useMutation({
    mutationFn: () => scrapeWhiskyPrices(parseInt(id!)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whisky-prices', id] })
    },
  })

  if (isLoading) return <div className="p-8 text-gray-400">Loading...</div>
  if (isError || !data) return <div className="p-8 text-red-400">Failed to load data.</div>

  const { whisky, retailers } = data

  const retailRetailers = retailers.filter(r => r.retailer.name !== 'Bottle Blue Book (Auction)')

  const allDates = Array.from(
    new Set(
      retailRetailers.flatMap(r =>
        filterByRange(r.priceHistory, range).map(s =>
          new Date(s.recordedAt).toLocaleDateString()
        )
      )
    )
  ).sort()

  const chartData = allDates.map(date => {
    const point: Record<string, string | number> = { date }
    retailRetailers.forEach(r => {
      const match = filterByRange(r.priceHistory, range).find(
        s => new Date(s.recordedAt).toLocaleDateString() === date
      )
      if (match) point[r.retailer.name] = match.price
    })
    return point
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="text-sm text-amber-700 hover:underline mb-6 flex items-center gap-1"
      >
        ← Back to search
      </button>

      {/* Header */}
      <div className="flex gap-6 mb-8">
        <div className="w-24 h-24 bg-amber-50 rounded-xl flex items-center justify-center text-5xl shrink-0 overflow-hidden">
          {whisky.imageUrl ? (
            <img
              src={whisky.imageUrl}
              alt={whisky.name}
              className="w-full h-full object-contain p-1"
            />
          ) : (
            <span>🥃</span>
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{whisky.name}</h1>
              <p className="text-gray-500 text-sm mt-1">{whisky.distillery} · {whisky.country}</p>
            </div>
            <div className="flex gap-2">
                <button
                onClick={() => refreshMutation.mutate()}
                disabled={refreshMutation.isPending}
                className="text-xs text-green-600 hover:text-green-800 border border-green-200 hover:border-green-400 px-3 py-1 rounded-full transition-colors disabled:opacity-50"
              >
                {refreshMutation.isPending ? 'Refreshing...' : '↻ Refresh Prices'}
              </button>
              <button
                onClick={() => setShowEdit(true)}
                className="text-xs text-amber-600 hover:text-amber-800 border border-amber-200 hover:border-amber-400 px-3 py-1 rounded-full transition-colors"
              >
                Edit
              </button>
              <button
                onClick={async () => {
                  await deleteWhisky(whisky.id)
                  navigate('/')
                }}
                className="text-xs text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-3 py-1 rounded-full transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            {whisky.ageYears && (
              <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
                {whisky.ageYears} yr
              </span>
            )}
            {whisky.bottledYear && (
              <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
                Bottled {whisky.bottledYear}
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

      {/* Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-700">Price History</h2>
          <div className="flex gap-1">
            {RANGES.map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                  range === r
                    ? 'bg-amber-700 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
            No price data for this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
              <Tooltip formatter={(v) => [`$${v}`, '']} />
              <Legend />
              {retailRetailers.map((r, i) => (
                <Line
                  key={r.retailer.id}
                  type="monotone"
                  dataKey={r.retailer.name}
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

    <AuctionChart retailers={retailers} />

      {/* Current prices table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Retailer</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Current Price</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">In Stock</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Link</th>
            </tr>
          </thead>
          <tbody>
            {retailers.filter(r => r.retailer.name !== 'Bottle Blue Book (Auction)').map(r => (
              <tr key={r.retailer.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-amber-700 font-semibold">
                  {r.latestPrice ? `$${Number(r.latestPrice).toFixed(2)}` : '—'}
                </td>
                <td className="px-4 py-3">
                  {r.inStock ? (
                    <span className="text-green-600 font-medium">In Stock</span>
                  ) : (
                    <span className="text-red-400">Out of Stock</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  
                    <a href={r.productUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-700 hover:underline"
                  >
                    View →
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showEdit && (
        <EditWhiskyModal
          whisky={whisky}
          onClose={() => setShowEdit(false)}
          onSave={formData => updateMutation.mutate(formData)}
        />
      )}
    </div>
  )

  function AuctionChart({ retailers }: { retailers: RetailerPriceHistory[] }) {
  const auctionData = retailers.find(r =>
    r.retailer.name === 'Bottle Blue Book (Auction)'
  )

  if (!auctionData || auctionData.priceHistory.length === 0) {
    return null
  }

  const chartData = auctionData.priceHistory.map(s => ({
    date: new Date(s.recordedAt).toLocaleDateString(),
    price: Number(s.price),
  }))


  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-semibold text-gray-700">Secondary Market / Auction Prices</h2>
          <p className="text-xs text-gray-400 mt-0.5">Last sold prices from Bottle Blue Book</p>
        </div>
        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
          Auction Data
        </span>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
          <Tooltip formatter={(v) => [`$${v}`, 'Last Sold']} />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#7e22ce"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-3 text-xs text-gray-400">
        Latest sale: <span className="font-medium text-gray-600">
          ${Number(auctionData.latestPrice).toFixed(2)}
        </span>
      </div>
    </div>
  )
}
}