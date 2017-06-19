<template>
  <div class="dev-account-wrapper">
    <h2>开发者账户</h2>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="type" label="公司名称"></el-table-column>
      <el-table-column prop="os" label="账号"></el-table-column>
      <el-table-column prop="name" label="密码"></el-table-column>
      <el-table-column prop="address" label="角色"></el-table-column>
      <el-table-column prop="manage" label="管理员"></el-table-column>
      <el-table-column prop="state" label="审核状态"></el-table-column>
      <el-table-column prop="date" label="提交日期"></el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button type="primary" size="small">审核</el-button>
          <el-button type="primary" size="small" @click="config(scope.$index,scope.row)">配置</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pager :total-records="totalRecords" :page-sizes="pageSize" :page-nums="pageNum"></pager>
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
          address: '上海市普陀区金沙江路 1518 弄',
          type: 'ios',
          os: 'IOS',
          manage: 'eason',
          state: '通过'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
          type: 'android',
          os: 'IOS',
          manage: 'eason',
          state: '通过'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          type: 'api',
          os: 'IOS',
          manage: 'eason',
          state: '通过'
        }],
        totalRecords: 100,
        pageNum: 1,
        pageSize: 10
    };
  },
  components: { pager },
  methods: {
    config (index,tableData) {
      console.log(tableData.type);
      this.$router.push({
        path: 'devaccount/config'
      });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .dev-account-wrapper
    .el-table 
      margin-bottom: 15px
</style>
