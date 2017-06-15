import layout from '../pages/adm/layout.vue';

import advCampaign from '../pages/adm/adver/campaign.vue';

import advData from '../pages/adm/adver/data.vue';

import advSelfind from '../pages/adm/adver/config/selfind.vue';

import advResource from '../pages/adm/adresource/adresource.vue';

import devApps from '../pages/adm/dever/apps.vue';

import devData from '../pages/adm/dever/data.vue';

import devSelfind from '../pages/adm/dever/config/selfind.vue';

import selfDaterecord from '../pages/adm/selfdefined/daterecord.vue';

import createMonitor from '../pages/adm/selfdefined/config/createmonitor.vue';

import selfMonitor from '../pages/adm/selfdefined/monitor.vue';

import otaClient from '../pages/adm/otaputout/otaclient.vue';

import otaConfiguration from '../pages/adm/otaputout/config/configuration.vue';

import otaWhitelist from '../pages/adm/otaputout/whitelist.vue';

import otaAddwhite from '../pages/adm/otaputout/config/addwhite.vue';

import regional from '../pages/adm/shielding/regional.vue';

import adduser from '../pages/adm/shielding/config/adduser.vue';

import usershield from '../pages/adm/shielding/usershield.vue';

import addregional from '../pages/adm/shielding/config/addregional.vue';

import shieldSearch from '../pages/adm/shielding/config/searchblack.vue';

import config from '../config.js';

const routes = [{
  path: '/',
  redirect: config.index
}, {
  path: '/adm/',
  component: layout,
  children: [{
    path: 'adv/campaign',
    component: advCampaign
  }, {
    path: 'adv/data',
    component: advData
  }, {
      path: 'adv/data/selfind',
      component: advSelfind
  }, {
    path: 'dev/app',
    component: devApps
  }, {
    path: 'dev/data',
    component: devData
  }, {
      path: 'dev/data/selfind',
      component: devSelfind
  }, {
    path: 'resource',
    component: advResource
  }, {
    path: 'selfdefined/daterecord',
    component: selfDaterecord
  }, {
    path: 'selfdefined/monitor',
    component: selfMonitor
  }, {
    path: 'selfdefined/monitor/create',
    component: createMonitor
  }, {
    path: 'otaoutput/whitelist',
    component: otaWhitelist
  }, {
    path: 'otaoutput/whitelist/addwhite',
    component: otaAddwhite
  }, {
    path: 'otaoutput/otaclient',
    component: otaClient
  }, {
    path: 'otaoutput/otaclient/configuration',
    component: otaConfiguration
  }, {
    path: 'shield/search',
    component: shieldSearch
  }, {
    path: 'shield/regional',
    component: regional
  }, {
    path: 'shield/regional/addregional',
    component: addregional
  }, {
    path: 'shield/user',
    component: usershield
  }, {
    path: 'shield/user/adduser',
    component: adduser
  }]
}];

export default routes;
