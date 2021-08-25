<template>
  <div class="add-material-bar">
    <div class="add-material-item" @click="visibleTextMessageDialog = true">
      <Icon type="wenbenbeifen-4" class="icon" />
      <span class="tip">文本</span>
    </div>
    <div class="add-material-item">
      <ImageMessage
        @confirm="addMessage"
      >
        <div class="add-material-item" ref="ImageMessage">
          <Icon type="tupianbeifen-5" class="icon" />
          <span class="item-tip">图片</span>
        </div>
      </ImageMessage>
    </div>
    <div class="add-material-item">
      <VideoMessage
        @confirm="addMessage"
        @uploadProgress="uploadVideoProgress"
      >
        <div class="add-material-item" ref="VideoMessage">
          <Icon type="shipinbeifen-4" class="icon" />
          <span class="item-tip">视频</span>
        </div>
      </VideoMessage>
    </div>
    <div class="add-material-item" @click="visibleLinkMessageDialog = true">
      <Icon type="lianjiebeifen-4" class="icon" />
      <span class="item-tip">链接</span>
    </div>
    <div class="add-material-item" @click="visibleMiniProgramMessageDialog = true">
      <Icon type="xiaochengxushouquan" class="icon"/>
      <span class="item-tip">小程序</span>
    </div>
    <div class="add-material-item" @click="visiblePosterMessageDialog = true">
      <Icon type="poster-1" class="icon" />
      <span class="item-tip">二维码海报</span>
    </div>
    <!-- 文本消息 -->
    <TextMessageDialog
      :visible.sync="visibleTextMessageDialog"
      @update:visible="textMsg = null"
      :content="textMsg ? textMsg.content : null"
      @confirm="addMessage"
    />
    <!-- 链接消息 -->
    <LinkMessageDialog
      :content="linkMsg ? linkMsg.content : null"
      :visible.sync="visibleLinkMessageDialog"
      @update:visible="linkMsg = null"
      @confirm="addMessage"
    />
    <!-- 小程序消息 -->
    <MiniProgramMessageDialog
      :content="miniProgramMsg ? miniProgramMsg.content : null"
      :visible.sync="visibleMiniProgramMessageDialog"
      @update:visible="miniProgramMsg = null"
      @confirm="addMessage"
    />
    <!-- 海报消息 -->
    <PosterMessageDialog
      @confirm="addMessage"
      :content="posterMsg ? posterMsg.content.model : null"
      :visible.sync="visiblePosterMessageDialog"
      @update:visible="posterMsg = null"
    />
  </div>
</template>

<script>
import { SOPActivityMessageType } from '../../../types'
import TextMessageDialog from './TextMessageDialog'
import ImageMessage from './ImageMessage'
import VideoMessage from './VideoMessage'
import LinkMessageDialog from './LinkMessageDialog'
import MiniProgramMessageDialog from './MiniProgramMessageDialog'
import PosterMessageDialog from './PosterMessageDialog'

export default {
  components: {
    TextMessageDialog,
    ImageMessage,
    VideoMessage,
    LinkMessageDialog,
    MiniProgramMessageDialog,
    PosterMessageDialog
  },
  data () {
    return {
      visibleTextMessageDialog: false,
      visibleLinkMessageDialog: false,
      visibleMiniProgramMessageDialog: false,
      visiblePosterMessageDialog: false,
      textMsg: null, // { index, content }
      imageMsg: null,
      videoMsg: null,
      linkMsg: null,
      miniProgramMsg: null,
      posterMsg: null
    }
  },
  methods: {
    uploadVideoProgress (message) {
      let msg = {}
      if (this.videoMsg) msg = this.videoMsg
      this.$emit('uploadVideoProgress', { type: 2, ...msg, content: message.content })
    },
    messageLimit () {
      this.$message.error('最多添加10条消息')
    },
    addMessage (content) {
      let msg = {}
      if (this.textMsg) msg = this.textMsg
      if (this.imageMsg) msg = this.imageMsg
      if (this.videoMsg) msg = this.videoMsg
      if (this.linkMsg) msg = this.linkMsg
      if (this.miniProgramMsg) msg = this.miniProgramMsg
      if (this.posterMsg) msg = this.posterMsg

      // 新增时，添加sop活动类型
      let type
      if (msg.type === undefined) {
        type = this.getSopActivityMessageType(content.type)
      }

      this.$emit('addMessage', { type, ...msg, content })

      if (this.imageMsg) this.imageMsg = null
      if (this.videoMsg) this.videoMsg = null
    },
    /**
     * 通过编辑消息打开素材消息的dialog
     */
    openMessageDialogByEdit (context) {
      const { type, index, content } = context
      switch (type) {
        case SOPActivityMessageType.Text:
          this.textMsg = context
          this.visibleTextMessageDialog = true
          break
        case SOPActivityMessageType.Image:
          this.imageMsg = context
          this.$refs.ImageMessage.click()
          break
        case SOPActivityMessageType.Video:
          this.$refs.VideoMessage.click()
          this.videoMsg = context
          break
        case SOPActivityMessageType.Link:
          this.linkMsg = context
          this.visibleLinkMessageDialog = true
          break
        case SOPActivityMessageType.MiniProgram:
          this.miniProgramMsg = context
          this.visibleMiniProgramMessageDialog = true
          break
        case SOPActivityMessageType.Poster:
          this.posterMsg = context
          this.visiblePosterMessageDialog = true
          break
        default:
          break
      }
    },
    setMessageByEdit (context, booleans = false) {
      const { type, index, content } = context
      switch (type) {
        case SOPActivityMessageType.Image:
          this.imageMsg = context
          break
        case SOPActivityMessageType.Video:
          this.videoMsg = context
          break
        default:
          break
      }
    },
    getSopActivityMessageType (weworkMsgType) {
      switch (weworkMsgType) {
        case 'text':
          return SOPActivityMessageType.Text
        case 'image':
          return SOPActivityMessageType.Image
        case 'video':
          return SOPActivityMessageType.Video
        case 'miniprogram':
          return SOPActivityMessageType.MiniProgram
        case 'news':
          return SOPActivityMessageType.Link
        case 'poster': // 没有这个消息类型 实际还是image
          return SOPActivityMessageType.Poster
        default:
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.add-material-bar {
  display: flex;
  height: 92px;
  .add-material-item {
    width: 80px;
    height: 92px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .icon {
      font-size: 32px;
    }
    .item-tip {
      color: #303133;
      margin-top: 4px;
      font-size: 12px;
    }
  }
}
</style>
