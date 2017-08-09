<template>
  <div class="ota-white-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="data-title-wrapper">
      <el-form :model="ruleForm" :rules="rules" :label-position="labelPosition" ref="ruleForm">
        <el-form-item label="应用名称：" prop="appName">
          <el-input v-model="ruleForm.appName" placeholder="请输入内容" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中"></el-input>
        </el-form-item>
        <el-form-item label="包名称：" prop="packageName">
          <el-input v-model="ruleForm.packageName" placeholder="请输入内容"></el-input>
        </el-form-item>
        <div class="dowm-forward">
          <span class="list-title">应用背景图：</span>
          <imgupload :urls="urls" @get-file="getFile" :fileLists="fileList"></imgupload>
        </div>
        <el-form-item>
          <el-button type="primary" @click="creates('ruleForm')">新建</el-button>
          <el-button type="default" @click="back">取消</el-button>
        </el-form-item>
      </el-form>  
    </div>
  </div>
</template>

<script type="ecmascript-6">
import breadcrumb from '../../../../components/breadcrumb/breadcrumb.vue';
import imgupload from '../../../../components/upload/imgupload.vue';
import apiUtil from '../../../../util/api.js';
export default {
  data () {
    return {
      id: this.$route.query.id,
      breadContent: [{ text: '应用白名单', path: '/adm/otaoutput/whitelist'}, { text: '新增白名单'}],
      ruleForm: {
        packageName: '',
        appName: ''
      },
      urls: apiUtil.url('/v1/adm/ota/whiteapp/material'),
      fileName: '',
      fileUrl: '',
      fileList: [],
      loadings: false,
      labelPosition: 'top',
      rules: {
        packageName: [
          { required: true, message: '请输入包名称', trigger: 'blur' }
        ],
        appName: [
          { required: true, message: '请输入应用名称', trigger: 'blur' }
        ]
      }
    };
  },
  mounted () {
    if (this.id) {
      this.amend();
    }
  },
  components: { breadcrumb, imgupload },
  methods: {
    amend () {
      let params = {};
      params.id = this.id;
      this.loadings = true;
      this.$http.get('/v1/adm/ota/{id}/whiteapp/', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.ruleForm.packageName = result.packageName;
        this.ruleForm.appName = result.appName;
        this.fileUrl = result.fileUrl;
        this.fileName = result.fileName;
        let item = {};
        item.name = result.fileName;
        item.url = result.fileUrl;
        this.fileList.push(item);
      }, () => {this.loadings = false;});
    },
    getFile (filename, fileurl) {
      this.fileName = filename;
      this.fileUrl = fileurl;
    },
    creates (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid && (this.fileName !== '' || this.fileUrl !== '')) {
          this.configs();
        } else {
          return this.$alert('请正确输入相应选项或上传图片！！！', '提示：', {
            confirmButtonText: '确定'
          });
        }
      });
    },
    configs () {
      if (this.fileName === '' || this.fileUrl === '') {
        return this.$alert('请先上传背景图文件！', '提示：', {
          confirmButtonText: '确定'
        });
      }
      this.loadings = true;
      let params = {};
      if (this.id) {
        params.id = this.id;
      }
      params.appName  = this.ruleForm.appName;
      params.packageName  = this.ruleForm.packageName;
      params.fileName  = this.fileName;
      params.fileUrl  = this.fileUrl;
      this.$http.post('/v1/adm/ota/whiteapp', params).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        this.$alert('创建成功！', '提示：', {
          confirmButtonText: '确定'
        }).then(() => {
          this.back();
        });
      }, () => {this.loadings = false;});
    },
    back () {
      this.$router.push({
        path: '/adm/otaoutput/whitelist'
      });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .ota-white-wrapper
    .bread-title-wrapper
      margin-bottom: 15px
    .data-title-wrapper
      margin-bottom: 15px
      padding: 20px
      background: #fff
      border: 1px solid #eee
      .el-form-item
        width: 280px 
        &:last-child
          margin-bottom: 0 
      .dowm-forward
        width: 280px
        margin-bottom: 20px     
</style>
