<template>
  <div class="add-hit-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="data-title-wrapper">
      <div class="dowm-forward">
        <span class="list-title">操作：</span>
        <div class="radio-wrapper">
          <el-radio-group v-model="oprations" @change="loadcompanys">
            <el-radio class="radio" v-model="oprations" label="0">命中</el-radio>
            <el-radio class="radio" v-model="oprations" label="1">退款</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="dowm-forward" v-if="datatype==='1'">
        <span class="list-title">公司名称：</span>
        <el-select @change="loadapps" v-model="devId" filterable placeholder="请选择" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
          <el-option
            v-for="item in devs"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </div> 
      <div v-if="oprations==='0'&&datatype==='1'">
        <div class="dowm-forward">
          <span class="list-title">应用名称：</span>
          <el-select @change="loadslots" v-model="appId" filterable placeholder="请选择">
            <el-option
              v-for="item in apps"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="dowm-forward">
          <span class="list-title">广告位名称：</span>
          <el-select v-model="slotId" filterable placeholder="请选择">
            <el-option
              v-for="item in slots"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="dowm-forward">
          <span class="list-title">广告源名称：</span>
          <el-select v-model="sourceId" filterable placeholder="请选择">
            <el-option
              v-for="item in sources"
              :key="item.channelCode"
              :label="item.channelName"
              :value="item.channelCode">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="dowm-forward">
        <span class="list-title">数据数量：</span>
        <div class="radio-wrapper">
          <el-radio-group v-model="datatype">
            <el-radio class="radio" v-model="datatype" label="1">单条数据</el-radio>
            <el-radio class="radio" v-model="datatype" label="2">批量数据</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div v-if="datatype==='1'">
        <div class="dowm-forward">
          <span class="list-title">日期：</span>
          <datepicker :datepickers="datepickers" :picker-options="pickerOptions"></datepicker>
        </div>
        <div class="dowm-forward">
          <span class="list-title">金额：</span>
          <el-input v-model="prices" placeholder="请输入内容"></el-input>
        </div>
        <el-button type="primary" @click="creates">新建</el-button>
        <el-button type="default" @click="back">取消</el-button>
      </div>
      <div class="dowm-forward" v-else>
        <span class="list-title">上传凭证：</span>
        <upload :go-paths="goPath" :paths="paths" :urls="this.oprations==='0' ? urls1 : urls2" :file-lists="fileList" :modeldatas="modeldatas"></upload>
      </div>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import apiUtil from '../../../../util/api.js';
import upload from '../../../../components/upload/dragupload.vue';
import breadcrumb from '../../../../components/breadcrumb/breadcrumb.vue';
import datepicker from '../../../../components/datepicker/datepicker.vue';
export default {
  data () {
    return {
      devId:'',
      devs: [],
      appId: '',
      apps: [],
      slotId: '',
      slots: [],
      sourceId: '',
      sources: [],
      prices: '',
      oprations: '0',
      datatype: '1',
      breadContent: [{ text: '命中/退款', path: '/adm/finance/hitback'}, { text: '新增数据'}],
      datepickers: {value: new Date(), align: 'left', type: 'date'},
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > new Date().getTime();
        },
        onPick (data) {
        }
      },
      goPath: true,
      paths: '/adm/finance/hitback',
      urls1: apiUtil.url('/v1/adm/dev/multfinance'),
      urls2: apiUtil.url('/v1/adm/adv/multfinance'),
      fileList: [],
      modeldatas: 'http://adroi.bj.bcebos.com/cdn/res/resource/temp/financeDataTemp.xls',
      loadings: false
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.loadcompanys();
      this.loadsources();
    });
  },
  components: { upload, breadcrumb, datepicker },
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
        this.devId = '';
        this.apps = [];
        this.appId = '',
        this.slots = [];
        this.slotId = '';
      }, () => {this.loadings = false;});
    },
    loadapps () {
      if (this.oprations==='1') {
        return false;
      }
      this.loadings = true;
      let params = {};
      params.devId = this.devId;
      this.$http.get('/v1/adm/names/apps', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.apps = result;
        this.appId = '',
        this.slots = [];
        this.slotId = '';
      }, () => {this.loadings = false;});
    },
    loadslots () {
      this.loadings = true;
      let params = {};
      params.devId = this.devId;
      if (this.appId) {
        params.appId = this.appId;
      } else {
        params.appId = -1;
      }
      this.$http.get('/v1/adm/names/apps/{appId}/adslots', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.slots = result;
        this.slotId = '';
      }, () => {this.loadings = false;});
    },
    loadsources () {
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
        this.sources = result;
        this.sourceId = '';
      }, () => {this.loadings = false;});
    },
    creates () {
      let params = {};
      params.amount = this.prices;
      params.fileUrl = '';
      params.optionDate = this.datepickers.value.getTime();
      this.loadings = true;
      if (this.oprations === '0') {
        params.devid = this.devId;
        params.optionType = 2;
        params.appId = this.appId;
        params.adSlotId = this.slotId;
        params.dspId = this.sourceId;
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
        params.advId = this.devId;
        params.optiontype = 2;
        this.$http.post('/v1/adm/adv/financeOption', params).then((res) => {
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
        path: '/adm/finance/hitback'
      });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .add-hit-wrapper
    .bread-title-wrapper
      margin-bottom: 15px
    .data-title-wrapper
      padding: 20px
      background: #fff
      border: 1px solid #eee
      .dowm-forward
        margin-bottom: 10px
        width: 260px
        .el-date-editor.el-input
          width: 100% 
        .el-select
            display: block 
        .radio-wrapper
          margin: 5px 0
          .radio
            color: #565656
            width: 80px
          .radio:first-child
            margin-right: 30px    
</style>
