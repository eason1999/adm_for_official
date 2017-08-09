<template>
  <div class="add-manage-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="data-title-wrapper">
      <el-form :model="ruleForm" :rules="rules" :label-position="labelPosition" ref="ruleForm">
        <el-form-item label="管理员名称：" prop="username">
          <el-input :disabled="id!=undefined" v-model="ruleForm.username" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="账号：" prop="useraccount">
          <el-input :disabled="id!=undefined" v-model="ruleForm.useraccount" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="passwords">
          <el-input type="password" v-model="ruleForm.passwords" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="角色：" prop="roleid">
          <el-select v-model="ruleForm.roleid" filterable placeholder="请选择" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
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
      roles: [],
      ruleForm: {
        passwords: this.$route.query.passwords,
        username: this.$route.query.username,
        useraccount: this.$route.query.useraccount,
        roleid: this.$route.query.roleid
      },
      labelPosition: 'top',
      rules: {
        passwords: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入管理员名称', trigger: 'blur' }
        ],
        useraccount: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        roleid: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      },
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
    creates (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.subcreate();
        } else {
          return this.$alert('请正确输入或选择相应选项！！！', '提示：', {
            confirmButtonText: '确定'
          });
        }
      });
    },
    subcreate () {
      this.loadings = true;
      let params = {};
      if (this.id) {
        params.userId = this.id;
      }
      params.userName = this.ruleForm.username;
      params.password = this.ruleForm.passwords;
      params.accountName = this.ruleForm.useraccount;
      params.roleId = this.ruleForm.roleid;
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
      .el-form-item
        width: 280px 
        .el-select
          display: block 
        &:last-child
          margin-bottom: 0    
</style>
