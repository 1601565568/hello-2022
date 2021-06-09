<template>
  <div>
    <el-input v-bind="$attrs" :type='type' :value='value' @input='(value)=>{$emit("input",value)}' class='length-input suffix-input'>
      <template slot='suffix' v-if='length && (type==="text"||type==="password")'>
        <div class='input-length'>{{textLength ? textLength :value.length}}/{{length}}</div>
      </template>
    </el-input>
    <span class='el-input__count' v-if='length && type==="textarea"'>
      {{textLength ? textLength :value.length}}/{{length}}
    </span>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      default: ''
    },
    length: {
      type: Number
    },
    type: {
      default: 'text'
    },
    textLength: {
      default: 0
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./styles/reset.css";
.input-length {
  padding: 0 10px;
}
.el-input__count {
  color: #C0C4CC;
  position: absolute;
  font-size: 12px;
  top: 27px;
  right: 10px;
}
</style>
