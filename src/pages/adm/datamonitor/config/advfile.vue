<template>
  <div class="monitor-advfile-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="advfile-title-wrapper">
      <div class="dowm-forward">
        <span class="list-title">时间范围：</span>
        <datepicker :datepickers="datepickers" :picker-options="pickerOptions"></datepicker>
      </div>
      <el-form :model="ruleForm" :rules="rules" :label-position="labelPosition" ref="ruleForm">
        <el-form-item label="计划名称：" prop="planId">
          <el-select v-model="ruleForm.planId" filterable placeholder="请选择" @change="loadcreates" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
            <el-option
              v-for="item in plans"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创意名称：" prop="createId">
          <el-select v-model="ruleForm.createId" filterable placeholder="请选择" @change="loadmedias">
            <el-option
              v-for="item in creates"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="定向媒体：" prop="mediaId">
          <el-select v-model="ruleForm.mediaId" filterable placeholder="请选择">
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
    <div class="data-table-wrapper">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="date" label="日期" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="campaignNameId" label="计划名称&ID" show-overflow-tooltip></el-table-column>
        <el-table-column prop="creativeNameId" label="创意名称&ID" show-overflow-tooltip></el-table-column>
        <el-table-column prop="mediaNameId" label="定向媒体&ID" show-overflow-tooltip></el-table-column>
        <el-table-column prop="impressionsB4Filter" label="过滤前展现数" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="impressions" label="过滤后展现数" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="clicksB4Filter" label="过滤前点击数" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="clicks" label="过滤后点击数" sortable show-overflow-tooltip></el-table-column>
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
export default {
  data () {
    return {
      plans: [{id: '-1', text: '全部计划'}],
      creates: [{id: '-1', text: '全部创意'}],
      medias: [{id: '-1', text: '全部媒体'}],
      ruleForm: {
        planId: '',
        createId: '',
        mediaId: ''
      },
      rules: {
        planId: [
          { required: true, message: '请选择计划', trigger: 'change' }
        ],
        createId: [
          { required: true, message: '请选择创意', trigger: 'change' }
        ],
        mediaId: [
          { required: true, message: '请选择媒体', trigger: 'change' }
        ]
      },
      labelPosition: 'top',
      tableData: [],
      totalRecords: -1,
      pageNum: 1,
      pageSize: 20,
      breadContent: [{ text: 'ADV实时数据', path: '/adm/datamonitor/advdata'}, { text: '过滤查询'}],
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
      this.loadplans();
    });
  },
  components: { datepicker, pager, breadcrumb },
  methods: {
    loadplans () {
      this.loadings = true;
      this.$http.get('/v1/adm/names/allCampaigns').then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        for(let i = 0, a = result.length; i < a; i++){
          result[i].text = result[i].text+'('+result[i].id+')';
        }
        this.plans = result;
      }, () => {this.loadings = false;});
    },
    loadcreates () {
      let params = {};
      params.campaignId = this.ruleForm.planId;
      this.loadings = true;
      this.$http.get('/v1/adm/names/campaigns/{campaignId}/creatives', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        for(let i = 0, a = result.length; i < a; i++){
          result[i].text = result[i].text+'('+result[i].id+')';
        }
        this.creates = [{id: '-1', text: '全部创意'}].concat(result);
        this.ruleForm.createId = '-1';
        this.medias = [{id: '-1', text: '全部媒体'}];
        this.ruleForm.mediaId = '-1';
      }, () => {this.loadings = false;});
    },
    loadmedias () {
      let params = {};
      params.creativeId = this.ruleForm.createId;
      params.campaignId = this.ruleForm.planId;
      params.startDate = this.datepickers.value[0].getTime();
      params.endDate = this.datepickers.value[1].getTime();
      this.loadings = true;
      this.$http.get('/v1/adm/monitor/advs/hourData/getMedia', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        for(let i = 0, a = result.length; i < a; i++){
          result[i].text = result[i].text+'('+result[i].id+')';
        }
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
      params.campaignId = this.ruleForm.planId;
      params.creativeId = this.ruleForm.createId;
      params.mediaId = this.ruleForm.mediaId;
      params.pageNum = pageNum || this.pageNum;
      params.pageSize = pageSize || this.pageSize;
      params.startDate = this.datepickers.value[0].getTime();
      params.endDate = this.datepickers.value[1].getTime();
      this.loadings = true;
      this.$http.get('/v1/adm/monitor/advs/filterData/{pageNum}/{pageSize}', {params: params}).then((res) => {
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
  .monitor-advfile-wrapper
    .bread-title-wrapper
      margin-bottom: 15px
    .advfile-title-wrapper
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
    .data-table-wrapper
      margin-bottom: 20px     
</style>
