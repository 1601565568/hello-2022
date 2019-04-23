<template>
  <div>
    <menu-tab></menu-tab>
    <router-view></router-view>
  </div>
</template>
<script>
import MenuTab from 'components/layout/MenuTab'

export default {
  components: {
    MenuTab
  }
}
</script>
