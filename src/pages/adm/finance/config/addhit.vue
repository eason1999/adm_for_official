<template>
  <div class="add-hit-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="data-title-wrapper">
      <div class="dowm-forward">
        <span class="list-title">操作：</span>
        <div class="radio-wrapper">
          <el-radio-group v-model="oprations" @change="loadcompanys">
            <el-radio class="radio" label="0">命中</el-radio>
            <el-radio class="radio" label="1">退款</el-radio>
          </el-radio-group>
        </div>
      </div> 
      <div class="dowm-forward">
        <span class="list-title">数据数量：</span>
        <div class="radio-wrapper">
          <el-radio-group v-model="datatype">
            <el-radio class="radio" label="1">单条数据</el-radio>
            <el-radio class="radio" label="2">批量数据</el-radio>
          </el-radio-group>
        </div>
      </div>
      <el-form :model="ruleForm" :rules="rules" :label-position="labelPosition" ref="ruleForm">
        <el-form-item label="公司名称：" prop="devId" v-if="datatype==='1'">
          <el-select @change="loadapps" v-model="ruleForm.devId" filterable placeholder="请选择" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
            <el-option
              v-for="item in devs"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item> 
        <el-form-item label="应用名称：" prop="appId" v-if="oprations==='0'&&datatype==='1'">
          <el-select @change="loadslots" v-model="ruleForm.appId" filterable placeholder="请选择">
            <el-option
              v-for="item in apps"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告位名称：" prop="slotId" v-if="oprations==='0'&&datatype==='1'">
          <el-select v-model="ruleForm.slotId" filterable placeholder="请选择">
            <el-option
              v-for="item in slots"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告源名称：" prop="sourceId" v-if="oprations==='0'&&datatype==='1'">
          <el-select v-model="ruleForm.sourceId" filterable placeholder="请选择">
            <el-option
              v-for="item in sources"
              :key="item.channelCode"
              :label="item.channelName"
              :value="item.channelCode">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="dowm-forward" v-if="datatype==='1'">
          <span class="list-title">日期：</span>
          <datepicker :datepickers="datepickers" :picker-options="pickerOptions"></datepicker>
        </div>
        <el-form-item label="金额：" prop="prices" v-if="datatype==='1'">
          <el-input v-model="ruleForm.prices" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item v-if="datatype==='1'">
          <el-button type="primary" @click="creates('ruleForm')">新建</el-button>
          <el-button type="default" @click="back">取消</el-button>
        </el-form-item>  
      </el-form>
      <div class="dowm-forward" v-if="datatype==='2'">
        <span class="list-title">上传凭证：</span>
        <upload :go-paths="goPath" :paths="paths" :urls="this.oprations==='0' ? urls1 : urls2" :file-lists="fileList" :modeldatas="modeldatas"></upload>
      </div>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import apiUtil from '../../../../util/api.js';
import upload from '../../../../components/upload/dragupload.vue';
import breadcrumb from '../../../../components/breadcrumb/breadcrumb.vue';
import datepicker from '../../../../components/datepicker/datepicker.vue';
export default {
  data () {
    var checks = (rule, value, callback) => {
      let req = /^(\d*\.)?\d+$/;
      if (!value) {
        return callback(new Error('金额不能为空'));
      }
      setTimeout(() => {
        if (!req.test(value)) {
          callback(new Error('请输入非负数'));
        } else {
          callback();
        }
      }, 1000);
    };
    return {
      ruleForm: {
        devId:'',
        appId: '',
        slotId: '',
        sourceId: '',
        prices: ''
      },
      rules: {
        prices: [
          { required: true, validator: checks, trigger: 'blur' }
        ],
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
      devs: [],
      apps: [],
      slots: [],
      sources: [],
      oprations: '0',
      datatype: '1',
      breadContent: [{ text: '命中/退款', path: '/adm/finance/hitback'}, { text: '新增数据'}],
      datepickers: {value: new Date(), align: 'left', type: 'date'},
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > new Date().getTime();
        },
        onPick (data) {
        }
      },
      goPath: true,
      paths: '/adm/finance/hitback',
      urls1: apiUtil.url('/v1/adm/dev/multfinance'),
      urls2: apiUtil.url('/v1/adm/adv/multfinance'),
      fileList: [],
      modeldatas: 'http://adroi.bj.bcebos.com/cdn/res/resource/temp/financeDataTemp.xls',
      loadings: false
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.loadcompanys();
      this.loadsources();
    });
  },
  components: { upload, breadcrumb, datepicker },
  methods: {
    loadcompanys () {
      let sources;
      if (this.oprations === '0') {
        sources = this.$resource('/v1/adm/names/devs');
      } else {
        sources = this.$resource('/v1/adm/names/advs');
      }
      this.loadings = true;
      sources.get().then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.devs = result;
        this.ruleForm.devId = '';
        this.apps = [];
        this.ruleForm.appId = '',
        this.slots = [];
        this.ruleForm.slotId = '';
      }, () => {this.loadings = false;});
    },
    loadapps () {
      if (this.oprations==='1') {
        return false;
      }
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
        this.apps = result;
        this.ruleForm.appId = '',
        this.slots = [];
        this.ruleForm.slotId = '';
      }, () => {this.loadings = false;});
    },
    loadslots () {
      this.loadings = true;
      let params = {};
      params.devId = this.ruleForm.devId;
      if (this.ruleForm.appId) {
        params.appId = this.ruleForm.appId;
      } else {
        params.appId = -1;
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
        this.ruleForm.slotId = '';
      }, () => {this.loadings = false;});
    },
    loadsources () {
      this.loadings = true;
      this.$http.get('/v1/dict/types/adSource').then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.sources = result;
        this.ruleForm.sourceId = '';
      }, () => {this.loadings = false;});
    },
    creates (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitcreate();
        } else {
          return this.$alert('请正确输入或选择相应选项！！！', '提示：', {
            confirmButtonText: '确定'
          });
        }
      });
    },
    submitcreate () {
      let params = {};
      params.amount = this.ruleForm.prices;
      params.fileUrl = '';
      params.optionDate = this.datepickers.value.getTime();
      this.loadings = true;
      if (this.oprations === '0') {
        params.devid = this.ruleForm.devId;
        params.optionType = 2;
        params.appId = this.ruleForm.appId;
        params.adSlotId = this.ruleForm.slotId;
        params.dspId = this.ruleForm.sourceId;
        this.$http.post('/v1/adm/dev/financeOptions', params).then((res) => {
          this.loadings = false;
          let data = res.body;
          if (data.ret!=1) {
            return this.$alert(data.message, '提示：', {
              confirmButtonText: '确定'
            });
          }
          this.$alert('创建成功！', '提示：', {
            confirmButtonText: '确定'
          }).then(() => {
            this.back();
          });
        }, () => {this.loadings = false;});
      } else {
        params.advId = this.ruleForm.devId;
        params.optiontype = 2;
        this.$http.post('/v1/adm/adv/financeOption', params).then((res) => {
          this.loadings = false;
          let data = res.body;
          if (data.ret!=1) {
            return this.$alert(data.message, '提示：', {
              confirmButtonText: '确定'
            });
          }
          this.$alert('创建成功！', '提示：', {
            confirmButtonText: '确定'
          }).then(() => {
            this.back();
          });
        }, () => {this.loadings = false;});
      }
    },
    back () {
      this.$router.push({
        path: '/adm/finance/hitback'
      });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .add-hit-wrapper
    .bread-title-wrapper
      margin-bottom: 15px
    .data-title-wrapper
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
        .el-date-editor.el-input
          width: 100% 
        .radio-wrapper
          margin: 5px 0
          .radio
            color: #565656
            width: 80px
          .radio:first-child
            margin-right: 30px    
</style>
