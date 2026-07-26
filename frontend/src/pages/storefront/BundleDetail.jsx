import { useParams } from 'react-router-dom'
import { useBundle } from '@/hooks/useCatalog'
import { useAddToCart } from '@/hooks/useCart'
import { Button } from '@/components/ui/Button'
import { PageLoader } from '@/components/ui/PageLoader'
import { Card } from '@/components/ui/primitives'
import { Section } from '@/components/ui/layout'
import { Seo } from '@/components/storefront/Seo'
import { useUiStore } from '@/store/uiStore'

export default function BundleDetail() {
  const { slug } = useParams()
  const { data: bundle, isLoading } = useBundle(slug)
  const addToCart = useAddToCart()
  const pushToast = useUiStore((s) => s.pushToast)

  if (isLoading) return <PageLoader />
  if (!bundle) return null

  const handleAddBundle = async () => {
    for (const item of bundle.items) {
      // eslint-disable-next-line no-await-in-loop
      await addToCart.mutateAsync({ variantId: item.variant.id, quantity: item.quantity, bundleId: bundle.id })
    }
    pushToast(`${bundle.name} added to cart`)
  }

  return (
    <Section size="narrow" spacing="md">
      <Seo title={`${bundle.name} — EKAS Healthy Foods`} description={bundle.description} />
      {bundle.image && <img src={bundle.image} alt="" className="aspect-video w-full rounded-2xl object-cover" />}
      <h1 className="mt-6 text-3xl">{bundle.name}</h1>
      <p className="mt-2 text-earth-700">{bundle.description}</p>

      <div className="mt-6 space-y-3">
        {bundle.items.map((item) => (
          <Card key={item.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium text-forest-800">{item.product_name}</p>
              <p className="text-sm text-earth-600">
                {item.variant.label} × {item.quantity}
              </p>
            </div>
            <p className="text-sm text-earth-500 line-through">₹{Number(item.variant.mrp * item.quantity).toFixed(0)}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between rounded-2xl bg-forest-50 p-5">
        <div>
          <p className="text-sm text-earth-600">Combo price</p>
          <p className="text-2xl font-semibold text-forest-800">₹{Number(bundle.bundle_price).toFixed(0)}</p>
          <p className="text-sm text-leaf-600">You save ₹{Number(bundle.items_mrp_total - bundle.bundle_price).toFixed(0)}</p>
        </div>
        <Button size="lg" onClick={handleAddBundle} loading={addToCart.isPending}>
          Add Combo to Cart
        </Button>
      </div>
    </Section>
  )
}
