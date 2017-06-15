<template>
  <div class="img-upload-wrapper">
    <el-upload
      class="upload-wrapper"
      accept=".jpg,.png,.jpeg,.gif"
      action="https://jsonplaceholder.typicode.com/posts/"
      list-type="picture"
      :multiple="false"
      :file-list="fileList"
      :on-remove="remove"
      :on-success="success"
      :on-error="error"
      :on-preview="preview"
      :on-change="change">
      <el-button size="small" type="primary">点击上传</el-button>
      <div class="el-upload__tip" slot="tip">
        只能上传*.jpg/*.png/*.jpeg/*.gif文件
      </div>
    </el-upload>
    <el-dialog v-model="dialogVisible" size="tiny">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>  
</template>

<script type="ecmascript-6">
export default {
  data () {
    return {
      fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
      dialogImageUrl: '',
      dialogVisible: false
    };
  },
  methods: {
    remove (file, fileList) {
      console.log(file, fileList);
    },
    preview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
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
</style>
