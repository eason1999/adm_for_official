<template>
  <div class="datamonitor-adv-wrapper">
    <h2>ADV实时数据</h2>
    <div class="adv-top-wrapper clearfix">
      <div class="pull-left">
        <el-button type="primary"><router-link to="advdata/advdetail" class="search">明细查询</router-link></el-button>
        <el-button type="primary"><router-link to="advdata/advfile" class="search">过滤查询</router-link></el-button>
      </div>
      <div class="pull-right">
        <datepicker :datepickers="datepickers"></datepicker>
      </div>
    </div>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="address" label="计划名称&ID"></el-table-column>
      <el-table-column prop="name" label="展现数"></el-table-column>
      <el-table-column prop="date" label="点击数"></el-table-column>
      <el-table-column prop="date1" label="下载数"></el-table-column>
      <el-table-column prop="date2" label="点击率（%）"></el-table-column>
      <el-table-column prop="date3" label="日上限"></el-table-column>
      <el-table-column prop="date4" label="统计消费（￥）"></el-table-column>
      <el-table-column prop="date5" label="实时消费（￥）"></el-table-column>
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
          date: '王小虎',
          name: '1',
          address: '1518',
          date1: 12,
          date2: 121,
          date3: 122,
          date4: 123,
          date5: 124
        }, {
          date: '王小虎',
          name: '1',
          address: '1517',
          date1: 12,
          date2: 121,
          date3: 122,
          date4: 123,
          date5: 124
        }, {
          date: '王小虎',
          name: '1',
          address: '1519',
          date1: 12,
          date2: 121,
          date3: 122,
          date4: 123,
          date5: 124
        }, {
          date: '王小虎',
          name: '1518',
          address: '1516',
          date1: 12,
          date2: 121,
          date3: 122,
          date4: 123,
          date5: 124
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
  .datamonitor-adv-wrapper
    overflow: hidden
    .adv-top-wrapper
      margin-bottom: 15px
      .search
        color: #fff
    .pager-wrapper
      margin-top: 15px      
</style>
