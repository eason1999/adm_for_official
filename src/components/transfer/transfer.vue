<template>
  <el-transfer
    filterable
    :titles="[titles,'已选'+titles]"
    :filter-method="filterMethod"
    filter-placeholder="请输入搜索项"
    v-model="value2"
    :data="data2"
    @change="changes">
  </el-transfer>
</template>

<script type="ecmascript-6">
export default {
  props: {
    cities: {
      type: Array
    },
    transferTitle: {
      type: String
    }
  },
  data () {
    return {
      data2: this.cities,
      titles: this.transferTitle,
      value2: [10001],
      filterMethod(query, item) {
        return item.city.indexOf(query) > -1;
      }
    };
  },
  methods: {
    changes (data) {
      // console.log(data);
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  
</style>
