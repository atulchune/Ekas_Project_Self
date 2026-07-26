import clsx from 'clsx'
import { forwardRef } from 'react'

const variants = {
  primary: 'bg-forest-700 text-ivory hover:bg-forest-800 disabled:bg-forest-300',
  secondary: 'bg-ghee-500 text-earth-900 hover:bg-ghee-700 disabled:bg-ghee-100',
  outline: 'border border-forest-700 text-forest-700 hover:bg-forest-50 disabled:opacity-50',
  ghost: 'text-forest-700 hover:bg-forest-50 disabled:opacity-50',
  danger: 'bg-terracotta-700 text-ivory hover:bg-terracotta-500 disabled:opacity-50',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
}

export const Button = forwardRef(function Button(
  { as: Component = 'button', variant = 'primary', size = 'md', className, loading, children, disabled, ...props },
  ref
) {
  return (
    <Component
      ref={ref}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ghee-500',
        variants[variant],
        sizes[size],
        (disabled || loading) && 'cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />}
      {children}
    </Component>
  )
})
