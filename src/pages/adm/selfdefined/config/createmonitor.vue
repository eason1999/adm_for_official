<template>
  <div class="selfdefined-create-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="data-title-wrapper">
      <div class="dowm-forward">
        <span class="list-title">数据数量：</span>
        <div class="radio-wrapper">
          <el-radio-group v-model="monitortype" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
            <el-radio class="radio" :disabled="id !== undefined" label="1">单条监测</el-radio>
            <el-radio class="radio" :disabled="id !== undefined" label="2">批量监测</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div v-if="monitortype === '1'">
	      <el-form :model="ruleForm" :rules="rules" :label-position="labelPosition" ref="ruleForm">
	        <el-form-item label="名称(中文)：" prop="mediaName">
		      <el-input v-model="ruleForm.mediaName" placeholder="请输入内容"></el-input>
		    </el-form-item>
		    <el-form-item label="名称(英文)：" prop="medias">
        	  <el-input v-model="ruleForm.medias" placeholder="请输入内容"></el-input>
	        </el-form-item>
	        <el-form-item label="广告位名称：" prop="slot">
              <el-input v-model="ruleForm.slot" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="监测类型：" prop="type">
              <el-select v-model="ruleForm.type" filterable placeholder="请选择">
                <el-option
                  v-for="item in types"
                  :key="item.id"
                  :label="item.text"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="链接URL：" prop="targetUrl">
              <el-input v-model="ruleForm.targetUrl" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="confirms('ruleForm')">确定</el-button>
              <el-button type="default">取消</el-button>
            </el-form-item>  
          </el-form>  
      </div> 
      <div v-else>
      	<div class="dowm-forward">
          <span class="list-title">上传文件：</span>
          <dragupload :go-paths="goPath" :paths="paths" :urls="urls" :file-lists="fileList" :modeldatas="modeldatas"></dragupload>
        </div>
      </div> 
    </div>
  </div>
</template>

<script type="ecmascript-6">
import apiUtil from '../../../../util/api.js';
import breadcrumb from '../../../../components/breadcrumb/breadcrumb.vue';
import dragupload from '../../../../components/upload/dragupload.vue';
export default {
  data () {
  	var checkname = (rule, value, callback) => {
      let req = /^\w+$/g;
      if (!value) {
        return callback(new Error('输入不能为空'));
      }
      setTimeout(() => {
        if (!req.test(value)) {
          callback(new Error('请输入英文、数字字符'));
        } else {
          callback();
        }
      }, 1000);
    };
    var checkurl = (rule, value, callback) => {
      let req = /^(https:\/\/|http:\/\/)/;
      if (!value) {
        return callback(new Error('监测地址不能为空'));
      }
      setTimeout(() => {
        if (!req.test(value)) {
          callback(new Error('请以http://或https://开头'));
        } else {
          callback();
        }
      }, 1000);
    };
    return {
      monitortype: '1',
      id: this.$route.query.id,
      ruleForm: {
        mediaName: this.$route.query.medianame,
        medias: this.$route.query.medias,
        slot: this.$route.query.slot,
        targetUrl: this.$route.query.targeturl,
        type: this.$route.query.type
      },
      rules: {
        mediaName: [
          { required: true, message: '请填写相关内容', trigger: 'blur' }
        ],
        slot: [
          { required: true, message: '请填写广告位名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择监测类型', trigger: 'change' }
        ],
        medias: [
          { required: true, validator: checkname, trigger: 'blur' }
        ],
        targetUrl: [
          { required: true, validator: checkurl, trigger: 'blur' }
        ]
      },
      types: [{id:'CLICK',text:'点击'}, {id:'VIEW',text:'展现'}],
      breadContent: [{ text: '监测代码', path: '/adm/selfdefined/monitor'}, { text: '新建监测'}],
      goPath: true,
      paths: '/adm/selfdefined/monitor',
      urls: apiUtil.url('/v1/adm/track/batch'),
      fileList: [],
      modeldatas: 'http://adroi.bj.bcebos.com/cdn/res/resource/temp/%E5%8C%85%E7%9B%91%E6%B5%8B%E6%A8%A1%E6%9D%BF.zip',
      loadings: false,
      labelPosition: 'top'
    };
  },
  mounted () {
    
  },
  components: { breadcrumb, dragupload },
  methods: {
    confirms (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.id) {
          	this.updates();
          } else {
            this.creates();
          }	
        } else {
          return this.$alert('请正确输入或选择相应选项！！！', '提示：', {
            confirmButtonText: '确定'
          });
        }
      });
    },
    creates () {
      let params = {};
          params.type = this.ruleForm.type;
          params.mediaName = this.ruleForm.mediaName;
          params.media = this.ruleForm.medias;
          params.slot = this.ruleForm.slot;
          params.targetUrl = this.ruleForm.targetUrl;
      this.loadings = true;    
      this.$http.post('/v1/adm/track/one',params).then((res) => {
      	this.loadings = false;
        let data = res.data;
        if (data.ret != 1) {
          return this.$alert(data.message, '提示：', {
          	confirmButtonText: '确定'
          });
        }
        this.back();
      }, () => {this.loadings = false;});
  	},
  	updates () {
      let params = {};
          params.id = this.id;
          params.type = this.ruleForm.type;
          params.mediaName = this.ruleForm.mediaName;
          params.media = this.ruleForm.medias;
          params.slot = this.ruleForm.slot;
          params.targetUrl = this.ruleForm.targetUrl;
      this.laodings = true;    
      this.$http.post('/v1/adm/track/updateone',params).then((res) => {
      	this.loadings = false;
        let data = res.data;
        if (data.ret != 1) {
          return this.$alert(data.message, '提示：', {
          	confirmButtonText: '确定'
          });
        }
        this.back();
      }, () => {this.loadings = false;});
  	},
    back () {
      this.$router.push({
        path: '/adm/selfdefined/monitor'
      });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .selfdefined-create-wrapper
    .bread-title-wrapper
      margin-bottom: 15px
    .data-title-wrapper
      margin-bottom: 15px
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
        .el-select
          display: block    
        &:last-child
          margin-bottom: 0
</style>
