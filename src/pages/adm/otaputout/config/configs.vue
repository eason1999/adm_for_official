<template>
  <div class="ota-configs-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="data-title-wrapper">
      <div class="dowm-forward">
        <span class="list-title">公司名称：</span>
        <el-input :disabled="true" v-model="companyName" placeholder="请输入内容" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">应用名称：</span>
        <el-input :disabled="true" v-model="appName" placeholder="请输入内容"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">白名单应用：</span>
        <div class="radio-wrapper">
          <el-radio class="radio" v-model="radio" label="1">无应用</el-radio>
          <el-radio class="radio" v-model="radio" label="2">指定应用</el-radio>
        </div>
      </div>
      <div class="tranfer-wrapper" v-if="radio==='2'">
        <el-transfer
          filterable
          :titles="['应用列表','已选应用']"
          filter-placeholder="请输入搜索项"
          v-model="appValues"
          :data="appData">
        </el-transfer>
      </div>
      <el-button type="primary" @click="configs">新建</el-button>
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
      companyName: this.$route.query.companyName,
      appName: this.$route.query.appName,
      breadContent: [{ text: 'OTA客户配置', path: '/adm/otaoutput/otaclient'}, { text: '配置'}],
      loadings: false,
      radio: '1',
      appData: [],
      appValues: []
    };
  },
  mounted () {
    this.$nextTick(() => {
        this.applist();
    });
  },
  components: { breadcrumb },
  methods: {
    configs () {
      this.loadings = true;
      let params = {};
      if(this.radio=='2'){
        params.whiteAppIds = this.appValues.join(',');
      }else{
        params.whiteAppIds = ' ';
      }
      params.configid = this.id;
      params.companyName = this.companyName;
      params.appName = this.appName;
      this.$http.post('/v1/adm/ota/whiteappconfig', params).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return $alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        this.$router.push({
          path: '/adm/otaoutput/otaclient'
        });
      }, () => {this.loadings = false;});
    },
    applist () {
      this.loadings = true;
      this.$http.get('/v1/adm/ota/whiteapplist').then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return $alert('获取应用列表失败！', '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        for (let i=0;i<result.length;i++) {
          result[i].label = result[i].text;
          result[i].key = result[i].id;
        }
        this.appData = result;
        this.getapps();
      }, () => {this.loadings = false;});
    },
    getapps () {
      this.loadings = true;
      let params = {};
      params.configId = this.id;
      this.$http.get('/v1/adm/ota/otaconfigedapp', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return $alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        if(result === ''){
          this.radio = '1';
        } else {
          this.radio = '2';
          this.appValues = result.split(',');
        }  
      }, () => {this.loadings = false;});
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
  .ota-configs-wrapper
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
        .radio-wrapper
          margin: 5px 0
          .radio
            color: #565656
            width: 80px
          .radio:first-child
            margin-right: 30px 
      .tranfer-wrapper
        width: 460px
        margin-bottom: 10px      
</style>
