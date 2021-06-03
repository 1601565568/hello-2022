<template>
  <div class="message-panel">
    <MessageItem
      v-for="(item, index) in list"
      :key="index"
      :avatar="avatar"
    >
      <TextMessage
        v-if="item.type === messageType.Text"
        class="text-message"
        :content="item.content"
      />
      <ImageMessage
        v-else-if="item.type === messageType.Image || item.type === messageType.Poster"
        class="image-message"
        :content="{ image: item.content.image || item.content.placard }"
        :preview="true"
        :previewList="[item.content.image || item.content.placard]"
      />
      <VideoMessage
        v-else-if="item.type === messageType.Video"
        class="video-message"
        :content="item.content"
        :preview="true"
      />
      <LinkMessage
        v-else-if="item.type === messageType.Link"
        class="news-message"
        :content="item.content"
      />
      <MiniProgramMessage
        v-else-if="item.type === messageType.MiniProgram"
        class="mini-message"
        :content="item.content"
      />
    </MessageItem>
  </div>
</template>

<script>
import MessageItem from './MessageItem.vue'
import { TextMessage, ImageMessage, VideoMessage, LinkMessage, MiniProgramMessage } from '../ActivityMessage/index.vue'

export default {
  components: {
    MessageItem,
    TextMessage,
    ImageMessage,
    VideoMessage,
    LinkMessage,
    MiniProgramMessage
  },
  props: {
    list: {
      type: Array
    },
    avatar: {
      type: Boolean,
      default: true
    },
    messageType: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {}
  },
  mounted () {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.message-panel {
  overflow: auto;
  width: 320px;
  padding-top: 26px;
  background: #F2F2F2;
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
    border: 1px solid #EEEEEE;
  }

  .mini-message {
    width: 140px;
    border: 1px solid #EEEEEE;
  }

}
</style>
