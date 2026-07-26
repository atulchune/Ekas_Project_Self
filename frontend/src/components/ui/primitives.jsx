import clsx from 'clsx'

export function Badge({ tone = 'forest', children, className }) {
  const tones = {
    forest: 'bg-forest-100 text-forest-700',
    ghee: 'bg-ghee-100 text-earth-900',
    terracotta: 'bg-terracotta-300/40 text-terracotta-700',
    earth: 'bg-earth-100 text-earth-700',
  }
  return (
    <span className={clsx('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', tones[tone], className)}>
      {children}
    </span>
  )
}

export function PriceTag({ price, mrp, size = 'md' }) {
  const hasDiscount = mrp && Number(mrp) > Number(price)
  const textSize = size === 'lg' ? 'text-2xl' : 'text-base'
  return (
    <div className="flex items-baseline gap-2">
      <span className={clsx('font-semibold text-forest-800', textSize)}>₹{Number(price).toFixed(0)}</span>
      {hasDiscount && (
        <>
          <span className="text-sm text-earth-500 line-through">₹{Number(mrp).toFixed(0)}</span>
          <span className="text-xs font-medium text-terracotta-700">
            {Math.round(((mrp - price) / mrp) * 100)}% off
          </span>
        </>
      )}
    </div>
  )
}

export function Card({ className, children, as: Component = 'div', ...props }) {
  return (
    <Component
      className={clsx('rounded-2xl border border-forest-100 bg-white shadow-sm', className)}
      {...props}
    >
      {children}
    </Component>
  )
}

export function Skeleton({ className }) {
  return <div className={clsx('animate-pulse rounded-md bg-forest-100/60', className)} aria-hidden="true" />
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-forest-200 bg-forest-50/40 px-6 py-16 text-center">
      <h3 className="text-lg font-semibold text-forest-800">{title}</h3>
      {description && <p className="max-w-md text-sm text-earth-700">{description}</p>}
      {action}
    </div>
  )
}

export function ErrorState({ message = 'Something went wrong. Please try again.', onRetry }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-terracotta-300 bg-terracotta-300/10 px-6 py-10 text-center">
      <p className="text-terracotta-700">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="text-sm font-medium underline underline-offset-2">
          Try again
        </button>
      )}
    </div>
  )
}

export function Field({ label, htmlFor, error, children, hint }) {
  return (
    <div className="flex flex-col gap-1.5 text-left">
      {label && (
        <label htmlFor={htmlFor} className="text-sm font-medium text-earth-900">
          {label}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-earth-500">{hint}</p>}
      {error && (
        <p className="text-xs text-terracotta-700" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export function Input({ className, invalid, ...props }) {
  return (
    <input
      className={clsx(
        'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-earth-900 placeholder:text-earth-400',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ghee-500',
        invalid ? 'border-terracotta-500' : 'border-forest-200',
        className
      )}
      {...props}
    />
  )
}

export function Textarea({ className, invalid, ...props }) {
  return (
    <textarea
      className={clsx(
        'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-earth-900 placeholder:text-earth-400',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ghee-500',
        invalid ? 'border-terracotta-500' : 'border-forest-200',
        className
      )}
      {...props}
    />
  )
}

export function Select({ className, invalid, children, ...props }) {
  return (
    <select
      className={clsx(
        'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-earth-900',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ghee-500',
        invalid ? 'border-terracotta-500' : 'border-forest-200',
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
}

export function StarRating({ value = 0, count }) {
  const stars = [1, 2, 3, 4, 5]
  return (
    <div className="flex items-center gap-1" aria-label={`Rated ${value} out of 5`}>
      <div className="flex text-ghee-500">
        {stars.map((s) => (
          <span key={s} aria-hidden="true">
            {s <= Math.round(value) ? '★' : '☆'}
          </span>
        ))}
      </div>
      {count != null && <span className="text-xs text-earth-500">({count})</span>}
    </div>
  )
}
