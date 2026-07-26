export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-label="Loading">
      <div className="size-8 animate-spin rounded-full border-4 border-forest-200 border-t-forest-700" />
    </div>
  )
}
