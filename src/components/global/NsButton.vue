<template>
  <el-button v-if="isAccess"
             @click="handleClick"
             :type="type"
             :size="size"
             :icon="icon"
             :nativeType="nativeType"
             :loading="loading"
             :disabled="disabled"
             :plain="plain"
             :autofocus="autofocus"
             :round="round"
             :circle="circle">
    <slot></slot>
  </el-button>
</template>

<script>
  import Button from 'nui-v2/lib/button.js'
  import access from 'utils/access'

  /**
   * 配置方法与 ns-button 一致，详细至组件文档查看更多
   * @param {String} title   save/submit/determineine   save
   * 不开放的API  type、round
   */
  export default {
    name: 'NsButton',
    components: {'ElButton': Button},
    data () {
      return {
        isAccess: true
      }
    },
    props: {
      access: String,
      type: {
        type: String,
        default: 'default'
      },
      size: String,
      icon: {
        type: String,
        default: ''
      },
      nativeType: {
        type: String,
        default: 'button'
      },
      loading: Boolean,
      disabled: Boolean,
      plain: Boolean,
      autofocus: Boolean,
      round: Boolean,
      circle: Boolean
    },
    methods: {
      accessFn () {
        if (this.access && !access.btn(this.access)) {
          this.isAccess = false
        }
      },
      handleClick (evt) {
        this.$emit('click', evt)
      }
    },
    mounted () {
      this.accessFn()
    }
  }
</script>
