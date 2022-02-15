<template>
  <div class="message-panel">
    <template v-for="(item, index) in list">
      <MessageItem :key="index"
                   v-if="item.type || item.type == 0"
                   :avatar="avatar">
        <TextMessage v-if="item.type === SOPActivityMessageType.Text"
                     class="text-message"
                     :content="item.content" />
        <ImageMessage v-else-if="item.type === SOPActivityMessageType.Image"
                      class="image-message"
                      :content="item.content"
                      :preview="true"
                      :imageLabel="imageLabel"
                      :previewList="[item.content.image.mediaid]" />
        <CodePosterImage v-else-if="item.type === SOPActivityMessageType.Poster"
                         class="image-message"
                         :content="item.content"
                         :preview="true"
                         :imageLabel="imageLabel"
                         :previewList="[item.content.image.mediaid]" />
        <VideoMessage v-else-if="item.type === SOPActivityMessageType.Video"
                      class="video-message"
                      :content="item.content"
                      :videoLabel="videoLabel"
                      :preview="true" />
        <NewsMessage v-else-if="item.type === SOPActivityMessageType.Link"
                     class="news-message"
                     :imageLabel="miniAndLinkImageLabel"
                     :content="item.content" />
        <MiniProgramMessage v-else-if="item.type === SOPActivityMessageType.MiniProgram"
                            class="mini-message"
                            :imageLabel="miniAndLinkImageLabel"
                            :content="item.content" />
      </MessageItem>
    </template>
  </div>
</template>

<script>
import MessageItem from './MessageItem.vue'
import { TextMessage, ImageMessage, VideoMessage, NewsMessage, MiniProgramMessage, CodePosterImage } from '../ActivityMessage/index.vue'
import { SOPActivityMessageType } from '../../types'

export default {
  components: {
    MessageItem,
    TextMessage,
    ImageMessage,
    VideoMessage,
    NewsMessage,
    MiniProgramMessage,
    CodePosterImage
  },
  props: {
    list: {
      type: Array
    },
    avatar: {
      type: Boolean,
      default: true
    },
    // 图片对象字段自定义
    imageLabel: {
      type: String,
      default: 'mediaid'
    },
    // 视频对象字段自定义
    videoLabel: {
      type: String,
      default: 'mediaid'
    },
    // 图片对象字段自定义
    miniAndLinkImageLabel: {
      type: String,
      default: 'imgUrl'
    }
  },
  data () {
    return {
      SOPActivityMessageType: SOPActivityMessageType
    }
  },
  mounted () { },
  methods: {}
}
</script>

<style lang="scss" scoped>
.message-panel {
  overflow: auto;
  width: 320px;
  padding-top: 26px;
  background: #f2f2f2;
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;

  &::-webkit-scrollbar {
    display: none;
    width: 6px;
    height: 6px;
  }

  .text-message {
    max-width: 175px;
    padding: 8px;
    line-height: 20px;
    background: #fff;
    border-radius: 2px;
  }

  .image-message {
    max-width: 180px;
    max-height: 140px;
  }

  .video-message {
    max-width: 180px;
    max-height: 140px;
  }

  .news-message {
    width: 175px;
    border: 1px solid #eeeeee;
  }

  .mini-message {
    width: 140px;
    border: 1px solid #eeeeee;
  }
}
</style>
