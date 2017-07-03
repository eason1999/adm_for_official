<template>
  <div class="ota-white-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="data-title-wrapper">
      <div class="datepicker-wrapper dowm-forward">
        <span class="list-title">应用名称：</span>
        <el-input v-model="appName" placeholder="请输入内容"></el-input>
      </div>
      <div class="create-select dowm-forward">
        <span class="list-title">包名称：</span>
        <el-input v-model="packageName" placeholder="请输入内容"></el-input>
      </div>
      <div class="plan-select dowm-forward">
        <span class="list-title">应用背景图：</span>
        <imgupload :urls="urls"></imgupload>
      </div>
      <el-button type="primary">新建</el-button>
      <el-button type="primary">取消</el-button>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import breadcrumb from '../../../../components/breadcrumb/breadcrumb.vue';
import imgupload from '../../../../components/upload/imgupload.vue';
import apiUtil from '../../../../util/api.js';
export default {
  data () {
    return {
      breadContent: [{ text: '应用白名单', path: '/adm/otaoutput/whitelist'}, { text: '新增白名单'}],
      packageName: '',
      appName: '',
      urls: apiUtil.url('/v1/adm/ota/whiteapp/material')
    };
  },
  mounted () {
    
  },
  components: { breadcrumb, imgupload }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .ota-white-wrapper
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
