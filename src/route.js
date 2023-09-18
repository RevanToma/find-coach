import { createRouter, createWebHistory } from 'vue-router';

// import RequestsReceived from './pages/requests/RequestsReceived.vue';

// import ContactCoach from './pages/requests/ContactCoach.vue';
// import CoachDetails from './pages/coaches/CoachDetails.vue';
// import CoachRegistration from './pages/coaches/CoachRegistration.vue';
// import CoachesList from './pages/coaches/CoachesList.vue';
// import UserAuth from './pages/auth/UserAuth.vue';
// import NotFound from './pages/NotFound.vue';
import store from './store/index.js';

const CoachDetails = () => import('./pages/coaches/CoachDetails.vue');
const CoachRegistration = () => import('./pages/coaches/CoachRegistration.vue');

const CoachesList = () => import('./pages/coaches/CoachesList.vue');
const ContactCoach = () => import('./pages/requests/ContactCoach.vue');
const UserAuth = () => import('./pages/auth/UserAuth.vue');
const NotFound = () => import('./pages/NotFound.vue');
const RequestsReceived = () => import('./pages/requests/RequestsReceived.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/coaches' },
    {
      path: '/coaches',
      component: CoachesList
    },
    {
      path: '/coaches/:id',
      component: CoachDetails,
      props: true,
      children: [{ path: 'contact', component: ContactCoach }]
    },

    { path: '/register', component: CoachRegistration, meta: { requiresAuth: true } },
    { path: '/requests', component: RequestsReceived, meta: { requiresAuth: true } },
    { path: '/auth', component: UserAuth, meta: { requiresUnAuth: true } },
    { path: '/:notFound(.*)', component: NotFound }
  ]
});
router.beforeEach((to, _, next) => {
  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
    next('/auth');
  } else if (to.meta.requiresUnAuth && store.getters.isAuthenticated) {
    next('/coaches');
  } else {
    next();
  }
});

export default router;
