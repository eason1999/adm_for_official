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
      <el-form :model="ruleForm" :rules="rules" :label-position="labelPosition" ref="ruleForm">
        <el-form-item label="公司名称：" prop="advId">
          <el-select v-model="ruleForm.advId" @change="loadplans" filterable placeholder="请选择" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
            <el-option
              v-for="item in advs"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计划名称：" prop="planId">
          <el-select v-model="ruleForm.planId" @change="loadcreates" filterable placeholder="请选择">
            <el-option
              v-for="item in plans"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创意名称：" prop="createId">
          <el-select v-model="ruleForm.createId" @change="loadmedias" filterable placeholder="请选择">
            <el-option
              v-for="item in creates"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="定向媒体：">
          <el-select v-model="ruleForm.mediaId" filterable placeholder="全部媒体">
            <el-option
              v-for="item in medias"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search('ruleForm')">查询</el-button>
        </el-form-item>  
      </el-form>
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
      medias: [{id: '-1', text: '全部媒体'}],
      ruleForm: {
        advId: '',
        planId: '',
        createId: '',
        mediaId: '-1'
      },
      rules: {
        advId: [
          { required: true, message: '请选择公司', trigger: 'change' }
        ],
        planId: [
          { required: true, message: '请选择计划', trigger: 'change' }
        ],
        createId: [
          { required: true, message: '请选择创意', trigger: 'change' }
        ]
      },
      totalData: [
        {icon: 'el-icon-star-on',num: 0,text: '展现数'},
        {icon: 'el-icon-message',num: 0,text: '点击数'},
        {icon: 'el-icon-share',num: 0,text: '点击率'},
        {icon: 'el-icon-menu',num: 0,text: '消费'}
      ],
      labelPosition: 'top',
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
      params.advId = this.ruleForm.advId;
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
        this.ruleForm.planId = '';
        this.ruleForm.createId = '';
        this.creates = [];
        this.ruleForm.mediaId = '-1';
        this.medias = [{id: '-1', text: '全部媒体'}];
      }, () => {this.loadings = false;});
    },
    loadcreates () {
      this.loadings = true;
      let params = {};
      if (this.ruleForm.planId === '') {
        params.campaignId = -1;
      } else {
        params.campaignId = this.ruleForm.planId;
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
        this.ruleForm.createId = '';
        this.ruleForm.mediaId = '-1';
        this.medias = [{id: '-1', text: '全部媒体'}];
      }, () => {this.loadings = false;});
    },
    loadmedias () {
      this.loadings = true;
      let params = {};
      params.campaignId = this.ruleForm.planId;
      params.creativeId = this.ruleForm.createId;
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
        this.medias = [{id: '-1', text: '全部媒体'}].concat(result);
        this.ruleForm.mediaId = '-1';
      }, () => {this.loadings = false;});
    },
    search (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.load();
        } else {
          return this.$alert('请正确输入相应选项！！！', '提示：', {
            confirmButtonText: '确定'
          });
        }
      });
    },
    load (pageNum, pageSize) {
      let params = {};
      params.creativeId = this.ruleForm.createId;
      params.mediaId = this.ruleForm.mediaId;
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
      params.mediaId = this.ruleForm.mediaId;
      params.creativeId = this.ruleForm.createId;
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
      .el-form-item
        width: 280px
        .el-select
          display: block
        &:last-child
          margin-bottom: 0  
      .dowm-forward
        margin-bottom: 20px
        width: 280px  
        .el-input
          display: block
          width: 100%  
    .data-total-wrapper
      margin-bottom: 15px       
    .data-table-wrapper
      margin-bottom: 20px     
</style>
