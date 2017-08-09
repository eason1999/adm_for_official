<template>
  <div class="dashboard-data-wrapper">
    <h2>ADroi平台数据报表</h2>
    <div class="data-title-wrapper clearfix">
      <div class="sub-date pull-right">
        <datepicker :picker-options="pickerOptions" @datechange="load" :datepickers="datepickers"></datepicker>
      </div>
    </div>
    <div class="data-total-wrapper">
      <div class="tab-page-wrapper">
        <tabpage :tabs="tabs" :currentab="currentabs" @update:currentab="(val) => {currentabs = val;this.loadall();}"></tabpage>
      </div>
      <totaldata :items="totalData"></totaldata>
    </div>
    <div class="echarts-wrapper">
      <div id="charts" class="chart-cnt"></div>
      <div v-show="false" class="chart-empty">抱歉，暂无数据！</div>
    </div>
    <div class="data-table-wrapper">
      <el-row :gutter="10" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
        <el-col :span="12">
          <div class="chart-left-wrapper">
            <div id="resourceCharts" class="chart-cnt"></div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="chart-left-wrapper">
            <div id="mediaCharts" class="chart-cnt"></div>
          </div>  
          <div v-show="false" class="chart-empty">抱歉，暂无数据！</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import datepicker from '../../../components/datepicker/datepicker.vue';
import totaldata from '../../../components/totaldata/totaldata.vue';
import tabpage from '../../../components/tabpage/tabpage.vue';
import echarts from 'echarts';
export default {
  data () {
    return {
      totalData: [
        {icon: 'el-icon-star-on',num: 0,text: '展现数'},
        {icon: 'el-icon-message',num: 0,text: '点击数'},
        {icon: 'el-icon-share',num: 0,text: 'eCPM'},
        {icon: 'el-icon-menu',num: 0,text: '收益'}
      ],
      tabs: [
        {name: 'first', text: '横幅'},
        {name: 'second', text: '开屏'},
        {name: 'third', text: '插屏'},
        {name: 'fourth', text: '信息流'}
      ],
      currentabs: 'first',
      datepickers: {value:[new Date(new Date().getTime()-7*24*3600*1000), new Date()], align: 'right', type: 'daterange'},
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
        }],
        disabledDate (time) {
          return time.getTime() > new Date().getTime();
        }
      },
      loadings: false
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.load();
    });
  },
  components: { datepicker, totaldata, tabpage },
  methods: {
    loadall () {
      let params = {};
      let dateitem;
      dateitem = this.$on('pick').datepickers.value;
      params.startDate = dateitem[0].getTime();
      params.endDate =  dateitem[1].getTime();
      switch (this.currentabs) {
        case 'first':
          params.type = 'BANNER';
          break;
        case 'second':
          params.type = 'SPLASH';
          break;
        case 'third':
          params.type = 'INTERSTITIAL';
          break;
        case 'fourth':
          params.type = 'NATIVE';
          break;
      };
      this.loadings = true;
      this.$http.get('/v1/adm/summary', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          this.totalData[0].num = 0;
          this.totalData[1].num = 0;
          this.totalData[2].num = 0;
          this.totalData[3].num = 0;
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.totalData[0].num = result.Impl;
        this.totalData[1].num = result.click;
        this.totalData[2].num = result.ecmp;
        this.totalData[3].num = result.charge;
      }, () => {this.loadings = false;});
    },
    load () {
      let params = {};
      let dateitem;
      dateitem = this.$on('pick').datepickers.value;
      params.startDate = dateitem[0].getTime();
      params.endDate =  dateitem[1].getTime();
      this.loadings = true;
      this.loadall();
      this.$http.get('/v1/adm/dashboarddata', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.drawChart(result.rangeDataList);
        this.mediaChart(result.mediaDataList);
        this.resourceChart(result.adSourcedataList);
      }, () => {this.loadings = false;});
    },
    resourceChart (result) {
      var myChart = echarts.init(document.getElementById('resourceCharts'));
      var option = {
          title: {
            text: '广告源数据',
            textAlign: 'left',
            textStyle: {
              color: '#333',
              fontWeight: 'normal',
              fontFamily: '微软雅黑',
              fontSize: 18
            },
            top: 10,
            left: 10
          },
          tooltip : {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
              label: {
                  backgroundColor: '#6a7985'
              }
            },
            formatter: function(a){
              var returnData = "";
              returnData += a[0].name+'<br/>';
              for(var i=0;i<a.length;i++){
                var data = a[i].data;
                if(a[i].value == undefined){
                  data = 0;
                }
                if(a[i].seriesName == '展现数'||a[i].seriesName == '点击数'){
                  a[i].seriesName += '（万）';
                }
                returnData += '<div><i style="display:inline-block;height:10px;width:10px;border-radius:50%;background:'+a[i].color+';"></i>'+' '+a[i].seriesName+' : '+data+'</div>';
              }
              return returnData;
            }
          },
          legend: {
            top: "10",
            left: "30%",
            data: ['展现数', '点击数', 'eCPM', '收益']
          },
          toolbox: {
            show : true,
            feature : {
              mark : {show: false},
              dataView : {show: false, readOnly: false},
              magicType : {show: false, type: ['line', 'bar']},
              restore : {show: false},
              saveAsImage : {}
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              trigger: 'axis',
              data: result.name,
              axisLine: {
                lineStyle: {
                  color: '#ccc'
                }
              },
              axisLabel:{
                textStyle:{
                  fontSize:12,
                  color:'#333'
                },
                interval:0,//横轴信息全部显示
                rotate: 20 //60度角倾斜显示
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              splitNumber: 10,
              axisLabel: {
                formatter: function (value) {
                  return value;
                }
              },
              splitLine: {
                show: false,
                  lineStyle: {
                      type: 'dashed'
                  }

              },
              axisLabel: {
                textStyle: {
                  fontSize: 12,
                  color: '#a4a4a4'
                }
              },
              axisLine: {
                show:false
              },
              axisTick: {
                show:false
              }
            },
            {
              type: 'value',
              splitNumber: 10,
              axisLabel: {
                formatter: function (value) {
                  return value;
                }
              },
              axisLabel: {
                textStyle: {
                  fontSize: 12,
                  color: '#a4a4a4'
                }
              },
              splitLine: {
                  show: false
              },
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              }
            }
          ],
          series: [
                {
                  name: '展现数',
                  type: 'bar',
                  data: result.Impl,
                  itemStyle: {
                    normal: {
                      color: '#66C3F9'
                    }
                  },
                  yAxisIndex: 0  
                },
                {
                  name: '点击数',
                  type: 'bar',
                  data: result.click,
                  itemStyle: {
                    normal: {
                      color: '#ACDD96'
                    }
                  },
                  yAxisIndex: 0
                },
                {
                  name: 'eCPM',
                  type: 'bar',
                  data: result.ecmp,
                  itemStyle: {
                    normal: {
                      color: '#FFD155'
                    }
                  },
                  yAxisIndex: 1
                },
                {
                  name: '收益',
                  type: 'bar',
                  data: result.charge,
                  itemStyle: {
                    normal: {
                      color: '#FD2222'
                    }
                  },
                  yAxisIndex: 0
                }
            ]
        };
      
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    drawChart (result) {
      var myChart = echarts.init(document.getElementById('charts'));
      var option = {
          title: {
            text: '数据汇总',
            textAlign: 'left',
            textStyle: {
              color: '#333',
              fontWeight: 'normal',
              fontFamily: '微软雅黑',
              fontSize: 18
            },
            top: 10,
            left: 10
          },
          tooltip : {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                  backgroundColor: '#6a7985'
              }
            },
            formatter: function(a){
              var returnData = "";
              returnData += a[0].name+'<br/>';
              for (var i=0;i<a.length;i++) {
                var data = a[i].data;
                if(a[i].value == undefined){
                  data = 0;
                }
                returnData += '<div><i style="display:inline-block;height:10px;width:10px;border-radius:50%;background:'+a[i].color+';"></i>'+' '+a[i].seriesName+' : '+data+'</div>';
              }
              return returnData;
            }
          },
          legend: {
            top: "bottom",
            data: ['展现数', '点击数', 'eCPM', '收益']
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap : false,
              data: result.date,
              axisLine: {
                lineStyle: {
                  color: '#ccc'
                }
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              splitNumber: 10,
              axisLabel: {
                formatter: function (value) {
                  return value;
                }
              },
              splitLine: {
                show: false,
                  lineStyle: {
                      type: 'dashed'
                  }

              },
              axisLabel: {
                textStyle: {
                  fontSize: 12,
                  color: '#a4a4a4'
                }
              },
              axisLine: {
                show:false
              },
              axisTick: {
                show:false
              }
            },
            {
              type: 'value',
              splitNumber: 10,
              axisLabel: {
                formatter: function (value) {
                  return value;
                }
              },
              axisLabel: {
                textStyle: {
                  fontSize: 12,
                  color: '#a4a4a4'
                }
              },
              splitLine: {
                  show: false
              },
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              }
            }
          ],
          series: [
            {
              name: '展现数',
              type: 'line',
              data: result.Impl,
              lineStyle: {
                normal: {
                  width: 2,
                  color: '#66C3F9'
                }
              },
              itemStyle: {
                normal: {
                  color: '#66C3F9'
                }
              },
              symbolSize: function(){return 5;},
              smooth: true,
              yAxisIndex: 0,
              areaStyle: {
                normal: {
                  color: '#E0F3FE'
                }
              }  
            },
            {
              name: '点击数',
              type: 'line',
              data: result.click,
              lineStyle: {
                normal: {
                  width: 2,
                  color: '#ACDD96'
                }
              },
              itemStyle: {
                normal: {
                  color: '#ACDD96'
                }
              },
              symbolSize: function(){return 5;},
              smooth: true,
              yAxisIndex: 0,
              areaStyle: {
                normal: {
                  color: '#EEF8EA'
                }
              }
            },
            {
              name: 'eCPM',
              type: 'line',
              data: result.ecmp,
              lineStyle: {
                normal: {
                  width: 2,
                  color: '#FFD155'
                }
              },
              itemStyle: {
                normal: {
                  color: '#FFD155'
                }
              },
              symbolSize: function(){return 5;},
              smooth: true,
              yAxisIndex: 1,
              areaStyle: {
                normal: {
                  color: '#FFF6DD'
                }
              }
            },
            {
              name: '收益',
              type: 'line',
              data: result.charge,
              lineStyle: {
                normal: {
                  width: 2,
                  color: '#FD2222'
                }
              },
              itemStyle: {
                normal: {
                  color: '#FD2222'
                }
              },
              symbolSize: function(){return 5;},
              smooth: true,
              yAxisIndex: 0,
              areaStyle: {
                normal: {
                  color: '#FFD2D2'
                }
              }
            }
          ]
        };
      
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    mediaChart (result) {
      var myChart = echarts.init(document.getElementById('mediaCharts'));
      var option = {
          title: {
            text: '媒体主（Top10）',
            textAlign: 'left',
            textStyle: {
              color: '#333',
              fontWeight: 'normal',
              fontFamily: '微软雅黑',
              fontSize: 18
            },
            top: 10,
            left: 10
          },
          tooltip : {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
              label: {
                  backgroundColor: '#6a7985'
              }
            },
            formatter: function(a){
              var returnData = "";
              returnData += a[0].name+'<br/>';
              for(var i=0;i<a.length;i++){
                var data = a[i].data;
                if(a[i].value == undefined){
                  data = 0;
                }
                if(a[i].seriesName == '展现数'||a[i].seriesName == '点击数'){
                  a[i].seriesName += '（万）';
                }
                returnData += '<div><i style="display:inline-block;height:10px;width:10px;border-radius:50%;background:'+a[i].color+';"></i>'+' '+a[i].seriesName+' : '+data+'</div>';
              }
              return returnData;
            }
          },
          legend: {
            top: "10",
            left: "30%",
            data: ['展现数', '点击数', 'eCPM', '收益']
          },
          toolbox: {
            show : true,
            feature : {
              mark : {show: false},
              dataView : {show: false, readOnly: false},
              magicType : {show: false, type: ['line', 'bar']},
              restore : {show: false},
              saveAsImage : {}
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              trigger: 'axis',
              data: result.name,
              axisLine: {
                lineStyle: {
                  color: '#ccc'
                }
              },
              axisLabel:{
                textStyle:{
                  fontSize:12,
                  color:'#333'
                },
                interval:0,//横轴信息全部显示
                rotate: 20 //60度角倾斜显示
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              splitNumber: 10,
              axisLabel: {
                formatter: function (value) {
                  return value;
                }
              },
              splitLine: {
                show: false,
                  lineStyle: {
                      type: 'dashed'
                  }

              },
              axisLabel: {
                textStyle: {
                  fontSize: 12,
                  color: '#a4a4a4'
                }
              },
              axisLine: {
                show:false
              },
              axisTick: {
                show:false
              }
            },
            {
              type: 'value',
              splitNumber: 10,
              axisLabel: {
                formatter: function (value) {
                  return value;
                }
              },
              axisLabel: {
                textStyle: {
                  fontSize: 12,
                  color: '#a4a4a4'
                }
              },
              splitLine: {
                  show: false
              },
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              }
            }
          ],
          series: [
                {
                  name: '展现数',
                  type: 'bar',
                  data: result.Impl,
                  itemStyle: {
                    normal: {
                      color: '#66C3F9'
                    }
                  },
                  yAxisIndex: 0  
                },
                {
                  name: '点击数',
                  type: 'bar',
                  data: result.click,
                  itemStyle: {
                    normal: {
                      color: '#ACDD96'
                    }
                  },
                  yAxisIndex: 0
                },
                {
                  name: 'eCPM',
                  type: 'bar',
                  data: result.ecmp,
                  itemStyle: {
                    normal: {
                      color: '#FFD155'
                    }
                  },
                  yAxisIndex: 1
                },
                {
                  name: '收益',
                  type: 'bar',
                  data: result.charge,
                  itemStyle: {
                    normal: {
                      color: '#FD2222'
                    }
                  },
                  yAxisIndex: 0
                }
            ]
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
      .chart-left-wrapper
        background-color: #fff
        .chart-cnt
          width: 100%
          height: 400px
          border: 1px solid #eee   
</style>
