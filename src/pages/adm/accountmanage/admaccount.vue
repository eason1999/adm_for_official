<template>
  <div class="adm-account-wrapper">
    <h2>管理员账户</h2>
    <div class="clearfix button-wrapper">
      <el-button type="primary" class="pull-left"><router-link to="admaccount/addmanage" class="search">新增</router-link></el-button>
    </div>
    <el-table :data="tableData" stripe style="width: 100%" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
      <el-table-column prop="userAccount" label="账号"></el-table-column>
      <el-table-column prop="userName" label="名称"></el-table-column>
      <el-table-column label="密码">
        <template scope="scope">
          <span>******</span>
        </template>
      </el-table-column>
      <el-table-column prop="roleName" label="角色"></el-table-column>
      <el-table-column prop="modifiedAt" label="提交日期" sortable show-overflow-tooltip></el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button type="info" size="small" @click="edit(scope.row.id,scope.row.userAccount,scope.row.passWord,scope.row.roleId,scope.row.userName)">编辑</el-button>
          <el-button type="danger" size="small" @click="deletes(scope.row.id)">删除</el-button>
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
  components: { pager },
  methods: {
    edit (id,useraccount,passwords,roleid,username) {
      this.$router.push({
        path: 'admaccount/addmanage',
        query: {
          id: id,
          roleid: String(roleid),
          passwords: passwords,
          username: username,
          useraccount: useraccount
        }
      });
    },
    deletes (id) {
      let deletesfun = () => {
        this.loadings = true;
        this.$http.delete('/v1/adm/authority/'+id+'/useraccount').then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        this.load(); 
        }, () => {this.loadings = false;});
      }
      return this.$confirm('确定删除么？？？').then(() => {
        deletesfun();
      }).catch(() => {});
    },
    load (pageNum, pageSize) {
      let params = {};
      params.pageIndex = pageNum || this.pageNum;
      params.pageSize = pageSize || this.pageSize;
      this.loadings = true;
      this.$http.get('/v1/adm/user/useraccount/{pageIndex}/{pageSize}/admAcc', {params: params}).then((res) => {
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
    .adm-account-wrapper
      .button-wrapper
        margin-bottom: 15px
        .search 
          color: #fff
      .el-table 
        margin-bottom: 15px
</style>
