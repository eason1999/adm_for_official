<template>
  <div class="adv-apps-wrapper">
    <h2>应用管理</h2>
    <div class="apps-top-wrapper clearfix">
      <div class="apps-search pull-right">
        <el-input placeholder="请输入内容" v-model="keyword"></el-input>
        <el-button type="primary">搜索</el-button>
      </div>
    </div>
    <div class="apps-data-table">
      <el-table :data="tableData" @cell-click="getslots" style="width: 100%" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
        <el-table-column type="expand">
          <template scope="props">
            <el-form label-position="left" inline class="demo-table-expand sub-app-form">
              <el-form-item label="操作系统:">
                <span>{{ props.row.platForm }}</span>
              </el-form-item>
              <el-form-item label="分成/固定单价:">
                <span>{{ props.row.appShareNum }}</span>
              </el-form-item>
              <el-form-item label="平台/外放:">
                <el-select @change="sendplatform(props.row.id, props.row.idBlongTo)" v-model="props.row.idBlongTo" placeholder="请选择" :disabled="props.row.verificationStatus==='APPROVED'">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="应用下载:">
                <el-button type="info" size="small" @click="handleEdit(scope.$index, scope.row)">下载</el-button>
              </el-form-item>
              <el-form-item label="审核状态:">
                <span>{{ props.row.verificationStatus | verStatus }}</span>
              </el-form-item>
              <el-form-item label="投放状态:">
                <span>{{ props.row.availabilityStatus | availStatus }}</span>
              </el-form-item>
              <el-form-item label="审核:">
                <el-button type="success" size="small" @click="approveApp(props.$index, props.row.id, 'APPROVED')" :disabled="props.row.verificationStatus==='APPROVED'">通过</el-button>
                <el-button type="danger" size="small" @click="approveApp(props.$index, props.row.id, 'DENIED')" :disabled="props.row.verificationStatus==='DENIED'">拒绝</el-button>
              </el-form-item>
              <el-form-item label="投放:">
                <el-switch v-model="props.row.availabilityStatus" on-color="#13ce66" off-color="#ff4949" on-value="ALLOWED" off-value="DISALLOWED" @change="sendAvail(props.row.id, props.row.availabilityStatus)"></el-switch>
              </el-form-item>
              <el-form-item label="操作:">
                <el-button type="info" size="small" @click="configs(props.row.devId, props.row.devName, props.row.id, props.row.appName, props.row.appShareNum, props.row.appShareType)">分成配置</el-button>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="提交时间" show-overflow-tooltip prop="createdAt"></el-table-column>
        <el-table-column label="公司名称" show-overflow-tooltip prop="company"></el-table-column>
        <el-table-column label="应用ID" show-overflow-tooltip prop="busId"></el-table-column>
        <el-table-column label="应用名称" show-overflow-tooltip prop="appName"></el-table-column>
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
        totalRecords: -1,
        pageNum: 1,
        pageSize: 20,
        options: [{
          value: 'selfuse',
          label: '平台'
        }, {
          value: 'otheruse',
          label: '外放'
        }],
        keyword: '',
        loadings: false,
        startDate: new Date(0).getTime(),
        endDate: new Date().getTime()
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
    },
    availStatus (val) {
      let item;
      switch (val) {
        case 'ALLOWED':
          item = '投放中';
          break;
        case 'DISALLOWED':
          item = '停止投放';
          break;    
      }
      return item;
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.load(1, 20);
    });
  },
  components: { pager },
  methods: {
    load (pageNum, pageSize) {
      this.loadings = true;
      let params = {};
      params.keyword = this.keyword;
      params.pageSize = pageSize || this.pageSize;
      params.pageNum = pageNum || this.pageNum;
      params.startDate = this.startDate;
      params.endDate = this.endDate;
      this.$http.get('/v1/adm/apps/{pageNum}/{pageSize}', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        let list = result.list;
        for (let i=0, l=list.length; i<l; i++) {
          if(list[i].idBlongTo === undefined){
            list[i].idBlongTo = 'selfuse';
          }
        }
        this.tableData = result.list;
        this.pageNum = result.pageNum;
        this.pageSize = result.pageSize;
        this.totalRecords = result.totalRecords;
      }, () => {this.loadings = false;});
    },
    approveApp (index, id, verificationStats) {
      let params = {};
      params.appId = id;
      params.verificationStats = verificationStats;
      this.loadings = true;
      this.$http.get('/v1/adm/apps/{appId}/verifications', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        this.tableData[index].verificationStatus = verificationStats;
      }, () => {this.loadings = false;});
    },
    sendAvail (id, availabilityStatus) {
      let params = {};
      params.appId = id;
      params.availabilityStatus = availabilityStatus;
      this.loadings = true;
      this.$http.get('/v1/adm/apps/{appId}/availabilities', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
      }, () => {this.loadings = false;});
    },
    handleDelete (index, row) {
      console.log(index, row);
    },
    configs (devId, devName, id, appName, divide, shareType) {
      this.$router.push({
        path: 'app/configur',
        query: {
          devId: devId,
          devName: devName,
          id: id,
          appName: appName,
          divide: divide,
          shareType: shareType
        }
      });
    },
    sendplatform (id, platform) {
      this.loadings = true;
      this.$http.post('/v1/adm/dev/'+id+'/'+platform+'/apps').then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
      }, () => {this.loadings = false;});
    },
    getslots (row, column, cell, event) {
      let item = cell.className.indexOf('el-table__expand-column');
      if (item === -1) {
        this.$router.push({
          path: 'app/slotlist',
          query: {
            appId: row.id,
            devId: row.devId
          }
        });
      }
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .adv-apps-wrapper
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
      .el-table__row
        cursor: pointer              
    .pager-wrapper
      margin-top: 15px      
</style>
