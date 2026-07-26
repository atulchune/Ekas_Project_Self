import { Outlet } from 'react-router-dom'
import { Header } from '@/components/storefront/Header'
import { Footer } from '@/components/storefront/Footer'
import { Toaster } from '@/components/ui/Toaster'
import { MobilePurchaseBarPortal } from '@/components/storefront/MobilePurchaseBar'

export function StorefrontLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      <MobilePurchaseBarPortal />
    </div>
  )
}
