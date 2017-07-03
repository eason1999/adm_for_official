<template>
  <div class="resource-hit-wrapper">
    <div class="resource-top-wrapper clearfix">
      <div class="resource-search pull-right">
        <el-input placeholder="请输入内容" v-model="keywords"></el-input>
        <el-button type="primary">搜索</el-button>
      </div>
    </div>
    <el-table :data="tableData" stripe style="width: 100%" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
      <el-table-column prop="adName" label="广告源" show-overflow-tooltip></el-table-column>
      <el-table-column label="应用名称&ID" show-overflow-tooltip>
        <template scope="scope">
          <p>{{scope.row.appName}}</p>
          <p>ID: {{scope.row.appId}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="广告位名称&ID" show-overflow-tooltip>
        <template scope="scope">
          <p>{{scope.row.slotname}}</p>
          <p>ID: {{scope.row.adslotId}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="deviceType" label="流量类型" show-overflow-tooltip></el-table-column>
      <el-table-column label="命中周期" show-overflow-tooltip>
        <template scope="scope">
          <span>{{scope.row.hitStartDate}}~</span>
          <span>{{scope.row.hitEndDate}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pager-wrapper clearfix">
      <pager :total-records="totalRecords" :page-sizes="pageSize" :page-nums="pageNum"></pager>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import pager from '../../../../components/pager/pager.vue';
export default {
  data () {
    return {
      tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
        totalRecords: 100,
        pageNum: 1,
        pageSize: 10,
        type: 'HIT',
        keywords: '',
        loadings: false
    };
  },
  components: { pager },
  mounted () {
    this.$nextTick(() => {
      this.load(1);
    });
  },
  methods: {
    load (pageNum) {
      this.loadings = true;
      let params = {};
      params.keywords = this.keywords;
      params.pageSize = this.pageSize;
      params.pageNum = pageNum || this.pageNum;
      params.type = this.type;
      this.$http.get('/v1/source/sourceList/{pageNum}/{pageSize}', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.data;
        if (data.ret!=1) {
          this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.pageSize = result.pageSize;
        this.pageNum = result.pageNum;
        this.totalRecords = result.totalRecords;
        this.tableData = result.results;
      }, () => {
        this.loadings = false;
      });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .resource-hit-wrapper
    overflow: hidden
    .resource-top-wrapper
      margin-bottom: 15px
      .search 
        color: #fff
      .resource-search
        max-width: 300px
        font-size: 0
        .el-input
          width: 230px
          input
            border-radius: 4px 0 0 4px
        button 
          border-radius: 0 4px 4px 0
    .pager-wrapper
      margin-top: 15px  
    .el-table
      .el-button
        margin: 2px      
</style>
