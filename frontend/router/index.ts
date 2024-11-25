import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/index.vue'), // ホームページ
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/NotFound.vue'), // 404 ページ
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
