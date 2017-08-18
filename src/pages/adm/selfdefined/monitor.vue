<template>
  <div class="selfdefined-monitor-wrapper">
    <h2>监测代码</h2>
    <div class="monitor-top-wrapper clearfix">
      <el-button type="primary" class="pull-left"><router-link class="search" to="monitor/create">新建监测</router-link></el-button>
      <div class="apps-search pull-right">
        <el-input placeholder="请输入内容" v-model="keyword" @keyup.native.enter="load()"></el-input>
        <el-button type="primary" @click="load()">搜索</el-button>
      </div>
    </div>
    <el-table :data="tableData" stripe style="width: 100%" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
      <el-table-column prop="mediaName" label="名称(中文)"></el-table-column>
      <el-table-column prop="slot" label="广告位"></el-table-column>
      <el-table-column prop="type" label="监测类型"></el-table-column>
      <el-table-column prop="trackUrl" label="监测地址" show-overflow-tooltip></el-table-column>
      <el-table-column prop="date" label="日期" sortable></el-table-column>
      <el-table-column label="操作"> 
      	<template scope="props">
        	<el-button type="info" size="small" @click="updates(props.row.autoId, props.row.mediaName, props.row.media, props.row.type, props.row.targetUrl, props.row.slot)" >修改</el-button>
            <el-button type="danger" size="small" @click="deletes(props.row.autoId)">删除</el-button>
      	</template>
      </el-table-column>
    </el-table>
    <div class="pager-wrapper clearfix" v-if="tableData.length">
      <pager :total-records="totalRecords" @pagechange="load" :page-sizes="pageSize" :page-nums="pageNum"></pager> 
    </div>
  </div>
</template>

<script type="ecmascript-6">
import pager from '../../../components/pager/pager.vue';
export default {
  data () {
    return {
      tableData: [],
      totalRecords: -1,
      pageNum: 1,
      pageSize: 20,
      keyword: '',
      loadings: false
    };
  },
  components: { pager },
  mounted () {
  	this.$nextTick(() => {
  		this.load();
  	});
  },
  methods: {
    load (pageNum, pageSize) {
      let params = {};
      params.pageNum = pageNum || this.pageNum;
      params.pageSize = pageSize || this.pageSize;
      params.keywords = this.keyword;
      // 加载数据字典 广告位置
      this.loadings = true;
      this.$http.get("/v1/adm/track/getlist/{pageNum}/{pageSize}", {params: params}).then((res) => {
        this.loadings = false;
        let data = res.data;
        if (data.ret != 1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.tableData = result.list; 
        this.pageSize = result.pageSize;
        this.totalRecords = result.totalRecords;
		}, () => {this.loadings = false});
  	},
  	updates (id, medianame, medias, type, targeturl, slot) {
      let item;
      if (type === '点击') {
        item = 'CLICK';
      } else if (type === '展现') {
        item = 'VIEW';
      }
      this.$router.push({
        path: '/adm/selfdefined/monitor/create',
        query: {
          id: id,
          type: item,
          slot: slot,
          medias: medias,
          medianame: medianame,
          targeturl: targeturl
        }
      });
  	},
    deletes (id) {
      return this.$confirm('确定删除吗？此操作不可逆！').then(() => {
        this.subdeletes(id);
      }).catch(() => {});
    },
    subdeletes (id) {
      let params = {};
          params.id = id;
      this.loadings = true;
      this.$http.post('/v1/adm/track/remove', params).then((res) => {
        this.loadings = false;
        var data = res.data;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
			confirmButtonText: '确定'
          });
        }
        this.load();
      }, () => {this.loadings = false});
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .selfdefined-monitor-wrapper
    overflow: hidden
    .monitor-top-wrapper 
      margin-bottom: 15px
      .apps-search
        max-width: 300px
        font-size: 0
        .el-input
          width: 230px
          vertical-align: top
          input
            border-radius: 4px 0 0 4px
            height: 35px
        button 
          border-radius: 0 4px 4px 0
      .search
        color: #fff
        .el-input
          width: 230px
          input
            border-radius: 4px 0 0 4px
        button 
          border-radius: 0 4px 4px 0
    .pager-wrapper
      margin-top: 15px      
</style>
