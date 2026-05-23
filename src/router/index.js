import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../pages/LandingPage.vue';
import DashboardPage from '../pages/DashboardPage.vue';
import LimitationsPage from '../pages/LimitationsPage.vue';

const routes = [
  {
    path: '/',
    name: 'landing',
    component: LandingPage,
    meta: { title: 'CerebroAI — Brain MRI Tumor Screening' },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardPage,
    meta: { title: 'CerebroAI — Screening Dashboard' },
  },
  {
    path: '/limitations',
    name: 'limitations',
    component: LimitationsPage,
    meta: { title: 'CerebroAI — Limitations & Intended Use' },
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0, behavior: 'smooth' };
  },
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'CerebroAI';
  next();
});

export default router;
