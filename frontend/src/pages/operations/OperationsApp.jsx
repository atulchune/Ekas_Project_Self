import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { OpsProtectedRoute } from '@/components/operations/OpsProtectedRoute'
import { PageLoader } from '@/components/ui/PageLoader'

const OpsLoginPage = lazy(() => import('./OpsLoginPage'))
const OperationsLayout = lazy(() => import('./OperationsLayout'))
const DashboardPage = lazy(() => import('./DashboardPage'))
const ProductsPage = lazy(() => import('./ProductsPage'))
const CategoriesPage = lazy(() => import('./CategoriesPage'))
const InventoryPage = lazy(() => import('./InventoryPage'))
const OrdersPage = lazy(() => import('./OrdersPage'))
const OrderDetailPage = lazy(() => import('./OrderDetailPage'))
const CustomersPage = lazy(() => import('./CustomersPage'))
const PaymentsPage = lazy(() => import('./PaymentsPage'))
const ShipmentsPage = lazy(() => import('./ShipmentsPage'))
const ReturnsPage = lazy(() => import('./ReturnsPage'))
const CouponsPage = lazy(() => import('./CouponsPage'))
const CombosPage = lazy(() => import('./CombosPage'))
const ReviewsPage = lazy(() => import('./ReviewsPage'))
const HomepageManagerPage = lazy(() => import('./HomepageManagerPage'))
const MediaPage = lazy(() => import('./MediaPage'))
const RecipesPage = lazy(() => import('./RecipesPage'))
const BlogsPage = lazy(() => import('./BlogsPage'))
const NotificationsPage = lazy(() => import('./NotificationsPage'))
const NewsletterPage = lazy(() => import('./NewsletterPage'))
const EnquiriesPage = lazy(() => import('./EnquiriesPage'))
const ReportsPage = lazy(() => import('./ReportsPage'))
const StaffPage = lazy(() => import('./StaffPage'))
const AuditLogsPage = lazy(() => import('./AuditLogsPage'))
const SettingsPage = lazy(() => import('./SettingsPage'))
const ProfilePage = lazy(() => import('./ProfilePage'))

export default function OperationsApp() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="login" element={<OpsLoginPage />} />
        <Route
          element={
            <OpsProtectedRoute>
              <OperationsLayout />
            </OpsProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:orderNumber" element={<OrderDetailPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="shipments" element={<ShipmentsPage />} />
          <Route path="returns" element={<ReturnsPage />} />
          <Route path="coupons" element={<CouponsPage />} />
          <Route path="combos" element={<CombosPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="homepage" element={<HomepageManagerPage />} />
          <Route path="media" element={<MediaPage />} />
          <Route path="recipes" element={<RecipesPage />} />
          <Route path="blogs" element={<BlogsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="newsletter" element={<NewsletterPage />} />
          <Route path="enquiries" element={<EnquiriesPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="staff" element={<StaffPage />} />
          <Route path="audit-logs" element={<AuditLogsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
