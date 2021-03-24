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
      <div class='img-content' v-if='type === "img"' arrow='never'>
        <el-carousel indicator-position="outside" :autoplay='false' class='img-carousel'>
          <el-carousel-item v-for="item in list" :key="item">
            <el-image :src='item' fit='cover' class='img'/>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class='video-content' v-else>
        <video :src="list[0]" class='video'>您的浏览器暂不支持播放该视频，请升级至最新版浏览器。</video>
      </div>
      <div class='text-content'>
        <EmojiText :text='text' />
      </div>
      <Hot :hotNum='hotNum' />
    </div>
  </div>
</template>
<script>
import Hot from './Hot'
import ElCarousel from '@nascent/nui/lib/carousel'
import ElImage from '@nascent/nui/lib/image'
import ElCarouselItem from '@nascent/nui/lib/carousel-item'
import EmojiText from '@/components/NewUi/EmojiText'
export default {
  components: { Hot, ElCarousel, ElCarouselItem, ElImage, EmojiText },
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
    margin: 0 -32px 12px -32px;
    .img {
      width:100%;
      height: 100%;
    }

  }
  .video-content {
    height: 760px;
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
<style scoped>
.img-content >>> .el-carousel__container {
  height: 760px;
}
.img-content >>> .el-carousel__indicator--horizontal {
  &.is-active .el-carousel__button{
    border-radius: 4px;
    background: #0D5DFF;
    height: 8px;
    width: 24px;
  }
   .el-carousel__button {
    opacity: 1;
    height: 8px;
    width: 8px;
    border-radius: 50%;
    background: #D8D8D8;
  }
}
</style>
