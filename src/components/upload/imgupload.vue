<template>
  <div class="img-upload-wrapper">
    <el-upload
      :disabled="this.item!=''||this.fileList.length===1"
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
    },
    fileLists: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      fileList: this.fileLists,
      dialogImageUrl: '',
      dialogVisible: false,
      uploadurl: this.urls,
      item: ''
    };
  },
  methods: {
    remove (file, fileList) {
      this.item='';
      this.fileList = fileList;
    },
    preview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    success (data) {
      this.item = data.result;
      if (data.ret!=1) {
        return this.$alert(data.message, '提示：', {
          confirmButtonText: '确定'
        });
      }
      this.$emit('get-file', data.result.fileName, data.result.fileUrl);
    },
    error (data) {
      return this.$alert(data.message, '提示：', {
        confirmButtonText: '确定'
      });
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
