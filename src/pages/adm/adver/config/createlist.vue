<template>
  <div class="adv-createlist-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="apps-data-table">
      <el-table :data="tableData" style="width: 100%" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
        <el-table-column type="expand">
          <template scope="props">
            <el-form label-position="left" inline class="demo-table-expand sub-app-form">
              <el-form-item label="预览:">
                <el-button type="info" size="small" @click="previewImg(props.$index, props.row.meteriaUrl)">预览</el-button>
              </el-form-item>
              <el-form-item label="配置:">
                <el-button type="info" size="small" @click="config(props.row.id,props.row.codeName,props.row.adTypeOnProduct)">定向配置</el-button>
              </el-form-item>
              <el-form-item label="审核状态:">
                <span>{{ props.row.verificationStatus | verstatus }}</span>
              </el-form-item>
              <el-form-item label="投放状态:">
                <span>{{ props.row.availabilityStatus | avastatus }}</span>
              </el-form-item>
              <el-form-item label="审核操作:">
                <template>
                  <el-button :disabled="props.row.verificationStatus === 'PENGDING'||props.row.verificationStatus === 'APPROVED'" type="success" size="small" @click="audits(props.$index, props.row.id, 'APPROVED')">通过</el-button>
                  <el-button :disabled="props.row.verificationStatus === 'PENGDING'||props.row.verificationStatus === 'DENIED'" type="danger" size="small" @click="audits(props.$index, props.row.id, 'DENIED')">拒绝</el-button>
                </template>
              </el-form-item>
              <el-form-item label="投放操作:">
                <template>
                  <el-switch v-model="props.row.availabilityStatus" on-color="#13ce66" off-color="#ff4949" on-value="ALLOWED" off-value="DISALLOWED" @change="sendAvail(props.row.id, props.row.availabilityStatus)"></el-switch>
                </template>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="提交时间" show-overflow-tooltip>
          <template scope="props">
            <span>{{props.row.createTime | date }}</span> 
          </template>
        </el-table-column>
        <el-table-column label="广告类型" show-overflow-tooltip>
          <template scope="props">
            <span>{{ props.row.adTypeOnProduct | filetypes }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创意ID" show-overflow-tooltip prop="id"></el-table-column>
        <el-table-column label="创意名称" show-overflow-tooltip prop="codeName"></el-table-column>
      </el-table>
    </div>
    <el-dialog v-model="dialogVisible" size="tiny">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <el-dialog v-model="configVisible" size="tiny" @close="closedialog" class="config-dialog-contain">
      <el-form>
        <el-form-item label="账户名称：">
          <el-input disabled v-model="advName" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="计划ID：">
          <el-input disabled v-model="campaignId" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="计划名称：">
          <el-input disabled v-model="name" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="创意ID：">
          <el-input disabled v-model="createid" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="创意名称：">
          <el-input disabled v-model="codename" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="广告类型：">
          <el-input disabled v-model="adtype" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="定向媒体：">
          <el-radio-group v-model="orientMedia" class="radio-wrapper">
            <el-radio class="radio" label="1">全部媒体</el-radio>
            <el-radio class="radio" label="2">可选媒体</el-radio>
            <el-radio class="radio" label="3">可选广告位</el-radio>
          </el-radio-group>
          <div class="media-transfer-wrapper" v-if="orientMedia==='2'">
            <el-transfer
              v-loading.body="medias.length===0"
              filterable
              :titles="['媒体列表','已选媒体']"
              filter-placeholder="请输入搜索项"
              v-model="mediaValues"
              :data="medias">
            </el-transfer>
          </div>
          <div class="media-transfer-wrapper" v-if="orientMedia==='3'">
            <el-transfer
              v-loading.body="slotes.length===0"
              filterable
              :titles="['广告位列表','已选广告位']"
              filter-placeholder="请输入搜索项"
              v-model="slotValues"
              :data="slotes">
            </el-transfer>
          </div>
        </el-form-item>
        <el-form-item label="定向用户：">
          <el-radio-group v-model="orientUser" class="radio-wrapper">
            <el-radio class="radio" label="1">全部用户</el-radio>
            <el-radio class="radio" label="2">指定用户</el-radio>
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
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closedialog">取 消</el-button>
        <el-button type="primary" @click="submits">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 侧向划出 -->
    <!-- <div v-if="configshow" class="bottom-bg" @click="closes"></div>
    <transition name="slide-fade">
      <orientconfig
        v-if="configshow"
        :adtype="adtype"
        :codename="codename"
        :createid="createid"
        :name="name"
        :advName="advName"
        :campaignId="campaignId"
        :advId="advId"
        :configshow="configshow"></orientconfig>
    </transition> -->
  </div>
</template>
<script type="ecmascript-6">
import breadcrumb from '../../../../components/breadcrumb/breadcrumb.vue';
import orientconfig from './orientconfig.vue';
import apiUtil from '../../../../util/api.js';
export default {
  data () {
    return {
      fileitem: '',
      breadContent: [{ text: '广告管理', path: '/adm/adv/campaign'}, { text: '广告位管理'}],
      tableData: [],
      campaignId: this.$route.query.campaignId,
      advId: this.$route.query.advId,
      advName: this.$route.query.advName,
      name: this.$route.query.name,
      createid: '',
      codename: '',
      adtype: '',
      dialogVisible: false,
      dialogImageUrl: '',
      configVisible: false,
      formLabelWidth: '120px',
      loadings: false,
      orientUser: '1',
      orientMedia: '1',
      mediaValues: [],
      slotValues: [],
      medias: [],
      slotes: [],
      goPath: false,
      paths: '',
      updatas: {},
      urls: apiUtil.url('/v1/adm/creatives/uploadUser'),
      fileList: [],
      configshow: false
    };
  },
  filters: {
    verstatus (value) {
      let item;
      switch (value) {
        case 'DENIED':
          item = '审核拒绝';
          break;
        case 'PENGDING':
          item = '等待审核';
          break;
        case 'APPROVED':
          item = '审核通过';
          break;   
      }
      return item;
    },
    avastatus (value) {
      let item;
      switch (value) {
        case 'DISALLOWED':
          item = '停止投放';
          break;
        case 'VM_ALLOWED':
          item = '虚拟投放';
          break;
        case 'ALLOWED':
          item = '投放中';
          break; 
        default:
          item = '待投放';
          break;  
      }
      return item;
    },
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
        default:
          item = '插屏广告';
          break;     
      }
      return item;
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.load();
      this.getmedia();
      this.getslots();
    });
  },
  components: { breadcrumb, orientconfig },
  methods: {
    config (createid,codename,adtype) {
      // this.configshow = true;
      this.configVisible = true;
      this.createid = createid;
      this.codename = codename;
      this.adtype = adtype;
      this.updatas = {
        campaignId: this.campaignId,
        creativeId: createid
      };
      this.loadconfig();
    },
    closes () {
      this.fileitem='';
      this.fileList = [];
      this.configshow = false; 
    },
    previewImg (index, url) {
      this.$nextTick(() => {
        this.dialogImageUrl = '';
        this.dialogVisible = true;
        this.dialogImageUrl = url;
      });
    },
    load () {
      let params = {};
      params.campaignId = this.campaignId;
      params.advId = this.advId;
      this.loadings = true;
      this.$http.get('/v1/adm/campaigns/{campaignId}/creatives', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.tableData = result;
      }, () => {
        this.loadings = false;
      });
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
    closedialog () {
      this.fileitem='';
      this.fileList = [];
      this.configVisible = false;
    },
    loadconfig () {
      this.loadings = true;
      let params = {};
      params.campaignId = this.campaignId;
      params.creativeId = this.createid;
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
        this.closedialog();    
      }, () => {this.loadings = false;});
    },
    audits (index, creativeId, verificationStatus) {
      if (verificationStatus === 'APPROVED') {
        return this.$confirm('确定审核通过吗？？？').then(() => {
          this.handleEdit(index, creativeId, verificationStatus);
        }).catch(() => {});
      } else {
        return this.$confirm('确定审核拒绝吗？？？').then(() => {
          this.handleEdit(index, creativeId, verificationStatus);
        }).catch(() => {});
      }
    },
    handleEdit (index, creativeId, verificationStatus) {
      let params = {};
      params.verificationStatus = verificationStatus;
      params.advId = this.advId;
      this.loadings = true;
      this.$http.put("/v1/adm/campaigns/"+this.campaignId+"/creatives/"+creativeId+"/verifications", params).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret != 1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        this.tableData[index].verificationStatus = verificationStatus;

      }, () => {this.loadings = false;});
    },
    sendAvail (id, availabilityStatus) {
      let params = {};
      params.advId = this.advId;
      if (availabilityStatus === 'ALLOWED') {
        params.availabilityStatus = 'DISALLOWED';
      } else {
        params.availabilityStatus = 'ALLOWED';
      }
      this.loadings = true;
      this.$http.put('/v1/adm/campaigns/'+this.campaignId+'/creatives/'+id+'/availabilities', params).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
      }, () => {this.loadings = false;});
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .adv-createlist-wrapper
    overflow: hidden
    .el-form-item
      margin-bottom: 10px
      .radio-wrapper
        margin: 5px 0
        width: 100% 
        .el-radio 
          margin-right: 20px
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
    // .slide-fade-enter-active 
    //   transition: all .8s ease
    // .slide-fade-leave-active 
    //   transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0)
    // .slide-fade-enter, .slide-fade-leave-to
    //   transform: translateX(200px)
    //   opacity: 0
</style>
