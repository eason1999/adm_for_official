<template>
  <div class="ota-configuration-wrapper">
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
        <span class="list-title">保护周期：</span>
        <el-input v-model="input" placeholder="请输入内容"></el-input> <span class="unit">天</span>
      </div>
      <div class="plan-select dowm-forward">
        <span class="list-title">开屏间隔：</span>
        <el-input v-model="input1" placeholder="请输入内容"></el-input> <span class="unit">分钟</span>
      </div>
      <div class="plan-select dowm-forward">
        <span class="list-title">信息流间隔：</span>
        <el-input v-model="input2" placeholder="请输入内容"></el-input> <span class="unit">分钟</span>
      </div>
      <div class="plan-select dowm-forward">
        <span class="list-title">解锁次数：</span>
        <el-input v-model="input3" placeholder="请输入内容"></el-input> <span class="unit">次</span>
      </div>
      <div class="plan-select dowm-forward">
        <span class="list-title">广告曝光次数：</span>
        <el-input v-model="input4" placeholder="请输入内容"></el-input> <span class="unit">次</span>
      </div>
      <div class="plan-select dowm-forward">
        <span class="list-title">说明：</span>
        <el-input type="textarea" :rows="4" resize="none" placeholder="请输入内容" v-model="textarea"></el-input>
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
      breadContent: [{ text: 'OTA客户配置', path: '/adm/otaoutput/otaclient'}, { text: 'OTA配置'}],
      input: '',
      input1: '',
      input2: '',
      input3: '',
      input4: '',
      textarea: ''
    };
  },
  mounted () {
    
  },
  components: { selects, breadcrumb }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .ota-configuration-wrapper
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
