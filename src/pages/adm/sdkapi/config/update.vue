<template> 
  <div class="add-update-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="data-title-wrapper">
      <el-form :model="ruleForm" :rules="rules" :label-position="labelPosition" ref="ruleForm">
        <el-form-item label="软件版本：" prop="version">
          <el-input v-model="ruleForm.version" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="更新日志：" prop="changeLog">
          <el-input type="textarea" resize="none" :rows='6' v-model="ruleForm.changeLog" placeholder="请输入内容"></el-input>
        </el-form-item>
        <div class="dowm-forward">
          <span class="list-title">上传文件：</span>
          <el-upload
            drag
            ref="upload"
            :data="updatas"
            accept=".zip,.pdf"
            :disabled="this.item!=''||this.fileList.length===1"
            :action="urls"
            :multiple="false"
            :file-list="fileList"
            :on-remove="remove"
            :on-success="success"
            :on-error="error"
            :on-change="change"
            :on-progress="progress"
            :auto-upload="false">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">
              只能上传*.zip/*.pdf文件
            </div>
          </el-upload>
        </div>
        <el-form-item>
          <el-button type="primary" @click="creates('ruleForm')">更新</el-button>
          <el-button type="default" @click="back">取消</el-button>
        </el-form-item>
      </el-form>    
    </div>
  </div>
</template>

<script type="ecmascript-6">
import upload from '../../../../components/upload/dragupload.vue';
import breadcrumb from '../../../../components/breadcrumb/breadcrumb.vue';
import apiUtil from '../../../../util/api.js';
export default {
  data () {
    return {
      ruleForm: {
        version: this.$route.query.version,
        changeLog: this.$route.query.changeLog
      },
      rules: {
        version: [
          { required: true, message: '请输入版本号', trigger: 'blur' }
        ],
        changeLog: [
          { required: true, message: '请输入更改日志信息', trigger: 'blur' }
        ]
      },
      labelPosition: 'top',
      type: this.$route.query.type,
      os: this.$route.query.os,
      address: this.$route.query.address,
      urls: '',
      updatas: {},
      fileList: [],
      item: '',
      fileitem: -1,
      breadContent: [{ text: 'SDK/API文档', path: '/adm/sdkapi'}, { text: '文档更新'}],
    };
  },
  mounted () {
    
  },
  components: { upload, breadcrumb },
  methods: {
    back () {
      this.$router.push({
        path: '/adm/sdkapi'
      });
    },
    remove (file, fileList) {
      this.item='';
      this.fileList = fileList;
    },
    success (data) {
      this.loadings = false;
      if (data.ret!=1) {
        return this.$alert(data.message, '提示：', {
          confirmButtonText: '确定'
        });
      } else {
        this.fileList = [];
        this.item = '';
        return this.$alert(data.message, '提示：', {
          confirmButtonText: '确定',
          callback: () => {
            this.$route.push({
              path: '/adm/sdkapi'
            });
          }
        });
      }
    },
    error (data) {
      return this.$alert(data.result, '提示：', {
        confirmButtonText: '确定'
      });
    },
    progress () {
      this.loadings = true;
    },
    change (data) {
      this.fileitem = data.percentage;
    },
    creates (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.update();
        } else {
          return this.$alert('请正确输入相应选项！！！', '提示：', {
            confirmButtonText: '确定'
          });
        }
      });
    },
    update () {
      if (this.fileitem !== 0) {
        return this.$alert('请先上传相关文件！！！', '提示：', {
          confirmButtonText: '确定'
        });
      }
      this.urls = apiUtil.url('/v1/adm/material/updateMaterial');
      this.updatas = {
        type: this.type,
        os: this.os,
        version: this.ruleForm.version,
        changeLog: this.ruleForm.changeLog
      };
      this.$nextTick(() => {
        this.$refs.upload.submit();
      });
    }
  }
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
      .el-form-item
        width: 280px
        .el-input
          display: block
          width: 100%
        &:last-child
          margin-bottom: 0  
      .dowm-forward
        margin-bottom: 20px
        width: 280px 
        .el-upload-dragger
          width: 280px
          height: 160px   
</style>
