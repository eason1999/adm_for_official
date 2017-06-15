<template>
  <div class="ota-client-wrapper">
    <h2>OTA客户配置</h2>
    <div class="client-top-wrapper clearfix">
      <el-button type="primary" class="pull-left"><router-link class="search" to="otaclient/configuration">新增</router-link></el-button>
    </div>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="date" label="日期"  width="180"></el-table-column>
      <el-table-column prop="name" label="姓名" width="180"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
    </el-table>
    <div class="pager-wrapper clearfix">
      <el-button type="primary" class="pull-left">导出EXCEL</el-button>
      <div class="pull-right">
        <pager :total-records="totalRecords" :page-sizes="pageSize" :page-nums="pageNum"></pager>
      </div>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import pager from '../../../components/pager/pager.vue';
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
        pageSize: 10
    };
  },
  components: { pager }
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
