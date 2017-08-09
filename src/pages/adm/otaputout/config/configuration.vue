<template>
  <div class="ota-configuration-wrapper"> 
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="data-title-wrapper">
      <div class="dowm-forward" v-if="id !== undefined">
        <span class="list-title">公司名称：</span>
        <el-input :disabled="true" v-model="companyName" placeholder="请输入内容"></el-input>
      </div>
      <div class="dowm-forward" v-if="id !== undefined">
        <span class="list-title">计划名称：</span>
        <el-input :disabled="true" v-model="planName" placeholder="请输入内容"></el-input>
      </div>
      <el-form :model="ruleForm" :rules="rules" :label-position="labelPosition" ref="ruleForm">
        <el-form-item label="公司名称：" prop="companyId" v-if="id === undefined">
          <el-select v-model="ruleForm.companyId" filterable placeholder="请选择" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中" @change="loadApp(ruleForm.companyId)">
            <el-option
              v-for="item in companys"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计划名称：" prop="planId" v-if="id === undefined">
          <el-select v-model="ruleForm.planId" filterable placeholder="请选择">
            <el-option
              v-for="item in plans"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="保护周期：" prop="protectSys">
          <el-input v-model="ruleForm.protectSys" placeholder="请输入内容" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中"></el-input> <span class="unit">天</span>
        </el-form-item>
        <el-form-item label="开屏间隔：" prop="interval">
          <el-input v-model="ruleForm.interval" placeholder="请输入内容"></el-input> <span class="unit">分钟</span>
        </el-form-item>
        <el-form-item label="信息流间隔：" prop="flowInterval">
          <el-input v-model="ruleForm.flowInterval" placeholder="请输入内容"></el-input> <span class="unit">分钟</span>
        </el-form-item>
        <el-form-item label="解锁次数：" prop="unlockNum">
          <el-input v-model="ruleForm.unlockNum" placeholder="请输入内容"></el-input> <span class="unit">次</span>
        </el-form-item>
        <el-form-item label="广告曝光次数：" prop="adExposure">
          <el-input v-model="ruleForm.adExposure" placeholder="请输入内容"></el-input> <span class="unit">次</span>
        </el-form-item>
        <el-form-item label="说明：" prop="instructions">
          <el-input type="textarea" :rows="4" resize="none" placeholder="请输入内容" v-model="ruleForm.instructions"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="config('ruleForm')">新建</el-button>
          <el-button type="default" @click="back">取消</el-button>
        </el-form-item>  
      </el-form>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import breadcrumb from '../../../../components/breadcrumb/breadcrumb.vue';
export default {
  data () {
    var checks = (rule, value, callback) => {
      let req = /^[0-9]*$/;
      if (!value) {
        return callback(new Error('输入不能为空'));
      }
      setTimeout(() => {
        if (!req.test(value)) {
          callback(new Error('请输入非负整数'));
        } else {
          callback();
        }
      }, 1000);
    };
    return {
      id: this.$route.query.resultId,
      breadContent: [{ text: 'OTA客户配置', path: '/adm/otaoutput/otaclient'}, { text: 'OTA配置'}],
      companys: [],
      plans: [],
      ruleForm: {
        unlockNum: '',
        adExposure: '',
        instructions: '',
        protectSys: '',
        interval: '',
        flowInterval: '',
        companyId: '',
        planId: ''
      },
      rules: {
        protectSys: [
          { required: true, message: '请输入保护周期', trigger: 'blur' },
          { validator: checks, trigger: 'blur' }
        ],
        companyId: [
          { required: true, message: '请选择公司', trigger: 'change' }
        ],
        planId: [
          { required: true, message: '请选择计划', trigger: 'change' }
        ],
        interval: [
          { required: true, message: '请输入开屏间隔', trigger: 'blur' },
          { validator: checks, trigger: 'blur' }
        ],
        flowInterval: [
          { required: true, message: '请输入信息流间隔', trigger: 'blur' },
          { validator: checks, trigger: 'blur' }
        ],
        unlockNum: [
          { required: true, message: '请输入解锁次数', trigger: 'blur' },
          { validator: checks, trigger: 'blur' }
        ],
        adExposure: [
          { required: true, message: '请输入曝光次数', trigger: 'blur' },
          { validator: checks, trigger: 'blur' }
        ],
        instructions: [
          { required: true, message: '请填写相关说明', trigger: 'blur' }
        ]
      },
      loadings: false,
      companyName: '',
      planName: '',
      labelPosition: 'top'
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.loadCompany();
      if (!this.id) {
        return false;
      }
      this.configOta();
    });
  },
  components: { breadcrumb },
  methods: {
    configOta () {
      this.loadings = true;
      let params = {};
      params.id = this.id;
      this.$http.get('/v1/ota/ctaConfiger',{params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.ruleForm.unlockNum = result.deblock;
        this.ruleForm.adExposure = result.adImpl;
        this.ruleForm.protectSys = result.protectCycle;
        this.ruleForm.flowInterval = result.nativeInterval;
        this.ruleForm.interval = result.splashInterval;
        this.ruleForm.instructions = result.desciption;
        this.ruleForm.companyId = result.accountId;
        this.ruleForm.planId = result.appId;
        this.companyName = result.companyName;
        this.planName = result.appName;
      }, () => {this.loadings = false;});
    },
    loadCompany () {
      this.loadings = true;
      this.$http.get('/v1/ota/getAccountlist').then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        this.companys = data.result;
      }, () => {
        this.loadings = false;
      });
    },
    loadApp (values) {
      this.loadings = true;
      let params = {};
      params.accountId = values;
      this.$http.get('/v1/ota/{accountId}/otaconfigapps', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        this.plans = data.result;
      }, () => {
        this.loadings = false;
      });
    },
    config (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.creates();
        } else {
          return this.$alert('请正确选择或输入相应选项！！！', '提示：', {
            confirmButtonText: '确定'
          });
        }
      });
    },
    creates () {
      this.loadings = true;
      let params = {};
      if (this.id) {
        params.id = this.id;
      }else{
        params.id = -1;
      }
      params.deblock = this.ruleForm.unlockNum;
      params.impl = this.ruleForm.adExposure;
      params.protectCycle = this.ruleForm.protectSys;
      params.nativeInterval = this.ruleForm.flowInterval;
      params.splashInterval = this.ruleForm.interval;
      params.description = this.ruleForm.instructions;
      params.accountId = this.ruleForm.companyId;
      params.appId = this.ruleForm.planId;
      this.$http.post('/v1/ota/otaconfig', params).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        this.$router.push({
          path:'/adm/otaoutput/otaclient'
        });
      }, () => {
        this.loadings = false;
      });
    },
    back () {
      this.$router.push({
        path:'/adm/otaoutput/otaclient'
      });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .ota-configuration-wrapper
    .bread-title-wrapper
      margin-bottom: 15px
    .data-title-wrapper
      margin-bottom: 15px
      padding: 20px
      background: #fff
      border: 1px solid #eee
      .el-form-item
        width: 280px 
        position: relative 
        .el-select
          display: block
        .unit
          position: absolute
          width: 28px
          top: 0
          right: -35px
          color: #475669
          font-size: 14px   
        &:last-child
          margin-bottom: 0     
      .dowm-forward
         width: 280px
         margin-bottom: 20px    
</style>
