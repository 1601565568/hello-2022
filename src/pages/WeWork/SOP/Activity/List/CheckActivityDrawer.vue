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
        class="drawer_content-header"
        v-if="showBtn(activity.status, 'edit')
          || showBtn(activity.status, 'submit')
          || showBtn(activity.status, 'delete')
          || showBtn(activity.status, 'examine')"
      >
        <NsButton v-if="showBtn(activity.status, 'edit')" size="medium" @click="$emit('edit', activityId)">编辑</NsButton>
        <NsButton v-if="showBtn(activity.status, 'submit')" size="medium" @click="$emit('submit', activityId)">提交审核</NsButton>
        <NsButton v-if="showBtn(activity.status, 'delete')" size="medium" @click="$emit('delete', activityId)">删除</NsButton>
        <NsButton v-if="showBtn(activity.status, 'examine')" size="medium" @click="$emit('examine', activityId)">审核</NsButton>
      </div>
      <div class="drawer_content-info">
        <el-form class="el-form-reset" size="medium" label-width="80px" label-position="right" disabled>
          <el-form-item label="编号">
            <el-input :value="activity.code" class="el-input" readonly></el-input>
          </el-form-item>
          <el-form-item label="名称">
            <el-input :value="activity.name" class="el-input" readonly></el-input>
          </el-form-item>
          <el-form-item label="创建人">
            <el-input :value="activity.creatorName" class="el-input" readonly></el-input>
          </el-form-item>
          <el-form-item label="发送方式" v-if="activity.sendType === 0">
            <el-radio v-model="activity.sendType" :label="0">立即发送</el-radio>
          </el-form-item>
          <el-form-item label="发送方式" v-else>
            <el-radio v-model="activity.sendType" :label="1" style="margin-right: 16px">定时发送</el-radio>
            <el-date-picker
              type="datetime"
              placeholder="请选择"
              :value="activity.sendTime"
              :clearable="false"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="发送内容">
            <div class="send-message">
              <span>共{{activity.contentList && activity.contentList.length}}条消息</span>
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
          :activityId="activityId"
          :reload="visible"
        />
      </div>
      <div
        class="drawer_content-examine-status block-line"
        v-if="!(panelType === 'examine' && activity.status === SOPExamineStatus.Pending)"
      >
        <el-form class="el-form-reset" size="medium" label-width="80px" label-position="right">
          <el-form-item label="审核状态">
            <span v-if="activity.status === SOPExamineStatus.Failed">审核失败</span>
            <span v-else-if="activity.status === SOPExamineStatus.UnSubmit">待提交</span>
            <span v-else-if="activity.status === SOPExamineStatus.Pending">待审核</span>
            <span v-else-if="activity.status === SOPExamineStatus.Succeed">审核成功</span>
          </el-form-item>
          <el-form-item label="失败原因" v-if="activity.status === SOPExamineStatus.Failed && activity.reamrk">
            <span class="examine-failed-reason">{{activity.reamrk}}</span>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </ElDrawer>
</template>

<script>
import ElDrawer from '@nascent/nui/lib/drawer'
import ActivityGroup from '../../components/ActivityGroup/index.vue'
import MessagePreviewPanel from '../../components/MessagePreviewPanel/index.vue'
import { SOPExamineStatus } from '../../types'

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
    activityId: Number,
    panelType: {
      type: String,
      default: 'activity',
      validator: function (value) {
        // activity 创建活动使用 examine 审核页面使用
        return ['activity', 'examine'].indexOf(value) !== -1
      }
    }
  },
  data () {
    return {
      SOPExamineStatus,
      loading: false,
      activity: {}
    }
  },
  methods: {
    /**
     * 是否显示按钮
     */
    showBtn (status, btnType) {
      // 活动日历页面
      if (this.panelType === 'activity') {
        // 编辑 提交审核 删除
        if (btnType === 'edit' || btnType === 'submit' || btnType === 'delete') {
          // 待提交、审核失败
          if (status === SOPExamineStatus.UnSubmit || status === SOPExamineStatus.Failed) {
            return true
          } else {
            return false
          }
        }

        // 查看按钮
        if (btnType === 'check') {
          return true
        }

        // 审核按钮
        if (btnType === 'examine') {
          return false
        }
      } else if (this.panelType === 'examine') {
        // 审核页面
        // 编辑按钮
        if (btnType === 'edit' || btnType === 'submit' || btnType === 'delete') {
          return false
        }

        // 查看按钮
        if (btnType === 'check') {
          // 审核成功、失败
          if (status === SOPExamineStatus.Succeed || status === SOPExamineStatus.Failed) {
            return true
          } else {
            return false
          }
        }

        // 审核按钮
        if (btnType === 'examine') {
          // 待审核
          if (status === SOPExamineStatus.Pending) {
            return true
          } else {
            return false
          }
        }
      }
      // 非定义类型返回 false
      return false
    },
    open () {
      this.getActivityDetailById(this.activityId)
    },
    getActivityDetailById (id) {
      this.loading = true
      this.$http.fetch(this.$api.weWork.sop.findById, { id })
        .then(resp => {
          this.activity = resp.result
          this.loading = false
          this.resetScroll()
        }).catch(() => {
          this.$notify.error('获取活动详情失败')
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
@import "./styles/drawer-reset.css";
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
          span {
            font-size: 14px;
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
