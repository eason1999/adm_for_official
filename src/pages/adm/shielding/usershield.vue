<template>
  <div class="user-shield-wrapper">
    <h2>用户黑名单</h2>
    <div class="shield-top-wrapper clearfix">
      <el-button type="primary" class="pull-left"><router-link class="search" to="user/adduser">新增</router-link></el-button>
    </div>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="address" label="ID"></el-table-column>
      <el-table-column prop="name" label="IMEI/IDFA"></el-table-column>
      <el-table-column prop="date" label="创建日期"></el-table-column>
    </el-table>
    <div class="pager-wrapper clearfix">
      <pager class="pull-right" :total-records="totalRecords" :page-sizes="pageSize" :page-nums="pageNum"></pager>
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
        pageSize: 10
    };
  },
  components: { pager }
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
