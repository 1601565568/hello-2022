<template>
  <div class="customer-container">
    <div class='customer-header flex-box'>
      <h3>{{editType}}裂变大师活动</h3>
      <div class='customer-btn'>
        <ns-button class='customer-btn_cancel' size='large' :loading='btnLoad' @click='handleCancel'>取消</ns-button>
        <ns-button class='customer-btn_save' type="primary" size='large' @click='handleSave' :loading='btnLoad'>保存</ns-button>
      </div>
    </div>
    <el-row class="customer-box" v-loading="customerLoading">
      <el-col :span='16' class="customer-edit">
        <el-form label-width="100px" label-position='left' :model="model" size='medium' class='normal-from' :rules="rules" ref="ruleForm">
        <el-collapse class='customer-collapse' v-model='collapseList'>
          <el-collapse-item title="活动基础信息" :name="1">
            <el-form-item label='活动名称' required prop='name' class='larger-item'>
              <length-input v-model='model.name' placeholder="请输入名称" :length='20'  :disabled='isStating'/>
            </el-form-item>
            <el-form-item label='参加活动人员' prop='guideIds'>
              <div class='flex-box form-item_toptext'>
                <span>选择的员工可以在企微侧边栏使用该裂变大师活动</span>
                <span class='form-item_toptext__length'>已选<span>{{model.guideIds.length}}</span>人</span>
              </div>
              <html-area>
                <div class='employee-list'>
                  <template v-if='model.guideDatas.length>0'>
                    <template v-for='(item,index) in model.guideDatas'>
                      <div class='employee-list_item' :key='item.id'>
                        {{item.name}}
                        <i class="el-icon-close" @click="handleDelect(index)"></i>
                      </div>
                    </template>
                    <span class='employee-list_all' v-if='model.guideDatas.length>0'>
                      <i class="el-icon-close" @click="handleDelectAll()"></i>
                    </span>
                  </template>
                  <template v-else>
                    <p class='employee-text'>请选择可以在企微侧边栏使用该活动裂变大师的员工</p>
                  </template>
                </div>
                <template slot='suffix'>
                  <div class='employee-suffix'>
                    <NsGuideDialog :selfBtn='true' :appendToBody='true' :isButton="false" :validNull="true" :auth="false"   btnTitle="" type='text' dialogTitle="选择员工" v-model="model.guideIds" @inputAllData="handleChangeGuide">
                       <template slot='selfBtn'>
                        <Icon type="geren"></Icon>
                      </template>
                    </NsGuideDialog>
                  </div>
                </template>
              </html-area>
            </el-form-item>
            <el-form-item label='有效时间' required prop='validTimeType'>
              <div class='form-item_toptext'>
                <el-radio v-model="model.validTimeType" :label="1"  :disabled='isStating'>固定时间</el-radio>
                <el-radio v-model="model.validTimeType" :label="0"  :disabled='isStating'>永久有效</el-radio>
              </div>
              <div class='form-item_time' v-if='model.validTimeType === 1'>
                <div>时间范围</div>
                <el-form-item label-width="8px" label=' '  prop='time' hide-required-asterisk>
                  <el-date-picker
                    v-model="model.time"
                    type="datetimerange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    range-separator="至"
                    start-placeholder="请选择开始日期"
                    end-placeholder="请选择结束日期"
                    :default-time="['00:00:00','23:59:59']"
                    align="right">
                  </el-date-picker>
                </el-form-item>
              </div>
            </el-form-item>
            <el-form-item label='活动说明' required prop='activityDescription'>
              <div class='form-item_toptext'>
                活动说明会显示在推广大师的查询页面
              </div>
              <length-input type="textarea"  :disabled='isStating' v-model='model.activityDescription' placeholder="请输入活动说明" :length='1000'/>
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item title='企微互动内容' :name="2">
            <div class='form-item_tip'>
              通过裂变大师添加进来的好友，会自动收到活动介绍和活动海报
            </div>
            <el-form-item label='活动介绍' required prop='activityIntroduction' :rules="[
              { required: true, message: '请输入活动介绍', trigger: ['blur', 'change'] },
              { validator: validates.validateActivityIntroduction.bind(this, activityIntroductionLength), trigger: ['blur', 'change'] }
            ]">
              <div class='flex-box form-item_toptext'>
                <div class='form-item_exmple__content'>
                  <span>活动介绍不知道怎么写？</span>
                  <el-popover
                    placement="bottom-start"
                    popper-class='form-item_popover'
                    width="480"
                    v-model='popoverShow'
                    trigger="click">
                    <span class='form-item_exmple' slot="reference" @click.native='handleChangePopoverShow(true)'>查看示例</span>
                    <template>
                      <div class='popover-title'>
                        活动介绍示例
                        <ns-button type='text' @click.native='handleSynch' :disabled='isStating'>同步到文本框</ns-button>
                      </div>
                      <div>
                        你好， (好友微信昵称) , 我是（员工微信昵称）恭喜你成功参与本次福利活动，分享下方海报，邀请好友扫码助力，添加（员工微信昵称）为好友：邀请5位好友为你助力并添加好友，即可领取奖品！奖品限量100份，先到先得哦！<br/>
                        活动有效期：2020-03-03~2020-03-13 <br/>
                        点击以下链接可查询助力进展哦！（推广大师查询链接）<br/>
                        注册会员也可享受会员专属礼哦 <br/>
                        点击立即入会：（招募链接）<br/>
                        快去分享你的专属海报 ↓↓
                      </div>
                    </template>
                  </el-popover>
                </div>
              </div>
              <tag-area v-model='model.activityIntroduction' :disabled='isStating' tag="wise" ref="tagAreaText" :maxlength="1000" :tools='tools' placeholder="请输入活动介绍" @inputLength="inputLength" :showEmoji='true' :showTextEmoji='true'/>
              <!-- 选择品牌Dialog -->
              <NsBrandDialog :visible.sync="brandDialogVisible" @confirm="insertBrandId"/>
            </el-form-item>
            <el-form-item label='活动海报' required prop='backgroundPic'>
              <div class='poster-content'>
                <!-- <el-upload
                  class="upload-demo"
                  ref='upload'
                  drag
                  accept=".jpg,.jpeg,.png"
                  :action="$api.core.sgUploadFile('test')"
                  :on-remove='handleRemove'
                  :before-upload="beforeUpload"
                  :disabled='isStating'
                  :file-list='fileList'
                  :on-success="handleUploadSuccess">
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                  <div class="el-upload__tip" slot="tip">（上传限制：750*1334像素，小于1M，jpg、png、jpeg格式）</div>
                </el-upload> -->
                <drap-upload tip='（请上传格式为jpg、jpeg或png的图片，大小不超过1M）' v-model='model.backgroundPic' :maxWidth='750' :maxHeight='1334' :showPont='false' :maxSize='1' :isNeedCrop='true' :showFooter='false'>
                </drap-upload>
                <div class='poster-set_content'>
                  <el-form-item label='推广人信息：' size='mini'>
                    <el-row>
                      <el-col :span='12'>
                        <el-checkbox v-model="model.headPortrait"  :disabled='isStating'>显示推广人头像、昵称</el-checkbox>
                      </el-col>
                      <el-col :span='12'>
                        <el-form-item label='字体颜色：' label-width='80px'>
                          <el-color-picker v-model='model.nickColour' :disabled='isStating'></el-color-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span='12'>
                        <el-form-item label='头像样式：' label-width='80px' class='scope-row_headIcon'>
                          <el-radio v-model="model.headPortraitShape" :label="1" :disabled='isStating'>
                            <div :class='"square logo-type "+(model.headPortraitShape===1?"active":"")'></div>
                          </el-radio>
                          <el-radio v-model="model.headPortraitShape" :label="0" :disabled='isStating'>
                            <div :class='"circle logo-type "+(model.headPortraitShape===0?"active":"")'></div>
                          </el-radio>
                        </el-form-item>
                      </el-col>
                      <el-col :span='12'>
                        <el-form-item label='样式：' label-width='50px'>
                          <el-radio v-model="model.headerType" :label="0" :disabled='isStating'>
                            竖排
                          </el-radio>
                          <el-radio v-model="model.headerType" :label="1" :disabled='isStating'>
                            横排
                          </el-radio>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </div>
              </div>
            </el-form-item>
            <el-form-item required prop='effectiveCycle' :disabled='false' class='larger-item'>
              <template slot='label' class='larger-item_icon'>
                <span>过期设置</span>
                <el-tooltip content="因企业微信生成联系我二维码数量限制，请合理设置过期时间"  placement="top">
                  <Icon type="question-circle" class='question-circle' />
                </el-tooltip>
              </template>
              <el-input-number style='width:118px;' size="medium" v-model="model.effectiveCycle" controls-position="right" :min="1" :step='1' step-strictly controls onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input-number>天内未邀请到新的好友 裂变大师二维码过期
              <!-- <el-input style='width:88px;' v-model='model.effectiveCycle' onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" type="number"/>  -->
              <p class='prompt-text'><span class='yellow-point'></span>因企业微信生成联系我二维码数量限制，请合理设置过期时间</p>
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item title='奖励机制' :name="3">
            <SetPrize v-if="!customerLoading" :prizeModel='prizeModel' :isStating='isStating' :isSetPrize="isSetPrize" ref="setPrize"/>
          </el-collapse-item>
        </el-collapse>
        </el-form>
      </el-col>
      <el-col :span='8' class="customer-mobile">
        <h2>活动海报效果展示</h2>
        <div class='customer-mobile_box'>
          <div class='customer-mobile_content' :style='{backgroundImage:"url("+model.backgroundPic+")"}'>
            <div :class='"user-content "+(model.headerType === 0?"vertical":"align")' v-if='model.headPortrait'>
              <!-- <img/> -->
              <img :style='{borderRadius:model.headPortraitShape===1?"4px":"50%"}' class="user-content_img" src='./Images/touxiang.png'/>
              <!-- <Icon type="icon-huiyuan"  :style='{borderRadius:model.headPortraitShape===1?"4px":"50%"}' class="user-content_img"></Icon> -->
              <div class='user-content_name' :style='{color:model.nickColour}'>推广人昵称</div>
            </div>
            <div class='user-content_bg' v-if='!model.backgroundPic'>你还未上传裂变大师背景图</div>
            <div class="upload-content_lbs" v-if='!model.backgroundPic'>
              <drap-upload v-model='model.backgroundPic' :maxWidth='750'  :maxHeight='1334' :showPont='false' :drag='false' :isNeedCrop='true'>
              </drap-upload>
              上传背景图
            </div>
            <!-- <div class='user-content_bg' v-if='!model.backgroundPic'>你还未上传裂变大师背景图</div>
            <div class="upload-content" v-if='!model.backgroundPic'>
              <el-upload
                  class="upload-demo"
                  accept=".jpg,.jpeg,.png"
                  :show-file-list='false'
                  :action="$api.core.sgUploadFile('test')"
                  :before-upload="beforeUpload"
                  :on-success="handleUploadSuccess">
                </el-upload>
              上传背景图
            </div> -->
            <template v-if='isLoading'>
              <VueDragResize :isActive="!isStating" :isDraggable='!isStating' :isResizable='!isStating' :w="model.qrcodeSize" :h="model.qrcodeSize" :parentLimitation="true" :aspectRatio='true' :x='model.qrcodeX' :y='model.qrcodeY' @dragstop="onDragResize" @resizestop='onDragResize' :sticks="['tl','tr','bl','br']" >
                <img src='./Images/qrcode.png' style='width:100%;height:100%'>
              </VueDragResize>
            </template>
          </div>
        </div>
        <p class='customer-mobile_p'>1. 支持显示推广人头像、昵称，推广人昵称长度在1-15字之间，设计海报时请注意留空对应区域</p>
        <p class='customer-mobile_p'>2. 二维码支持调整大小及移动位置</p>
      </el-col>
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
import NsBrandDialog from '@/components/NsBrandDialog'
import DrapUpload from '@/components/NewUi/DrapUpload'

Edit.components = {
  LengthInput, HtmlArea, TagArea, ElUpload, ElColorPicker, VueDragResize, NsGuideDialog, ElInputNumber, SetPrize, NsBrandDialog, DrapUpload
}
export default Edit
</script>
<style lang="scss" scoped>
@import "./styles/reset.css";
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
  &::before {
    content: ' ';
    position: absolute;
    left: 66.666%;
    top:0;
    height: 100%;
    bottom:0;
    width: 1px;
    background: #E8E8E8;
  }
  .customer-edit {
    box-sizing: border-box;
    padding: 0 40px 44px 16px;
  }
  .customer-edit,.customer-mobile {
    max-height: calc( 100vh - 172px);
    overflow: auto;
    &::-webkit-scrollbar-thumb {
        display: none
    }
    &::-webkit-scrollbar-track {
        display: none
    }
    &::-webkit-scrollbar {
     display: none
      /*height: 4px;*/
    }
  }
  @media screen and ( max-width: 1625px ) {
    .customer-edit,.customer-mobile {max-height: calc( 100vh - 152px);}
  }
  .form-item_toptext {
    line-height: 22px;
    font-size: 12px;
    color: #595959;
    margin-bottom: 8px;
    .form-item_toptext__length {
      font-size: 14px;
      span {
        color: #0091fa
      }
    }
    >>> .el-radio {
      line-height: 21px;
    }
  }
  .employee-suffix {
    color:#BFBFBF;
  }
  .employee-list {
    display: flex;
    padding: 8px  0 0 8px;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .employee-list_item {
    display: inline-block;
    align-items: center;
    background: #F5f5f5;
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
    background: #F5F5F5;
    border-radius: 2px;
  }
  .form-item_tip {
    background: #F2F9FE;
    border-radius: 2px;
    padding: 9px 16px;
    font-size: 14px;
    color: #595959;
    line-height: 22px;
    margin-bottom: 25px;
  }
  .form-item_exmple {
    color: #0068B3;
    cursor: pointer;
  }
  .poster-content {
    padding: 16px;
    padding-bottom: 0;
    background-color: #F5F5F5;
    .poster-set_content {
      padding-top: 16px;
      position: relative;
      &::before {
        border-top:1px solid #E8E8E8;
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
    }

  }
  .logo-type {
    height: 24px;
    width: 24px;
    border: 1px solid #D9D9D9;
    background-color: #fff;
    display: inline-block;
    position: relative;
    top: -6px;
    &.active {
      border-color:#41a2e8;
    }
    &.circle{
      border-radius: 50%;
    }
    &.square{
      border-radius: 2px;
    }
  }
}
.customer-mobile {
  h2 {
    font-size: 16px;
    color: #262626;
    text-align: center;
    line-height: 24px;
    margin: 24px auto 8px;
  }
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
      background-repeat: no-repeat
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
        color: #f00
      }
    }
    .user-content_name {
      font-size: 14px;
      color: #262626;
    }
    &.vertical {
      padding-top: 40px;
      .user-content_img{
        display: block;
        margin: 0px auto 16px;
      }
      .user-content_name {
        text-align: center
      }
    }
    &.align {
      display: flex;
      align-items: center;
      padding-top: 40px;
      .user-content_img{
        display: block;
        margin: 0px 16px 0 24px;
      }
      .user-content_name {
        text-align: center
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
    left:24px;
    top: 228px;
    background: #FFFFFF;
    border: 1px solid #DCDFE6;
    border-radius: 2px;
    border-radius: 2px;
    text-align: center;
    .upload-demo {
      position: absolute;
      top:0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
}
.employee-text {
  font-size: 14px;
  color: #BFBFBF;
  padding-bottom: 8px;
}
.prompt-text {
  display: flex;
  align-items: center;
  .yellow-point {
    background: #F2AA18;
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
  >>> .el-radio {
    display: flex;
    float: left;
    padding-top: 4px;
  }
}
.user-content_img {
  height: 48px;
  width: 48px;
  border-radius: 4px;
  >>> & > path:first-child {
    color: rgb(217,217,217);
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
      top:0;
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
    left:24px;
    top: 228px;
    background: #FFFFFF;
    border: 1px solid #DCDFE6;
    border-radius: 2px;
    border-radius: 2px;
    text-align: center;
    &:hover {
      cursor: pointer;
      color: rgb(34,126,246);
      border:1px solid rgb(172,216,252)
    }
  }
  .upload-content_lbs >>> .upload-demo .el-upload {
  position: absolute;
  top:0;
  left: 0;
  right: 0;
  bottom: 0;
}
.upload-content_lbs >>> .poster-content{
  opacity: 0;
  padding: 0;
}
.upload-content_lbs >>> .el-upload-list {
  display: none;
}
.upload-content_lbs >>> .poster-set_content {
  display: none
}
</style>
