import { useRef, useState } from 'react'

interface Props {
  onScan: (data: {
    name: string
    distillery: string
    country: string
    region?: string
    ageYears?: number
    abv?: number
    type?: string
    sizeMl?: number
    bottledYear?: number
  }) => void
  onClose: () => void
}

export default function LabelScanner({ onScan, onClose }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError('')

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve((reader.result as string).split(',')[1])
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      console.log('API Key:', import.meta.env.VITE_GEMINI_API_KEY)

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    inline_data: {
                      mime_type: file.type,
                      data: base64,
                    },
                  },
                  {
                    text: `Analyze this bourbon/whiskey bottle label and extract the following information. Return ONLY a raw JSON object with no markdown formatting, no backticks, no explanation. Just the JSON.

{
  "name": "full product name",
  "distillery": "distillery or brand name",
  "country": "country of origin",
  "region": "region if mentioned or null",
  "ageYears": age as integer or null,
  "abv": ABV percentage as number (not proof) or null,
  "type": "type e.g. Bourbon, Rye Whiskey, Single Malt, Tennessee Whiskey or null",
  "sizeMl": bottle size in ml as integer or null,
  "bottledYear": bottled year as integer or null
}`,
                  },
                ],
              },
            ],
          }),
        }
      )

      const data = await response.json()
      console.log('Full Gemini response:', JSON.stringify(data))
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (!text) throw new Error('No response from Gemini')

      console.log('Gemini response:', text)

      // Clean up response in case it has markdown
      const clean = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)

      console.log('Parsed:', parsed)
      onScan(parsed)
    } catch (err: any) {
      console.error('Full error:', err)
      console.error('Error message:', err.message)
      setError(`Error: ${err.message}`)
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center gap-6 px-8">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-2xl font-bold"
      >
        ×
      </button>

      <div className="text-center">
        <p className="text-white text-lg font-semibold mb-2">Scan Label</p>
        <p className="text-gray-400 text-sm">Take a photo of the bottle label</p>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-amber-400 text-sm">Reading label...</p>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="w-48 h-48 bg-amber-800 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-amber-700 transition-colors"
        >
          <span className="text-6xl mb-2">📷</span>
          <span className="text-white text-sm font-medium">Take Photo</span>
        </div>
      )}

      {error && (
        <p className="text-red-400 text-sm text-center">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCapture}
        className="hidden"
      />

      <p className="text-gray-500 text-xs text-center">
        Point your camera at the front label of the bottle
      </p>
    </div>
  )
}