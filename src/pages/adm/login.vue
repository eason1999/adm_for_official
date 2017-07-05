<template>
  <div class="login-adm-content">
    <top></top>
    <div class="login-wrapper">
      <h3 class="login-logo">ADroi 登录</h3>
      <div class="login-body">
        <div class="login-title">管理员账号</div>
        <div class="login-content">
          <div class="dowm-forward">
            <label for="userName" class="list-title">用户名/邮箱/手机号：</label>
            <el-input v-model="userName" placeholder="请输入内容" id="userName"></el-input>
          </div>
          <div class="dowm-forward">
            <label for="passwords" class="list-title">密码：</label>
            <el-input type="password" v-model="passwords" placeholder="请输入内容" id="passwords"></el-input>
          </div>
          <div class="dowm-forward">
            <label for="validateCode" class="list-title">验证码：</label>
            <div class="code-wrapper">
              <el-input v-model="validateCode" placeholder="请输入内容" id="validateCode"></el-input>
              <img :src="verificationCodeUrl" @click="changeCode"/>
            </div>
          </div>
          <el-button type="primary" @click="signin" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">登录</el-button>
        </div>
      </div>
    </div>
    <div class="login-footer-wrapper">
      <footers></footers>
    </div>
  </div>
</template>

<script type="esmascript-6">
import top from '../../components/top/top.vue';
import footers from '../../components/footer/footer.vue';
import sessionUtil from '../../util/session.js';
import apiUtil from '../../util/api.js';
import config from '../../config.js';
export default {
  components: { top, footers },
  data () {
    return {
      userName: '',
      validateCode: '',
      passwords: '',
      verificationCodeUrl: 'about:blank',
      loadings: false
    }
  },
  mounted () {
    this.changeCode();
  },
  methods: {
    signin () {
      this.loadings = true;
      let params = {};
          params.userName = this.userName;
          params.userPass = this.passwords;
          params.verificationCode = this.validateCode;
      this.$http.post('/v1/login/adm', params).then((res) => {
        this.loadings = false;
        let data = res.body;
        if(data.ret!=1){
          this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        sessionUtil.setUser(result.user);
        let index = config.index;
        let path = this.$route.query.redirectPath;
            path = path || sessionUtil.getLastPath();
            path = path || index;
        if (path === config.login) {
          this.$router.replace({path: '/adm/adv/campaign'});
        }    
      },() => {
        this.loadings = false;
      });
    },
    changeCode () {
      let url = apiUtil.url("/v1/adm/verificationcode?");
      url += 't=' + (+(new Date()));
      let token = sessionUtil.getToken();
      token ? url += "&token=" + token : false;
      this.verificationCodeUrl = url;
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .login-adm-content
    height: 100%
    width: 100%
    background: #eee
    background-size: cover
    .login-wrapper
        width: 430px
        margin: 80px auto 0
      .login-logo
        color: #0098ce
        font-size: 24px
        padding: 20px 0
        text-align: center
      .login-body
        padding: 20px
        background: #fff
        border-radius: 4px
        position: relative
      .login-title
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 46px
        line-height: 46px
        border-radius: 4px 4px 0 0
        background: #F8F8F8
        text-align: center
        color: #555
      .login-content  
        width: 100% 
        margin-top: 36px
        .dowm-forward
          margin-bottom: 20px
          width: 100% 
          .code-wrapper 
            .el-input
              width: 47%
              vertical-align: top
        .el-button
          width: 100% 
        .el-input
          input
            height: 40px    
    .login-footer-wrapper
      position: fixed
      bottom: 20px
      left: 50%
      transform: translateX(-50%)      
</style>

