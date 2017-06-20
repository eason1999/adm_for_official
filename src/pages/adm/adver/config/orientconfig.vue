<template>
  <div class="orient-config-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="data-title-wrapper">
      <div class="dowm-forward">
        <span class="list-title">账户名称：</span>
        <el-input disabled v-model="input" placeholder="请输入内容"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">计划ID：</span>
        <el-input disabled v-model="input" placeholder="请输入内容"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">计划名称：</span>
        <el-input disabled v-model="input" placeholder="请输入内容"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">创意ID：</span>
        <el-input disabled v-model="input" placeholder="请输入内容"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">创意名称：</span>
        <el-input disabled v-model="input" placeholder="请输入内容"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">广告类型：</span>
        <el-input disabled v-model="input" placeholder="请输入内容"></el-input>
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
        <transfer :cities="medias" :transfer-title="mediaTitle"></transfer>
      </div>
      <div class="media-transfer-wrapper" v-if="orientMedia==='3'">
        <transfer :cities="slotes" :transfer-title="sloteTitle"></transfer>
      </div>
      <div class="dowm-forward media-forward">
        <span class="list-title">定向用户：</span>
        <div class="radio-wrapper">
          <el-radio class="radio" v-model="orientUser" label="1">全部用户</el-radio>
          <el-radio class="radio" v-model="orientUser" label="2">指定用户</el-radio>
        </div>
        <upload v-if="orientUser==='2'"></upload>
      </div>
      <el-button type="primary">保存</el-button>
      <el-button type="default">取消</el-button>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import upload from '../../../../components/upload/dragupload.vue';
import breadcrumb from '../../../../components/breadcrumb/breadcrumb.vue';
import transfer from '../../../../components/transfer/transfer.vue';
export default {
  data () {
    return {
      input: '测试',
      orientUser: '1',
      orientMedia: '1',
      breadContent: [{ text: '广告管理', path: '/adm/adv/campaign'}, { text: '定向配置'}],
      datepickers: {value:'', align: 'left', type: 'daterange'},
      pickerOptions: {},
      medias: [{label: '上海1', key: 10001, city: '上海'}, {label: '北京', key: 10002, city: '北京'}, {label: '广州', key: 10003, city: '广州'}, {label: '深圳', key: 10004, city: '深圳'}, {label: '南京', key: 10005, city: '南京'}, {label: '西安', key: 10006, city: '西安'}, {label: '成都', key: 10007, city: '成都'}],
      mediaTitle: '媒体',
      slotes: [{label: '上海2', key: 10001, city: '上海'}, {label: '北京', key: 10002, city: '北京'}, {label: '广州', key: 10003, city: '广州'}, {label: '深圳', key: 10004, city: '深圳'}, {label: '南京', key: 10005, city: '南京'}, {label: '西安', key: 10006, city: '西安'}, {label: '成都', key: 10007, city: '成都'}],
      sloteTitle: '广告位'
    };
  },
  mounted () {
    
  },
  components: { upload, breadcrumb, transfer }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .orient-config-wrapper
    .bread-title-wrapper
      margin-bottom: 15px
    .data-title-wrapper
      margin-bottom: 15px
      padding: 20px
      background: #fff
      border: 1px solid #eee
      .dowm-forward
        margin-bottom: 10px
        width: 300px 
        .radio-wrapper
          margin: 5px 0
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
