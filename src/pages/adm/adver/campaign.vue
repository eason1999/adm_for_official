<template>
  <div class="adv-campaign-wrapper">
    <h2>广告管理</h2>
    <div class="campaign-top-wrapper clearfix">
      <div class="campaign-search pull-right">
        <el-input placeholder="请输入内容" v-model="keyword" @keyup.native.enter="load()"></el-input>
        <el-button type="primary" @click="load()">搜索</el-button>
      </div>
    </div>
    <div class="apps-data-table">
      <el-table :data="tableData" @cell-click="getdetail" style="width: 100%" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
        <el-table-column type="expand">
          <template scope="scope">
            <el-form label-position="left" inline class="demo-table-expand sub-app-form">
              <el-form-item label="预算(￥)：">
                <span>{{ scope.row.budgetAmountTotal }}</span>
              </el-form-item>
              <el-form-item label="每日预算(￥)：">
                <span>{{ scope.row.budgetAmountDaily }}</span>
              </el-form-item>
              <el-form-item label="单价(￥)：">
                <span>{{ scope.row.bidPrice }}</span>
              </el-form-item>
              <el-form-item label="投放状态：">
                <span>{{ scope.row.availabilityStatus | avastatus }}</span>
              </el-form-item>
              <el-form-item label="审核状态：">
                <span>{{ scope.row.verificationStatus | verstatus }}</span>
              </el-form-item>
              <el-form-item label="投放操作：">
                <template>
                  <el-switch v-model="scope.row.availabilityStatus" on-color="#13ce66" off-color="#ff4949" on-value="ALLOWED" off-value="DISALLOWED" @change="sendAvail(scope.row.advId, scope.row.id, scope.row.availabilityStatus)"></el-switch>
                </template>
              </el-form-item>
              <el-form-item label="审核操作：">
                <template>
                  <el-button :disabled="scope.row.verificationStatus === 'CREATING'||scope.row.verificationStatus === 'APPROVED'" type="success" size="small" @click="audits(scope.$index, scope.row.id, 'APPROVED', scope.row.advId)">通过</el-button>
                  <el-button :disabled="scope.row.verificationStatus === 'CREATING'||scope.row.verificationStatus === 'DENIED'" type="danger" size="small" @click="audits(scope.$index, scope.row.id, 'DENIED', scope.row.advId)">拒绝</el-button>
                </template>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="计划投放时间" show-overflow-tooltip sortable>
          <template scope="scope">
            <span>{{scope.row.startDate | date }}</span> 
          </template>
        </el-table-column>
        <el-table-column label="公司名称" show-overflow-tooltip prop="company"></el-table-column>
        <el-table-column label="计划名称/ID" show-overflow-tooltip>
          <template scope="scope">
            <div>{{scope.row.name }}</div> 
            <div>ID: {{scope.row.id }}</div>
          </template> 
        </el-table-column>
        <el-table-column label="审核状态" show-overflow-tooltip> 
          <template scope="scope">
            <span>{{ scope.row.verificationStatus | verstatus }}</span>
          </template>
        </el-table-column>
        <el-table-column label="投放状态" show-overflow-tooltip> 
          <template scope="scope">
            <span>{{ scope.row.availabilityStatus | avastatus }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pager-wrapper clearfix">
      <pager :total-records="totalRecords" @pagechange="load" :page-sizes="pageSize" :page-nums="pageNum"></pager>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import pager from '../../../components/pager/pager.vue';
export default {
  data () {
    return {
      tableData: [],
      keyword: '',
      totalRecords: -1,
      pageNum: 1,
      pageSize: 20,
      value2: true,
      loadings: false
    };
  },
  filters: {
    verstatus (value) {
      let item;
      switch (value) {
        case 'CREATING':
          item = '创建中';
          break;
        case 'PENGDING':
          item = '等待审核';
          break;
        case 'APPROVED':
          item = '审核通过';
          break; 
        default:
          item = '审核拒绝';
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
  components: { pager },
  methods: {
    load (pageNum, pageSize) {
      let params = {};
      params.keyword = this.keyword;
      params.pageSize = pageSize || this.pageSize;
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
    getdetail (row, column, cell, event) {
      let item = cell.className.indexOf('el-table__expand-column');
      if (item === -1) {
        this.$router.push({
          path: 'campaign/createlist',
          query: {
            campaignId: row.id,
            advId: row.advId,
            advName: row.advName,
            name: row.name
          }
        });
      }
    },
    sendAvail (advId, id, availabilityStatus) {
      let params = {};
      params.advId = advId;
      if (availabilityStatus === 'ALLOWED') {
        params.availabilityStatus = 'DISALLOWED';
      } else {
        params.availabilityStatus = 'ALLOWED';
      }
      this.loadings = true;
      this.$http.put('/v1/adm/campaigns/'+id+'/availabilities', params).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
      }, () => {this.loadings = false;});
    },
    audits (index, campaignId, verificationStatus, advId) {
      if (verificationStatus === 'APPROVED') {
        return this.$confirm('确定审核通过吗？？？').then(() => {
          this.handleEdit(index, campaignId, verificationStatus, advId);
        }).catch(() => {});
      } else {
        return this.$confirm('确定审核拒绝吗？？？').then(() => {
          this.handleEdit(index, campaignId, verificationStatus, advId);
        }).catch(() => {});
      }
    },
    handleEdit (index, campaignId, verificationStatus, advId) {
      let params = {};
      params.verificationStatus = verificationStatus;
      params.advId = advId;
      this.loadings = true;
      this.$http.put("/v1/adm/campaigns/"+campaignId+"/verifications", params).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret != 1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        this.tableData[index].verificationStatus = verificationStatus;

      }, () => {this.loadings = false;});
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
    .el-tooltip
      color: #7e8c8d   
      cursor: pointer    
</style>
