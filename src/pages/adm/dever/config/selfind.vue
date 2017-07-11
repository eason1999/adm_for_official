<template>
  <div class="dev-selfind-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="data-title-wrapper">
      <div class="dowm-forward">
        <span class="list-title">数据属性：</span>
        <div class="radio-wrapper">
          <el-radio class="radio" v-model="dataType" label="PLATFORM">平台</el-radio>
          <el-radio class="radio" v-model="dataType" label="EFFECT">效果</el-radio>
        </div>
      </div>
      <div class="dowm-forward">
        <span class="list-title">时间范围：</span>
        <datepicker :datepickers="datepickers" :picker-options="pickerOptions"></datepicker>
      </div>
      <div class="dowm-forward">
        <span class="list-title">目标对象：</span>
        <el-select v-model="devId" filterable placeholder="全部开发者" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
          <el-option
            v-for="item in targets"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="filter-forward">
        <span class="list-title">筛选维度：</span>
        <div class="filter-wrap">
          <div v-for="(resources,index) in dimsChoice" class="eachDim">
            <el-select @change="addSelect(index)" v-model="resources.choiceId" filterable placeholder="请选择">
              <el-option
                v-for="item in resources.list"
                :key="item.id"
                :label="item.text"
                :value="item.id"
                :disabled="(this.devId!=''&&item.id=='8')||(!this.idArr&&item.id=='10')">
              </el-option>
            </el-select>
            <span v-if="index != (dimsChoice.length-1)" class="el-icon-circle-close" @click="removeSelect(index,$event)"></span>
          </div>
        </div>
      </div>
      <el-button type="primary" @click="load">生成报告</el-button>
    </div>
    <div class="data-table-wrapper">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column v-if="showDate" prop="date" label="日期" sortable show-overflow-tooltip></el-table-column>
        <el-table-column v-if="showAdApp" prop="adApp" label="App" show-overflow-tooltip></el-table-column>
        <el-table-column v-if="showAdName" prop="devName" label="开发者名称" show-overflow-tooltip></el-table-column>
        <el-table-column v-if="showAdPlace" prop="adPlace" label="广告位" show-overflow-tooltip></el-table-column>
        <el-table-column v-if="showAdPlace" prop="adSlotId" label="广告位ID" show-overflow-tooltip></el-table-column>
        <el-table-column v-if="showAdType" prop="adType" label="广告类型" show-overflow-tooltip></el-table-column>
        <el-table-column v-if="showAdOrigin" prop="adOrigin" label="广告源" show-overflow-tooltip></el-table-column>
        <el-table-column v-if="adAppBelong" prop="adAppBelong" label="应用属性" show-overflow-tooltip></el-table-column>
        <el-table-column v-if="adAppSource" prop="adSourceSlotId" label="广告位（源）" show-overflow-tooltip></el-table-column>
        <el-table-column prop="numOfAdReq" label="请求数" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="numOfAdRes" label="返回数" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="numOfAdImpressionsB4Filter" label="展现数" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="numOfAdClicksB4Filter" label="点击数" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="ctr" label="点击率（%）" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="cpm" label="eCPM（￥）" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="cpc" label="CPC（￥）" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="chargeInitalData" label="总收入（￥）" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="chargeFinalData" label="结算金额（￥）" sortable show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <div class="data-footer-wrapper clearfix" v-if="tableData.length">
      <el-button type="primary" class="pull-left">导出EXCEL</el-button>
      <div class="page-wrapper pull-right">
        <pager :total-records="totalRecords" @pagechange="load" :page-sizes="pageSize" :page-nums="pageNum"></pager>
      </div>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import datepicker from '../../../../components/datepicker/datepicker.vue';
import pager from '../../../../components/pager/pager.vue';
import breadcrumb from '../../../../components/breadcrumb/breadcrumb.vue';
export default {
  data () {
    return {
      dimsChoice:[{choiceId:'',list:[]}],
      dims: [],
      devId: '',
      targets: [],
      dataType: 'PLATFORM',
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
      totalRecords: -1,
      pageNum: 1,
      pageSize: 20,
      breadContent: [{ text: '数据管理', path: '/adm/dev/data'}, { text: '自定义查询'}],
      datepickers: {value: [new Date(new Date().getTime()-7*24*3600*1000), new Date()], align: 'left', type: 'daterange'},
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > new Date().getTime();
        },
        onPick (data) {
        }
      },
      showDate: false,
      showAdName: false,
      conItem: false,
      showAdPlace: false,
      showAdOrigin: false,
      showAdType: false,
      showAdApp: false,
      adAppBelong: false,
      adAppSource: false,
      loadings: false
    };
  },
  computed: {
    idArr () {
      let arrs = this.getChoiceArr();
      let item;
      console.log(this.getChoiceArr());
      if (arrs.indexOf('7')>-1) {
        item = true;
      } else {
        item = false;
      }
      return item;
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.loaddevs();
      this.loadfilters();
    });
  },
  components: { datepicker, pager, breadcrumb },
  methods: {
    loadfilters () {
      this.loadings = true;
      this.$http.get('/v1/adm/options_dev').then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        this.dims = data.result;
        this.dimsChoice[0].list = data.result;
      }, () => {this.loadings = false;});
    },
    loaddevs () {
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
        this.targets = result;
      }, () => {this.loadings = false;});
    },
    //中间处理
    dealStatus (index) {
      var curSelect = this.dimsChoice[index];
      var curChoiceId = curSelect.choiceId;
      for(var i =0;i< this.dimsChoice.length;i++){
        if(i==index) continue;
        var tempSelect = this.dimsChoice[i];
        var tempChoiceId = tempSelect.choiceId;
        if(tempChoiceId == curChoiceId){
          this.dimsChoice.splice(i, 1);
          return;
        } else if((['1','2','3'].indexOf(curChoiceId)>=0 && ['1','2','3'].indexOf(tempChoiceId)>=0)){
          this.dimsChoice.splice(i, 1);
          return;
        }
      };
      if(this.dimsChoice.length>1){
        this.controlBtn = false;
      }else{
        this.controlBtn = true;
      }
    },
    //动态添加select
    addSelect (sIndex) {
      if(sIndex==this.dimsChoice.length-1){
        this.dimsChoice.push({choiceId:'',list:this.dims});
      }
      this.dealStatus(sIndex);
    },
    //移除筛选维度
    removeSelect (index,$event) {
      this.dimsChoice.splice(index,1);
      this.dealStatus(index);
    },
    getChoiceArr () {
      let choiceArr = [];
      for(let i = 0, a = this.dimsChoice.length; i < a; i++){
        
        let getChoiceId = this.dimsChoice[i].choiceId;
        choiceArr.push(getChoiceId);
        
      };
      choiceArr.pop();
      return choiceArr;
    },
    load (pageNum, pageSize) {
      let arrs = this.getChoiceArr();
      let params = {};
      // 控制列表项
      if (arrs.indexOf('1')>-1 || arrs.indexOf('2')>-1 || arrs.indexOf('3')>-1) {
        this.showDate = true;
      } else {
        this.showDate = false;
      }
      if (arrs.indexOf('5')>-1) {
        this.showAdPlace = true;
      } else {
        this.showAdPlace = false;
      }
      if (arrs.indexOf('7')>-1) {
        this.showAdOrigin = true;
      } else {
        this.showAdOrigin = false;
      }
      if (arrs.indexOf('6')>-1) {
        this.showAdType = true;
      } else {
        this.showAdType = false;
      }
      if (arrs.indexOf('4')>-1) {
        this.showAdApp = true;
      } else {
        this.showAdApp = false;
      }
      if (this.devId!=''||(arrs.indexOf('8')>-1)) {
        this.showAdName = true;
        params.devId = this.devId;
      } else {
        this.showAdName = false;
        params.devId = -1;
      }
      if (arrs.indexOf('9')>-1) {
        this.adAppBelong = true;
      } else {
        this.adAppBelong = false;
      }
      if (arrs.indexOf('10')>-1) {
        this.adAppSource = true;
      } else {
        this.adAppSource = false;
      }
      params.startDate = this.datepickers.value[0].getTime();
      params.endDate = this.datepickers.value[1].getTime();
      params.dataType = this.dataType;
      params.pageSize = pageSize || this.pageSize;
      params.pageNum = pageNum || this.pageNum;
      params.choiceId = arrs;
      this.loadings = true;
      this.$http.get('/v1/adm/stats/dev/userDefined/{pageNum}/{pageSize}', {params: params}).then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.pageSize = result.pageSize;
        this.totalRecords = result.total;
        this.tableData = result.list;
      }, () => {this.loadings = false;});
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .dev-selfind-wrapper
    .bread-title-wrapper
      margin-bottom: 15px
    .data-title-wrapper
      margin-bottom: 15px
      padding: 20px
      background: #fff
      border: 1px solid #eee
      .dowm-forward
        margin-bottom: 10px
        width: 260px  
        .el-select
          display: block
        .el-input
          display: block
          width: 100%
        .radio-wrapper
          margin: 5px 0
          .radio
            color: #565656
            width: 80px
          .radio:first-child
            margin-right: 30px   
      .filter-forward
        margin-bottom: 10px
        width: 100% 
        .filter-wrap
          display: block
          width: 100%
        .eachDim
          display: inline-block
          width: 260px
          margin-bottom: 10px
          margin-right: 30px
          position: relative
          .el-select
            width: 100%
          .el-icon-circle-close
            color: #F4636E
            font-size: 16px
            cursor: pointer
            position: absolute
            top: 50%
            right: -20px
            transform: translateY(-50%)
            -webkit-transform: translateY(-50%) 
          .form-control
            height: 30px
            width: 176px
            border:1px solid #ccc
            padding-left:12px       
    .data-table-wrapper
      margin-bottom: 20px     
</style>
