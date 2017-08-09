<template>
  <div class="add-regional-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="data-title-wrapper">
      <div class="dowm-forward" v-if="id !== undefined">
        <span class="list-title">公司名称：</span>
        <el-input :disabled="true" v-model="accountName" placeholder="请输入内容"></el-input>
      </div>
      <div class="dowm-forward" v-if="id !== undefined">
        <span class="list-title">应用名称：</span>
        <el-input :disabled="true" v-model="appName" placeholder="请输入内容"></el-input>
      </div>
      <el-form :model="ruleForm" :rules="rules" :label-position="labelPosition" ref="ruleForm">
        <el-form-item label="公司名称：" prop="accountId" v-if="id === undefined">
          <el-select @change="loadapps" v-model="ruleForm.accountId" filterable placeholder="请选择" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
            <el-option
              v-for="item in accounts"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应用名称：" prop="appId" v-if="id === undefined">
          <el-select v-model="ruleForm.appId" filterable placeholder="请选择">
            <el-option
              v-for="item in apps"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="shield-regional dowm-forward">
          <span class="list-title">屏蔽地域：</span>
          <el-transfer
            v-loading.body="cities.length===0"
            filterable
            :titles="['省市列表','已选省市']"
            filter-placeholder="请输入搜索项"
            v-model="cityValues"
            :data="cities">
          </el-transfer>
        </div>
        <el-form-item>
          <el-button type="primary" @click="creates('ruleForm')">新建</el-button>
          <el-button type="default" @click="back">取消</el-button>
        </el-form-item>  
      </el-form>  
    </div>
  </div>
</template>

<script type="ecmascript-6">
import breadcrumb from '../../../../components/breadcrumb/breadcrumb.vue';
export default {
  data () {
    return {
      id: this.$route.query.id,
      accounts: [],
      ruleForm: {
        appId: '',
        accountId: ''
      },
      apps: [],
      appName: '',
      accountName: '',
      breadContent: [{ text: '地域屏蔽', path: '/adm/shield/regional'}, { text: '地域黑名单'}],
      input: '',
      cities: [],
      cityValues: [],
      loadings: false,
      labelPosition: 'top',
      rules: {
        accountId: [
          { required: true, message: '请选择公司', trigger: 'change' }
        ],
        appId: [
          { required: true, message: '请选择应用', trigger: 'change' }
        ]
      }
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.loadaccounts();
      if (this.id) {
        this.getdata();
      }
    });
  },
  components: { breadcrumb },
  methods: {
    getdata () {
      let params = {};
      params.id = this.id;
      this.$http.get("/v1/ota/blackAreaDetail", {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.ruleForm.accountId = result.accountId;
        this.ruleForm.appId = result.appId;
        this.cityValues = result.blackAreas.split(',');
        this.accountName = result.companyName;
        this.appName = result.appName;
      }, () => {this.loadings = false;});
    },
    loadaccounts () {
      this.loadings = true;
      this.getcities();
      this.$http.get('/v1/ota/getAccountlist').then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.accounts = result;
      }, () => {this.loadings = false;});
    },
    loadapps () {
      let params = {};
      params.accountId = this.ruleForm.accountId;
      this.loadings = true;
      this.$http.get('/v1/ota/{accountId}/otablackapps', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.apps = result;
        this.ruleForm.appId = '';
      }, () => {this.loadings = false;});
    },
    getcities () {
      this.loadings = true;
      this.$http.get('/v1/dict/regions/allCities').then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result, cities = [];
        for (let i = 0, a = result.length; i< a; i++) {
          let item = {};
          item.label = result[i].text;
          item.key = result[i].id;
          cities.push(item);
        }
        for (let i = 0, a = result.length; i< a; i++) {
          if (result[i].items.length > 1) {
            for (let j = 0, b = result[i].items.length; j < b; j++) {
              let item = {};
              item.label = result[i].items[j].text;
              item.key = result[i].items[j].id;
              cities.push(item);
            }
          }
        }
        this.cities = cities;
      }, () => {this.loadings = false;});
    },
    creates (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid && this.cityValues.length) {
          this.submitcreate();
        } else {
          return this.$alert('请正确选择相应选项或屏蔽地域！！！', '提示：', {
            confirmButtonText: '确定'
          });
        }
      });
    },
    submitcreate () {
      let params = {};
      let areaIds = this.cityValues.join(',');
      // 区分修改、新增
      if (this.id) {
        params.id = this.id;
      }
      params.accountId = this.ruleForm.accountId;
      params.appId = this.ruleForm.appId;
      params.areaIds = areaIds;
      this.loadings = true;
      this.$http.post('/v1/ota/blackArea', params).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        this.$alert('数据提交成功！', '提示：',{
          confirmButtonText: '确定',
          callback: () => {
            this.back();
          }
        });
      }, () => {this.loadings = false;});
    },
    back () {
      this.$router.push({
        path: '/adm/shield/regional'
      });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .add-regional-wrapper
    .bread-title-wrapper
      margin-bottom: 15px
    .data-title-wrapper
      margin-bottom: 15px
      padding: 20px
      background: #fff
      border: 1px solid #eee
      .dowm-forward
        margin-bottom: 20px
        width: 280px 
        position: relative 
        .el-input
          display: block
      .shield-regional
        width: 500px 
      .el-form-item 
        width: 280px 
        .el-select
          display: block 
        &:last-child
          margin-bottom: 0       
</style>
