<template>
  <div class="role-edit-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="data-title-wrapper">
      <div class="dowm-forward">
        <span class="list-title">用户属性：</span>
        <selects></selects>
      </div>
      <div class="dowm-forward">
        <span class="list-title">角色：</span>
        <el-input v-model="input" placeholder="请输入内容"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">页面权限：</span>
        <tree :tree-data="treeData"></tree>
      </div>
      <div class="dowm-forward">
        <span class="list-title">广告主管理：</span>
        <selects></selects>
      </div>
      <el-button type="primary">新建</el-button>
      <el-button type="default">取消</el-button>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import breadcrumb from '../../../../components/breadcrumb/breadcrumb.vue';
import selects from '../../../../components/selects/select.vue';
import tree from '../../../../components/tree/tree.vue';
export default {
  data () {
    return {
      input: '卓悠网络',
      input2: '.......',
      breadContent: [{ text: '账户权限', path: '/adm/rolemanage'}, { text: '角色管理'}],
      treeData: [{
        id: 1,
        name: '广告主管理',
        children: [{
          id: 4,
          name: '广告管理'
        },{
          id: 5,
          name: '数据管理'
        }]
      }, {
        id: 2,
        name: '广告源配置'
      }, {
        id: 3,
        name: '开发者管理',
        children: [{
          id: 6,
          name: '应用管理'
        }, {
          id: 7,
          name: '数据管理'
        }]
      }, {
        id: 8,
        name: '财务管理',
        children: [{
          id: 9,
          name: '开发者财务信息'
        }, {
          id: 10,
          name: '广告主财务信息'
        }, {
          id: 11,
          name: '广告源财务信息'
        }, {
          id: 12,
          name: '提现/充值'
        }, {
          id: 13,
          name: '命中/退款'
        }]
      }]
    };
  },
  mounted () {

  },
  components: { breadcrumb, selects, tree }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .role-edit-wrapper
    .bread-title-wrapper
      margin-bottom: 15px
    .data-title-wrapper
      padding: 20px
      background: #fff
      border: 1px solid #eee
      .dowm-forward
        margin-bottom: 10px
        width: 300px 
        .el-select
          display: block   
</style>
