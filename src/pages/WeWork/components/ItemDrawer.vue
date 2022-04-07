<template>
  <div class="item-content">
    <div class="item-wrapper">
      <div class="item-header">
        <div class="master-close" @click="handleClose">
          <i class="el-icon-close"></i>
        </div>
      </div>
      <div class="title">
        {{ `员工${this.userInfo.userName}的` || '' }}聊天记录
      </div>
      <div class="warpper">
        <ChatRecordList
          v-if="drawer"
          :dataList="dataList"
          @getMore="getMore"
          @handleScrollTop="handleScrollTop"
        />
      </div>
    </div>
  </div>
</template>
<script>
import ChatRecordList from '@/pages/Social/components/chatRecordList'
export default {
  components: { ChatRecordList },
  data () {
    return {}
  },
  props: {
    dataList: {
      default () {}
    },
    drawer: {
      type: Boolean
    },
    userInfo: {
      type: Object
    }
  },
  methods: {
    getMore () {
      this.$emit('getMore')
    },
    handleScrollTop () {
      this.$emit('handleScrollTop')
    },
    handleClose () {
      this.$emit('handleClose')
    }
  }
}
</script>
<style lang="scss" scoped>
.item-content {
  height: 100vh;
  overflow-y: auto;
}
.item-wrapper {
  position: relative;
  padding: 12px 0px;
  min-height: 100vh;
  padding-bottom: 20px;
  .item-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 16px;
    .master-close {
      font-size: 16px;
    }
  }
  .title {
    height: 56px;
    line-height: 56px;
    padding: 0 16px;
    font-weight: bold;
    font-size: 16px;
    background: #fff;
    color: #262626;
  }
  .footer {
    position: absolute;
    right: 16px;
    bottom: 12px;
  }
  .pagecontent-left {
    width: 223px;
    height: 32px;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    border-radius: 2px;
    display: flex;
    position: relative;
    user-select: none;
    cursor: pointer;
    &:after {
      content: ' ';
      position: absolute;
      left: 50%;
      top: 4px;
      bottom: 4px;
      width: 1px;
      background-color: #e8e8e8;
    }
    .content-item {
      width: 50%;
      font-size: 14px;
      color: #595959;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
.warpper {
  width: 100%;
  height: calc(100vh - 120px);
  background: #f5f5f5;
}
.dwaer-popper {
  min-width: 0 !important;
}
</style>
<style lang="css">
.dwaer-popper {
  min-width: 0 !important;
}
</style>
