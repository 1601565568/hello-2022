<template>
  <div class="message-exampleimg">
    <div class="message-exampleimg__heading">内容预览</div>
    <ElScrollbar>
      <div v-for="(child, index) in massData" :key="index" class="message-list">
          <div class="message-msg clearfix">
            <!--文字开始-->
            <div class="message-msg__text"  v-if="child.type === 1 && child.msg !== ''">
              <div class="message-news">
                <EmojiText :text='child.msg' type='list'/>
              </div>
              <div class="message-circle"></div>
            </div>
            <!--文字结束-->

            <!--图片开始-->
            <ElImage
              :width="98" :height="73"
              :src="child.pic"
              mode="fill" v-if="child.type === 2 && child.pic !== ''" class="message-msg__uploader">
            </ElImage>
            <!--图片 结束-->

            <!--小程序 开始-->
            <div class="message-web"  v-if="child.type === 4">
              <div class="message-web__top">
                <div class="message-web__title">
                  <ElImage
                    :width="13" :height="13"
                    :src="child.pic"
                    mode="fill" />
                  <span class="message-name message-name--top"></span>
                </div>
                <div class="message-web__slogan">{{child.title}}</div>
                <ElImage
                  :width="156" :height="125"
                  :src="child.pic"
                  mode="fill" class="message-web__picture" />
              </div>
              <div class="message-web__bottom message-web__title--line">
                <Icon type="xiaochengxu" className="font-size-base"/>
                <span class="message-name">{{child.style}}</span>
              </div>
              <div class="message-circle message-circle--bgcolor"></div>
            </div>
            <!--小程序  结束-->

            <!--链接 开始-->
            <div class="message-web"  v-if="child.type === 3">
              <div class="message-web__top message-web__top--program">
                <div class="message-web__slogan">{{child.title}}</div>
                <div class="message-web__propagate clearfix">
                  <div class="message-leftside" style="word-wrap: break-word;">{{child.desc}}</div>
                  <ElImage
                    :width="60" :height="60"
                    :src="child.pic"
                    mode="fill" class="message-rightside" />
                </div>
              </div><!--
              <div class="message-web__bottom message-web__title message-web__title&#45;&#45;line">
                <ElImage
                  :width="13" :height="13"
                  :src="child.logo" />
                <span class="message-name message-name&#45;&#45;top">{{child.name}}</span>
              </div>
              <div class="message-circle message-circle&#45;&#45;bgcolor"></div>-->
            </div>
            <!--链接 结束-->

            <div class="message-msg__avatar">
              <img :width="30" :height="30" src="./images/wxpic.png"
                mode="fill" class="message-msg__avatar&#45;&#45;radius" />
            </div>
          </div>
        </div>
    </ElScrollbar>
  </div>
</template>
<script>
import ElImage from '@nascent/nui/lib/image'
import EmojiText from '@/components/NewUi/EmojiText'

export default {
  components: {
    ElImage, EmojiText
  },
  data () {
    return {
      // 内容预览列表数据
      massData: [],
      // 视频配置
      videoFlag: false
    }
  }
}
</script>

<style scoped>
  @import "@theme/variables.pcss";

  @component-namespace message {
    @b exampleimg {
      text-align: center;
      width: 318px;
      height: 573px;
      position: relative;
      margin: 0 auto;
      padding: 94px 20px 20px;
      background-image: url("./images/iphonexmockup.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      @e heading {
        font-size: var(--default-font-size-base);
        font-weight: bold;
        position: absolute;
        top: 57px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    @b list {
      margin-top: 20px;
      &:first-child {
         margin-top: 0;
       }
      @e groupbtn {
        font-size: var(--default-font-size-base);
        line-height: 17px;
        display: inline-block;
        padding: 3px 22px 4px 24px;
        background: var(--theme-color-white);
        border-radius: 14px;
      }
    }
    @b msg {
      padding-right: var(--default-padding-larger);
      margin: 14px var(--default-margin-larger) 0 0;
      display: flex;
      justify-content: flex-end;
      overflow: hidden;
      @e avatar {
        margin: var(--default-margin-small) 0 0 var(--default-margin-larger);
        @m radius {
          border-radius: 4px;
        }
      }
      @e text {
        width: 175px;
        position: relative;
        @m bgcolor {
          width: 78%;
          position: relative;
          padding: var(--default-padding-xlarger);
          margin-left: var(--default-margin-xlarger);
          background: #FFF;
          border-radius: 10px;
        }
      }
      @e uploader {
        width: 98px;
        height: 73px;
        border-radius: 4px;
        position: relative;
        overflow: hidden;
      }
    }
    @b broadcast {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-left: 8px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, .4);
      border-radius: 50%;
      @e circle {
        width: 0;
        height: 0;
        border-width: 7px;
        border-style: solid;
        border-color: transparent transparent transparent var(--theme-color-white);
      }
    }
    @b news {
      text-align: left;
      color: #1A1A1A;
      line-height: 16px;
      flex: 1;
      padding: 7px 12px;
      background: #95EC69;
      border-radius: 4px;
    }
    @b web {
      text-align: left;
      width: 174px;
      background: var(--theme-color-white);
      border-radius: 4px;
      @e top {
        padding: 7px 8px 4px 8px;
        @m program {
          padding: 7px 10px var(--default-padding-small) 11px;
        }
      }
      @e bottom {
        padding: 0 8px;
      }
      @e title {
        display: flex;
        align-items: center;
        @m line {
          padding-top: var(--default-padding-small);
          margin-top: var(--default-margin-small);
          border-top: 1px solid var(--theme-base-border-color-primary);
        }
      }
      @e slogan {
        font-size: var(--default-font-size-base);
        font-weight: bold;
        margin-top: var(--default-margin-small);
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      @e picture {
        margin: var(--default-margin-small) 0;
      }
      @e propagate {
        margin-top: var(--default-margin-mini)0;
      }
    }
    @b leftside {
      font-size: 10px;
      color: var(--theme-font-color-secondary);
      line-height: 14px;
      width: 50%;
      max-height: 60px;
      float: left;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
    @b rightside {
      width: 58px;
      height: 58px;
      margin-left: var(--default-margin-xlarger);
    }
    @b circle {
      width: 0;
      height: 0;
      position: absolute;
      right: -15px;
      top: 10px;
      border-width: 8px;
      border-style: solid;
      border-color: transparent transparent transparent #95EC69;
      @m bgcolor {
        border-color: transparent transparent transparent var(--theme-color-white);
      }
    }
    @b name {
      font-size: 8px;
      color: var(--theme-font-color-secondary);
      line-height: 7px;
      position: relative;
      top: -1px;
      margin-left: var(--default-padding-small);
      @m top {
        top: -3px;
      }
    }
  }
</style>
