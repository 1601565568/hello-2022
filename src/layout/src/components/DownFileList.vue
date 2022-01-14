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
      <div class="remind-view">
        下载中心仅保留近3天生成的报表，请尽快下载
      </div>
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
    padding: 12px 0;
  }
  .close-icon {
    width: 20px;
    height: 20px;
  }
  .remind-view {
    width: 688px;
    background: #f2f9fe;
    border-radius: 2px;
    margin-top: 16px;
    font-size: 14px;
    color: #595959;
    line-height: 22px;
    padding: 9px 16px;
  }
}
</style>
