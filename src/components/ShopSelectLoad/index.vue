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
    <template v-if="kdSystemCreator">
      <el-option
        v-for="(item, index) in options"
        :key="index"
        :label="item"
        :value="item">
      </el-option>
    </template>
    <template v-else>
      <el-option
        v-for="item in options"
        :key="item[props.value]"
        :label="item[props.label]"
        :value="item[props.value]">
      </el-option>
    </template>
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
