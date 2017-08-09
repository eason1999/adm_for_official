<template>
  <div class="selfdefined-daterecord-wrapper">
    <h2>数据录入</h2>
    <div class="data-title-wrapper">
      <div class="dowm-forward">
        <span class="list-title">数据属性：</span>
        <div class="radio-wrapper">
          <el-radio-group v-model="dataType" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
            <el-radio class="radio" label="PLATFORM">平台</el-radio>
            <el-radio class="radio" label="EFFECT">效果</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="dowm-forward">
        <span class="list-title">数据分类：</span>
        <div class="radio-wrapper">
          <el-radio-group v-model="dataClassify">
            <el-radio class="radio" label="adv">广告主</el-radio>
            <el-radio class="radio" label="dev">开发者</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="dowm-forward">
        <span class="list-title">文件上传：</span>
        <el-upload
          class="upload-wrapper"
          drag
          ref="upload"
          :data="updatas"
          accept=".xls,.xlsx"
          :disabled="this.item!=''||this.fileList.length===1"
          :action="urls"
          :multiple="false"
          :file-list="fileList"
          :on-remove="remove"
          :on-success="success"
          :on-error="error"
          :on-change="change"
          :on-progress="progress"
          :auto-upload="false">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">
            只能上传*.xls/*.xlsx文件  
            <a :href="dataClassify === 'dev' ? modeldatas1 : modeldatas2" class="upload-model">*模板文件</a>
          </div>
        </el-upload>
      </div>
      <el-button type="primary" @click="previews">预览报告</el-button>
      <el-button type="primary" @click="submits">确认提交</el-button>
    </div>
    <div class="data-table-wrapper" v-if="tableData.length">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column label="日期">
          <template scope="scope">
            <span>{{scope.row.date | date}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="company" label="公司名称"></el-table-column>
        <el-table-column prop="campaignName" label="计划名称"></el-table-column>
        <el-table-column prop="appName" label="应用名称"></el-table-column>
        <el-table-column prop="creativeName" label="创意名称"></el-table-column>
        <el-table-column prop="adslotName" label="广告位名称"></el-table-column>
        <el-table-column prop="numOfImpressions" label="展现数"></el-table-column>
        <el-table-column prop="numOfClicks" label="点击数"></el-table-column>
        <el-table-column prop="ctr" label="点击率"></el-table-column>
        <el-table-column prop="downloads" label="下载数"></el-table-column>
        <el-table-column prop="activations" label="激活数"></el-table-column>
        <el-table-column label="eCPM">
          <template scope="scope">
            <span>{{scope.row.ecpm | currency '￥'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="金额">
          <template scope="scope">
            <span>{{scope.row.consum | currency '￥'}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <div class="data-footer-wrapper clearfix">
      <div class="page-wrapper pull-right">
        <pager :total-records="totalRecords" :page-sizes="pageSize" :page-nums="pageNum"></pager>
      </div>
    </div> -->
  </div>
</template>

<script type="ecmascript-6">
import apiUtil from '../../../util/api.js';
// import pager from '../../../components/pager/pager.vue';
export default {
  data () {
    return {
      dataType: 'PLATFORM',
      dataClassify: 'adv',
      tableData: [],
      totalRecords: 100,
      pageNum: 1,
      pageSize: 20,
      urls: '',
      distinct: -1,
      updatas: {},
      fileList: [],
      item: '',
      modeldatas1: 'http://adroi.bj.bcebos.com/cdn/res/resource/temp/dev%E6%A8%A1%E6%9D%BF.zip',
      modeldatas2: 'http://adroi.bj.bcebos.com/cdn/res/resource/temp/adv%E6%A8%A1%E6%9D%BF.zip',
      loadings: false,
      fileitem: -1
    };
  },
  mounted () {
    
  },
  // components: { pager },
  methods: {
    submits () {
      if (this.fileitem !== 0) {
        return this.$alert('请先上传相关文件！！！', '提示：', {
          confirmButtonText: '确定'
        });
      }
      this.distinct = 0;
      this.urls = apiUtil.url('/v1/adm/data/devMaterials');
      this.updatas = {
        dataType: this.dataType
      };
      this.$nextTick(() => {
        this.$refs.upload.submit();
      });
    },
    previews () {
      if (this.fileitem !== 0) {
        return this.$alert('请先上传相关文件！！！', '提示：', {
          confirmButtonText: '确定'
        });
      }
      this.distinct = 1;
      this.urls = apiUtil.url('/v1/adm/preview/data');
      this.updatas = {
        pageNum: 1,
        pageSize: 10000,
        dataType: this.dataClassify
      };
      this.$nextTick(() => {
        this.$refs.upload.submit();
      });
    },
    remove (file, fileList) {
      this.item='';
      this.fileList = fileList;
    },
    success (data) {
      this.loadings = false;
      if (data.ret!=1) {
        return this.$alert(data.message, '提示：', {
          confirmButtonText: '确定'
        });
      }
      if (this.distinct === 0) {
        this.fileList = [];
        this.item = '';
        this.tableData = [];
      } else if (this.distinct === 1) {
        this.fileList = [];
        this.item = '';
        this.tableData = data.result.list;
      }
    },
    error (data) {
      return this.$alert(data.result, '提示：', {
        confirmButtonText: '确定'
      });
    },
    progress () {
      this.loadings = true;
    },
    change (data) {
      this.fileitem = data.percentage;
      console.log(data);
    }
  }
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
