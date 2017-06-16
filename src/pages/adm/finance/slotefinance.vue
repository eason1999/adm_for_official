<template>
  <div class="finance-slote-wrapper">
    <h2>广告源财务信息</h2>
    <div class="slote-top-wrapper clearfix">
      <el-button type="primary" class="pull-left">命中/激励</el-button>
      <el-button type="primary" class="pull-left">触发收入金额</el-button>
      <div class="slote-search pull-right">
        <selects class="pull-left"></selects>
        <div class="pull-right">
          <datepicker :datepickers="datepickers1"></datepicker>
          <span class="center-span">至</span>
          <datepicker :datepickers="datepickers2"></datepicker>
          <el-button type="primary">搜索</el-button>
        </div>
      </div>
    </div>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="date" label="日期"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
    </el-table>
    <div class="pager-wrapper clearfix">
      <pager :total-records="totalRecords" :page-sizes="pageSize" :page-nums="pageNum"></pager>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import pager from '../../../components/pager/pager.vue';
import datepicker from '../../../components/datepicker/datepicker.vue';
import selects from '../../../components/selects/select.vue';
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
        datepickers1: {value:'', align: 'left', type: 'month'},
        datepickers2: {value:'', align: 'left', type: 'month'}
    };
  },
  components: { pager, datepicker, selects }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .finance-slote-wrapper
    overflow: hidden
    .slote-top-wrapper
      margin-bottom: 15px
      .slote-search
        min-width: 300px
        font-size: 0
        .center-span
          display: inline-block
          border: 1px solid #bbb
          font-size: 14px
          padding: 10px
          border-left: none
          border-right: none
        .el-input
          width: 230px
          input
            border-radius: 4px 0 0 4px
        button 
          border-radius: 0 4px 4px 0
    .pager-wrapper
      margin-top: 15px      
</style>
