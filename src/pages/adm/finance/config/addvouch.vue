<template>
  <div class="add-vouch-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="data-title-wrapper">
      <div class="dowm-forward">
        <span class="list-title">操作：</span>
        <div class="radio-wrapper">
          <el-radio-group v-model="oprations" @change="loadcompanys">
            <el-radio class="radio" label="0">提现</el-radio>
            <el-radio class="radio" label="1">充值</el-radio>
          </el-radio-group>
        </div>
      </div>
      <el-form :model="ruleForm" :rules="rules" :label-position="labelPosition" ref="ruleForm">
        <el-form-item label="公司名称：" prop="devId">
          <el-select v-model="ruleForm.devId" filterable placeholder="请选择" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
            <el-option
              v-for="item in devs"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额：" prop="prices">
          <el-input v-model="ruleForm.prices" placeholder="请输入内容"></el-input>
        </el-form-item>
        <div class="dowm-forward">
          <span class="list-title">上传凭证：</span>
          <upload :urls="urls" @get-file="getFile" :fileLists="fileList"></upload>
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
import apiUtil from '../../../../util/api.js';
import upload from '../../../../components/upload/imgupload.vue';
import breadcrumb from '../../../../components/breadcrumb/breadcrumb.vue';
export default {
  data () {
    var checks = (rule, value, callback) => {
      let req = /^(\d*\.)?\d+$/;
      if (!value) {
        return callback(new Error('金额不能为空'));
      }
      setTimeout(() => {
        if (!req.test(value)) {
          callback(new Error('请输入非负数'));
        } else {
          callback();
        }
      }, 1000);
    };
    return {
      ruleForm: {
        prices: '',
        devId: ''
      },
      rules: {
        prices: [
          { required: true, validator: checks, trigger: 'blur' }
        ],
        devId: [
          { required: true, message: '请选择公司', trigger: 'change' }
        ]
      },
      labelPosition: 'top',
      oprations: '0',
      devs: [],
      breadContent: [{ text: '提现/充值', path: '/adm/finance/vouchor'}, { text: '新增数据'}],
      urls: apiUtil.url('/v1/adm/dev/withdraws/materials'),
      fileName: '',
      fileUrl: '',
      fileList: [],
      loadings: false
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.loadcompanys();
    });
  },
  components: { upload, breadcrumb },
  methods: {
    loadcompanys () {
      let sources;
      if (this.oprations === '0') {
        sources = this.$resource('/v1/adm/names/devs');
      } else {
        sources = this.$resource('/v1/adm/names/advs');
      }
      this.loadings = true;
      sources.get().then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.devs = result;
      }, () => {this.loadings = false;});
    },
    getFile (filename, fileurl) {
      this.fileName = filename;
      this.fileUrl = fileurl;
    },
    creates (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitcreate();
        } else {
          return this.$alert('请正确输入或选择相应选项！！！', '提示：', {
            confirmButtonText: '确定'
          });
        }
      });
    },
    submitcreate () {
      if (this.fileName === '' || this.fileUrl === '') {
        return this.$alert('请先上传背景图文件！', '提示：', {
          confirmButtonText: '确定'
        });
      }
      let params = {};
      params.amount = this.ruleForm.prices;
      params.fileUrl  = this.fileUrl;
      this.loadings = true;
      if (this.oprations === '0') {
        params.devid = this.ruleForm.devId;
        params.optionType = 1;
        this.$http.post('/v1/adm/dev/financeOptions', params).then((res) => {
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
      } else {
        params.advId = this.ruleForm.devId;
        params.optiontype = 1;
        this.$http.post('/v1/adm/adv/financeOptions', params).then((res) => {
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
      }
    },
    back () {
      this.$router.push({
        path: '/adm/finance/vouchor'
      });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .add-vouch-wrapper
    .bread-title-wrapper
      margin-bottom: 15px
    .data-title-wrapper
      padding: 20px
      background: #fff
      border: 1px solid #eee
      .el-form-item
        width: 280px
        .el-select
          display: block
        .el-input
          display: block
        &:last-child
          margin-bottom: 0    
      .dowm-forward
        margin-bottom: 20px
        width: 280px  
        .radio-wrapper
          margin: 5px 0
          .radio
            color: #565656
            width: 80px
          .radio:first-child
            margin-right: 30px    
</style>
