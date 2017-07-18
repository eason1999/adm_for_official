<template>
  <div class="adv-slotlist-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="apps-data-table">
      <el-table :data="tableData" style="width: 100%" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
        <el-table-column type="expand">
          <template scope="props">
            <el-form label-position="left" inline class="demo-table-expand sub-app-form">
              <el-form-item label="广告类型:">
                <span>{{ props.row.type }}</span>
              </el-form-item>
              <el-form-item label="广告位ID:">
                <span>{{ props.row.busId }}</span>
              </el-form-item>
              <el-form-item label="广告位名称:">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="分成/固定单价:">
                <span>{{ props.row.slotShareNum }}</span>
              </el-form-item>
              <el-form-item label="操作:">
                <span :class="{ 'el-icon-circle-cross': props.row.configuredResource === false, 'el-icon-circle-check': props.row.configuredResource === true }"></span>
                <el-button type="info" size="small" @click="APIconfigs()">配置广告源API</el-button>
                <el-button type="info" size="small" @click="timeConfigs()">频次控制</el-button>
                <el-button type="info" size="small" @click="divideConfigs()">分成配置</el-button>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="广告类型" show-overflow-tooltip prop="type"></el-table-column>
        <el-table-column label="广告位ID" show-overflow-tooltip prop="busId"></el-table-column>
        <el-table-column label="广告位名称" show-overflow-tooltip prop="name"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script type="ecmascript-6">
import breadcrumb from '../../../../components/breadcrumb/breadcrumb.vue';
export default {
  data () {
    return {
      breadContent: [{ text: '应用管理', path: '/adm/dev/app'}, { text: '广告位管理'}],
      tableData: [],
      appId: this.$route.query.appId,
      devId: this.$route.query.devId,
      verificationStatus: this.$route.query.verificationStatus,
      loadings: false
    };
  },
  filters: {
    verStatus (val) {
      let item;
      switch (val) {
        case 'DENIED':
          item = '审核拒绝';
          break;
        case 'PENGDING':
          item = '待审核';
          break;
        case 'APPROVED':
          item = '审核通过';
          break;    
      }
      return item;
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.load();
    });
  },
  components: { breadcrumb },
  methods: {
    load () {
      this.loadings = true;
      let params = {};
      params.appId = this.appId;
      params.devId = this.devId;
      this.$http.get('/v1/adm/dev/apps/{devId}/{appId}/adslots', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.tableData = result;
      }, () => {this.loadings = false;});
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .adv-slotlist-wrapper
    overflow: hidden
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
</style>
