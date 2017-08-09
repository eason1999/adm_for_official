<template>
  <div class="dev-adsource-wrapper">
    <div class="data-title-wrapper">
      <div class="dowm-forward">
        <span class="list-title">开发者名称：</span>
        <el-input disabled v-model="devNames" placeholder="请输入内容" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">应用名称：</span>
        <el-input disabled v-model="appNames" placeholder="请输入内容"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">广告位名称：</span>
        <el-input disabled v-model="adslotNames" placeholder="请输入内容"></el-input>
      </div>
      <div class="resource-content">
        <div class="ad-box" v-if="ads.length > 0" v-for="(source, index) in ads">
          <div v-if="index === 0" class="form-group">
            <label class="form-title"></label>
            <div class="adv-source">
              <span class="source-title">广告来源</span>
              <span class="source-title">应用</span>
              <span class="source-title">广告位</span>
              <span class="source-title" v-if="types!='CONTENT'">流量比重</span>
              <span class="source-title" v-if="types!='CONTENT'">广告源状态</span>
              <span class="source-title" v-if="types==='CONTENT'">内容条数</span>
              <span class="source-title" v-if="types==='CONTENT'">广告条数</span>
            </div>
          </div>
          <div class="form-group">
            <label class="form-title">广告源：</label>
            <div class="adv-source" v-if="source.channelCode === '0'">
              <el-input class="form-control" value="系统" :disabled="true"></el-input>
              <el-input class="form-control" v-model="busIds" :disabled="true" placeholder="系统应用ID"></el-input>
              <el-input type="text" class="form-control" v-model="adslotBusIds" :disabled="true" placeholder="系统广告位ID"></el-input>
              <el-input class="form-control" v-model="source.channelWeight" placeholder="请输入非负整数"></el-input>
              <a class="delete-source " @click="deleteSource(source.id, index, $event)"><span class="el-icon-circle-cross"></span></a>
            </div>
            <div class="adv-source" v-else>
              <el-input class="form-control" v-model="source.channelName" :disabled="true"></el-input>
              <el-select filterable class="form-control" v-model="source.channelAppId" @change="initChannelSlots(index)">
                <el-option v-for="app in ads[index].apps" :key="app.appId" :label="app.appName" :value="app.appId"></el-option>
              </el-select>
              <el-select filterable class="form-control" v-model="source.channelSlotId" @change="slotChange(index)">
                <el-option v-for="slot in ads[index].slots" :key="slot.slotId" :label="slot.slotName" :value="slot.slotId"></el-option>
              </el-select>
              <div class="distinction-content" v-if="types!='CONTENT'">
                <el-input class="form-control" v-model="source.channelWeight" placeholder="请输入非负整数"></el-input>
                <el-select class="form-control" v-model="source.useTypeAPI">
                  <el-option key='0' label="正式" value='0'></el-option>
                  <el-option key='1' label="测试" value='1'></el-option>
                </el-select>
              </div>
              <div class="distinction-content" v-else>
                <el-input class="form-control" v-model="source.contentCount" placeholder="请输入非负整数"></el-input>
                <el-input class="form-control" v-model="source.adCount" placeholder="请输入非负整数"></el-input>
              </div> 
              <a class="delete-source" @click="deleteSource(source.id, index, $event)"><span class="el-icon-circle-cross"></a>
              <label class="form-title" style="margin-top: 8px;margin-left: 7px;width: 50%;text-align: left;">
              应用ID：{{source.channelAppId}} 广告位ID:{{source.channelSlotId}} </label>
            </div>
          </div>
        </div>  
        <el-dropdown menu-align="start" trigger="click" @command="handleCommand">
          <el-button type="info">
            请选择广告源<i class="el-icon-caret-bottom el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item, index) in sources" :command="index">{{item.channelName}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="footer-wrapper">
          <el-button type="primary" @click="creates" :disabled="!validators">新建</el-button>
          <el-button type="default" @click="back">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="ecmascript-6">
export default {
  props: {
    appId: {
      type: Number
    },
    type: {
      type: String
    },
    devId: {
      type: Number
    },
    busId: {
      type: String
    },
    idBlongTo: {
      type: String
    },
    devName: {
      type: String
    },
    appName: {
      type: String
    },
    verificationStatus: {
      type: String
    },
    adslotId: {
      type: Number
    },
    adslotBusId: {
      type: String
    },
    adslotName: {
      type: String
    },
    accessFormat: {
      type: String
    },
    platForm: {
      type: String
    },
    index: {
      type: Number
    }
  },
  data () {
    return {
      allApps: {},
      allSlots: {},
      sources: [],
      ads:[],
      appIds: this.appId,
      types: this.type,
      devIds: this.devId,
      busIds: this.busId,
      idBlongTos: this.idBlongTo,
      devNames: this.devName,
      appNames: this.appName,
      verificationStatusz: this.verificationStatus,
      adslotIds: this.adslotId,
      adslotBusIds: this.adslotBusId,
      adslotNames: this.adslotName,
      accessFormats: this.accessFormat,
      platForms: this.platForm,
      indexs: this.index,
      loadings: false,
      adshow: false
    };
  },
  computed: {
    validators () {
      let req = /^[1-9]\d*|0$/, item;
      if (this.ads.length) {
        for (let i = 0; i < this.ads.length; i++) {
          if (this.types !== 'CONTENT') {
            if (this.ads[i].channelCode === '0') {
              item = req.test(this.ads[i].channelWeight);
            } else {
              item = req.test(this.ads[i].channelWeight) && 
                     this.ads[i].channelAppId !== '' && 
                     this.ads[i].channelSlotId !== '';
            }
          } else {
            if (this.ads[i].channelCode === '0') {
              item = req.test(this.ads[i].channelWeight);
            } else {
              item = req.test(this.ads[i].contentCount) && 
                     req.test(this.ads[i].adCount) && 
                     this.ads[i].channelAppId !== '' && 
                     this.ads[i].channelSlotId !== '';
            }
          }
        }
      }
      return item;
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.loadsource();
      this.initChannelApps();
      if (this.types != 'CONTENT') {
        this.delayInitAdsData();
      } else {
        this.loadcontent();
      }
    });
  },
  components: {

  },
  methods: {
    loadsource () {
      let params = {};
      params.accessFormat = this.accessFormats;
      this.loadings = true;
      this.$http.get('/v1/dict/types/adSource', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.sources = result;
      }, () => {this.loadings = false;});
    },
    creates () {
      if (this.types === 'CONTENT') {
        this.contents();
      } else {
        this.resources();
      }
    },
    contents () {
      // 清除ads的apps和slots多余数据，避免post数据繁杂
      let postAds = [], params = {};
      for (let i = 0; i < this.ads.length; i++) {
        let pad = {};
        pad.id = this.ads[i].id;
        pad.channelAppId = this.ads[i].channelAppId;
        pad.channelAppPkg = this.ads[i].channelAppPkg;
        pad.channelCode = this.ads[i].channelCode;
        pad.channelName = this.ads[i].channelName;
        pad.channelSlotId = this.ads[i].channelSlotId;
        pad.contentCount = this.ads[i].contentCount;
        pad.adCount = this.ads[i].adCount;
        pad.useTypeAPI = this.ads[i].useTypeAPI; 
        postAds.push(pad);
      }
      params.adContent = JSON.stringify(postAds);
      params.adslotId = this.adslotIds;
      params.appId = this.appIds;
      this.loadings = true;
      this.$http.post('/v1/adm/dev/content', params).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        } else {
          return this.$alert('配置成功！！！', '提示：', {
            confirmButtonText: '确定',
            callback: () => {
              this.back();
            }
          });
        }
      }, () => {this.loadings = false;});
    },
    resources () {
      // 清除ads的apps和slots多余数据，避免post数据繁杂
      let postAds = [], params = {};
      for (let i = 0; i < this.ads.length; i++) {
        let pad = {};
        pad.id = this.ads[i].id;
        pad.channelAppId = this.ads[i].channelAppId;
        pad.channelAppPkg = this.ads[i].channelAppPkg;
        pad.channelCode = this.ads[i].channelCode;
        pad.channelName = this.ads[i].channelName;
        pad.channelSlotId = this.ads[i].channelSlotId;
        pad.channelWeight = this.ads[i].channelWeight;
        pad.totalWeight = this.ads[i].totalWeight;
        pad.useTypeAPI = this.ads[i].useTypeAPI;  
        postAds.push(pad);
      }
      params.ads = JSON.stringify(postAds);
      params.accessFormat = this.accessFormats;
      this.loadings = true;
      this.$http.post('/v1/adm/apps/'+this.appIds+'/'+this.adslotIds+'/sources', params).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        } else {
          return this.$alert('配置成功！！！', '提示：', {
            confirmButtonText: '确定',
            callback: () => {
              this.back();
            }
          });
        }
      }, () => {this.loadings = false;});
    },
    back () {
      this.$emit('update:show', false);
    },
    deleteSource (id, index) {
      this.$confirm('确定删除么？？？').then(() => {
        this.ads.splice(index, 1);
        if (this.types === 'CONTENT'&&id !== undefined) {
          console.log(this.types);
          console.log(id);
          this.deletecontent(id);
        }
      }).catch(() => {});
    },
    handleCommand (index) {
      console.log(index) 
      if (this.sources[index].channelCode === "0") {
        if (this.ads.length) {
          for (let Index in this.ads) {
            if (this.ads[Index].channelCode === "0") {
              return this.$alert('已存在该选项，不可重复配置！！！', '提示：', {
                confirmButtonText: '确定'
              });
            }
          }
        }  
      }
      let cApps = this.allApps[this.sources[index].channelCode];
      this.ads.push({
          channelCode: this.sources[index].channelCode,
          channelName: this.sources[index].channelName,
          channelAppId: '',
          channelSlotId: '',
          channelWeight: '',
          useTypeAPI: '0',
          _timestamp: +(new Date()),
          apps: cApps,
          slots: []
      });
    },
    initChannelApps () {
      // 获取广告源的Apps
      let params = {};
      console.log(this.platForms);
      params.accessformat = this.accessFormats;
      params.type = this.types;
      params.platForm = this.platForms;
      params.idtype = this.idBlongTos;
      this.loadings = true;
      this.$http.get("/v1/adm/dev/apps/adSourceApps", {params: params}).then((res) => {
        this.loadings = false;
        let data = res.data;
        for (let key in data.result) {
            if(key==undefined) continue;
          let tmpAppIds = [];
          let sourceApps = [];
          let sourceSlots= [];
          for (let i = 0; i<data.result[key].length; i++) {
              let slot = data.result[key][i];
              if (tmpAppIds.indexOf(slot.appId) < 0) {
                tmpAppIds.push(slot.appId);
                sourceApps.push({
                  appId: slot.appId, 
                  appName: slot.appName
                });
              }
            sourceSlots.push({
              appId: slot.appId, 
              slotId: slot.adSlotId, 
              slotName: slot.adSlotName, 
              appPkg: slot.appPkg
            });
          }
          this.allApps[key] = sourceApps;
          this.allSlots[key] = sourceSlots;
        }
      }, () => {this.loadings = false;});
    },
    initChannelSlots (adsIndex) {
      let appSlots = [];
      let allChannelSlots = this.allSlots[this.ads[adsIndex].channelCode];
      for (let i = 0; i < allChannelSlots.length; i++) { 
        if (allChannelSlots[i].appId === this.ads[adsIndex].channelAppId) {
            appSlots.push(allChannelSlots[i]);
        }
      }
      this.ads[adsIndex].slots = appSlots;
      this.ads[adsIndex].channelSlotId = '';
    },
    slotChange (adsIndex) {
        let slotId = this.ads[adsIndex].channelSlotId;
        for (let i = 0; i<this.ads[adsIndex].slots.length; i++) {
        if (this.ads[adsIndex].slots[i].slotId == slotId) {
          this.ads[adsIndex].channelAppPkg = this.ads[adsIndex].slots[i].appPkg;
          return;
        }
      }
      this.ads[adsIndex].channelAppPkg = '';
    },
    delayInitAdsData () {
      let params = {};
      params.appId = this.appIds;
      params.devId = this.devIds;
      params.adslotId = this.adslotIds;
      params.accessFormat = this.accessFormats;
      params.type = this.types;
      this.loadings = true;
      this.$http.get('/v1/adm/apps/{appId}/{adslotId}/sources', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        this.ads = [];
        for (let i = 0; i < data.result.ads.length; i++) {
          let tmpAds = data.result.ads[i];
          tmpAds.useTypeAPI = String(tmpAds.useTypeAPI);
          if (tmpAds.channelCode!="0") {
            tmpAds.apps=this.allApps[tmpAds.channelCode];
            let appSlots = [];
            let allChannelSlots = this.allSlots[tmpAds.channelCode];
            for (let key in allChannelSlots) {
              if (allChannelSlots[key].appId === tmpAds.channelAppId) {
                appSlots.push(allChannelSlots[key]);
              }
            }
            tmpAds.slots = appSlots;
          }
          this.ads.push(tmpAds);
        }   
      }, () => {this.loadings = false;});
    },
    loadcontent () {
      let params = {};
      params.appId = this.appIds;
      params.devId = this.devIds;
      params.adSlotId = this.adslotIds;
      params.type = this.types;
      this.loadings = true;
      this.$http.get('/v1/adm/dev/content/sourceslotids', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        this.ads = [];
        for (let i = 0; i < data.result.length; i++) {
          let tmpAds = data.result[i];
          if (tmpAds.channelCode!="0") {
            tmpAds.apps=this.allApps[tmpAds.channelCode];
            let appSlots = [];
            let allChannelSlots = this.allSlots[tmpAds.channelCode];
            for (let j = 0; j < allChannelSlots.length; j++) {
              if (allChannelSlots[j].appId === tmpAds.channelAppId) {
                appSlots.push(allChannelSlots[j]);
              }
            }
            tmpAds.slots = appSlots;
          }
          this.ads.push(tmpAds);
        }   
      }, () => {this.loadings = false;});
    },
    deletecontent (id) {
      this.loadings = true;
      this.$http.delete('/v1/adm/dev/content/'+id+'/sources').then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        } else {
          return this.$alert('删除成功！！！', '提示：', {
            confirmButtonText: '确定',
            callback: () => {
              this.back();
            }
          });
        }  
      }, () => {this.loadings = false;});
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .dev-adsource-wrapper
    background: #fff
    position: fixed
    top: 0
    left: 20%
    width: 80%
    height: 100%
    overflow: auto
    z-index: 100
    .data-title-wrapper
      margin-bottom: 15px
      padding: 20px
      .dowm-forward
        margin-bottom: 10px
        width: 300px 
        position: relative
        .el-input
          width: 100%
      .resource-content
        border-top: 1px dashed #ccc
        padding-top: 10px
        position: relative
        .ad-box
          margin-bottom: 15px
          .form-group
            margin-bottom: 10px
            .form-title
              width: 65px
              display: inline-block
              font-size: 14px
              color: #475669
              vertical-align: top
              padding-top: 10px
            .adv-source
              display: inline-block 
              .delete-source
                color: red
                cursor: pointer
                font-size: 14px
              .form-control
                width: 150px
                margin-right: 5px
              .source-title
                width: 150px
                display: inline-block
                font-size: 14px
                margin-right: 5px
                color: #475669  
                padding-left: 10px
                box-sizing: border-box
              .distinction-content
                display: inline-block  
        .el-dropdown  
          .el-button
            margin-bottom: 15px  
</style>
