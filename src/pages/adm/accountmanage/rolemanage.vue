<template>
  <div class="role-manage-wrapper">
    <h2>账户权限</h2>
    <div class="clearfix button-wrapper">
      <el-button type="primary" class="pull-left"><router-link to="rolemanage/roledit" class="search">新增</router-link></el-button>
      <div class="role-search pull-right">
        <el-input placeholder="请输入内容"></el-input>
        <el-button type="primary">搜索</el-button>
      </div>
    </div>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="name" label="角色"></el-table-column>
      <el-table-column prop="date" label="提交日期"></el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button type="primary" size="small" @click="edit(scope.$index,scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="clearfix">
      <el-button type="primary" class="pull-left">导出EXCEL</el-button>
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
          name: '王小虎'
        }, {
          date: '2016-05-04',
          name: '王小虎'
        }, {
          date: '2016-05-01',
          name: '王小虎'
        }],
        totalRecords: 100,
        pageNum: 1,
        pageSize: 10
    };
  },
  components: { pager },
  methods: {
    edit (index,tableData) {
      console.log(tableData.type);
      this.$router.push({
        path: 'rolemanage/roledit'
      });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .role-manage-wrapper
      .button-wrapper
        margin-bottom: 15px
        .search 
          color: #fff
        .role-search
          max-width: 300px
          font-size: 0
          .el-input
            width: 230px
            input
              border-radius: 4px 0 0 4px
          button 
            border-radius: 0 4px 4px 0  
      .el-table 
        margin-bottom: 15px
</style>
