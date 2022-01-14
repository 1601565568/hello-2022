<template>
  <el-drawer
    :with-header="false"
    :visible.sync="drawer"
    :before-close="handleClose"
    destroy-on-close
    append-to-body
    :modal="false"
    size="720px"
  >
    <div class="down-view">
      <div class="close-view">
        <Icon type="close" class="close-icon" @click="handleClose" />
      </div>
      <div class="down-title">下载中心</div>
    </div>
  </el-drawer>
</template>

<script>
import ElDrawer from '@nascent/nui/lib/drawer'
export default {
  name: 'downFileList',
  components: {
    ElDrawer
  },
  data () {
    return {
      drawer: false
    }
  },
  methods: {
    handleClose () {
      this.drawer = false
    },
    openDrawer () {
      this.drawer = true
    }
  }
}
</script>

<style lang="scss" scoped>
.down-view {
  padding: 16px;
  .close-view {
    height: 49px;
    display: flex;
    align-items: center;
  }
  .down-title {
    font-size: 16px;
    color: #262626;
    line-height: 24px;
    font-weight: 500;
  }
  .close-icon {
    width: 20px;
    height: 20px;
  }
}
</style>
