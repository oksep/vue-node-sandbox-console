import Vue from 'vue';
import VueRouter from 'vue-router';
import Default from '@/views/sandbox';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Default,
  }
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
});

export default router;
