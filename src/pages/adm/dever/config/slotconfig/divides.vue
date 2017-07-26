<template>
  <div class="dev-divides-wrapper">
    <div class="data-title-wrapper">
      <div class="dowm-forward">
        <span class="list-title">开发者名称：</span>
        <el-input disabled v-model="devNames" placeholder="请输入内容" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">应用名称：</span>
        <el-input disabled v-model="appNames" placeholder="请输入内容"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">广告位名称：</span>
        <el-input disabled v-model="adslotNames" placeholder="请输入内容"></el-input>
      </div>
      <div class="resource-content">
        <div class="dowm-forward">
          <span class="list-title">应用分成信息：</span>
          <div class="app-info">
            <el-input disabled v-model="types" placeholder="请输入内容"></el-input>
            <el-input disabled v-model="appShareNums" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="dowm-forward radio-wrapper">
          <span class="list-title">分成类型：</span>
          <el-radio-group v-model="slotShareTypes">
            <el-radio class="radio" label="ECPM">固定单价（eCPM）</el-radio>
            <el-radio class="radio" label="CPC">固定单价（CPC）</el-radio>
            <el-radio class="radio" label="PERCENT">百分比</el-radio>
          </el-radio-group>
        </div>
        <div class="dowm-forward">
          <span class="list-title" v-if="slotShareTypes==='PERCENT'">分成比例：</span>
          <span class="list-title" v-else>单价：</span>
          <el-input v-model="slotShareNums" placeholder="请输入内容"></el-input>
        </div>
        <div class="footer-wrapper">
          <el-button type="primary" @click="creates">新建</el-button>
          <el-button type="default" @click="back">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="ecmascript-6">
export default {
  props: {
    appId: {
      type: Number
    },
    devId: {
      type: Number
    },
    devName: {
      type: String
    },
    appName: {
      type: String
    },
    adslotId: {
      type: Number
    },
    adslotName: {
      type: String
    },
    appShareNum: {
      type: Number
    },
    appShareType: {
      type: String
    },
    slotShareNum: {
      type: Number
    },
    slotShareType: {
      type: String
    }
  },
  data () {
    return {
      appIds: this.appId,
      devIds: this.devId,
      devNames: this.devName,
      appNames: this.appName,
      adslotIds: this.adslotId,
      adslotNames: this.adslotName,
      appShareTypes: this.appShareType,
      appShareNums: this.appShareNum,
      slotShareTypes: this.slotShareType,
      slotShareNums: this.slotShareNum,
      loadings: false
    };
  },
  computed: {
    types () {
      let item;
      switch (this.appShareTypes) {
        case 'PERCENT':
          item = '百分比';
          break;
        case 'CPC':
          item = '固定单价（CPC）';
          break;
        case 'ECPM':
          item = '固定单价（eCPM）';
          break;    
      }
      return item;
    }
  },
  methods: {
    creates () {
      let params = {};
      params.slotShareType = this.slotShareTypes;
      params.slotShareNum = this.slotShareNums;
      this.loadings = true;
      this.$http.post('/v1/adm/slots/'+this.devIds+'/'+this.appIds+'/'+this.adslotIds+'/setSlotShare', params).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret != 1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        } else {
          return this.$alert('更新成功！！！', '提示：', {
            confirmButtonText: '确定',
            callback: () => {
              this.back();
            }
          });
        }
      }, () => {this.loadings = false;});
    },
    back () {
      this.$emit('update:show', false);
      this.$emit('update:slot');
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
    width: 80%
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
        .el-input
          width: 100%
      .resource-content
        border-top: 1px dashed #ccc
        padding-top: 10px
        .radio-wrapper
          width: 400px
        .app-info
          .el-input
            width: 60%
            &:last-child
              width: 38% 
</style>
