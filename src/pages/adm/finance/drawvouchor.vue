<template>
  <div class="draw-vouchor-wrapper">
    <h2>提现/充值</h2>
    <div class="tab-page-wrapper">
      <tabpage :tabs="tabs" :currentab="currentabs" @update:currentab="val => currentabs = val"></tabpage>
    </div>
    <drawcash v-if="currentabs==='first'"></drawcash>
    <recharge v-if="currentabs==='second'"></recharge>
  </div>
</template>

<script type="ecmascript-6">
import tabpage from '../../../components/tabpage/tabpage.vue';
import drawcash from './config/drawcash.vue';
import recharge from './config/recharge.vue';
export default {
  data () {
    return {
      tabs: [
        {name: 'first', text: '开发者提现'},
        {name: 'second', text: '广告主提现'}
      ],
      currentabs: 'first'
    };
  },
  mounted () {
    
  },
  components: { tabpage, drawcash, recharge },
  methods: {
    
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .draw-vouchor-wrapper
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
