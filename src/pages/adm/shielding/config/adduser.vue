<template> 
  <div class="add-user-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="data-title-wrapper">
      <div class="dowm-forward">
        <span class="list-title">黑名单：</span>
        <el-select v-model="userId" filterable placeholder="请选择" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
          <el-option
            v-for="item in users"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="dowm-forward" v-if="this.userId !== 1">
        <span class="list-title">IMEI/IDFA：</span>
        <el-input v-model="inputs" placeholder="请输入内容"></el-input>
        <el-button type="primary" @click="creates">新建</el-button>
        <el-button type="default" @click="back">取消</el-button>
      </div>
      <div class="dowm-forward" v-else>
        <span class="list-title">IMEI/IDFA：</span>
        <dragupload :go-paths="goPath" :paths="paths" :urls="urls" :file-lists="fileList" :modeldatas="modeldatas"></dragupload>
      </div>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import apiUtil from '../../../../util/api.js';
import breadcrumb from '../../../../components/breadcrumb/breadcrumb.vue';
import dragupload from '../../../../components/upload/dragupload.vue';
export default {
  data () {
    return {
      breadContent: [{ text: '用户黑名单', path: '/adm/shield/user'}, { text: '新增黑名单'}],
      inputs: '',
      users: [{id: 0,text: '单个用户'},{id: 1,text: '批量用户'}],
      userId: '',
      goPath: true,
      paths: '/adm/shield/user',
      urls: apiUtil.url('/v1/ota/blacks'),
      fileList: [],
      modeldatas: 'http://adroi.bj.bcebos.com/cdn/res/resource/temp/%E6%89%B9%E9%87%8F%E9%BB%91%E5%90%8D%E5%8D%95%E6%A8%A1%E6%9D%BF.xlsx',
      laodings: false
    };
  },
  mounted () {
    
  },
  components: { dragupload, breadcrumb },
  methods: {
    creates () {
      let params = {};
      params.IMEI = this.inputs;
      this.laodings = true;
      this.$http.post('/v1/ota/black', params).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        this.back();
      }, () => {this.loadings = false;});
    },
    back () {
      this.$router.push({
        path: '/adm/shield/user'
      });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .add-user-wrapper
    .bread-title-wrapper
      margin-bottom: 15px
    .data-title-wrapper
      padding: 20px
      background: #fff
      border: 1px solid #eee
      .dowm-forward
        width: 300px 
        position: relative 
        .el-select
          display: block  
        .el-input
          margin-bottom: 10px     
</style>
