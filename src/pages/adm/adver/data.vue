<template>
  <div class="adv-data-wrapper">
    <h2>数据管理</h2>
    <div class="data-title-wrapper clearfix">
      <el-button type="primary" class="pull-left"><router-link class="search" to="data/selfind">自定义查询</router-link></el-button>
      <div class="data-select-wrapper pull-right">
        <div class="adver-select inline-block">
          <el-select v-model="advId" @change="loadplan" filterable placeholder="全部广告主" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
            <el-option
              v-for="item in advs"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="plan-select inline-block">
          <el-select v-model="planId" filterable @change="loadcreate" placeholder="全部计划">
            <el-option
              v-for="item in plans"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="create-select inline-block">
          <el-select v-model="creativeId" @change="load" filterable placeholder="全部创意">
            <el-option
              v-for="item in creatives"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="datepicker-wrapper inline-block">
          <datepicker :datepickers="datepickers" :picker-options="pickerOptions" @datechange="load"></datepicker>
        </div>
      </div>
    </div>
    <div class="data-total-wrapper">
      <totaldata :items="totalData"></totaldata>
    </div>
    <div class="echarts-wrapper">
      <div id="charts" class="chart-cnt"></div>
    </div>
    <div class="data-table-wrapper">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column v-if="auths.date" sortable label="日期" show-overflow-tooltip>
          <template scope="props">
            <span>{{props.row.date | date }}</span> 
          </template>
        </el-table-column>
        <el-table-column prop="numOfAdImpressions" v-if="auths.numOfAdImpressions" sortable label="展现数" show-overflow-tooltip></el-table-column>
        <el-table-column prop="numOfAdClicks" v-if="auths.numOfAdClicks" sortable label="点击数" show-overflow-tooltip></el-table-column>
        <el-table-column prop="numOfAdDownloads" v-if="auths.numOfAdDownloads" sortable label="下载数" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ctr" v-if="auths.ctr" sortable label="点击率（%）" show-overflow-tooltip></el-table-column>
        <el-table-column prop="cpc" v-if="auths.cpc" sortable label="CPC（￥）" show-overflow-tooltip></el-table-column>
        <el-table-column prop="cpm" v-if="auths.cpm" sortable label="ECPM（￥）" show-overflow-tooltip></el-table-column>
        <el-table-column prop="chargeInitalData" v-if="auths.chargeInitalData" sortable label="消费金额（￥）" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <div class="data-footer-wrapper clearfix" v-if="tableData.length">
      <el-button type="primary" class="pull-left" @click="exportUrl">导出EXCEL</el-button>
      <div class="page-wrapper pull-right">
        <pager :total-records="totalRecords" @pagechange="load" :page-sizes="pageSize" :page-nums="pageNum"></pager>
      </div>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import datepicker from '../../../components/datepicker/datepicker.vue';
import totaldata from '../../../components/totaldata/totaldata.vue';
import pager from '../../../components/pager/pager.vue';
import echarts from 'echarts';
export default {
  data () {
    return {
      totalData: [
        {icon: 'el-icon-star-on',num: 0,text: '展现数'},
        {icon: 'el-icon-message',num: 0,text: '点击数'},
        {icon: 'el-icon-share',num: 0,text: '点击率'},
        {icon: 'el-icon-menu',num: 0,text: '消费'}
      ],
      advId: '',
      advs: [],
      planId: '',
      plans: [],
      creativeId: '',
      creatives: [],
      tableData: [],
      totalRecords: -1,
      pageNum: 1,
      pageSize: 20,
      datepickers: {value: [new Date(new Date().getTime()-7*24*3600*1000), new Date()], align: 'right', type: 'daterange'},
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > new Date().getTime();
        },
        onPick (data) {
        }
      },
      loadings: false,
      auths: {}
    };
  },
  computed: {
    exportURL () {
      let url = ApiUtil.url('/v1/adm/adv/stats/creativeOfDay/{campaignId}/{creativeId}/export');
      let params = [];
      params.push("startDate="+this.datepickers.value[0].getTime());
      params.push("endDate="+this.datepickers.value[1].getTime()); 
      if (this.advId === '') {
        params.push("advId=-1");
      } else {
        params.push("advId="+this.advId);
      }
      if (this.planId === '') {
        params.push("campaignId=-1");
      } else {
        params.push("campaignId="+this.planId);
      }
      if (this.creativeId === '') {
        params.push("creativeId=-1");
      } else {
        params.push("creativeId="+this.creativeId);
      }
      if (params.length) {
        url+="?"+params.join("&");
      }
      return url;
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.loadadvs();
    });
  },
  components: { datepicker, totaldata, pager },
  methods: {
    exportUrl () {
      window.location.href = this.exportURL;
    },
    loadadvs () {
      this.loadings = true;
      this.$http.get('/v1/adm/names/advs').then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.advs = result;
        this.advId = '';
        this.planId = '';
        this.creativeId = '';
        this.creatives = [];
        this.load();
      }, () => {this.loadings = false;});
    },
    loadplan () {
      this.loadings = true;
      let params = {};
      params.advId = this.advId;
      this.$http.get('/v1/adm/names/campaigns', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.plans = result;
        this.planId = '';
        this.creativeId = '';
        this.creatives = [];
        this.load();
      }, () => {this.loadings = false;});
    },
    loadcreate () {
      this.loadings = true;
      let params = {};
      if (this.planId === '') {
        params.campaignId = -1;
      } else {
        params.campaignId = this.planId;
      }
      this.$http.get('/v1/adm/names/campaigns/{campaignId}/creatives', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.creatives = result;
        this.creativeId = '';
        this.load();
      }, () => {this.loadings = false;});
    },
    load (pageNum, pageSize) {
      let params = {};
      params.startDate = this.datepickers.value[0].getTime();
      params.endDate = this.datepickers.value[1].getTime();
      params.pageSize = pageSize || this.pageSize;
      params.pageNum = pageNum || this.pageNum;
      if (this.planId==='') {
        params.campaignId = -1;
      } else {
        params.campaignId = this.planId;
      }
      if (this.creativeId==='') {
        params.creativeId = -1;
      } else {
        params.creativeId = this.creativeId;
      }
      if (this.advId==='') {
        params.advId = -1;
      } else {
        params.advId = this.advId;
      }
      this.loadings = true;
      this.$http.get('/v1/adm/stats/adv/creativeOfDay/{pageNum}/{pageSize}', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.pageNum = result.pageNum;
        this.pageSize = result.pageSize;
        this.totalRecords = result.total;
        this.tableData = result.list;
        this.auths = result.auth;
        this.loadAll();
        this.echartsdata(result.auth);
      }, () => {this.loadings = false;});
    },
    loadAll () {
      var params = {};
      params.startDate = this.datepickers.value[0].getTime();
      params.endDate = this.datepickers.value[1].getTime();
      if (this.planId==='') {
        params.campaignId = -1;
      } else {
        params.campaignId = this.planId;
      }
      if (this.creativeId==='') {
        params.creativeId = -1;
      } else {
        params.creativeId = this.creativeId;
      }
      if (this.advId==='') {
        params.advId = -1;
      } else {
        params.advId = this.advId;
      }
      this.loadings = true;
      this.$http.get('/v1/adm/stats/adv/creativeOfDayForAll', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.totalData[0].num = result.numOfAdImpressions;
        this.totalData[1].num = result.numOfAdClicks;
        this.totalData[2].num = result.ctr;
        this.totalData[3].num = result.chargeInitalData;
      }, () => {this.loadings = false;});
    },
    echartsdata (auths) {
      var params = {};
      params.startDate = this.datepickers.value[0].getTime();
      params.endDate = this.datepickers.value[1].getTime();
      if (this.planId==='') {
        params.campaignId = -1;
      } else {
        params.campaignId = this.planId;
      }
      if (this.creativeId==='') {
        params.creativeId = -1;
      } else {
        params.creativeId = this.creativeId;
      }
      if (this.advId==='') {
        params.advId = -1;
      } else {
        params.advId = this.advId;
      }
      this.loadings = true;
      this.$http.get('/v1/adm/stats/adv/creativeOfDay', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.drawChart(result,auths);
      }, () => {this.loadings = false;});
    },
    drawChart (result,auths) {
      let myChart = echarts.init(document.getElementById('charts'));
      let dataArr = [];
      let legendTitle = [];
      let numOfAdImpressions = {
            name:'展现数',
            type:'line',
            yAxisIndex: 0,
            smooth: true,
            smoothMonotone: 'x',
            lineStyle:{
              normal:{
                width:2,
                color:'#66C3F9'
              }
            },
            itemStyle : {
                normal : {
                    color:'#66C3F9'
                }
            },
            areaStyle:{
              normal:{
                color:'#E0F3FE'
              }
            },
            data:result.numOfAdImpressions
        };
      let numOfAdClicks = {
              name:'点击数',
              type:'line',
              yAxisIndex: 0,
              smooth: true,
              smoothMonotone: 'x',
              lineStyle:{
                normal:{
                  width:2,
                  color:'#ACDD96'
                }
              },
              itemStyle : {
                  normal : {
                      color:'#ACDD96'
                  }
              },
              areaStyle:{
                normal:{
                  color:'#EEF8EA'
                }
              },
              data:result.numOfAdClicks
          };
      let numOfAdDownloads = {
          name:'下载数',
          type:'line',
          yAxisIndex: 0,
          smooth: true,
          smoothMonotone: 'x',
          lineStyle:{
            normal:{
              width:2,
              color:'#FF7124'
            }
          },
          itemStyle : {
              normal : {
                  color:'#FF7124'
              }
          },
          areaStyle:{
            normal:{
              color:'#FFC19B'
            }
          },
          data:result.numOfAdDownloads
      };
      let ctr = {
          name:'点击率',
          type:'line',
          smooth: true,
          smoothMonotone: 'x',
          yAxisIndex: 1,
          lineStyle:{
            normal:{
              width:2,
              color:'#7AAFB5'
            }
          },
          itemStyle : {
              normal : {
                  color:'#7AAFB5'
              }
          },
          areaStyle:{
            normal:{
              color:'#B0D0D4',
              opacity:0.3
            }
          },
          data:result.ctr
      };
      let cpc = {
          name:'CPC',
          type:'line',
          smooth: true,
          smoothMonotone: 'x',
          yAxisIndex: 1,
          label: {
              normal: {
                  show: true,
                  position: 'top'
              }
          },
          lineStyle: {
            normal: {
              width: 2,
              color: '#3EFFE0'
            }
          },
          itemStyle : {
              normal : {
                  color:'#3EFFE0'
              }
          },
          areaStyle:{
            normal:{
              color:'#D1FFF7'
            }
          },
          data:result.cpc
      };
      let cpm = {
          name:'eCPM',
          type:'line',
          smooth: true,
          smoothMonotone: 'x',
          yAxisIndex: 1,
          label: {
              normal: {
                  show: true,
                  position: 'top'
              }
          },
          lineStyle:{
            normal:{
              width:2,
              color:'#FFD155'
            }
          },
          itemStyle : {
              normal : {
                  color:'#FFD155'
              }
          },
          areaStyle:{
            normal:{
              color:'#FFF6DD'
            }
          },
          data:result.cpm
      };
      let chargeData = {
          name:'消费金额',
          type:'line',
          yAxisIndex: 0,
          smooth: true,
          smoothMonotone: 'x',
          label: {
              normal: {
                  show: true,
                  position: 'top'
              }
          },
          lineStyle:{
            normal:{
              width:2,
              color:'#FD2222'
            }
          },
          itemStyle : {
              normal : {
                  color:'#FD2222'
              }
          },
          areaStyle:{
            normal:{
              color:'#FFD2D2'
            }
          },
          data:result.chargeData
      };
      if(auths.chargeData){
        dataArr.push(chargeData);
        legendTitle.push('消费金额');
      }
      if(auths.cpc){
        dataArr.push(cpc);
        legendTitle.push('CPC');
      }
      if(auths.cpm){
        dataArr.push(cpm);
        legendTitle.push('eCPM');
      }
      if(auths.ctr){
        dataArr.push(ctr);
        legendTitle.push('点击率');
      }
      if(auths.numOfAdClicks){
        dataArr.push(numOfAdClicks);
        legendTitle.push('点击数');
      }
      if(auths.numOfAdImpressions){
        dataArr.push(numOfAdImpressions);
        legendTitle.push('展现数');
      }
      if(auths.numOfAdDownloads){
        dataArr.push(numOfAdDownloads);
        legendTitle.push('下载数');
      }      
      let option = {
          title: {
            text: '数据区域图'
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
              for(var i=0;i<a.length;i++){
                var data = a[i].data;
                if(a[i].seriesName == '点击率'){
                  data = data+"%";
                }
                returnData += '<div><i style="display:inline-block;height:10px;width:10px;border-radius:50%;background:'+a[i].color+';"></i>'+' '+a[i].seriesName+' : '+data+'</div>';
              }
              return returnData;
            }
          },
          legend: {
            top: 'bottom',
            data: legendTitle
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
              data: result.axisX,
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
              splitLine: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: '#ccc'
                }
              }
            },
            {
              type: 'value',
              splitLine: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: '#ccc'
                }
              }
            }
          ],
          series : dataArr
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .adv-data-wrapper
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
