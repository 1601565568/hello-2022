<template>
  <div class="nodata-view">
    <img :src="noDataUrl" class="nodata-img" />
    <div class="nodata-text">没有数据哦～</div>
  </div>
</template>

<script>
export default {
  name: 'nodata',
  data () {
    return {
      noDataUrl:
        'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-WEB/image/material-nodata.png'
    }
  }
}
</script>

<style scoped>
.nodata-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 200px;
}
.nodata-img {
  width: 220px;
  height: 220px;
}
.nodata-text {
  font-size: 14px;
  color: #8c8c8c;
  text-align: center;
  line-height: 22px;
  font-weight: 400;
  margin-top: 40px;
  padding-bottom: 100px;
}
</style>
