<template>
  <div class="add-user-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="data-title-wrapper">
      <div class="datepicker-wrapper dowm-forward">
        <span class="list-title">黑名单：</span>
        <selects></selects>
      </div>
      <div class="plan-select dowm-forward">
        <span class="list-title">IMEI/IDFA：</span>
        <el-input v-model="input" placeholder="请输入内容"></el-input>
      </div>
      <el-button type="primary">新建</el-button>
      <el-button type="primary">取消</el-button>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import selects from '../../../../components/selects/select.vue';
import breadcrumb from '../../../../components/breadcrumb/breadcrumb.vue';
export default {
  data () {
    return {
      breadContent: [{ text: '用户黑名单', path: '/adm/shield/user'}, { text: '新增黑名单'}],
      input: ''
    };
  },
  mounted () {
    
  },
  components: { selects, breadcrumb }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .add-user-wrapper
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
</style>
