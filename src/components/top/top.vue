<template>
  <el-row>
	  <el-col :span="12">
	    <div class="grid-content bg-purple-dark">
		    <a href="javascript:;" class="logo">ADroi广告平台</a>
	    </div>
	  </el-col>
    <el-col :span="12">
      <div class="grid-content bg-purple-dark">
        <ul class="menu-wrapper clearfix">
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
            <el-dropdown>
              <span class="el-dropdown-link">
                {{userName}}<i class="el-icon-caret-bottom el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>建设中...</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
        </ul>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      userName: '游客'
    };
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
