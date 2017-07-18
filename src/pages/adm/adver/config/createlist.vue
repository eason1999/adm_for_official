<template>
  <div class="adv-createlist-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="apps-data-table">
      <el-table :data="tableData" style="width: 100%" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
        <el-table-column type="expand">
          <template scope="props">
            <el-form label-position="left" inline class="demo-table-expand sub-app-form">
              <el-form-item label="预览:">
                <el-button type="info" size="small" @click="handleEdit(props.$index, props.row.meteriaUrl)">预览</el-button>
              </el-form-item>
              <el-form-item label="配置:">
                <el-button type="info" size="small" @click="handleEdit(props.$index, props.row.meteriaUrl)">定向配置</el-button>
              </el-form-item>
              <el-form-item label="审核状态:">
                <span>{{ props.row.verificationStatus | verstatus }}</span>
              </el-form-item>
              <el-form-item label="投放状态:">
                <span>{{ props.row.availabilityStatus | avastatus }}</span>
              </el-form-item>
              <el-form-item label="审核操作:">
                <template>
                  <el-button type="success" size="small" @click="handleEdit(props.$index, props.row)">通过</el-button>
                  <el-button type="danger" size="small" @click="handleEdit(props.$index, props.row)">拒绝</el-button>
                </template>
              </el-form-item>
              <el-form-item label="投放操作:">
                <template>
                  <el-switch v-model="value2" on-color="#13ce66" off-color="#ff4949"></el-switch>
                </template>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="提交时间" show-overflow-tooltip prop="createTime"></el-table-column>
        <el-table-column label="广告类型" show-overflow-tooltip prop="adTypeOnProduct"></el-table-column>
        <el-table-column label="创意ID" show-overflow-tooltip prop="id"></el-table-column>
        <el-table-column label="创意名称" show-overflow-tooltip prop="codeName"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script type="ecmascript-6">
import breadcrumb from '../../../../components/breadcrumb/breadcrumb.vue';
export default {
  data () {
    return {
      breadContent: [{ text: '广告管理', path: '/adm/adv/campaign'}, { text: '广告位管理'}],
      tableData: [],
      campaignId: this.$route.query.campaignId,
      advId: this.$route.query.advId,
      loadings: false
    };
  },
  filters: {
    verstatus (value) {
      let item;
      switch (value) {
        case 'DENIED':
          item = '审核拒绝';
          break;
        case 'PENGDING':
          item = '等待审核';
          break;
        case 'APPROVED':
          item = '审核通过';
          break;   
      }
      return item;
    },
    avastatus (value) {
      let item;
      switch (value) {
        case 'DISALLOWED':
          item = '停止投放';
          break;
        case 'VM_ALLOWED':
          item = '虚拟投放';
          break;
        case 'ALLOWED':
          item = '投放中';
          break; 
        default:
          item = '待投放';
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
      let params = {};
      params.campaignId = this.campaignId;
      params.advId = this.advId;
      this.loadings = true;
      this.$http.get('/v1/adm/campaigns/{campaignId}/creatives', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.tableData = result;
      }, () => {
        this.loadings = false;
      });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .adv-createlist-wrapper
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
