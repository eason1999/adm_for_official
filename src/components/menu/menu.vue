<template>
  <el-menu :unique-opened="true" @select="handleSelect" router :default-active="$route.path" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
	<el-submenu index="1">
	  <template slot="title"><i class="el-icon-message"></i>广告主管理</template>
	  <el-menu-item-group>
	    <el-menu-item index="/adm/adv/data">数据管理</el-menu-item>
	    <el-menu-item index="/adm/adv/campaign">广告管理</el-menu-item>
	  </el-menu-item-group>
	</el-submenu>
	<el-menu-item index="/adm/resource"><i class="el-icon-menu"></i>广告源配置</el-menu-item>
	<el-submenu index="3">
	  <template slot="title"><i class="el-icon-message"></i>开发者管理</template>
	  <el-menu-item-group>
	    <el-menu-item index="/adm/dev/app">应用管理</el-menu-item>
	    <el-menu-item index="/adm/dev/data">数据管理</el-menu-item>
	  </el-menu-item-group>
	</el-submenu>
	<el-submenu index="4">
	  <template slot="title"><i class="el-icon-message"></i>自定义功能</template>
	  <el-menu-item-group>
	    <el-menu-item index="/adm/selfdefined/monitor">代码监测</el-menu-item>
	    <el-menu-item index="/adm/selfdefined/daterecord">数据录入</el-menu-item>
	  </el-menu-item-group>
	</el-submenu>
	<el-submenu index="5">
	  <template slot="title"><i class="el-icon-message"></i>OTA外放功能</template>
	  <el-menu-item-group>
	    <el-menu-item index="/adm/otaoutput/otaclient">OTA客户配置</el-menu-item>
	    <el-menu-item index="/adm/otaoutput/whitelist">应用白名单</el-menu-item>
	  </el-menu-item-group>
	</el-submenu>
	<el-submenu index="6">
	  <template slot="title"><i class="el-icon-message"></i>屏蔽黑名单</template>
	  <el-menu-item-group>
	    <el-menu-item index="/adm/shield/user">用户黑名单</el-menu-item>
	    <el-menu-item index="/adm/shield/regional">地域屏蔽</el-menu-item>
	    <el-menu-item index="/adm/shield/search">黑名单查询</el-menu-item>
	  </el-menu-item-group>
	</el-submenu>
	<el-submenu index="7">
	  <template slot="title"><i class="el-icon-message"></i>数据监控</template>
	  <el-menu-item-group>
	    <el-menu-item index="/adm/datamonitor/devdata">DEV实时数据</el-menu-item>
	    <el-menu-item index="/adm/datamonitor/advdata">ADV实时数据</el-menu-item>
	    <el-menu-item index="/adm/datamonitor/outmonitor">外发监测</el-menu-item>
	  </el-menu-item-group>
	</el-submenu>
	<el-submenu index="8">
	  <template slot="title"><i class="el-icon-message"></i>财务管理</template>
	  <el-menu-item-group>
	    <el-menu-item index="/adm/finance/dev">开发者财务信息</el-menu-item>
	    <el-menu-item index="/adm/finance/adv">广告主财务信息</el-menu-item>
	    <el-menu-item index="/adm/finance/slote">广告源财务信息</el-menu-item>
	    <el-menu-item index="/adm/finance/vouchor">提现/充值</el-menu-item>
	    <el-menu-item index="/adm/finance/hitback">命中/退款</el-menu-item>
	  </el-menu-item-group>
	</el-submenu>
	<el-menu-item index="/adm/dashboard"><i class="el-icon-menu"></i>Dashboard</el-menu-item>
	<el-menu-item index="/adm/sdkapi"><i class="el-icon-menu"></i>SDK/API文档</el-menu-item>
	<el-submenu index="11">
	  <template slot="title"><i class="el-icon-message"></i>账户权限</template>
	  <el-menu-item-group>
	    <el-menu-item index="/adm/devaccount">开发者账户</el-menu-item>
	    <el-menu-item index="/adm/advaccount">广告主账户</el-menu-item>
	    <el-menu-item index="/adm/admaccount">管理员账户</el-menu-item>
	    <el-menu-item index="/adm/rolemanage">角色权限</el-menu-item>
	  </el-menu-item-group>
	</el-submenu>
  </el-menu>
</template>

<script type="esmascript-6">
export default {
  data () {
    return {
    	
    };
  },
  methods: {
  	handleSelect (index, indexPath) {
  		
  	},
	handleOpen (key, keyPath) {
	  console.log(key, keyPath);
	},
	handleClose (key, keyPath) {
	  console.log(key, keyPath);
	}
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
	.el-menu
		height: 100%
</style>
