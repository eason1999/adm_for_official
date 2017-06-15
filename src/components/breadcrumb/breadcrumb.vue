<template>
  <el-breadcrumb separator=">">
    <el-breadcrumb-item v-if="item.path" v-for="item in items" :key="item.text" :to="{ path: item.path }">{{item.text}}</el-breadcrumb-item>
    <el-breadcrumb-item v-else>{{item.text}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script type="ecmascript-6">
export default {
  props: {
    breadDetail: {
      type: Array
    }
  },
  data () {
    return {
      items: this.breadDetail
    };
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
    
</style>
