<template>
  <div class="add-material-bar">
    <div class="add-material-item">
      <ImageMessage
        @confirm="addMessage"
        :multiple='multipleImage'
        :limit='limitImage'
      >
        <div class="add-material-item" ref="ImageMessage">
          <Icon type="tupianbeifen-4" class="icon" />
          <i class="iconfont icon-tupianbeifen5 icon"></i>
          <span class="item-tip">图片</span>
        </div>
      </ImageMessage>
    </div>
    <div class="add-material-item">
      <VideoMessage
        @confirm="addVideoMessage"
        @uploadProgress="uploadVideoProgress"
      >
        <div class="add-material-item" ref="VideoMessage">
          <i class="iconfont icon-shipinbeifen4 icon"></i>
          <span class="item-tip">视频</span>
        </div>
      </VideoMessage>
    </div>
    <div class="add-material-item" @click="visibleLinkMessageDialog = true">
      <i class="iconfont icon-lianjie icon"></i>
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
      :content="posterMsg ? posterMsg.content : null"
      :visible.sync="visiblePosterMessageDialog"
      @update:visible="posterMsg = null"
    />
  </div>
</template>

<script>
// import { ScWelcomeMessageType } from '../../typecs'
import { WelcomeMessageType } from '../../types'
import ImageMessage from './ImageMessage'
import VideoMessage from './VideoMessage'
import LinkMessageDialog from './LinkMessageDialog'
import MiniProgramMessageDialog from './MiniProgramMessageDialog'
import PosterMessageDialog from './PosterMessageDialog'
export default {
  components: {
    ImageMessage,
    VideoMessage,
    LinkMessageDialog,
    MiniProgramMessageDialog,
    PosterMessageDialog
  },
  props: {
    // 是否支持多选图片
    multipleImage: {
      type: Boolean,
      default: false
    },
    // 图片一次最多上传张数
    limitImage: {
      type: Number,
      default: 99999
    }
  },
  data () {
    return {
      visibleLinkMessageDialog: false,
      visibleMiniProgramMessageDialog: false,
      visiblePosterMessageDialog: false,
      textMsg: null, // { index, content }
      imageMsg: null,
      videoMsg: null,
      linkMsg: null,
      miniProgramMsg: null,
      posterMsg: null,
      pitbitMsg: null,
      imageCodeMsg: null,
      visibleImageCodeDialog: false
    }
  },
  methods: {
    uploadImageProgress (message) {
      let msg = {}
      if (this.imageMsg) msg = this.imageMsg
      this.$emit('uploadImageProgress', { type: WelcomeMessageType.Image, ...msg, content: message.content })
    },
    uploadVideoProgress (message) {
      let msg = {}
      if (this.videoMsg) msg = this.videoMsg
      this.$emit('uploadVideoProgress', { type: WelcomeMessageType.Video, ...msg, content: message.content })
    },
    addVideoMessage (message) {
      let msg = {}
      if (this.videoMsg) msg = this.videoMsg
      this.$emit('addMessage', { ...msg, type: WelcomeMessageType.Video, content: message.content })
      if (this.videoMsg) this.videoMsg = null
    },
    addMessage (message) {
      let msg = {}
      if (this.imageMsg) msg = this.imageMsg
      // if (this.videoMsg) msg = this.videoMsg
      if (this.linkMsg) msg = this.linkMsg
      if (this.miniProgramMsg) msg = this.miniProgramMsg
      if (this.posterMsg) msg = this.posterMsg
      // 新增时，添加sop活动类型
      let type
      if (msg.type === undefined) {
        type = this.getWelcomeMessageType(message.type)
      } else {
        type = msg.type
      }
      this.$emit('addMessage', { ...msg, type, content: message.content })

      if (this.imageMsg) this.imageMsg = null
      // if (this.videoMsg) this.videoMsg = null
    },
    /**
     * 通过编辑消息打开素材消息的dialog
     */
    openMessageDialogByEdit (context) {
      const { type, index, content } = context
      let tType = WelcomeMessageType
      switch (type) {
        case tType.Image:
          this.imageMsg = context
          this.$refs.ImageMessage.click()
          break
        case tType.Video:
          this.$refs.VideoMessage.click()
          this.videoMsg = context
          break
        case tType.Link:
          this.linkMsg = context
          this.visibleLinkMessageDialog = true
          break
        case tType.MiniProgram:
          this.miniProgramMsg = context
          this.visibleMiniProgramMessageDialog = true
          break
        case tType.Poster:
          this.posterMsg = context
          this.visiblePosterMessageDialog = true
          break
        default:
          break
      }
    },
    getWelcomeMessageType (msgType) {
      switch (msgType) {
        case 'image':
          return WelcomeMessageType.Image
        case 'video':
          return WelcomeMessageType.Video
        case 'miniprogram':
          return WelcomeMessageType.MiniProgram
        case 'link':
          return WelcomeMessageType.Link
        case 'poster':
          return WelcomeMessageType.Poster
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
  flex-direction: row;
  // height: 92px;
  .bitpit{
    width: 40px;
    height: 40px;
  }
  .add-material-item {
    width: 80px;
    height: 92px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .icon {
      font-size: 40px;
      color: #000;
      height: 40px;
      &:before{
        vertical-align: top;
        line-height: 40px;
      }
    }
    .item-tip {
      color: #303133;
      margin-top: 4px;
      font-size: 12px;
    }
  }
}
</style>
