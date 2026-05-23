import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../pages/LandingPage.vue';
import DashboardPage from '../pages/DashboardPage.vue';
import LimitationsPage from '../pages/LimitationsPage.vue';
import { CONFIG } from '../config';

const routes = [
  { path: '/', name: 'landing', component: LandingPage, meta: { title: `${CONFIG.APP_NAME} — Overview` } },
  { path: '/dashboard', name: 'dashboard', component: DashboardPage, meta: { title: `${CONFIG.APP_NAME} — Workspace` } },
  { path: '/limitations', name: 'limitations', component: LimitationsPage, meta: { title: `${CONFIG.APP_NAME} — Limitations` } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, saved) {
    return saved || { top: 0, behavior: 'smooth' };
  },
});

router.beforeEach((to, _from, next) => {
  document.title = to.meta.title || CONFIG.APP_NAME;
  next();
});

export default router;
