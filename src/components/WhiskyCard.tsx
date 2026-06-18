import type { Whisky } from '../types'

interface Props {
  whisky: Whisky
  onDelete?: (id: number) => void
}

export default function WhiskyCard({ whisky, onDelete }: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 border border-amber-100">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-800">{whisky.name}</h3>
          <p className="text-sm text-gray-500">{whisky.distillery}</p>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(whisky.id)}
            className="text-red-400 hover:text-red-600 text-xs"
          >
            Delete
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mt-1">
        {whisky.ageYears && (
          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
            {whisky.ageYears} yr
          </span>
        )}
        {whisky.abv && (
          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
            {whisky.abv}% ABV
          </span>
        )}
        {whisky.type && (
          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
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
  )
}