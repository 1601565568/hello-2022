<template>
  <div class="preview_body">
    <img :src='defaultIcon' class="scope-title_img">
    <div class="u_tag">所有素材<Icon class="icon" type="ns-arrow-drowdown" /></div>
    <div v-if="title" class="u_title">{{title}}</div>
    <div v-if="pitContent" class="u_pitContent">
      <EmojiText :text='htmlContent' />
    </div>
    <div class="u_main">
      <div class="u_box" v-for="(item, index) in list" :key="index">
        <div class="u_imgList" :style="{ border: item.type === 0 ? '1px dashed #e8e8e8' : 'none' }" v-if="item.type === 0 || item.type === 1 || item.type === 5">
          <img :src='item.content.image || defaultImgUrl' alt="">
        </div>
        <div v-if="item.type === 2" class="u_videoList">
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
          <div class="u_bottom"><Icon class="icon" type="xiaochengxushouquan" className="icon"/>小程序</div>
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
  background: #fff;
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
    height: 54px;
    background: #F5F5F5;
    font-size: 14px;
    color: #262626;
    line-height: 54px;
    padding-left: 12px;
    margin-bottom: 16px;
    .icon{
      font-size: 16px;
      margin-left: 4px;
      vertical-align: middle;
    }
  }
  .u_title{
    font-size: 14px;
    color: #262626;
    line-height: 22px;
    margin: 16px;
    margin-bottom: 12px;
    margin-top: 0;
    font-weight: bold;
    padding-bottom: 12px;
    border-bottom: 1px solid #E8E8E8;

    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .u_pitContent{
    margin: 12px 16px;
    word-break: break-all;
    font-size: 14px;
    margin-top: 0;
    color: #383838;
    line-height: 24px;
  }
  .u_main{
    .u_box{
      display: inline-block;
      vertical-align: top;
    }
    margin-left: 16px;
    .u_imgList, .u_videoList{
      display: inline-block;
      border-radius: 4px;
      margin-bottom: 12px;
      width: 91px;
      height: 91px;
      margin-right: 6px;
      img{
        width: 100%;
        height: 100%;
      }
      video{
        width: 91px;
        height: 91px;
        object-fit: cover;
      }
      &:nth-child(3n){
        margin-right: 0;
      }
    }
    .u_videoList{
      width: 91px;
      height: 91px;
      position: relative;
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
    }
    .u_appList{
      width: 242px;
      height: 278px;
      background: #FFFFFF;
      border: 1px solid #EEEEEE;
      border-radius: 4px;
      padding: 0 16px;
      margin-bottom: 12px;
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
        .icon{
          font-size: 10.57px;
          margin-right: 4px;
        }
      }
    }
  }
}
</style>
