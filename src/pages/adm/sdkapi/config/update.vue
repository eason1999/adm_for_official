<template>
  <div class="add-update-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="data-title-wrapper">
      <div class="dowm-forward">
        <span class="list-title">软件版本：</span>
        <el-input v-model="input" placeholder="请输入内容"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">更新日志：</span>
        <el-input type="textarea" resize="none" :rows='4' v-model="input1" placeholder="请输入内容"></el-input>
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
import upload from '../../../../components/upload/dragupload.vue';
import breadcrumb from '../../../../components/breadcrumb/breadcrumb.vue';
export default {
  data () {
    return {
      input: '',
      input1: '',
      breadContent: [{ text: 'SDK/API文档', path: '/adm/sdkapi'}, { text: '文档更新'}],
    };
  },
  mounted () {
    
  },
  components: { upload, breadcrumb }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .add-update-wrapper
    .bread-title-wrapper
      margin-bottom: 15px
    .data-title-wrapper
      padding: 20px
      background: #fff
      border: 1px solid #eee
      .dowm-forward
        margin-bottom: 10px
        width: 300px    
</style>
