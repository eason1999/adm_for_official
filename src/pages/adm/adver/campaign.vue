<template>
  <div class="adv-campaign-wrapper">
    <h2>计划</h2>
    <div class="campaign-top-wrapper clearfix">
      <div class="campaign-search pull-right">
        <el-input placeholder="请输入内容"></el-input>
        <el-button type="primary">搜索</el-button>
      </div>
    </div>
    <div class="apps-data-table">
      <el-table :data="tableData5" style="width: 100%">
        <el-table-column type="expand">
          <template scope="props">
            <el-form label-position="left" inline class="demo-table-expand sub-app-form">
              <el-form-item label="提交时间:">
                <span>{{ props.row.time }}</span>
              </el-form-item>
              <el-form-item label="广告类型:">
                <span>{{ props.row.shop }}</span>
              </el-form-item>
              <el-form-item label="创意ID:">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="创意名称:" title="创意名称">
                <span>{{ props.row.shopId }}</span>
              </el-form-item>
              <el-form-item label="预览:">
                <template scope="scope">
                  <el-button type="info" size="small" @click="previewImg(scope.$index, scope.row)">预览</el-button>
                </template>
              </el-form-item>
              <el-form-item label="配置:">
                <template scope="scope">
                  <el-button type="info" size="small" @click="config(scope.$index, scope.row)">定向配置</el-button>
                </template>
              </el-form-item>
              <el-form-item label="投放状态:" title="投放状态">
                <span>{{ props.row.category }}</span>
              </el-form-item>
              <el-form-item label="审核状态:" title="审核状态">
                <span>{{ props.row.category }}</span>
              </el-form-item>
              <el-form-item label="操作:">
                <template scope="scope">
                  <el-switch v-model="value2" on-color="#13ce66" off-color="#ff4949"></el-switch>
                </template>
              </el-form-item>
              <el-form-item label="审核:">
                <template scope="scope">
                  <el-button type="success" size="small" @click="handleEdit(scope.$index, scope.row)">通过</el-button>
                  <el-button type="danger" size="small" @click="handleEdit(scope.$index, scope.row)">拒绝</el-button>
                </template>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="计划投放时间" prop="id"></el-table-column>
        <el-table-column label="公司名称" prop="name"></el-table-column>
        <el-table-column label="计划ID" prop="name"></el-table-column>
        <el-table-column label="计划名称" prop="name"></el-table-column>
        <el-table-column label="预算(￥)" prop="name"></el-table-column>
        <el-table-column label="每日预算(￥)" prop="name"></el-table-column>
        <el-table-column label="单价(￥)" prop="name"></el-table-column>
        <el-table-column label="审核状态" prop="name"></el-table-column>
        <el-table-column label="投放状态" prop="name"></el-table-column>
        <el-table-column label="审核">
          <template scope="scope">
            <el-button type="success" size="small" @click="handleEdit(scope.$index, scope.row)">通过</el-button>
            <el-button type="danger" size="small" @click="handleEdit(scope.$index, scope.row)">拒绝</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-switch v-model="value2" on-color="#13ce66" off-color="#ff4949"></el-switch>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pager-wrapper clearfix">
      <pager :total-records="totalRecords" :page-sizes="pageSize" :page-nums="pageNum"></pager>
    </div>
    <el-dialog v-model="dialogVisible" size="tiny">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script type="ecmascript-6">
import pager from '../../../components/pager/pager.vue';
export default {
  data () {
    return {
      tableData5: [{
        id: '12987122',
        time: '2017-03-06',
        category: '江浙小吃、小吃零食',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333',
        name: '发展有限'
      }, {
        id: '12987123',
        time: '2017-03-06',
        category: '江浙小吃、小吃零食',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333',
        name: '发展有限'
      }, {
        id: '12987125',
        time: '2017-03-06',
        category: '江浙小吃、小吃零食',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333',
        name: '发展有限'
      }, {
        id: '12987126',
        time: '2017-03-06',
        category: '江浙小吃、小吃零食',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333',
        name: '发展有限'
      }],
      totalRecords: 100,
      pageNum: 1,
      pageSize: 10,
      value2: true,
      totalRecords: 100,
      pageNum: 1,
      pageSize: 10,
      dialogVisible: false,
      dialogImageUrl: ''
    };
  },
  components: { pager },
  methods: {
    previewImg () {
      this.dialogVisible = true;
      this.dialogImageUrl = '';
    },
    config () {
      this.$router.push({ path: 'data/config', query: { plan: '123' }});
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .adv-campaign-wrapper
    overflow: hidden
    .campaign-top-wrapper
      margin-bottom: 15px
      .campaign-search
        max-width: 300px
        font-size: 0
        .el-input
          width: 230px
          input
            border-radius: 4px 0 0 4px
        button 
          border-radius: 0 4px 4px 0
    .apps-data-table
      font-size: 0
      .el-select
        width: 90px
        .el-input__inner
          height: 28px
      .sub-app-form
        padding: 10px
        border-bottom: 1px dashed #bbb
        label
          width: 75px
          overflow: hidden
          white-space: nowrap
          text-overflow: ellipsis
          color: #99a9bf
        .el-form-item
          margin-right: 0
          margin-bottom: 0
          width: 48%  
      .sub-app-form:last-child
        border: none        
    .pager-wrapper
      margin-top: 15px      
</style>
