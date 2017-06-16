<template>
  <div class="resource-sloteid-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="data-title-wrapper">
      <div class="tab-page-wrapper">
        <tabpage :tabs="tabs" @tabchange="change"></tabpage>
      </div>
      <div v-if="actives==='first'">
        <onedata></onedata>
      </div>
      <div v-else class="batchdata-wrapper">
        <batchdata></batchdata>
      </div>
      <el-button type="primary">新建</el-button>
      <el-button type="primary">取消</el-button>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import breadcrumb from '../../../../components/breadcrumb/breadcrumb.vue';
import tabpage from '../../../../components/tabpage/tabpage.vue';
import onedata from '../config/onedata.vue';
import batchdata from '../config/batchdata.vue';
export default {
  data () {
    return {
      breadContent: [{ text: '广告源配置', path: '/adm/resource'}, { text: '新增广告位ID'}],
      tabs: [
        {name: 'first', text: '单条数据'},
        {name: 'second', text: '批量数据'}
      ],
      actives: 'first'
    };
  },
  mounted () {
    
  },
  components: { breadcrumb, tabpage, onedata, batchdata },
  methods: {
    change (msg) {
      this.actives = msg;
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .resource-sloteid-wrapper
    .bread-title-wrapper
      margin-bottom: 15px
    .data-title-wrapper
      margin-bottom: 15px
      padding: 20px
      background: #fff
      border: 1px solid #eee
      .batchdata-wrapper
        margin-bottom: 15px     
</style>
