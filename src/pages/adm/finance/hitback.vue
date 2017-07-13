<template>
  <div class="hit-back-wrapper">
    <h2>命中/退款</h2>
    <div class="tab-page-wrapper">
      <tabpage :tabs="tabs" :currentab="currentabs" @update:currentab="val => currentabs = val"></tabpage>
    </div>
    <devhit v-if="currentabs==='first'"></devhit>
    <advrefund v-if="currentabs==='second'"></advrefund>
  </div>
</template>

<script type="ecmascript-6">
import tabpage from '../../../components/tabpage/tabpage.vue';
import devhit from './config/devhit.vue';
import advrefund from './config/advrefund.vue';
export default {
  data () {
    return {
      tabs: [
        {name: 'first', text: '开发者命中'},
        {name: 'second', text: '广告主退款'}
      ],
      currentabs: 'first'
    };
  },
  mounted () {
    
  },
  components: { tabpage, devhit, advrefund },
  methods: {
    
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .hit-back-wrapper
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
</style>
