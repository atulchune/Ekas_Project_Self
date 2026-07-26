import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSubscribeNewsletter } from '@/hooks/useContent'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/primitives'
import { PageContainer } from '@/components/ui/layout'

const FOOTER_LINKS = [
  {
    heading: 'Shop',
    links: [
      { to: '/products', label: 'All Products' },
      { to: '/categories/ghee', label: 'Ghee' },
      { to: '/categories/wood-pressed-oils', label: 'Wood-Pressed Oils' },
      { to: '/categories/honey', label: 'Honey' },
      { to: '/combos', label: 'Combo Packs' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { to: '/our-story', label: 'Our Story' },
      { to: '/our-process', label: 'Our Process' },
      { to: '/women-behind-ekas', label: 'Women Behind EKAS' },
      { to: '/blog', label: 'Blog' },
      { to: '/recipes', label: 'Recipes' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { to: '/contact', label: 'Contact Us' },
      { to: '/faq', label: 'FAQ' },
      { to: '/shipping-policy', label: 'Shipping Policy' },
      { to: '/return-refund-policy', label: 'Return & Refund Policy' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { to: '/privacy-policy', label: 'Privacy Policy' },
      { to: '/terms-and-conditions', label: 'Terms & Conditions' },
    ],
  },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const subscribe = useSubscribeNewsletter()
  const [status, setStatus] = useState(null)

  const handleSubscribe = (e) => {
    e.preventDefault()
    subscribe.mutate(email, {
      onSuccess: () => {
        setStatus('Thank you for subscribing!')
        setEmail('')
      },
      onError: () => setStatus('Could not subscribe right now, please try again later.'),
    })
  }

  return (
    <footer className="mt-16 border-t border-forest-100 bg-forest-900 text-ivory">
      <PageContainer className="py-12">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <img src="/brand/ekas-logo-white.png" alt="EKAS Healthy Foods" className="h-14 w-auto" />
            <p className="mt-3 max-w-sm text-sm text-ivory/70">
              Pure. Traditional. Empowering. Traditionally prepared foods supporting rural women and farmers.
            </p>
            <ul className="mt-4 space-y-1 text-sm text-ivory/70">
              <li>
                <a href="tel:+919081238888" className="hover:text-ivory">
                  +91 90812 38888
                </a>
              </li>
              <li>
                <a href="mailto:wecare@ekashealthyfoods.com" className="break-words hover:text-ivory">
                  wecare@ekashealthyfoods.com
                </a>
              </li>
              <li>Plot No. 39, Diamond Industrial Estate, Daman 396210</li>
            </ul>
            <form onSubmit={handleSubscribe} className="mt-4 flex max-w-sm gap-2">
              <Input
                type="email"
                required
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/95"
                aria-label="Email for newsletter"
              />
              <Button type="submit" variant="secondary" loading={subscribe.isPending}>
                Join
              </Button>
            </form>
            {status && <p className="mt-2 text-xs text-ghee-300">{status}</p>}
          </div>

          {FOOTER_LINKS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-ghee-300">{col.heading}</h3>
              <ul className="mt-3 flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm text-ivory/80 hover:text-ivory">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-ivory/10 pt-6 text-xs text-ivory/50">
          © {new Date().getFullYear()} EKAS Healthy Foods. All rights reserved.
        </div>
      </PageContainer>
    </footer>
  )
}
