<template>
  <div class="slot-hit-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="data-title-wrapper">
      <div class="dowm-forward">
        <span class="list-title">操作：</span>
        <el-radio-group v-model="oprations" class="radio-wrapper">
          <el-radio class="radio" label="SUB">命中</el-radio>
          <el-radio class="radio" label="ADD">激励</el-radio>
        </el-radio-group>
      </div>
      <div class="dowm-forward">
        <span class="list-title">数据数量：</span>
        <el-radio-group v-model="datatype" class="radio-wrapper">
          <el-radio class="radio" label="0">单条数据</el-radio>
          <el-radio class="radio" label="1">批量数据</el-radio>
        </el-radio-group>
      </div>
      <div v-if="datatype === '0'">
        <el-form :model="ruleForm" :rules="rules" :label-position="labelPosition" ref="ruleForm">
          <el-form-item label="广告源名称：" prop="sourceId">
            <el-select v-model="ruleForm.sourceId" filterable placeholder="请选择" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
              <el-option
                v-for="item in sources"
                :key="item.channelCode"
                :label="item.channelName"
                :value="item.channelCode">
              </el-option>
            </el-select>
          </el-form-item>
          <div class="dowm-forward">
            <span class="list-title">日期：</span>
            <datepicker :datepickers="datepickers" :picker-options="pickerOptions"></datepicker>
          </div>
          <el-form-item label="金额：" prop="prices">
            <el-input v-model="ruleForm.prices" placeholder="请输入内容"></el-input>
          </el-form-item>  
          <el-form-item>
            <el-button type="primary" @click="creates('ruleForm')">新建</el-button>
            <el-button type="default" @click="back">取消</el-button>
          </el-form-item>
        </el-form>    
      </div>
      <div class="dowm-forward" v-else>
        <span class="list-title">上传凭证：</span>
        <dragupload :otherdatas="this.oprations === 'SUB' ? updatas1 : updatas2" :go-paths="goPath" :paths="paths" :urls="urls" :file-lists="fileList" :modeldatas="this.oprations === 'SUB' ? modeldatas1 : modeldatas2"></dragupload>
      </div>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import apiUtil from '../../../../util/api.js';
import dragupload from '../../../../components/upload/dragupload.vue';
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
      oprations: 'SUB',
      datatype: '0',
      sources: [],
      rules: {
        sourceId: [
          { required: true, message: '请选择广告源', trigger: 'change' }
        ],
        prices: [
          { required: true, validator: checks, trigger: 'blur' }
        ]
      },
      ruleForm: {
        prices: '',
        sourceId: ''
      },
      labelPosition: 'top',
      breadContent: [{ text: '广告源财务信息', path: '/adm/finance/slote'}, { text: '命中/激励'}],
      datepickers: {value: new Date(), align: 'right', type: 'month'},
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > new Date().getTime();
        },
        onPick (data) {
        }
      },
      goPath: true,
      paths: '/adm/finance/slote',
      urls: apiUtil.url('/v1/adm/source/finance/sourceMaterials'),
      fileList: [],
      updatas1: {
        type: 'SUB'
      },
      updatas2: {
        type: 'ADD'
      },
      modeldatas1: 'http://adroi.bj.bcebos.com/cdn/res/resource/temp/%E5%91%BD%E4%B8%AD.zip',
      modeldatas2: 'http://adroi.bj.bcebos.com/cdn/res/resource/temp/%E6%BF%80%E5%8A%B1.zip',
      loadings: false
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.allsources();
    });
  },
  components: { dragupload, breadcrumb, datepicker },
  methods: {
    allsources () {
      this.loadings = true;
      this.$http.get("/v1/dict/types/adSource").then((res) => {
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
      params.monthDate = this.datepickers.value.getTime();
      params.channelCode = this.ruleForm.sourceId;
      params.money = this.ruleForm.prices;
      params.type= this.oprations;
      this.loadings = true;
      this.$http.post('/v1/adm/source/finance/one', params).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        this.back();
      }, () => {this.loadings = false;});
    },
    back () {
      this.$router.push({
        path: '/adm/finance/slote'
      });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .slot-hit-wrapper
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
        .el-input
          display: block  
          width: 100%
        &:last-child
          margin-bottom: 0  
      .dowm-forward
        margin-bottom: 20px
        width: 280px
        .el-date-editor.el-input
          width: 100% 
        .el-select
          display: block
        .el-input
          display: block  
          width: 100% 
        .radio-wrapper
          margin: 5px 0
          display: block
          .radio
            color: #565656
            width: 80px
          .radio:first-child
            margin-right: 30px 
        &:last-child
          margin-bottom: 0       
</style>
