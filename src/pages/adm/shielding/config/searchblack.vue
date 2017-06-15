<template>
  <div class="shield-search-wrapper">
    <h2>黑名单查询</h2>
    <div class="shield-title-wrapper">
      <div class="create-select dowm-forward">
        <span class="list-title">开发者名称：</span>
        <selects></selects>
      </div>
      <div class="plan-select dowm-forward">
        <span class="list-title">应用名称：</span>
        <selects></selects>
      </div>
      <div class="plan-select dowm-forward">
        <span class="list-title">广告位名称：</span>
        <selects></selects>
      </div>
      <div class="plan-select dowm-forward">
        <span class="list-title">黑名单类型：</span>
        <selects></selects>
      </div>
      <div class="plan-select dowm-forward">
        <span class="list-title">黑名单内容：</span>
        <el-input v-model="input" placeholder="请输入内容"></el-input>
      </div>
      <el-button type="primary">查询</el-button>
    </div>
    <div class="shield-table-wrapper">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="date" label="日期"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
      </el-table>
    </div>
    <div class="shield-footer-wrapper clearfix">
      <el-button type="primary" class="pull-left">导出EXCEL</el-button>
      <div class="page-wrapper pull-right">
        <pager :total-records="totalRecords" :page-sizes="pageSize" :page-nums="pageNum"></pager>
      </div>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import selects from '../../../../components/selects/select.vue';
import pager from '../../../../components/pager/pager.vue';
export default {
  data () {
    return {
      items: [
        {icon: 'el-icon-star-on',num: 0,text: '展现数'},
        {icon: 'el-icon-message',num: 0,text: '点击数'},
        {icon: 'el-icon-share',num: 0,text: '点击率'},
        {icon: 'el-icon-menu',num: 0,text: '消费'}
      ],
      input: '',
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
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎1',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      totalRecords: 100,
      pageNum: 1,
      pageSize: 10
    };
  },
  mounted () {
    
  },
  components: { selects, pager }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .shield-search-wrapper
    .bread-title-wrapper
      margin-bottom: 15px
    .shield-title-wrapper
      margin-bottom: 15px
      padding: 20px
      background: #fff
      border: 1px solid #eee
      .dowm-forward
        margin-bottom: 10px
        width: 260px  
        .el-select
          display: block
    .shield-table-wrapper
      margin-bottom: 20px     
</style>
