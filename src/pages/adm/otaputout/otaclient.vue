<template>
  <div class="ota-client-wrapper">
    <h2>OTA客户配置</h2>
    <div class="client-top-wrapper clearfix">
      <el-button type="primary" class="pull-left"><router-link class="search" to="otaclient/configuration">新增</router-link></el-button>
    </div>
    <el-table v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中" :data="tableData" stripe style="width: 100%">
      <el-table-column prop="companyName" label="公司名称"></el-table-column>
      <el-table-column prop="appName" label="应用名称"></el-table-column>
      <el-table-column prop="protectCycle" label="保护周期（天）"></el-table-column>
      <el-table-column prop="splashInterval" label="开屏间隔（天）"></el-table-column>
      <el-table-column prop="nativeInterval" label="信息流间隔（分钟）"></el-table-column>
      <el-table-column prop="deblock" label="解锁频次"></el-table-column>
      <el-table-column prop="adImpl" label="广告次数"></el-table-column>
      <el-table-column prop="createdAt" label="创建日期"></el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
            <el-button type="primary" size="small" @click="changeOta(scope.row.id)">修改</el-button>
            <el-button type="primary" size="small" @click="configOta(scope.row.id, scope.row.companyName, scope.row.appName)">配置</el-button>
          </template>
      </el-table-column>
    </el-table>
    <div class="pager-wrapper clearfix">
      <el-button type="primary" class="pull-left" @click="downLoad">导出EXCEL</el-button>
      <div class="pull-right">
        <pager :total-records="totalRecords" @pagechange="load" :page-sizes="pageSize" :page-nums="pageNum"></pager>
      </div>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import pager from '../../../components/pager/pager.vue';
import apiUtil from '../../../util/api.js';
export default {
  data () {
    return {
      tableData: [{
          companyName: '卓易',
          appName: '头条',
          protectCycle: 10,
          splashInterval: 10,
          nativeInterval: 10,
          deblock: 5,
          adImpl: 5,
          createdAt: '2016-05-02'
        }],
        loadings: false,
        totalRecords: 100,
        pageNum: 1,
        pageSize: 20
    };
  },
  computed: {
    exportURL () {
      let url = apiUtil.url('/v1/ota/otaconfig/export');
      return url;
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.load(1, 20);
    });
  },
  components: { pager },
  methods: {
    load (pageNum, pageSize) {
      let params = {};
      params.pageIndex = pageNum || this.pageNum;
      params.pageSize = pageSize || this.pageSize;
      this.loadings = true;
      this.$http.get('/v1/ota/{pageIndex}/{pageSize}/otaconfig', {params: params}).then(response => {
        this.loadings = false;
        let data = response.body;
        if (data.ret!=1) {
          this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.tableData = result.results;
        this.pageSize = result.pageSize;
        this.totalRecords = result.totalRecords;
      }, response => {
        this.loadings = false;
      });
    },
    changeOta (id) {
      this.$router.push({
        path: 'otaclient/configuration',
        query: {
          resultId: id
        }
      });
    },
    configOta (id, companyname, appname) {
      console.log(id + ' '+ companyname + ' ' + appname);
      this.$router.push({
        path: 'otaclient/configs',
        query: {
          resultId: id,
          companyName: companyname,
          appName: appname
        }
      });
    },
    downLoad () {
      window.location.href = this.exportURL;
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .ota-client-wrapper
    overflow: hidden
    .client-top-wrapper
      margin-bottom: 15px
      .search
        color: #fff
        .el-input
          width: 230px
          input
            border-radius: 4px 0 0 4px
        button 
          border-radius: 0 4px 4px 0
    .pager-wrapper
      margin-top: 15px      
</style>
