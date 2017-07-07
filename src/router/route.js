import Vue from 'vue';

import config from '../config.js';

import Router from 'vue-router';

import VueRsource from 'vue-resource';

import routes from './routeADM.js';

import App from '../App.vue';

import ElementUI from 'element-ui';

import sessionUtil from '../util/session.js';

import apiUtil from '../util/api.js';

import 'element-ui/lib/theme-default/index.css';

Vue.use(Router);

Vue.use(require('vue-resource'));

Vue.use(VueRsource);

Vue.use(ElementUI);

let router = new Router({
  routes
});

Vue.http.options.root = '/v1';

Vue.http.options.emulateHTTP = true;

Vue.http.options.emulateJSON = true;

Vue.http.interceptors.push((request, next) => {
  request.url = apiUtil.url(request.url);
  var method = request.method;
  // 登录后所有AJAX参数，默认传递用户token
  var isLogin = sessionUtil.isLogin();
  var token = isLogin && sessionUtil.getToken;
  var data = request.data || request.params;
  if (config.publish) {
    var md = method.toLowerCase();
   if (md === 'put' || md === 'delete') {
      data['_method'] = md;
      request.method = 'post';
    }
  }
  token ? data.token = token : false;
  next((response) => {
    var data = response.data || {};
    // 后台session失效
    if (data.ret === 999) {
      sessionUtil.clear();
      this.$router.push(config.login);
    } else {
      sessionUtil.resetTimestamp();
    }
  });
});
// router.beforeEach((to, from, next) => {
//   console.log(to);
//   console.log(from);
//   console.log(next);
//   let auth = to.auth;
//   let toPath = to.path;
//   let isLogin = sessionUtil.isLogin();
  // 重置用户登录时间戳
  // isLogin && sessionUtil.resetTimestamp();
  // 记录用户最后一次访问地址,在浏览器重启后，正确跳转
  // (auth === false || isLogin) && sessionUtil.setLastPath(toPath);
  // if (auth === false) {
    // return next();
  // }
// });

/* eslint-disable no-unused-vars */
const app = new Vue({
  router,
  ...App
}).$mount('#app');
