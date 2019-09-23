<template>
  <div ref="welcomeHeight">
    <el-scrollbar ref="welcomeFullScreen">
      <div class="welcome-message">
        <el-container class="welcome-message__content">
          <el-aside width="60%" class="welcome-aside">
            <div class="welcome-aside__set colorblue">配置后，客户将在添加成员为联系人后收到该欢迎语</div>
            <div class="welcome-aside__input">
              <el-input
                type="textarea"
                :rows="14"
                placeholder="欢迎！这是一段自动回复消息哦"
                v-model="textarea">
              </el-input>
            </div>
            <div class="welcome-aside__upload" v-if="showChoice === 0">
              <el-upload
                class="avatar-uploader hand"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false">
                <img v-if="imageUrl" src="" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <span class="welcome-square hand">
                <i  class="iconfont icon-tupian"></i>
                图片
              </span>
              <span class="welcome-or">或</span>
              <span class="welcome-square hand">
                <i  class="iconfont icon-wangye"></i>
                网页
              </span>
              <span class="welcome-or">或</span>
              <span class="welcome-square hand">
                <i  class="iconfont icon-xiaochengxu"></i>
                小程序
              </span>
            </div>
            <!--图片开始-->
            <div class="welcome-aside__upload" v-else-if="showChoice === 1">
              <span class="welcome-choice welcome-choice--bodernone colorblue clearfix">
                <i  class="iconfont icon-tupian"></i>
                <span class="welcome-choice__showlength">头像0.jpg</span>
                <i  class="iconfont icon-shanchu3 welcome-choice__marginleft hand"></i>
              </span>
            </div>
            <!--图片结束-->
            <!--网页开始-->
            <div class="welcome-aside__upload" v-else-if="showChoice === 2">
              <span class="welcome-choice welcome-choice--bodernone colorblue clearfix">
                <i class="iconfont icon-wangye1"></i>
                <span class="welcome-choice__showlength">网页网页网页网页网页网页网页网页网页网页网页网页网页网页网页网页网页网页网页网页v网页网页网页
                网页网页网页网页网页网页网页网页网页网页网页网页网页网页网页网页网页网页网页网页v网页网页网页</span>
                <i class="iconfont icon-shanchu3 welcome-choice__marginleft hand"></i>
              </span>
            </div>
            <!--网页开始-->
            <!--小程序开始-->
            <div class="welcome-aside__upload" v-else-if="showChoice === 3">
              <span class="welcome-choice welcome-choice--bodernone colorblue clearfix">
                <i  class="iconfont icon-xiaochengxu"></i>
                <span class="welcome-choice__showlength">小程序</span>
                <i  class="iconfont icon-shanchu3 welcome-choice__marginleft hand"></i>
              </span>
            </div>
            <!--小程序结束-->
            <div class="welcome-operating clearfix">
              <span class="welcome-operating__use">使用范围：</span>
              <span class="welcome-operating__member">全部成员</span>
              <span class="welcome-operating__total">（共1222名导购）</span>
              <span class="welcome-operating__modify hand">更改</span>
            </div>
          </el-aside>
          <el-main class="welcome-main">
            <div class="welcome-main__exampleimg">
              <div class="welcome-msg clearfix">
                <img src="./src/images/avartar.jpg"  alt="用户头像" class="welcome-msg__avatar">
                <div class="welcome-msg__text">
                  <div class="welcome-news">我通过了你的朋友验证，现在我们可以开始聊天了</div>
                  <div class="welcome-circle"></div>
                </div>
              </div>
              <div class="welcome-msg clearfix">
                <img src="./src/images/avartar.jpg"  alt="用户头像" class="welcome-msg__avatar">
                <div class="welcome-msg__text">
                  <div class="welcome-news">欢迎您！这是一段自动回复消息～</div>
                  <div class="welcome-circle"></div>
                </div>
              </div>
              <!--图片开始-->
              <div class="welcome-msg clearfix" v-if="showChoice === 1">
                <img src="./src/images/avartar.jpg"  alt="用户头像" class="welcome-msg__avatar">
                <div class="welcome-image">
                  <div class="welcome-figurelist clearfix">
                    <div class="welcome-figurelist__li">
                      <div :style="{'background-image': 'url('+ imgUrl + ')'}" class="welcome-figure">
                        <div class="welcome-figure__img"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!--图片 结束-->
              <!--网页 开始-->
              <div class="welcome-msg clearfix" v-else-if="showChoice === 2">
                <img src="./src/images/avartar.jpg"  alt="用户头像" class="welcome-msg__avatar">
                <div class="welcome-msg__text">
                  <div class="welcome-web">
                    <div class="welcome-web__slogan">线上课程！你想在秋招拿到线上课程！你想在秋招拿到</div>
                    <div class="welcome-web__propagate clearfix">
                      <div class="welcome-leftside">有些人秋招还没有准备，有的人秋招很完美有些人秋招还没有准备，有的人秋招很完美</div>
                      <img src="./src/images/avartar.jpg"  alt="宣传图片" class="welcome-rightside">
                    </div>
                  </div>
                  <div class="welcome-circle"></div>
                </div>
              </div>
              <!--网页 结束-->
              <!--小程序 开始-->
              <div class="welcome-msg clearfix" v-else-if="showChoice === 3">
                <img src="./src/images/avartar.jpg"  alt="用户头像" class="welcome-msg__avatar">
                <div class="welcome-msg__text welcome-msg__text--bgcolor">
                  <div class="welcome-applets">
                    <div class="welcome-applets__logo">
                      <img src="./src/images/logo.png"  alt="logo" class="welcome-applets__logo--img">
                    </div>
                    <div class="welcome-applets__name">最伙店长</div>
                  </div>
                  <div class="welcome-program">
                    <div class="welcome-program__name">最伙店长</div>
                    <div class="welcome-program__logo">
                      <img src="./src/images/logo.png"  alt="logo" class="welcome-program__logo--img">
                    </div>
                  </div>
                  <div class="welcome-circle welcome-circle--topleft"></div>
                </div>
              </div>
              <!--小程序 结束-->
            </div>
            <div class="welcome-main__text">会员看到的界面</div>
          </el-main>
        </el-container>
      </div>
    </el-scrollbar>
    <div class="form-save__unique">
      <ns-save></ns-save>
      <ns-button>取消</ns-button>
    </div>
  </div>
</template>
<script>
import ElContainer from 'nui-v2/lib/container'
import ElMain from 'nui-v2/lib/main'
import ElAside from 'nui-v2/lib/aside'
import ElUpload from 'nui-v2/lib/upload'
export default {
  components: {
    ElContainer,
    ElMain,
    ElAside,
    ElUpload
  },
  data () {
    return {
      imageUrl: '',
      textarea: '',
      showChoice: 3,
      imgUrl: require('./src/images/avartar.jpg')
    }
  },
  mounted: function () {
    this.setHeight()
    window.addEventListener('resize', this.setHeight)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.setHeight)
  },
  methods: {
    /** 计算主要显示窗口的高度，动态设置页面内主要内容的高度 **/
    setHeight: function () {
      let limitHeight = window.innerHeight - this.$refs.welcomeHeight.offsetTop - 34
      this.$refs.welcomeFullScreen.$el.children[0].style.maxHeight = limitHeight + 'px'
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style scoped>
  @import "@theme/variables.pcss";
  :root {
    --welcome-font-color-blue: #0094FC;
    --welcome-font-color-gray:#8C939D;
    --welcome-background-color-blue: #E5F4FF;
    --welcome-background-color-gray: #FCFCFC;
    --welcome-border-color-gray: #DADADA;
  }
  @component-namespace welcome {
    @b message {
      padding: var(--default-padding-larger);
      background: var(--theme-color-white);
    }
    @b aside {
      @e set {
        font-size: var(--default-font-size-base);
        display: inline-block;
        padding: 10px;
        background: var(--welcome-background-color-blue);
        border-radius: 5px;
      }
      @e input {
        margin-top: var(--default-margin-larger);
        background: var(--welcome-background-color-gray);
      }
      @e upload {
        display: flex;
        align-items: center;
        padding: var(--default-padding-larger);
        background: var(--welcome-background-color-gray);
        border-left: 1px solid var(--welcome-border-color-gray);
        border-right: 1px solid var(--welcome-border-color-gray);
        border-bottom: 1px solid var(--welcome-border-color-gray);
        border-radius: 0 0 var(--default-radius-mini) var(--default-radius-mini);
      }
    }
    @b square {
      text-align: center;
      line-height: 34px;
      height: 36px;
      margin-left: var(--default-margin-larger);
      padding: 0 var(--default-padding-small);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--welcome-border-color-gray);
      border-radius: var(--default-radius-mini);
      &:hover {
        color: var(--welcome-font-color-blue);
        background: var(--welcome-background-color-blue);
        .iconfont {
          color: var(--welcome-font-color-blue);
        }
      }
    }
    @b choice {
      line-height: 34px;
      width: 100%;
      height: 36px;
      display: flex;
      align-items: center;
      border: 1px solid var(--welcome-border-color-gray);
      @e marginleft {
        margin-left: var(--default-margin-larger);
      }
      @e showlength {
        max-width: 93%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      @m bodernone {
        border: none;
      }
    }
    @b or {
      font-size: var(--default-font-size-base);
      color: var(--theme-font-color-secondary);
      margin-left: var(--default-margin-larger);
    }
    @b operating {
      padding: var(--default-padding-larger) 0;
      border-bottom: 1px solid var(--welcome-border-color-gray);
      @e use {
        font-size: var(--default-font-size-base);
        color: var(--theme-font-color-regular);
      }
      @e member {
        font-size: var(--default-font-size-base);
        color: var(--theme-font-color-primary);
      }
      @e total {
        font-size: var(--default-font-size-base);
        color: var(--theme-font-color-secondary);
      }
      @e modify {
        font-size: var(--default-font-size-base);
        color: var(--welcome-font-color-blue);
        float: right;
      }
    }
    @b main {
      margin: 0 auto;
      @e exampleimg {
        width: 303px;
        height: 573px;
        margin: 0 auto;
        padding: 80px 40px 20px;
        background-image: url("./src/images/bgImg2019.7.29.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
      @e text {
        font-size: var(--default-font-size-base);
        color: var(--theme-font-color-secondary);
        text-align: center;
      }
    }
    @b msg {
      padding: var(--default-padding-larger) 0;
      display: flex;
      overflow: hidden;
      @e avatar {
        width: 32px;
        height: 32px;
        margin-top: var(--default-margin-small);
      }
      @e text {
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
      @m margintop {
        margin-top: var(--default-margin-larger);
      }
    }
    @b news {
      flex: 1;
      padding: 8px 12px;
      margin-left: var(--default-margin-xlarger);
      background: #FFF;
      border-radius: 8px;
    }
    @b web {
      width: 47%;
      padding: 8px var(--default-padding-xlarger);
      margin-left: var(--default-margin-xlarger);
      background: #FFF;
      border-radius: 10px;
      @e slogan {
        font-size: var(--default-font-size-base);
        width: 100%;
        display: inline-block;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      @e propagate {
        margin-top: var(--default-margin-small);
      }
    }
    @b leftside {
      font-size: 10px;
      color: var(--theme-font-color-secondary);
      width: 50%;
      max-height: 60px;
      float: left;
      overflow : hidden;
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
    @b image {
      margin-left: var(--default-margin-xlarger);
      @e img {
        width: 175px;
        height: 213px;
        border-radius: 10px;
      }
    }
    @b figurelist {
      margin: 0;
      padding: 0;
      &:after {
        content: "";
        display: block;
        clear: both;
        height: 0;
        overflow: hidden;
        visibility: hidden;
      }
      @e li {
        float: left;
        width: 175px;
        height: 213px;
        margin: 0 2% 2% 0;
      }
    }
    @b figure {
      position: relative;
      width: 100%;
      height: 0;
      overflow: hidden;
      margin: 0;
      padding-bottom: 100%; /* 关键就在这里 */
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      border-radius: 10px;
      @e img {
        display: block;
        position: absolute;
        width: 100%;
        top: 0;
        bottom: 0;
      }
    }
    @b circle {
      width: 0;
      height: 0;
      position: absolute;
      left: 0px;
      top: 10px;
      border-width: 8px;
      border-style: solid;
      border-color: transparent #FFF transparent transparent;
      @m topleft {
        top: 15px;
        left: -15px;
      }
    }
    @b applets {
      display: flex;
      @e logo {
       @m img {
         width: 20px;
         height: 20px;
         border-radius: 7px;
       }
      }
      @e name {
        font-size: var(--default-font-size-small);
        color: var(--theme-font-color-regular);
        margin-left: var(--default-margin-larger);
      }
    }
    @b program {
      @e name {
        font-size: var(--default-font-size-base);
        color: var(--theme-font-color-primary);
        margin-top: 8px;
      }
      @e logo {
        text-align: center;
        margin-top: var(--default-margin-xlarger);
        @m img {
          width: 98px;
          height: 100px;
          border-radius: 20px;
        }
      }
    }
  }
  .avatar-uploader >>> .el-upload {
    cursor: pointer;
    .avatar-uploader-icon {
      font-size: var(--default-font-size-large);
      color: var(--welcome-font-color-gray);
    }
  }
  .welcome-aside__input >>> .el-textarea.el-input--small .el-textarea__inner {
    resize: none;
  }
  .welcome-aside__upload >>> .avatar-uploader .el-upload {
    border: none;
  }
  >>> .el-main {
    padding: 0 !important;
  }
  .welcome-aside__input >>> .el-textarea__inner {
    color: var(--theme-font-color-primary);
    background: var(--welcome-background-color-gray);
  }
  >>> .el-upload--text {
    display: flex;
    align-items: center;
  }
  .welcome-square .iconfont {
    color: var(--theme-font-color-secondary);
    margin-right: var(--default-margin-small);
  }
  .welcome-square .icon-tupian {
    font-size: 26px;
  }
  .welcome-square .icon-wangye {
    font-size: 22px;
  }
  .welcome-square .icon-xiaochengxu {
    font-size: 24px;
  }
  .clearfix:after {
    content: "";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  .form-save__unique {
    padding: 5px 0 5px 150px;
    border-top: 1px solid var(--theme-base-border-color-primary);
    background-color: var(--theme-color-white);
  }
  .colorblue {
    color: var(--welcome-font-color-blue);
  }
  .welcome-choice .iconfont {
    color: var(--welcome-font-color-blue);
    margin-right: var(--default-margin-small);
  }
  .welcome-choice .icon-tupian {
    font-size: var(--dafault-font-size-xlarge);
  }
  .welcome-choice .icon-wangye1 {
    font-size: 26px;
  }
  .welcome-choice .icon-xiaochengxu {
    font-size: var(--dafault-font-size-xlarge);
  }
  .welcome-choice .icon-shanchu3 {
    font-size: var(--dafault-font-size-xlarge);
    color: var(--welcome-font-color-blue);
  }
  @e figurelist {
    margin: 0;
    padding: 0;
    &:after {
      content: "";
      display: block;
      clear: both;
      height: 0;
      overflow: hidden;
      visibility: hidden;
    }
  }
  .hand {
    cursor: pointer;
  }
  >>> .el-textarea__inner {
    border-radius: var(--default-radius-mini) var(--default-radius-mini) 0 0;
  }
</style>
