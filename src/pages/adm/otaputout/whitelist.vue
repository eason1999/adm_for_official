<template>
  <div class="ota-client-wrapper">
    <h2>应用白名单</h2>
    <div class="client-top-wrapper clearfix">
      <el-button type="primary" class="pull-left"><router-link class="search" to="whitelist/addwhite">新增</router-link></el-button>
    </div>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="date" label="日期"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="name" label="预览">
        <template scope="scope">
          <el-button type="info" size="small" @click="previewImg(scope.$index, scope.row)">预览</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template scope="scope">
          <el-button type="info" size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button type="danger" size="small" @click="handleEdit(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" size="tiny">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <div class="pager-wrapper clearfix">
      <div class="pull-right">
        <pager :total-records="totalRecords" :page-sizes="pageSize" :page-nums="pageNum"></pager>
      </div>
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
        }, {
          date: '2016-05-03',
          name: '王小虎'
        }],
        dialogVisible: false,
        dialogImageUrl: '',
        totalRecords: 100,
        pageNum: 1,
        pageSize: 10
    };
  },
  components: { pager },
  methods: {
    previewImg () {
      this.dialogVisible = true;
      this.dialogImageUrl = '';
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .ota-client-wrapper
    overflow: hidden
    .client-top-wrapper
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
