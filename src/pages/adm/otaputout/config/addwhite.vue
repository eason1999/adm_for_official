<template>
  <div class="ota-white-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="data-title-wrapper">
      <div class="datepicker-wrapper dowm-forward">
        <span class="list-title">应用名称：</span>
        <selects></selects>
      </div>
      <div class="create-select dowm-forward">
        <span class="list-title">包名称：</span>
        <selects></selects>
      </div>
      <div class="plan-select dowm-forward">
        <span class="list-title">应用背景图：</span>
        <imgupload></imgupload>
      </div>
      <el-button type="primary">新建</el-button>
      <el-button type="primary">取消</el-button>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import selects from '../../../../components/selects/select.vue';
import breadcrumb from '../../../../components/breadcrumb/breadcrumb.vue';
import imgupload from '../../../../components/upload/imgupload.vue';
export default {
  data () {
    return {
      breadContent: [{ text: '应用白名单', path: '/adm/otaoutput/whitelist'}, { text: '新增白名单'}],
      input: '',
      textarea: ''
    };
  },
  mounted () {
    
  },
  components: { selects, breadcrumb, imgupload }
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
        width: 260px 
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
