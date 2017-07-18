<template>
  <div class="adv-account-wrapper">
    <h2>广告主账户</h2>
    <el-table :data="tableData" stripe style="width: 100%" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
      <el-table-column prop="userCompany" label="公司名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="userName" label="账号" show-overflow-tooltip></el-table-column>
      <el-table-column label="密码">
        <template scope="scope">
          <span>******</span>
        </template>
      </el-table-column>
      <el-table-column prop="roleName" label="角色"></el-table-column>
      <el-table-column prop="managerName" label="管理员"></el-table-column>
      <el-table-column prop="verificationStatus" label="审核状态">
        <template scope="scope">
          <span>{{ scope.row.verificationStatus | status }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="modifiedAt" label="提交日期" sortable show-overflow-tooltip></el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button :disabled="scope.row.verificationStatus==='APPROVED'" type="info" size="small" @click="audit(scope.row.id,scope.row.managerId,scope.row.roleId,scope.row.userCompany,scope.row.userName)">审核</el-button>
          <el-button type="info" size="small" @click="config(scope.row.id,scope.row.managerId,scope.row.roleId,scope.row.userCompany,scope.row.userName)">配置</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pager v-if="tableData.length" :total-records="totalRecords" @pagechange="load" :page-sizes="pageSize" :page-nums="pageNum"></pager>
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
      loadings: false
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.load();
    });
  },
  filters: {
    status (value) {
      let item;
      if (value==='APPROVED') {
        item = '通过';
      } else {
        item = '未审核';
      }
      return item;
    }
  },
  components: { pager },
  methods: {
    config (id,managerid,roleid,usercompany,username) {
      this.$router.push({
        path: 'advaccount/config',
        query: {
          id: id,
          roleid: String(roleid),
          username: username,
          managerid: String(managerid),
          usercompany: usercompany
        }
      });
    },
    load (pageNum, pageSize) {
      let params = {};
      params.pageIndex = pageNum || this.pageNum;
      params.pageSize = pageSize || this.pageSize;
      this.loadings = true;
      this.$http.get('/v1/adm/user/useraccount/{pageIndex}/{pageSize}/advAcc', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        } 
        let result = data.result;
        this.tableData = result.results;
        this.totalRecords = result.totalRecords;
        this.pageSize = result.pageSize;
      }, () => {this.loadings = false;});
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .adv-account-wrapper
      .el-table 
        margin-bottom: 15px
</style>
