<template>
  <div class="adv-config-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="data-title-wrapper">
      <div class="dowm-forward">
        <span class="list-title">公司名称：</span>
        <el-input disabled v-model="input" placeholder="请输入内容"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">账号：</span>
        <el-input disabled v-model="input1" placeholder="请输入内容"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">密码：</span>
        <el-input disabled v-model="input2" placeholder="请输入内容"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">角色：</span>
        <selects></selects>
      </div>
      <div class="dowm-forward">
        <span class="list-title">管理员：</span>
        <selects></selects>
      </div>
      <el-button type="primary">新建</el-button>
      <el-button type="primary">取消</el-button>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import breadcrumb from '../../../../components/breadcrumb/breadcrumb.vue';
import selects from '../../../../components/selects/select.vue';
export default {
  data () {
    return {
      input: '卓悠网络',
      input1: '34532422',
      input2: '.......',
      breadContent: [{ text: '广告主账户', path: '/adm/advaccount'}, { text: '账户配置'}],
    };
  },
  mounted () {
    
  },
  components: { breadcrumb, selects }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .adv-config-wrapper
    .bread-title-wrapper
      margin-bottom: 15px
    .data-title-wrapper
      padding: 20px
      background: #fff
      border: 1px solid #eee
      .dowm-forward
        margin-bottom: 10px
        width: 300px 
        .el-select
          display: block   
</style>
