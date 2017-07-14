<template>
  <div class="selfdefined-monitor-wrapper">
    <h2>监测代码</h2>
    <div class="monitor-top-wrapper clearfix">
      <el-button type="primary" class="pull-left"><router-link class="search" to="monitor/create">新建监测</router-link></el-button>
    </div>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="date" label="公司名称"></el-table-column>
      <el-table-column prop="name" label="计划名称"></el-table-column>
      <el-table-column prop="name" label="策略名称"></el-table-column>
      <el-table-column prop="address" label="创意名称"></el-table-column>
      <el-table-column prop="date" label="展现监测地址"></el-table-column>
      <el-table-column prop="name" label="点击监测地址"></el-table-column>
      <el-table-column prop="address" label="日期"></el-table-column>
    </el-table>
    <div class="pager-wrapper clearfix" v-if="tableData.length">
      <pager :total-records="totalRecords" :page-sizes="pageSize" :page-nums="pageNum"></pager>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import pager from '../../../components/pager/pager.vue';
export default {
  data () {
    return {
      tableData: [],
        totalRecords: 100,
        pageNum: 1,
        pageSize: 10
    };
  },
  components: { pager }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .selfdefined-monitor-wrapper
    overflow: hidden
    .monitor-top-wrapper
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
