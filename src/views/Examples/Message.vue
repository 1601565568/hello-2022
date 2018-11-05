<template>
  <div>
    <ns-button :plain="true" @click="open2">成功</ns-button>
    <ns-button :plain="true" @click="open3">警告</ns-button>
    <ns-button :plain="true" @click="open">消息</ns-button>
    <ns-button :plain="true" @click="open4">错误</ns-button>
  </div>
</template>
<script>
  export default {
    data () {
      return {
      }
    },
    methods: {
      open () {
        this.$notify.info('这是一条提示消息')
      },
      open2 () {
        this.$notify.success('这是一条成功的提示消息')
      },

      open3 () {
        this.$notify.warning('这是一条警告的提示消息')
      },

      open4 () {
        this.$notify.error('这是一条错误的提示消息')
      }
    },
    created () {
    },
    mounted () {
    }
  }
</script>
