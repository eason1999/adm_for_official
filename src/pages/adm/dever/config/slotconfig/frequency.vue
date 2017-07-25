<template>
  <div class="dev-frequency-wrapper">
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
        <div class="ad-box" v-if="uids.length > 0">
          <span class="list-title">UID控制：</span>
          <el-table :data="uids" style="width: 100%">
            <el-table-column prop="date" label="广告来源"></el-table-column>
            <el-table-column prop="name" label="频控属性"></el-table-column>
            <el-table-column prop="address" label="监控类型"></el-table-column>
            <el-table-column prop="address" label="监控内容"></el-table-column>
            <el-table-column prop="address" label="频次/小时"></el-table-column>
            <el-table-column prop="address" label="频次/天"></el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                <el-button type="info" size="small">编辑</el-button>
                <el-button type="danger" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>  
        <div class="ad-box" v-if="ips.length > 0">
          <span class="list-title">IP控制：</span>
          <el-table :data="ips" style="width: 100%">
            <el-table-column prop="date" label="广告来源"></el-table-column>
            <el-table-column prop="name" label="频控属性"></el-table-column>
            <el-table-column prop="address" label="监控类型"></el-table-column>
            <el-table-column prop="address" label="监控内容"></el-table-column>
            <el-table-column prop="address" label="频次/小时"></el-table-column>
            <el-table-column prop="address" label="频次/天"></el-table-column>
            <el-table-column prop="address" label="监控内容"></el-table-column>
            <el-table-column prop="address" label="频次/小时"></el-table-column>
            <el-table-column prop="address" label="频次/天"></el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                <el-button type="info" size="small">编辑</el-button>
                <el-button type="danger" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="add-frequency">
          <el-button type="info" @click="showdialog">+创建更多广告频次</el-button>
        </div>
        <div class="footer-wrapper">
          <el-button type="primary" @click="creates">新建</el-button>
          <el-button type="default" @click="back">取消</el-button>
        </div>
      </div>
    </div>
    <el-dialog v-model="freqVisible" size="tiny" @close="closedialog" class="config-dialog-contain">
      <el-form>
        <el-form-item label="广告源：">
          <el-select v-model="sourceId" @change="load" filterable placeholder="全部开发者">
            <el-option
              v-for="item in sources"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="频控属性：">
          <el-select v-model="attrId" @change="load" filterable placeholder="全部开发者">
            <el-option
              v-for="item in attrs"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="监控类型：">
          <el-select v-model="typeId" @change="load" filterable placeholder="全部开发者">
            <el-option
              v-for="item in types"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="按小时：">
          <el-input v-model="createid" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="按天：">
          <el-input v-model="codename" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closedialog">取 消</el-button>
        <el-button type="primary" @click="submits">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="ecmascript-6">
export default {
  props: {
    appId: {
      type: Number
    },
    devId: {
      type: Number
    },
    busId: {
      type: String
    },
    devName: {
      type: String
    },
    appName: {
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
    index: {
      type: Number
    }
  },
  data () {
    return {
      uids: [{date: 1, name: 2, address: 3}],
      ips: [{date: 1, name: 2, address: 3}],
      sources: [{id: 0, text: '撒地方'}],
      sourceId: '',
      attrs: [{id: 0, text: '撒地方'}],
      attrId: '',
      types: [{id: 0, text: '撒地方'}],
      typeId: '',
      appIds: this.appId,
      devIds: this.devId,
      busIds: this.busId,
      devNames: this.devName,
      appNames: this.appName,
      adslotIds: this.adslotId,
      adslotNames: this.adslotName,
      indexs: this.index,
      loadings: false,
      // 频次
      freqVisible: false
    };
  },
  mounted () {
    this.$nextTick(() => {
      
    });
  },
  components: {

  },
  methods: {
    showdialog () {
      this.freqVisible = true;
    },
    closedialog () {},
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
  .dev-frequency-wrapper
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
        .add-frequency  
          .el-button
            margin-bottom: 15px  
</style>
