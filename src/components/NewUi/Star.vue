<template>
  <div class='star-content'>
    <div v-for='(item,index) in max' class='star-item' :key='index' @mousemove="handleMove(item, $event)" @mouseleave="handleLeave" @click="handleClick(item)">
      <template v-if='index<currentValue'>
        <img :src='img'>
      </template>
      <template v-else>
        <img :src='voidImg' v-if='!(disabled && currentValue>0)'>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      currentValue: this.value
    }
  },
  props: {
    value: {
      type: Number,
      default: 0
    },
    // 总数
    max: {
      type: Number,
      default: 5
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 点亮图片
    img: {
      type: String
    },
    // 为点亮图片
    voidImg: {
      type: String
    }
  },
  methods: {
    /**
     * 鼠标hover位置
     * @param {number} 选中位置
     */
    handleMove (value) {
      if (!this.disabled) {
        this.currentValue = value
      }
    },
    /**
     * 鼠标离开数据还原
     *
     */
    handleLeave () {
      if (!this.disabled) {
        this.currentValue = this.value
      }
    },
    /**
     * 鼠标点击改变value
     * @param {number} 选中位置
     */
    handleClick (value) {
      if (!this.disabled) {
        this.$emit('input', value)
      }
    }
  },
  watch: {
    value (newVal) {
      this.currentValue = newVal
    }
  }
}
</script>
<style lang='scss' scoped>
.star-content {
  display: flex;
  .star-item {
    padding-right: 12px;
    img {
      height: 20px;
      cursor: pointer;
    }
  }
}

</style>
