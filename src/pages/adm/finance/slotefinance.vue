<template>
  <div class="finance-slote-wrapper">
    <h2>广告源财务信息</h2>
    <div class="slote-top-wrapper clearfix">
      <el-button type="primary" class="pull-left"><router-link to="slote/hit" class="search">命中/激励</router-link></el-button>
      <el-popover width="195" ref="popovers" placement="bottom-start" trigger="click" v-model="visible">
        <div class="popover-wrapper">
          <div class="popover-date-wrapper" style="margin-bottom: 10px;">
            <datepicker :datepickers="datepickers" :picker-options="pickerOptions"></datepicker>
          </div>
          <el-button type="primary" @click="submits">确定</el-button>
          <el-button type="default" @click="visible = false;">取消</el-button>
        </div>
      </el-popover>  
      <el-button type="primary" class="pull-left" v-popover:popovers>触发收入金额</el-button>
      <div class="slote-search pull-right">
        <el-select v-model="channelId" @change="load()" filterable placeholder="全部广告源" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
          <el-option
            v-for="item in channels"
            :key="item.channelCode"
            :label="item.channelName"
            :value="item.channelCode">
          </el-option>
        </el-select>
        <div class="pull-right date-wrapper">
          <datepicker :datepickers="datepickers1" :picker-options="pickerOptions"></datepicker>
          <span class="center-span">至</span>
          <datepicker :datepickers="datepickers2" :picker-option="pickerOptions"></datepicker>
          <el-button type="primary" @click="load()">搜索</el-button>
        </div>
      </div>
    </div>
    <div class="data-total-wrapper">
      <totaldata :items="totalData"></totaldata>
    </div>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column label="日期">
        <template scope="props">
          <span>{{props.row.settleDate | date }}</span> 
        </template>
      </el-table-column>
      <el-table-column prop="channelName" label="广告源名称"></el-table-column>
      <el-table-column label="收入金额（￥）">
        <template scope="props" v-if="props.row.income">
          <span v-if="props.row.income">{{ props.row.income }} <i class="el-icon-edit" @click="showDialog(props.$index, props.row.monthDate, props.row.channelId, props.row.income)"></i></span>
          <span v-else>暂未统计</span>
        </template>
      </el-table-column>
      <el-table-column label="命中金额（￥）">
        <template scope="props">
          <span v-if="props.row.incentiveSub">{{ props.row.incentiveSub }}</span>
          <span v-else>暂未统计</span>
        </template>
      </el-table-column>
      <el-table-column label="激励金额（￥）">
        <template scope="props">
          <span v-if="props.row.incentiveAdd">{{ props.row.incentiveAdd }}</span>
          <span v-else>暂未统计</span>
        </template>
      </el-table-column>
      <el-table-column label="收益（￥）">
        <template scope="props">
          <span v-if="props.row.revenue">{{ props.row.revenue }}</span>
          <span v-else>暂未统计</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pager-wrapper clearfix" v-if="tableData.length">
      <pager :total-records="totalRecords" @pagechange="load" :page-sizes="pageSize" :page-nums="pageNum"></pager>
    </div>
    <el-dialog :visible.sync="dialogVisible" size="tiny">
      <div class="inner-contain">
        <div class="dowm-forward">
          <span class="list-title">收入金额：</span>
          <el-input v-model="income" placeholder="请输入内容"></el-input>
        </div>
        <el-button type="primary" @click="configs()">新建</el-button>
        <el-button type="default" @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="ecmascript-6">
import pager from '../../../components/pager/pager.vue';
import datepicker from '../../../components/datepicker/datepicker.vue';
import totaldata from '../../../components/totaldata/totaldata.vue';
export default {
  data () {
    return {
      totalData: [
        {icon: 'el-icon-star-on', num: 0, text: '收入金额'},
        {icon: 'el-icon-message', num: 0, text: '命中金额'},
        {icon: 'el-icon-share', num: 0, text: '激励金额'},
        {icon: 'el-icon-menu', num: 0, text: '收益'}
      ],
      visible: false,
      channelId: '',
      channels: [],
      tableData: [],
      income: '',
      id: '',
      dates: '',
      $index: -1,
      dialogVisible: false,
      totalRecords: -1,
      pageNum: 1,
      pageSize: 20,
      datepickers: {value: new Date(), align: 'right', type: 'month'},
      datepickers1: {value: new Date(), align: 'right', type: 'month'},
      datepickers2: {value: new Date(), align: 'right', type: 'month'},
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > new Date().getTime();
        },
        onPick (data) {
        }
      },
      loadings: false
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.allsources();
      this.load();
    });
  },
  components: { totaldata, pager, datepicker },
  methods: {
    allsources () {
      this.loadings = true;
      this.$http.get('/v1/dict/types/adSource').then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.channels = result;
      }, () => {this.loadings = false;});
    },
    load (pageNum, pageSize) {
      let params = {};
      params.pageSize = pageSize || this.pageSize;
      params.pageNum = pageNum || this.pageNum;
      params.startDate = this.datepickers1.value.getTime();
      params.endDate = this.datepickers2.value.getTime();
      params.channelCode = this.channelId;
      this.loadings = true;
      this.loadall();
      this.$http.get('/v1/adm/source/finance/{pageNum}/{pageSize}', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.pageSize = result.pageSize;
        this.totalRecords = result.totalRecords;
        this.tableData = result.list;
      }, () => {this.loadings = false;});
    },
    loadall () {
      let params = {};
      params.startDate = this.datepickers1.value.getTime();
      params.endDate = this.datepickers2.value.getTime();
      params.channelCode = this.channelId;
      this.loadings = true;
      this.$http.get('/v1/adm/source/finance/all', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.totalData[0].num = result.income;
        this.totalData[1].num = result.incentiveSub;
        this.totalData[2].num = result.incentiveAdd;
        this.totalData[3].num = result.revenue;
      }, () => {this.loadings = false;});
    },
    showDialog (index, dates, id, income) {
      this.dialogVisible = true;
      this.$index = index;
      this.dates = dates;
      this.id = id;
      this.income = income;
    },
    configs () {
      let params = {};
      params.type = 'INCOME';
      params.monthDate = new Date(this.dates).getTime();
      params.channelCode = this.id;
      params.money = this.income;
      this.loadings = true;
      this.$http.post('/v1/adm/source/finance/one', params).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        this.dialogVisible = false;
        this.load(this.pageNum, this.pageSize);
      }, () => {this.loadings = false;});
    },
    submits () {
      let params = {};
      params.monthDate = this.datepickers.value.getTime();
      this.loadings = true;
      this.$http.post('/v1/adm/source/finance/income', params).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        this.visible = false;
        this.load();
      }, () => {this.loadings = false;});
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .finance-slote-wrapper
    overflow: hidden
    .slote-top-wrapper
      margin-bottom: 15px
      .el-button:first-child
        margin-right: 10px
      .search
        color: #fff
      .slote-search
        min-width: 300px
        font-size: 0
        .center-span
          display: inline-block
          border: 1px solid #bbb
          font-size: 14px
          padding: 10px
          border-left: none
          border-right: none
        .el-select
          margin-right: 10px  
          .el-input__inner
            border-radius: 4px 
        .date-wrapper
          .el-date-editor
            vertical-align: top  
          .el-input
            width: 130px
            .el-input__inner
              border-radius: 4px 0 0 4px  
              height: 35px
            .el-input__inner:last-child
              border-radius: 0
          .el-button 
            border-radius: 0 4px 4px 0
    .data-total-wrapper
      margin-bottom: 15px      
    .pager-wrapper
      margin-top: 15px  
    .el-icon-edit
      cursor: pointer
      color: #61B3D7      
</style>
