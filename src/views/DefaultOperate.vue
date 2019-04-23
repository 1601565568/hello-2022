<template>
  <div>
    <NavHead @brand-change="onReload"/>
    <router-view v-if="isReload"></router-view>
  </div>
</template>
<script>
import loaderNoCacheClose from 'web-crm/src/utils/loaderNoCacheClose'
import NavHead from 'components/layout/OperateNavHead'
export default {
  components: {
    NavHead
  },
  data () {
    return {
      isReload: true
    }
  },
  methods: {
    onReload () {
      this.isReload = false
      this.$nextTick(() => (this.isReload = true))
    }
  },
  created () {
    loaderNoCacheClose()
    // 禁止用F5键
    document.onkeydown = (e) => {
      if (e.key === 'F5') {
        this.onReload()
        e.preventDefault()
        e.returnValue = false
      }
    }
    // 延时预加载文件
    if (process.env.NODE_ENV === 'production') {
      window.setTimeout(() => {
        window.PreloadWebpackPlugin.install()
      }, 500)
    }
  }
}
</script>
