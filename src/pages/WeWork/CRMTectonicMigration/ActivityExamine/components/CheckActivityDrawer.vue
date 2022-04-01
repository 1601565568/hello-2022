<template>
  <ElDrawer
    size="720px"
    class="drawer"
    :modal="false"
    :visible="visible"
    direction="rtl"
    @close="$emit('update:visible', false)"
    @open="open"
  >
    <template slot="title">
      <h3 class="title">查看</h3>
    </template>
    <div class="drawer_content" v-loading="loading" ref="DrawerContent">
      <div
        class="drawer_content-header">
        <NsButton size="medium" @click="$emit('examine', messageId)">审核</NsButton>
      </div>
      <div class="drawer_content-info">
        <el-form class="el-form-reset" size="medium" label-width="80px" label-position="right" disabled>
          <el-form-item label="活动名称">
            <el-input :value="activity.name" class="el-input" readonly></el-input>
          </el-form-item>
          <el-form-item label="创建人">
            <el-input :value="activity.employeeName" class="el-input" readonly></el-input>
          </el-form-item>
          <el-form-item label="执行时间" v-if="activity.sendType === 0">
            <el-radio v-model="activity.sendType" :label="0">立即发送</el-radio>
          </el-form-item>
          <el-form-item label="执行时间" v-else>
            <el-radio v-model="activity.sendType" :label="1" style="margin-right: 16px">定时发送</el-radio>
            <el-date-picker
              type="datetime"
              placeholder="请选择"
              :value="activity.predictSendTime"
              :clearable="false"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="发送内容">
            <div class="send-message">
              <span class="send-num">共{{activity.contentList && activity.contentList.length}}条消息</span>
              <MessagePreviewPanel
                ref="MessagePreviewPanel"
                class="message-box"
                :list="activity.contentList"
              />
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="drawer_content-group block-line">
        <ActivityGroup
          :messageId="messageId"
          :reload="visible"
          :type="type"
          :urlList="urlList"
        />
      </div>
    </div>
  </ElDrawer>
</template>

<script>
import ElDrawer from '@nascent/nui/lib/drawer'
import ActivityGroup from './ActivityGroup.vue'
import MessagePreviewPanel from '@/pages/WeWork/SOP/components/MessagePreviewPanel/index.vue'

export default {
  components: {
    ElDrawer,
    ActivityGroup,
    MessagePreviewPanel
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    messageId: Number
  },
  data () {
    return {
      loading: false,
      activity: {},
      type: 'staff',
      urlList: this.$api.weWork.sop.getChatRoomInfoList
    }
  },
  methods: {
    /**
     * 获取好友营销详情接口
     */
    getActivityDetailById () {
      this.loading = true
      this.visible = true
      this.$http.fetch(this.$api.marketing.weworkMarketing.getMsgDetail, { messageId: this.messageId })
        .then((resp) => {
          if (resp && resp.result) {
            let audioModel = {}
            audioModel.name = resp.result.name
            audioModel.employeeName = resp.result.employee.name
            audioModel.sendType = resp.result.predictSendTime + '' === 'null' ? 0 : 1
            audioModel.predictSendTime = resp.result.predictSendTime
            // Todo
            audioModel.contentList = resp.result.attachments
            // let typeName = ''
            if (resp.result.type === 3) {
              this.type = 'group'
            } else if (resp.result.type === 1) {
              this.type = 'staff'
            }
            // audioModel.obj = resp.result.targets.length + typeName
            this.activity = audioModel
          }
        }).catch((resp) => {
          this.$notify.error(resp.msg)
          this.$reload()
        }).finally(() => {
          this.loading = false
        })
    },
    resetScroll () {
      this.$refs.DrawerContent.parentElement.scrollTop = 0
      this.$refs.MessagePreviewPanel.$el.scrollTop = 0
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-drawer__header {
  margin-bottom: 0px;
}

::v-deep .el-drawer__body {
  overflow: auto;
}

.el-form-reset {
  ::v-deep .el-form-item {
    font-size: 14px;
    .el-form-item__label {
      font-size: 14px;
      margin-right: 16px;
    }
    .el-form-item__content {
      line-height: 40px;
    }
    .el-radio__label {
      font-size: 14px;
      margin-right: 16px;
    }
  }
}
.drawer {
  .title {
    font-size: 16px;
    color: #262626;
    line-height: 24px;
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #9093994d;
  }

  .drawer_content {
    position: relative;
    .drawer_content-header {
      position: sticky;
      top: 0;
      z-index: 10;
      background: #fff;
      height: 65px;
      width: 100%;
      padding-right: 14px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    .drawer_content-info {
      .el-form-item {
        margin-bottom: 24px;
        .el-input {
          width: 610px;
        }
        .el-date-editor {
          width: 240px;
        }
        .send-message {
          .send-num {
            font-size: 14px;
            display: inline-block;
            line-height: 36px;
            vertical-align: top;
          }
          .message-box {
            line-height: 20px;
            margin-left: 16px;
            width: 320px;
            height: 320px;
          }
        }
      }
    }
    .drawer_content-examine-status {
      margin-top: 20px;
      .el-form-item {
        span {
          max-width: 600px;
          display: inline-block;
          font-size: 14px;
          line-height: 22px;
        }
      }
      .examine-failed-reason {
        width: 610px;
        white-space: pre-wrap;
        margin-top: 5px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #383838;
        letter-spacing: 0;
        line-height: 24px;
        font-weight: 400;
      }
    }
    .block-line::before {
        content: '';
        display: block;
        width: 100%;
        height: 8px;
        background:#F5F5F5;;
    }
  }
}
</style>
