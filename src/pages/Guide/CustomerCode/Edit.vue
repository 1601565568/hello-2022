<template>
  <div class="customer-container">
    <div class="customer-header flex-box">
      <h3>{{ editType }}裂变大师活动</h3>
      <div class="customer-btn">
        <ns-button
          class="customer-btn_cancel"
          size="large"
          :loading="btnLoad"
          @click="handleCancel"
          >取消</ns-button
        >
        <ns-button
          class="customer-btn_save"
          type="primary"
          size="large"
          @click="handleSave"
          :loading="btnLoad"
          >保存</ns-button
        >
      </div>
    </div>
    <el-row class="customer-box">
      <el-col :span="16" class="customer-edit">
        <el-form
          label-width="100px"
          label-position="left"
          :model="model"
          size="medium"
          class="normal-from"
          :rules="rules"
          ref="ruleForm"
        >
          <el-collapse class="customer-collapse" v-model="collapseList">
            <el-collapse-item title="活动基础信息" :name="1">
              <el-form-item
                label="活动名称"
                required
                prop="name"
                class="larger-item"
              >
                <length-input
                  v-model="model.name"
                  placeholder="请输入名称"
                  :length="20"
                />
              </el-form-item>
              <el-form-item label="参加活动人员" prop="guideIds">
                <div class="flex-box form-item_toptext">
                  <span>选择的员工可以在企微侧边栏使用该裂变大师活动</span>
                  <span class="form-item_toptext__length"
                    >已选<span>{{ model.guideIds.length }}</span
                    >人</span
                  >
                </div>
                <html-area>
                  <div class="employee-list">
                    <template v-if="model.guideDatas.length > 0">
                      <template v-for="(item, index) in model.guideDatas">
                        <div class="employee-list_item" :key="item.id">
                          {{ item.name }}
                          <i
                            class="el-icon-close"
                            @click="handleDelect(index)"
                          ></i>
                        </div>
                      </template>
                      <span
                        class="employee-list_all"
                        v-if="model.guideDatas.length > 0"
                      >
                        <i class="el-icon-close" @click="handleDelectAll()"></i>
                      </span>
                    </template>
                    <template v-else>
                      <p class="employee-text">
                        请选择可以在企微侧边栏使用该活动裂变大师的员工
                      </p>
                    </template>
                  </div>
                  <template slot="suffix">
                    <div class="employee-suffix">
                      <NsGuideDialog
                        :selfBtn="true"
                        :appendToBody="true"
                        :isButton="false"
                        :validNull="true"
                        :auth="false"
                        btnTitle=""
                        type="text"
                        dialogTitle="选择员工"
                        v-model="model.guideIds"
                        @inputAllData="handleChangeGuide"
                      >
                        <template slot="selfBtn">
                          <Icon type="geren"></Icon>
                        </template>
                      </NsGuideDialog>
                    </div>
                  </template>
                </html-area>
              </el-form-item>
              <el-form-item label="有效时间" required prop="validTimeType">
                <div class="form-item_toptext">
                  <el-radio
                    v-model="model.validTimeType"
                    :label="1"
                    :disabled="isStating"
                    >固定时间</el-radio
                  >
                  <el-radio
                    v-model="model.validTimeType"
                    :label="0"
                    :disabled="isStating"
                    >永久有效</el-radio
                  >
                </div>
                <div class="form-item_time" v-if="model.validTimeType === 1">
                  <div>时间范围</div>
                  <el-form-item
                    label-width="8px"
                    label=" "
                    prop="time"
                    hide-required-asterisk
                  >
                    <el-date-picker
                      v-model="model.time"
                      type="datetimerange"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      range-separator="至"
                      start-placeholder="请选择开始日期"
                      end-placeholder="请选择结束日期"
                      :default-time="['00:00:00', '23:59:59']"
                      align="right"
                    >
                    </el-date-picker>
                  </el-form-item>
                </div>
              </el-form-item>
              <el-form-item
                label="分享二维码过期设置"
                required
                prop="effectiveCycle"
              >
                <div class="qrcode-top-view">
                  <input type="number" class="number-view"  v-model="model.effectiveCycle" @input="inputEffectiveCycle"/>
                  天内未邀请到新的好友，分享二维码将失效，推广大师可重新下载
                </div>
                <div class="qrcode-bottom-view">
                  <span class="remind-view"></span>
                  因企业微信生成联系我二维码数量限制，请合理设置过期时间
                </div>
              </el-form-item>
            </el-collapse-item>
          </el-collapse>
        </el-form>
      </el-col>
    </el-row>
    <el-row class="customer-box">
      <el-form
          label-width="100px"
          label-position="left"
          :model="model"
          size="medium"
          class="normal-from"
          :rules="rules"
          ref="ruleForm1"
        >
          <el-collapse class="customer-collapse customer-edit" v-model="collapseList">
            <el-collapse-item title="活动页面装修" :name="2">
              <el-col :span="16" class="active-phone-view">
                <ColorView v-model="showColor" ref="colorView"/>
                <div class="form-item_tip" style="margin-bottom:0">
                  活动页面将根据下面排列顺序显示
                </div>
                <el-collapse v-model="editBaseList">
                  <template v-for="(item, index) in eidtList">
                    <div :class="(index === 2 || index === 4) ? 'hidden-common-collapse': 'common-collapse'" :key="index">
                      <el-collapse-item
                        :key="index"
                        :name="index"
                      >
                        <template slot="title">
                          <div class="edit-view" @click="onShowEdit(item.itemCode)">
                            <div>
                              {{ item.itemName }}
                            </div>
                            <div class="edit-switch" @click="onclick(item.itemCode)">
                              <el-switch active-color="#0091FA" inactive-color="#8C8C8C" v-model="item.status" :active-value="1" :inactive-value="0" :disabled="isStating && item.itemCode ==='reward'"></el-switch>
                            </div>
                          </div>
                        </template>
                        <div class="edit-body">
                          <div class="noEdit" v-if="item.status === 0">
                            开启后可编辑内容
                          </div>
                          <component :is="formatSettingType(item.itemCode)"
                          @updateActiveModel="updateActiveModel"
                          v-model="pageObj"
                          :prizeModel="prizeModel"
                          :isStating="isStating"
                          :isSetPrize="isSetPrize"
                          @scrollPhone="scrollPhone"
                          ref="componentList"
                          ></component>
                        </div>
                      </el-collapse-item>
                    </div>
                  </template>
                </el-collapse>
              </el-col>
              <el-col :span="8">
                <ActivePhone :pageObj.sync="pageObj" :showColor="showColor" :eidtList.sync="eidtList" :model.sync="model" ref="activePhone"/>
              </el-col>
            </el-collapse-item>
          </el-collapse>
        </el-form>
    </el-row>
    <el-row class="customer-box">
       <el-form
          label-width="100px"
          label-position="left"
          :model="model"
          size="medium"
          class="normal-from"
          :rules="rules"
          ref="ruleForm2"
        >
        <el-collapse class="customer-collapse customer-edit" v-model="collapseList">
          <el-collapse-item title="裂变海报" :name="3">
            <el-col :span="16">
              <div class="form-item_tip">
                裂变大师可分享海报，邀请好友添加员工企业微信。
              </div>
              <el-form-item label="上传海报" required>
                <div class="poster-content">
                  <el-form-item prop="backgroundPic">
                    <drap-upload
                      tip="（请上传格式为jpg、jpeg或png的图片，大小不超过2M）"
                      v-model="model.backgroundPic"
                      :maxWidth="750"
                      :maxHeight="1334"
                      :showPont="false"
                      :maxSize="2"
                      :isNeedCrop="true"
                      :showFooter="false"
                      uploadTitle="点击或拖拽上传活动海报"
                      :disabled="isStating"
                      :showDelImg="!isStating"
                    >
                  </drap-upload>
                  </el-form-item>
                  <div class="poster-set_content">
                    <!-- <div class="row-view">裂变大师信息：</div> -->
                    <div class="row-view">显示裂变大师头像、昵称：
                      <el-radio
                        v-model="model.headPortrait"
                        :label="1"
                        :disabled="isStating"
                      >显示
                      </el-radio>
                      <el-radio
                        v-model="model.headPortrait"
                        :label="0"
                        :disabled="isStating"
                      >不显示
                      </el-radio>
                      <span style="margin-left:16px">昵称颜色：</span>
                      <el-color-picker
                        v-model="model.nickColour"
                        :disabled="isStating"
                      ></el-color-picker>
                    </div>
                    <div class="row-view">
                      <span>头像框样式：</span>
                      <el-radio
                        v-model="model.headPortraitShape"
                        :label="1"
                        :disabled="isStating"
                      >方形
                      </el-radio>
                      <el-radio
                        v-model="model.headPortraitShape"
                        :label="0"
                        :disabled="isStating"
                      >圆形
                      </el-radio>
                      <span style="margin-left:16px">排版样式：</span>
                        <el-radio
                          v-model="model.headerType"
                          :label="0"
                          :disabled="isStating"
                        >
                          竖排
                        </el-radio>
                        <el-radio
                          v-model="model.headerType"
                          :label="1"
                          :disabled="isStating"
                        >
                          横排
                        </el-radio>
                    </div>
                  </div>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="customer-mobile">
              <div class="customer-mobile_box">
                <div
                  class="customer-mobile_content"
                  :style="{ backgroundImage: 'url(' + model.backgroundPic + ')' }"
                >
                  <div
                    :class="
                      'user-content ' +
                        (model.headerType === 0 ? 'vertical' : 'align')
                    "
                    v-if="model.headPortrait"
                  >
                    <img
                      :style="{
                        borderRadius: model.headPortraitShape === 1 ? '4px' : '50%'
                      }"
                      class="user-content_img"
                      src="./Images/touxiang.png"
                    />
                    <div
                      class="user-content_name"
                      :style="{ color: model.nickColour }"
                    >
                      裂变大师昵称
                    </div>
                  </div>
                  <div class="user-content_bg" v-if="!model.backgroundPic">
                    你还未上传裂变大师背景图
                  </div>
                  <div class="upload-content_lbs" v-if="!model.backgroundPic">
                    <drap-upload
                      v-model="model.backgroundPic"
                      :maxWidth="750"
                      :maxHeight="1334"
                      :showPont="false"
                      :drag="false"
                      :isNeedCrop="true"
                    >
                    </drap-upload>
                    上传背景图
                  </div>
                  <template v-if="isLoading">
                    <VueDragResize
                      :isActive="!isStating"
                      :isDraggable="!isStating"
                      :isResizable="!isStating"
                      :w="model.qrcodeSize"
                      :h="model.qrcodeSize"
                      :parentLimitation="true"
                      :aspectRatio="true"
                      :x="model.qrcodeX"
                      :y="model.qrcodeY"
                      @dragstop="onDragResize"
                      @resizestop="onDragResize"
                      :sticks="['tl', 'tr', 'bl', 'br']"
                    >
                      <img src="./Images/qrcode.png" style="width:100%;height:100%" />
                    </VueDragResize>
                  </template>
                </div>
              </div>
              <p class="customer-mobile_p">
                1.
                支持显示裂变大师头像、昵称，裂变大师昵称长度在1-15字之间，设计海报时请注意留空对应区域
              </p>
              <p class="customer-mobile_p">2. 二维码支持调整大小及移动位置</p>
            </el-col>
          </el-collapse-item>
        </el-collapse>
      </el-form>
    </el-row>
    <el-row class="customer-box">
      <el-form
        label-width="100px"
        label-position="left"
        :model="model"
        size="medium"
        class="normal-from"
        :rules="rules"
        ref="ruleForm3"
      >
      <el-collapse class="customer-collapse customer-edit" v-model="collapseList">
        <el-collapse-item title="裂变欢迎语" :name="4">
          <el-col :span="16">
            <div class="form-item_tip">
              通过裂变大师添加的好友，会收到欢迎语和活动卡片。好友进入活动卡片后，可分享活动邀请好友。
            </div>
            <el-form-item
              label="欢迎语"
              required
              prop="activityIntroduction"
            >
              <tag-area
                v-model="model.activityIntroduction"
                tag="wise"
                ref="tagAreaText"
                className="tagAreaText"
                :maxlength="1000"
                :tools="tools"
                placeholder="请输入活动介绍"
                @inputLength="inputLength"
                :showEmoji="true"
                :showTextEmoji="true"
                :isShowDefault="true"
                @showDefaultText="showDefaultText"
              />
            </el-form-item>
            <el-form-item
              label="活动卡片"
              required
            >
              <div class="goods-view">
                <div class="input-view">
                  <el-form-item prop="cardTitle">
                    <length-input
                      v-model="model.cardTitle"
                      placeholder="请输入标题"
                      :length="20"
                    />
                  </el-form-item>
                  <div style="height:16px"></div>
                  <el-form-item prop="cardCopywriting">
                    <length-input
                      v-model="model.cardCopywriting"
                      placeholder="请输入文案"
                      :length="50"
                    />
                  </el-form-item>
                </div>
                <el-form-item prop="cardCoverPic">
                  <drap-upload
                    tip="（请上传格式为jpg、jpeg或png的图片，建议长宽比例为1:1，大小不超过2M）"
                    v-model="model.cardCoverPic"
                    :showPont="false"
                    :maxSize="2"
                    :isNeedCrop="false"
                    :showFooter="false"
                  >
                  </drap-upload>
                </el-form-item>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <Welcome :url="model.cardCoverPic" :title="model.cardTitle" :detail="model.cardCopywriting" :info="model.activityIntroduction"/>
          </el-col>
        </el-collapse-item>
      </el-collapse>
      </el-form>
    </el-row>
  </div>
</template>
<script>
import Edit from './src/Edit'
import LengthInput from '@/components/NewUi/LengthInput'
import HtmlArea from '@/components/NewUi/HtmlArea'
import TagArea from '@/components/NewUi/TagArea'
import ElUpload from '@nascent/nui/lib/upload'
import ElColorPicker from '@nascent/nui/lib/color-picker'
import VueDragResize from 'vue-drag-resize'
import NsGuideDialog from '@/components/NsGuideDialog'
import ElInputNumber from '@nascent/nui/lib/input-number'
import SetPrize from './components/SetPrize'
import DrapUpload from '@/components/NewUi/DrapUpload'
import HeadImg from './components/HeadImg'
import Banner from './components/Banner'
import Active from './components/Active'
import Register from './components/Register'
import Rules from './components/Rules'
import Share from './components/Share'
import ColorView from './components/ColorView'
import Welcome from './components/Welcome'
import ActivePhone from './components/ActivePhone'
Edit.components = {
  LengthInput,
  HtmlArea,
  TagArea,
  ElUpload,
  ElColorPicker,
  VueDragResize,
  NsGuideDialog,
  ElInputNumber,
  SetPrize,
  DrapUpload,
  HeadImg,
  Banner,
  Active,
  Register,
  Share,
  Rules,
  ColorView,
  Welcome,
  ActivePhone
}
export default Edit
</script>
<style lang="scss" scoped>
@import './styles/reset.css';
@import './styles/leftview.css';
.active-phone-view {
  max-height: 800px;
  overflow: scroll;
   &::-webkit-scrollbar-thumb {
    display: none;
  }
  &::-webkit-scrollbar-track {
    display: none;
  }
  &::-webkit-scrollbar {
    display: none;
  }
}
.customer-header {
  background-color: #fff;
  margin: -10px -10px 0;
  padding: 16px;
  min-width: 1046px;
  h3 {
    font-size: 16px;
    color: #262626;
    font-weight: bold;
  }
}
.customer-box {
  margin-top: 16px;
  background-color: #fff;
  min-width: 1046px;
  // &::before {
  //   content: ' ';
  //   position: absolute;
  //   left: 66.666%;
  //   top: 0;
  //   height: 100%;
  //   bottom: 0;
  //   width: 1px;
  //   background: #e8e8e8;
  // }
  @media screen and (max-width: 1625px) {
    .customer-edit,
    .customer-mobile {
      // max-height: calc(100vh - 152px);
    }
  }
  .form-item_toptext {
    line-height: 22px;
    font-size: 12px;
    color: #595959;
    margin-bottom: 8px;
    .form-item_toptext__length {
      font-size: 14px;
      span {
        color: #0091fa;
      }
    }
    >>> .el-radio {
      line-height: 21px;
    }
  }
  .employee-suffix {
    color: #bfbfbf;
  }
  .employee-list {
    display: flex;
    padding: 8px 0 0 8px;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .employee-list_item {
    display: inline-block;
    align-items: center;
    background: #f5f5f5;
    margin-right: 4px;
    margin-bottom: 8px;
    height: 24px;
    line-height: 24px;
    padding: 0 8px;
    border-radius: 12px;
    font-size: 14px;
    i {
      margin-left: 4px;
      cursor: pointer;
      display: inline;
    }
  }
  .form-item_time {
    display: flex;
    padding: 16px;
    background: #f5f5f5;
    border-radius: 2px;
  }
  .form-item_tip {
    background: #f2f9fe;
    border-radius: 2px;
    padding: 9px 16px;
    font-size: 14px;
    color: #595959;
    line-height: 22px;
    margin-bottom: 25px;
  }
  .form-item_exmple {
    color: #0068b3;
    cursor: pointer;
  }
  .poster-content {
    padding: 16px;
    padding-bottom: 0;
    background-color: #f5f5f5;
    .poster-set_content {
      position: relative;
      &::before {
        border-top: 1px solid #e8e8e8;
        position: absolute;
        left: -16px;
        right: -16px;
        top: 0;
        content: ' ';
      }
      >>> .el-col {
        margin-bottom: 24px;
      }
      >>> .el-radio {
        margin-right: 0;
      }
      .row-view {
        font-size: 14px;
        color: #595959;
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 40px;
      }
    }
  }
  .logo-type {
    height: 24px;
    width: 24px;
    border: 1px solid #d9d9d9;
    background-color: #fff;
    display: inline-block;
    position: relative;
    top: -6px;
    &.active {
      border-color: #41a2e8;
    }
    &.circle {
      border-radius: 50%;
    }
    &.square {
      border-radius: 2px;
    }
  }
}
.customer-edit {
  box-sizing: border-box;
  padding: 0 40px 0px 16px;
}
.customer-edit,
.customer-mobile {
  // max-height: calc(100vh - 172px);
  // overflow: auto;
  &::-webkit-scrollbar-thumb {
    display: none;
  }
  &::-webkit-scrollbar-track {
    display: none;
  }
  &::-webkit-scrollbar {
    display: none;
    /*height: 4px;*/
  }
}
.customer-mobile {
  padding-bottom: 20px;
  .customer-mobile_box {
    width: 346px;
    height: 664px;
    margin: 0 auto 4px;
    background-image: url(./Images/iphone7.png);
    margin-bottom: 4px;
    padding-top: 47px;
    .customer-mobile_content {
      width: 318px;
      height: 567px;
      margin: 0 auto;
      position: relative;
      background-size: cover;
      background-repeat: no-repeat;
    }
  }
  .customer-mobile_p {
    font-size: 12px;
    color: #595959;
    line-height: 20px;
    width: 253px;
    margin: 0 auto;
  }
  .user-content {
    .user-content_img {
      height: 48px;
      width: 48px;
      border-radius: 4px;
      >>> & > path {
        color: #f00;
      }
    }
    .user-content_name {
      font-size: 14px;
      color: #262626;
    }
    &.vertical {
      padding-top: 40px;
      .user-content_img {
        display: block;
        margin: 0px auto 16px;
      }
      .user-content_name {
        text-align: center;
      }
    }
    &.align {
      display: flex;
      align-items: center;
      padding-top: 40px;
      .user-content_img {
        display: block;
        margin: 0px 16px 0 24px;
      }
      .user-content_name {
        text-align: center;
      }
    }
  }
  .user-content_bg {
    font-size: 14px;
    color: #262626;
    text-align: center;
    position: absolute;
    left: 0;
    right: 0;
    top: 190px;
  }
  .upload-content {
    position: absolute;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: #303133;
    width: 272px;
    left: 24px;
    top: 228px;
    background: #ffffff;
    border: 1px solid #dcdfe6;
    border-radius: 2px;
    border-radius: 2px;
    text-align: center;
    .upload-demo {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
}
.employee-text {
  font-size: 14px;
  color: #bfbfbf;
  padding-bottom: 8px;
}
.prompt-text {
  display: flex;
  align-items: center;
  .yellow-point {
    background: #f2aa18;
    display: inline-block;
    height: 8px;
    width: 8px;
    border-radius: 50%;
    margin-right: 8px;
  }
}
.question-circle {
  position: relative;
  top: 1px;
  left: 5px;
}
.qrcode-top-view {
  display: flex;
  flex-direction: row;
  height: 32px;
  font-size: 14px;
  color: #595959;
  .number-view {
    width: 88px;
    height: 32px;
    background: #ffffff;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    margin-right: 8px;
  }
}
.qrcode-bottom-view {
  display: flex;
  flex-direction: row;
  height: 32px;
  font-size: 12px;
  color: #595959;
  align-items: center;
  .remind-view {
    width: 8px;
    height: 8px;
    background: #f2aa18;
    border-radius: 50%;
    display: inline-block;
    margin-right: 8px;
  }
}
.edit-view {
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-between;
  width: 100%;
  padding-left: 40px;
}
.edit-body {
  position: relative;
  .noEdit {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #fff;
    left: 0;
    top: 0;
    z-index: 10;
    opacity: 0;
    transition: opacity 0.5s;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    font-size: 14px;
    color: #595959;
  }
  &:hover .noEdit {
    opacity: 0.85;
  }
}
</style>
<style scoped>
.poster-content {
  .poster-set_content {
    >>> .el-col {
      margin-bottom: 12px;
    }
    >>> .el-radio {
      margin-right: 4px;
    }
  }
}
.form-item_time {
  >>> .el-form-item__label:before {
    display: none !important ;
  }
}
.scope-row_headIcon {
  padding-bottom: 16px;
}
.user-content_img {
  height: 48px;
  width: 48px;
  border-radius: 4px;
  >>> & > path:first-child {
    color: rgb(217, 217, 217);
  }
  >>> & > path {
    color: #fff;
  }
}
.upload-content {
  >>> .el-upload {
    width: 100%;
    height: 100%;
  }
  >>> .el-upload__input {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
.employee-list_all {
  display: inline-block;
  height: 18px;
  line-height: 18px;
  color: #fff;
  width: 18px;
  text-align: center;
  border-radius: 50%;
  background: #8c8c8c;
  margin-top: 3px;
  cursor: pointer;
}
.popover-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}
.user-content_bg {
  font-size: 14px;
  color: #262626;
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 190px;
}
.upload-content_lbs {
  position: absolute;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  color: #303133;
  width: 272px;
  left: 24px;
  top: 228px;
  background: #ffffff;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  border-radius: 2px;
  text-align: center;
  &:hover {
    cursor: pointer;
    color: rgb(34, 126, 246);
    border: 1px solid rgb(172, 216, 252);
  }
}
.upload-content_lbs >>> .upload-demo .el-upload {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.upload-content_lbs >>> .poster-content {
  opacity: 0;
  padding: 0;
}
.upload-content_lbs >>> .el-upload-list {
  display: none;
}
.upload-content_lbs >>> .poster-set_content {
  display: none;
}
.goods-view {
  background: #F5F5F5;
  .input-view {
    padding: 16px 16px 0 16px;
  }
}
</style>
