import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useMe } from '@/hooks/useAuth'
import { useUiStore } from '@/store/uiStore'
import { AnnouncementBar } from './AnnouncementBar'
import { SearchBox } from './SearchBox'
import { PageContainer } from '@/components/ui/layout'

const NAV_LINKS = [
  { to: '/products', label: 'Shop' },
  { to: '/categories/ghee', label: 'Ghee' },
  { to: '/categories/wood-pressed-oils', label: 'Wood-Pressed Oils' },
  { to: '/categories/honey', label: 'Honey' },
  { to: '/combos', label: 'Combos' },
  { to: '/our-process', label: 'Our Process' },
  { to: '/our-story', label: 'Our Story' },
  { to: '/recipes', label: 'Recipes' },
]

function IconLink({ to, label, count, children }) {
  return (
    <Link to={to} className="relative flex flex-col items-center p-2 text-earth-700 hover:text-forest-700" aria-label={label}>
      {children}
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-terracotta-700 text-[10px] font-medium text-ivory">
          {count}
        </span>
      )}
    </Link>
  )
}

export function Header() {
  const { data: cart } = useCart()
  const { data: me } = useMe()
  const [searchOpen, setSearchOpen] = useState(false)
  const mobileMenuOpen = useUiStore((s) => s.mobileMenuOpen)
  const setMobileMenuOpen = useUiStore((s) => s.setMobileMenuOpen)
  const itemCount = cart?.item_count ?? 0

  return (
    <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur">
      <AnnouncementBar />
      <PageContainer className="flex h-16 items-center justify-between gap-4">
        <button
          className="p-2 lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="size-6 text-forest-800" aria-hidden="true" />
        </button>

        <Link to="/" aria-label="EKAS Healthy Foods home" className="shrink-0">
          <img src="/brand/ekas-logo-black.png" alt="EKAS Healthy Foods" className="h-10 w-auto" />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? 'text-forest-800' : 'text-earth-700 hover:text-forest-700'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button className="p-2 text-earth-700 hover:text-forest-700" aria-label="Search" onClick={() => setSearchOpen(!searchOpen)}>
            <Search className="size-5" aria-hidden="true" />
          </button>
          <IconLink to={me ? '/account/wishlist' : '/login'} label="Wishlist">
            <Heart className="size-5" aria-hidden="true" />
          </IconLink>
          <IconLink to={me ? '/account' : '/login'} label="Account">
            <User className="size-5" aria-hidden="true" />
          </IconLink>
          <IconLink to="/cart" label="Cart" count={itemCount}>
            <ShoppingBag className="size-5" aria-hidden="true" />
          </IconLink>
        </div>
      </PageContainer>

      {searchOpen && (
        <div className="border-t border-forest-100 bg-white py-3">
          <PageContainer>
            <SearchBox onNavigate={() => setSearchOpen(false)} />
          </PageContainer>
        </div>
      )}

      {mobileMenuOpen && (
        <nav className="border-t border-forest-100 bg-white py-3 lg:hidden" aria-label="Mobile">
          <PageContainer as="ul" className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-earth-800">
                  {link.label}
                </NavLink>
              </li>
            ))}
          </PageContainer>
        </nav>
      )}
    </header>
  )
}
