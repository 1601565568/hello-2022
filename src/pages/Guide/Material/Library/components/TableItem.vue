<template>
  <div class="tableItem">
    <div class="tableItem-content">
      <div class="tableItem-content__text">
        <el-tooltip
          placement="top-start"
          :enterable="true"
          popper-class="table-body__tooltip"
        >
          <div slot="content" v-html="strToRichText(data.content)"></div>
          <div v-html="strToRichText(data.content)" class="tableItem-content__ellipsis"></div>
          <!-- <div class="tableItem-content__ellipsis">{{ data.content }}</div> -->
        </el-tooltip>
      </div>
      <!-- 图文素材 -->
      <div v-if="data.mType === 1" class="tableItem-content__imageBox">
        <ul>
          <li v-for="(item, index) in imageList" :key="index">
            <img
              :src="defaultImgUrl"
              alt=""
              v-if="item.pitType == 2"
              @click="showGuideInfo(index, item)"
              class="pit-img-view"
            />
            <img
              :src="item.url + '?x-oss-process=image/resize,m_mfit,h_200,w_200'"
              alt=""
              @click="showPreview(index)"
              v-else
            />
          </li>
          <!-- <li v-if="imageList.length > 3">
            <div>…</div>
          </li> -->
          <li v-if="data.codeType">
            <Icon type="erweima" />
          </li>
        </ul>
      </div>
      <!-- 视频素材 -->
      <div v-if="data.mType === 2" class="tableItem-content__vedioBox">
        <video :src="imageList[0].url">
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
        <img
          alt=""
          :src="
            imageList[0].url + '?x-oss-process=image/resize,m_mfit,h_200,w_200'
          "
          @click="showPreview(0)"
        />
        <el-tooltip
          placement="top-start"
          :enterable="true"
          popper-class="table-body__tooltip"
        >
          <div slot="content">{{ data.title }}</div>
          <div class="tableItem-content__ellipsis">{{ data.title }}</div>
        </el-tooltip>
      </div>
    </div>
    <GuideInfo ref="guideInfo" :info="guideInfo" />
  </div>
</template>
<script>
import GuideInfo from './GuideInfo'
export default {
  components: { GuideInfo },
  props: {
    data: Object
  },
  data () {
    return {
      defaultImgUrl:
        'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/image/material/custom-edit.png',
      // 拍摄指南
      guideInfo: {}
    }
  },
  computed: {
    imageList () {
      return this.data.mediaList || []
    }
  },
  methods: {
    strToRichText (text) {
      const preRegexp = new RegExp('\\{' + 'EMOJI_' + '\\[', 'g')
      const afterRegexp = new RegExp(']}', 'g')
      const str = text
        .replace(
          preRegexp,
          '<img src="https://kedaocdn.oss-cn-zhangjiakou.aliyuncs.com/ecrm/wxemoji/v1/'
        )
        .replace(afterRegexp, '.png"/>')
        .replace(/\n/g, '<br/>')
      return str
    },
    showGuideInfo (index, item) {
      this.guideInfo = item
      this.$refs.guideInfo.closeDeawer()
    },
    showPreview (current, type) {
      let imgs = []
      this.imageList.forEach(item => {
        if (item.pitType === 1) {
          imgs.push(item.url)
        }
      })
      this.$emit('preview', 0, imgs, type)
    }
  }
}
</script>
<style scoped>
.pit-img-view {
  border: 1px dashed #D9D9D9;
  background-color: white;
}
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
      width: 200px;
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
            font-size: 12px;
          }
        }
        li {
          margin-right: 5px;
          margin-bottom: 5px;
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
      background-color: rgba(0, 0, 0, 0.25);
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
      background-color: rgba(255, 255, 255, 0.4);
      > svg {
        margin: 5px 0 0 6px;
        font-size: 12px;
        color: #fff;
      }
    }
  }
}
</style>
