<template>
  <el-dialog
    width="1174px"
    :show-close="false"
    :visible="visible"
    @close="$emit('close')"
    @open="openDialog"
  >
    <div class="custom-header" slot="title">
      <div class="header-title">
        <h3>自定义指标</h3>
        <span class="select-tip">已选<i>9/9</i>个表头</span>
      </div>
      <el-input placeholder="请输入渠道名称" v-model="filterText">
        <Icon type="ns-search-copy" slot="suffix" style="font-size: 24px; margin-top: 2px"></Icon>
      </el-input>
    </div>
    <div class="indicator-list">
      <el-checkbox-group v-model="checkedChannels">
        <el-checkbox v-for="item in channels" :label="item.channel_code" :key="item.channel_code">{{item.channel_name}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <span slot="footer" class="dialog-footer">
      <ns-button type="text" style="float: left">恢复默认</ns-button>
      <ns-button @click="$emit('close')">取 消</ns-button>
      <ns-button type="primary" @click="confirm">确 定</ns-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ['visible', 'selectedChannels'],
  data () {
    return {
      centerDialogVisible: false,
      filterText: '',
      checkedChannels: [],
      channels: []
    }
  },
  mounted () {
    this.getChannelList()
  },
  methods: {
    async getChannelList () {
      try {
        const res = await this.$http.fetch(this.$api.guide.channel.getChannelList)

        window.console.log('自定义指标', res)
        if (res.success) {
          this.channels = res.result
        } else {
          this.$notify.error('自定义指标获取失败')
        }
      } catch (resErr) {
        this.$notify.error('自定义指标获取失败')
      }
    },
    async openDialog () {
      this.checkedChannels = this.selectedChannels || []
      await this.getChannelList()
    },
    confirm () {
      this.$emit('confirm', this.checkedChannels)
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./styles/indicator-dialog-reset.css";
.custom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  border-bottom: 1px solid #E8E8E8;
  .header-title {
    display: flex;
    h3 {
      margin-left: 6px;
      font-size: 16px;
    }
    .select-tip {
      margin-left: 8px;
      i {
        font-style: normal;
        font-weight: bold;
      }
    }
  }
}

.indicator-list {
  padding-top: 8px;
  margin-left: 6px;
  height: 100%;
}

.dialog-footer {
  .el-button {
    font-size: 14px;
    height: 32px;
  }
}
</style>
