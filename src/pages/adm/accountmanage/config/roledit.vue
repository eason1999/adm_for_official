<template>
  <div class="role-edit-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="data-title-wrapper">
      <el-form :model="ruleForm" :rules="rules" :label-position="labelPosition" ref="ruleForm">
        <el-form-item label="用户属性：">
          <el-select v-model="userid" filterable placeholder="请选择" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
            <el-option v-for="item in users" :key="item.id" :label="item.text" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色：" prop="rolename">
          <el-input v-model="ruleForm.rolename" placeholder="请输入内容"></el-input>
        </el-form-item>
        <div class="dowm-forward">
          <span class="list-title">页面权限：</span>
          <el-tree :data="treeData" show-checkbox node-key="id" ref="tree" accordion highlight-current :props="defaultProps" :default-checked-keys="defaults">
          </el-tree>
        </div>
        <div class="dowm-forward page-control">
          <div class="data-item">
            <ul class="form-control parentUl">
              <li class="graPaLi" v-for="(data0, index0) in datas0">
                <span class="list-title">{{data0.name}}：</span>
                <ul class="disInline wrapUl"><!-- v-if="idArr.indexOf(data0.id)>-1"-->
                  <li class="innerLi" v-for="(data1,index1) in datas0[index0].items" v-if="idArr.indexOf(data1.id)>-1">
                    <span class="padBoth">{{data1.name}}</span>
                    <ul class="disInline innerUl">
                      <li class="innerTwoLi" v-for="(data2,index2) in datas0[index0].items[index1].items">
                        <span class="padRight">{{data2.name}}</span>
                        <ul class="disInline innerTwoUl clearfix">
                          <li class="pull-left subSonLi" v-if="datas0[index0].items[index1].items[index2].dataColumnItems">
                            <el-checkbox-group v-model="checkColum">
                              <el-checkbox v-for="(data,index) in datas0[index0].items[index1].items[index2].dataColumnItems" :label="data.id" :key="data.id">{{data.text}}</el-checkbox>
                            </el-checkbox-group>
                          </li>
                          <li class="pull-left subSonLi" v-else>
                            <el-checkbox-group v-model="checkItem">
                              <el-checkbox v-for="(data,index) in datas0[index0].items[index1].items[index2].actionItems" :label="data.id" :key="data.id">{{data.text}}</el-checkbox>
                            </el-checkbox-group>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
        <el-form-item>
          <el-button type="primary" @click="creates('ruleForm')">新建</el-button>
          <el-button type="default" @click="back">取消</el-button>
        </el-form-item>
      </el-form>    
    </div>
  </div>
</template>

<script type="ecmascript-6">
import breadcrumb from '../../../../components/breadcrumb/breadcrumb.vue';
export default {
  data () {
    return {
      id: this.$route.query.id,
      name: this.$route.query.name,
      defaults: [1, 3, 4, 5, 6, 7, 8, 17, 26, 27, 28, 33, 34, 43, 47],
      users: [{id: 0, text: '开发者'}, {id: 1, text: '广告主'}, {id: 2, text: '管理员'}],
      userid: 2,
      ruleForm: {
        rolename: ''
      },
      rules: {
        rolename: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      labelPosition: 'top',
      breadContent: [{ text: '账户权限', path: '/adm/rolemanage'}, { text: '角色管理'}],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treeData: [],
      checkColum: ['5', '4', '3', '2', '1', '6', '18', '23', '24', '8', '9', '12', '13', '14', '15', '17', '19', '20', '21', '22', '25'],
      checkItem: ['1', '2', '3', '4', '5', '8', '7', '6', '9', '10', '11'],
      //存储数据项、操作项id
      advActionArr: [],
      advDataArr: [],
      devActionArr: [],
      devDataArr: [],
      datas0: [],
      loadings: false
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.getoptions();
      this.getmenus();
      if (this.id) {
        this.editrole();
      }
    });
  },
  computed: {
    idArr () {
      let item;
      item = this.$refs.tree.getCheckedKeys();
      return item;
    }
  },
  components: { breadcrumb },
  methods: {
    editrole () {
      if (this.name) {
        this.ruleForm.rolename = this.name;
      }
      let params = {};
      params.roleId = this.id;
      this.loadings = true;
      this.$http.get('/v1/adm/authority/{roleId}/roleauth', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.$refs.tree.setCheckedKeys(result.menus);
        let dataColumns = [], actions = [];
        if (result.dataColumns.length) {
          for (var i=0; i < result.dataColumns.length; i++) {
            dataColumns.push(result.dataColumns[i].toString());
          }
          this.checkColum = dataColumns;
        }else{
          this.checkColum = result.dataColumns;
        }
        if (result.actions.length) {
          for(var j=0; j<result.actions.length; j++){
            actions.push(result.actions[j].toString());
          }
          this.checkItem = actions;
        } else {
          this.checkItem = result.actions;
        }
      }, () => {this.loadings = false;});
    },
    // 操作项和数据项id预处理
    dealId (res) {
      let result = res;
      for (var i = 0; i < result.length ; i++) {
        for (var j = 0; j < result[i].items.length; j++) {
          if (result[i].items[j].id==9) {
            for (var a=0;a<result[i].items[j].items.length;a++) {
              if (result[i].items[j].items[a].actionItems&&result[i].items[j].items[a].actionItems.length) {
                for (var c=0;c<result[i].items[j].items[a].actionItems.length;c++) {
                  this.advActionArr.push(result[i].items[j].items[a].actionItems[c].id);
                }
              }
            }
          } else if (result[i].items[j].id==10) {
            for (var b=0;b<result[i].items[j].items.length;b++) {
              if (result[i].items[j].items[b].dataColumnItems&&result[i].items[j].items[b].dataColumnItems.length) {
                for (var d=0;d<result[i].items[j].items[b].dataColumnItems.length;d++) {
                  this.advDataArr.push(result[i].items[j].items[b].dataColumnItems[d].id);
                }
              }
            }
          } else if (result[i].items[j].id==15) {
            for (var m=0;m<result[i].items[j].items.length;m++) {
              if (result[i].items[j].items[m].actionItems&&result[i].items[j].items[m].actionItems.length) {
                for (var n=0;n<result[i].items[j].items[m].actionItems.length;n++) {
                  this.devActionArr.push(result[i].items[j].items[m].actionItems[n].id);
                }
              }
            }
          } else if (result[i].items[j].id==16) {
            for (var o=0;o<result[i].items[j].items.length;o++) {
              if (result[i].items[j].items[o].dataColumnItems&&result[i].items[j].items[o].dataColumnItems.length) {
                for (var p=0;p<result[i].items[j].items[o].dataColumnItems.length;p++) {
                  this.devDataArr.push(result[i].items[j].items[o].dataColumnItems[p].id);
                }
              }
            }
          }
        }
      }
    },
    getoptions () {
      this.loadings = true;
      this.$http.get('/v1/adm/authority/options').then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.datas0 = result;
        this.dealId(result);
      }, () => {this.loadings = false;});
    },
    getmenus () {
      this.loadings = true;
      this.$http.get('/v1/adm/newAllMenus').then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.treeData = result;
      }, () => {this.loadings = false;});
    },
    // 向后台传值前处理数据项、操作项
    dealAcData () {
      console.log(this.checkItem);
      console.log(this.checkColum);
      let advAdItem = this.$refs.tree.getCheckedKeys().indexOf(9),
          devAppItem = this.$refs.tree.getCheckedKeys().indexOf(15),
          advDataItem = this.$refs.tree.getCheckedKeys().indexOf(10),
          devDataItem = this.$refs.tree.getCheckedKeys().indexOf(16);
      // 操作项预处理
      if (advAdItem > -1 && devAppItem === -1) {
        for (var o = this.checkItem.length - 1; o >= 0; o--) {
            var m = this.checkItem[o];
            for (var p = this.devActionArr.length - 1; p >= 0; p--) {
                var n = this.devActionArr[p];
                if (m == n) {
                    this.checkItem.splice(o, 1);
                    break;
                }
            }
        }
      } else if ( advAdItem === -1 && devAppItem > -1) {
        for (var i = this.checkItem.length - 1; i >= 0; i--) {
            var a = this.checkItem[i];
            for (var j = this.advActionArr.length - 1; j >= 0; j--) {
                var b = this.advActionArr[j];
                if (a == b) {
                    this.checkItem.splice(i, 1);
                    break;
                }
            }
        }
      } else if ( advAdItem === -1 && devAppItem === -1) {
        this.checkItem = [];
      }
      //数据项处理
      if (advDataItem > -1 && devDataItem === -1) {
        for (var q = this.checkColum.length - 1; q >= 0; q--) {
            var z = this.checkColum[q];
            for (var w = this.devDataArr.length - 1; w >= 0; w--) {
                var x = this.devDataArr[w];
                if (z == x) {
                    this.checkColum.splice(q, 1);
                    break;
                }
            }
        }
      } else if (advDataItem === -1 && devDataItem > -1) {
        for (var g = this.checkColum.length - 1; g >= 0; g--) {
            var y = this.checkColum[g];
            for (var h = this.advDataArr.length - 1; h >= 0; h--) {
                var t = this.advDataArr[h];
                if (y == t) {
                    this.checkColum.splice(g, 1);
                    break;
                }
            }
        }
      } else if (advDataItem ===-1 && devDataItem === -1) {
        this.checkColum = [];
      }
    },
    creates (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return this.$alert('请正确输入相应选项！！！', '提示：', {
            confirmButtonText: '确定'
          });
        } else if (!this.$refs.tree.getCheckedKeys().length) {
          return this.$alert('请选择相应页面权限！！！', '提示：', {
            confirmButtonText: '确定'
          });
        } else {
          this.subcreate();
        }
      });
    },
    subcreate () {
      this.dealAcData();
      let menuIds = this.$refs.tree.getCheckedKeys().join(','),
        actionIds = this.checkItem.join(','),
        columnIds = this.checkColum.join(',');
      let params = {};
      params.roleName = this.ruleForm.rolename;
      params.memuIds = menuIds;
      params.actionIds = actionIds;
      params.columnIds = columnIds;
      params.plantForm = this.userid;
      if (this.id) {
        params.roleId = this.id;
      }
      this.loadings = true;
      // 0---开发者;1---广告主;2---管理员
      this.$http.post('/v1/adm/menu/usermenu', params).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示', {
              confirmButtonText: '确定'
          });
        } else {
          return this.$alert('新建成功!!!', '提示', {
              confirmButtonText: '确定',
              callback: () => {
                this.back();
              }
          });
        }
      }, () => {this.loadings = false;});
    },
    back () {
      this.$router.push({
        path: '/adm/rolemanage'
      });
    }
  }
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
      .el-form-item
        width: 280px
        .el-select
          display: block
        .el-input
          display: block
          width: 100%
        &:last-child
          margin-bottom: 0  
      .dowm-forward
        margin-bottom: 20px
        width: 280px 
        .el-select
          display: block   
        .data-item
          .parentUl
            width: 100%
            border: 0
            list-style: none
            margin-bottom: 15px
            // min-height: 250px 
            .graPaLi
              // min-height: 115px
              position: relative
              margin-bottom: 15px
              .list-title
                vertical-align: top
              .wrapSpan
                position: absolute
                top: 0
                left: 0
                font-weight: 700
              .wrapUl
                // position: absolute
                // top: 0
                // left: 100px
                // width: 100%
                .innerLi
                  position: relative
                  min-height: 30px
                  .padBoth
                    position: absolute
                    top: 0
                    left: 0
                    color: #aaa
                    padding:0 30px 0 10px
                  .innerUl
                    position: relative
                    top: 0
                    left: 100px
                    .innerTwoLi
                      position: relative
                      .padRight
                        position: absolute
                        top: 0
                        padding:0 40px 0 10px
                        width: 100px
                        color: #aaa
                      .innerTwoUl
                        position: relative
                        left: 80px
                        .subSonLi
                          margin-right: 10px
                          label
                            font-weight: 500
                          .el-checkbox 
                            margin-left: 0
                            margin-right: 15px 
                            margin-bottom: 20px  
              .disInline
                display: inline-block
                width: 90%
                label
                  width: auto
                input
                  vertical-align: -2px
                  margin-right: 3px
      .page-control
        width: 100% 
        font-size: 14px  
        padding-top: 10px            
</style>
