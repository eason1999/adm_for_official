<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane :label="item.text" :name="item.name" v-for="item in items" :key="item.name"></el-tab-pane>
  </el-tabs>
</template>

<script type="ecmascript-6">
export default {
  props: {
    tabs: {
      type: Array
    }
  },
  data () {
    return {
      items: this.tabs,
      activeName: 'first'
    };
  },
  methods: {
    handleClick (tab, event) {
      this.$emit('tabchange', tab.name);
      console.log(tab);
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
        
</style>
