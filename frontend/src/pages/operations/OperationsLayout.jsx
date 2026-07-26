import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  Bell,
  BookOpen,
  Boxes,
  FileText,
  Gift,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  Layers,
  Mail,
  Menu,
  Package,
  Percent,
  Receipt,
  RotateCcw,
  ScrollText,
  Settings as SettingsIcon,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  Users,
  UserCog,
  X,
} from 'lucide-react'
import { hasPermission, useOpsLogout, useOpsMe } from '@/hooks/useOpsAuth'

const NAV = [
  { to: '/operations/dashboard', label: 'Dashboard', icon: LayoutDashboard, code: 'dashboard.view' },
  { to: '/operations/orders', label: 'Orders', icon: ShoppingCart, code: 'orders.view' },
  { to: '/operations/products', label: 'Products', icon: Package, code: 'products.view' },
  { to: '/operations/categories', label: 'Categories', icon: Layers, code: 'categories.view' },
  { to: '/operations/inventory', label: 'Inventory', icon: Boxes, code: 'inventory.view' },
  { to: '/operations/customers', label: 'Customers', icon: Users, code: 'customers.view' },
  { to: '/operations/payments', label: 'Payments', icon: Receipt, code: 'payments.view' },
  { to: '/operations/shipments', label: 'Shipments', icon: Truck, code: 'shipments.view' },
  { to: '/operations/returns', label: 'Returns & Refunds', icon: RotateCcw, code: 'returns.view' },
  { to: '/operations/coupons', label: 'Coupons & Offers', icon: Percent, code: 'coupons.view' },
  { to: '/operations/combos', label: 'Combo Packs', icon: Gift, code: 'combos.view' },
  { to: '/operations/reviews', label: 'Reviews', icon: Star, code: 'reviews.view' },
  { to: '/operations/homepage', label: 'Homepage Manager', icon: LayoutDashboard, code: 'homepage.view' },
  { to: '/operations/media', label: 'Media Library', icon: ImageIcon, code: 'media.view' },
  { to: '/operations/recipes', label: 'Recipes', icon: BookOpen, code: 'recipes.view' },
  { to: '/operations/blogs', label: 'Blogs', icon: FileText, code: 'blogs.view' },
  { to: '/operations/notifications', label: 'Notifications', icon: Bell, code: 'notifications.view' },
  { to: '/operations/newsletter', label: 'Newsletter', icon: Mail, code: 'newsletter.view' },
  { to: '/operations/enquiries', label: 'Contact Enquiries', icon: Inbox, code: 'enquiries.view' },
  { to: '/operations/reports', label: 'Reports', icon: BarChart3, code: 'reports.view' },
  { to: '/operations/staff', label: 'Staff & Roles', icon: UserCog, code: 'staff.view' },
  { to: '/operations/audit-logs', label: 'Audit Logs', icon: ScrollText, code: 'audit.view' },
  { to: '/operations/settings', label: 'Store Settings', icon: SettingsIcon, code: 'settings.view' },
]

export default function OperationsLayout() {
  const { data: me } = useOpsMe()
  const logout = useOpsLogout()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const visibleNav = NAV.filter((item) => hasPermission(me, item.code))
  const current = NAV.find((item) => location.pathname.startsWith(item.to))

  return (
    <div className="flex min-h-screen bg-forest-50/40 text-earth-900">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform overflow-y-auto border-r border-forest-100 bg-forest-900 text-ivory transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <p className="font-serif text-xl font-semibold">EKAS Operations</p>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
            <X className="size-5" />
          </button>
        </div>
        <nav className="space-y-1 px-3 pb-6" aria-label="Operations">
          {visibleNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive ? 'bg-ivory text-forest-800' : 'text-ivory/80 hover:bg-ivory/10'
                }`
              }
            >
              <item.icon className="size-4" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to="/operations/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                isActive ? 'bg-ivory text-forest-800' : 'text-ivory/80 hover:bg-ivory/10'
              }`
            }
          >
            <ShieldCheck className="size-4" aria-hidden="true" />
            Profile & Security
          </NavLink>
        </nav>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-forest-100 bg-white px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
              <Menu className="size-6" />
            </button>
            <div className="text-sm text-earth-500">
              <span>Operations</span> {current && <> / <span className="text-earth-800">{current.label}</span></>}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-earth-600 sm:inline">{me?.user?.email}</span>
            <button
              className="text-sm font-medium text-terracotta-700 underline"
              onClick={() => logout.mutate(undefined, { onSuccess: () => navigate('/operations/login') })}
            >
              Log out
            </button>
          </div>
        </header>
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export { NAV as OPERATIONS_NAV }
