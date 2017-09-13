<template>
  <div class="resource-seo-wrapper">
    <div class="resource-top-wrapper clearfix">
      <div class="resource-search pull-right">
        <el-input placeholder="请输入内容" v-model="keywords" @keyup.native.enter="load(1, 20)"></el-input>
        <el-button type="primary" @click="load(1, 20)">搜索</el-button>
      </div>
    </div>
    <el-table :data="tableData" stripe style="width: 100%" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
      <el-table-column prop="adName" label="广告源" sortable show-overflow-tooltip></el-table-column>
      <el-table-column label="应用名称&ID" show-overflow-tooltip>
        <template scope="scope">
          <a href="javascript:;" @click="getDetail(scope.row.adslotId,scope.row.slotStatus)">
            <p>{{scope.row.appName}}</p>
            <p>ID: {{scope.row.appId}}</p>
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="广告位名称&ID" show-overflow-tooltip>
        <template scope="scope">
          <a href="javascript:;" @click="getDetail(scope.row.adslotId,scope.row.slotStatus)">
            <p>{{scope.row.slotname}}</p>
            <p>ID: {{scope.row.adslotId}}</p>
          </a>
        </template>
      </el-table-column>
      <el-table-column label="操作" show-overflow-tooltip>
        <template scope="scope">
          <el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pager-wrapper clearfix">
      <pager :total-records="totalRecords" @pagechange="load" :page-sizes="pageSize" :page-nums="pageNum"></pager>
    </div>
    <el-dialog title="ADroi映射" :visible.sync="dialogVisible">
      <el-table :data="gridData">
        <el-table-column property="company" label="广告源" show-overflow-tooltip></el-table-column>
        <el-table-column label="应用名称&ID" show-overflow-tooltip>
          <template scope="scope">
            <p>{{scope.row.appName}}</p>
            <p>ID: {{scope.row.appId}}</p>
          </template>
        </el-table-column>
        <el-table-column label="广告位名称&ID" show-overflow-tooltip>
          <template scope="scope">
            <p>{{scope.row.adslotName}}</p>
            <p>ID: {{scope.row.adslotId}}</p>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script type="ecmascript-6">
import pager from '../../../../components/pager/pager.vue';
export default {
  data () {
    return {
      tableData: [],
      dialogVisible: false,
      gridData: [],
      totalRecords: -1,
      pageNum: 1,
      pageSize: 20,
      keywords: '',
      loadings: false,
      type: 'OPTIMIZE'
    };
  },
  components: { pager },
  mounted () {
    this.$nextTick(() => {
      this.load();
    });
  },
  methods: {
    load (pageNum, pageSize) {
      this.loadings = true;
      let params = {};
      params.keywords = this.keywords;
      params.pageSize = pageSize || this.pageSize;
      params.pageNum = pageNum || this.pageNum;
      params.type = this.type;
      this.$http.get('/v1/source/sourceList/{pageNum}/{pageSize}', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.data;
        if (data.ret!=1) {
          this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.pageSize = result.pageSize;
        this.pageNum = result.pageNum;
        this.totalRecords = result.totalRecords;
        this.tableData = result.results;
      }, () => {
        this.loadings = false;
      });
    },
    getDetail (id,accessFormat) {
      let params = {};
      params.dspadslotid = id;
      params.slotStatus = accessFormat;
      this.loadings = true;
      this.$http.get('/v1/source/subList', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret !=1 ) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        this.dialogVisible = true;
        let result = data.result;
        this.gridData = result;
      }, () => {this.loadings = false;});
    },
    handleDelete (index, id) {
      this.$confirm('确定删除吗？？？').then((res) => {
        if (res === 'confirm') {
          this.loadings = true;
          this.$http.post('/v1/source/sourceBo/removeOptimize/'+id).then((res) => {
            this.loadings = false;
            let data = res.body;
            if (data.ret!=1) {
              return this.$alert(data.messge, '提示：', {
                confirmButtonText: '确定'
              });
            }
            this.load();
          }, () => {this.loadings = false;});
        }
      }).catch((res) => {console.log(res)});
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .resource-seo-wrapper
    overflow: hidden
    .resource-top-wrapper
      margin-bottom: 15px
      .search 
        color: #fff
      .resource-search
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
    .el-table
      .el-button
        margin: 2px      
</style>
