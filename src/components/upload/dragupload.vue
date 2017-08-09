<template>
  <el-upload
    class="upload-wrapper"
    drag
    :data="otherdata"
    accept=".xls,.xlsx"
    :disabled="this.item!=''||this.fileList.length===1"
    :action="uploadurl"
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
      <a :href="modeldata" class="upload-model">*模板文件</a>
    </div>
  </el-upload>
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
    },
    goPaths: {
      type: Boolean,
      default: false
    },
    paths: {
      type: String
    },
    modeldatas: {
      type: String
    },
    otherdatas: {
      type: Object
    }
  },
  data () {
    return {
      fileList: this.fileLists,
      uploadurl: this.urls,
      item: '',
      goPath: this.goPaths,
      path: this.paths,
      modeldata: this.modeldatas,
      otherdata: this.otherdatas
    };
  },
  methods: {
    remove (file, fileList) {
      this.item='';
      this.fileList = fileList;
    },
    success (data) {
      this.item = data.result;
      if (data.ret!=1) {
        return this.$alert(data.message, '提示：', {
          confirmButtonText: '确定'
        });
      } 
      if (this.goPath) {
        return this.$alert(data.message, '提示：', {
          confirmButtonText: '确定',
          callback: () => {
            this.$router.push({
              path: this.path
            });
          }
        });
      }

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
    width: 305px
    .el-upload-dragger
      width: 300px
      height: 160px
    .el-upload__tip
      .upload-model
        font-size: 12px
        color: red
</style>
