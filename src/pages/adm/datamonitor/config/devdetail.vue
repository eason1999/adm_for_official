<template>
  <div class="monitor-devdetail-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="devdetail-title-wrapper">
      <div class="dowm-forward">
        <span class="list-title">时间范围：</span>
        <datepicker :datepickers="datepickers" :picker-options="pickerOptions"></datepicker>
      </div>
      <div class="dowm-forward">
        <span class="list-title">公司名称：</span>
        <el-select v-model="devId" @change="loadapps" filterable placeholder="请选择" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
          <el-option
            v-for="item in devs"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="dowm-forward">
        <span class="list-title">应用名称：</span>
        <el-select v-model="appId" @change="loadslots" filterable placeholder="全部应用">
          <el-option
            v-for="item in apps"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="dowm-forward">
        <span class="list-title">广告位名称：</span>
        <el-select v-model="slotId" @change="loadsources" filterable placeholder="全部广告位">
          <el-option
            v-for="item in slots"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="dowm-forward">
        <span class="list-title">广告源：</span>
        <el-select v-model="sourceId" filterable placeholder="全部广告源">
          <el-option
            v-for="item in sources"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <el-button type="primary" @click="load()">生成报告</el-button>
    </div>
    <div class="data-total-wrapper">
      <totaldata :items="totalData"></totaldata>
    </div>
    <div class="data-table-wrapper">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="hours" label="日期" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="company" label="公司名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="appName" label="应用名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="adSlotName" label="广告位名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="adSourceName" label="广告源" show-overflow-tooltip></el-table-column>
        <el-table-column prop="requests" label="请求数" sortable></el-table-column>
        <el-table-column prop="responses" label="返回数" sortable></el-table-column>
        <el-table-column prop="impressions" label="展现数" sortable></el-table-column>
        <el-table-column prop="clicks" label="点击数" sortable></el-table-column>
      </el-table>
    </div>
    <div class="data-footer-wrapper clearfix" v-if="tableData.length">
      <el-button type="primary" class="pull-left">导出EXCEL</el-button>
      <div class="page-wrapper pull-right">
        <pager :total-records="totalRecords" @pagechange="load" :page-sizes="pageSize" :page-nums="pageNum"></pager>
      </div>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import datepicker from '../../../../components/datepicker/datepicker.vue';
import pager from '../../../../components/pager/pager.vue';
import breadcrumb from '../../../../components/breadcrumb/breadcrumb.vue';
import totaldata from '../../../../components/totaldata/totaldata.vue'; 
export default {
  data () {
    return {
      devs: [],
      apps: [],
      slots: [],
      sources: [],
      devId: '',
      appId: '',
      slotId: '',
      sourceId: '',
      totalData: [
        {icon: 'el-icon-star-on',num: 0,text: '请求数'},
        {icon: 'el-icon-message',num: 0,text: '返回数'},
        {icon: 'el-icon-share',num: 0,text: '展现数'},
        {icon: 'el-icon-menu',num: 0,text: '点击数'}
      ],
      tableData: [],
      totalRecords: 100,
      pageNum: 1,
      pageSize: 20,
      breadContent: [{ text: 'DEV实时数据', path: '/adm/datamonitor/devdata'}, { text: '明细查询'}],
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
      this.loaddevs();
    });
  },
  components: { totaldata, datepicker, pager, breadcrumb },
  methods: {
    loaddevs () {
      this.loadings = true;
      this.$http.get('/v1/adm/company/devs').then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.devs = result;
      }, () => {this.loadings = false;});
    },
    loadapps () {
      this.loadings = true;
      let params = {};
      params.devId = this.devId;
      this.$http.get('/v1/adm/names/apps', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.apps = result;
        this.appId = '';
        this.slotId = '';
        this.slots = [];
        this.sourceId = '';
        this.sources = [];
      }, () => {this.loadings = false;});
    },
    loadslots () {
      this.loadings = true;
      let params = {};
      params.devId = this.devId;
      if (this.appId === '') {
        params.appId = -1;
      } else {
        params.appId = this.appId;
      }
      this.$http.get('/v1/adm/names/apps/{appId}/adslots', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.slots = result;
        this.slotId = '';
        this.sourceId = '';
        this.sources = [];
      }, () => {this.loadings = false;});
    },
    loadsources () {
      this.loadings = true;
      let params = {};
      params.devId = this.devId;
      params.appId = this.appId;
      params.adslotId = this.slotId;
      params.startDate = this.datepickers.value[0].getTime();
      params.endDate = this.datepickers.value[1].getTime();
      this.$http.get('/v1/adm/monitor/devs/adSource', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.sources = result;
      }, () => {this.loadings = false;});
    },
    load (pageNum, pageSize) {
      let params = {};
      params.devId = this.devId;
      if (this.appId!=='') {
        params.appId = this.appId;
      } else {
        params.appId = -1;
      }
      if (this.slotId!=='') {
        params.adslotId = this.slotId;
      } else {
        params.adslotId = -1;
      }
      if(this.sourceId!==''){
        params.channelCode = this.sourceId;
      }else{
        params.channelCode = -1;
      }
      params.pageNum = pageNum || this.pageNum;
      params.pageSize = pageSize || this.pageSize;
      params.startDate = this.datepickers.value[0].getTime();
      params.endDate = this.datepickers.value[1].getTime();
      this.loadings = true;
      this.$http.get('/v1/adm/monitor/devs/hourData/{pageNum}/{pageSize}', {params: params}).then((res) => {
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
        this.loadall();
      }, () => {this.loadings = false;});
    },
    loadall () {
      let params = {};
      params.devId = this.devId;
      if (this.appId!=='') {
        params.appId = this.appId;
      } else {
        params.appId = -1;
      }
      if (this.slotId!=='') {
        params.adslotId = this.slotId;
      } else {
        params.adslotId = -1;
      }
      if(this.sourceId!==''){
        params.channelCode = this.sourceId;
      }else{
        params.channelCode = -1;
      }
      params.startDate = this.datepickers.value[0].getTime();
      params.endDate = this.datepickers.value[1].getTime();
      this.loadings = true;
      this.$http.get('/v1/adm/monitor/devs/totalData', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.totalData[0].num = result.requests;
        this.totalData[1].num = result.responses;
        this.totalData[2].num = result.impressions;
        this.totalData[3].num = result.clicks;
      }, () => {this.loadings = false;});
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .monitor-devdetail-wrapper
    .bread-title-wrapper
      margin-bottom: 15px
    .devdetail-title-wrapper
      margin-bottom: 15px
      padding: 20px
      background: #fff
      border: 1px solid #eee
      .dowm-forward
        margin-bottom: 10px
        width: 260px  
        .el-select
          display: block
        .el-input
          display: block
          width: 100% 
    .data-total-wrapper
      margin-bottom: 15px       
    .data-table-wrapper
      margin-bottom: 20px     
</style>
