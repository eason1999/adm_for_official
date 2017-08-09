<template>
  <div class="shield-search-wrapper">
    <h2>黑名单查询</h2>
    <div class="shield-title-wrapper">
      <el-form :model="ruleForm" :rules="rules" :label-position="labelPosition" ref="ruleForm">
        <el-form-item label="开发者名称：" prop="devId">
          <el-select @change="loadapps" v-model="ruleForm.devId" filterable placeholder="请选择" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
            <el-option
              v-for="item in devs"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应用名称：" prop="appId">
          <el-select @change="loadslots" v-model="ruleForm.appId" filterable placeholder="请选择">
            <el-option
              v-for="item in apps"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告位名称：" prop="slotId">
          <el-select v-model="ruleForm.slotId" filterable placeholder="请选择">
            <el-option
              v-for="item in slots"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="黑名单类型：" prop="typeId">
          <el-select v-model="ruleForm.typeId" filterable placeholder="请选择">
            <el-option
              v-for="item in types"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="黑名单内容：" prop="contents">
          <el-input v-model="ruleForm.contents" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search('ruleForm')">查询</el-button>
        </el-form-item>  
      </el-form>  
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
      <div class="page-wrapper pull-right">
        <pager :total-records="totalRecords" @pagechange="load" :page-sizes="pageSize" :page-nums="pageNum"></pager>
      </div>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import pager from '../../../components/pager/pager.vue';
export default {
  data () {
    return {
      ruleForm: {
        devId:'',
        appId: '',
        slotId: '',
        typeId: '',
        contents: ''
      },
      apps: [],
      devs: [],
      slots: [],
      types: [{id: '1', text: "IMEI/IDFA"},{id: '2', text: "IP"}],
      loadings: false,
      tableData: [],
      totalRecords: -1,
      pageNum: 1,
      pageSize: 20,
      labelPosition: 'top',
      rules: {
        devId: [
          { required: true, message: '请选择开发者', trigger: 'change' }
        ],
        appId: [
          { required: true, message: '请选择应用', trigger: 'change' }
        ],
        slotId: [
          { required: true, message: '请选择广告位', trigger: 'change' }
        ],
        typeId: [
          { required: true, message: '请选择黑名单类型', trigger: 'change' }
        ],
        contents: [
          { required: true, message: '请选输入内容', trigger: 'blur' }
        ]
      }
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.loadcompanys();
    });
  },
  components: { pager },
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
        this.ruleForm.devId = '';
        this.apps = [];
        this.ruleForm.appId = '',
        this.slots = [];
        this.ruleForm.slotId = '';
      }, () => {this.loadings = false;});
    },
    loadapps () {
      this.loadings = true;
      let params = {};
      params.devId = this.ruleForm.devId;
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
        this.ruleForm.appId = '',
        this.slots = [];
        this.ruleForm.slotId = '';
      }, () => {this.loadings = false;});
    },
    loadslots () {
      this.loadings = true;
      let params = {};
      params.devId = this.ruleForm.devId;
      if (this.ruleForm.appId) {
        params.appId = this.ruleForm.appId;
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
        this.ruleForm.slotId = '';
      }, () => {this.loadings = false;});
    },
    search (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.search(1, 20);
        } else {
          return this.$alert('请正确输入或选择相应选项！！！', '提示：', {
            confirmButtonText: '确定'
          });
        }
      });
    },
    load (pageNum, pageSize) {
      let params = {};
      params.slotId = this.ruleForm.slotId;
      params.appId = this.ruleForm.appId;
      params.developerId = this.ruleForm.devId;
      params.keyWords = this.ruleForm.contents;
      params.type = this.ruleForm.typeId;
      params.pageNum = pageNum || this.pageNum;
      params.pageSize = pageSize || this.pageSize;
      this.loadings = true;
      this.$http.post('/black/show/'+params.pageNum+'/'+ params.pageSize, params).then((res) => {
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
      .el-form-item
        width: 280px  
        .el-select
          display: block
        .el-input
          display: block
        &:last-child
          margin-bottom: 0
    .shield-table-wrapper
      margin-bottom: 20px     
</style>
