<template>
  <el-select v-model="value"
             @scroll="loadMore"
             filterable
             remote
             :loading="loading"
             :remote-method='remoteMethod'
              reserve-keyword
              :multiple='multiple'>
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
    display: none!important;
  }
</style>
