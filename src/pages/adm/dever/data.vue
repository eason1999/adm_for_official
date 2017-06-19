<template>
  <div class="dev-data-wrapper">
    <h2>数据管理</h2>
    <div class="data-title-wrapper clearfix">
      <el-button type="primary" class="pull-left"><router-link class="search" to="data/selfind">自定义查询</router-link></el-button>
      <div class="data-select-wrapper pull-right">
        <div class="adver-select inline-block">
          <selects></selects>
        </div>
        <div class="plan-select inline-block">
          <selects></selects>
        </div>
        <div class="create-select inline-block">
          <selects></selects>
        </div>
        <div class="datepicker-wrapper inline-block">
          <datepicker :datepickers="datepickers" :picker-options="pickerOptions"></datepicker>
        </div>
      </div>
    </div>
    <div class="data-total-wrapper">
      <totaldata :items="items"></totaldata>
    </div>
    <div class="echarts-wrapper">
      <div id="charts" class="chart-cnt"></div>
      <div v-show="false" class="chart-empty">抱歉，暂无数据！</div>
    </div>
    <div class="data-table-wrapper">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="date" label="日期"  width="180"></el-table-column>
        <el-table-column prop="name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
      </el-table>
    </div>
    <div class="data-footer-wrapper clearfix">
      <el-button type="primary" class="pull-left">导出EXCEL</el-button>
      <div class="page-wrapper pull-right">
        <pager :total-records="totalRecords" :page-sizes="pageSize" :page-nums="pageNum"></pager>
      </div>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import selects from '../../../components/selects/select.vue';
import datepicker from '../../../components/datepicker/datepicker.vue';
import totaldata from '../../../components/totaldata/totaldata.vue';
import pager from '../../../components/pager/pager.vue';
import echarts from 'echarts';
export default {
  data () {
    return {
      items: [
        {icon: 'el-icon-star-on',num: 0,text: '展现数'},
        {icon: 'el-icon-message',num: 0,text: '点击数'},
        {icon: 'el-icon-share',num: 0,text: '点击率'},
        {icon: 'el-icon-menu',num: 0,text: '消费'}
      ],
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎1',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      totalRecords: 100,
      pageNum: 1,
      pageSize: 10,
      datepickers: {value:'', align: 'right', type: 'daterange'},
      pickerOptions: {}
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.drawChart();
    });
  },
  components: { selects, datepicker, totaldata, pager },
  methods: {
    drawChart () {
      var myChart = echarts.init(document.getElementById('charts'));
      var option = {
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        };
      
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .dev-data-wrapper
    .data-title-wrapper
      margin-bottom: 15px
      .search
        color: #fff
      .data-select-wrapper
        font-size: 0
        .inline-block
          margin-left: 10px
      @media screen and (max-width: 1280px)
        .inline-block
          width: 150px
    .data-total-wrapper
      margin-bottom: 15px      
    .echarts-wrapper
      width: 100% 
      border: 1px solid #eee
      background: #fff 
      margin-bottom: 20px
      .chart-cnt
        width: 100%
        height: 400px  
    .data-table-wrapper
      margin-bottom: 20px     
</style>
