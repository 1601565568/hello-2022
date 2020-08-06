<template>
  <el-select
    v-model="value"
    clearable
    filterable
    remote
    :remote-method="remoteMethod"
    :loading="loading"
    @scroll="loadMore"
    @visible-change="handleVisibleChange"
  >
     <el-option
      v-for="item in options"
      :key="item[props.value]"
      :label="item[props.label]"
      :value="item[props.value]">
    </el-option>
  </el-select>
</template>
<script>
import Index from './src/index'

export default Index
</script>
<style scoped>
  >>> .el-input__suffix {
    &::before {
      border-left: none
    }
    .el-icon-circle-close {
      border-right: 1px solid rgb(220, 223, 230)
    }
  }
</style>
