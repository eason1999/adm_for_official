<template>
  <div class="adv-resource-wrapper">
    <h2>广告源配置</h2>
    <div class="tab-page-wrapper">
      <tabpage :tabs="tabs" :currentab="currentabs" @update:currentab="val => currentabs = val"></tabpage>
    </div>
    <alldata v-if="currentabs==='first'"></alldata>
    <hitdata v-if="currentabs==='second'"></hitdata>
    <unbind v-if="currentabs==='third'"></unbind>
    <seodata v-if="currentabs==='fourth'"></seodata>
  </div>
</template>

<script type="ecmascript-6">
import tabpage from '../../../components/tabpage/tabpage.vue';
import alldata from './config/alldata.vue';
import hitdata from './config/hitdata.vue';
import unbind from './config/unbind.vue';
import seodata from './config/seodata.vue';
export default {
  data () {
    return {
      tabs: [
        {name: 'first', text: '全部'},
        {name: 'second', text: '命中'},
        {name: 'third', text: '解绑'},
        {name: 'fourth', text: '优化'}
      ],
      currentabs: 'first'
    };
  },
  components: { tabpage, alldata, hitdata, unbind, seodata },
  mounted () {
    
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .adv-resource-wrapper
    overflow: hidden
    .resource-top-wrapper
      margin-bottom: 15px
      .search 
        color: #fff
      .resource-search
        max-width: 300px
        font-size: 0
        .el-input
          width: 230px
          input
            border-radius: 4px 0 0 4px
        button 
          border-radius: 0 4px 4px 0
    .pager-wrapper
      margin-top: 15px      
</style>
