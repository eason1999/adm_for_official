<template>
  <div class="add-hit-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="data-title-wrapper">
      <div class="dowm-forward">
        <span class="list-title">操作：</span>
        <div class="radio-wrapper">
          <el-radio class="radio" v-model="radio" label="1">命中</el-radio>
          <el-radio class="radio" v-model="radio" label="2">退款</el-radio>
        </div>
      </div>
      <div class="dowm-forward" v-show="radio1!='2'">
        <span class="list-title">公司名称：</span>
        <selects></selects>
      </div>
      <div v-show="radio==='1'&&radio1!='2'">
        <div class="dowm-forward">
          <span class="list-title">应用名称：</span>
          <selects></selects>
        </div>
        <div class="dowm-forward">
          <span class="list-title">广告位名称：</span>
          <selects></selects>
        </div>
        <div class="dowm-forward">
          <span class="list-title">广告源名称：</span>
          <selects></selects>
        </div>
      </div>
      <div class="dowm-forward">
        <span class="list-title">数据数量：</span>
        <div class="radio-wrapper">
          <el-radio class="radio" v-model="radio1" label="1">单条数据</el-radio>
          <el-radio class="radio" v-model="radio1" label="2">批量数据</el-radio>
        </div>
      </div>
      <div v-if="radio1!=2">
        <div class="dowm-forward">
          <span class="list-title">日期：</span>
          <datepicker :datepickers="datepickers" :picker-options="pickerOptions"></datepicker>
        </div>
        <div class="dowm-forward">
          <span class="list-title">金额：</span>
          <el-input v-model="input" placeholder="请输入内容"></el-input>
        </div>
      </div>
      <div class="dowm-forward" v-else>
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
import datepicker from '../../../../components/datepicker/datepicker.vue';
export default {
  data () {
    return {
      input: '',
      radio: '1',
      radio1: '1',
      breadContent: [{ text: '命中/退款', path: '/adm/finance/hitback'}, { text: '新增数据'}],
      datepickers: {value:'', align: 'right', type: 'date'},
      pickerOptions: {}
    };
  },
  mounted () {
    
  },
  components: { selects, upload, breadcrumb, datepicker }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .add-hit-wrapper
    .bread-title-wrapper
      margin-bottom: 15px
    .data-title-wrapper
      padding: 20px
      background: #fff
      border: 1px solid #eee
      .dowm-forward
        margin-bottom: 10px
        width: 280px
        .el-date-editor.el-input
          width: 100% 
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
