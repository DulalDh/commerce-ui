import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from '@org/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/forbidden',
      name: 'forbidden',
      component: () => import('../views/ForbiddenView.vue'),
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/store',
      name: 'store',
      component: () => import('../views/store/StoreView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/catalog/categories',
      name: 'catalog-categories',
      component: () => import('../views/catalog/CategoriesView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/catalog/brands',
      name: 'catalog-brands',
      component: () => import('../views/catalog/BrandsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/catalog/tags',
      name: 'catalog-tags',
      component: () => import('../views/catalog/TagsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/catalog/products',
      name: 'catalog-products',
      component: () => import('../views/catalog/ProductsListView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/catalog/products/:id',
      name: 'catalog-product-form',
      component: () => import('../views/catalog/ProductFormView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/inventory',
      name: 'inventory',
      component: () => import('../views/inventory/InventoryView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/orders/OrdersListView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/orders/:id',
      name: 'order-detail',
      component: () => import('../views/orders/OrderDetailView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/customers',
      name: 'customers',
      component: () => import('../views/customers/CustomersListView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/customers/:id',
      name: 'customer-detail',
      component: () => import('../views/customers/CustomerDetailView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/subscriptions',
      name: 'subscriptions',
      component: () => import('../views/subscriptions/SubscriptionsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/promotions/coupons',
      name: 'promotions-coupons',
      component: () => import('../views/promotions/CouponsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/promotions/flash-sales',
      name: 'promotions-flash-sales',
      component: () => import('../views/promotions/FlashSalesView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/promotions/rules',
      name: 'promotions-rules',
      component: () => import('../views/promotions/PromotionRulesView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/services/profile',
      name: 'services-profile',
      component: () => import('../views/services/ProviderProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/services/categories',
      name: 'services-categories',
      component: () => import('../views/services/ServiceCategoriesView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/services/listings',
      name: 'services-listings',
      component: () => import('../views/services/ServiceListingsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/services/listings/:id',
      name: 'services-listing-form',
      component: () => import('../views/services/ServiceFormView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/services/staff',
      name: 'services-staff',
      component: () => import('../views/services/StaffListView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/services/staff/:id',
      name: 'services-staff-detail',
      component: () => import('../views/services/StaffDetailView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/services/vehicles',
      name: 'services-vehicles',
      component: () => import('../views/services/VehiclesView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/bookings',
      name: 'bookings',
      component: () => import('../views/bookings/BookingsListView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/bookings/calendar',
      name: 'bookings-calendar',
      component: () => import('../views/bookings/ProviderCalendarView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/bookings/holidays',
      name: 'bookings-holidays',
      component: () => import('../views/bookings/HolidaysView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/bookings/:id',
      name: 'booking-detail',
      component: () => import('../views/bookings/BookingDetailView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/reviews',
      name: 'reviews',
      component: () => import('../views/reviews/ReviewsView.vue'),
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach(authGuard);

export default router;
