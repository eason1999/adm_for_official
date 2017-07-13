<template>
  <div class="datamonitor-dev-wrapper">
    <h2>DEV实时数据</h2>
    <div class="dev-top-wrapper clearfix">
      <div class="pull-left">
        <el-button type="primary"><router-link to="devdata/devdetail" class="search">明细查询</router-link></el-button>
        <el-button type="primary"><router-link to="devdata/devfile" class="search">过滤查询</router-link></el-button>
      </div>
      <div class="pull-right">
        <datepicker :datepickers="datepickers" @datechange="load" :picker-options="pickerOptions"></datepicker>
      </div>
    </div>
    <el-table :data="tableData" stripe style="width: 100%" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
      <el-table-column prop="company" label="公司名称"></el-table-column>
      <el-table-column prop="impressions" label="展现数" sortable></el-table-column>
      <el-table-column prop="clicks" label="点击数" sortable></el-table-column>
    </el-table>
    <div class="pager-wrapper clearfix" v-if="tableData.length">
      <pager class="pull-right" :total-records="totalRecords" @pagechange="load" :page-sizes="pageSize" :page-nums="pageNum"></pager>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import pager from '../../../components/pager/pager.vue';
import datepicker from '../../../components/datepicker/datepicker.vue';
export default {
  data () {
    return {
      tableData: [],
        totalRecords: -1,
        pageNum: 1,
        pageSize: 20,
        datepickers: {value: new Date(), align: 'right', type: 'date'},
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() > new Date().getTime();
          },
          onPick (data) {
            console.log(data);
          }
        },
        loadings: false
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.load();
    });
  },
  components: { pager, datepicker },
  methods: {
    load (pageNum, pageSize) {
      let params = {};
      params.pageNum = pageNum || this.pageNum;
      params.pageSize = pageSize || this.pageSize;
      params.date = this.datepickers.value.getTime();
      this.loadings = true;
      this.$http.get('/v1/adm/monitor/devs/{pageNum}/{pageSize}', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.tableData = result.list;
        this.pageSize = result.pageSize;
        this.totalRecords = result.totalRecords;
      }, () => {this.loadings = false;});
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .datamonitor-dev-wrapper
    overflow: hidden
    .dev-top-wrapper
      margin-bottom: 15px
      .search
        color: #fff
    .pager-wrapper
      margin-top: 15px      
</style>
