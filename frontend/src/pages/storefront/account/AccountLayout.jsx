import { NavLink, Outlet } from 'react-router-dom'
import { useLogout, useMe } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { Section, SidebarLayout } from '@/components/ui/layout'

const NAV = [
  { to: '/account', label: 'Dashboard', end: true },
  { to: '/account/orders', label: 'Orders' },
  { to: '/account/addresses', label: 'Addresses' },
  { to: '/account/wishlist', label: 'Wishlist' },
  { to: '/account/recently-viewed', label: 'Recently Viewed' },
  { to: '/account/profile', label: 'Profile & Notifications' },
]

export default function AccountLayout() {
  const { data: me } = useMe()
  const logout = useLogout()
  const navigate = useNavigate()

  return (
    <Section size="default" spacing="md">
      <h1 className="text-3xl">My Account</h1>
      {me?.user && <p className="mt-1 text-earth-600">{me.user.email}</p>}
      <SidebarLayout
        className="mt-8"
        ratio="1:3"
        asideSide="start"
        aside={
          <nav className="space-y-1" aria-label="Account">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive ? 'bg-forest-700 text-ivory' : 'text-earth-700 hover:bg-forest-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <button
              className="mt-2 block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-terracotta-700 hover:bg-terracotta-300/10"
              onClick={() => logout.mutate(undefined, { onSuccess: () => navigate('/') })}
            >
              Log out
            </button>
          </nav>
        }
      >
        <Outlet />
      </SidebarLayout>
    </Section>
  )
}
