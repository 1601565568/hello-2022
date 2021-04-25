<template>
  <div class="activity-card">
    <div class="activity-card-state">
      <img v-if="activity.status === SOPExamineStatus.UnSubmit" src="./images/daitijiao.png" alt="">
      <img v-else-if="activity.status === SOPExamineStatus.Pending" src="./images/daishenhe.png" alt="">
      <img v-else-if="activity.status === SOPExamineStatus.Succeed" src="./images/shenhechenggong.png" alt="">
      <img v-else-if="activity.status === SOPExamineStatus.Failed" src="./images/shenheshibai.png" alt="">
    </div>
    <div class="activity-card_header">
      <span class="activity-id">{{activity.code}}</span>
      <span class="activity-name">{{activity.name}}</span>
      <span class="activity-time">{{activity.sendType === 0 ? '立即发送' : activity.sendTime}}</span>
    </div>
    <div class="activity-card_content">
      <slot></slot>
    </div>
    <div class="activity-card_footer">
      <div class="message-icons">
        <span class="message-icons-title">共{{activity.contentList.length}}条消息</span>
        <div class="message-icons-list">
          <el-tooltip
              v-for="item in messageToolTipList(activity.contentList)"
              :key="item.type"
              class="message-icons-item"
              :content="item.tip"
              placement="top"
            >
              <Icon :type="item.icon" className="icon"/>
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
      const messageTypes = Array.from(new Set(list.map(item => item.type)))
      return messageTypes.map(type => {
        return SOPMessageTypeToolTip[type]
      })
    },
    /**
     * 查看活动的群
     */
    checkActivityGroup () {

    },
    /**
     * 编辑活动
     */
    editActivity () {
      window.console.log('编辑活动')
    },
    /**
     * 查看活动
     */
    checkActivity () {
      window.console.log('查看活动')
    },
    /**
     * 提交活动审核
     */
    submitActivity () {
      this.$confirm('提交后不可编辑内容，请再次确定是否要提交', '确定提交审核？', {
        confirmButtonText: '提交',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '提交审核成功'
        })
      }).catch(() => {})
    },
    /**
     * 删除活动
     */
    deleteActivity () {
      this.$confirm('删除后不可恢复，请再次确定是否要删除', '确定删除？', {
        confirmButtonText: '提交',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }).catch(() => {})
    },
    /**
     * 审核活动
     */
    examineActivity () {
      window.console.log('审核')
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

    div:nth-child(2) {
      flex-shrink: 100;
      max-height: 121px;
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
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
      }
      .message-icons-list {
        margin-left: 5px;
        display: flex;
        align-items: center;
        height: 16px;
        font-size: 16px;
        width: 185px;
        .message-icons-item {
          margin-left: 4px;
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
