<template>
  <div class="add-manage-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="data-title-wrapper">
      <div class="dowm-forward">
        <span class="list-title">管理员名称：</span>
        <el-input :disabled="id!=undefined" v-model="username" placeholder="请输入内容"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">账号：</span>
        <el-input :disabled="id!=undefined" v-model="useraccount" placeholder="请输入内容"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">密码：</span>
        <el-input type="password" v-model="passwords" placeholder="请输入内容"></el-input>
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
      roles: [],
      passwords: this.$route.query.passwords,
      username: this.$route.query.username,
      useraccount: this.$route.query.useraccount,
      breadContent: [{ text: '管理员账户', path: '/adm/admaccount'}, { text: '账户配置'}],
      loadings: false
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.getroles();
    });
  },
  components: { breadcrumb },
  methods: {
    creates () {
      this.loadings = true;
      let params = {};
      if (this.id) {
        params.userId = this.id;
      }
      params.userName = this.username;
      params.password = this.passwords;
      params.accountName = this.useraccount;
      params.roleId = this.roleid;
      this.$http.get('/v1/adm/account/createAccount',{params: params}).then((res) => {
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
      }, () => {this.laodings = false;});
    },
    getroles () {
      this.loadings = true;
      this.$http.get('/v1/adm/adm/roles').then((res) => {
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
        path: '/adm/admaccount'
      });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .add-manage-wrapper
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
