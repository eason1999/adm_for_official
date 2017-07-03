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
      <div class="shield-regional dowm-forward">
        <span class="list-title">屏蔽地域：</span>
        <transfer :cities="cities" :transfer-title="transferTitle"></transfer>
      </div>
      <el-button type="primary">新建</el-button>
      <el-button type="default">取消</el-button>
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
      input: '',
      cities: [{label: '上海', key: 10001, city: '上海'}, {label: '北京', key: 10002, city: '北京'}, {label: '广州', key: 10003, city: '广州'}, {label: '深圳', key: 10004, city: '深圳'}, {label: '南京', key: 10005, city: '南京'}, {label: '西安', key: 10006, city: '西安'}, {label: '成都', key: 10007, city: '成都'}],
      transferTitle: '省市'
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
        width: 300px 
        position: relative 
      .shield-regional
        width: 500px  
        .el-select
          display: block     
</style>
