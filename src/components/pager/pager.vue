<template>
  <div class="pager-content">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pageNum"
      :page-sizes="[20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalRecords">
    </el-pagination>
  </div>
</template>

<script type="ecmascript-6">
export default {
  data () {
    return {
      total: this.totalRecords,	
      pageSize: this.pageSizes,
      pageNum: this.pageNums
    };
  },
  props: {
  	"totalRecords": {
  		type: Number
  	},
  	"pageSizes": {
  		type: Number
  	},
  	"pageNums": {
  		type: Number,
  		default: 1
  	}
  },
  methods: {
  	handleSizeChange (val) {
      this.$emit('pagechange', this.pageNum, val);
      this.pageSize = val;
  	},
  	handleCurrentChange (val) {
      this.$emit('pagechange', val, this.pageSize);
      this.pageNum = val;
  	}
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .pager-content
  	float: right
</style>
