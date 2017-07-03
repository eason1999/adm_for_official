<template>
  <div class="ota-configuration-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="data-title-wrapper">
      <div class="datepicker-wrapper dowm-forward">
        <span class="list-title">公司名称：</span>
        <el-input v-if="this.id" :disabled="true" v-model="companyName" placeholder="请输入内容"></el-input>
        <el-select v-else v-model="companyId" filterable placeholder="请选择" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中" @change="loadApp(companyId)">
          <el-option
            v-for="item in companys"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="create-select dowm-forward">
        <span class="list-title">计划名称：</span>
        <el-input v-if="this.id" :disabled="true" v-model="planName" placeholder="请输入内容"></el-input>
        <el-select v-else v-model="planId" filterable placeholder="请选择">
          <el-option
            v-for="item in plans"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="plan-select dowm-forward">
        <span class="list-title">保护周期：</span>
        <el-input v-model="protectSys" placeholder="请输入内容" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中"></el-input> <span class="unit">天</span>
      </div>
      <div class="plan-select dowm-forward">
        <span class="list-title">开屏间隔：</span>
        <el-input v-model="interval" placeholder="请输入内容"></el-input> <span class="unit">分钟</span>
      </div>
      <div class="plan-select dowm-forward">
        <span class="list-title">信息流间隔：</span>
        <el-input v-model="flowInterval" placeholder="请输入内容"></el-input> <span class="unit">分钟</span>
      </div>
      <div class="plan-select dowm-forward">
        <span class="list-title">解锁次数：</span>
        <el-input v-model="unlockNum" placeholder="请输入内容"></el-input> <span class="unit">次</span>
      </div>
      <div class="plan-select dowm-forward">
        <span class="list-title">广告曝光次数：</span>
        <el-input v-model="adExposure" placeholder="请输入内容"></el-input> <span class="unit">次</span>
      </div>
      <div class="plan-select dowm-forward">
        <span class="list-title">说明：</span>
        <el-input type="textarea" :rows="4" resize="none" placeholder="请输入内容" v-model="instructions"></el-input>
      </div>
      <el-button type="primary" @click="config">新建</el-button>
      <el-button type="default" @click="back">取消</el-button>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import breadcrumb from '../../../../components/breadcrumb/breadcrumb.vue';
export default {
  data () {
    return {
      id: this.$route.query.resultId,
      breadContent: [{ text: 'OTA客户配置', path: '/adm/otaoutput/otaclient'}, { text: 'OTA配置'}],
      companys: [],
      plans: [],
      unlockNum: '',
      adExposure: '',
      instructions: '',
      protectSys: '',
      interval: '',
      flowInterval: '',
      loadings: false,
      companyId: '',
      planId: '',
      companyName: '',
      planName: ''
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
          return $alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.unlockNum = result.deblock;
        this.adExposure = result.adImpl;
        this.protectSys = result.protectCycle;
        this.flowInterval = result.nativeInterval;
        this.interval = result.splashInterval;
        this.instructions = result.desciption;
        this.companyId = result.accountId;
        this.planId = result.appId;
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
          this.$alert(data.message, '提示：', {
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
          this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        this.plans = data.result;
      }, () => {
        this.loadings = false;
      });
    },
    config () {
      this.loadings = true;
      let params = {};
      if (this.id) {
        params.id = this.id;
      }else{
        params.id = -1;
      }
      params.deblock = this.unlockNum;
      params.impl = this.adExposure;
      params.protectCycle = this.protectSys;
      params.nativeInterval = this.flowInterval;
      params.splashInterval = this.interval;
      params.description = this.instructions;
      params.accountId = this.companyId;
      params.appId = this.planId;
      this.$http.post('/v1/ota/otaconfig', params).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          this.$alert(data.message, '提示：', {
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
      .dowm-forward
        margin-bottom: 10px
        width: 300px 
        position: relative 
        .el-select
          display: block
        .unit
          position: absolute
          width: 28px
          top: 30px
          right: -35px
          color: #475669
          font-size: 14px      
</style>
