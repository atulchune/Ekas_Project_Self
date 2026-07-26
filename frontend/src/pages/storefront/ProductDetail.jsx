import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useProduct } from '@/hooks/useCatalog'
import { useAddToCart, useToggleWishlist, useTrackRecentlyViewed, useWishlist } from '@/hooks/useCart'
import { useMe } from '@/hooks/useAuth'
import { useNotifyMe, useProductReviews, useSubmitReview } from '@/hooks/useContent'
import { usePincodeCheck } from '@/hooks/useCatalog'
import { Button } from '@/components/ui/Button'
import { Badge, Input, PriceTag, StarRating, Card } from '@/components/ui/primitives'
import { PageLoader } from '@/components/ui/PageLoader'
import { ProductCard } from '@/components/storefront/ProductCard'
import { ReviewForm } from '@/components/storefront/ReviewForm'
import { Seo } from '@/components/storefront/Seo'
import { Section, ProductGrid } from '@/components/ui/layout'
import { useUiStore } from '@/store/uiStore'

const PRODUCT_VIDEOS = {
  'a2-gir-cow-bilona-ghee': '/videos/a2-gir-cow-bilona-ghee.mp4',
  'wood-pressed-coconut-oil': '/videos/coconut-oil-press.mp4',
  'wood-pressed-groundnut-oil': '/videos/wood-pressed-groundnut-oil.mp4',
  'wood-pressed-mustard-oil': '/videos/mustard-field-golden-hour.mp4',
  'wood-pressed-sesame-oil': '/videos/wood-pressed-sesame-oil.mp4',
  'wood-pressed-sunflower-oil': '/videos/wood-pressed-sunflower-oil.mp4',
  'wood-pressed-almond-oil': '/videos/wood-pressed-almond-oil.mp4',
  'raw-forest-honey': '/videos/raw-forest-honey.mp4',
}

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { data: product, isLoading } = useProduct(slug)
  const { data: me } = useMe()
  const { data: wishlist } = useWishlist()
  const toggleWishlist = useToggleWishlist()
  const addToCart = useAddToCart()
  const trackViewed = useTrackRecentlyViewed()
  const notifyMe = useNotifyMe()
  const pincodeCheck = usePincodeCheck()
  const pushToast = useUiStore((s) => s.pushToast)
  const setStickyBuyBar = useUiStore((s) => s.setStickyBuyBar)

  const [selectedVariantId, setSelectedVariantId] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [pincode, setPincode] = useState('')
  const [pincodeResult, setPincodeResult] = useState(null)
  const [notifyEmail, setNotifyEmail] = useState('')

  const { data: reviewData } = useProductReviews(slug)
  const submitReview = useSubmitReview()

  useEffect(() => {
    if (product) trackViewed.mutate(product.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id])

  const variant = useMemo(() => {
    if (!product) return null
    return product.variants.find((v) => v.id === selectedVariantId) || product.variants.find((v) => v.is_default) || product.variants[0]
  }, [product, selectedVariantId])

  useEffect(() => {
    if (!variant) return
    setStickyBuyBar({
      name: product.name,
      price: variant.price,
      mrp: variant.mrp,
      disabled: variant.stock_status === 'out_of_stock',
      loading: addToCart.isPending,
      onAddToCart: () => handleAddToCart(),
    })
    return () => setStickyBuyBar(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant, quantity])

  if (isLoading) return <PageLoader />
  if (!product) return null

  const wishlistItem = wishlist?.find((w) => w.product.id === product.id)

  const handleAddToCart = () => {
    addToCart.mutate(
      { variantId: variant.id, quantity },
      {
        onSuccess: () => pushToast(`${product.name} added to cart`),
        onError: () => pushToast('Could not add to cart', 'error'),
      }
    )
  }

  const handleBuyNow = () => {
    addToCart.mutate(
      { variantId: variant.id, quantity },
      {
        onSuccess: () => navigate('/cart'),
      }
    )
  }

  const handleWishlist = () => {
    if (!me) return navigate('/login')
    toggleWishlist.mutate({ productId: product.id, wishlistItemId: wishlistItem?.id, add: !wishlistItem })
  }

  const handlePincodeCheck = async (e) => {
    e.preventDefault()
    try {
      const result = await pincodeCheck(pincode)
      setPincodeResult(result)
    } catch {
      setPincodeResult({ serviceable: false })
    }
  }

  const handleNotify = (e) => {
    e.preventDefault()
    notifyMe.mutate(
      { email: notifyEmail, variantId: variant.id },
      { onSuccess: () => pushToast("We'll email you when this is back in stock.") }
    )
  }

  const images = product.images?.length ? product.images : []

  return (
    <Section size="wide" spacing="none" className="py-10 pb-24 sm:pb-10">
      <Seo title={`${product.name} — EKAS Healthy Foods`} description={product.short_description} image={images[0]?.image} />
      <nav className="mb-6 text-sm text-earth-500" aria-label="Breadcrumb">
        <Link to="/products" className="hover:text-forest-700">
          Shop
        </Link>{' '}
        / <span className="text-earth-800">{product.name}</span>
      </nav>

      {PRODUCT_VIDEOS[product.slug] && (
        <div className="mb-10 -mx-4 overflow-hidden rounded-none shadow-lg sm:mx-0 sm:rounded-3xl">
          <video
            className="aspect-video w-full object-cover"
            src={PRODUCT_VIDEOS[product.slug]}
            autoPlay
            loop
            muted
            playsInline
            controls
          />
        </div>
      )}

      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl bg-cream">
            {images[activeImage] && (
              <img src={images[activeImage].image} alt={images[activeImage].alt_text || product.name} className="h-full w-full object-cover" />
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={`size-16 overflow-hidden rounded-lg border-2 ${i === activeImage ? 'border-forest-700' : 'border-transparent'}`}
                  aria-label={`Show image ${i + 1}`}
                >
                  <img src={img.image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="min-w-0 text-3xl">{product.name}</h1>
            <button
              onClick={handleWishlist}
              aria-pressed={!!wishlistItem}
              aria-label="Toggle wishlist"
              className="rounded-full border border-forest-100 p-2 text-terracotta-700 hover:bg-forest-50"
            >
              <Heart className="size-5" fill={wishlistItem ? 'currentColor' : 'none'} />
            </button>
          </div>
          {product.review_count > 0 && (
            <div className="mt-2">
              <StarRating value={product.average_rating} count={product.review_count} />
            </div>
          )}
          <p className="mt-3 text-earth-700">{product.short_description}</p>

          <div className="mt-5">
            <PriceTag price={variant?.price} mrp={variant?.mrp} size="lg" />
          </div>

          {product.variants.length > 1 && (
            <fieldset className="mt-5">
              <legend className="text-sm font-medium text-earth-900">Size</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantId(v.id)}
                    aria-pressed={variant?.id === v.id}
                    className={`rounded-full border px-4 py-2 text-sm font-medium ${
                      variant?.id === v.id ? 'border-forest-700 bg-forest-700 text-ivory' : 'border-forest-200 text-forest-800'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          <div className="mt-2">
            {variant?.stock_status === 'out_of_stock' && <Badge tone="terracotta">Out of stock</Badge>}
            {variant?.stock_status === 'low_stock' && <Badge tone="ghee">Only a few left</Badge>}
          </div>

          {variant?.stock_status !== 'out_of_stock' ? (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-full border border-forest-200">
                <button className="px-3 py-2" aria-label="Decrease quantity" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                  −
                </button>
                <span className="w-8 text-center" aria-live="polite">
                  {quantity}
                </span>
                <button className="px-3 py-2" aria-label="Increase quantity" onClick={() => setQuantity((q) => q + 1)}>
                  +
                </button>
              </div>
              <Button onClick={handleAddToCart} loading={addToCart.isPending}>
                Add to Cart
              </Button>
              <Button onClick={handleBuyNow} variant="secondary">
                Buy Now
              </Button>
            </div>
          ) : (
            <form onSubmit={handleNotify} className="mt-6 flex max-w-sm gap-2">
              <Input type="email" required placeholder="Your email" value={notifyEmail} onChange={(e) => setNotifyEmail(e.target.value)} />
              <Button type="submit" variant="outline" loading={notifyMe.isPending}>
                Notify Me
              </Button>
            </form>
          )}

          <form onSubmit={handlePincodeCheck} className="mt-6 flex max-w-sm gap-2">
            <Input
              placeholder="Check delivery by pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              maxLength={6}
              aria-label="Delivery pincode"
            />
            <Button type="submit" variant="outline">
              Check
            </Button>
          </form>
          {pincodeResult && (
            <p className="mt-2 text-sm">
              {pincodeResult.serviceable
                ? `Delivers in ~${pincodeResult.estimated_days} days${pincodeResult.cod_available ? ' · COD available' : ''}`
                : 'Not currently serviceable to this pincode.'}
            </p>
          )}
        </div>
      </div>

      <div className="mt-14 grid gap-8 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          {product.ingredients && <DetailBlock title="Ingredients" body={product.ingredients} />}
          {product.preparation && <DetailBlock title="Preparation" body={product.preparation} />}
          {product.aroma_texture && <DetailBlock title="Aroma & Texture" body={product.aroma_texture} />}
          {product.culinary_uses && <DetailBlock title="Culinary Uses" body={product.culinary_uses} />}
          {product.storage_instructions && <DetailBlock title="Storage" body={product.storage_instructions} />}
          {product.allergens && <DetailBlock title="Allergens" body={product.allergens} />}
        </div>
        <Card className="h-fit p-5">
          <h3 className="text-lg">Shipping & Returns</h3>
          <ul className="mt-2 space-y-1 text-sm text-earth-700">
            <li>Free shipping over ₹999</li>
            <li>Cash on delivery available on eligible pincodes</li>
            <li>See our shipping and return policy for details</li>
          </ul>
          <Link to="/shipping-policy" className="mt-2 inline-block text-sm font-medium text-forest-700 underline">
            Shipping Policy
          </Link>
        </Card>
      </div>

      <section className="mt-14">
        <h2 className="text-2xl">Reviews</h2>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            {reviewData?.results?.length ? (
              reviewData.results.map((r) => (
                <Card key={r.id} className="p-4">
                  <StarRating value={r.rating} />
                  <p className="mt-2 text-sm font-medium text-forest-800">
                    {r.customer_name} {r.is_verified_purchase && <Badge tone="forest" className="ml-2">Verified purchase</Badge>}
                  </p>
                  {r.title && <p className="mt-1 font-medium">{r.title}</p>}
                  <p className="mt-1 text-sm text-earth-700">{r.body}</p>
                  {r.staff_reply && (
                    <p className="mt-2 rounded-lg bg-forest-50 p-2 text-sm text-forest-800">
                      <strong>EKAS team:</strong> {r.staff_reply}
                    </p>
                  )}
                </Card>
              ))
            ) : (
              <p className="text-sm text-earth-600">No reviews yet. Be the first to share your experience.</p>
            )}
          </div>
          <ReviewForm productId={product.id} onSubmit={(payload) => submitReview.mutate(payload)} isAuthenticated={!!me} />
        </div>
      </section>

      {product.related_products?.length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl">You may also like</h2>
          <ProductGrid className="mt-4">
            {product.related_products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </ProductGrid>
        </section>
      )}
    </Section>
  )
}

function DetailBlock({ title, body }) {
  return (
    <div>
      <h3 className="text-lg text-forest-800">{title}</h3>
      <p className="mt-1 whitespace-pre-line text-sm text-earth-700">{body}</p>
    </div>
  )
}
