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
        <span class="select-tip">已选<i>{{checkedChannels.length}}/{{channelList.length}}</i>个表头</span>
      </div>
      <el-input placeholder="请输入渠道名称" v-model="searchChannelName">
        <Icon type="ns-search-copy" slot="suffix" style="font-size: 24px; margin-top: 2px"></Icon>
      </el-input>
    </div>
    <div class="channel-list">
      <el-checkbox-group v-model="checkedChannels">
        <el-checkbox v-for="item in showChannelList" :label="item.channel_code" :key="item.channel_code">{{item.channel_name}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-checkbox style="float: left; margin-left: 6px;" :value="checkedChannels.length === channelList.length" @change="checkAll">全选</el-checkbox>
      <ns-button @click="$emit('close')">取 消</ns-button>
      <ns-button type="primary" @click="confirm">确 定</ns-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ['visible', 'channelList', 'selectedChannels'],
  data () {
    return {
      centerDialogVisible: false,
      searchChannelName: '',
      checkedChannels: []
    }
  },
  computed: {
    showChannelList () {
      if (!this.channelList) {
        return this.channelList
      } else {
        return this.channelList.filter(item => item.channel_name.indexOf(this.searchChannelName) > -1)
      }
    }
  },
  methods: {
    async openDialog () {
      this.checkedChannels = this.selectedChannels || []
    },
    confirm () {
      if (this.checkedChannels.length) {
        this.$emit('confirm', this.checkedChannels)
        this.$emit('close')
      } else {
        this.$message.error('至少选择一个指标')
      }
    },
    checkAll (isChecked) {
      if (isChecked) {
        this.checkedChannels = this.channelList.map(item => item.channel_code)
      } else {
        this.checkedChannels = []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./styles/channel-list-dialog-reset.css";
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

.channel-list {
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
