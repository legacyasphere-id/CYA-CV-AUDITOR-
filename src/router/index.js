import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/audit',
      name: 'audit',
      component: () => import('@/views/AuditView.vue'),
    },
    {
      path: '/result/:publicId',
      name: 'result',
      component: () => import('@/views/ResultView.vue'),
    },
    {
      path: '/payment/:publicId',
      name: 'payment',
      component: () => import('@/views/PaymentView.vue'),
    },
  ],
})

export default router
