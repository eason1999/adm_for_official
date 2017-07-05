<template>
  <div class="sdk-api-wrapper">
    <h2>SDK/API文档</h2>
    <el-table :data="tableData" stripe style="width: 100%" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
      <el-table-column prop="type" label="类型">
        <template scope="scope">
          <div :class="{'android-bg-img':scope.row.os==='ANDROID','ios-bg-img':scope.row.os==='IOS','api-bg-img':scope.row.os==='ANDROID/IOS','bg-img':true}"></div>
        </template>
      </el-table-column>
      <el-table-column prop="os" label="操作系统"></el-table-column>
      <el-table-column prop="version" label="软件版本"></el-table-column>
      <el-table-column prop="changeLog" label="更新日志" show-overflow-tooltip></el-table-column>
      <el-table-column prop="traceBlock.modifiedAt" label="提交日期" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button type="primary" size="small" @click="update(scope.row.type, scope.row.os, scope.row.version, scope.row.changeLog)">更新</el-button>
          <el-button type="primary" size="small" @click="download(scope.row.address)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script type="ecmascript-6">
import upload from '../../../components/upload/dragupload.vue';
export default {
  data () {
    return {
      tableData: [],
        loadings: false
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.load();
    });
  },
  components: { upload },
  methods: {
    update (type,os,version,changeLog) {
      this.$router.push({
        path: 'sdkapi/update',
        query: {
          type: type,
          os: os,
          version: version,
          changeLog: changeLog
        }
      });
    },
    load () {
      this.loadings = true;
      this.$http.get('/v1/adm/material/getMaterial').then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        this.tableData = data.result;
      }, () => {this.loadings = false;});
    },
    download (address) {
      window.location.href = address;
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .sdk-api-wrapper
    overflow: hidden
    .android-bg-img
      background: url('./img/android.jpg') no-repeat
    .ios-bg-img
      background: url('./img/ios.jpg') no-repeat 
    .api-bg-img
      background: url('./img/API.jpg') no-repeat 
    .bg-img
      height: 120px
      width: 90px
      margin: 5px 0
      background-size: 90px 120px
      border-radius: 4px
      border: 1px dotted #E2E4E8   
</style>
