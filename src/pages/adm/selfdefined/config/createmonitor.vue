<template>
  <div class="selfdefined-create-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="data-title-wrapper">
      <div class="datepicker-wrapper dowm-forward">
        <span class="list-title">公司名称：</span>
        <selects></selects>
      </div>
      <div class="create-select dowm-forward">
        <span class="list-title">计划名称：</span>
        <selects></selects>
      </div>
      <div class="plan-select dowm-forward">
        <span class="list-title">创意名称：</span>
        <selects></selects>
      </div>
      <el-button type="primary">生成报告</el-button>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import selects from '../../../../components/selects/select.vue';
import breadcrumb from '../../../../components/breadcrumb/breadcrumb.vue';
export default {
  data () {
    return {
      breadContent: [{ text: '监测代码', path: '/adm/selfdefined/monitor'}, { text: '新建监测'}]
    };
  },
  mounted () {
    
  },
  components: { selects, breadcrumb }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .selfdefined-create-wrapper
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
        .el-select
          display: block    
</style>
