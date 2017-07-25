<template>
  <div class="orient-config-wrapper">
    <div class="data-title-wrapper">
      <div class="dowm-forward">
        <span class="list-title">账户名称：</span>
        <el-input disabled v-model="advName" placeholder="请输入内容"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">计划ID：</span>
        <el-input disabled v-model="campaignId" placeholder="请输入内容"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">计划名称：</span>
        <el-input disabled v-model="name" placeholder="请输入内容"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">创意ID：</span>
        <el-input disabled v-model="createid" placeholder="请输入内容"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">创意名称：</span>
        <el-input disabled v-model="codename" placeholder="请输入内容"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">广告类型：</span>
        <el-input disabled v-model="adtype" placeholder="请输入内容"></el-input>
      </div>
      <div class="dowm-forward media-forward">
        <span class="list-title">定向媒体：</span>
        <div class="radio-wrapper">
          <el-radio class="radio" v-model="orientMedia" label="1">全部媒体</el-radio>
          <el-radio class="radio" v-model="orientMedia" label="2">可选媒体</el-radio>
          <el-radio class="radio" v-model="orientMedia" label="3">可选广告位</el-radio>
        </div>
      </div>
      <div class="media-transfer-wrapper" v-if="orientMedia==='2'">
        <el-transfer
          filterable
          :titles="['媒体列表','已选媒体']"
          filter-placeholder="请输入搜索项"
          v-model="mediaValues"
          :data="medias">
        </el-transfer>
      </div>
      <div class="media-transfer-wrapper" v-if="orientMedia==='3'">
        <el-transfer
          filterable
          :titles="['广告位列表','已选广告位']"
          filter-placeholder="请输入搜索项"
          v-model="slotValues"
          :data="slotes">
        </el-transfer>
      </div>
      <div class="dowm-forward media-forward">
        <span class="list-title">定向用户：</span>
        <el-radio-group v-model="orientUser" class="radio-wrapper">
          <el-radio class="radio" v-model="orientUser" label="1">全部用户</el-radio>
          <el-radio class="radio" v-model="orientUser" label="2">指定用户</el-radio>
        </el-radio-group>
        <el-upload
        v-if="orientUser==='2'" 
        class="upload-wrapper"
        drag
        :data="updatas"
        accept=".txt"
        :disabled="this.fileitem!=''||this.fileList.length===1"
        :action="urls"
        :multiple="false"
        :file-list="fileList"
        :on-remove="remove"
        :on-success="success"
        :on-error="error"
        :on-change="change">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传*.txt文件 
        </div>
      </el-upload>
      </div>
      <el-button type="primary" @click="submits">保存</el-button>
      <el-button type="default" @click="closes">取消</el-button>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import apiUtil from '../../../../util/api.js';
import upload from '../../../../components/upload/dragupload.vue';
import transfer from '../../../../components/transfer/transfer.vue';
export default {
  props: {
    adtype: {
  		type: String
  	},
    codename: {
  		type: String
  	},
    createid: {
  		type: String
  	},
    name: {
  		type: String
  	},
    campaignId: {
  		type: String
  	},
    advId: {
  		type: String
  	},
  	advName: {
  		type: String
  	},
  	configshow: {
  		type: Boolean
  	}
  },	
  data () {
    return {
      advNames: this.advName,
      advIds: this.advId,
      createids: this.createid,
      names: this.name,
      campaignIds: this.campaignId,
      codenames: this.codename,
      adtypes: this.adtype,
      orientUser: '1',
      orientMedia: '1',
      mediaValues: [],
      slotValues: [],
      medias: [],
      slotes: [],
      goPath: false,
      paths: '',
      updatas: {},
      configshow: this.configshows,
      urls: apiUtil.url('/v1/adm/creatives/uploadUser'),
      fileList: []
    };
  },
  mounted () {
    this.$nextTick(() => {
    	this.getslots();
    	this.getmedia();
    	this.loadconfig();
    });
  },
  components: { upload, transfer },
  methods: {
  	loadconfig () {
      this.loadings = true;
      let params = {};
      params.campaignId = this.campaignIds;
      params.creativeId = this.createids;
      this.$http.get('/v1/adm/campaigns/{campaignId}/creatives/{creativeId}/targetings', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result,centeritem = {};
        //应用控制
        if (result.filePath === 'ALL') {
          this.orientUser = '1';
        } else {
          this.orientUser = '2';
          centeritem.fileName= result.fileName;
          centeritem.filePath = result.filePath;
          this.fileitem = centeritem;
          this.fileList = [{
            name: result.fileName,
            url: result.filePath
          }];
        }
        //媒体控制
        if (result.media === '-1'&&result.slotIds === '-1') {
          this.orientMedia = '1';
        } else if (result.media!='-1'&&result.slotIds=='-1') {
          this.orientMedia = '2';
          this.mediaValues = result.media.split(',');
        } else if(result.media=='-1'&&result.slotIds!='-1'){
          this.orientMedia = '3';
          this.slotValues = result.slotIds.split(',');
        }
      }, () => {this.loadings = false;});
    },
    getmedia () {
      this.loadings = true;
      this.$http.get('/v1/adm/campaigns/apps').then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result, medias = [];
        for (let i = 0, a = result.length; i< a; i++) {
          let item = {};
          item.label = result[i].text;
          item.key = result[i].id;
          medias.push(item);
        }
        this.medias = medias;
      }, () => {this.loadings = false;});
    },
    getslots () {
      this.loadings = true;
      this.$http.get('/v1/adm/campaigns/slotIds').then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result, slots = [];
        for (let i = 0, a = result.length; i< a; i++) {
          let item = {};
          item.label = result[i].text;
          item.key = result[i].id;
          slots.push(item);
        }
        this.slotes = slots;
      }, () => {this.loadings = false;});
    },
    remove (file, fileList) {
      this.fileitem='';
      this.fileList = fileList;
    },
    success (data) {
      this.fileitem = data.result;
      console.log(data);
      if (data.ret!=1) {
        return this.$alert(data.message, '提示：', {
          confirmButtonText: '确定'
        });
      } 
      if (this.goPath) {
        return this.$alert(data.result, '提示：', {
          confirmButtonText: '确定',
          callback: () => {
            this.$router.push({
              path: this.paths
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
    },
    submits () {
      let params = {};
      if (this.orientMedia === '1') {
        params.medias = -1;
        params.slotIds = -1;
      }else if(this.orientMedia === '2'){
        params.medias = this.mediaValues.join(',');
        params.slotIds = -1;
      }else if(this.orientMedia === '3'){
        params.slotIds = this.slotValues.join(',');
        params.medias = -1;
      }
      if(this.orientUser === '1'){
        params.users = 'ALL';
        params.fileName = 'NULL';
      }else{
        params.users = this.fileitem.filePath;
        params.fileName = this.fileitem.fileName;
      }
      this.loadings = true;
      this.$http.post("/v1/adm/campaigns/"+this.campaignId+"/creatives/"+this.createid+"/targetings",params).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret != 1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }  
        this.closes();
      }, () => {this.loadings = false;});
    },
    closes () {
    	this.configshow = false;
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .orient-config-wrapper
    position: fixed
    top: 0
    left: 20%
    width: 100%
    height: 100%
    z-index: 100
    background-color: #fff
    overflow: auto
    .bread-title-wrapper
      margin-bottom: 15px
    .data-title-wrapper
      margin-bottom: 15px
      padding: 20px
      height: 100%
      overflow: auto
      .dowm-forward
        margin-bottom: 10px
        width: 300px 
        .radio-wrapper
          margin: 5px 0
          display: block
          .radio
            color: #565656
            width: 80px
            margin-right: 10px
          .radio:last-child
            margin-right: 0
      .media-forward
        width: 400px 
      .media-transfer-wrapper
        margin-bottom: 10px           
</style>
