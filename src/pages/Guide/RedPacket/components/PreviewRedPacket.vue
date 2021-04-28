<template>
  <div class='packet-content'>
    <RedPacket v-if='!$slots.default' :bgHasFont='true' :bgImage='bgImage' :bagTip='bagTip' @click.native="handleOpen"/>
    <span @click="handleOpen"><slot></slot></span>
    <el-drawer
      title="红包封面预览"
      :append-to-body='true'
      :visible.sync="drawer">
      <div class='packet-box'><RedPacket :bgHasFont='bgHasFont' :bgImage='bgImage' :bagTip='bagTip' /></div>
    </el-drawer>
    <el-dialog title="封面预览" :visible.sync="visible" :append-to-body='true'>
      <div class='packet-box bottom'><RedPacket :bgHasFont='bgHasFont' :bgImage='bgImage' :bagTip='bagTip' /></div>
    </el-dialog>
  </div>
</template>
<script>
import RedPacket from './RedPacket'
import ElDrawer from '@nascent/nui/lib/drawer'
export default {
  data () {
    return {
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
      default: true
    },
    previewType: {
      default: 'drawer'
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
</style>
