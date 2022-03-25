<template>
  <ElDrawer
    size="720px"
    class="group-drawer"
    :modal="false"
    :visible="visible"
    direction="rtl"
    @close="$emit('update:visible', false)"
  >
    <template slot="title">
      <h3 class="title">发送群</h3>
    </template>
    <ActivityGroup
      type="log"
      :reload="visible"
      :activityId="activityId"
      :activityCode="activityCode"
    />
  </ElDrawer>
</template>

<script>
import ElDrawer from '@nascent/nui/lib/drawer'
import ActivityGroup from '../components/ActivityGroup/index.vue'

export default {
  components: {
    ElDrawer,
    ActivityGroup
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    activityId: Number,
    activityCode: String
  },
  mounted () {
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
@import "./styles/drawer-reset.css";

.group-drawer {
  .title {
    font-size: 16px;
    color: #262626;
    line-height: 24px;
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #9093994d;
  }
}
</style>
