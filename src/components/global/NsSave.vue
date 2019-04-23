<template>
  <el-button v-if="isAccess"
             @click="handleClick"
             type="primary"
             :size="size"
             :icon="icon"
             :nativeType="nativeType"
             :loading="loading"
             :disabled="disabled"
             :plain="plain"
             :autofocus="autofocus"
             :round="round"
             :circle="circle">{{buttonStr}}
  </el-button>
</template>

<script>
import Button from 'nui-v2/lib/button.js'
import access from 'web-crm/src/utils/access'

/**
   * 配置方法与 ns-button 一致，详细至组件文档查看更多
   * @param {String} title   save/submit/determineine   save
   * 不开放的API  type、round
   */
export default {
  name: 'NsSave',
  components: { 'ElButton': Button },
  inject: {
    elFormItem: {
      default: ''
    }
  },
  data () {
    return {
      round: false,
      isAccess: true
    }
  },
  props: {
    access: String,
    type: {
      type: String,
      default: 'primary'
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
    circle: Boolean,
    title: {
      type: String,
      default: 'save'
    }
  },
  computed: {
    buttonStr () {
      let str = '保存'
      if (this.title === 'submit') {
        str = '提交'
      } else if (this.title === 'confirm') {
        str = '确定'
      } else if (this.title === 'send') {
        str = '发送'
      }
      return str
    }
  },
  methods: {
    handleClick (evt) {
      this.$emit('click', evt)
    },
    accessFn () {
      if (this.access && !access.btn(this.access)) {
        this.isAccess = false
      }
    }
  },
  mounted () {
    this.accessFn()
  }
}
</script>
