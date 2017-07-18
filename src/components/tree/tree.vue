<template>
  <el-tree
    :data="data2"
    show-checkbox
    node-key="id"
    ref="tree"
    accordion
    highlight-current
    :props="defaultProps"
    @check-change="getCheckedKeys">
  </el-tree>
</template>

<script type="ecmascript-6">
export default {
  props: {
    treeData: {
      type: Array
    }
  },
  data () {
    return {
      data2: this.treeData,
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.getCheckedKeys();
    });
  },
  methods: {
    getCheckedKeys () {
      var treeArray = this.$refs.tree.getCheckedKeys();
      console.log(treeArray[treeArray.length-1]);
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
     
</style>
