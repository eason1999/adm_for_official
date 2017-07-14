<template>
  <div class="user-shield-wrapper">
    <h2>用户黑名单</h2>
    <div class="shield-top-wrapper clearfix">
      <el-button type="primary" class="pull-left"><router-link class="search" to="user/adduser">新增</router-link></el-button>
    </div>
    <el-table :data="tableData" stripe style="width: 100%" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="imei" label="IMEI/IDFA"></el-table-column>
      <el-table-column prop="createdAt" label="创建日期" sortable show-overflow-tooltip></el-table-column>
    </el-table>
    <div class="pager-wrapper clearfix" v-if="tableData.length">
      <pager class="pull-right" @pagechange="load" :total-records="totalRecords" :page-sizes="pageSize" :page-nums="pageNum"></pager>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import pager from '../../../components/pager/pager.vue';
export default {
  data () {
    return {
      tableData: [],
        totalRecords: -1,
        pageNum: 1,
        pageSize: 20,
        loadings: false
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.load();
    });
  },
  components: { pager },
  methods: {
    load (pageNum, pageSize) {
      let params = {};
      params.pageIndex = pageNum || this.pageNum;
      params.pageSize = pageSize || this.pageSize;
      this.loadings = true;
      this.$http.get('/v1/ota/{pageIndex}/{pageSize}/blacklist', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.tableData = result.results;
        this.pageSize = result.pageSize;
        this.totalRecords = result.totalRecords;
      }, () => {this.loadings = false;});
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .user-shield-wrapper
    overflow: hidden
    .shield-top-wrapper
      margin-bottom: 15px
      .search
        color: #fff
    .pager-wrapper
      margin-top: 15px      
</style>
