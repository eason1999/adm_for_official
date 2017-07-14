<template>
  <div class="selfdefined-daterecord-wrapper">
    <h2>数据录入</h2>
    <div class="data-title-wrapper">
      <div class="dowm-forward">
        <span class="list-title">数据属性：</span>
        <div class="radio-wrapper">
          <el-radio-group v-model="dataType" @change="loadcompanys" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
            <el-radio class="radio" label="PLATFORM">平台</el-radio>
            <el-radio class="radio" label="EFFECT">效果</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="dowm-forward">
        <span class="list-title">数据分类：</span>
        <el-select v-model="dataId" filterable placeholder="请选择">
          <el-option
            v-for="item in datas"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="dowm-forward">
        <span class="list-title">文件上传：</span>
        <dragupload :otherdatas="updatas" :go-paths="goPath" :paths="paths" :urls="urls" :file-lists="fileList" :modeldatas="this.dataId === '0'? modeldatas1 : modeldatas2"></dragupload>
      </div>
      <el-button type="primary">预览报告</el-button>
      <el-button type="primary">确认提交</el-button>
    </div>
    <div class="data-table-wrapper">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="date" label="日期"  width="180"></el-table-column>
        <el-table-column prop="name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
      </el-table>
    </div>
    <div class="data-footer-wrapper clearfix">
      <el-button type="primary" class="pull-left">导出EXCEL</el-button>
      <div class="page-wrapper pull-right">
        <pager :total-records="totalRecords" :page-sizes="pageSize" :page-nums="pageNum"></pager>
      </div>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import apiUtil from '../../../util/api.js';
import pager from '../../../components/pager/pager.vue';
import dragupload from '../../../components/upload/dragupload.vue';
export default {
  data () {
    return {
      dataType: 'PLATFORM',
      datas: [{id: 0, text: '开发者'}, {id: 1, text: '广告主'}],
      dataId: '',
      items: [
        {icon: 'el-icon-star-on',num: 0,text: '展现数'},
        {icon: 'el-icon-message',num: 0,text: '点击数'},
        {icon: 'el-icon-share',num: 0,text: '点击率'},
        {icon: 'el-icon-menu',num: 0,text: '消费'}
      ],
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎1',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      totalRecords: 100,
      pageNum: 1,
      pageSize: 20,
      goPath: false,
      paths: '',
      updatas: {
        pageNum: 1,
        pageSize: 20
      },
      urls: apiUtil.url('/v1/adm/preview/advs/{pageNum}/{pageSize}'),
      fileList: [],
      modeldatas1: 'http://adroi.bj.bcebos.com/cdn/res/resource/temp/dev%E6%A8%A1%E6%9D%BF.zip',
      modeldatas2: 'http://adroi.bj.bcebos.com/cdn/res/resource/temp/adv%E6%A8%A1%E6%9D%BF.zip',
      loadings: false
    };
  },
  mounted () {
    
  },
  components: { pager, dragupload }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .selfdefined-daterecord-wrapper
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
        .el-select
          width: 100%
        .radio-wrapper
          margin: 5px 0
          .radio
            color: #565656
            width: 80px
          .radio:first-child
            margin-right: 30px    
    .data-table-wrapper
      margin-bottom: 20px     
</style>
