<template>
  <div class="adv-campaign-wrapper">
    <h2>计划</h2>
    <div class="campaign-top-wrapper clearfix">
      <div class="campaign-search pull-right">
        <el-input placeholder="请输入内容" v-model="keyword"></el-input>
        <el-button type="primary">搜索</el-button>
      </div>
    </div>
    <div class="apps-data-table">
      <el-table @expand="getDetail" :data="tableData" style="width: 100%" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
        <el-table-column type="expand">
          <template scope="scope">
            <el-form v-for="item in scope.row.expandData" label-position="left" inline class="demo-table-expand sub-app-form">
              <el-form-item label="提交时间:">
                <span>{{ item.createTime }}</span>
              </el-form-item>
              <el-form-item label="广告类型:">
                <span>{{ item.adTypeOnProduct }}</span>
              </el-form-item>
              <el-form-item label="创意ID:">
                <span>{{ item.id }}</span>
              </el-form-item>
              <el-form-item label="创意名称:" title="创意名称">
                <span>{{ item.codeName }}</span>
              </el-form-item>
              <el-form-item label="预览:">
                <template scope="scope">
                  <el-button type="info" size="small" @click="previewImg(scope.$index, props)">预览</el-button>
                </template>
              </el-form-item>
              <el-form-item label="配置:">
                <template scope="scope">
                  <el-button type="info" size="small" @click="config(scope.$index, scope.row)">定向配置</el-button>
                </template>
              </el-form-item>
              <el-form-item label="投放状态:" title="投放状态">
                <span>{{ item.availabilityStatus }}</span>
              </el-form-item>
              <el-form-item label="审核状态:" title="审核状态">
                <span>{{ item.verificationStatus }}</span>
              </el-form-item>
              <el-form-item label="操作:">
                <template scope="scope">
                  <el-switch v-model="value2" on-color="#13ce66" off-color="#ff4949"></el-switch>
                </template>
              </el-form-item>
              <el-form-item label="审核:">
                <template scope="scope">
                  <el-button type="success" size="small" @click="handleEdit(scope.$index, scope.row)">通过</el-button>
                  <el-button type="danger" size="small" @click="handleEdit(scope.$index, scope.row)">拒绝</el-button>
                </template>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="计划投放时间" show-overflow-tooltip prop="startDate"></el-table-column>
        <el-table-column label="公司名称" show-overflow-tooltip sortable prop="company"></el-table-column>
        <el-table-column label="计划ID" show-overflow-tooltip prop="id"></el-table-column>
        <el-table-column label="计划名称" show-overflow-tooltip prop="name"></el-table-column>
        <el-table-column label="预算(￥)" show-overflow-tooltip sortable prop="budgetAmountTotal"></el-table-column>
        <el-table-column label="每日预算(￥)" show-overflow-tooltip sortable prop="budgetAmountDaily"></el-table-column>
        <el-table-column label="单价(￥)" show-overflow-tooltip sortable prop="bidPrice"></el-table-column>
        <el-table-column label="审核状态" show-overflow-tooltip prop="verificationStatus"></el-table-column>
        <el-table-column label="投放状态" show-overflow-tooltip prop="availabilityStatus"></el-table-column>
        <el-table-column label="审核">
          <template scope="scope">
            <el-button type="success" size="small" @click="handleEdit(scope.$index, scope.row)">通过</el-button>
            <el-button type="danger" size="small" @click="handleEdit(scope.$index, scope.row)">拒绝</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-switch v-model="value2" on-color="#13ce66" off-color="#ff4949"></el-switch>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pager-wrapper clearfix">
      <pager :total-records="totalRecords" :page-sizes="pageSize" :page-nums="pageNum"></pager>
    </div>
    <el-dialog v-model="dialogVisible" size="tiny">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script type="ecmascript-6">
import pager from '../../../components/pager/pager.vue';
export default {
  data () {
    return {
      tableData: [],
      keyword: '',
      totalRecords: 100,
      pageNum: 1,
      pageSize: 10,
      value2: true,
      totalRecords: 100,
      pageNum: 1,
      pageSize: 10,
      dialogVisible: false,
      dialogImageUrl: '',
      loadings: false
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.load(1);
    });
  },
  components: { pager },
  methods: {
    previewImg (index, data) {
      console.log(index)
      console.log(data)
      this.dialogVisible = true;
      this.dialogImageUrl = '';
    },
    config () {
      this.$router.push({ path: 'data/config', query: { plan: '123' }});
    },
    load (pageNum) {
      let params = {};
      params.keyword = this.keyword;
      params.pageSize = this.pageSize;
      params.pageNum = pageNum || this.pageNum;
      params.startDate = 12343354;
      params.endDate = 45345355;
      this.loadings = true;
      this.$http.get('/v1/adm/campaigns/{pageNum}/{pageSize}', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.pageNum = result.pageNum;        
        this.pageSize = result.pageSize;
        this.totalRecords = result.totalRecords;
        this.tableData = result.results;
        for (let i=0;i<this.tableData.length;i++) {
          this.tableData[i].expandData = [];
        }
      }, () => {
        this.loadings = false;
      });
    },
    getDetail (row,expanded) {
      console.log(row)
      if (expanded) {
        let params = {};
        params.campaignId = row.id;
        params.advId = row.advId;
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
          for (let i=0;i<this.tableData.length;i++) {
            if (row.id === this.tableData[i].id) {
              this.tableData[i].expandData = result;
            }
          }
        }, () => {
          this.loadings = false;
        });
      }
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .adv-campaign-wrapper
    overflow: hidden
    .campaign-top-wrapper
      margin-bottom: 15px
      .campaign-search
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
      .el-select
        width: 90px
        .el-input__inner
          height: 28px
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
    .pager-wrapper
      margin-top: 15px      
</style>
