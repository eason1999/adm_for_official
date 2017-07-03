<template>
  <div class="ota-client-wrapper">
    <h2>应用白名单</h2>
    <div class="client-top-wrapper clearfix">
      <el-button type="primary" class="pull-left"><router-link class="search" to="whitelist/addwhite">新增</router-link></el-button>
    </div>
    <el-table :data="tableData" stripe style="width: 100%" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
      <el-table-column prop="appName" label="应用名称"></el-table-column>
      <el-table-column prop="packageName" label="应用包名"></el-table-column>
      <el-table-column label="预览">
        <template scope="scope">
          <el-button type="info" size="small" @click="previewImg(scope.row.fileUrl)">预览</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="modifiedAt" label="修改时间"></el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button type="info" size="small" @click="handleEdit(scope.row.id)">修改</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" size="tiny">
      <img width="100%" :src="dialogImageUrl">
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
        dialogImageUrl: 'about:blank',
        totalRecords: 100,
        pageNum: 1,
        pageSize: 20,
        loadings: false
    };
  },
  components: { pager },
  mounted () {
    this.$nextTick(() => {
      this.load(1, 20);
    });
  },
  methods: {
    previewImg (url) {
      this.$nextTick(() => {
        this.dialogImageUrl = url;
        this.dialogVisible = true;
      });
    },
    load (pageNum, pageSize) {
      let params = {};
      this.loadings = true;
      params.pageNum = pageNum || this.pageNum;
      params.pageSize = pageSize || this.pageSize;
      this.$http.get('/v1/adm/ota/{pageNum}/{pageSize}/whiteapps', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.tableData = result.results;
        this.pageSize = result.pageSize;
        this.totalRecords = result.totalRecords;
      }, () => {this.loadings = false;});
    },
    handleEdit (id) {
      console.log(id);
    },
    handleDelete (index, id) {}
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
