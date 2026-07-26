import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { StorefrontLayout } from '@/layouts/StorefrontLayout'
import { ProtectedRoute } from '@/components/storefront/ProtectedRoute'
import { PageLoader } from '@/components/ui/PageLoader'

// Storefront pages
const Home = lazy(() => import('@/pages/storefront/Home'))
const AllProducts = lazy(() => import('@/pages/storefront/AllProducts'))
const CategoryPage = lazy(() => import('@/pages/storefront/CategoryPage'))
const SearchResults = lazy(() => import('@/pages/storefront/SearchResults'))
const ProductDetail = lazy(() => import('@/pages/storefront/ProductDetail'))
const CombosList = lazy(() => import('@/pages/storefront/CombosList'))
const BundleDetail = lazy(() => import('@/pages/storefront/BundleDetail'))
const CartPage = lazy(() => import('@/pages/storefront/CartPage'))
const CheckoutPage = lazy(() => import('@/pages/storefront/CheckoutPage'))
const OrderSuccessPage = lazy(() => import('@/pages/storefront/OrderSuccessPage'))
const LoginPage = lazy(() => import('@/pages/storefront/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/storefront/RegisterPage'))
const VerifyEmailPage = lazy(() => import('@/pages/storefront/VerifyEmailPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/storefront/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('@/pages/storefront/ResetPasswordPage'))
const AccountLayout = lazy(() => import('@/pages/storefront/account/AccountLayout'))
const AccountDashboard = lazy(() => import('@/pages/storefront/account/AccountDashboard'))
const OrderHistory = lazy(() => import('@/pages/storefront/account/OrderHistory'))
const OrderDetail = lazy(() => import('@/pages/storefront/account/OrderDetail'))
const Addresses = lazy(() => import('@/pages/storefront/account/Addresses'))
const WishlistPage = lazy(() => import('@/pages/storefront/account/WishlistPage'))
const RecentlyViewedPage = lazy(() => import('@/pages/storefront/account/RecentlyViewedPage'))
const ProfileSettings = lazy(() => import('@/pages/storefront/account/ProfileSettings'))
const OurStory = lazy(() => import('@/pages/storefront/OurStory'))
const OurProcess = lazy(() => import('@/pages/storefront/OurProcess'))
const WomenBehindEkas = lazy(() => import('@/pages/storefront/WomenBehindEkas'))
const RecipesList = lazy(() => import('@/pages/storefront/RecipesList'))
const RecipeDetail = lazy(() => import('@/pages/storefront/RecipeDetail'))
const BlogList = lazy(() => import('@/pages/storefront/BlogList'))
const BlogDetail = lazy(() => import('@/pages/storefront/BlogDetail'))
const ContactPage = lazy(() => import('@/pages/storefront/ContactPage'))
const StaticContentPage = lazy(() => import('@/pages/storefront/StaticContentPage'))
const NotFound = lazy(() => import('@/pages/storefront/NotFound'))

// Operations Portal -- one lazy chunk for the whole subtree, separate from
// the storefront bundle, with its own layout and auth.
const OperationsApp = lazy(() => import('@/pages/operations/OperationsApp'))

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/operations/*" element={<OperationsApp />} />

        <Route element={<StorefrontLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<AllProducts />} />
          <Route path="products/:slug" element={<ProductDetail />} />
          <Route path="categories/:slug" element={<CategoryPage />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="combos" element={<CombosList />} />
          <Route path="combos/:slug" element={<BundleDetail />} />
          <Route path="cart" element={<CartPage />} />
          <Route
            path="checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="order-success/:orderNumber"
            element={
              <ProtectedRoute>
                <OrderSuccessPage />
              </ProtectedRoute>
            }
          />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="verify-email" element={<VerifyEmailPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />

          <Route
            path="account"
            element={
              <ProtectedRoute>
                <AccountLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AccountDashboard />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="orders/:orderNumber" element={<OrderDetail />} />
            <Route path="addresses" element={<Addresses />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="recently-viewed" element={<RecentlyViewedPage />} />
            <Route path="profile" element={<ProfileSettings />} />
          </Route>

          <Route path="our-story" element={<OurStory />} />
          <Route path="our-process" element={<OurProcess />} />
          <Route path="women-behind-ekas" element={<WomenBehindEkas />} />
          <Route path="recipes" element={<RecipesList />} />
          <Route path="recipes/:slug" element={<RecipeDetail />} />
          <Route path="blog" element={<BlogList />} />
          <Route path="blog/:slug" element={<BlogDetail />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="faq" element={<StaticContentPage slug="faq" title="Frequently Asked Questions" />} />
          <Route
            path="shipping-policy"
            element={<StaticContentPage slug="shipping-policy" title="Shipping Policy" />}
          />
          <Route
            path="return-refund-policy"
            element={<StaticContentPage slug="return-refund-policy" title="Return & Refund Policy" />}
          />
          <Route path="privacy-policy" element={<StaticContentPage slug="privacy-policy" title="Privacy Policy" />} />
          <Route
            path="terms-and-conditions"
            element={<StaticContentPage slug="terms-and-conditions" title="Terms & Conditions" />}
          />
          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
