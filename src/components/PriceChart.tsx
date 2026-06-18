import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { PriceSnapshot } from '../types'

interface Props {
  snapshots: PriceSnapshot[]
}

export default function PriceChart({ snapshots }: Props) {
  const data = snapshots.map(s => ({
    date: new Date(s.recordedAt).toLocaleDateString(),
    price: Number(s.price),
  }))

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
        No price history yet
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
        <Tooltip formatter={(v) => [`$${v}`, 'Price']} />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#92400e"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}