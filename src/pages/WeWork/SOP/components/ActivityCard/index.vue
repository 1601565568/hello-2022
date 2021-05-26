<template>
  <div class="activity-card">
    <div class="activity-card-state">
      <img v-if="activity.status === SOPExamineStatus.UnSubmit" src="@/icons/outline/daitijiao.svg" alt="">
      <img v-else-if="activity.status === SOPExamineStatus.Pending" src="@/icons/outline/daishenhe.svg" alt="">
      <img v-else-if="activity.status === SOPExamineStatus.Succeed" src="@/icons/outline/shenhechenggong.svg" alt="">
      <img v-else-if="activity.status === SOPExamineStatus.Failed" src="@/icons/outline/shenheshibai.svg" alt="">
    </div>
    <div class="activity-card_header">
      <span class="activity-id">{{activity.code}}</span>
      <span class="activity-name">{{activity.name}}</span>
      <span class="activity-time">
        {{
          activity.sendType === 0 && activity.status !== SOPExamineStatus.Succeed
          ? '立即发送' : activity.sendTime
        }}
      </span>
    </div>
    <div class="activity-card_content">
      <slot></slot>
    </div>
    <div class="activity-card_footer">
      <div class="message-icons">
        <span class="message-icons-title">共{{activity.contentList.length}}条消息</span>
        <div class="message-icons-list">
          <el-tooltip
            v-for="(item, index) in messageToolTipList(activity.contentList)"
            :key="index"
            class="message-icons-item"
            :content="item.tip"
            placement="top"
          >
            <span><Icon :type="item.icon" className="icon"/></span>
          </el-tooltip>
        </div>
      </div>
      <div class="operation-footer">
        <slot name="footer"></slot>
        <!-- <div>
          <NsButton type="text" class="group-count" @click="checkActivityGroup">10</NsButton>个群
        </div>
        <div>
          <NsButton type="text" class="group-count" @click="editActivity">编辑</NsButton>
          <NsButton type="text" class="group-count" @click="checkActivity">查看</NsButton>
          <NsButton type="text" class="group-count" @click="submitActivity">提交审核</NsButton>
          <NsButton type="text" class="group-count" @click="deleteActivity">删除</NsButton>
          <NsButton type="text" class="group-count" @click="examineActivity">审核</NsButton>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { SOPActivityMessageType, SOPExamineStatus, SOPMessageTypeToolTip } from '../../types'

export default {
  props: {
    activity: {
      type: Object
    }
  },
  data () {
    return {
      SOPActivityMessageType: SOPActivityMessageType,
      SOPExamineStatus: SOPExamineStatus
    }
  },
  mounted () {},
  methods: {
    messageToolTipList (list) {
      const messageTypes = Array.from(new Set(list.map(item => item.type))).sort()
      return messageTypes.map(type => {
        return SOPMessageTypeToolTip[type]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.activity-card {
  position: relative;
  padding: 16px;
  display: flex;
  flex-direction: column;

  .activity-card-state {
    position: absolute;
    right: 0;
    top: 0;
    width: 57px;
    height: 47px;
    .icon {
      font-size: 57px;
      // color: #FFAE09;
    }
    img {
      width: 57px;
      user-select: none;
    }
  }

  .activity-card_header {
    display: flex;
    flex-direction: column;
    span {
      font-size: 12px;
      color: #383838;
      display: inline-block;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .activity-name {
      margin-top: 4px;
      font-size: 14px;
      font-weight: bold;
    }
    .activity-time {
      margin-top: 4px;
      color:#909399;
    }
  }
  .activity-card_content {
    margin-top: 8px;
    height: 161px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    div:nth-child(1) {
      flex-shrink: 0;
      margin-top: 4px;
    }

    div:nth-child(2) {
      margin-top: 4px;
    }
  }
  .activity-card_footer {
    .message-icons {
      margin-top: 8px;
      display: flex;
      align-items: center;
      .message-icons-title {
        min-width: 56px;
        max-width: 64px;
        white-space: nowrap;
        // overflow: hidden;
        // text-overflow: ellipsis;
        display: inline-block;
      }
      .message-icons-list {
        margin-left: 3px;
        display: flex;
        align-items: center;
        height: 16px;
        font-size: 16px;
        width: 185px;
        .message-icons-item {
          margin-left: 6.5px;
          flex-shrink: 1;
        }

        .icon {
          font-size: 16px;
          color:#383838;
        }
      }
    }

    .operation-footer {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
