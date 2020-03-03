<!--
 * @Descripttion: 编辑智能欢迎语
 * @Author: yuye.huang
 * @Date: 2020-03-01 19:58:47
 * @LastEditors: yuye.huang
 * @LastEditTime: 2020-03-04 00:27:02
 -->
<template>
  <div>
    <!-- <div class="page-title">
      编辑智能欢迎语
    </div> -->
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
              <el-form-item>
                <ElFormGrid>
                  <ns-button type="text" @click="insertPlaceHolder('{employeeNick}')"> +插入好友微信昵称 </ns-button>
                </ElFormGrid>
                <ElFormGrid>
                  <ns-button type="text" @click="insertPlaceHolder('{customerNick}')"> +插入员工微信昵称 </ns-button>
                </ElFormGrid>
              </el-form-item>
              <!-- 插入 <好友微信昵称><员工微信昵称> -->
              <ElFormItem label="选择附件：">
                <div class='welcome-aside__upload'>
                <!-- <ElFormGrid>
                  <ns-button type="text">+添加
                    图片/网页/小程序</ns-button>
                </ElFormGrid> -->
                  <el-upload
                    class="avatar-uploader"
                    :action="$api.core.sgUploadFile('image')"
                    accept=".jpg,.jpeg,.png,.bmp,.gif"
                    :on-success="handleAnnexAvatarSuccess" :show-file-list="false" >
                    <Icon type="plus" className="company-upload__tip"/>
                    <!-- <Icon type="picture" className="welcome-square__icon welcome-square__tupian" /> -->
                  </el-upload>
                  <span class="welcome-square hand" :class="[model.annexType === 1?'welcome-square__active':'']">
                    <Icon type="picture" className="welcome-square__icon welcome-square__tupian" />
                    图片
                  </span>
                  <span class="welcome-or">或</span>
                  <span class="welcome-square hand" :class="[model.annexType === 2?'welcome-square__active':'']" @click="showAnnex(2)">
                    <Icon type="wangye" className="welcome-square__icon welcome-square__wangye" />
                    网页
                  </span>
                  <span class="welcome-or">或</span>
                  <span class="welcome-square hand" :class="[model.annexType === 3?'welcome-square__active':'']" @click="showAnnex(3)">
                    <Icon type="xiaochengxu" className="welcome-square__icon welcome-square__xiaochengxu" />
                    小程序
                  </span>
                </div>
              </ElFormItem>
              <ElFormItem label="使用范围：">
                <ElFormGrid>
                  <ns-button type="text" @click="showEmployee()">+选择员工</ns-button>
                </ElFormGrid>
                <ElFormGrid>
                  已选择10名员工
                </ElFormGrid>
              </ElFormItem>
              <el-form-item>
                <ElFormGrid>
                  <ns-button type="text" @click="showChannel()">+选择渠道</ns-button>
                </ElFormGrid>
                <ElFormGrid v-if="this.model.channelId">
                  已选择渠道
                </ElFormGrid>
              </el-form-item>
              <el-form-item>
                <div class="form-save__unique">
                  <ns-save @click="saveOrUpdate"></ns-save>
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
              <div class="welcome-msg clearfix" v-if="model.annexType === 1">
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
              <div class="welcome-msg clearfix" v-else-if="model.annexType === 2">
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
              <div class="welcome-msg clearfix" v-else-if="model.annexType === 3">
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
    <!-- 网页 -->
    <el-dialog ref="linkDialog" width="500px" :visible.sync="linkModel.visible" title="链接">
      <el-form ref="linkForm"
        label-width="100px"
        placement="right"
        :model="linkModel">
          <el-form-item label="跳转链接：">
          </el-form-item>
          <el-form-item label="链接：" prop="custom">
            <el-radio v-model="linkModel.custom" :label="1" size="xxs">自定义链接 </el-radio>
            <el-radio v-model="linkModel.custom" :label="2" size="xxs">系统预置链接 </el-radio>
          </el-form-item>
          <el-form-item v-if="linkModel.custom === 1" label="网页地址：" prop="link" :rules='commonRules.link'>
            <el-form-grid size="xmd">
              <el-input v-model.trim="linkModel.link"/>
            </el-form-grid>
          </el-form-item>
          <el-form-item v-if="linkModel.custom === 2" label="选择链接：" prop="link" :rules='commonRules.selectOne'>
            <el-select v-model="linkModel.settingId"  placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="消息展示内容：">
          </el-form-item>
          <el-form-item label="标题：" prop="title" :rules='commonRules.title'>
            <el-form-grid size="xmd">
              <el-input v-model.trim="linkModel.title"/>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="文案：" prop="innerContent" :rules='commonRules.innerContent'>
            <el-form-grid size="xmd">
              <el-input v-model.trim="linkModel.innerContent"/>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="封面图：" prop="image">
            <el-form-grid class="company-upload">
              <el-upload
                class="avatar-uploader"
                :action="$api.core.sgUploadFile('test')"
                accept=".jpg,.jpeg,.png,.bmp,.gif"
                :on-success="handleLinkAvatarSuccess" :show-file-list="false" >
                <img v-if="linkModel.image" :src="linkModel.image" class="company-upload__avatar">
                <Icon  v-else type="plus" className="company-upload__tip"/>
              </el-upload>
            </el-form-grid>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="onCloseAnnex(2),onCloseHandleModel(2)">取消</ns-button>
        <ns-button @click="onSubmitAnnex(2)" type="primary">确定</ns-button>
      </div>
    </el-dialog>
    <!-- 小程序 -->
     <el-dialog ref="appDialog" width="500px" :visible.sync="appModel.visible" title="链接">
      <el-form ref="appForm"
        label-width="100px"
        placement="right"
        :model="appModel">
          <el-form-item label="跳转链接：">
          </el-form-item>
          <el-form-item prop="custom">
            <el-radio v-model="appModel.custom" :label="1" size="xxs">手动录入小程序 </el-radio>
            <el-radio v-model="appModel.custom" :label="2" size="xxs">系统预置小程序 </el-radio>
          </el-form-item>
          <template v-if="appModel.custom === 1">
            <el-form-item label="小程序appid：" prop="appid" :rules='commonRules.appid'>
              <el-form-grid size="xmd">
                <el-input v-model.trim="appModel.appid"/>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="小程序路径：" prop="path" :rules='commonRules.path'>
              <el-form-grid size="xmd">
                <el-input v-model.trim="appModel.path"/>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="备用网页：" prop="link" :rules='commonRules.link'>
              <el-form-grid size="xmd">
                <el-input v-model.trim="appModel.link"/>
              </el-form-grid>
            </el-form-item>
          </template>
          <template>
            <el-form-item v-if="appModel.custom === 2" label="选择链接：" prop="link" :rules='commonRules.selectOne'>
              <el-select v-model="appModel.settingId"  placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </template>
          <el-form-item label="小程序卡片展示：">
          </el-form-item>
          <el-form-item label="标题：" prop="title" :rules='commonRules.title'>
            <el-form-grid size="xmd">
              <el-input v-model.trim="appModel.title"/>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="文案：" prop="innerContent" :rules='commonRules.innerContent'>
            <el-form-grid size="xmd">
              <el-input v-model.trim="appModel.innerContent"/>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="封面图：" prop="image">
            <el-form-grid class="company-upload">
              <el-upload
                class="avatar-uploader"
                :action="$api.core.sgUploadFile('test')"
                accept=".jpg,.jpeg,.png,.bmp,.gif"
                :on-success="handleAppAvatarSuccess" :show-file-list="false" >
                <img v-if="appModel.image" :src="appModel.image" class="company-upload__avatar">
                <Icon  v-else type="plus" className="company-upload__tip"/>
              </el-upload>
            </el-form-grid>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="onCloseAnnex(3),onCloseHandleModel(3)">取消</ns-button>
        <ns-button @click="onSubmitAnnex(3)" type="primary">确定</ns-button>
      </div>
    </el-dialog>
    <!-- 渠道弹框 -->
    <el-dialog ref="channelDialog" width="320px" :visible.sync="channelModel.visible" title="选择渠道">
        <el-form ref="channelForm"
          label-width="100px"
          placement="right">
          <el-select v-model="channelModel.channelId" placeholder="请选择">
              <el-option
                v-for="item in channelList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <ns-button @click="channelModel.visible = false">取消</ns-button>
          <ns-button @click="selectChannel" type="primary">确定</ns-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import Edit from './src/edit.js'
export default Edit
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
        color: vavr(--theme-color-primary);
        background: var(--welcome-background-color-blue);
        .welcome-square__icon {
          color: var(--theme-color-primary);
        }
      }
      @e active {
        color: vavr(--theme-color-primary);
        background: var(--welcome-background-color-blue);
        color: var(--theme-color-primary);
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
