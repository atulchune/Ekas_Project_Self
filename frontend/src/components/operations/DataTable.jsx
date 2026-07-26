import { useState } from 'react'
import { Download, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/primitives'

function toCsv(columns, rows) {
  const header = columns.map((c) => `"${c.header}"`).join(',')
  const lines = rows.map((row) =>
    columns
      .map((c) => {
        const value = c.csv ? c.csv(row) : c.accessor ? c.accessor(row) : row[c.key]
        return `"${String(value ?? '').replace(/"/g, '""')}"`
      })
      .join(',')
  )
  return [header, ...lines].join('\n')
}

function downloadCsv(filename, content) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

/**
 * Generic server-paginated data table used across nearly every Operations
 * Portal list screen: search box, column-driven rendering, row actions,
 * pagination, and a client-side CSV export of the currently loaded page.
 */
export function DataTable({
  columns,
  data,
  isLoading,
  search,
  onSearchChange,
  page,
  onPageChange,
  numPages,
  exportFilename = 'export.csv',
  emptyMessage = 'No records found.',
  rowActions,
}) {
  const [localSearch, setLocalSearch] = useState(search || '')

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    onSearchChange?.(localSearch)
  }

  return (
    <div className="rounded-2xl border border-forest-100 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-forest-100 p-4">
        {onSearchChange ? (
          <form onSubmit={handleSearchSubmit} className="flex max-w-sm flex-1 gap-2">
            <Input
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search..."
              aria-label="Search"
            />
            <Button type="submit" variant="outline" size="sm">
              <Search className="size-4" aria-hidden="true" />
            </Button>
          </form>
        ) : (
          <div />
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => downloadCsv(exportFilename, toCsv(columns, data || []))}
          disabled={!data?.length}
        >
          <Download className="size-4" aria-hidden="true" /> Export CSV
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-forest-100 text-xs uppercase tracking-wide text-earth-500">
            <tr>
              {columns.map((col) => (
                <th key={col.key} scope="col" className="whitespace-nowrap px-4 py-3 font-medium">
                  {col.header}
                </th>
              ))}
              {rowActions && (
                <th scope="col" className="px-4 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-50">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-earth-500">
                  Loading...
                </td>
              </tr>
            ) : data?.length ? (
              data.map((row, i) => (
                <tr key={row.id ?? i} className="hover:bg-forest-50/50">
                  {columns.map((col) => (
                    <td key={col.key} className="whitespace-nowrap px-4 py-3">
                      {col.render ? col.render(row) : col.accessor ? col.accessor(row) : String(row[col.key] ?? '')}
                    </td>
                  ))}
                  {rowActions && <td className="whitespace-nowrap px-4 py-3 text-right">{rowActions(row)}</td>}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-earth-500">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {numPages > 1 && (
        <nav className="flex items-center justify-center gap-2 border-t border-forest-100 p-3" aria-label="Pagination">
          {Array.from({ length: numPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => onPageChange(i + 1)}
              aria-current={page === i + 1 ? 'page' : undefined}
              className={`size-8 rounded-full text-xs font-medium ${
                page === i + 1 ? 'bg-forest-700 text-ivory' : 'bg-forest-50 text-forest-700 hover:bg-forest-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </nav>
      )}
    </div>
  )
}
