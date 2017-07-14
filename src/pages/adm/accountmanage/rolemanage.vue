<template>
  <div class="role-manage-wrapper">
    <h2>账户权限</h2>
    <div class="clearfix button-wrapper">
      <el-button type="primary" class="pull-left"><router-link to="rolemanage/roledit" class="search">新增</router-link></el-button>
      <div class="role-search pull-right">
        <el-input placeholder="请输入内容" v-model="keyword"></el-input>
        <el-button type="primary" @click="load()">搜索</el-button>
      </div>
    </div>
    <el-table :data="tableData" stripe style="width: 100%" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
      <el-table-column prop="name" label="角色"></el-table-column>
      <el-table-column prop="createdAt" label="提交日期" sortable></el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button type="info" size="small" @click="edit(scope.row.autoId,scope.row.name)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="clearfix" v-if="tableData.length">
      <el-button type="primary" class="pull-left">导出EXCEL</el-button>
      <pager class="pull-right" :total-records="totalRecords" @pagechange="load" :page-sizes="pageSize" :page-nums="pageNum"></pager>
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
      loadings: false,
      totalRecords: -1,
      pageNum: 1,
      pageSize: 20
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.load();
    });
  },
  components: { pager },
  methods: {
    edit (id, name) {
      this.$router.push({
        path: 'rolemanage/roledit',
        query: {
          id: id,
          name: name
        }
      });
    },
    load (pageNum, pageSize) {
      let params = {};
      params.keyWord = this.keyword;
      params.pageIndex = pageNum || this.pageNum;
      params.pageSize = pageSize || this.pageSize;
      this.loadings = true;
      this.$http.get('/v1/adm/auth/{pageIndex}/{pageSize}/roles', {params: params}).then((res) => {
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
    .role-manage-wrapper
      .button-wrapper
        margin-bottom: 15px
        .search 
          color: #fff
        .role-search
          max-width: 300px
          font-size: 0
          .el-input
            width: 230px
            input
              border-radius: 4px 0 0 4px
          button 
            border-radius: 0 4px 4px 0  
      .el-table 
        margin-bottom: 15px
</style>
