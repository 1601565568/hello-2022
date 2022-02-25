<template>
  <div>
    <iframe-router-view></iframe-router-view>
  </div>
</template>
<script>
import Vue from 'vue/dist/vue.js'
import App from '@nascent/ecrp-ecrm/src/App.vue'
import iframeRouterView from '@/components/iframe-router-view'
export default {
  name: 'app',
  components: {
    iframeRouterView
  }
}
</script>
