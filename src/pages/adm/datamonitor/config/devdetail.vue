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
      <el-form :model="ruleForm" :rules="rules" :label-position="labelPosition" ref="ruleForm">
        <el-form-item label="公司名称：" prop="devId">
          <el-select v-model="ruleForm.devId" @change="loadapps" filterable placeholder="请选择" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
            <el-option
              v-for="item in devs"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应用名称：" prop="appId">
          <el-select v-model="ruleForm.appId" @change="loadslots" filterable placeholder="全部应用">
            <el-option
              v-for="item in apps"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告位名称：" prop="slotId">
          <el-select v-model="ruleForm.slotId" @change="loadsources" filterable placeholder="全部广告位">
            <el-option
              v-for="item in slots"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告源：" prop="sourceId">
          <el-select v-model="ruleForm.sourceId" filterable placeholder="全部广告源">
            <el-option
              v-for="item in sources"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search('ruleForm')">生成报告</el-button>
        </el-form-item>  
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
      apps: [{id: '-1', text: '全部应用'}],
      slots: [{id: '-1', text: '全部广告位'}],
      sources: [{id: '-1', text: '全部广告源'}],
      ruleForm: {
        devId: '',
        appId: '-1',
        slotId: '-1',
        sourceId: '-1'
      },
      rules: {
        devId: [
          { required: true, message: '请选择公司', trigger: 'change' }
        ],
        appId: [
          { required: true, message: '请选择应用', trigger: 'change' }
        ],
        slotId: [
          { required: true, message: '请选择广告位', trigger: 'change' }
        ],
        sourceId: [
          { required: true, message: '请选择广告源', trigger: 'change' }
        ]
      },
      labelPosition: 'top',
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
      params.devId = this.ruleForm.devId;
      this.$http.get('/v1/adm/names/apps', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.apps = [{id: '-1', text: '全部应用'}].concat(result);
        this.ruleForm.appId = '-1';
        this.ruleForm.slotId = '-1';
        this.slots = [{id: '-1', text: '全部广告位'}];
        this.ruleForm.sourceId = '-1';
        this.sources = [{id: '-1', text: '全部广告源'}];
      }, () => {this.loadings = false;});
    },
    loadslots () {
      this.loadings = true;
      let params = {};
      params.devId = this.ruleForm.devId;
      params.appId = this.ruleForm.appId;
      this.$http.get('/v1/adm/names/apps/{appId}/adslots', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.slots = [{id: '-1', text: '全部广告位'}].concat(result);
        this.ruleForm.slotId = '-1';
        this.ruleForm.sourceId = '-1';
        this.sources = [{id: '-1', text: '全部广告源'}];
      }, () => {this.loadings = false;});
    },
    loadsources () {
      this.loadings = true;
      let params = {};
      params.devId = this.ruleForm.devId;
      params.appId = this.ruleForm.appId;
      params.adslotId = this.ruleForm.slotId;
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
        this.sources = [{id: '-1', text: '全部广告源'}].concat(result);
        this.ruleForm.sourceId = '-1';
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
      params.devId = this.ruleForm.devId;
      params.appId = this.ruleForm.appId;
      params.adslotId = this.ruleForm.slotId;
      params.channelCode = this.ruleForm.sourceId;
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
      params.devId = this.ruleForm.devId;
      params.appId = this.ruleForm.appId;
      params.adslotId = this.ruleForm.slotId;
      params.channelCode = this.ruleForm.sourceId;
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
        width: 280px
        margin-bottom: 20px
        .el-input
          display: block
          width: 100% 
      .el-form-item
        width: 280px  
        .el-select
          display: block
        &:last-child
          margin-bottom: 0  
    .data-total-wrapper
      margin-bottom: 15px       
    .data-table-wrapper
      margin-bottom: 20px     
</style>
