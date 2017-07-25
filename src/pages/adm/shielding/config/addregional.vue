<template>
  <div class="add-regional-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="data-title-wrapper">
      <div class="dowm-forward">
        <span class="list-title">公司名称：</span>
        <el-input v-if="id!==undefined" :disabled="id!==undefined" v-model="accountName"></el-input>
        <el-select v-else @change="loadapps" v-model="accountId" filterable placeholder="请选择" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
          <el-option
            v-for="item in accounts"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="dowm-forward">
        <span class="list-title">应用名称：</span>
        <el-input v-if="id!==undefined" :disabled="id!==undefined" v-model="appName"></el-input>
        <el-select v-else v-model="appId" filterable placeholder="请选择">
          <el-option
            v-for="item in apps"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
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
      <el-button type="primary" @click="creates">新建</el-button>
      <el-button type="default" @click="back">取消</el-button>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import breadcrumb from '../../../../components/breadcrumb/breadcrumb.vue';
export default {
  data () {
    return {
      id: this.$route.query.id,
      accountId: '',
      accounts: [],
      appId: '',
      apps: [],
      appName: '',
      accountName: '',
      breadContent: [{ text: '地域屏蔽', path: '/adm/shield/regional'}, { text: '地域黑名单'}],
      input: '',
      cities: [],
      cityValues: [],
      loadings: false
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
        this.accountId = result.accountId;
        this.appId = result.appId;
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
      params.accountId = this.accountId;
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
        this.appId = '';
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
    creates () {
      let params = {};
      let areaIds = this.cityValues.join(',');
      // 区分修改、新增
      if (this.id) {
        params.id = this.id;
      }
      params.accountId = this.accountId;
      params.appId = this.appId;
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
        margin-bottom: 10px
        width: 260px 
        position: relative 
        .el-select
          display: block
      .shield-regional
        width: 500px      
</style>
