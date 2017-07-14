<template>
  <div class="shield-search-wrapper">
    <h2>黑名单查询</h2>
    <div class="shield-title-wrapper">
      <div class="create-select dowm-forward">
        <span class="list-title">开发者名称：</span>
        <el-select @change="loadapps" v-model="devId" filterable placeholder="请选择" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
          <el-option
            v-for="item in devs"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="plan-select dowm-forward">
        <span class="list-title">应用名称：</span>
        <el-select @change="loadslots" v-model="appId" filterable placeholder="请选择">
          <el-option
            v-for="item in apps"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="plan-select dowm-forward">
        <span class="list-title">广告位名称：</span>
        <el-select v-model="slotId" filterable placeholder="请选择">
          <el-option
            v-for="item in slots"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="plan-select dowm-forward">
        <span class="list-title">黑名单类型：</span>
        <el-select v-model="typeId" filterable placeholder="请选择">
          <el-option
            v-for="item in types"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="plan-select dowm-forward">
        <span class="list-title">黑名单内容：</span>
        <el-input v-model="contents" placeholder="请输入内容"></el-input>
      </div>
      <el-button type="primary" @click="load()">查询</el-button>
    </div>
    <div class="shield-table-wrapper">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="keyWords" label="黑名单内容" show-overflow-tooltip></el-table-column>
        <el-table-column prop="slotName" label="广告位名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="appName" label="所属应用" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createdAt" label="创建时间" sortable show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <div class="shield-footer-wrapper clearfix" v-if="tableData.length">
      <el-button type="primary" class="pull-left">导出EXCEL</el-button>
      <div class="page-wrapper pull-right">
        <pager :total-records="totalRecords" @pagechange="load" :page-sizes="pageSize" :page-nums="pageNum"></pager>
      </div>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import selects from '../../../components/selects/select.vue';
import pager from '../../../components/pager/pager.vue';
export default {
  data () {
    return {
      devId:'',
      devs: [],
      appId: '',
      apps: [],
      slotId: '',
      slots: [],
      typeId: '',
      types: [{id: 1, text: "IMEI/IDFA"},{id: 2, text: "IP"}],
      loadings: false,
      contents: '',
      tableData: [],
      totalRecords: -1,
      pageNum: 1,
      pageSize: 20
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.loadcompanys();
    });
  },
  components: { selects, pager },
  methods: {
    loadcompanys () {
      this.loadings = true;
      this.$http.get('/v1/adm/company/devs').then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.devs = result;
        this.devId = '';
        this.apps = [];
        this.appId = '',
        this.slots = [];
        this.slotId = '';
      }, () => {this.loadings = false;});
    },
    loadapps () {
      if (this.oprations==='1') {
        return false;
      }
      this.loadings = true;
      let params = {};
      params.devId = this.devId;
      this.$http.get('/v1/adm/names/apps', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.apps = result;
        this.appId = '',
        this.slots = [];
        this.slotId = '';
      }, () => {this.loadings = false;});
    },
    loadslots () {
      this.loadings = true;
      let params = {};
      params.devId = this.devId;
      if (this.appId) {
        params.appId = this.appId;
      } else {
        params.appId = -1;
      }
      this.$http.get('/v1/adm/names/apps/{appId}/adslots', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.slots = result;
        this.slotId = '';
      }, () => {this.loadings = false;});
    },
    load (pageNum, pageSize) {
      let params = {};
      params.slotId = this.slotId;
      params.appId = this.appId;
      params.developerId = this.devId;
      params.keyWords = this.contents;
      params.type = this.typeId;
      params.pageNum = pageNum || this.pageNum;
      params.pageSize = pageSize || this.pageSize;
      this.loadings = true;
      this.$http.post('/black/show/'+params.pageNum+'/'+params.pageSize, params).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }  
        let result = data.result;
        this.pageSize = result.pageSize;
        this.totalRecords = result.total;
        this.tableData = result.data;
      }, () => {this.loadings = false;});
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .shield-search-wrapper
    .bread-title-wrapper
      margin-bottom: 15px
    .shield-title-wrapper
      margin-bottom: 15px
      padding: 20px
      background: #fff
      border: 1px solid #eee
      .dowm-forward
        margin-bottom: 10px
        width: 300px  
        .el-select
          display: block
    .shield-table-wrapper
      margin-bottom: 20px     
</style>
