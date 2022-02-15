// ? 测试
// console.log('aaaa');

// const obj = { a: 1, b: 2 };
// let { a, b } = obj;
// console.log(a, b);
import Vue from 'vue';
import App from './App.vue';
import router from './router/index.js';
import store from './store/index.js';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/element.scss';
Vue.use(ElementUI);
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
