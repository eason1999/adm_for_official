<template>
  <div class="adv-slotlist-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="apps-data-table">
      <el-table :data="tableData" style="width: 100%" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
        <el-table-column type="expand">
          <template scope="props">
            <el-form label-position="left" inline class="demo-table-expand sub-app-form">
              <el-form-item label="广告类型:">
                <span>{{ props.row.type | filetypes}}</span>
              </el-form-item>
              <el-form-item label="广告位ID:">
                <span>{{ props.row.busId }}</span>
              </el-form-item>
              <el-form-item label="广告位名称:">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="分成/固定单价:">
                <span>{{ props.row.slotShareNum }}</span>
              </el-form-item>
              <el-form-item label="操作:">
                <span :class="{ 'el-icon-circle-cross': props.row.configuredResource === false, 'el-icon-circle-check': props.row.configuredResource === true }"></span>
                <el-button 
                  v-if="props.row.type!='CONTENT'" 
                  :disabled="disabledstatus" 
                  type="info" 
                  size="small" 
                  @click="sourceconfigs(props.row.id, props.row.busId, props.row.name, 'API', props.row.type, props.$index)">配置广告源API</el-button>
                <el-button 
                  v-if="adType === 'SDK'&&props.row.type!='CONTENT'" 
                  :disabled="disabledstatus" 
                  type="info" 
                  size="small" 
                  @click="sourceconfigs(props.row.id, props.row.busId, props.row.name, 'SDK', props.row.type, props.$index)">配置广告源SDK</el-button>
                <el-button 
                  v-if="props.row.type==='CONTENT'" 
                  :disabled="disabledstatus" 
                  type="info" 
                  size="small" 
                  @click="sourceconfigs(props.row.id, props.row.busId, props.row.name, 'API', props.row.type, props.$index)">配置内容广告源</el-button>
                <el-button
                 v-if="props.row.type!='CONTENT'" 
                 :disabled="disabledstatus" 
                 type="info" 
                 size="small" 
                 @click="timeConfigs(props.row.id, props.row.busId, props.row.name, props.$index)">频次控制</el-button>
                <el-button
                 :disabled="disabledstatus" 
                 type="info" 
                 size="small" 
                 @click="divideConfigs(props.row.id, props.row.name, props.row.slotShareType, props.row.slotShareNum)">分成配置</el-button>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="广告类型" show-overflow-tooltip>
          <template scope="props">
            <span>{{ props.row.type | filetypes}}</span>
          </template>
        </el-table-column>
        <el-table-column label="广告位ID" show-overflow-tooltip prop="busId"></el-table-column>
        <el-table-column label="广告位名称" show-overflow-tooltip prop="name"></el-table-column>
      </el-table>
    </div>
    <div v-if="resourceshow" class="bottom-bg" @click="closes"></div>
    <transition name="slide-fade">
      <adsource 
        v-if="resourceshow&&tags === 0" 
        @update:show="val => resourceshow = val" 
        :app-id="appId"
        :type="type"
        :dev-id="devId"
        :bus-id="busId"
        :id-blong-to="idBlongTo"
        :dev-name="devName"
        :app-name="appName"
        :verification-status="verificationStatus"
        :adslot-id="adslotId"
        :adslot-bus-id="adslotBusId"
        :adslot-name="adslotName"
        :access-format="accessFormat"
        :plat-form="platForm"
        :index="$index"></adsource>
      <frequency
        v-if="resourceshow&&tags === 1" 
        @update:show="val => resourceshow = val" 
        :app-id="appId"
        :dev-name="devName"
        :app-name="appName"
        :adslot-id="adslotId"
        :adslot-name="adslotName"></frequency>
      <divides 
        v-if="resourceshow&&tags === 2" 
        @update:show="val => resourceshow = val" 
        @update:slot="refreshslot"
        :app-id="appId"
        :dev-id="devId"
        :dev-name="devName"
        :app-name="appName"
        :adslot-id="adslotId"
        :adslot-name="adslotName"
        :slot-share-type.sync="slotShareType" 
        :slot-share-num.sync="slotShareNum" 
        :app-share-type.sync="appShareType" 
        :app-share-num.sync="appShareNum"></divides>
    </transition>
  </div>
</template>
<script type="ecmascript-6">
import breadcrumb from '../../../../components/breadcrumb/breadcrumb.vue';
import adsource from './slotconfig/adsource.vue';
import frequency from './slotconfig/frequency.vue';
import divides from './slotconfig/divides.vue';
export default {
  data () {
    return {
      breadContent: [{ text: '应用管理', path: '/adm/dev/app'}, { text: '广告位管理'}],
      tableData: [],
      appId: this.$route.query.appId,
      devId: this.$route.query.devId,
      idBlongTo: this.$route.query.idBlongTo,
      devName: this.$route.query.devName,
      busId: this.$route.query.busId,
      appName: this.$route.query.appName,
      platForm: this.$route.query.platForm,
      verificationStatus: this.$route.query.verificationStatus,
      adType: this.$route.query.accessFormat,
      appShareType: this.$route.query.appShareType,
      appShareNum: this.$route.query.appShareNum,
      adslotId: '', 
      adslotBusId: '', 
      adslotName: '', 
      accessFormat: '', 
      type: '', 
      $index: -1,
      slotShareType: '',
      slotShareNum: 0,
      loadings: false,
      resourceshow: false,
      tags: -1
    };
  },
  filters: {
    filetypes (val) {
      let item;
      switch (val) {
        case 'BANNER':
          item = '横幅广告';
          break;
        case 'SPLASH':
          item = '开屏广告';
          break;
        case 'NATIVE':
          item = '原生广告';
          break;
        case 'INTERSTITIAL':
          item = '插屏广告';
          break;  
        default:
          item = '内容广告'; 
          break;     
      }
      return item;
    }
  },
  computed: {
    disabledstatus () {
      let item;
      item = (this.verificationStatus === 'PENGDING' || this.verificationStatus === 'DENIED' || this.idBlongTo === undefined);
      return item;
    }
  },
  mounted () {
    this.$nextTick(() => { 
      this.load();
    });
  },
  components: { breadcrumb, adsource, frequency, divides },
  methods: {
    refreshslot () {
      this.load();
    },
    load () {
      this.loadings = true;
      let params = {};
      params.appId = this.appId;
      params.devId = this.devId;
      this.$http.get('/v1/adm/dev/apps/{devId}/{appId}/adslots', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.tableData = result;
      }, () => {this.loadings = false;});
    },
    sourceconfigs (adslotId, adslotBusId, adslotName, accessFormat, type, index) {
      this.shows();
      this.tags = 0;
      this.adslotId = adslotId;
      this.adslotBusId = adslotBusId; 
      this.adslotName = adslotName; 
      this.accessFormat = accessFormat; 
      this.type = type; 
      this.$index = index;
    },
    timeConfigs (adslotId, adslotBusId, adslotName, index) {
      this.shows();
      this.tags = 1;
      this.adslotId = adslotId;
      this.adslotBusId = adslotBusId; 
      this.adslotName = adslotName; 
      this.$index = index;
    },
    divideConfigs (adslotId, adslotName, shareType, shareNum) {
      this.shows();
      this.tags = 2;
      this.adslotId = adslotId;
      this.adslotName = adslotName; 
      this.slotShareType = shareType;
      this.slotShareNum = shareNum;
    },
    shows () {
      this.resourceshow = true;
    },
    closes () {
      this.resourceshow = false;
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .adv-slotlist-wrapper
    overflow: hidden
    .apps-top-wrapper
      margin-bottom: 15px
      .apps-search
        max-width: 300px
        font-size: 0
        .el-input
          width: 230px
          input
            border-radius: 4px 0 0 4px
        button 
          border-radius: 0 4px 4px 0
    .apps-data-table
      font-size: 0
      margin-top: 20px
      .sub-app-form
        padding: 10px
        border-bottom: 1px dashed #bbb
        label
          width: 75px
          overflow: hidden
          white-space: nowrap
          text-overflow: ellipsis
          color: #99a9bf
        .el-form-item
          margin-right: 0
          margin-bottom: 0
          width: 48%  
      .sub-app-form:last-child
        border: none
      .el-icon-circle-check
        color: #13CE66
      .el-icon-circle-cross
        color: #FF4949                 
    .pager-wrapper
      margin-top: 15px 
    // 侧向划出   
    .slide-fade-enter-active 
      transition: all .8s ease
    .slide-fade-leave-active 
      transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0)
    .slide-fade-enter, .slide-fade-leave-to
      transform: translateX(200px)
      opacity: 0     
</style>
