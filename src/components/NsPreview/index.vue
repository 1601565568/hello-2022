<template>
  <div class="preview">
    <el-dialog
      :visible.sync="visible"
      :before-close="hide"
      :close-on-click-modal="false"
      customClass="preview-dialog"
      :append-to-body="appendToBody"
    >
      <div class="preview-dialog__wrapper">
        <div class="preview-dialog__content">
          <img v-if="type === 'img'" :src="list.length ? list[current] : ''" alt="">
          <video v-else ref="videoPlayer" :src="list[current]" controls>
            您的浏览器暂不支持播放该视频，请升级至最新版浏览器。
          </video>
        </div>
        <ul v-if="type === 'img' && !material" class="preview-dialog__list">
          <li v-for="(item, index) in list" :key="index" @click="goto(index)">
<!--            <img :class="{'active': index === current}" :src="item + '?x-oss-process=image/resize,m_mfit,h_200,w_200'">-->
            <img :class="{'active': index === current}" :src="item">
          </li>
        </ul>
        <div v-if="type === 'img' && !material" class="preview-dialog__left" @click="prevTo()"></div>
        <div v-if="type === 'img' && !material" class="preview-dialog__right" @click="nextTo()"></div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    appendToBody: {
      type: Boolean,
      default: function () {
        return false
      }
    }
  },
  data () {
    return {
      material: false,
      visible: false,
      type: 'img',
      current: 0,
      list: []
    }
  },
  methods: {
    toggleShow (current, list, type, material = false) {
      this.type = type || 'img'
      this.current = current || 0
      this.list = list || []
      this.visible = true
      if (material) {
        this.material = true
      }
    },
    hide () {
      this.material = false
      this.visible = false
    },
    goto (index) {
      this.current = index
    },
    prevTo () {
      let current = this.current - 1
      this.current = current < 0 ? this.list.length - 1 : current
    },
    nextTo () {
      let current = this.current + 1
      this.current = current >= this.list.length ? 0 : current
    }
  }
}
</script>
<style scoped>
@component-namespace preview {
  /*>>> .v-modal {*/
  /*  opacity: 0.96;*/
  /*}*/
  >>> .el-dialog__wrapper {
    background-color: rgba(0, 0, 0, .86);
  }
  >>> .preview-dialog {
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
      z-index: 10000;
    }
    .el-dialog__headerbtn {
      font-size: 26px !important;
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
        max-height: 500px;
        max-width: 100%;
        margin: 0 auto;
        vertical-align: middle;
      }
      video {
        max-height: 667px;
        max-width: 100%;
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
          object-fit: cover;
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
}
</style>
