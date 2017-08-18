<template>
  <div class="resource-unbind-wrapper">
    <div class="resource-top-wrapper clearfix">
      <div class="left-park pull-left">
        <div class="date-range pull-left">
          <label>日期区间：</label>
          <datepicker :datepickers="datepickers" :picker-options="pickerOptions"></datepicker>
        </div>
        <div class="search-item pull-left">
          <label>展现数低于：</label>
          <el-input placeholder="请输入内容" v-model="reveals"></el-input>
        </div>
        <el-button type="primary" @click="load(1, 20)">查询</el-button>
      </div>
      <div class="resource-search pull-right">
        <el-input placeholder="请输入内容" v-model="keywords"></el-input>
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
      <el-table-column prop="deviceType" label="流量类型" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" show-overflow-tooltip>
        <template scope="scope">
          <el-button type="primary" size="small" @click="unbind(scope.row.id)">解绑</el-button>
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
import datepicker from '../../../../components/datepicker/datepicker.vue';
export default {
  data () {
    return {
      tableData: [],
      dialogVisible: false,
      gridData: [],
      totalRecords: -1,
      pageNum: 1,
      pageSize: 20,
      type: 'HIT',
      keywords: '',
      loadings: false,
      datepickers: {value: [new Date(new Date().getTime()-90*24*3600*1000), new Date()], align: 'left', type: 'daterange'},
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > new Date().getTime();
        },
        onPick (data) {
          console.log(data);
        }
      },
      reveals: 5000
    };
  },
  components: { pager, datepicker },
  mounted () {
    this.$nextTick(() => {
      this.load(1,20);
    });
  },
  methods: {
    load (pageNum,pageSize) {
      let req = /^\d+$/;
      if ( this.reveals === '' || !req.test(this.reveals)) {
      	return this.$alert('请输入展现数，且为为非负整数！', '提示：', {
      		confirmButtonText: '确定'
      	});
      }	
      this.loadings = true;
      let params = {};
      params.keywords = this.keywords;
      params.pageSize = pageSize || this.pageSize;
      params.pageNum = pageNum || this.pageNum;
      params.startDate = this.datepickers.value[0].getTime();
      params.endDate = this.datepickers.value[1].getTime();
      params.impressions = this.reveals;
      this.$http.get('/v1/source/freeSourceList/{pageNum}/{pageSize}', {params: params}).then((res) => {
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
    unbind (id) {
      this.$confirm('确定解绑吗？？？').then((res) => {
        if (res === 'confirm') {
          this.loadings = true;
          this.$http.post('/v1/source/sourceBo/free/'+id).then((res) => {
            this.loadings = false;
            let data = res.body;
            if (data.ret!=1) {
              return this.$alert(data.message, '提示：', {
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
  .resource-unbind-wrapper
    overflow: hidden
    .resource-top-wrapper
      margin-bottom: 15px
      .left-park
        .date-range
          width: 290px
          margin-right: 10px
          .el-input
            width: 205px
        .search-item 
          width: 200px 
          margin-right: 5px
          .el-input
            width: 95px
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
