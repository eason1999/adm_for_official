<template>
  <div class="add-hit-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="data-title-wrapper">
      <div class="dowm-forward">
        <span class="list-title">操作：</span>
        <div class="radio-wrapper">
          <el-radio class="radio" v-model="oprations" label="SUB">命中</el-radio>
          <el-radio class="radio" v-model="oprations" label="ADD">激励</el-radio>
        </div>
      </div>
      <div class="dowm-forward">
        <span class="list-title">数据数量：</span>
        <div class="radio-wrapper">
          <el-radio class="radio" v-model="datatype" label="0">单条数据</el-radio>
          <el-radio class="radio" v-model="datatype" label="1">批量数据</el-radio>
        </div>
      </div>
      <div v-if="datatype === '0'">
        <div class="dowm-forward">
          <span class="list-title">广告源名称：</span>
          <el-select v-model="sourceId" filterable placeholder="请选择" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
            <el-option
              v-for="item in sources"
              :key="item.channelCode"
              :label="item.channelName"
              :value="item.channelCode">
            </el-option>
          </el-select>
        </div>
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
        <dragupload :otherdatas="this.oprations === 'SUB' ? updatas1 : updatas2" :go-paths="goPath" :paths="paths" :urls="urls" :file-lists="fileList" :modeldatas="this.oprations === 'SUB' ? modeldatas1 : modeldatas2"></dragupload>
      </div>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import apiUtil from '../../../../util/api.js';
import dragupload from '../../../../components/upload/dragupload.vue';
import breadcrumb from '../../../../components/breadcrumb/breadcrumb.vue';
import datepicker from '../../../../components/datepicker/datepicker.vue';
export default {
  data () {
    return {
      prices: '',
      oprations: 'SUB',
      datatype: '0',
      sources: [],
      sourceId: '',
      breadContent: [{ text: '广告源财务信息', path: '/adm/finance/slote'}, { text: '命中/激励'}],
      datepickers: {value: new Date(), align: 'right', type: 'month'},
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > new Date().getTime();
        },
        onPick (data) {
        }
      },
      goPath: true,
      paths: '/adm/finance/slote',
      urls: apiUtil.url('/v1/adm/source/finance/sourceMaterials'),
      fileList: [],
      updatas1: {
        type: 'SUB'
      },
      updatas2: {
        type: 'ADD'
      },
      modeldatas1: 'http://adroi.bj.bcebos.com/cdn/res/resource/temp/%E5%91%BD%E4%B8%AD.zip',
      modeldatas2: 'http://adroi.bj.bcebos.com/cdn/res/resource/temp/%E6%BF%80%E5%8A%B1.zip',
      loadings: false
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.allsources();
    });
  },
  components: { dragupload, breadcrumb, datepicker },
  methods: {
    allsources () {
      this.loadings = true;
      this.$http.get("/v1/dict/types/adSource").then((res) => {
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
      let params = {};
      params.monthDate = this.datepickers.value.getTime();
      params.channelCode = this.sourceId;
      params.money = this.prices;
      params.type= this.oprations;
      this.loadings = true;
      this.$http.post('/v1/adm/source/finance/one', params).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        this.back();
      }, () => {this.loadings = false;});
    },
    back () {
      this.$router.push({
        path: '/adm/finance/slote'
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
        width: 300px
        .el-date-editor.el-input
          width: 100% 
        .el-select
          display: block
        .el-input
          display: block  
          width: 100% 
        .radio-wrapper
          margin: 5px 0
          .radio
            color: #565656
            width: 80px
          .radio:first-child
            margin-right: 30px    
</style>
