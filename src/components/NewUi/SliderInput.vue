<template>
  <div class="slider-input">
    <el-slider
      :value="value"
      :min="min"
      :max="max"
      :step="step"
      @input="handleInput"
      :show-tooltip="false"
    ></el-slider>
    <el-input
      placeholder="请输入"
      class="slider-input-input"
      :value="value"
      :min="min"
      :max="max"
      :step="step"
      @input="handleInputChange"
    />
    <div class="unit">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import ElSlider from '@nascent/nui/lib/slider'
export default {
  components: { ElSlider },
  props: {
    value: {
      required: true
    },
    min: {
      default: 0
    },
    max: {
      default: 100
    },
    step: {
      default: 1
    }
  },
  methods: {
    handleInput (value) {
      this.$emit('input', value)
    },
    handleInputChange (value) {
      const { min, max } = this
      const numValue = value.replace(/[^\d.]/g, '')
      const limValue = numValue < min ? min : numValue > max ? max : numValue
      this.handleInput(+limValue)
    }
  }
}
</script>
<style scoped>
.slider-input {
  display: flex;
  /* height: 28px; */
  align-items: center;
  >>> .el-slider {
    flex: 1;
  }
  .slider-input-input {
    width: 50px;
    margin-left: 10px;
  }
  .unit {
    width: 60px;
    text-align: center;
  }
}
</style>
