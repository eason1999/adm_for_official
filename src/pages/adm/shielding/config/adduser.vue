<template> 
  <div class="add-user-wrapper">
    <div class="bread-title-wrapper"> 
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="data-title-wrapper">
      <el-form :model="ruleForm" :rules="rules" :label-position="labelPosition" ref="ruleForm">
        <el-form-item label="黑名单类型：">
          <el-radio-group v-model="userId" class="radio-wrapper">
            <el-radio class="radio" label="0">单个用户</el-radio>
            <el-radio class="radio" label="1">批量用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="IMEI/IDFA：" prop="inputs" v-if="userId !== '1'">  
          <el-input v-model="ruleForm.inputs" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item v-if="userId !== '1'">
          <el-button type="primary" @click="creates('ruleForm')">新建</el-button>
          <el-button type="default" @click="back">取消</el-button>
        </el-form-item>
        <div class="dowm-forward" v-else>
          <span class="list-title">IMEI/IDFA：</span>
          <dragupload :go-paths="goPath" :paths="paths" :urls="urls" :file-lists="fileList" :modeldatas="modeldatas"></dragupload>
        </div>
      </el-form>  
    </div>
  </div>
</template>

<script type="ecmascript-6">
import apiUtil from '../../../../util/api.js';
import breadcrumb from '../../../../components/breadcrumb/breadcrumb.vue';
import dragupload from '../../../../components/upload/dragupload.vue';
export default {
  data () {
    return {
      breadContent: [{ text: '用户黑名单', path: '/adm/shield/user'}, { text: '新增黑名单'}],
      ruleForm: {
        inputs: ''
      },
      userId: '0',
      goPath: true,
      paths: '/adm/shield/user',
      urls: apiUtil.url('/v1/ota/blacks'),
      fileList: [],
      modeldatas: 'http://adroi.bj.bcebos.com/cdn/res/resource/temp/%E6%89%B9%E9%87%8F%E9%BB%91%E5%90%8D%E5%8D%95%E6%A8%A1%E6%9D%BF.xlsx',
      laodings: false,
      labelPosition: 'top',
      rules: {
        inputs: [
          { required: true, message: '请填写用户信息', trigger: 'blur' }
        ]
      }
    };
  },
  mounted () {
    
  },
  components: { dragupload, breadcrumb },
  methods: {
    creates (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitcreate();
        } else {
          return this.$alert('请正确输入相应选项！！！', '提示：', {
            confirmButtonText: '确定'
          });
        }
      });
    },
    submitcreate () {
      let params = {};
      params.IMEI = this.ruleForm.inputs;
      this.laodings = true;
      this.$http.post('/v1/ota/black', params).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        this.back();
      }, () => {this.loadings = false;});
    },
    back () {
      this.$router.push({
        path: '/adm/shield/user'
      });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .add-user-wrapper
    .bread-title-wrapper
      margin-bottom: 15px
    .data-title-wrapper
      padding: 20px
      background: #fff
      border: 1px solid #eee
      .el-form-item
        width: 280px 
        .radio-wrapper
          margin: 5px 0
          display: block 
          .radio
            color: #565656
            width: 80px
          .radio:first-child
            margin-right: 30px
        &:last-child
          margin-bottom: 0     
      .dowm-forward 
        width: 280px 
        position: relative   
        .el-input
          margin-bottom: 10px  
</style>
