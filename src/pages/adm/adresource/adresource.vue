<template>
  <div class="adv-resource-wrapper">
    <h2>广告源配置</h2>
    <div class="tab-page-wrapper">
      <tabpage></tabpage>
    </div>
    <div class="resource-top-wrapper clearfix">
      <el-button type="primary" class="pull-left">新建广告位ID</el-button>
      <div class="resource-search pull-right">
        <el-input placeholder="请输入内容"></el-input>
        <el-button type="primary">搜索</el-button>
      </div>
    </div>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="date" label="日期"  width="180"></el-table-column>
      <el-table-column prop="name" label="姓名" width="180"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
    </el-table>
    <div class="pager-wrapper clearfix">
      <pager :total-records="totalRecords" :page-sizes="pageSize" :page-nums="pageNum"></pager>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import pager from '../../../components/pager/pager.vue';
import tabpage from '../../../components/tabpage/tabpage.vue';
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
  components: { pager, tabpage }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .adv-resource-wrapper
    overflow: hidden
    .resource-top-wrapper
      margin-bottom: 15px
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
</style>
