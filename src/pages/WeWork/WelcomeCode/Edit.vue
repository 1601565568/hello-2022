<!--
 * @Descripttion: 编辑智能欢迎语
 * @Author: yuye.huang
 * @Date: 2020-03-01 19:58:47
 * @LastEditors: yuye.huang
 * @LastEditTime: 2020-03-03 14:56:58
 -->
<template>
  <div>
    <div class="page-title">
      新建智能欢迎语
    </div>
    <el-scrollbar ref="fullScreen">
      <div class="message-container">
        <el-container class="welcome-message__content">
          <el-aside width="60%" class="welcome-aside">
            <!-- <div class="welcome-aside__set text-primary">
                <Icon type="exclamation-circle" />
                配置后，客户将在添加成员为联系人后收到该欢迎语
              </div> -->
              <!-- 表单 -->
            <el-form ref='form' :model="model" label-width="100px">
              <el-form-item
              label="欢迎语：" size="xxs"
              prop='content' :rules="commonRules.content">
                <div class='welcome-aside__input'>
                  <el-form-grid>
                    <el-input type='textarea'
                      :cols='40'
                      :rows="3"
                      v-model="model.content"
                      placeholder="设置欢迎语内容，最多100字"
                      clearable
                    ></el-input>
                    <!-- autofocus="true" -->
                  </el-form-grid>
                </div>
              </el-form-item>
              <!-- 插入 <好友微信昵称><员工微信昵称> -->
              <ElFormItem label="选择附件：">
                <div class='welcome-aside__upload'>
                <!-- <ElFormGrid>
                  <ns-button type="text">+添加图片/网页/小程序</ns-button>
                </ElFormGrid> -->
                  <span class="welcome-square hand">
                    <Icon type="picture" className="welcome-square__icon welcome-square__tupian" />
                    图片
                  </span>
                  <span class="welcome-or">或</span>
                  <span class="welcome-square hand">
                    <Icon type="wangye" className="welcome-square__icon welcome-square__wangye" />
                    网页
                  </span>
                  <span class="welcome-or">或</span>
                  <span class="welcome-square hand">
                    <Icon type="xiaochengxu" className="welcome-square__icon welcome-square__xiaochengxu" />
                    小程序
                  </span>
                </div>
              </ElFormItem>
              <ElFormItem label="使用范围：">
                <ElFormGrid>
                  <ns-button type="text">+选择员工</ns-button>
                </ElFormGrid>
                <ElFormGrid>
                  已选择10名员工
                </ElFormGrid>
              </ElFormItem>
              <el-form-item>
                <ElFormGrid>
                  <ns-button type="text">+选择渠道</ns-button>
                </ElFormGrid>
                <ElFormGrid>
                  已选择10个渠道
                </ElFormGrid>
              </el-form-item>
              <el-form-item>
                <div class="form-save__unique">
                  <ns-save></ns-save>
                </div>
              </el-form-item>
            </el-form>
            <!-- 表单 -->
          </el-aside>

          <!-- 右侧预览页 -->
          <el-main class="welcome-main">
            <div class="welcome-main__exampleimg">
              <div class="welcome-msg clearfix">
                <div class="welcome-msg__avatar">
                  <el-image
                    :width='98'
                    :height='100'
                    style="width: 32px; height: 32px"
                    src="https://img.alicdn.com/imgextra/i4/645690921/O1CN01Q1rjbi1IfrITTcm0O_!!645690921.jpg_430x430q90.jpg"
                    mode="mfit">
                  </el-image>
                </div>
                <div class="welcome-msg__text">
                  <div class="welcome-news">我通过了你的朋友验证，现在我们可以开始聊天了</div>
                  <div class="welcome-circle"></div>
                </div>
              </div>
              <div class="welcome-msg clearfix">
                <div class="welcome-msg__avatar">
                  <el-image
                    :width='98'
                    :height='100'
                    style="width: 32px; height: 32px"
                    src="https://img.alicdn.com/imgextra/i4/645690921/O1CN01Q1rjbi1IfrITTcm0O_!!645690921.jpg_430x430q90.jpg"
                    mode="mfit">
                  </el-image>
                </div>
                <div class="welcome-msg__text">
                  <div class="welcome-news">欢迎您！这是一段自动回复消息～</div>
                  <div class="welcome-circle"></div>
                </div>
              </div>
              <!--图片开始-->
              <div class="welcome-msg clearfix" v-if="showChoice === 1">
                <div class="welcome-msg__avatar">
                  <el-image
                    :width='98'
                    :height='100'
                    style="width: 32px; height: 32px"
                    src="https://img.alicdn.com/imgextra/i4/645690921/O1CN01Q1rjbi1IfrITTcm0O_!!645690921.jpg_430x430q90.jpg"
                    mode="mfit">
                  </el-image>
                </div>
                <div class="welcome-image">
                  <div class="welcome-figurelist clearfix">
                    <el-image
                      :width='98'
                      :height='100'
                      style="width: 175px; height: 213px"
                      src="https://img.alicdn.com/imgextra/i4/645690921/O1CN01Q1rjbi1IfrITTcm0O_!!645690921.jpg_430x430q90.jpg"
                      mode="mfit">
                    </el-image>
                  </div>
                </div>
              </div>
              <!--图片 结束-->
              <!--网页 开始-->
              <div class="welcome-msg clearfix" v-else-if="showChoice === 2">
                <div class="welcome-msg__avatar">
                  <el-image
                        :width='98'
                        :height='100'
                        style="width: 32px; height: 32px"
                        src="https://img.alicdn.com/imgextra/i4/645690921/O1CN01Q1rjbi1IfrITTcm0O_!!645690921.jpg_430x430q90.jpg"
                    mode="mfit">
                  </el-image>
                </div>
                <div class="welcome-msg__text">
                  <div class="welcome-web">
                    <div class="welcome-web__slogan">线上课程！你想在秋招拿到线上课程！你想在秋招拿到</div>
                    <div class="welcome-web__propagate clearfix">
                      <div class="welcome-leftside">有些人秋招还没有准备，有的人秋招很完美有些人秋招还没有准备，有的人秋招很完美</div>
                      <el-image
                        :width='98'
                        :height='100'
                        style="width: 58px; height: 58px"
                        src="https://img.alicdn.com/imgextra/i4/645690921/O1CN01Q1rjbi1IfrITTcm0O_!!645690921.jpg_430x430q90.jpg"
                        mode="mfit" class="welcome-rightside">
                      </el-image>
                    </div>
                  </div>
                  <div class="welcome-circle"></div>
                </div>
              </div>
              <!--网页 结束-->
              <!--小程序 开始-->
              <div class="welcome-msg clearfix" v-else-if="showChoice === 3">
                <div class="welcome-msg__avatar">
                  <el-image
                    :width='98'
                    :height='100'
                    style="width: 32px; height: 32px"
                    src="https://img.alicdn.com/imgextra/i4/645690921/O1CN01Q1rjbi1IfrITTcm0O_!!645690921.jpg_430x430q90.jpg"
                    mode="mfit">
                  </el-image>
                </div>
                <div class="welcome-msg__text welcome-msg__text--bgcolor">
                  <div class="welcome-applets">
                    <div class="welcome-applets__logo">
                      <el-image
                        :width='98'
                        :height='100'
                        style="width: 20px; height: 20px"
                        src="https://img.alicdn.com/imgextra/i4/645690921/O1CN01Q1rjbi1IfrITTcm0O_!!645690921.jpg_430x430q90.jpg"
                        mode="mfit" class="welcome-applets__logo--img">
                      </el-image>
                    </div>
                    <div class="welcome-applets__name">最伙店长</div>
                  </div>
                  <div class="welcome-program">
                    <div class="welcome-program__name">最伙店长</div>
                    <div class="welcome-program__logo">
                      <el-image
                        :width='98'
                        :height='100'
                        style="width: 98px; height: 100px"
                        src="https://img.alicdn.com/imgextra/i4/645690921/O1CN01Q1rjbi1IfrITTcm0O_!!645690921.jpg_430x430q90.jpg"
                        mode="mfit" class="welcome-program__logo--img">
                      </el-image>
                    </div>
                  </div>
                  <div class="welcome-circle welcome-circle--topleft"></div>
                </div>
              </div>
              <!--小程序 结束-->
            </div>
            <div class="welcome-main__text">会员看到的界面</div>
          </el-main>
          <!-- 右侧预览页 -->
        </el-container>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import commonRules from './src/commonRules.js'
import ElMain from '@nascent/nui/lib/main'
import ElCard from '@nascent/nui/lib/card'
import ElContainer from '@nascent/nui/lib/container'
import ElAside from '@nascent/nui/lib/aside'
import ElImage from '@nascent/nui/lib/image'
import scrollHeight from '@nascent/ecrp-ecrm/src/mixins/scrollHeight'

export default {
  name: '',
  mixins: [scrollHeight],
  components: {
    ElContainer,
    ElMain,
    ElAside,
    ElImage
  },
  data: function () {
    return {
      showChoice: 2,
      commonRules: commonRules,
      model: {
        content: ''
      },
      title: '新增智能欢迎语'
    }
  },
  mounted: function () {
    this.$init({ uuid: this.$route.query.welcomeCodeUuid })
  },
  methods: {
    onSave: function () {
      let that = this
      let param = {
        content: that.model.content
      }
      that.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        that.$http
          .fetch(that.$api.weWork.welcomeCode.saveWelcomeCode, param)
          .then(resp => {
            // 1、先触发表格数据更新
            // this.$emit('change')
            // 2、关闭弹框
            // that.onCloseDialog()
            // 3、提示
            that.$notify.success('新增成功')
            that.$router.push({ path: '/WeWork/WelcomeCode/WelcomeList' })
          })
          .catch(resp => {
            that.$notify.error(resp.msg)
          })
          .finally(() => { })
      })
    },
    /**
     * @msg: 页面初始化时的数据加载函数
     */
    $init (data) {
      // 页面初始化时，加载页面数据
      let that = this
      if (data.uuid) {
        that.$http
          .fetch(that.$api.weWork.welcomeCode.getWelcomeCode, {
            uuid: data.uuid
          }).then(resp => {
            that.model = resp.result
          }).catch(resp => {
            that.$notify.error(resp.msg)
          })
      }
    }
  }
}
</script>
<style scoped>
  @import "@theme/variables.pcss";

  :root {
    --welcome-background-color-blue: #E5F4FF;
    --welcome-background-color-gray: #FCFCFC;
  }
  @component-namespace welcome {
    @b message {
      padding: var(--default-padding-small);
      background: var(--theme-color-white);
      border-radius: var(--default-radius-mini);
    }
    @b aside {
      @e set {
        display: inline-block;
        padding: var(--default-padding-small);
      }
      @e input {
        margin-top: var(--default-margin-small);
        background: var(--welcome-background-color-gray);
      }
      @e upload {
        display: flex;
        align-items: center;
        padding: var(--default-padding-small);
        background: var(--welcome-background-color-gray);
        border-left: 1px solid var(--theme-base-border-color-primary);
        border-right: 1px solid var(--theme-base-border-color-primary);
        border-bottom: 1px solid var(--theme-base-border-color-primary);
        border-radius: 0 0 var(--default-radius-mini) var(--default-radius-mini);
      }
    }
    @b square {
      text-align: center;
      margin-left: var(--default-margin-larger);
      padding: var(--default-padding-small);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--theme-base-border-color-primary);
      border-radius: var(--default-radius-mini);
      &:hover {
        color: var(--theme-color-primary);
        background: var(--welcome-background-color-blue);
        .welcome-square__icon {
          color: var(--theme-color-primary);
        }
      }
      @e icon {
        color: var(--theme-font-color-secondary);
        margin-right: var(--default-margin-small);
      }
      @e tupian {
        font-size: var(--default-font-size-middle);
      }
      @e wangye {
        font-size: var(--default-font-size-middle);
      }
      @e xiaochengxu {
        font-size: var(--default-font-size-large);
      }
    }
    @b choice {
      line-height: 34px;
      width: 100%;
      height: 36px;
      display: flex;
      align-items: center;
      border: 1px solid var(--theme-base-border-color-primary);
      @e marginleft {
        font-size: 24px;
        margin-left: var(--default-margin-larger);
      }
      @e icon {
        color: var(--theme-color-primary);
        margin-right: var(--default-margin-small);
      }
      @e tupian {
        font-size: var(--default-font-size-middle);
      }
      @e wangye1 {
        font-size: 26px;
      }
      @e xiaochengxu {
        font-size: var(--dafault-font-size-xlarge);
      }
      @e shanchu {
        font-size: var(--default-font-size-base);
        color: var(--theme-font-color-secondary);
        &:hover {
          color: var(--theme-color-primary);
         }
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
      padding: var(--default-padding-small) 0;
      border-bottom: 1px solid var(--theme-base-border-color-primary);
      @e total {
        color: var(--theme-font-color-secondary);
      }
      @e modify {
        color: var(--theme-color-primary);
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
        color: var(--theme-font-color-secondary);
        text-align: center;
        margin-top: -5px;
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
      background: var(--theme-color-white);
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
          border-radius: 7px;
        }
      }
      @e name {
        color: var(--theme-font-color-regular);
        margin-left: var(--default-margin-larger);
      }
    }
    @b program {
      @e name {
        font-size: var(--default-font-size-base);
        margin-top: 8px;
      }
      @e logo {
        text-align: center;
        margin-top: var(--default-margin-xlarger);
        @m img {
          border-radius: 20px;
        }
      }
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
  >>> .el-upload--text {
    display: flex;
    align-items: center;
  }
  .clearfix:after {
    content: "";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  .form-save__unique {
    padding: var(--default-padding-small) 0 var(--default-padding-small) 150px;
    border-top: 1px solid var(--theme-base-border-color-primary);
    background-color: var(--theme-color-white);
    border-bottom-left-radius: var(--default-radius-mini);
    border-bottom-right-radius: var(--default-radius-mini);
  }
  .hand {
    cursor: pointer;
  }
  >>> .el-textarea__inner {
    border-radius: var(--default-radius-mini) var(--default-radius-mini) 0 0;
  }
</style>
