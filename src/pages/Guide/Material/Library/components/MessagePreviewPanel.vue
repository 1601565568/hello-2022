<template>
  <div class="preview_body">
    <div class="u_tag u_tag-color" v-if="showSelectShop">湖滨银泰一号门店<Icon class="icon" type="ns-arrow-drowdown" /></div>
    <img :src='defaultIcon' class="scope-title_img">
    <div class="u_tag">所有素材<Icon class="icon" type="ns-arrow-drowdown" /></div>
    <div class="u_container_view">
      <div class="u_top_info">
        <div class="u_title">{{title || '素材标题'}}</div>
        <div class="u_time">2019年10月11日 11:30:51</div>
        <div class="u_left_line"></div>
      </div>
      <div class="u_types_view">
        <div class="types_number_view">
          共{{typesNum}}条消息
          <span class="iconfont icon-wenbenbeifen4" v-if="showTextIcon === 1"></span>
          <span class="iconfont icon-tupianbeifen5" v-if="showImageIcon"></span>
          <span class="iconfont icon-shipinbeifen4" v-if="showVideoIcon"></span>
          <span class="iconfont icon-lianjie" v-if="showLinkIcon"></span>
          <span class="iconfont icon-xiaochengxushezhibeifen4" v-if="showMiniIcon"></span>
          <span class="iconfont icon-zidingyibeifen" v-if="showPitIcon"></span>
          <span class="iconfont icon-fumatupian-copy" v-if="showImageCode"></span>
        </div>
        <div class="send-button">发送至朋友圈</div>
      </div>
      <div class="u_content_view">
        <div v-if="pitContent" class="u_pitContent u_limit_line">
          <EmojiText :text='htmlContent' />
        </div>
        <div v-else class="u_pitContent">
          <EmojiText text='推广文案' />
        </div>
        <img class="u_content-img" src="@/assets/pit-send-img.png"/>
      </div>
      <div class="u_pic_view">
        <div class="u_main">
          <div class="u_box" v-for="(item, index) in list" :key="index">
            <div class="u_imgList" :style="{ border: item.type === 0 ? '1px dashed #e8e8e8' : 'none' }" v-if="item.type === 0 || item.type === 1 || item.type === 5">
              <img :src='item.content.image || defaultImgUrl' alt="">
              <img class="u_main-img" src="@/assets/pit-send-img.png"/>
            </div>
            <div v-if="item.type === 2" class="u_videoList">
              <img class="u_main-img" src="@/assets/pit-send-img.png"/>
              <div>
                <video :src="item.content.video"></video>
              </div>
              <div
                class="video-mask"
              >
                <div class="video-wrapper">
                  <Icon type="begin" />
                </div>
              </div>
            </div>
            <div v-if="item.type === 3" class="u_linkList">
              <div class="u_t">{{item.content.title}}</div>
              <div class="u_desc">{{item.content.desc}}</div>
              <img class="u_link_img" :src='item.content.image || linkImage' alt="">
              <div class="u_line"></div>
              <img class="u_main-img" src="@/assets/pit-send-img.png"/>
            </div>
            <div v-if="item.type === 4" class="u_appList">
              <!-- <div class="u_t">{{item.content.title}}</div>
              <Icon type="xiaochengxushouquan" className="icon"/>
              <div class="u_desc">{{item.content.desc}}</div>
              <img class="u_link_img" :src='item.content.image || defaultImgUrl' alt="">
              <div class="u_line"></div> -->
              <div class="u_app_title">
                <span class="v1"></span>
                <span class="v2">小程序名称</span>
              </div>
              <div class="u_content">{{item.content.title}}</div>
              <img class="u_app_img" :src='item.content.image' alt="">
              <div class="u_line"></div>
              <div class="u_bottom"><span class="iconfont icon-xiaochengxu2" style="color:#7586DB;"></span>小程序</div>
              <img class="u_main-img" src="@/assets/pit-send-img.png"/>
            </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>
<script>
import defaultIcon from '@/assets/titlePreview.jpg'
import EmojiText from '@/components/NewUi/EmojiText'
export default {
  name: 'preview',
  components: { EmojiText },
  props: {
    // 附件数组
    list: {
      type: Array,
      default () {
        return []
      }
    },
    // 素材标题
    title: {
      type: String,
      default () {
        return ''
      }
    },
    // 选择标签
    subdivision: {
      type: Boolean,
      default () {
        return false
      }
    },
    // 推广文案
    pitContent: {
      type: String,
      default () {
        return ''
      }
    },
    // 是否显示选择门店
    showSelectShop: {
      type: Boolean,
      default () {
        return true
      }
    }
  },
  data: function () {
    return {
      htmlContent: '',
      linkImage: 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-APP-WEB/img/mini-icon.jpg',
      defaultIcon: defaultIcon,
      defaultImgUrl: 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/image/material/custom-edit.png'
    }
  },
  mounted () {
    this.text2Emoji()
    this.tag2Html()
    this.n2br()
  },
  watch: {
    pitContent: {
      handler (newVal) {
        this.text2Emoji()
        this.tag2Html()
        this.n2br()
      },
      deep: true
    }
  },
  computed: {
    typesNum () {
      const textNum = this.pitContent ? 1 : 0
      return this.list.length + textNum
    },
    showTextIcon () {
      return this.pitContent ? 1 : 0
    },
    showImageIcon () {
      const isImage = item => item.type === 1
      return this.list.findIndex(isImage) !== -1
    },
    showVideoIcon () {
      const isVideo = item => item.type === 2
      return this.list.findIndex(isVideo) !== -1
    },
    showLinkIcon () {
      const isLink = item => item.type === 3
      return this.list.findIndex(isLink) !== -1
    },
    showMiniIcon () {
      const isMini = item => item.type === 4
      return this.list.findIndex(isMini) !== -1
    },
    showPitIcon () {
      const isPit = item => item.type === 0
      return this.list.findIndex(isPit) !== -1
    },
    showImageCode () {
      const isImageCode = item => item.type === 5
      return this.list.findIndex(isImageCode) !== -1
    }
  },
  methods: {
    text2Emoji () {
      this.htmlContent = this.pitContent
    },
    tag2Html () {
      const strRegex = /{(?!\[)(.+?)(?!\])}/g
      this.htmlContent = this.htmlContent.replace(strRegex, (item, index) => {
        const tagDom = document.createElement('span')
        tagDom.innerText = index
        tagDom.className = 'text-message-tag'
        return tagDom.outerHTML
      })
    },
    n2br () {
      const strRegex = /\n/g
      this.htmlContent = this.htmlContent.replace(strRegex, '<br>')
    }
  }
}
</script>
<style scoped lang='scss'>
.preview_body{
  background: #F5F5F5;
  height: 513px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 0 !important
  }
  .scope-title_img{
    width: 100%;
    height: 58px;
  }
  .u_tag{
    height: 46px;
    background: #F5F5F5;
    font-size: 14px;
    color: #262626;
    line-height: 46px;
    padding-left: 12px;
    // margin-bottom: 16px;
    .icon{
      font-size: 16px;
      margin-left: 4px;
      vertical-align: middle;
    }
  }
  .u_types_view {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 40px;
    align-items: center;
    .send-button {
      width: 98px;
      height: 27px;
      background: #1965FF;
      border-radius: 2px;
      font-size: 12px;
      color: #FFFFFF;
      line-height: 27px;
      text-align: center;
    }
    .types_number_view {
      font-size: 12px;
      color: #383838;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
  .u_container_view{
    background-color: white;
    margin: 0 11px;
    padding: 10px 13px;
  }
  .u_tag-color {
    background-color: white;
  }
  .u_top_info {
    border-bottom: 1px solid #E8E8E8;
    padding-bottom: 8px;
    position: relative;
    .u_title{
      font-size: 14px;
      color: #262626;
      line-height: 22px;
      // margin: 16px;
      margin-bottom: 17px;
      // margin-top: 0;
      font-weight: bold;
      // padding-bottom: 17px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      background-color: white;
    }
    .u_time {
      font-size: 12px;
      color: #595959;
      line-height: 17px;
    }
    .u_left_line {
      position: absolute;
      width: 4px;
      height: 22px;
      left: -13px;
      top: 0;
      background-color: #0D5DFF;
      border-radius: 4px;
    }
  }
  .u_content_view {
    margin-top: 8px;
    background-color: #F5F5F5;
    padding: 7px;
    border-radius: 2px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .u_pitContent{
      // margin: 12px 16px;
      word-break: break-all;
      font-size: 12px;
      margin-top: 0;
      color: #383838;
      line-height: 22px;
      width: 230px;
    }
    .u_content-img {
      width: 22px;
      height: 22px;
    }
    .u_limit_line {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .u_pic_view {
    margin-top: 8px;
  }
  .u_main{
    .u_box{
      display: inline-block;
      vertical-align: top;
    }
    // margin-left: 16px;
    .u_imgList, .u_videoList{
      position: relative;
      display: inline-block;
      border-radius: 4px;
      margin-bottom: 12px;
      width: 84px;
      height: 84px;
      border-radius: 4px;
      margin-right: 6px;
      img{
        width: 100%;
        height: 100%;
        border-radius: 4px;
      }
      video{
        width: 84px;
        height: 84px;
        object-fit: cover;
        border-radius: 4px;
      }
      &:nth-child(3n){
        margin-right: 0;
      }
      .u_main-img {
        width: 23px;
        height: 23px;
        position: absolute;
        right: 3px;
        bottom: 3px;
        z-index: 100;
      }
    }
    .u_videoList{
      width: 84px;
      height: 84px;
      position: relative;
      .u_main-img {
        width: 23px;
        height: 23px;
        position: absolute;
        right: 3px;
        bottom: 3px;
      }
      .video-mask{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.25);
        cursor: pointer;
        border-radius: 3px;
      }
      .video-wrapper{
        position: relative;
        top: 50%;
        left: 50%;
        margin-left: -26px;
        margin-top: -26px;
        width: 52px;
        height: 52px;
        border-radius: 52px;
        background-color: rgba(255, 255, 255, 0.4);
        > svg {
          margin: 11px 0 0 14px;
          font-size: 30px;
          color: #fff;
        }
      }
    }
    .u_linkList{
      width: 242px;
      height: auto;
      margin-bottom: 12px;
      padding: 6px 10px;
      background: #FFFFFF;
      border: 1px solid #EEEEEE;
      overflow: auto;
      border-radius: 4px;
      position: relative;
      .u_t{
        width: 221.26px;
        font-size: 14px;
        color: #262626;
        line-height: 18px;
        font-weight: bold;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        word-break: break-all;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .u_desc{
        width: 165.94px;
        font-size: 12px;
        color: #262626;
        line-height: 17px;
        font-weight: 400;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        float: left;
        word-break: break-all;
        -webkit-box-orient: vertical;
      }
      .u_link_img{
        width: 45px;
        height: 45px;
        margin-left: 7px;
      }
      .u_line{
        width: 221.26px;
        height: 1px;
        margin-top: 5px;
        margin-bottom: 18px;
        background: #EEEEEE;
      }
      .u_main-img {
        width: 23px;
        height: 23px;
        position: absolute;
        right: 3px;
        bottom: 3px;
        z-index: 100;
      }
    }
    .u_appList{
      width: 242px;
      height: 278px;
      background: #FFFFFF;
      border: 1px solid #EEEEEE;
      border-radius: 4px;
      padding: 0 16px;
      margin-bottom: 12px;
      position: relative;
      .u_main-img {
        width: 23px;
        height: 23px;
        position: absolute;
        right: 3px;
        bottom: 3px;
        z-index: 100;
      }
      .u_app_title{
        margin-top: 16px;
        height: 20px;
        line-height: 20px;
        font-size: 12px;
        color: #909399;
        .v1{
          margin-right: 8px;
          display: inline-block;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #D9D9D9;
        }
        .v2{
          vertical-align: top;
        }
      }
      .u_content{
        margin: 0;
        margin-top: 4px;
        width: 210px;
        height: 22px;
        font-size: 14px;
        color: #383838;
        letter-spacing: 0;
        line-height: 22px;
        font-weight: 400;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      .u_app_img{
        width: 210px;
        height: 168px;
        margin-top: 4px;
      }
      .u_line{
        margin-top: 7.5px;
        width: 210px;
        height: 1px;
        background:#EBEBEB;
      }
      .u_bottom{
        margin-top: 7.5px;
        height: 20px;
        font-size: 12px;
        color: #909399;
        line-height: 20px;
        display: inline-flex;
        align-items: center;
        .icon{
          font-size: 10.57px;
          margin-right: 4px;
        }
      }
    }
  }
}
</style>
