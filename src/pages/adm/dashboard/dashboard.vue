<template>
  <div class="dashboard-data-wrapper">
    <h2>ADroi平台数据报表</h2>
    <div class="data-title-wrapper clearfix">
      <div class="sub-date pull-right">
        <datepicker :picker-options="pickerOptions" :datepickers="datepickers"></datepicker>
      </div>
    </div>
    <div class="data-total-wrapper">
      <div class="tab-page-wrapper">
        <tabpage :tabs="tabs"></tabpage>
      </div>
      <totaldata :items="items"></totaldata>
    </div>
    <div class="echarts-wrapper">
      <div id="charts" class="chart-cnt"></div>
      <div v-show="false" class="chart-empty">抱歉，暂无数据！</div>
    </div>
    <div class="data-table-wrapper">
      <el-row :gutter="10">
        <el-col :span="12">
          <div id="resourceCharts" class="chart-cnt" style="background: #fff"></div>
          <div v-show="false" class="chart-empty">抱歉，暂无数据！</div>
        </el-col>
        <el-col :span="12">
          <div id="mediaCharts" class="chart-cnt" style="background: #fff"></div>
          <div v-show="false" class="chart-empty">抱歉，暂无数据！</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import selects from '../../../components/selects/select.vue';
import datepicker from '../../../components/datepicker/datepicker.vue';
import totaldata from '../../../components/totaldata/totaldata.vue';
import tabpage from '../../../components/tabpage/tabpage.vue';
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
      tabs: [
        {name: 'first', text: '横幅'},
        {name: 'second', text: '开屏'},
        {name: 'third', text: '插屏'},
        {name: 'fourth', text: '信息流'}
      ],
      datepickers: {value:'', align: 'right', type: 'daterange'},
      pickerOptions: {
        shortcuts: [{
          text: '昨日数据',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一周数据',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '近一个月数据',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '近三个月数据',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.drawChart();
      this.mediaChart();
      this.resourceChart();
    });
  },
  components: { selects, datepicker, totaldata, tabpage },
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
    },
    resourceChart () {
      var myChart = echarts.init(document.getElementById('resourceCharts'));
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
    },
    mediaChart () {
      var myChart = echarts.init(document.getElementById('mediaCharts'));
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
  .dashboard-data-wrapper
    .data-title-wrapper
      margin-bottom: 15px
      .sub-date
        width: 220px
    .data-total-wrapper
      margin-bottom: 15px  
      padding: 10px
      border: 1px solid #eee
      background: #fff
      .el-row   
        .grid-wrapper 
          box-shadow: 0 0 2px rgba(0, 0, 0, 0.3)
    .echarts-wrapper
      width: 100% 
      border: 1px solid #eee
      background: #fff 
      margin-bottom: 20px
      .chart-cnt
        width: 100%
        height: 400px  
    .data-table-wrapper
      width: 100% 
      margin-bottom: 20px
      .chart-cnt
        width: 100%
        height: 400px
        border: 1px solid #eee   
</style>
