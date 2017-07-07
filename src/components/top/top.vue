<template>
  <el-row>
	  <el-col :span="12">
	    <div class="grid-content bg-purple-dark">
		    <a href="javascript:;" class="logo">ADroi广告平台</a>
	    </div>
	  </el-col>
    <el-col :span="12">
      <div class="grid-content bg-purple-dark">
        <ul class="menu-wrapper clearfix" v-if="userName!=''">
          <li class="sub-menu pull-left">
            <el-dropdown>
              <span class="el-dropdown-link">
                通知<i class="el-icon-caret-bottom el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>建设中...</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
          <li class="sub-menu pull-left">
            <el-dropdown>
              <span class="el-dropdown-link">
                问题反馈<i class="el-icon-caret-bottom el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>建设中...</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
          <li class="sub-menu pull-left">
            <el-dropdown @command="handleCommand" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
              <span class="el-dropdown-link">
                {{userName}}<i class="el-icon-caret-bottom el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>退出...</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
        </ul>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import config from '../../config.js';
import sessionUtil from '../../util/session.js';
export default {
  name: 'hello',
  data () {
    return {
      userName: '',
      loadings: false
    };
  },
  mounted () {
    this.$nextTick(() => {
      let user = sessionUtil.getUser();
      user ? this.userName = user.name : false;
    });
  },
  methods: {
    handleCommand () {
      this.loadings = true;
      this.$http.post('/v1/logout/adm').then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret !== 1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        sessionUtil.clear();
        this.$router.replace({
          path: config.login
        });
      }, () => { this.loadings = false; });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .el-row
    margin-bottom: 0
    &:last-child
      margin-bottom: 0
  .el-col
    border-radius: 4px
  .bg-purple-dark
    background: #313a46
    .logo
      display: inline-block
      width: 62px
      height: 20px
      text-indent: -99999px
      background: url('./img/logo.png') no-repeat
      margin: 16px 0 0 13px
    .menu-wrapper
      float: right
      .sub-menu
        min-width: 120px
        height: 60px
        line-height: 60px
        text-align: center
        border-left: 1px solid rgba(255, 255, 255, 0.2)
        div 
          display: block
        span  
          display: block
          cursor: pointer
          color:#fff 
  .grid-content
    min-height: 60px
</style>
