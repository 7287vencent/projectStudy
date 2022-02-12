import Vue from 'vue';
import VueRouter from 'vue-router';

// import Home from '../views/Home.vue'
// import List from '../views/List.vue'

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'hash',
  routes: [
    {
      path: '/Home',
      // component: resolve => require(['../views/Home.vue'], resolve),
      component: () => import(/* webpackChunkName: "Home" */ '../views/Home.vue'),
    },
    {
      path: '/List',
      // component: resolve => require(['../views/List.vue'], resolve),
      component: () => import(/* webpackChunkName: "List" */ '../views/List.vue'),
    },
    {
      path: '*',
      redirect: '/Home',
      // component: resolve => require(['../views/Home.vue'], resolve)
      component: import(/* webpackChunkName: "Home" */ '../views/Home.vue'),
    },
  ],
});
