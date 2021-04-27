<template>
  <el-drawer
    :visible.sync="drawer"
    :direction="direction"
    :before-close="handleClose"
    size="720px"
    :with-header="false"
  >
    <div>
      <div class="close-view">
        <Icon type="close" class="close-icon" @click="closeDeawer" />
      </div>
      <div class="drawer-title">拍摄指南</div>
      <div v-if="info.pitText">
        <div class="drawer-sub-title">坑位拍摄指南</div>
        <div class="drawer-sub-cont">{{ info.pitText }}</div>
      </div>
      <div class="drawer-sub-title">示意图</div>
      <img class="drawer-sub-img" :src="info.url"  v-if="info.url"/>
    </div>
  </el-drawer>
</template>
<script>
import ElDrawer from '@nascent/nui/lib/drawer'

export default {
  name: 'guideInfo',
  components: { ElDrawer },
  props: {
    info: {
      type: Object,
      default () {
        return {
          pitText: '',
          url: ''
        }
      }
    }
  },
  data () {
    return {
      direction: 'rtl',
      drawer: false
    }
  },
  methods: {
    closeDeawer () {
      this.drawer = !this.drawer
    },
    handleClose () {}
  }
}
</script>
<style scoped>
.drawer-title {
  height: 53px;
  font-size: 16px;
  color: #262626;
  line-height: 53px;
  padding-left: 16px;
}
.drawer-sub-title {
  font-size: 14px;
  color: #303133;
  line-height: 55px;
  font-weight: 500;
  padding-left: 32px;
  height: 55px;
}
.drawer-sub-cont {
  font-size: 14px;
  color: #606266;
  line-height: 24px;
  font-weight: 400;
  margin-left: 32px;
  margin-right: 32px;
  padding-bottom: 33px;
  border-bottom: 1px solid #e8e8e8;
}
.drawer-sub-img {
  width: 375px;
  height: 257px;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  margin-left: 32px;
}
.close-view {
  height: 49px;
  display: flex;
  align-items: center;
}
.close-icon {
  margin-left: 16px;
  width: 20px;
  height: 20px;
}
</style>
