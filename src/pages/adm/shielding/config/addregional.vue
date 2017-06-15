<template>
  <div class="add-regional-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="data-title-wrapper">
      <div class="datepicker-wrapper dowm-forward">
        <span class="list-title">公司名称：</span>
        <selects></selects>
      </div>
      <div class="plan-select dowm-forward">
        <span class="list-title">应用名称：</span>
        <selects></selects>
      </div>
      <div class="plan-select dowm-forward">
        <span class="list-title">屏蔽地域：</span>
        <transfer></transfer>
      </div>
      <el-button type="primary">新建</el-button>
      <el-button type="text">取消</el-button>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import selects from '../../../../components/selects/select.vue';
import breadcrumb from '../../../../components/breadcrumb/breadcrumb.vue';
import transfer from '../../../../components/transfer/transfer.vue';
export default {
  data () {
    return {
      breadContent: [{ text: '地域屏蔽', path: '/adm/shield/regional'}, { text: '地域黑名单'}],
      input: ''
    };
  },
  mounted () {
    
  },
  components: { selects, breadcrumb, transfer }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .add-regional-wrapper
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
        &:last-child
          width: 500px  
        .el-select
          display: block     
</style>
