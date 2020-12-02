<template>
  <el-dialog title="设置热区"
             width="1000px"
             :visible.sync="hotVisible">
    <el-row class="hot-area">
      <el-col :span="16" class="hot-area-left hot-area-container">
        <el-scrollbar Zref="fullScreen" style='height:500px'>
          <HotZone
            ref="hotZone"
            :image="url"
            :zonesInit="zones"
            :max='max'
            @add="handleAdd"
            @remove="handleRemove"
          ></HotZone>
        </el-scrollbar>
      </el-col>
      <el-col :span="7" :offset="1" class="hot-area-right hot-area-container">
        <el-scrollbar ref="fullScreen" style='height:500px'>
          <div class="hot-header">
            <ns-button @click="handleAddHot">添加热区</ns-button>
          </div>
          <template v-for="(item,index) in zones">
            <div class="hot-item" :key="index">
              <p>热区{{index+1}}:</p>
              <el-input v-model='zones[index].url'>
                <template slot="prepend">链接</template>
              </el-input>
            </div>
          </template>
        </el-scrollbar>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <ns-button @click="handleCancel">取消</ns-button>
      <ns-button type="primary" @click="handleSure">确定</ns-button>
    </span>
  </el-dialog>
</template>
<script>
import HotZone from './HotZone'

export default {
  data () {
    return {
      hotData: [],
      ratio: 1,
      zones: []
    }
  },
  props: {
    data: {
      required: true,
      default () {
        return []
      }
    },
    hotVisible: {
      required: true,
      default: false
    },
    url: {
      default: ''
    },
    defaultName: {
      default: '链接'
    },
    max: {
      default: 10
    }
  },
  created () {
    this.zones = this.data || []
  },
  methods: {
    handleAdd (zone) {
      zone.url = ''
      this.zones.push(zone)
    },
    handleRemove (index) {
      this.zones.splice(index, 1)
    },
    handleSure () {
      this.$emit('setHotData', this.zones)
      this.handleCancel()
    },
    handleAddHot () {
      if (this.zones.length < this.max) {
        const data = {
          heightPer: 0.3555,
          url: '',
          leftPer: 0.3625,
          topPer: 0.3261,
          widthPer: 0.2396
        }
        this.$refs.hotZone.addItem(data)
      } else {
        this.$notify.error(`最多可设置${this.max}个热区`)
      }
    },
    handleCancel () {
      this.$emit('handleCancel')
    }
    // change (href, item, index) {
    //   this.$set(this.zones, index, { ...this.zones[index], url: href })
    // }
  },
  components: {
    HotZone
  }
}
</script>
<style scoped>
.hot-area >>> .el-scrollbar__wrap{
  overflow-x: hidden;
}
.hot-area .hot-area-container {
  border: 1px solid #E3E2E5;
  border-radius: 8px;
}
.hot-header {
  display: flex;
    border-bottom: 1px solid #E3E2E5;
    padding: 10px;
}
.hot-item {
  padding: 10px;
}
</style>
