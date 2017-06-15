<template>
  <el-upload
    class="upload-wrapper"
    drag
    accept=".xls,.xlsx"
    action="https://jsonplaceholder.typicode.com/posts/"
    :multiple="false"
    :file-list="fileList"
    :on-remove="remove"
    :on-success="success"
    :on-error="error"
    :on-change="change">
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    <div class="el-upload__tip" slot="tip">
      只能上传*.xls/*.xlsx文件  
      <a href="javascript:;" class="upload-model">*模板文件</a>
    </div>
  </el-upload>
</template>

<script type="ecmascript-6">
export default {
  data () {
    return {
      fileList: []
    };
  },
  methods: {
    remove (data) {
      console.log(data);
    },
    success (data) {
      console.log(data);
    },
    error (data) {
      console.log(data);
    },
    change (data) {
      console.log(data);
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .upload-wrapper
    .el-upload-dragger
      width: 300px
      height: 160px
    .el-upload__tip
      .upload-model
        font-size: 12px
        color: red
</style>
