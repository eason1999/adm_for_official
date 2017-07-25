<template>
  <div class="one-data-wrapper">
      <div class="dowm-forward">
        <span class="list-title">广告源名称：</span>
        <el-select v-model="adName" filterable placeholder="请选择" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
          <el-option
            v-for="item in adsources"
            :key="item.channelCode"
            :label="item.channelName"
            :value="item.channelCode"
            :extnote="item.extNote">
          </el-option>
        </el-select>
      </div>
      <div class="dowm-forward">
        <span class="list-title">接入形式：</span>
        <el-radio-group v-model="accessFormat" class="radio-wrapper">
          <el-radio class="radio" label="API">API</el-radio>
          <el-radio class="radio" label="SDK">SDK</el-radio>
        </el-radio-group>
      </div>
      <div class="dowm-forward">
        <span class="list-title">流量类型：</span>
        <el-radio-group v-model="deviceType" class="radio-wrapper">
          <el-radio class="radio" label="Android">Android</el-radio>
          <el-radio class="radio" label="IOS">IOS</el-radio>
        </el-radio-group>
      </div>
      <div class="dowm-forward">
        <span class="list-title">ID归属：</span>
        <el-radio-group v-model="idAttr" class="radio-wrapper">
          <el-radio class="radio" label="selfuse">平台</el-radio>
          <el-radio class="radio" label="otheruse">外放</el-radio>
        </el-radio-group>
      </div>
      <div class="dowm-forward">
        <span class="list-title">广告位类型：</span>
        <el-select v-model="slottype" filterable placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="dowm-forward">
        <span class="list-title">应用名称：</span>
        <el-input v-model="appName" placeholder="请输入内容"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">应用版本：</span>
        <el-input v-model="appVersion" placeholder="请输入内容"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">应用ID：</span>
        <el-input v-model="appId" placeholder="请输入内容"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">应用包名：</span>
        <el-input v-model="appPkg" placeholder="请输入内容"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">广告位名称：</span>
        <el-input v-model="slotname" placeholder="请输入内容"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">广告位ID：</span>
        <el-input v-model="adslotId" placeholder="请输入内容"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">特殊需求属性：</span>
        <el-input placeholder="请输入内容" v-model="extProps"></el-input>
      </div>
      <div class="state-content">
        <lable class="list-title"></lable>
        <p class="red-mark">*应用名称，应用ID，广告位名称，广告位ID请和广告源的信息保持完全一致。</p>
      </div>
      <el-button type="primary" @click="creates">新建</el-button>
      <el-button type="default" @click="back">取消</el-button>
    </div>
  </div>
</template>

<script type="ecmascript-6">
export default {
  data () {
    return {
      id: this.$route.query.id,
      appVersion: '',
      appName: '',
      appId: '',
      appPkg: '',
      slotname: '',
      textarea: '',
      adslotId: '',
      accessFormat: 'API',
      deviceType: 'Android',
      idAttr: 'selfuse',
      slottype: '',
      adName: '',
      options: [],
      adsources: [],
      loadings: false
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
        this.accessFormat = result.accessFormat;
        this.adslotId = result.adslotId;
        this.slotname = result.adslotName;
        this.slottype = result.adslotType;
        this.appId = result.appId;
        this.appName = result.appName;
        this.appPkg = result.appPkg;
        this.adName = result.channelCode;
        this.deviceType = result.deviceType;
        this.idAttr = result.idBelongTo;
        this.extProps = result.extProps;
      }, () => {this.loadings = false;});
    },
    creates () {
      let params={
        channelcode: this.adName,
        adslotid: this.adslotId,
        adslottype: this.slottype,
        adappid: this.appId,
        apppkg: this.appPkg,
        adslotname: this.slotname,
        adappname: this.appName,
        accessformat: this.accessFormat,
        devicetype: this.deviceType,
        idBelongTo: this.idAttr,
        extProps: this.extProps
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
        }
        this.$router.push({
          path: '/adm/resource'
        });
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
    .dowm-forward
      margin-bottom: 10px
      width: 280px 
      .el-select
          display: block 
      .radio-wrapper
        margin: 5px 0
        display: block 
        .radio
          color: #565656
          width: 80px
        .radio:first-child
          margin-right: 30px
    .state-content
      width: 100% 
      margin-bottom: 10px         
      .red-mark
        display: inline-block
        color: rgba(255, 0, 0, .8)  
        font-size: 12px 
</style>
