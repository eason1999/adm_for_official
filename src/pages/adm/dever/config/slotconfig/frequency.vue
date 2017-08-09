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
            <el-table-column prop="adSourceName" label="广告来源"></el-table-column>
            <el-table-column label="频控属性">
              <template scope="scope">
                <span>UID</span>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="监控类型">
              <template scope="scope">
                <span>{{scope.row.trackType | monitortype }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="监控内容">
              <template scope="scope">
                <span>{{scope.row.trackType | monitorcontent }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="频次/小时">
              <template scope="scope">
                <span>{{scope.row.hourUid | numberfile }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="频次/天">
              <template scope="scope">
                <span>{{scope.row.dayUid | numberfile }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                <el-button type="info" size="small" @click="amendUidSource(scope.$index, scope.row.adSourceId, scope.row.freqType, scope.row.trackType, scope.row.hourUid, scope.row.dayUid,'1')">编辑</el-button>
                <el-button type="danger" size="small" @click="delUidSource(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>  
        <div class="ad-box" v-if="ips.length > 0">
          <span class="list-title">IP控制：</span>
          <el-table :data="ips" style="width: 100%">
            <el-table-column prop="adSourceName" label="广告来源"></el-table-column>
            <el-table-column label="频控属性">
              <template scope="scope">
                <span>IP</span>
              </template>
            </el-table-column>
            <el-table-column label="监控类型">
              <template scope="scope">
                <span>请求</span>
              </template>
            </el-table-column>
            <el-table-column label="监控内容">
              <template scope="scope">
                <span>三段IP一致</span>
              </template>
            </el-table-column>
            <el-table-column label="频次/小时">
              <template scope="scope">
                <span>{{scope.row.hourThrIp | numberfile }}</span>
              </template>
            </el-table-column>
            <el-table-column label="频次/天">
              <template scope="scope">
                <span>{{scope.row.dayThrIp | numberfile }}</span>
              </template>
            </el-table-column>
            <el-table-column label="监控内容">
              <template scope="scope">
                <span>四段IP一致</span>
              </template>
            </el-table-column>
            <el-table-column label="频次/小时">
              <template scope="scope">
                <span>{{scope.row.hourThuIp | numberfile }}</span>
              </template>
            </el-table-column>
            <el-table-column label="频次/天">
              <template scope="scope">
                <span>{{scope.row.dayThuIp | numberfile }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                <el-button 
                  type="info" 
                  size="small" 
                  @click="amendIpSource(scope.$index, scope.row.adSourceId, scope.row.freqType, scope.row.trackType, scope.row.hourThrIp, scope.row.hourThuIp, scope.row.dayThrIp, scope.row.dayThuIp, '1')">编辑</el-button>
                <el-button type="danger" size="small" @click="delIpSource(scope.$index)">删除</el-button>
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
    <el-dialog v-model="freqVisible" :modal="false" size="tiny" @close="closedialog" class="config-dialog-contain">
      <div class="dowm-forward">
        <span class="list-title">广告源：</span>
        <el-select :disabled="controlDis" v-model="sourceId" filterable placeholder="请选择">
          <el-option
            v-for="item in sources"
            :key="item.channelCode"
            :label="item.channelName"
            :value="item.channelCode">
          </el-option>
        </el-select>
      </div>
      <div class="dowm-forward">
        <span class="list-title">频控属性：</span>
        <el-select :disabled="controlDis" v-model="attrId" filterable placeholder="请选择">
          <el-option
            v-for="item in attrs"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="dowm-forward">
        <span class="list-title">监控类型：</span>
        <el-select :disabled="controlDis" v-model="typeId" filterable placeholder="请选择" v-if="attrId === 'uid'">
          <el-option
            v-for="item in types"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
        <el-input :disabled="true" v-model="requests" placeholder="请输入内容" v-else></el-input>
      </div>
      <div class="dowm-forward differ-block">
        <span class="list-title">按小时：</span>
        <div v-if="attrId==='uid'" class="uid-wrapper">
          <el-input v-model="byHour" placeholder="请输入非负整数"></el-input><span>次</span>
        </div>
        <div v-else class="ip-wrapper">
          <el-input v-model="reqHourThr" placeholder="请输入非负整数"></el-input><span>次/三段</span>
          <el-input v-model="reqHourThu" placeholder="请输入非负整数"></el-input><span>次/四段</span>
        </div>
      </div>
      <div class="dowm-forward differ-block">
        <span class="list-title">按天：</span>
        <div v-if="attrId==='uid'" class="uid-wrapper">
          <el-input v-model="byDay" placeholder="请输入非负整数"></el-input><span>次</span>
        </div>
        <div v-else class="ip-wrapper">
          <el-input v-model="reqDayThr" placeholder="请输入非负整数"></el-input><span>次/三段</span>
          <el-input v-model="reqDayThu" placeholder="请输入非负整数"></el-input><span>次/四段</span>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submits" :disabled="!validators">确 定</el-button>
        <el-button @click="closedialog">取 消</el-button>
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
    devName: {
      type: String
    },
    appName: {
      type: String
    },
    adslotId: {
      type: Number
    },
    adslotName: {
      type: String
    }
  },
  data () {
    return {
      uids: [],
      ips: [],
      sources: [],
      sourceId: '',
      attrs: [{id: 'uid', text: 'UID'}, {id: 'ip', text: 'IP'}],
      attrId: 'uid',
      types: [{id: 'click', text: '点击'}, {id: 'adreq', text: '请求'}],
      typeId: 'click',
      requests: '请求',
      appIds: this.appId,
      devNames: this.devName,
      appNames: this.appName,
      adslotIds: this.adslotId,
      adslotNames: this.adslotName,
      loadings: false,
      // 频次
      freqVisible: false,
      amendId: '',
      // 修改频次中间index
      itemIndex: -1,
      byDay:'',
      byHour:'',
      reqHourThr:'',
      reqHourThu:'',
      reqDayThr:'',
      reqDayThu:'',
      // 修改控制是否可编辑
      controlDis: false
    };
  },
  filters: {
    monitortype (val) {
      let item;
      if (val === 'click') {
        item = '点击';
      } else {
        item = '请求';
      }
      return item;
    },
    monitorcontent (val) {
      let item;
      if (val === 'click') {
        item = '广告点击';
      } else {
        item = '广告请求';
      }
      return item;
    },
    numberfile (val) {
      let item;
      if (val === -1) {
        item = '--';
      } else {
        item = val;
      }
      return item;
    }
  },
  computed: {
    validators () {
      let req = /^\+?[1-9]\d*$/, item;
      switch (this.attrId) {
        case 'uid':
          item = (this.sourceId !== '' && 
                  req.test(this.byHour) && 
                  req.test(this.byDay));
          break;
        case 'ip':
          item = (this.sourceId !== '' && 
                  req.test(this.reqHourThr) && 
                  req.test(this.reqHourThu) && 
                  req.test(this.reqDayThr) && 
                  req.test(this.reqDayThu));
          break;  
      }
      return item;
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.load();
      this.loadsource();
    });
  },
  components: {

  },
  methods: {
    showdialog () {
      this.byHour = this.byDay = this.reqHourThr = this.reqHourThu = this.reqDayThr = this.reqDayThu = '';
      this.amendId = '';
      this.sourceId = '';
      this.attrId = 'uid';
      this.typeId = 'click';
      this.freqVisible = true;
    },
    closedialog () {
      this.controlDis = false;
      this.freqVisible = false;
    },
    loadsource () {
      let params = {};
      params.accessFormat = 'API';
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
      let params = {}, uiDs, iPs;
      uiDs = JSON.stringify(this.uids);
      iPs = JSON.stringify(this.ips);
      params.ips = iPs;
      params.uids = uiDs;
      this.loadings = true;
      this.$http.post('/v1/adm/apps/'+this.appIds+'/'+this.adslotIds+'/setFrequency', params).then((res) => {
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
    submits () {
      let middItem = {}, cenItem = {};
      // 判断是否是修改
      if (this.amendId === '1') {
        console.log(this.amendId)
        console.log(this.itemIndex)
        if (this.attrId === 'uid') {
          if (this.byHour) {
            this.uids[this.itemIndex].hourUid = this.byHour;
          } else {
            this.uids[this.itemIndex].hourUid = -1;
          }
          if (this.byDay) {
            this.uids[this.itemIndex].dayUid = this.byDay;
          } else {
            this.uids[this.itemIndex].dayUid = -1;
          }
        } else if (this.attrId === 'ip') {
          if (this.reqHourThr) {
            this.ips[this.itemIndex].hourThrIp = this.reqHourThr;
          } else {
            this.ips[this.itemIndex].hourThrIp = -1;
          }
          if (this.reqHourThu) {
            this.ips[this.itemIndex].hourThuIp = this.reqHourThu;
          } else {
            this.ips[this.itemIndex].hourThuIp = -1;
          }
          if (this.reqDayThr) {
            this.ips[this.itemIndex].dayThrIp = this.reqDayThr;
          } else {
            this.ips[this.itemIndex].dayThrIp = -1;
          }
          if (this.reqDayThu) {
            this.ips[this.itemIndex].dayThuIp = this.reqDayThu;
          } else {
            this.ips[this.itemIndex].dayThuIp = -1;
          }
        }
      } else {
        if (this.attrId=='uid') {
          middItem.adSourceId = this.sourceId;
          for (let i = 0; i < this.sources.length; i++) {
            if (this.sourceId === this.sources[i].channelCode) {
              middItem.adSourceName = this.sources[i].channelName;
            }
          }
          middItem.freqType = this.attrId;
          middItem.trackType = this.typeId;
          if (this.byHour) {
            middItem.hourUid = this.byHour;
          } else {
            middItem.hourUid = -1;
          }
          if (this.byDay) {
            middItem.dayUid = this.byDay;
          } else {
            middItem.dayUid = -1;
          }
          this.uids.push(middItem);
          console.log(this.uids);
        } else if (this.attrId === 'ip') {
          cenItem.adSourceId = this.sourceId;
          for (let i = 0;i < this.sources.length; i++) {
            if (this.sourceId === this.sources[i].channelCode) {
              cenItem.adSourceName = this.sources[i].channelName;
            }
          }
          cenItem.freqType = this.attrId;
          cenItem.trackType = 'adreq';
          if (this.reqHourThr) {
            cenItem.hourThrIp = this.reqHourThr;
          } else {
            cenItem.hourThrIp = -1;
          }
          if (this.reqHourThu) {
            cenItem.hourThuIp = this.reqHourThu;
          } else {
            cenItem.hourThuIp = -1;
          }
          if (this.reqDayThr) {
            cenItem.dayThrIp = this.reqDayThr;
          } else {
            cenItem.dayThrIp = -1;
          }
          if (this.reqDayThu) {
            cenItem.dayThuIp = this.reqDayThu;
          } else {
            cenItem.dayThuIp = -1;
          }
          this.ips.push(cenItem);
          console.log(this.ips);
        }
      }
      this.freqVisible = false;
    },
    load () {
      this.loadings = true;
      this.$http.get('/v1/adm/apps/'+this.appIds+'/'+this.adslotIds+ '/getFrequency').then((res) => {
        this.loadings = false;
        let data=res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        } 
        let result = data.result;
        this.ips = result.ips;
        this.uids = result.uids;
      }, () => {this.loadings = false;});
    },
    delUidSource (index) {
      return this.$confirm('确定删除么？？？').then(() => {
        this.uids.splice(index, 1);
      }).catch(() => {});
    },
    delIpSource (index) {
      return this.$confirm('确定删除么？？？').then(() => {
        this.ips.splice(index, 1);
      }).catch(() => {});
    },
    amendUidSource (index, adSourceId, adAttrId, adTypeId, byHour, byDay, amendId) {
      this.freqVisible = true;
      this.sourceId = String(adSourceId);
      this.attrId = adAttrId;
      if (byHour === -1) {
        this.byHour = '';
      } else {
        this.byHour = byHour;
      }
      if (byDay === -1) {
        this.byDay = '';
      } else {
        this.byDay = byDay;
      }
      this.controlDis = true;
      this.itemIndex = index;
      this.amendId = amendId;
      this.typeId = adTypeId;
    },
    amendIpSource (index, adSourceId, adAttrId, adTypeId, reqHourThr, reqHourThu, reqDayThr, reqDayThu, amendId) {
      this.freqVisible = true;
      this.sourceId = String(adSourceId);
      this.attrId = adAttrId;
      if (reqHourThr === -1) {
        this.reqHourThr = '';
      } else {
        this.reqHourThr = reqHourThr;
      }
      if (reqHourThu === -1) {
        this.reqHourThu = '';
      } else {
        this.reqHourThu = reqHourThu;
      }
      if (reqDayThr === -1) {
        this.reqDayThr = '';
      } else {
        this.reqDayThr = reqDayThr;
      }
      if (reqDayThu === -1) {
        this.reqDayThu = '';
      } else {
        this.reqDayThu = reqDayThu;
      }
      this.controlDis = true;
      this.itemIndex = index;
      this.amendId = amendId;
      this.typeId = adTypeId;
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
    .el-dialog
      .dowm-forward
        margin-bottom: 15px
        position: relative
        .el-select
          display: block
      .differ-block
        .uid-wrapper
          width: 100%
          .el-input
            width: 95%
            margin-right: 5px
        .ip-wrapper
          width: 100%
          .el-input
            width: 38% 
            margin-right: 5px            
</style>
