<template>
  <div class="img-upload-wrapper">
    <el-upload
      class="upload-wrapper"
      accept=".jpg,.png,.jpeg,.gif"
      :action="uploadurl"
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
      <img width="100%" :src="dialogImageUrl">
    </el-dialog>
  </div>  
</template>

<script type="ecmascript-6">
export default {
  props: {
    urls: {
      type:String
    }
  },
  data () {
    return {
      fileList: [{name: '丰田致炫-800-120.png',url: 'http://192.168.1.54:9001/./res/zya_certificate_material/16/31159054019322_505951065_63de7e4c.png'}],
      dialogImageUrl: '',
      dialogVisible: false,
      uploadurl: this.urls
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
      // console.log(data);
    },
    change (data) {
      // console.log(data);
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
