<template>
  <div class='media-content'>
    <div class='header'>
       <div class='cover-content'>
         <el-image :src='data.topImgUrl' fit='none' class='cover-img' style='height:464px' />
          <img class='user-icon'/>
       </div>
       <div class='signature'>{{data.signature}}</div>
    </div>
    <div class='content' v-if='list && list.length'>
      <div class='text-content'>
        <EmojiText :text='text' />
      </div>
      <div class='img-content' v-if='type === "img"'>
        <div v-for='(item,index) in imgData' class='img-row' :key='index'>
          <div v-for='(items,indexs) in item' class='img-src' :key='indexs'>
            <el-image :src='items' fit='cover' class='img'/>
          </div>
        </div>
      </div>
      <div class='video-content' v-else-if='type === "video"'>
        <video :src="list[0]" class='video'>您的浏览器暂不支持播放该视频，请升级至最新版浏览器。</video>
      </div>
      <div class='hot-content'>
        <Hot :hotNum='hotNum' />
        <div class='date'>2021/01/12 12:00:00</div>
      </div>
    </div>
  </div>
</template>
<script>
import Hot from './Hot'
import ElImage from '@nascent/nui/lib/image'
import EmojiText from '@/components/NewUi/EmojiText'
export default {
  components: { Hot, ElImage, EmojiText },
  computed: {
    imgData () {
      if (this.type === 'img') {
        const list = this.list
        const num = list.length === 4 ? 2 : 3
        let arr = []
        for (let i = 0; i < list.length; i++) {
          const merchant = Math.floor(i / num)
          const remainder = i % num
          if (!Array.isArray(arr[merchant])) {
            arr[merchant] = []
          }
          arr[merchant][remainder] = list[i]
        }
        return arr
      }
      return []
    }
  },
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
    },
    // 朋友圈其他信息
    data: {
      default () {
        return {}
      }
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
    .cover-content {
      position: relative;
      height: 464px;
      width: 100%;
      margin-bottom: 46px;
      .cover-img {
        height: 464px;
        height: 100%;
        width: 100%;
      }
      .user-icon {
        position: absolute;
        right: 34px;
        height: 120px;
        width: 120px;
        bottom: -30px;
        background: #D8D8D8;
        border-radius: 8px;
      }
    }
    .signature {
      font-size: 24px;
      color: #8C8C8C;
      line-height: 40px;
      margin-bottom: 80px;
      text-align: right;
      padding: 0 34px;
    }
  }
  .content {
    padding:0 64px;
    padding-bottom: 32px;
    position: relative;
    &:after {
      position: absolute;
      content: ' ';
      border-bottom: 1px solid #E8E8E8;
      bottom: 0;
      left:64px;
      right:64px;
    }
  }
  .img-content {
    margin-bottom: 12px;
    .img-row {
      display: flex;
      justify-content:flex-start;
      flex-wrap: wrap;
      .img-src {
        margin-right: 12px;
        .img {
          height: 100%;
          width: 100%;
        }
      }
    }
    .img-src {
      width: 160px;
      height: 160px;
      background-color: #d8d8d8;
      margin-bottom: 12px;
    }
  }
  .video-content {
    height: 280px;
    width: 342px;
    background-color: #d8d8d8;
    margin-bottom: 16px;
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
    // overflow: hidden;
    // text-overflow: ellipsis;
    // word-break: break-all;
    // display: -webkit-box;
    // -webkit-line-clamp: 2;
    // -webkit-box-orient: vertical;
    position: relative;
    .open-btn {
      position: absolute;
      right: 0;
      bottom: 0;
      cursor: pointer;
      color: #175199;
      width: 200px;
      background-color: #Fff;
      height: 20px;
      line-height: 20px;
    }
  }
  .hot-content {
    display: flex;
    justify-content: space-between;
    .date {
      font-size: 24px;
      color: #8C8C8C;
      line-height: 40px;
    }
  }
}
</style>
``
