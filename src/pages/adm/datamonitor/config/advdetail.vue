<template>
  <div class="monitor-advdetail-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="advdetail-title-wrapper">
      <div class="dowm-forward">
        <span class="list-title">时间范围：</span>
        <datepicker :datepickers="datepickers" :picker-options="pickerOptions"></datepicker>
      </div>
      <div class="dowm-forward">
        <span class="list-title">公司名称：</span>
        <el-select v-model="advId" @change="loadplans" filterable placeholder="请选择" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
          <el-option
            v-for="item in advs"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="dowm-forward">
        <span class="list-title">计划名称：</span>
        <el-select v-model="planId" @change="loadcreates" filterable placeholder="请选择">
          <el-option
            v-for="item in plans"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="dowm-forward">
        <span class="list-title">创意名称：</span>
        <el-select v-model="createId" @change="loadmedias" filterable placeholder="请选择">
          <el-option
            v-for="item in creates"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="dowm-forward">
        <span class="list-title">定向媒体：</span>
        <el-select v-model="mediaId" filterable placeholder="全部媒体">
          <el-option
            v-for="item in medias"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <el-button type="primary" @click="load()">查询</el-button>
    </div>
    <div class="data-total-wrapper">
      <totaldata :items="totalData"></totaldata>
    </div>
    <div class="data-table-wrapper">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="hours" label="日期" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="company" label="公司名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="campaignName" label="计划名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="creativeName" label="创意名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="mediaName" label="定向媒体" show-overflow-tooltip></el-table-column>
        <el-table-column prop="impressions" label="展现数" sortable></el-table-column>
        <el-table-column prop="clicks" label="点击数" sortable></el-table-column>
        <el-table-column prop="downloads" label="下载数" sortable></el-table-column>
        <el-table-column prop="ctr" label="点击率（%）" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="consume" label="消费" sortable></el-table-column>
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
      advs: [],
      plans: [],
      creates: [],
      medias: [],
      advId: '',
      planId: '',
      createId: '',
      mediaId: '',
      totalData: [
        {icon: 'el-icon-star-on',num: 0,text: '展现数'},
        {icon: 'el-icon-message',num: 0,text: '点击数'},
        {icon: 'el-icon-share',num: 0,text: '点击率'},
        {icon: 'el-icon-menu',num: 0,text: '消费'}
      ],
      tableData: [],
      totalRecords: -1,
      pageNum: 1,
      pageSize: 20,
      breadContent: [{ text: 'ADV实时数据', path: '/adm/datamonitor/advdata'}, { text: '明细查询'}],
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
      this.loadadvs();
    });
  },
  components: { totaldata, datepicker, pager, breadcrumb },
  methods: {
    loadadvs () {
      this.loadings = true;
      this.$http.get('/v1/adm/names/advs').then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.advs = result;
      }, () => {this.loadings = false;});
    },
    loadplans () {
      this.loadings = true;
      let params = {};
      params.advId = this.advId;
      this.$http.get('/v1/adm/names/campaigns', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.plans = result;
        this.planId = '';
        this.createId = '';
        this.creates = [];
        this.mediaId = '';
        this.medias = [];
      }, () => {this.loadings = false;});
    },
    loadcreates () {
      this.loadings = true;
      let params = {};
      if (this.planId === '') {
        params.campaignId = -1;
      } else {
        params.campaignId = this.planId;
      }
      this.$http.get('/v1/adm/names/campaigns/{campaignId}/creatives', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.creates = result;
        this.createId = '';
        this.mediaId = '';
        this.medias = [];
      }, () => {this.loadings = false;});
    },
    loadmedias () {
      this.loadings = true;
      let params = {};
      params.campaignId = this.planId;
      params.creativeId = this.createId;
      params.startDate = this.datepickers.value[0].getTime();
      params.endDate = this.datepickers.value[1].getTime();
      this.$http.get('/v1/adm/monitor/advs/hourData/getMedia', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.medias = result;
      }, () => {this.loadings = false;});
    },
    load (pageNum, pageSize) {
      let params = {};
      if (this.createId!=='') {
        params.creativeId = this.createId;
      } else {
        params.creativeId = -1;
      }
      if(this.mediaId!==''){
        params.mediaId = this.mediaId;
      }else{
        params.mediaId = -1;
      }
      params.pageNum = pageNum || this.pageNum;
      params.pageSize = pageSize || this.pageSize;
      params.startDate = this.datepickers.value[0].getTime();
      params.endDate = this.datepickers.value[1].getTime();
      this.loadings = true;
      this.$http.get('/v1/adm/monitor/advs/hourData/{pageNum}/{pageSize}', {params: params}).then((res) => {
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
      params.mediaId = this.mediaId;
      if (this.createId!=='') {
        params.creativeId = this.createId;
      } else {
        params.creativeId = -1;
      }
      params.startDate = this.datepickers.value[0].getTime();
      params.endDate = this.datepickers.value[1].getTime();
      this.loadings = true;
      this.$http.get('/v1/adm/monitor/advs/totalData', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.totalData[0].num = result.impressions;
        this.totalData[1].num = result.clicks;
        this.totalData[2].num = result.ctr;
        this.totalData[3].num = result.consume;
      }, () => {this.loadings = false;});
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .monitor-advdetail-wrapper
    .bread-title-wrapper
      margin-bottom: 15px
    .advdetail-title-wrapper
      margin-bottom: 15px
      padding: 20px
      background: #fff
      border: 1px solid #eee
      .dowm-forward
        margin-bottom: 10px
        width: 300px  
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
