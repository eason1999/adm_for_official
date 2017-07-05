<template>
  <div class="dev-configur-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="data-title-wrapper">
      <div class="dowm-forward">
        <span class="list-title">开发者名称：</span>
        <el-input disabled v-model="devName" placeholder="请输入内容" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">应用名称：</span>
        <el-input disabled v-model="appName" placeholder="请输入内容"></el-input>
      </div>
      <div class="shield-regional dowm-forward">
        <span class="list-title">分成类型：</span>
        <div class="radio-wrapper">
          <el-radio class="radio" v-model="shareType" label="ECPM">固定单价（eCPM）</el-radio>
          <el-radio class="radio" v-model="shareType" label="CPC">固定单价（CPC）</el-radio>
          <el-radio class="radio" v-model="shareType" label="PERCENT">百分比</el-radio>
        </div>
      </div>
      <div class="dowm-forward" v-if="shareType==='PERCENT'">
        <span class="list-title">分成比例：</span>
        <el-input v-model="divide" placeholder="请输入内容"></el-input>
      </div>
      <div class="dowm-forward" v-else>
        <span class="list-title">单价：</span>
        <el-input v-model="divide" placeholder="请输入内容"></el-input>
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
      devId: this.$route.query.devId,
      devName: this.$route.query.devName,
      id: this.$route.query.id,
      appName: this.$route.query.appName,
      divide: this.$route.query.divide,
      shareType: this.$route.query.shareType,
      breadContent: [{ text: '应用管理', path: '/adm/dev/app'}, { text: '分成配置'}],
      loadings: false
    };
  },
  mounted () {
    
  },
  components: { breadcrumb },
  methods: {
    creates () {
      let params = {};
      params.appShareNum = this.divide;
      params.appShareType = this.shareType;
      this.loadings = true;
      this.$http.post('/v1/adm/apps/'+this.devId+'/'+this.id+'/setAppShare', params).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        this.$router.push({
          path: '/adm/dev/app'
        });
      }, () => {this.loadings = false;});
    },
    back () {
      this.$router.push({
        path: '/adm/dev/app'
      });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .dev-configur-wrapper
    .bread-title-wrapper
      margin-bottom: 15px
    .data-title-wrapper
      margin-bottom: 15px
      padding: 20px
      background: #fff
      border: 1px solid #eee
      .dowm-forward
        margin-bottom: 10px
        width: 300px 
        position: relative
        .radio-wrapper
          margin: 5px 0
          .radio
            color: #565656
            width: 140px
            margin-right: 10px
            text-overflow: ellipsis
            overflow: hidden
            white-space: nowrap
          .radio:last-child
            margin-right: 0 
      .shield-regional
        width: 500px       
</style>
