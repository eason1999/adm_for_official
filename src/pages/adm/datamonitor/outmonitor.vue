<template>
  <div class="datamonitor-outmonitor-wrapper">
    <h2>外发监测</h2>
    <div class="outmonitor-top-wrapper clearfix">
      <div class="pull-right">
        <datepicker :datepickers="datepickers" :picker-options="pickerOptions"></datepicker>
      </div>
    </div>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="address" label="日期"></el-table-column>
      <el-table-column prop="date" label="广告主"></el-table-column>
      <el-table-column prop="date1" label="广告位"></el-table-column>
      <el-table-column prop="date2" label="展现数"></el-table-column>
      <el-table-column prop="name" label="点击数"></el-table-column>
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
          date2: 121
        }, {
          date: '王小虎',
          name: '1',
          address: '1517',
          date1: 12,
          date2: 121
        }, {
          date: '王小虎',
          name: '1',
          address: '1519',
          date1: 12,
          date2: 121
        }, {
          date: '王小虎',
          name: '1518',
          address: '1516',
          date1: 12,
          date2: 121
        }],
        totalRecords: 100,
        pageNum: 1,
        pageSize: 10,
        datepickers: {value:'', align: 'right', type: 'date'},
        pickerOptions: {}
    };
  },
  components: { pager, datepicker }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .datamonitor-outmonitor-wrapper
    overflow: hidden
    .outmonitor-top-wrapper
      margin-bottom: 15px
      .search
        color: #fff
    .pager-wrapper
      margin-top: 15px      
</style>
