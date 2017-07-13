<template>
  <div class="datamonitor-outmonitor-wrapper">
    <h2>外发监测</h2>
    <div class="outmonitor-top-wrapper clearfix">
      <div class="pull-right">
        <datepicker :datepickers="datepickers" @datechange="load" :picker-options="pickerOptions"></datepicker>
      </div>
    </div>
    <el-table :data="tableData" stripe style="width: 100%" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
      <el-table-column prop="date" label="日期" sortable show-overflow-tooltip></el-table-column>
      <el-table-column prop="mediaName" label="广告主名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="slotName" label="广告位名称" show-overflow-tooltip></el-table-column>
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
      datepickers: {value: [new Date(), new Date()], align: 'left', type: 'daterange'},
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > new Date().getTime();
        },
        onPick (data) {
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
      params.startDate = this.datepickers.value[0].getTime();
      params.endDate = this.datepickers.value[1].getTime();
      this.loadings = true;
      this.$http.get('/v1/adm/monitor/extra/{pageNum}/{pageSize}', {params: params}).then((res) => {
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
  .datamonitor-outmonitor-wrapper
    overflow: hidden
    .outmonitor-top-wrapper
      margin-bottom: 15px
      .search
        color: #fff
    .pager-wrapper
      margin-top: 15px      
</style>
