<template>
  <div class="tableItem">
    <div class="tableItem-content">
      <div class="tableItem-content__text">
        <el-tooltip placement="top-start">
          <div slot="content">{{ data.content }}</div>
          <div class="tableItem-content__ellipsis">{{data.content}}</div>
        </el-tooltip>
      </div>
      <!-- 图文素材 -->
      <div v-if="data.m_type === 1" class="tableItem-content__imageBox">
        <ul>
          <li v-for="(item, index) in imageList.slice(0, 3)" :key="index" @click="previewImg(index)">
            <img :src="item" alt="">
          </li>
          <li v-if="imageList.length > 3">
            <div>…</div>
          </li>
          <li v-if="data.hasqrcode">
            <Icon type="erweima"/>
          </li>
        </ul>
      </div>
      <!-- 视频素材 -->
      <div v-if="data.m_type === 2 && data.videoUrl" class="tableItem-content__vedioBox" @click="toPlay">
        <video ref="videoPlayer" :src="data.videoUrl">
          您的浏览器暂不支持播放该视频，请升级至最新版浏览器。
        </video>
        <div v-if="!display" class="tableItem-video__mask">
          <div class="tableItem-video__wrapper">
            <Icon type="begin" />
          </div>
        </div>
      </div>
      <!-- 文章素材 -->
      <div v-if="data.m_type === 0" class="tableItem-content__articleBox">
        <img alt="" :src="imageList[0]" @click="previewImg(0)"/>
        <el-tooltip placement="top-start">
          <div slot="content">{{ data.cardTitle }}</div>
          <div class="tableItem-content__ellipsis">{{data.cardTitle}}</div>
        </el-tooltip>
      </div>
    </div>

    <!-- 查看大图 -->
    <el-dialog
      :visible.sync="visible"
      :before-close="hidePreview"
      :close-on-click-modal=false
      customClass="custom-dialog"
      :append-to-body="appendToBody"
    >
      <div class="tableItem-dialog__wrapper">
        <div class="tableItem-dialog__content">
          <img :src="imageList ? imageList[currentIndex] : null" alt="">
        </div>
        <ul class="tableItem-dialog__list">
          <li v-for="(item, index) in imageList" :key="index" @click="goto(index)">
            <img :class="{'active': index === currentIndex }" :src="item">
          </li>
        </ul>
        <div class="tableItem-dialog__left" @click="prevTo()"></div>
        <div class="tableItem-dialog__right" @click="nextTo()"></div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    data: Object,
    appendToBody: {
      type: Boolean,
      default: function () {
        return false
      }
    }
  },
  data () {
    return {
      visible: false,
      currentIndex: 0,
      display: false
    }
  },
  computed: {
    imageList () {
      return this.data.imageList || []
    }
  },
  mounted () {
    this.bindEvent()
  },
  beforeDestroy () {
    this.removeEvent()
  },
  methods: {
    bindEvent () {
      if (this.data.m_type === 2 && this.data.videoUrl) {
        this.$refs.videoPlayer.addEventListener('ended', this.setDisplay)
      }
    },
    removeEvent () {
      if (this.data.m_type === 2 && this.data.videoUrl) {
        this.$refs.videoPlayer.removeEventListener('ended', this.setDisplay)
      }
    },
    setDisplay () {
      this.display = false
    },
    toPlay () {
      this.display ? this.$refs.videoPlayer.pause() : this.$refs.videoPlayer.play()
      this.display = !this.display
    },
    hidePreview () {
      this.visible = false
    },
    previewImg (index) {
      this.visible = true
      this.currentIndex = index
    },
    goto (index) {
      this.currentIndex = index
    },
    prevTo () {
      let current = this.currentIndex - 1
      this.currentIndex = current < 0 ? this.imageList.length - 1 : current
    },
    nextTo () {
      let current = this.currentIndex + 1
      this.currentIndex = current >= this.imageList.length ? 0 : current
    }
  }
}
</script>
<style scoped>
  @component-namespace tableItem {
    @b content {
      @e text {
        margin-bottom: 5px;
      }
      @e ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
      @e imageBox {
        > ul {
          list-style: none;
          padding: 0;
          li {
            float: left;
            font-size: 0;
            height: 60px;
            img {
              width: 60px;
              height: 60px;
              border-radius: 3px;
              cursor: pointer;
            }
            >>> .svg-icon {
              margin-top: 18px;
              margin-left: 7px;
              font-size: 24px;
            }
            > div {
              margin-top: 18px;
              margin-left: 7px;
              font-size: 12px
            }
          }
          li + li {
            margin-left: 5px;
          }
        }
      }
      @e vedioBox {
        position: relative;
        width: 107px;
        height: 60px;
        font-size: 0;
        line-height: 1;
        video {
          width: 100%;
          height: 100%;
          border-radius: 3px;
          object-fit: cover;
        }
      }
      @e articleBox {
        position: relative;
        padding: 5px;
        background: #ebeef5;
        img {
          width: 50px;
          height: 50px;
          border-radius: 3px;
          cursor: pointer;
        }
        > div {
          position: absolute;
          top: 50%;
          right: 7px;
          left: 60px;
          transform: translate(0, -50%);
        }
      }
    }
    @b video {
      @e mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, .2);
      }
      @e wrapper {
        position: relative;
        top: 50%;
        left: 50%;
        margin-left: -11px;
        margin-top: -11px;
        width: 22px;
        height: 22px;
        border-radius: 22px;
        background-color: rgba(255, 255, 255, .5);
        > svg {
          margin-top: 5px;
          font-size: 12px;
          color: #fff;
          margin-left: 6px;
        }
      }
    }
    @b dialog {
      @e wrapper {
        width: 100%;
        overflow: hidden;
        margin: 50px 0 40px;
        position: relative;
      }
      @e content {
        width: 100%;
        overflow: hidden;
        text-align: center;
        vertical-align: middle;
        img {
          display: inline-block;
          max-height: 350px;
          max-width: 100%;
          margin: 0 auto;
          vertical-align: middle;
        }
      }
      @e list {
        width: 80%;
        height: 50px;
        margin-top: 10px;
        padding: 0 0 0 10%;
        position: fixed;
        bottom: 28px;
        li {
          padding: 0;
          margin: 0 4px;
          float: left;
          border-radius: 2px;
          overflow: hidden;
          cursor: pointer;
          font-size: 0;
          img {
            width: 50px;
            height: 50px;
            opacity: 0.3;
            &:hover {
              opacity: 1;
            }
            &.active {
              opacity: 1;
              border: 1px solid #ccc;
            }
          }
        }
      }
      @e left {
        cursor: pointer;
        width: 60px;
        height: 60px;
        position: absolute;
        left: 0px;
        top: 50%;
        transform: translateY(-50%);
        background:url('./images/lefticon.png') left center;
      }
      @e right {
        cursor: pointer;
        width: 60px;
        height: 60px;
        position: absolute;
        right: 0px;
        top: 50%;
        transform: translateY(-50%);
        background:url('./images/righticon.png') right center;
      }
    }
    >>> .v-modal {
      opacity: 0.96;
    }

    >>> .custom-dialog {
      width: 100% !important;
      background: none !important;
      -webkit-box-shadow: none !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      .el-dialog__header {
        height: 50px;
        width: 50px;
        position: fixed;
        right: 6px;
        top: 0;
      }
      .el-dialog__headerbtn {
        font-size: 26px !important;
      }
    }
  }
</style>
