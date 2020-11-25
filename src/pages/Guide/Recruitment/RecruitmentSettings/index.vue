<template>
  <div class='recruitment-container'>
    <div class='common-header flex-box'>
      <h3>导购招募流程设置</h3>
      <div class='common-btn'>
        <ns-button class='common-btn_cancel' size='large' :loading='btnLoad' @click='handleCancel'>取消</ns-button>
        <ns-button class='common-btn_save' type="primary" size='large' @click='handleSave' :loading='btnLoad'>保存</ns-button>
      </div>
    </div>
    <h1 class='recruitment-title'>
      导购招募码（获取位置：导购小程序-会员招募）
    </h1>
    <div class='recruitment-tip'>
      可根据自身需求自定义导购招募流程
    </div>
    <div>
      <template v-for='item in stepList'>
        <div :key='item.value'>
          <span>{{item.value}}</span>
          <template v-if="item.extra === 'checkbox_button'">
            <el-switch
              v-model="value">
            </el-switch>
            <ns-button type="text">预览</ns-button>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import Index from './src/index'
export default Index
</script>

<style scoped>
  @import "@theme/variables.pcss";
  @import "../styles/reset.css";
  .recruitment-container {
    min-height: calc(100vh-160px)
  }
</style>
