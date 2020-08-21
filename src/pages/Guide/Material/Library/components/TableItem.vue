<template>
  <div class="tableItem">
    <div class="tableItem-content">
      <div class="tableItem-content__text">
        <el-tooltip placement="top-start" :enterable="true" popper-class="table-body__tooltip">
          <div slot="content">{{data.content}}</div>
          <div class="tableItem-content__ellipsis">{{data.content}}</div>
        </el-tooltip>
      </div>
      <!-- 图文素材 -->
      <div v-if="data.mType === 1" class="tableItem-content__imageBox">
        <ul>
          <li v-for="(item, index) in imageList.slice(0, 3)" :key="index" @click="showPreview(index)">
            <img :src="item" alt="">
          </li>
          <li v-if="imageList.length > 3">
            <div>…</div>
          </li>
          <li v-if="data.codeType">
            <Icon type="erweima"/>
          </li>
        </ul>
      </div>
      <!-- 视频素材 -->
      <div v-if="data.mType === 2" class="tableItem-content__vedioBox">
        <video :src="imageList[0]">
          您的浏览器暂不支持播放该视频，请升级至最新版浏览器。
        </video>
        <div class="tableItem-video__mask" @click="showPreview(0, 'video')">
          <div class="tableItem-video__wrapper">
            <Icon type="begin" />
          </div>
        </div>
      </div>
      <!-- 文章素材 -->
      <div v-if="data.mType === 0" class="tableItem-content__articleBox">
        <img alt="" :src="imageList[0]" @click="showPreview(0)"/>
        <el-tooltip placement="top-start" :enterable="true" popper-class="table-body__tooltip">
          <div slot="content">{{data.title}}</div>
          <div class="tableItem-content__ellipsis">{{data.title}}</div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: Object
  },
  data () {
    return {}
  },
  computed: {
    imageList () {
      return this.data.imageList || []
    }
  },
  methods: {
    showPreview (current, type) {
      this.$emit('preview', current, this.imageList, type)
    }
  }
}
</script>
<style scoped>
  @component-namespace tableItem {
    @b content {
      @e tooltip {
        max-width: 400px;
      }
      @e text {
        margin-bottom: 5px;
      }
      @e ellipsis {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        visibility: visible;
      }
      @e imageBox {
        overflow: hidden;
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
              object-fit: cover;
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
          object-fit: cover;
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
        background-color: rgba(0, 0, 0, .25);
        cursor: pointer;
        border-radius: 3px;
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
        background-color: rgba(255, 255, 255, .4);
        > svg {
          margin: 5px 0 0 6px;
          font-size: 12px;
          color: #fff;
        }
      }
    }
  }
</style>
