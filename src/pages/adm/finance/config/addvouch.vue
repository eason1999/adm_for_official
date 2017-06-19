<template>
  <div class="add-vouch-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="data-title-wrapper">
      <div class="dowm-forward">
        <span class="list-title">操作：</span>
        <div class="radio-wrapper">
          <el-radio class="radio" v-model="radio" label="1">提现</el-radio>
          <el-radio class="radio" v-model="radio" label="2">充值</el-radio>
        </div>
      </div>
      <div class="dowm-forward">
        <span class="list-title">公司名称：</span>
        <selects></selects>
      </div>
      <div class="dowm-forward">
        <span class="list-title">金额：</span>
        <el-input v-model="input" placeholder="请输入内容"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">上传凭证：</span>
        <upload></upload>
      </div>
      <el-button type="primary">新建</el-button>
      <el-button type="primary">取消</el-button>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import selects from '../../../../components/selects/select.vue';
import upload from '../../../../components/upload/imgupload.vue';
import breadcrumb from '../../../../components/breadcrumb/breadcrumb.vue';
export default {
  data () {
    return {
      input: '',
      radio: '1',
      breadContent: [{ text: '提现/充值', path: '/adm/finance/vouchor'}, { text: '新增数据'}],
    };
  },
  mounted () {
    
  },
  components: { selects, upload, breadcrumb }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .add-vouch-wrapper
    .bread-title-wrapper
      margin-bottom: 15px
    .data-title-wrapper
      padding: 20px
      background: #fff
      border: 1px solid #eee
      .dowm-forward
        margin-bottom: 10px
        width: 280px 
        .el-select
            display: block 
        .radio-wrapper
          margin: 5px 0
          .radio
            color: #565656
            width: 80px
          .radio:first-child
            margin-right: 30px    
</style>
