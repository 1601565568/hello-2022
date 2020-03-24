<template>
  <div class="message-exampleimg">
    <div class="message-exampleimg__heading">内容预览</div>
    <ElScrollbar>
      <div class="message-list">
        <div class="message-msg">
          <!--链接 开始-->
          <div class="message-web message-web--big">
            <div class="message-web__top">
              <div class="message-slogan">{{publishData.title}}</div>
              <div class="message-exhaustive">
                <div class="message-exhaustive__leftside">{{publishData.content}}</div>
                <ElImage
                  :width="34" :height="34"
                  :src="publishData.picture"
                  mode="fill" class="message-exhaustive__rightside" />
              </div>
            </div>
            <div class="message-circle message-circle--bgcolor"></div>
          </div>
          <!--链接 结束-->
          <div class="message-msg__avatar">
            <ElImage
              :width="30" :height="30"
              :src="logImg"
              mode="fill" class="message-msg__avatar--radius" />
          </div>
        </div>
      </div>
    </ElScrollbar>
  </div>
</template>
<script>
import ElImage from '@nascent/nui/lib/image'

export default {
  components: {
    ElImage
  },
  props: ['model'],
  data () {
    return {
      // 内容预览数据
      publishData: this.model,
      // 头像
      logImg: 'https://img.alicdn.com/imgextra/i4/645690921/O1CN01Q1rjbi1IfrITTcm0O_!!645690921.jpg_430x430q90.jpg'
    }
  },
  watch: {
    publishData () {
      this.publishData = this.model
    }
  },
  mounted () {
    this.publishData = this.publishDataFather
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
      background-image: url("./../images/iphonexmockup.png");
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
      position: relative;
      padding: 7px 8px var(--default-margin-mini) 8px;
      background: var(--theme-color-white);
      border-radius: 4px;
      @m big {
        padding: 7px 8px var(--default-margin-base) 10px;
      }
      @e bottom {
        line-height: 7px;
        display: flex;
        align-items: center;
        padding-top: var(--default-margin-mini);
        border-top: 0.5px solid var(--theme-base-border-color-primary);
        @m base {
          padding-top: var(--default-padding-small);
        }
      }
    }
    @b title {
      line-height: 7px;
      display: flex;
      align-items: center;
    }
    @b slogan {
      font-size: var(--default-font-size-base);
      font-weight: bold;
      line-height: 17px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    @b picture {
      margin: 6px 0;
    }
    @b exhaustive {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: var(--default-margin-mini) 0 8px;
      @e leftside {
        font-size: 10px;
        color: var(--theme-font-color-secondary);
        line-height: 14px;
        width: 50%;
        max-height: 60px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
      @e rightside {
        flex-shrink: 0;
        margin-left: 7px;
      }
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
      margin-left: var(--default-padding-small);
    }
  }
</style>
