<template>
  <div class="finance-adv-wrapper">
    <h2>ADV财务信息</h2>
    <div class="adv-top-wrapper clearfix">
      <div class="adv-search pull-right">
        <el-input placeholder="请输入内容" v-model="keyword"></el-input>
        <el-button type="primary" @click="load()">搜索</el-button>
      </div>
    </div>
    <el-table :data="tableData" stripe style="width: 100%" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
      <el-table-column prop="submitTime" label="日期" sortable show-overflow-tooltip></el-table-column>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="advName" label="广告主名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="accountType" label="账户类型" show-overflow-tooltip></el-table-column>
      <el-table-column label="证件预览">
        <template scope="scope">
          <el-button type="info" size="small" @click="previewImg(scope.row.fileUrl)">预览</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pager-wrapper clearfix" v-if="tableData.length">
      <pager :total-records="totalRecords" @pagechange="load" :page-sizes="pageSize" :page-nums="pageNum"></pager>
    </div>
    <el-dialog v-model="dialogVisible" size="tiny">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script type="ecmascript-6">
import pager from '../../../components/pager/pager.vue';
export default {
  data () {
    return {
      tableData: [],
      totalRecords: -1,
      pageNum: 1,
      pageSize: 20,
      keyword: '',
      dialogVisible: false,
      dialogImageUrl: 'about:blank;',
      loadings: false
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.load();
    });
  },
  components: { pager },
  methods: {
    previewImg (fileUrl) {
      this.$nextTick(() => {
        this.dialogImageUrl = '';
        this.dialogImageUrl = fileUrl;
        this.dialogVisible = true;
      });
    },
    load (pageNum, pageSize) {
      let params = {};
      params.keyword = this.keyword;
      params.pageNum = pageNum || this.pageNum;
      params.pageSize = pageSize || this.pageSize;
      this.loadings = true;
      this.$http.get('/v1/adm/adv/finance/{pageNum}/{pageSize}', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.tableData = result.results;
        this.pageSize = result.pageSize;
        this.totalRecords = result.totalRecords;
      }, () => {this.loadings = false;});
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .finance-adv-wrapper
    overflow: hidden
    .adv-top-wrapper
      margin-bottom: 15px
      .adv-search
        max-width: 300px
        font-size: 0
        .el-input
          width: 230px
          input
            border-radius: 4px 0 0 4px
        button 
          border-radius: 0 4px 4px 0
    .pager-wrapper
      margin-top: 15px      
</style>
