import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Login',
      component: () => import(/* webpackChunkName: "login" */'@/views/Login'),
    },
    {
      path: '/daily',
      name: 'Daily',
      component: () => import(/* webpackChunkName: "daily" */'@/views/Daily'),
    },
  ],
});
