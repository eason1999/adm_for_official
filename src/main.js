/* eslint-disable no-unused-vars */

import $ from 'jquery';

import './asset/css/reset.css';

import moment from 'moment';

// 解决严格模式下，没有声明就使用的报错
window.moment = moment;

require('./router/route.js');

require('./filters/index.js');
