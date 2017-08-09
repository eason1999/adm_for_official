<template>
  <div class="one-data-wrapper">
    <el-form :model="ruleForm" :rules="rules" :label-position="labelPosition" ref="ruleForm">
      <el-form-item label="广告源名称：" prop="adName">
        <el-select v-model="ruleForm.adName" filterable placeholder="请选择" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
          <el-option
            v-for="item in adsources"
            :key="item.channelCode"
            :label="item.channelName"
            :value="item.channelCode"
            :extnote="item.extNote">
          </el-option>
        </el-select>
      </el-form-item>  
      <el-form-item label="接入形式：">
        <el-radio-group v-model="ruleForm.accessFormat" class="radio-wrapper">
          <el-radio class="radio" label="API">API</el-radio>
          <el-radio class="radio" label="SDK">SDK</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="流量类型：">
        <el-radio-group v-model="ruleForm.deviceType" class="radio-wrapper">
          <el-radio class="radio" label="Android">Android</el-radio>
          <el-radio class="radio" label="IOS">IOS</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="ID归属：">
        <el-radio-group v-model="ruleForm.idAttr" class="radio-wrapper">
          <el-radio class="radio" label="selfuse">平台</el-radio>
          <el-radio class="radio" label="otheruse">外放</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="广告位类型：" prop="slottype">
        <el-select v-model="ruleForm.slottype" filterable placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="应用名称：" prop="appName">
        <el-input v-model="ruleForm.appName" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="应用版本：" prop="appVersion">
        <el-input v-model="ruleForm.appVersion" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="应用ID：" prop="appId">
        <el-input v-model="ruleForm.appId" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="应用包名：" prop="appPkg">
        <el-input v-model="ruleForm.appPkg" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="广告位名称：" prop="slotname">
        <el-input v-model="ruleForm.slotname" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="广告位ID：" prop="adslotId">
        <el-input v-model="ruleForm.adslotId" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="特殊需求属性：">
        <el-input placeholder="请输入内容" v-model="ruleForm.extProps"></el-input>
      </el-form-item>
      <div class="state-content">
        <lable class="list-title"></lable>
        <p class="red-mark">*应用名称，应用ID，广告位名称，广告位ID请和广告源的信息保持完全一致。</p>
      </div>
      <el-form-item>
        <el-button type="primary" @click="creates('ruleForm')">新建</el-button>
        <el-button type="default" @click="back">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="ecmascript-6">
export default {
  data () {
    return {
      id: this.$route.query.id,
      ruleForm: {
        appVersion: '',
        appName: '',
        appId: '',
        appPkg: '',
        slotname: '',
        extProps: '',
        adslotId: '',
        accessFormat: 'API',
        deviceType: 'Android',
        idAttr: 'selfuse',
        slottype: '',
        adName: ''
      },
      options: [],
      adsources: [],
      loadings: false,
      labelPosition: 'top',
      rules: {
        appName: [
          { required: true, message: '请输入应用名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        adName: [
          { required: true, message: '请选择广告源', trigger: 'change' }
        ],
        appVersion: [
          { required: true, message: '请输入版本号', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        appId: [
          { required: true, message: '请输入应用ID', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        slottype: [
          { required: true, message: '请选择广告类型', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        appPkg: [
          { required: true, message: '请填写应用包名', trigger: 'blur' }
        ],
        slotname: [
          { required: true, message: '请填写广告位名称', trigger: 'blur' }
        ],
        adslotId: [
          { required: true, message: '请填写广告位ID', trigger: 'blur' }
        ]
      }
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.getslots();
      this.getresource();
      if (this.id) {
        this.update();
      }
    });
  },
  components: {
    
  },
  methods: {
    getslots () {
      this.loadings = true;
      this.$http.get('/v1/dict/types/adslots').then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.options = result;
      }, () => {this.loadings = false;});
    },
    getresource () {
      this.loadings = true;
      this.$http.get('/v1/dict/types/adSource').then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        for (let i=0; i<result.length; i++) {
          result[i].accessFormats="";
          if (result[i].hasApi) {
            result[i].accessFormats+= ",API";
          }else if (result[i].hasSdk) {
            result[i].accessFormats+= ",SDK";
          }
        }
        this.adsources = result;
      }, () => {this.loadings = false;});
    },
    update () {
      let params = {};
      params.id = this.id;
      this.loadings = true;
      this.$http.get('/v1/source/sourceBo/one/{id}', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.ruleForm.accessFormat = result.accessFormat;
        this.ruleForm.adslotId = result.adslotId;
        this.ruleForm.slotname = result.adslotName;
        this.ruleForm.slottype = result.adslotType;
        this.ruleForm.appId = result.appId;
        this.ruleForm.appName = result.appName;
        this.ruleForm.appPkg = result.appPkg;
        this.ruleForm.adName = result.channelCode;
        this.ruleForm.deviceType = result.deviceType;
        this.ruleForm.idAttr = result.idBelongTo;
        this.ruleForm.extProps = result.extProps;
      }, () => {this.loadings = false;});
    },
    creates (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitcreate();
        } else {
          return this.$alert('请正确选择或输入相应选项！！！', '提示：', {
            confirmButtonText: '确定'
          });
        }
      });
    },
    submitcreate () {
      let params={
        channelcode: this.ruleForm.adName,
        adslotid: this.ruleForm.adslotId,
        adslottype: this.ruleForm.slottype,
        adappid: this.ruleForm.appId,
        apppkg: this.ruleForm.appPkg,
        adslotname: this.ruleForm.slotname,
        adappname: this.ruleForm.appName,
        accessformat: this.ruleForm.accessFormat,
        devicetype: this.ruleForm.deviceType,
        idBelongTo: this.ruleForm.idAttr,
        extProps: this.ruleForm.extProps
      }
      let resource;
      if (this.id) {
        params.id = this.id;
        resource = this.$http.post('/v1/source/sourceUpdate',params);
      }else{
        resource = this.$http.post('/v1/source/sourceId',params);
      }
      this.loadings = true;
      resource.then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!= 1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        } else {
          return this.$alert('创建成功！！！', '提示：', {
            confirmButtonText: '确定',
            callback: () => {
              this.back();
            }
          });
        }
      }, () => {this.loadings = false;});
    },
    back () {
      this.$router.push({
        path: '/adm/resource'
      });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .one-data-wrapper
    .el-form-item
      .el-input
        width: 280px 
      .el-select
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
        margin-bottom: 10px    
    .state-content
      width: 100% 
      margin-bottom: 10px         
      .red-mark
        display: inline-block 
        color: rgba(255, 0, 0, .8)  
        font-size: 12px     
</style>
