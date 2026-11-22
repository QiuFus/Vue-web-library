import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/notice',
      name: 'notice',
      component: () => import('../views/NoticeView.vue')
    },
    {
      path: '/books',
      name: 'book-list',
      component: () => import('@/components/book/BookList.vue')
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthPage.vue'),
      meta: { requiresAuth: false, hideNavbar: true },
    },
    {
      path: '/book/:id',
      name: 'book-detail',
      component: () => import('../views/BookDetail.vue'),
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/CartView.vue'),
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/OrdersPage.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/admin/AdminLayout.vue'),
      children: [
        { path: '', redirect: '/admin/books' },
        { path: 'books', name: 'admin-books', component: import('../views/admin/AdminBookManage.vue') },
        { path: 'orders', name: 'admin-orders', component: import('../views/admin/AdminOrderManage.vue') },
        { path: 'notices', name: 'admin-notices', component: () => import('../views/admin/AdminNoticeManage.vue') },
        { path: 'dashborad', name: 'admin-dashborad', component: () => import('../views/admin/AdminDashboard.vue') }
      ],
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      children: [
        { path: '', redirect: '/profile/info' },
        {
          path: 'info',
          name: 'profile-info',
          component: () => import('../views/profile/ProfileInfo.vue'),
        },
        {
          path: 'favorites',
          name: 'profile-favorites',
          component: () => import('../views/profile/FavoriteList.vue'),
        },
        {
          path: 'orders',
          name: 'profile-orders',
          component: () => import('../views/profile/OrderList.vue'),
        },
        {
          path: 'orders/:orderId',
          name: 'profile-order-detail',
          component: () => import('../components/layout/OrderDetail.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const token = localStorage.getItem('token')

  const userInfo=localStorage.getItem("userInfo")
  let ui:string=''
  if(userInfo){
    ui=JSON.parse(userInfo).role
    console.log("ui:",ui)
    console.log("to.path:",to.path)
  }
  

  if (to.meta.requiresAuth !== false && !token) {
    return { name: 'auth' }
  }

  if (to.path.includes('/admin') && ui!=='管理员') {
    return { name: 'home' }
  }
})

export default router