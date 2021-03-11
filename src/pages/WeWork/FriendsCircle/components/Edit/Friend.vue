<template>
  <div class='media-content'>
    <div class='header'>
      <div class='user'>
        <img class='user-icon' />
        <div class='user-name'>我是一个昵称</div>
      </div>
    </div>
    <div class='content'>
      <div class='text-content'>
        {{text}}
      </div>
      <div class='img-content' v-if='type === "img"'>
        <div v-for='(item,index) in imgData' class='img-row' :key='index'>
          <div v-for='(items,indexs) in item' class='img-src' :key='indexs'>
            <img src='items'>
          </div>
        </div>
      </div>
      <div class='video-content' v-else>
        <img src=''>
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
export default {
  components: { Hot },
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
          arr[merchant][remainder] = { ...list[i] }
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
        return ['', '', '', '', '', '', '', '', '']
      }
    },
    // 热度
    hotNum: {
      default: 5
    },
    // 文章
    text: {
      default: '我是正文我是正文我是正文，我是正文我是正文，我是正文我是正文我是正文我是正文，我是正文我是正文我是正文我是正文，我是正文我是正文。'
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
        height: 80px;
        width: 80px;
        border-radius: 50%;
        background-color: #d8d8d8;
      }
      .user-name {
        font-size: 32px;
        color: #262626;
        line-height: 48px;
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
  .content {
    padding-left: 96px;;
  }
  .img-content {
    margin-bottom: 12px;
    .img-row {
      display: flex;
      justify-content:flex-start;
      flex-wrap: wrap;
      .img-src {
        margin-right: 12px;
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
  }
  .text-content {
    font-size: 30px;
    color: #262626;
    line-height: 46px;
    margin-bottom: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
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
