<template>
  <div class="datamonitor-dev-wrapper">
    <h2>DEV实时数据</h2>
    <div class="dev-top-wrapper clearfix">
      <div class="pull-left">
        <el-button type="primary"><router-link to="devdata/devdetail" class="search">明细查询</router-link></el-button>
        <el-button type="primary"><router-link to="devdata/devfile" class="search">过滤查询</router-link></el-button>
      </div>
      <div class="pull-right">
        <datepicker :datepickers="datepickers"></datepicker>
      </div>
    </div>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="address" label="公司名称"></el-table-column>
      <el-table-column prop="name" label="展现数"></el-table-column>
      <el-table-column prop="date" label="点击数"></el-table-column>
    </el-table>
    <div class="pager-wrapper clearfix">
      <pager class="pull-right" :total-records="totalRecords" :page-sizes="pageSize" :page-nums="pageNum"></pager>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import pager from '../../../components/pager/pager.vue';
import datepicker from '../../../components/datepicker/datepicker.vue';
export default {
  data () {
    return {
      tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '1518'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '1517'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '1519'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '1516'
        }],
        totalRecords: 100,
        pageNum: 1,
        pageSize: 10,
        datepickers: {value:'', align: 'right', type: 'date'}
    };
  },
  components: { pager, datepicker }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .datamonitor-dev-wrapper
    overflow: hidden
    .dev-top-wrapper
      margin-bottom: 15px
      .search
        color: #fff
    .pager-wrapper
      margin-top: 15px      
</style>
