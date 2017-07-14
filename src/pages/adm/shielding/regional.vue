<template>
  <div class="regional-shield-wrapper">
    <h2>地域黑名单</h2>
    <div class="shield-top-wrapper clearfix">
      <el-button type="primary" class="pull-left"><router-link class="search" to="regional/addregional">新增</router-link></el-button>
    </div>
    <el-table :data="tableData" stripe style="width: 100%" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
      <el-table-column prop="companyName" label="公司名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="appName" label="应用名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="blackAreaNames" label="屏蔽地域" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createdAt" label="创建日期" sortable show-overflow-tooltip></el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button type="info" size="small" @click="handleEdit(scope.row.id)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pager-wrapper clearfix" v-if="tableData.length">
      <pager class="pull-right" :total-records="totalRecords" @pagechange="load" :page-sizes="pageSize" :page-nums="pageNum"></pager>
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
      this.$http.get('/v1/ota/{pageIndex}/{pageSize}/blackAreas', {params: params}).then((res) => {
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
    },
    handleEdit (id) {
      this.$router.push({
        path: 'regional/addregional',
        query: {
          id: id
        }
      });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .regional-shield-wrapper
    overflow: hidden
    .shield-top-wrapper
      margin-bottom: 15px
      .search
        color: #fff
    .pager-wrapper
      margin-top: 15px      
</style>
