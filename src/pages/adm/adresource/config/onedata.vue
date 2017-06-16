<template>
  <div class="one-data-wrapper">
      <div class="datepicker-wrapper dowm-forward">
        <span class="list-title">广告源名称：</span>
        <selects></selects>
      </div>
      <div class="plan-select dowm-forward">
        <span class="list-title">接入形式：</span>
        <div class="radio-wrapper">
          <el-radio class="radio" v-model="radio" label="1">API</el-radio>
          <el-radio class="radio" v-model="radio" label="2">SDK</el-radio>
        </div>
      </div>
      <div class="plan-select dowm-forward">
        <span class="list-title">流量类型：</span>
        <div class="radio-wrapper">
          <el-radio class="radio" v-model="radio1" label="1">Android</el-radio>
          <el-radio class="radio" v-model="radio1" label="2">IOS</el-radio>
        </div>
      </div>
      <div class="plan-select dowm-forward">
        <span class="list-title">ID归属：</span>
        <div class="radio-wrapper">
          <el-radio class="radio" v-model="radio2" label="1">平台</el-radio>
          <el-radio class="radio" v-model="radio2" label="2">外放</el-radio>
        </div>
      </div>
      <div class="create-select dowm-forward">
        <span class="list-title">广告位类型：</span>
        <selects></selects>
      </div>
      <div class="plan-select dowm-forward">
        <span class="list-title">应用名称：</span>
        <el-input v-model="input" placeholder="请输入内容"></el-input>
      </div>
      <div class="plan-select dowm-forward">
        <span class="list-title">应用ID：</span>
        <el-input v-model="input1" placeholder="请输入内容"></el-input>
      </div>
      <div class="plan-select dowm-forward">
        <span class="list-title">应用包名：</span>
        <el-input v-model="input2" placeholder="请输入内容"></el-input>
      </div>
      <div class="plan-select dowm-forward">
        <span class="list-title">广告位名称：</span>
        <el-input v-model="input3" placeholder="请输入内容"></el-input>
      </div>
      <div class="plan-select dowm-forward">
        <span class="list-title">广告位ID：</span>
        <el-input v-model="input4" placeholder="请输入内容"></el-input>
      </div>
      <div class="plan-select dowm-forward">
        <span class="list-title">特殊需求属性：</span>
        <el-input placeholder="请输入内容" v-model="textarea"></el-input>
      </div>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import selects from '../../../../components/selects/select.vue';
export default {
  data () {
    return {
      input: '',
      input1: '',
      input2: '',
      input3: '',
      input4: '',
      textarea: '',
      radio: '1',
      radio1: '1',
      radio2: '1'
    };
  },
  mounted () {
    
  },
  components: { selects }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .one-data-wrapper
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
