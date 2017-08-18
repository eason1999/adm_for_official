<template>
  <div class="login-adm-content">
    <top></top>
    <div class="login-wrapper">
      <h3 class="login-logo">ADroi 登录</h3>
      <div class="login-body">
        <div class="login-title">管理员账号</div>
        <div class="login-content">
          <el-form :model="ruleForm" :rules="rules" :label-position="labelPosition" ref="ruleForm">
            <el-form-item label="用户名/邮箱/手机号：" prop="userName">
              <el-input v-model="ruleForm.userName" placeholder="请输入内容" @keyup.native.enter="signin('ruleForm')"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="passwords">
              <el-input type="password" v-model="ruleForm.passwords" placeholder="请输入内容" @keyup.native.enter="signin('ruleForm')"></el-input>
            </el-form-item>
            <el-form-item label="验证码：" prop="validateCode">
              <div class="code-wrapper">
                <el-input v-model="ruleForm.validateCode" placeholder="请输入内容" @keyup.native.enter="signin('ruleForm')"></el-input>
                <img :src="verificationCodeUrl" @click="changeCode"/>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="signin('ruleForm')" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">登录</el-button>
            </el-form-item>  
          </el-form>  
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
  	var checkname = (rule, value, callback) => {
      let req = /^[a-zA-Z][a-zA-Z0-9_@\.]+$/;
      if (!value) {
        return callback(new Error('用户名不能为空'));
      }
      setTimeout(() => {
        if (!req.test(value)) {
          callback(new Error('用户名请使用字母数字_，以字母开头'));
        } else if (value.length < 3) {
          callback(new Error('用户名长度不能小于3位'));
        } else if (value.length > 20) {
          callback(new Error('用户名长度不能大于20位'));
        } else {
          callback();
        }
      }, 1000);
    };
    var checkpsw = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('密码不能为空'));
      }
      setTimeout(() => {
        if (value.length < 6) {
          callback(new Error('密码长度不能小于6位'));
        } else if (value.length > 18) {
          callback(new Error('密码长度不能大于18位'));	
        } else {
          callback();
        }
      }, 1000);
    };
    return {
      ruleForm: {
        userName: '',
        validateCode: '',
        passwords: ''
      },
      rules: {
      	userName: [
          { required: true, validator: checkname, trigger: 'blur' }
        ],
        validateCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        passwords: [
          { required: true, validator: checkpsw, trigger: 'blur' }
        ]
      },
      labelPosition: 'top',
      verificationCodeUrl: 'about:blank',
      loadings: false
    }
  },
  mounted () {
    this.changeCode();
  },
  methods: {
  	signin (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.subsignin();
        } else {
          return this.$alert('请正确输入相应选项！！！', '提示：', {
            confirmButtonText: '确定'
          });
        }
      });
    }, 
    subsignin () {
      this.loadings = true;
      let params = {};
          params.userName = this.ruleForm.userName;
          params.userPass = this.ruleForm.passwords;
          params.verificationCode = this.ruleForm.validateCode;
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
        } else {
          this.$router.replace({path: path});
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
    &:before
      content: ''
      background: url('../../asset/img/bg.jpg') no-repeat center center
      background-size: cover
      position: fixed
      width: 100%
      height: 100%
      top: 0
      left: 0
      z-index: -1
      -webkit-filter: blur(5px)
      -moz-filter: blur(5px)
      -o-filter: blur(5px)
      -ms-filter: blur(5px)
      filter: blur(5px)
    &:after
      content: ''
      background: url('../../asset/img/bg.jpg') no-repeat center center
      background-size: cover
      position: fixed
      width: 100%
      height: 100%
      top: 0
      left: 0
      z-index: -2
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
        .el-form-item
          width: 100% 
          .code-wrapper 
            .el-input
              width: 47%
              vertical-align: top 
          &:last-child 
            margin-bottom: 0
        .el-button
          width: 100% 
        .el-input
          input
            height: 40px    
    .login-footer-wrapper
      position: relative
      margin-top: 0
      height: 100px
      width: 100%
      line-height: 100px
      font-size: 14px
      clear: both
      div 
        color: #fff
</style>

