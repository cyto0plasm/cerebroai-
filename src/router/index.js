import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../pages/LandingPage.vue';
import DashboardPage from '../pages/DashboardPage.vue';

const routes = [
  {
    path: '/',
    name: 'landing',
    component: LandingPage,
    meta: {
      title: 'CerebroAI - Advanced Brain MRI Tumor Detection System'
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardPage,
    meta: {
      title: 'CerebroAI Clinical Dashboard'
    }
  },
  // Fallback redirect
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0, behavior: 'smooth' };
  }
});

// Update page document titles dynamically
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'CerebroAI';
  next();
});

export default router;
