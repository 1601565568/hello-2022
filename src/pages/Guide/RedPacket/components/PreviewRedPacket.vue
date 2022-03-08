<template>
  <div class='packet-content'>
    <RedPacket v-if='!$slots.default' :bgHasFont='bgHasFont' :bgImage='bgImage' :bagTip='bagTip' @click.native="handleOpen" :bagName="cloudPlatformType==='ecrp'?'员工姓名发出的红包':'成员姓名发出的红包'"/>
    <span @click="handleOpen"><slot></slot></span>
    <el-drawer
      title="红包封面预览"
      :append-to-body='true'
      :with-header="false"
      :visible.sync="drawer">
      <div class='master-close'>
        <i class="el-icon-close" @click="handleClose"></i>
      </div>
      <h3 class='drawer-title'>红包封面预览</h3>
      <div class='packet-box'><RedPacket :bgHasFont='bgHasFont' :bgImage='bgImage' :bagTip='bagTip' :bagName="cloudPlatformType==='ecrp'?'员工姓名发出的红包':'成员姓名发出的红包'"/></div>
    </el-drawer>
    <el-dialog title="封面预览" :visible.sync="visible" :append-to-body='true'>
      <div class='packet-box bottom'><RedPacket :bgHasFont='bgHasFont' :bgImage='bgImage' :bagTip='bagTip' :bagName="cloudPlatformType==='ecrp'?'员工姓名发出的红包':'成员姓名发出的红包'"/></div>
    </el-dialog>
  </div>
</template>
<script>
import RedPacket from './RedPacket'
import ElDrawer from '@nascent/nui/lib/drawer'
export default {
  data () {
    return {
      cloudPlatformType: this.$store.state.user.remumber.remumber_login_info.productConfig.cloudPlatformType, // 平台判断
      drawer: false,
      visible: false
    }
  },
  props: {
    bgImage: {
      default: ''
    },
    bagTip: {
      default: ''
    },
    bgHasFont: {
      default: false
    },
    previewType: {
      default: 'drawer'
    },
    bagName: {
      default: ''
    }
  },
  components: { RedPacket, ElDrawer },
  methods: {
    handleOpen () {
      if (this.previewType === 'drawer') {
        this.drawer = true
      } else {
        this.visible = true
      }
    },
    handleClose () {
      this.drawer = false
    }
  }
}
</script>
<style lang="scss" scoped>
.packet-content {
  display: inline;
  cursor: pointer;
}

.packet-box {
  width: 375px;
  margin: 0 auto;
  font-size: 30px;
  &.bottom {
    padding-bottom: 40px;
  }
}
.master-close {
  font-size: 16px;
  padding: 16px 16px 4px 16px;
  .el-icon-close {
    cursor: pointer;
  }
}
.drawer-title {
  font-size: 16px;
  color: #262626;
  line-height: 24px;
  font-weight: 500;
  padding:16px;
}
</style>
