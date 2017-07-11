<template>
  <el-date-picker
    :editable="false"
    v-model="dateData.value"
    :type="dateData.type"
    :align="dateData.align"
    :picker-options="pickerOptions2"
    @change="getDate"
    placeholder="选择日期范围">
  </el-date-picker>
</template>

<script type="ecmascript-6">
export default {
  props: {
    datepickers: {
      type: Object
    },
    pickerOptions: {
      type: Object
    }
  },
  data () {
    return {
      dateData: this.datepickers,
      pickerOptions2: this.pickerOptions
    };
  },
  methods: {
    getDate (data) {
      this.$emit('datechange');
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .el-date-editor--daterange.el-input {
    width: 100%
  }
</style>
