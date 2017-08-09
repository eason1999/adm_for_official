<template>
  <div class="adv-config-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="data-title-wrapper">
      <div class="dowm-forward">
        <span class="list-title">公司名称：</span>
        <el-input disabled v-model="usercompany" placeholder="请输入内容"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">账号：</span>
        <el-input disabled v-model="username" placeholder="请输入内容"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">密码：</span>
        <el-input type="password" disabled v-model="input2" placeholder="请输入内容"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">角色：</span>
        <el-select v-model="roleid" filterable placeholder="请选择" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
          <el-option
            v-for="item in roles"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="dowm-forward">
        <span class="list-title">管理员：</span>
        <el-select v-model="managerid" filterable placeholder="请选择">
          <el-option
            v-for="item in manages"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
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
      roleid: this.$route.query.roleid,
      username: this.$route.query.username,
      managerid: this.$route.query.managerid,
      usercompany: this.$route.query.usercompany,
      manages: [],
      roles: [],
      input2: '******',
      breadContent: [{ text: '广告主账户', path: '/adm/advaccount'}, { text: '账户配置'}],
      loadings: false
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.getoptions();
    });
  },
  components: { breadcrumb },
  methods: {
    getoptions () {
      this.loadings = true;
      this.$http.get('/v1/adm/authority/admin').then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.manages = result;
      
      }, () => {this.loadings = false;});
      //-------------------获得角色下拉------------------------//
      this.laodings = true;
      this.$http.get('/v1/adm/adv/roles').then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.roles = result;
      }, () => {this.loadings = false;});
    },
    creates () {
      let params = {};
      params.userId = this.id;
      params.roleId = this.roleid;
      params.manangerId = this.managerid;
      params.optionType = 1;
      this.$http.post('/v1/adm/auth/advmanager', params).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        this.$alert('编辑成功！！！', '提示：', {
          confirmButtonText: '确定',
          callback: () => {
            this.back();
          }
        });
      }, () => {this.loadings = false;});
    },
    back () {
      this.$router.push({
        path: '/adm/advaccount'
      });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .adv-config-wrapper
    .bread-title-wrapper
      margin-bottom: 15px
    .data-title-wrapper
      padding: 20px
      background: #fff
      border: 1px solid #eee
      .dowm-forward
        margin-bottom: 20px
        width: 280px 
        .el-select
          display: block   
</style>
