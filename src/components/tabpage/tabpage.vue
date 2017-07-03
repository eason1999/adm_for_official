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
    },
    currentab: {
      type: String
    }
  },
  data () {
    return {
      items: this.tabs,
      activeName: this.currentab
    };
  },
  methods: {
    handleClick (tab, event) {
      this.activeName = tab.name;
      this.$emit('update:currentab', tab.name);
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
        
</style>
