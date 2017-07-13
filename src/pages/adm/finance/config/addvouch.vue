<template>
  <div class="add-vouch-wrapper">
    <div class="bread-title-wrapper">
      <breadcrumb :bread-detail="breadContent"></breadcrumb>
    </div>
    <div class="data-title-wrapper">
      <div class="dowm-forward">
        <span class="list-title">操作：</span>
        <div class="radio-wrapper">
          <el-radio-group v-model="oprations" @change="loadcompanys">
            <el-radio class="radio" label="0">提现</el-radio>
            <el-radio class="radio" label="1">充值</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="dowm-forward">
        <span class="list-title">公司名称：</span>
        <el-select v-model="devId" filterable placeholder="请选择" v-loading.fullscreen.lock="loadings" element-loading-text="拼命加载中">
          <el-option
            v-for="item in devs"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="dowm-forward">
        <span class="list-title">金额：</span>
        <el-input v-model="prices" placeholder="请输入内容"></el-input>
      </div>
      <div class="dowm-forward">
        <span class="list-title">上传凭证：</span>
        <upload :urls="urls" @get-file="getFile" :fileLists="fileList"></upload>
      </div>
      <el-button type="primary" @click="creates">新建</el-button>
      <el-button type="default" @click="back">取消</el-button>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import apiUtil from '../../../../util/api.js';
import upload from '../../../../components/upload/imgupload.vue';
import breadcrumb from '../../../../components/breadcrumb/breadcrumb.vue';
export default {
  data () {
    return {
      prices: '',
      oprations: '0',
      devs: [],
      devId: '',
      breadContent: [{ text: '提现/充值', path: '/adm/finance/vouchor'}, { text: '新增数据'}],
      urls: apiUtil.url('/v1/adm/dev/withdraws/materials'),
      fileName: '',
      fileUrl: '',
      fileList: [],
      loadings: false
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.loadcompanys();
    });
  },
  components: { upload, breadcrumb },
  methods: {
    loadcompanys () {
      let sources;
      if (this.oprations === '0') {
        sources = this.$resource('/v1/adm/names/devs');
      } else {
        sources = this.$resource('/v1/adm/names/advs');
      }
      this.loadings = true;
      sources.get().then((res) => {
        this.loadings = false;
        let data = res.body;
        if (data.ret!=1) {
          return this.$alert(data.message, '提示：', {
            confirmButtonText: '确定'
          });
        }
        let result = data.result;
        this.devs = result;
      }, () => {this.loadings = false;});
    },
    getFile (filename, fileurl) {
      this.fileName = filename;
      this.fileUrl = fileurl;
    },
    creates () {
      if (this.fileName === '' || this.fileUrl === '') {
        return this.$alert('请先上传背景图文件！', '提示：', {
          confirmButtonText: '确定'
        });
      }
      let params = {};
      params.amount = this.prices;
      params.fileUrl  = this.fileUrl;
      this.loadings = true;
      if (this.oprations === '0') {
        params.devid = this.devId;
        params.optionType = 1;
        this.$http.post('/v1/adm/dev/financeOptions', params).then((res) => {
          this.loadings = false;
          let data = res.body;
          if (data.ret!=1) {
            return this.$alert(data.message, '提示：', {
              confirmButtonText: '确定'
            });
          }
          this.$alert('创建成功！', '提示：', {
            confirmButtonText: '确定'
          }).then(() => {
            this.back();
          });
        }, () => {this.loadings = false;});
      } else {
        params.advId = this.devId;
        params.optiontype = 1;
        this.$http.post('/v1/adm/adv/financeOptions', params).then((res) => {
          this.loadings = false;
          let data = res.body;
          if (data.ret!=1) {
            return this.$alert(data.message, '提示：', {
              confirmButtonText: '确定'
            });
          }
          this.$alert('创建成功！', '提示：', {
            confirmButtonText: '确定'
          }).then(() => {
            this.back();
          });
        }, () => {this.loadings = false;});
      }
    },
    back () {
      this.$router.push({
        path: '/adm/finance/vouchor'
      });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .add-vouch-wrapper
    .bread-title-wrapper
      margin-bottom: 15px
    .data-title-wrapper
      padding: 20px
      background: #fff
      border: 1px solid #eee
      .dowm-forward
        margin-bottom: 10px
        width: 260px 
        .el-select
            display: block 
        .radio-wrapper
          margin: 5px 0
          .radio
            color: #565656
            width: 80px
          .radio:first-child
            margin-right: 30px    
</style>
