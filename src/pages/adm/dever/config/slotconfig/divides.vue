<template>
  <div class="dev-divides-wrapper">
    <div class="data-title-wrapper">
      <div class="dowm-forward">
        <span class="list-title">开发者名称：</span>
        <el-input disabled v-model="devName" placeholder="请输入内容" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">应用名称：</span>
        <el-input disabled v-model="appName" placeholder="请输入内容"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">广告位名称：</span>
        <el-input disabled v-model="slotName" placeholder="请输入内容"></el-input>
      </div>
      <div class="resource-content">
        
      </div>
      <el-button type="primary" @click="creates">新建</el-button>
      <el-button type="default" @click="back">取消</el-button>
    </div>
  </div>
</template>

<script type="ecmascript-6">
export default {
  data () {
    return {
      devId: this.$route.query.devId,
      devName: this.$route.query.devName,
      id: this.$route.query.id,
      appName: this.$route.query.appName,
      slotName: '',
      loadings: false
    };
  },
  mounted () {
    
  },
  components: {

  },
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
        this.back();
      }, () => {this.loadings = false;});
    },
    back () {
      this.$emit('update:show', false);
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .dev-divides-wrapper
    background: #fff
    position: fixed
    top: 0
    left: 20%
    width: 100%
    height: 100%
    overflow: auto
    z-index: 100
    .data-title-wrapper
      margin-bottom: 15px
      padding: 20px
      .dowm-forward
        margin-bottom: 10px
        width: 300px 
        position: relative
        .radio-wrapper
          margin: 5px 0
          display: block
          .radio
            color: #565656
            width: 140px
            margin-right: 10px
            text-overflow: ellipsis
            overflow: hidden
            white-space: nowrap
          .radio:last-child
            margin-right: 0 
      .resource-content
        border-top: 1px dashed #ccc  
        margin-bottom: 15px     
</style>
