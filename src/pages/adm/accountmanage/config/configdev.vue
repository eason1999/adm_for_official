<template>
  <div class="dev-config-wrapper">
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
        <el-input disabled v-model="passwords" placeholder="请输入内容"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">角色：</span>
        <el-select v-model="roleId" filterable placeholder="请选择" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
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
        <el-select v-model="manageId" filterable placeholder="请选择">
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
import selects from '../../../../components/selects/select.vue';
export default {
  data () {
    return {
      usercompany: this.$route.query.usercompany,
      username: this.$route.query.username,
      managerid: this.$route.query.managerid,
      id: this.$route.query.id,
      passwords: '.......',
      loadings: false,
      manages: [],
      manageId: '',
      roles: [],
      roleId: [],
      breadContent: [{ text: '开发者账户', path: '/adm/devaccount'}, { text: '账户配置'}],
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.getoptions();
    });
  },
  components: { breadcrumb, selects },
  methods: {
    creates () {
      let params = {};
      params.userId = this.id;
      params.roleId = this.dRoleId;
      params.manangerId = this.dMsgId;
      params.optionType = 1;
      this.laodings = true;
      this.$http.post('/v1/adm/auth/devmanager',params).then((res) => {
        this.laodings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        this.back();
      },function(){this.laodings = false;});
    },
    getoptions () {
      this.loadings = true;
      this.getroles();
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
      },() => {this.loadings = false;});
    },
    getroles () {
      this.loadings = true;
      this.$http.get('/v1/adm/dev/roles').then((res) => {
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
    back () {
      this.$router.push({
        path: '/adm/devaccount'
      });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .dev-config-wrapper
    .bread-title-wrapper
      margin-bottom: 15px
    .data-title-wrapper
      padding: 20px
      background: #fff
      border: 1px solid #eee
      .dowm-forward
        margin-bottom: 10px
        width: 300px 
        .el-select
          display: block    
</style>
