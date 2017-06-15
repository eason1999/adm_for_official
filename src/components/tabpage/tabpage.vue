<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane :label="item.text" :name="item.name" v-for="item in tabs" :key="item.name"></el-tab-pane>
  </el-tabs>
</template>

<script type="ecmascript-6">
export default {
  data () {
    return {
      tabs: [
        {name: 'first', text: '全部'},
        {name: 'second', text: '命中'},
        {name: 'third', text: '解绑'}
      ],
      activeName: 'first'
    };
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event);
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
        
</style>
