<template>
  <div class='media-content'>
    <div class='header'>
      <div class='user'>
        <img class='user-icon' />
        <div class='user-name'>我是一个昵称</div>
      </div>
      <div class='createtime'>2021/01/12 12:00:00</div>
    </div>
    <div class='content'>
      <div class='img-content' v-if='type === "img"'>
        <div v-for='item in list' class='img-src' :key='item'>
          <el-image :src='item' fit='cover' class='img'/>
        </div>
      </div>
      <div class='video-content' v-else>
        <video :src="list[0]" class='video'>您的浏览器暂不支持播放该视频，请升级至最新版浏览器。</video>
      </div>
      <div class='text-content'>
        <EmojiText :text='text' />
        <!-- {{text}} -->
      </div>
      <Hot :hotNum='hotNum' />
    </div>
  </div>
</template>
<script>
import Hot from './Hot'
import ElImage from '@nascent/nui/lib/image'
import EmojiText from '@/components/NewUi/EmojiText'
export default {
  components: { Hot, ElImage, EmojiText },
  props: {
    // 展示类型 img 图片 video 视频
    type: {
      default: 'img'
    },
    // 数据
    list: {
      default () {
        return []
      }
    },
    // 热度
    hotNum: {
      default: 5
    },
    // 文章
    text: {
      default: ''
    }
  }
}
</script>
<style lang="scss" scoped>
.media-content {
  width: 234.375%;
  transform: scale(0.426);
  transform-origin: 0 0;
  padding: 20px 32px;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    .user {
      display: flex;
      align-items: center;
      .user-icon {
        height: 64px;
        width: 64px;
        border-radius: 50%;
        background-color: #d8d8d8;
      }
      .user-name {
        font-size: 28px;
        color: #262626;
        margin-left: 16px;
        font-weight: bold;
      }
    }
    .createtime {
      font-size: 24px;
      color: #8C8C8C;
      text-align: center;
    }
  }
  .img-content {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .img-src {
      &:nth-child(3n) {
        margin-right: 0
      }
      width: 220px;
      height: 220px;
      background-color: #d8d8d8;
      margin-bottom: 12px;
      margin-right: 12px;
      .img {
        height: 100%;
        width: 100%;
      }
    }
  }
  .video-content {
    height: 520px;
    background-color: #d8d8d8;
    margin: 0 -32px 12px -32px;
    .video{
      width: 100%;
      height: 100%;
    }
  }
  .text-content {
    font-size: 30px;
    color: #262626;
    line-height: 46px;
    margin-bottom: 16px;
  }
}
</style>
