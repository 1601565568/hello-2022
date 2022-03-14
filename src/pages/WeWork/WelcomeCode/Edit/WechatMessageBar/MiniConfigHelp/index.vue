<template>
  <div class="tips" :class="[ENV === 'QA' && 'colorQA']">
    <!-- <div > -->
    <span class="text desc" @click="show = true">配置说明</span>
    <span class="text desc" @click="goQw()">去配置</span>
    <!-- </div> -->
    <el-dialog title="配置说明" :visible.sync="show" width="960px" :append-to-body="true">
      <div class="dialog-head">
        <p>路径：企业微信后台->应用管理->应用</p>
        <p>
          根据实际情况选择【添加第三方应用】或【创建应用】，创建应用中可以快速关联已有小程序。
        </p>
      </div>
      <div class="dialog-img"><img src="./image/img.jpg" /></div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      show: false,
      ENV: process.env.VUE_APP_THEME
    }
  },
  methods: {
    goQw () {
      window.open('https://work.weixin.qq.com/wework_admin/frame#apps')
    }
  }
}
</script>
<style scoped>
.colorQA >>>  .text{
  color: #2153D4!important;
}
.tips {
  display: inline-block;
}
.tips >>> .el-dialog__body {
  background: #f5f5f5;
}
.tips .text {
  cursor: pointer;
  display: inline-block;
  font-size: 12px;
  color: #1890ff;
}
.tips .desc {
  margin-left: 8px;
}
.dialog-head {
  padding: 16px 32px;
  min-height: 60px;
  color: #595959;
  background: #f2f9fe;
  border-radius: 2px;
  margin-bottom: 12px;
}
.dialog-img {
  width: 100%;
}
.dialog-img img {
  width: 100%;
  image-rendering:-moz-crisp-edges;
  image-rendering:-o-crisp-edges;
  image-rendering:-webkit-optimize-contrast;
  image-rendering: crisp-edges;
  -ms-interpolation-mode:nearest-neighbor;
}
</style>
