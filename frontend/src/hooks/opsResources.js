import { createOpsResource } from './useOpsResource'

export const opsCategories = createOpsResource('categories', 'ops-categories')
export const opsProducts = createOpsResource('products', 'ops-products')
export const opsVariants = createOpsResource('product-variants', 'ops-variants')
export const opsProductImages = createOpsResource('product-images', 'ops-product-images')
export const opsBundles = createOpsResource('combos', 'ops-combos')
export const opsBundleItems = createOpsResource('combo-items', 'ops-combo-items')

export const opsInventory = createOpsResource('inventory', 'ops-inventory')
export const opsInventoryMovements = createOpsResource('inventory-movements', 'ops-inventory-movements')

export const opsOrders = createOpsResource('orders', 'ops-orders')
export const opsOrderNotes = createOpsResource('order-notes', 'ops-order-notes')
export const opsShipments = createOpsResource('shipments', 'ops-shipments')
export const opsPayments = createOpsResource('payments', 'ops-payments')
export const opsRefunds = createOpsResource('refunds', 'ops-refunds')
export const opsCancellationRequests = createOpsResource('cancellation-requests', 'ops-cancellation-requests')

export const opsCustomers = createOpsResource('customers', 'ops-customers')

export const opsCoupons = createOpsResource('coupons', 'ops-coupons')
export const opsPromotions = createOpsResource('promotions', 'ops-promotions')

export const opsReviews = createOpsResource('reviews', 'ops-reviews')

export const opsAnnouncements = createOpsResource('announcements', 'ops-announcements')
export const opsHomepageSections = createOpsResource('homepage-sections', 'ops-homepage-sections')
export const opsMedia = createOpsResource('media', 'ops-media')
export const opsRecipes = createOpsResource('recipes', 'ops-recipes')
export const opsRecipeIngredients = createOpsResource('recipe-ingredients', 'ops-recipe-ingredients')
export const opsBlogPosts = createOpsResource('blog-posts', 'ops-blog-posts')
export const opsStaticPages = createOpsResource('static-pages', 'ops-static-pages')

export const opsNotifications = createOpsResource('notifications', 'ops-notifications')
export const opsNewsletterSubscribers = createOpsResource('newsletter-subscribers', 'ops-newsletter-subscribers')
export const opsEnquiries = createOpsResource('enquiries', 'ops-enquiries')
export const opsEnquiryNotes = createOpsResource('enquiry-notes', 'ops-enquiry-notes')

export const opsRoles = createOpsResource('roles', 'ops-roles')
export const opsStaff = createOpsResource('staff', 'ops-staff')
export const opsAuditLogs = createOpsResource('audit-logs', 'ops-audit-logs')
