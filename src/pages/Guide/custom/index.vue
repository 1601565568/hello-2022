<template>
  <div>
    <div class="custom-head">
      <h3>小程序配置项</h3>
      <div class="custom-btn">
        <el-select v-model="terminalType" placeholder="请选择">
          <el-option
            v-for="item in terminal"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <ns-button
          class="custom-btn_save"
          type="primary"
          size="small"
          @click="onEdit"
          >编辑</ns-button
        >
      </div>
    </div>
    <div class="custom-content">
        1231
    </div>
  </div>
</template>
<script>
import index from './src/index.js'
export default index
</script>
<style lang="scss" scoped>
@import './style/index.scss';
</style>
