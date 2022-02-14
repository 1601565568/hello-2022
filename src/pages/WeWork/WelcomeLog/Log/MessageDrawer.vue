<template>
  <ElDrawer size="378px"
            class="drawer"
            :modal="false"
            :visible="visible"
            direction="rtl"
            @close="$emit('update:visible', false)"
            @open="open">
    <template slot="title">
      <h3 class="title">发送消息</h3>
    </template>
    <div class="group-container">
      <MessagePreviewPanel class="message-preivew-panel"
                           :avatar="false"
                           :list="model.annexList" />
    </div>
  </ElDrawer>
</template>

<script>
import ElDrawer from '@nascent/nui/lib/drawer'
import MessagePreviewPanel from '../components/MessagePreviewPanel'

export default {
  components: {
    ElDrawer,
    MessagePreviewPanel
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    msgContent: {}
  },
  data () {
    return {
      model: {}
    }
  },
  mounted () { },
  methods: {
    open () {
      //   this.model = JSON.parse(this.msgContent)
      //   this.getActivityDetailById(this.activityId)
      this.model = this.msgContent
    },
    getActivityDetailById (id) {
      this.$http.fetch(this.$api.weWork.sop.findById, { id })
        .then(resp => {
          this.model = resp.result
        }).catch(() => {
          this.$notify.error('获取活动详情失败9090')
        })
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

  .group-container {
    width: 100%;
    .message-preivew-panel {
      margin-left: 8px;
      width: calc(100% - 16px);
      background: #fff;
    }
  }
}
</style>
