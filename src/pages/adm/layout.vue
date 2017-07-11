<template>
  <div class="adroi-adm-content">
  	<l-top></l-top>
  	<div class="sub-adm-content clearfix">
      <div class="adm-menu pull-left">
        <l-menu></l-menu>
      </div>
      <div class="main-content-wrapper">
        <div class="main-view-area clearfix">
          <div class="sub-view-area">
            <router-view></router-view>
          </div>
        </div>
        <div class="adm-footer">
          <l-footer></l-footer>
        </div>
      </div>
  	</div>
  </div>
</template>

<script type="esmascript-6">
import top from '../../components/top/top.vue';
import footer from '../../components/footer/footer.vue';
import menu from '../../components/menu/menu.vue';
export default {
  components: {
    'l-top': top,
    'l-footer': footer,
    'l-menu': menu
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .adroi-adm-content
    height: 100%
    .sub-adm-content
      width: 100%
      height: 100%
      overflow: hidden
      .adm-menu
        width: 180px
        height: 100%
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)
        overflow-y: auto
        &::-webkit-scrollbar
          width: 0px  
          height: 0px 
          background-color: #eee
        /*定义滚动条轨道 内阴影+圆角*/  
        &::-webkit-scrollbar-track    
          border-radius: 10px;  
          background-color: #eee
        /*定义滑块 内阴影+圆角*/  
        &::-webkit-scrollbar-thumb
          border-radius: 10px
          background-color: #eee   
      .main-content-wrapper 
        margin-left: 180px  
        height: 100%
        background: #fafafa
        overflow: auto
        .main-view-area
          min-height: 100% 
          .sub-view-area
            padding: 25px 28px 150px
        .adm-footer
          position: relative
          margin-top: -150px
          height: 150px
          width: 100%
          line-height: 100px
          font-size: 14px
          clear: both
    .el-table__empty-block
      min-height: 350px      
</style>
