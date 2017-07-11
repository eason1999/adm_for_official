<template>
  <div class="resource-all-wrapper">
    <div class="resource-top-wrapper clearfix">
      <el-button type="primary" class="pull-left"><router-link class="search" to="resource/addid">新建广告位ID</router-link></el-button>
      <div class="resource-search pull-right">
        <el-input placeholder="请输入内容" v-model="keywords"></el-input>
        <el-button type="primary" @click="load(1, 20)">搜索</el-button>
      </div>
    </div>
    <el-table :data="tableData" stripe style="width: 100%" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
      <el-table-column type="expand">
        <template scope="props">
          <el-form label-position="left" inline class="demo-table-expand sub-app-form">
            <el-form-item label="广告位类型:">
              <span>{{ props.row.slottype }}</span>
            </el-form-item>
            <el-form-item label="接入形式:">
              <span>{{ props.row.accessFormat }}</span>
            </el-form-item>
            <el-form-item label="ID归属:">
              <span>{{ props.row.idBelongTo | idBelongTo }}</span>
            </el-form-item>
            <el-form-item label="流量类型:">
              <span>{{ props.row.deviceType }}</span>
            </el-form-item>
            <el-form-item label="状态:">
              <span>{{ props.row.slotStatus | status }}</span>
            </el-form-item>
            <el-form-item label="操作:">
              <el-button type="primary" size="small" @click="handleEdit(props.$index, props.row.id)">编辑</el-button>
              <el-button type="primary" :disabled="props.row.slotStatus==='SLOTHITSTATUS'" size="small" @click="handleHit(props.$index, props.row.id)">命中</el-button>
              <el-button :disabled="props.row.slotStatus!=='SLOTONSTATUS'" type="primary" size="small" @click="handleUnbind(props.$index, props.row.id)">解绑</el-button>
              <el-button :disabled="props.row.optimizeStatus!='0'" type="primary" size="small" @click="handleSEO(props.$index, props.row.id)">优化</el-button>
              <el-button type="danger" size="small" @click="handleDelete(props.$index, props.row.id)">删除</el-button>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="createdDate" label="创建日期" show-overflow-tooltip sortable></el-table-column>
      <el-table-column prop="adName" label="广告源" show-overflow-tooltip sortable></el-table-column>
      <el-table-column label="应用名称&ID" show-overflow-tooltip>
        <template scope="scope">
          <a href="javascript:;" @click="getDetail(scope.$index,scope.row.adslotId,scope.row.slotStatus)">
            <p>{{scope.row.appName}}</p>
            <p>ID: {{scope.row.appId}}</p>
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="广告位名称&ID" show-overflow-tooltip>
        <template scope="scope">
          <a href="javascript:;" @click="getDetail(index,scope.row.adslotId,scope.row.slotStatus)">
            <p>{{scope.row.slotname}}</p>
            <p>ID: {{scope.row.adslotId}}</p>
          </a>  
        </template>
      </el-table-column>
    </el-table>
    <div class="pager-wrapper clearfix">
      <pager :total-records="totalRecords" @pagechange="load" :page-sizes="pageSize" :page-nums="pageNum"></pager>
    </div>
    <el-dialog title="ADroi映射" :visible.sync="dialogVisible">
      <el-table :data="gridData">
        <el-table-column property="company" label="广告源"></el-table-column>
        <el-table-column label="应用名称&ID" show-overflow-tooltip>
          <template scope="scope">
            <p>{{scope.row.appName}}</p>
            <p>ID: {{scope.row.appId}}</p>
          </template>
        </el-table-column>
        <el-table-column label="广告位名称&ID" show-overflow-tooltip>
          <template scope="scope">
            <p>{{scope.row.adslotName}}</p>
            <p>ID: {{scope.row.adslotId}}</p>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog class="hit-date-range" title="命中周期" :visible.sync="dateVisible">
      <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
        <el-form-item label="起始时间：">
          <datepicker :datepickers="firsts" :picker-options="firstoptions"></datepicker>
        </el-form-item>
        <el-form-item label="结束时间：">
          <datepicker :datepickers="lasts" :picker-options="lastoptions"></datepicker>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="uphitdate">确 定</el-button>
      <el-button @click="dateVisible = false">取 消</el-button>
    </el-dialog>
  </div>
</template>

<script type="ecmascript-6">
import pager from '../../../../components/pager/pager.vue';
import datepicker from '../../../../components/datepicker/datepicker.vue';
export default {
  data () {
    return {
      tableData: [],
      gridData: [],
      totalRecords: -1,
      pageNum: 1,
      pageSize: 20,
      type: 'ALL',
      keywords: '',
      dialogVisible: false,
      dateVisible: false,
      loadings: false,
      // 命中时间参数
      hitid: -1,
      labelPosition: 'top',
      firsts: {value: new Date(new Date().getTime()), align: 'left', type: 'date'},
      firstoptions: {
        disabledDate (time) {
          return time.getTime() > new Date().getTime();
        }
      },
      lasts: {value: new Date(new Date().getTime()), align: 'left', type: 'date'},
      lastoptions: {
        disabledDate (time) {
          return time.getTime() > new Date().getTime();
        }
      }
    };
  },
  filters: {
    idBelongTo (val) {
      let item;
      switch (val) {
        case 'selfuse':
          item = '平台';
          break;
        case 'otheruse':
          item = '外放';
          break;  
      }
      return item;
    },
    status (val) {
      let item;
      switch (val) {
        case 'SLOTONSTATUS':
          item = '已使用';
          break;
        case 'SLOTB4STATUS':
          item = '待使用';
          break;  
      }
      return item;
    }
  },
  components: { pager, datepicker },
  mounted () {
    this.$nextTick(() => {
      this.load();
    });
  },
  methods: {
    load (pageNum, pageSize) {
      this.loadings = true;
      let params = {};
      params.keywords = this.keywords;
      params.pageSize = pageSize || this.pageSize;
      params.pageNum = pageNum || this.pageNum;
      params.type = this.type;
      this.$http.get('/v1/source/sourceList/{pageNum}/{pageSize}', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.data;
        if (data.ret!=1) {
          this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.pageSize = result.pageSize;
        this.pageNum = result.pageNum;
        this.totalRecords = result.totalRecords;
        this.tableData = result.results;
      }, () => {
        this.loadings = false;
      });
    },
    getDetail (index,id,accessFormat) {
      let params = {};
      params.dspadslotid = id;
      params.slotStatus = accessFormat;
      this.loadings = true;
      this.$http.get('/v1/source/subList', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret !=1 ) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        this.dialogVisible = true;
        let result = data.result;
        this.gridData = result;
      }, () => {this.loadings = false;});
    },
    handleEdit (index, id) {
      this.$router.push({
        path: '/adm/resource/addid',
        query: {
          id: id
        }
      });
    },
    handleUnbind (index, id) {
      this.$confirm('确定解绑吗？？？').then((res) => {
        if (res === 'confirm') {
          this.loadings = true;
          this.$http.post('/v1/source/sourceBo/free/'+id).then((res) => {
            this.loadings = false;
            let data = res.body;
            if (data.ret!=1) {
              return this.$alert(data.message, '提示：', {
                confirmButtonText: '确定'
              });
            }
            this.load();
          }, ()=> {this.loadings = false;});
        }
      }).catch((res) => {console.log(res)});
    },
    handleSEO (index, id) {
      this.$confirm('确定优化吗？？？').then((res) => {
        if (res === 'confirm') {
          this.loadings = true;
          this.$http.post('/v1/source/sourceBo/optimize/'+id).then((res) => {
            this.loadings = false;
            let data = res.body;
            if (data.ret!=1) {
              return this.$alert(data.message, '提示：', {
                confirmButtonText: '确定'
              });
            }
            this.load();
          }, ()=> {this.loadings = false;});
        }
      }).catch((res) => {console.log(res)});
    },
    handleDelete (index, id) {
      this.$confirm('确定删除吗？？？').then((res) => {
        if (res === 'confirm') {
          this.loadings = true;
          this.$http.post('/v1/source/'+id+'/adchannel').then((res) => {
            this.loadings = false;
            let data = res.body;
            if (data.ret!=1) {
              return this.$alert(data.message, '提示：', {
                confirmButtonText: '确定'
              });
            }
            this.load();
          }, ()=> {this.loadings = false;});
        }
      }).catch((res) => {console.log(res)});
    },
    handleHit (index, id) {
      this.hitid = id;
      this.dateVisible = true;
    },
    uphitdate () {
      if(this.firsts.value > this.lasts.value){
        return this.$alert('起始时间不能大于结束时间！', '提示：', {
          confirmButtonText: '确定'
        });
      }
      let params = {};
      params.id=this.hitid;
      params.startDate = this.firsts.value.getTime();
      params.endDate = this.lasts.value.getTime();
      this.loadings = true;
      this.$http.get('/v1/source/sourceBo/hit/{id}', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        this.dateVisible = false;
        this.load();
      }, () => {this.loadings = false;});
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .resource-all-wrapper
    overflow: hidden
    .resource-top-wrapper
      margin-bottom: 15px
      .search 
        color: #fff
      .resource-search
        max-width: 300px
        font-size: 0
        .el-input
          width: 230px
          input
            border-radius: 4px 0 0 4px
        button 
          border-radius: 0 4px 4px 0
    .pager-wrapper
      margin-top: 15px  
    .el-table
      .el-button
        margin: 2px   
    .sub-app-form
        padding: 10px
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
    .hit-date-range
      .el-date-editor
        width: 300px               
</style>
