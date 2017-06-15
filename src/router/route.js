import Vue from 'vue';

import Router from 'vue-router';

import VueRsource from 'vue-resource';

import routes from './routeADM.js';

import App from '../App.vue';

import ElementUI from 'element-ui';

import 'element-ui/lib/theme-default/index.css';

Vue.use(Router);

Vue.use(VueRsource);

Vue.use(ElementUI);

let router = new Router({
  routes
});

/* eslint-disable no-unused-vars */
const app = new Vue({
  router,
  ...App
}).$mount('#app');
