<template>
  <div class="sdk-api-wrapper">
    <h2>SDK/API文档</h2>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="type" label="类型">
        <template scope="scope">
          <div :class="{'android-bg-img':scope.row.type==='android','ios-bg-img':scope.row.type==='ios','api-bg-img':scope.row.type==='api','bg-img':true}"></div>
        </template>
      </el-table-column>
      <el-table-column prop="os" label="操作系统"></el-table-column>
      <el-table-column prop="name" label="软件版本"></el-table-column>
      <el-table-column prop="address" label="更新日志"></el-table-column>
      <el-table-column prop="date" label="提交日期"></el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button type="primary" size="small" @click="update(scope.$index,scope.row)">更新</el-button>
          <el-button type="primary" size="small">下载</el-button>
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
      tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          type: 'ios',
          os: 'IOS'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
          type: 'android',
          os: 'IOS'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          type: 'api',
          os: 'IOS'
        }]
    };
  },
  components: { upload },
  methods: {
    update (index,tableData) {
      console.log(tableData.type);
      this.$router.push({
        path: 'sdkapi/update'
      });
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
