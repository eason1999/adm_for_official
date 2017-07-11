<template>
  <el-row :gutter="10">
    <el-col class="total-data-content" :sm="6" :md="6" :lg="6" v-for="item in datas" :key="item.num">
      <div class="grid-wrapper">
        <span class="grid-icon" :class="item.icon"></span>
        <div class="grid-content">
          <p class="grid-num">{{item.num}}</p>
          <p class="grid-title">{{item.text}}</p>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script type="ecmascript-6">
export default {
  data () {
    return {
      datas: this.items
    };
  },
  props: {
    items: {
      type: Array
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .grid-wrapper
    position: relative
    background: #fff
    border-radius: 4px
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.1)
    padding: 20px
    height: 110px
    box-sizing: border-box
    .grid-icon
      position: absolute
      left: 15px
      top: 20px
      font-size: 26px
      color: #64c5b1
      border: 4px double #64c5b1
      border-radius: 50%
      padding: 15px
    .grid-content
      position: absolute
      right: 30px
      top: 30px 
      .grid-num
        font-size: 20px
        font-weight: 700
        color: #666f7b 
        margin-bottom: 5px
        transition: all 0.5s linear
      .grid-title
        font-size: 14px
        color: #797979
  .total-data-content:hover
      .grid-num 
        font-size: 22px   
</style>
