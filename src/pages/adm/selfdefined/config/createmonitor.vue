<template>
  <div class="selfdefined-create-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="data-title-wrapper">
      <div class="datepicker-wrapper dowm-forward">
        <span class="list-title">公司名称：</span>
        <el-select v-model="advId" filterable placeholder="请选择" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
          <el-option
            v-for="item in advs"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="create-select dowm-forward">
        <span class="list-title">计划名称：</span>
        <el-select v-model="planId" filterable placeholder="请选择">
          <el-option
            v-for="item in plans"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="plan-select dowm-forward">
        <span class="list-title">创意名称：</span>
        <el-select v-model="createId" filterable placeholder="请选择">
          <el-option
            v-for="item in creates"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <el-button type="primary">生成报告</el-button>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import breadcrumb from '../../../../components/breadcrumb/breadcrumb.vue';
export default {
  data () {
    return {
      creates: [],
      plans: [],
      advs: [],
      advId: '',
      planId: '',
      createId: '',
      breadContent: [{ text: '监测代码', path: '/adm/selfdefined/monitor'}, { text: '新建监测'}]
    };
  },
  mounted () {
    
  },
  components: { breadcrumb }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .selfdefined-create-wrapper
    .bread-title-wrapper
      margin-bottom: 15px
    .data-title-wrapper
      margin-bottom: 15px
      padding: 20px
      background: #fff
      border: 1px solid #eee
      .dowm-forward
        margin-bottom: 10px
        width: 300px  
        .el-select
          display: block    
</style>
