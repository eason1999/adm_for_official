<template>
  <el-transfer
    filterable
    :titles="['省市','已选省市']"
    :filter-method="filterMethod"
    filter-placeholder="请输入城市拼音"
    v-model="value2"
    :data="data2">
  </el-transfer>
</template>

<script type="ecmascript-6">
export default {
  data () {
    const generateData2 = _ => {
    const data = [];
    const cities = ['上海', '北京', '广州', '深圳', '南京', '西安', '成都'];
    const pinyin = ['shanghai', 'beijing', 'guangzhou', 'shenzhen', 'nanjing', 'xian', 'chengdu'];
    cities.forEach((city, index) => {
        data.push({
          label: city,
          key: index,
          pinyin: pinyin[index]
        });
      });
      return data;
    };
    return {
      data2: generateData2(),
      value2: [],
      filterMethod(query, item) {
        return item.pinyin.indexOf(query) > -1;
      }
    };
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  
</style>
