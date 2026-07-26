import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchSuggestions } from '@/hooks/useCatalog'
import { Input } from '@/components/ui/primitives'

export function SearchBox({ onNavigate }) {
  const [query, setQuery] = useState('')
  const { data: suggestions } = useSearchSuggestions(query)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    onNavigate?.()
  }

  return (
    <div className="relative mx-auto max-w-xl">
      <form onSubmit={handleSubmit}>
        <Input
          type="search"
          placeholder="Search for ghee, oils, honey..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search products"
          autoFocus
        />
      </form>
      {suggestions?.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full rounded-lg border border-forest-100 bg-white shadow-lg">
          {suggestions.map((p) => (
            <li key={p.id}>
              <button
                className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-forest-50"
                onClick={() => {
                  navigate(`/products/${p.slug}`)
                  onNavigate?.()
                }}
              >
                {p.primary_image && <img src={p.primary_image} alt="" className="size-8 rounded object-cover" />}
                {p.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
