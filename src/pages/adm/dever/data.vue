<template>
  <div class="dev-data-wrapper">
    <h2>数据管理</h2>
    <div class="data-title-wrapper clearfix">
      <el-button type="primary" class="pull-left"><router-link class="search" to="data/selfind">自定义查询</router-link></el-button>
      <div class="data-select-wrapper pull-right">
        <div class="adver-select inline-block">
          <el-select v-model="platId" @change="load" filterable placeholder="全部开发者" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
            <el-option
              v-for="item in plats"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="adver-select inline-block">
          <el-select v-model="devId" @change="loadapps" filterable placeholder="全部开发者">
            <el-option
              v-for="item in devs"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="plan-select inline-block">
          <el-select v-model="appId" filterable @change="loadslots" placeholder="全部应用">
            <el-option
              v-for="item in apps"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="create-select inline-block">
          <el-select v-model="slotId" @change="load" filterable placeholder="全部广告位">
            <el-option
              v-for="item in slots"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="datepicker-wrapper inline-block">
          <datepicker :datepickers="datepickers" @datechange="load" :picker-options="pickerOptions"></datepicker>
        </div>
      </div>
    </div>
    <div class="data-total-wrapper">
      <totaldata :items="totalData"></totaldata>
    </div>
    <div class="echarts-wrapper">
      <div id="charts" class="chart-cnt"></div>
      <div v-show="false" class="chart-empty">抱歉，暂无数据！</div>
    </div>
    <div class="data-table-wrapper">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column v-if="auths.date" label="日期" sortable show-overflow-tooltip>
          <template scope="props">
            <span>{{props.row.date | date }}</span> 
          </template>
        </el-table-column>
        <el-table-column v-if="auths.numOfAdReq" prop="numOfAdReq" label="请求数" sortable show-overflow-tooltip></el-table-column>
        <el-table-column v-if="auths.numOfAdRes" prop="numOfAdRes" label="返回数" sortable show-overflow-tooltip></el-table-column>
        <el-table-column v-if="auths.numOfAdImpressionsB4Filter" prop="numOfAdImpressionsB4Filter" label="展现数" sortable show-overflow-tooltip></el-table-column>
        <el-table-column v-if="auths.numOfAdClicksB4Filter" prop="numOfAdClicksB4Filter" label="点击数" sortable show-overflow-tooltip></el-table-column>
        <el-table-column v-if="auths.ctr" prop="ctr" label="点击率（%）" sortable show-overflow-tooltip></el-table-column>
        <el-table-column v-if="auths.cpc" prop="cpc" label="CPC（￥）" sortable show-overflow-tooltip></el-table-column>
        <el-table-column v-if="auths.cpm" prop="cpm" label="eCPM（￥）" sortable show-overflow-tooltip></el-table-column>
        <el-table-column v-if="auths.chargeInitalData" prop="chargeInitalData" sortable label="总收入（￥）" show-overflow-tooltip></el-table-column>
        <el-table-column v-if="auths.chargeFinalData" prop="chargeFinalData" sortable label="结算金额（￥）" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <div class="data-footer-wrapper clearfix">
      <el-button type="primary" class="pull-left" @click="exportUrl">导出EXCEL</el-button>
      <div class="page-wrapper pull-right">
        <pager :total-records="totalRecords" @pagechange="load" :page-sizes="pageSize" :page-nums="pageNum"></pager>
      </div>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import apiUtil from '../../../util/api.js';
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
      devId: '',
      devs: [],
      appId: '',
      apps: [],
      slotId: '',
      slots: [],
      platId: 'PLATFORM',
      plats: [{id:'PLATFORM',text:'平台'},{id:'EFFECT',text:'效果'}],
      tableData: [],
      totalRecords: 100,
      pageNum: 1,
      pageSize: 10,
      datepickers: {value: [new Date(new Date().getTime()-7*24*3600*1000), new Date()], align: 'right', type: 'daterange'},
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > new Date().getTime();
        },
        onPick (data) {
        }
      },
      auths: {},
      loadings: false
    };
  },
  computed: {
    exportURL () {
      let url = apiUtil.url('/v1/adm/dev/stats/adSlotOfDay/{appId}/{adslotId}/export');
      let params = [];
      params.push("startDate="+this.datepickers.value[0].getTime());
      params.push("endDate="+this.datepickers.value[1].getTime()); 
      params.push("dataType="+this.platId); 
      if (this.devId === '') {
        params.push("devId=-1");
      } else {
        params.push("devId="+this.devId);
      }
      if (this.appId === '') {
        params.push("appId=-1");
      } else {
        params.push("appId="+this.appId);
      }
      if (this.slotId === '') {
        params.push("adslotId=-1");
      } else {
        params.push("adslotId="+this.slotId);
      }
      if (params.length) {
        url+="?"+params.join("&");
      }
      return url;
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.loadDevs();
    });
  },
  components: { datepicker, totaldata, pager },
  methods: {
    exportUrl () {
      window.location.href = this.exportURL;
    },
    loadDevs () {
      this.loadings = true;
      this.$http.get('/v1/adm/names/devs').then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.devs = result;
        this.devId = '';
        this.appId = '';
        this.slotId = '';
        this.slots = [];
        this.load();
      }, () => {this.loadings = false;});
    },
    loadapps () {
      this.loadings = true;
      let params = {};
      params.devId = this.devId;
      this.$http.get('/v1/adm/names/apps', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.apps = result;
        this.appId = '';
        this.slotId = '';
        this.slots = [];
        this.load();
      }, () => {this.loadings = false;});
    },
    loadslots () {
      this.loadings = true;
      let params = {};
      if (this.appId === '') {
        params.appId = -1;
      } else {
        params.appId = this.appId;
      }
      params.devId = this.devId;
      this.$http.get('/v1/adm/names/apps/{appId}/adslots', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.slots = result;
        this.slotId = '';
        this.load();
      }, () => {this.loadings = false;});
    },
    load (pageNum, pageSize) {
      let params = {};
      params.startDate = this.datepickers.value[0].getTime();
      params.endDate = this.datepickers.value[1].getTime();
      params.pageSize = pageSize || this.pageSize;
      params.pageNum = pageNum || this.pageNum;
      params.dataType = this.platId;
      if (this.appId==='') {
        params.appId = -1;
      } else {
        params.appId = this.appId;
      }
      if (this.devId==='') {
        params.devId = -1;
      } else {
        params.devId = this.devId;
      }
      if (this.slotId==='') {
        params.adslotId = -1;
      } else {
        params.adslotId = this.slotId;
      }
      this.loadings = true;
      this.$http.get('/v1/adm/stats/dev/adslotOfDay/{pageNum}/{pageSize}', {params: params}).then((res) => {
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
      params.dataType = this.platId;
      if (this.appId==='') {
        params.appId = -1;
      } else {
        params.appId = this.appId;
      }
      if (this.devId==='') {
        params.devId = -1;
      } else {
        params.devId = this.devId;
      }
      if (this.slotId==='') {
        params.adslotId = -1;
      } else {
        params.adslotId = this.slotId;
      }
      this.loadings = true;
      this.$http.get('/v1/adm/stats/dev/adslotOfDayForAll', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.totalData[0].num = result.numOfAdImpressionsB4Filter;
        this.totalData[1].num = result.numOfAdClicksB4Filter;
        this.totalData[2].num = result.ctr;
        this.totalData[3].num = result.chargeFinalData;
      }, () => {this.loadings = false;});
    },
    echartsdata (auths) {
      var params = {};
      params.startDate = this.datepickers.value[0].getTime();
      params.endDate = this.datepickers.value[1].getTime();
      params.dataType = this.platId;
      if (this.appId==='') {
        params.appId = -1;
      } else {
        params.appId = this.appId;
      }
      if (this.devId==='') {
        params.devId = -1;
      } else {
        params.devId = this.devId;
      }
      if (this.slotId==='') {
        params.adslotId = -1;
      } else {
        params.adslotId = this.slotId;
      }
      this.loadings = true;
      this.$http.get('/v1/adm/stats/dev/adslotOfDay', {params: params}).then((res) => {
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
      let numOfAdRes = {
            name:'返回数',
            type:'line',
            yAxisIndex: 0,
            smooth: true,
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
            data:result.numOfAdRes
        };
      let numOfAdImpressionsB4Filter = {
              name:'展现数',
              type:'line',
              yAxisIndex: 0,
              smooth: true,
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
              data:result.numOfAdImpressionsB4Filter
          };
      let numOfAdClicksB4Filter = {
          name:'点击数',
          type:'line',
          yAxisIndex: 0,
          smooth: true,
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
          data:result.numOfAdClicksB4Filter
      };
      let ctr = {
          name:'点击率',
          type:'line',
          smooth: true,
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
          name:'收益金额',
          type:'line',
          yAxisIndex: 0,
          smooth: true,
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
        legendTitle.push('收益金额');
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
      if(auths.numOfAdClicksB4Filter){
        dataArr.push(numOfAdClicksB4Filter);
        legendTitle.push('点击数');
      }
      if(auths.numOfAdImpressionsB4Filter){
        dataArr.push(numOfAdImpressionsB4Filter);
        legendTitle.push('展现数');
      }
      if(auths.numOfAdRes){
        dataArr.push(numOfAdRes);
        legendTitle.push('返回数');
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
