<template>
  <div class='packet-content'>
    <RedPacket v-if='!$slots.default' :bgHasFont='true' :bgImage='bgImage' @click.native="handleOpen"/>
    <span @click="handleOpen"><slot></slot></span>
    <el-drawer
      title="红包封面预览"
      :append-to-body='true'
      :visible.sync="drawer">
      <div class='packet-box'><RedPacket :bgImage='bgImage' /></div>
    </el-drawer>
  </div>
</template>
<script>
import RedPacket from './RedPacket'
import ElDrawer from '@nascent/nui/lib/drawer'
export default {
  data () {
    return {
      drawer: false
    }
  },
  props: {
    bgImage: {
      default: ''
    }
  },
  components: { RedPacket, ElDrawer },
  methods: {
    handleOpen () {
      this.drawer = true
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
}
</style>
