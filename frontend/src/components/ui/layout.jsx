import clsx from 'clsx'

// Shared layout system -- one source of truth for container widths, gutters,
// and section spacing so every storefront page sits on the same grid.

const CONTAINER_SIZES = {
  // Browse/listing surfaces: home, shop, category, search, product detail.
  wide: 'max-w-[1440px]',
  // Task-focused surfaces: cart, checkout, account.
  default: 'max-w-6xl',
  // Long-form reading: static/policy pages, section intros.
  narrow: 'max-w-3xl',
  // Single-column forms: auth, 404.
  form: 'max-w-md',
}

const GUTTERS = 'px-4 sm:px-6 lg:px-8'

export function PageContainer({ size = 'wide', as: Component = 'div', className, children, ...props }) {
  return (
    <Component className={clsx('mx-auto w-full', GUTTERS, CONTAINER_SIZES[size], className)} {...props}>
      {children}
    </Component>
  )
}

const SECTION_SPACING = {
  none: '',
  sm: 'py-8',
  md: 'py-10',
  lg: 'py-14',
  xl: 'py-16 md:py-24',
}

export function Section({ as: Component = 'section', size = 'wide', spacing = 'lg', className, containerClassName, children, ...props }) {
  return (
    <Component className={clsx(SECTION_SPACING[spacing], className)} {...props}>
      <PageContainer size={size} className={containerClassName}>
        {children}
      </PageContainer>
    </Component>
  )
}

export function PageHeader({ breadcrumb, title, subtitle, actions, className }) {
  return (
    <div className={clsx('flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="min-w-0">
        {breadcrumb}
        <h1 className="text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-earth-600">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  )
}

export function SectionHeader({ eyebrow, title, subtitle, align = 'center', className }) {
  return (
    <div
      className={clsx(
        'mb-8 max-w-2xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      {eyebrow && <p className="text-sm font-medium uppercase tracking-wide text-leaf-600">{eyebrow}</p>}
      <h2 className="mt-1 text-3xl">{title}</h2>
      {subtitle && <p className="mt-3 text-earth-700">{subtitle}</p>}
    </div>
  )
}

export function ContentGrid({ className, children, ...props }) {
  return (
    <div className={clsx('grid grid-cols-1 items-stretch gap-6 sm:gap-8 md:grid-cols-2', className)} {...props}>
      {children}
    </div>
  )
}

// The one grid every product-card surface (home, shop, category, search,
// related products, recommendations) should render through.
export function ProductGrid({ className, children, ...props }) {
  return (
    <div
      className={clsx('grid grid-cols-2 items-stretch gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function FormContainer({ size = 'form', spacing = 'xl', className, children }) {
  return (
    <PageContainer size={size} className={clsx(SECTION_SPACING[spacing], className)}>
      {children}
    </PageContainer>
  )
}

// Two-region layout for account/checkout/contact-style pages: a primary
// content column plus an aside (nav, order summary, contact details).
// `stickyAside` keeps the aside pinned under the header on large screens
// only, so it never fights the page for space on mobile/tablet.
export function SidebarLayout({
  aside,
  asideSide = 'end',
  ratio = '1:2',
  stickyAside = false,
  gap = 'gap-8',
  className,
  children,
}) {
  const cols = ratio === '1:3' ? 'md:grid-cols-4' : 'md:grid-cols-3'
  const asideSpan = ratio === '1:3' ? 'md:col-span-1' : 'md:col-span-1'
  const mainSpan = ratio === '1:3' ? 'md:col-span-3' : 'md:col-span-2'
  const asideOrder = asideSide === 'start' ? 'md:order-first' : 'md:order-last'

  return (
    <div className={clsx('grid grid-cols-1', cols, gap, className)}>
      <div className={mainSpan}>{children}</div>
      <div className={clsx(asideSpan, asideOrder, stickyAside && 'lg:sticky lg:top-24 lg:self-start')}>{aside}</div>
    </div>
  )
}
