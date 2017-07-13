<template>
  <div class="finance-drawcash-wrapper">
    <div class="resource-top-wrapper clearfix">
      <el-button type="primary" class="pull-left"><router-link class="search" to="vouchor/addvouch">新增</router-link></el-button>
      <div class="resource-search pull-right">
        <el-input placeholder="请输入内容" v-model="keyword"></el-input>
        <el-button type="primary" @click="load()">搜索</el-button>
      </div>
    </div>
    <el-table :data="tableData" stripe style="width: 100%" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
      <el-table-column prop="operationTime" label="日期"></el-table-column>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="devName" label="公司名称"></el-table-column>
      <el-table-column prop="transType" label="操作类型"></el-table-column>
      <el-table-column prop="amount" label="金额（￥）"></el-table-column>
      <el-table-column label="提现凭证">
        <template scope="scope">
          <el-button type="primary" size="small" @click="showDialog(scope.row.fileUrl)">预览</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pager-wrapper clearfix" v-if="tableData.length">
      <pager :total-records="totalRecords" @pagechange="load" :page-sizes="pageSize" :page-nums="pageNum"></pager>
    </div>
    <el-dialog v-model="dialogVisible" size="tiny">
      <img width="100%" :src="dialogImageUrl">
    </el-dialog>
  </div>
</template>

<script type="ecmascript-6">
import pager from '../../../../components/pager/pager.vue';
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
    showDialog (fileUrl) {
      this.$nextTick(() => {
        this.dialogImageUrl = '';
        this.dialogImageUrl = fileUrl;
        this.dialogVisible = true;
      });
    },
    load (pageNum, pageSize) {
      let params = {};
      params.type = 1;
      params.keyword = this.keyword;
      params.pageNum = pageNum || this.pageNum;
      params.pageSize = pageSize || this.pageSize;
      this.loadings = true;
      this.$http.get('/v1/adm/dev/withdraws/{pageNum}/{pageSize}', {params: params}).then((res) => {
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
  .finance-drawcash-wrapper
    overflow: hidden
    .pager-wrapper
      margin-top: 15px      
</style>
