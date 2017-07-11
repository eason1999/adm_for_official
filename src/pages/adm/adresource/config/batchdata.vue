<template> 
  <div>
    <span class="list-title">文件上传：</span>
    <dragupload :go-paths="goPath" :paths="paths" :urls="urls" :file-lists="fileList" :modeldatas="modeldatas"></dragupload>
  </div>
</template>

<script type="ecmascript-6">
import dragupload from '../../../../components/upload/dragupload.vue';
import apiUtil from '../../../../util/api.js';
export default {
  data () {
    return {
      goPath: true,
      paths: '/adm/resource',
      urls: apiUtil.url('/v1/source/sourceFile'),
      fileList: [],
      modeldatas: 'http://adroi.bj.bcebos.com/cdn/res/resource/temp/%E5%B9%BF%E5%91%8A%E6%BA%90%E6%95%B0%E6%8D%AE%E5%BD%95%E5%85%A5%E6%A8%A1%E6%9D%BF.zip'
    };
  },
  components: { dragupload },
  mounted () {
    
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
      
</style>
