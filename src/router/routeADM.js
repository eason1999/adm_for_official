import layout from '../pages/adm/layout.vue';

import login from '../pages/adm/login.vue';

import advCampaign from '../pages/adm/adver/campaign.vue';

import advData from '../pages/adm/adver/data.vue';

import advSelfind from '../pages/adm/adver/config/selfind.vue';

import orientconfig from '../pages/adm/adver/config/orientconfig.vue';

import advResource from '../pages/adm/adresource/adresource.vue';

import addSloteid from '../pages/adm/adresource/config/addsloteid.vue';

import devApps from '../pages/adm/dever/apps.vue';

import devData from '../pages/adm/dever/data.vue';

import devSelfind from '../pages/adm/dever/config/selfind.vue';

import devConfigur from '../pages/adm/dever/config/configur.vue';

import devSlotlist from '../pages/adm/dever/config/slotlist.vue';

import selfDaterecord from '../pages/adm/selfdefined/daterecord.vue';

import createMonitor from '../pages/adm/selfdefined/config/createmonitor.vue';

import selfMonitor from '../pages/adm/selfdefined/monitor.vue';

import otaClient from '../pages/adm/otaputout/otaclient.vue';

import otaConfiguration from '../pages/adm/otaputout/config/configuration.vue';

import otaConfigs from '../pages/adm/otaputout/config/configs.vue';

import otaWhitelist from '../pages/adm/otaputout/whitelist.vue';

import otaAddwhite from '../pages/adm/otaputout/config/addwhite.vue';

import regional from '../pages/adm/shielding/regional.vue';

import adduser from '../pages/adm/shielding/config/adduser.vue';

import usershield from '../pages/adm/shielding/usershield.vue';

import addregional from '../pages/adm/shielding/config/addregional.vue';

import shieldSearch from '../pages/adm/shielding/config/searchblack.vue';

import monitorAdvdata from '../pages/adm/datamonitor/advdata.vue';

import monitorDevdata from '../pages/adm/datamonitor/devdata.vue';

import monitorAdvdetail from '../pages/adm/datamonitor/config/advdetail.vue';

import monitorDevdetail from '../pages/adm/datamonitor/config/devdetail.vue';

import monitorDevfile from '../pages/adm/datamonitor/config/devfile.vue';

import monitorAdvfile from '../pages/adm/datamonitor/config/advfile.vue';

import outMonitor from '../pages/adm/datamonitor/outmonitor.vue';

import advfinance from '../pages/adm/finance/advfinance.vue';

import devfinance from '../pages/adm/finance/devfinance.vue';

import slotefinance from '../pages/adm/finance/slotefinance.vue';

import drawvouchor from '../pages/adm/finance/drawvouchor.vue';

import addvouchor from '../pages/adm/finance/config/addvouch.vue';

import hitback from '../pages/adm/finance/hitback.vue';

import addhit from '../pages/adm/finance/config/addhit.vue';

import dashboard from '../pages/adm/dashboard/dashboard.vue';

import sdkapi from '../pages/adm/sdkapi/sdkapi.vue';

import updateSDKAPI from '../pages/adm/sdkapi/config/update.vue';

import admaccount from '../pages/adm/accountmanage/admaccount.vue';

import advaccount from '../pages/adm/accountmanage/advaccount.vue';

import devaccount from '../pages/adm/accountmanage/devaccount.vue';

import rolemanage from '../pages/adm/accountmanage/rolemanage.vue';

import addmanage from '../pages/adm/accountmanage/config/addmanage.vue';

import configadv from '../pages/adm/accountmanage/config/configadv.vue';

import configdev from '../pages/adm/accountmanage/config/configdev.vue';

import roledit from '../pages/adm/accountmanage/config/roledit.vue';

import config from '../config.js';

const routes = [{
  path: '/',
  redirect: config.index
}, {
  path: '/adm/login',
  component: login
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
      path: 'adv/data/config',
      component: orientconfig
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
      path: 'dev/app/configur',
      component: devConfigur
  }, {
      path: 'dev/app/slotlist',
      component: devSlotlist
  }, {
    path: 'resource',
    component: advResource
  }, {
    path: 'resource/addid',
    component: addSloteid
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
    path: 'otaoutput/otaclient/configs',
    component: otaConfigs
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
  }, {
    path: 'datamonitor/advdata',
    component: monitorAdvdata
  }, {
    path: 'datamonitor/devdata',
    component: monitorDevdata
  }, {
    path: 'datamonitor/advdata/advdetail',
    component: monitorAdvdetail
  }, {
    path: 'datamonitor/devdata/devdetail',
    component: monitorDevdetail
  }, {
    path: 'datamonitor/devdata/devfile',
    component: monitorDevfile
  }, {
    path: 'datamonitor/advdata/advfile',
    component: monitorAdvfile
  }, {
    path: 'datamonitor/outmonitor',
    component: outMonitor
  }, {
    path: 'finance/adv',
    component: advfinance
  }, {
    path: 'finance/dev',
    component: devfinance
  }, {
    path: 'finance/slote',
    component: slotefinance
  }, {
    path: 'finance/vouchor',
    component: drawvouchor
  }, {
    path: 'finance/vouchor/addvouch',
    component: addvouchor
  }, {
    path: 'finance/hitback',
    component: hitback
  }, {
    path: 'finance/hitback/addhit',
    component: addhit
  }, {
    path: 'dashboard',
    component: dashboard
  }, {
    path: 'sdkapi',
    component: sdkapi
  }, {
    path: 'sdkapi/update',
    component: updateSDKAPI
  }, {
    path: 'admaccount/addmanage',
    component: addmanage
  }, {
    path: 'admaccount',
    component: admaccount
  }, {
    path: 'advaccount',
    component: advaccount
  }, {
    path: 'advaccount/config',
    component: configadv
  }, {
    path: 'devaccount',
    component: devaccount
  }, {
    path: 'devaccount/config',
    component: configdev
  }, {
    path: 'rolemanage',
    component: rolemanage
  }, {
    path: 'rolemanage/roledit',
    component: roledit
  }]
}];

export default routes;
