<template>
  <div class="add-material-bar">
    <div v-if="pitBit" class="add-material-item" @click="addCustomImg">
      <!-- <Icon type="poster-1" class="icon" /> -->
      <img class="bitpit" src="@/assets/kwBig.png" alt="">
      <span class="item-tip">自建坑位</span>
    </div>
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
    <div v-if="pitBit" class="add-material-item" @click="showImageCode">
      <i class="iconfont icon-fumatupian-copy icon" style="font-size:40px;"></i>
      <span class="item-tip">附码图片</span>
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
    <div v-if="!pitBit" class="add-material-item" @click="visiblePosterMessageDialog = true">
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
    <!-- 自建坑位消息 -->
    <PitbitMessageDialog
      ref='pitbit'
      @confirm="addMessage"
      :content="pitbitMsg ? pitbitMsg.content : null"
      :visible.sync="visiblePitbitMessageDialog"
      @update:visible="pitbitMsg = null"
    />
    <ImageCode
      @confirm="addMessage"
      ref='imagecode'
    />
  </div>
</template>

<script>
import { ScWelcomeMessageType } from '../../typecs'
import { WelcomeMessageType } from '../../types'
import ImageMessage from './ImageMessage'
import VideoMessage from './VideoMessage'
import LinkMessageDialog from './LinkMessageDialog'
import MiniProgramMessageDialog from './MiniProgramMessageDialog'
import PosterMessageDialog from './PosterMessageDialog'
import PitbitMessageDialog from './PitbitMessageDialog'
import ImageCode from './ImageCode'
export default {
  components: {
    ImageMessage,
    VideoMessage,
    LinkMessageDialog,
    MiniProgramMessageDialog,
    PosterMessageDialog,
    PitbitMessageDialog,
    ImageCode
  },
  props: {
    pitBit: {
      type: Boolean,
      default () {
        return false
      }
    },
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
      visiblePitbitMessageDialog: false,
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
    handleImageCode () {
    },
    showImageCode (val) {
      this.$refs.imagecode.showImageCode()
      // this.visibleImageCodeDialog = val
    },
    uploadImageProgress (message) {
      let msg = {}
      if (this.imageMsg) msg = this.imageMsg
      this.$emit('uploadImageProgress', { type: 1, ...msg, content: message.content })
    },
    uploadVideoProgress (message) {
      let msg = {}
      let type
      if (this.videoMsg) msg = this.videoMsg
      if (this.pitBit) {
        type = 2
      } else {
        type = 5
      }
      this.$emit('uploadVideoProgress', { type, ...msg, content: message.content })
    },
    messageLimit () {
      this.$message.error('最多添加10条消息')
    },
    addVideoMessage (message) {
      let msg = {}
      if (this.videoMsg) msg = this.videoMsg
      let type
      if (this.pitBit) {
        type = 2
      } else {
        type = 5
      }
      this.$emit('addMessage', { ...msg, type, content: message.content })
      if (this.videoMsg) this.videoMsg = null
    },
    addMessage (message) {
      let msg = {}
      if (this.imageMsg) msg = this.imageMsg
      // if (this.videoMsg) msg = this.videoMsg
      if (this.linkMsg) msg = this.linkMsg
      if (this.miniProgramMsg) msg = this.miniProgramMsg
      if (this.posterMsg) msg = this.posterMsg
      if (this.pitbitMsg) msg = this.pitbitMsg
      if (this.imageCodeMsg) msg = this.imageCodeMsg
      // 新增时，添加sop活动类型
      let type
      if (msg.type === undefined && !this.pitBit) {
        type = this.getWelcomeMessageType(message.type)
      }
      if (this.pitBit) {
        if (message.type === 'pitbit') {
          type = 0
        } else if (message.type === 'image') {
          type = 1
        } else if (message.type === 'video') {
          type = 2
        } else if (message.type === 'link') {
          type = 3
        } else if (message.type === 'miniprogram') {
          type = 4
        } else if (message.type === 'imagecode') {
          type = 5
        }
      }
      this.$emit('addMessage', { ...msg, type, content: message.content })

      if (this.imageMsg) this.imageMsg = null
      // if (this.videoMsg) this.videoMsg = null
    },
    addCustomImg () {
      this.visiblePitbitMessageDialog = true
    },
    /**
     * 通过编辑消息打开素材消息的dialog
     */
    openMessageDialogByEdit (context, booleans = false) {
      const { type, index, content } = context
      let tType = booleans ? ScWelcomeMessageType : WelcomeMessageType
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
        case tType.Pitbit:
          this.pitbitMsg = context
          this.visiblePitbitMessageDialog = true
          break
        case tType.ImageCode:
          this.imageCodeMsg = context
          this.$refs.imagecode.showImageCode(context)
          break
        default:
          break
      }
    },

    // 替代写入数据的方法 已不用了
    setMessageByEdit (context, booleans = false) {
      const { type, index, content } = context
      let tType = booleans ? ScWelcomeMessageType : WelcomeMessageType
      switch (type) {
        case tType.Image:
          this.imageMsg = context
          break
        case tType.Video:
          this.videoMsg = context
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
        case 'pitbit':
          return WelcomeMessageType.Pitbit
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
<template>
  <div class="add-material-bar">
    <div v-if="pitBit" class="add-material-item" @click="addCustomImg">
      <!-- <Icon type="poster-1" class="icon" /> -->
      <img class="bitpit" src="@/assets/kwBig.png" alt="">
      <span class="item-tip">自建坑位</span>
    </div>
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
    <div v-if="pitBit" class="add-material-item" @click="showImageCode">
      <i class="iconfont icon-fumatupian-copy icon" style="font-size:40px;"></i>
      <span class="item-tip">附码图片</span>
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
    <div v-if="!pitBit" class="add-material-item" @click="visiblePosterMessageDialog = true">
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
    <!-- 自建坑位消息 -->
    <PitbitMessageDialog
      ref='pitbit'
      @confirm="addMessage"
      :content="pitbitMsg ? pitbitMsg.content : null"
      :visible.sync="visiblePitbitMessageDialog"
      @update:visible="pitbitMsg = null"
    />
    <ImageCode
      :visible.sync="visibleImageCodeDialog"
      @handleImageCode="handleImageCode"
      @confirm="addMessage"
      ref='imagecode'
    />
  </div>
</template>

<script>
import { ScWelcomeMessageType } from '../../typecs'
import { WelcomeMessageType } from '../../types'
import ImageMessage from './ImageMessage'
import VideoMessage from './VideoMessage'
import LinkMessageDialog from './LinkMessageDialog'
import MiniProgramMessageDialog from './MiniProgramMessageDialog'
import PosterMessageDialog from './PosterMessageDialog'
import PitbitMessageDialog from './PitbitMessageDialog'
import ImageCode from './ImageCode'
export default {
  components: {
    ImageMessage,
    VideoMessage,
    LinkMessageDialog,
    MiniProgramMessageDialog,
    PosterMessageDialog,
    PitbitMessageDialog,
    ImageCode
  },
  props: {
    pitBit: {
      type: Boolean,
      default () {
        return false
      }
    },
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
      visiblePitbitMessageDialog: false,
      textMsg: null, // { index, content }
      imageMsg: null,
      videoMsg: null,
      linkMsg: null,
      miniProgramMsg: null,
      posterMsg: null,
      pitbitMsg: null,
      visibleImageCodeDialog: false
    }
  },
  methods: {
    handleImageCode () {
    },
    showImageCode (val) {
      this.$refs.imagecode.showImageCode()
      // this.visibleImageCodeDialog = val
    },
    uploadImageProgress (message) {
      let msg = {}
      if (this.imageMsg) msg = this.imageMsg
      this.$emit('uploadImageProgress', { type: 1, ...msg, content: message.content })
    },
    uploadVideoProgress (message) {
      let msg = {}
      let type
      if (this.videoMsg) msg = this.videoMsg
      if (this.pitBit) {
        type = 2
      } else {
        type = 5
      }
      this.$emit('uploadVideoProgress', { type, ...msg, content: message.content })
    },
    messageLimit () {
      this.$message.error('最多添加10条消息')
    },
    addVideoMessage (message) {
      let msg = {}
      if (this.videoMsg) msg = this.videoMsg
      let type
      if (this.pitBit) {
        type = 2
      } else {
        type = 5
      }
      this.$emit('addMessage', { ...msg, type, content: message.content })
      if (this.videoMsg) this.videoMsg = null
    },
    addMessage (message) {
      let msg = {}
      if (this.imageMsg) msg = this.imageMsg
      // if (this.videoMsg) msg = this.videoMsg
      if (this.linkMsg) msg = this.linkMsg
      if (this.miniProgramMsg) msg = this.miniProgramMsg
      if (this.posterMsg) msg = this.posterMsg
      if (this.pitbitMsg) msg = this.pitbitMsg
      // 新增时，添加sop活动类型
      let type
      if (msg.type === undefined && !this.pitBit) {
        type = this.getWelcomeMessageType(message.type)
      }
      if (this.pitBit) {
        if (message.type === 'pitbit') {
          type = 0
        } else if (message.type === 'image') {
          type = 1
        } else if (message.type === 'video') {
          type = 2
        } else if (message.type === 'link') {
          type = 3
        } else if (message.type === 'miniprogram') {
          type = 4
        } else if (message.type === 'imagecode') {
          type = 5
        }
      }
      this.$emit('addMessage', { ...msg, type, content: message.content })

      if (this.imageMsg) this.imageMsg = null
      // if (this.videoMsg) this.videoMsg = null
    },
    addCustomImg () {
      this.visiblePitbitMessageDialog = true
    },
    /**
     * 通过编辑消息打开素材消息的dialog
     */
    openMessageDialogByEdit (context, booleans = false) {
      const { type, index, content } = context
      let tType = booleans ? ScWelcomeMessageType : WelcomeMessageType
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
        case tType.Pitbit:
          this.pitbitMsg = context
          this.visiblePitbitMessageDialog = true
          break
        case tType.ImageCode:
          this.$refs.imagecode.showImageCode(context)
          break
        default:
          break
      }
    },

    // 替代写入数据的方法 已不用了
    setMessageByEdit (context, booleans = false) {
      const { type, index, content } = context
      let tType = booleans ? ScWelcomeMessageType : WelcomeMessageType
      switch (type) {
        case tType.Image:
          this.imageMsg = context
          break
        case tType.Video:
          this.videoMsg = context
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
        case 'pitbit':
          return WelcomeMessageType.Pitbit
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
