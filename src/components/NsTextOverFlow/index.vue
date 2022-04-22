<!--
 * @Date: 2022-04-22 16:20:48
 * @LastEditors: Cosima
 * @LastEditTime: 2022-04-22 16:44:11
 * @desc: 文本内容超出固定宽度展示tip组件
 * @FilePath: \ECRP-SG-WEB\src\components\NsTextOverFlow\index.vue
-->
<template>
  <div :style="{ maxWidth: maxWidth }" class="text">
    <span ref="spanItem" v-if="!isOver">{{ content }}</span>
    <el-tooltip
      v-else
      class="item"
      effect="dark"
      :content="content"
      :placement="placement"
    >
      <span>{{ content }}</span>
    </el-tooltip>
  </div>
</template>
<script>
export default {
  props: {
    content: { // 标题内容
      type: String,
      default: ''
    },
    maxWidth: {// 最大显示宽度
      type: String,
      default: '100px'
    },
    placement: {// 提示位置
      type: String,
      default: 'top-start'
    }
  },
  data () {
    return {
      isOver: false // 是不是超出指定宽度
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      let dom = this.$refs.spanItem
      if (dom.offsetWidth >= parseInt(this.maxWidth)) {
        this.isOver = true
      } else {
        this.isOver = false
      }
    }
  }
}
</script>
<style scoped="scoped">
.text {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  cursor: pointer;
}
</style>
