<template>
  <el-form label-width='100px' label-position='left' ref='form' class='normal-from common-container' :model='model' :rules="rules"  size='medium'>
    <page-edit>
      <template slot='header'>
        <div class='common-header flex-box'>
          <h3>{{editType}}二维码海报</h3>
          <div class='common-btn'>
            <ns-button class='customer-btn_save' size='large' @click='onCancel' :loading='btnLoad'>取消</ns-button>
            <ns-button class='customer-btn_save' type="primary" size='large' @click='onSave' :loading='btnLoad'>保存</ns-button>
          </div>
        </div>
      </template>
      <template slot='content'>
        <recruitment-collapse title='基础信息' :disabled='true'>
          <template slot='collapse-left'>
            <el-form-item label='海报名称' required prop='title'  class='larger-item'>
               <length-input v-model='model.title' placeholder="请输入海报名称" :length='20'  :disabled='isStating'/>
            </el-form-item>
            <el-form-item label='海报背景图' required prop='background'  class='larger-item'>
              <drap-upload tip='请上传格式为jpg、jpeg或png的图片，大小不超过2M' v-model='model.background' :maxWidth='750' :maxHeight='1334' :showPont='false' :maxSize='2' :isNeedCrop='true'>
              </drap-upload>
            </el-form-item>
            <el-form-item label='二维码' required class='larger-item'>
              <el-radio-group v-model="model.type" :class="[fuscous==='QA'?fuscousQA:fuscousIcon]">
                <el-radio :label="1">公众号</el-radio>
              </el-radio-group>
              <div class="qrcode-content">
                <el-form-item label='公众号' required prop='appId'  class='larger-item'>
                  <el-select v-model="model.appId" placeholder="请选择公众号">
                    <el-option
                      v-for="item in weChatOfficialAccounts"
                      :key="item.appId"
                      :label="item.nickName"
                      :value="item.appId">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label='添加占位符' prop='background'  class='larger-item' :rules="[
                  { validator: validatesText.bind(this, textLength), trigger: ['blur', 'change'] }
                ]">
                  <div class='form-item_exmple__content'>
                    <span>官方限制，最多支持64位长度参数，若超出则二维码不带参数处理</span>
                     <!-- <el-popover
                      placement="bottom-start"
                      popper-class='form-item_popover'
                      title="活动介绍示例"
                      width="480"
                      trigger="click">
                      <span class='form-item_exmple' slot="reference">查看示例</span>
                      <template>
                        <div>
                          你好， (好友微信昵称) , 我是（导购微信昵称）恭喜你成功参与本次福利活动，分享下方海报，邀请好友扫码助力，添加（员工微信昵称）为好友：邀请5位好友为你助力并添加好友，即可领取奖品！奖品限量100份，先到先得哦！<br/>
                          活动有效期：2020-03-03~2020-03-13 <br/>
                          点击以下链接可查询助力进展哦！（推广大师查询链接）<br/>
                          注册会员也可享受会员专属礼哦 <br/>
                          点击立即入会：（招募链接）<br/>
                          快去分享你的专属海报 ↓↓
                        </div>
                      </template>
                    </el-popover> -->
                  </div>
                  <tag-area v-model='model.sceneStr' tag="wise" ref="tagAreaText" :maxlength="64" :tools='tools' placeholder="请输入活动介绍" @inputLength='inputLength' :class="[fuscous==='QA'?fuscousQA:fuscousIcon]"/>
                </el-form-item>
              </div>
              <!-- 选择品牌Dialog -->
              <NsBrandDialog :visible.sync="brandDialogVisible" @confirm="insertBrandId"/>
            </el-form-item>
          </template>
          <template slot='collapse-right'>
            <div class='chat-content' :style='{backgroundImage:"url("+model.background+")"}'>
              <template v-if='isLoading'>
                <VueDragResize :w="model.textW" :h='model.textW' :parentLimitation="true"  :x='model.textX' :y='model.textY' @dragstop="onDragResize" :aspectRatio='true' @resizestop='onDragResize' :sticks="['tl','tr','bl','br']">
                  <img src='@/assets/qrcode.png' style='width:100%;height:100%'>
                </VueDragResize>
              </template>
            </div>
          </template>
          <template slot='collapse-right__bottom'>
            <p class='collapse-right__bottom'>1. 二维码支持调整大小及移动位置</p>
            <p class='collapse-right__bottom'>2. 发送的二维码有效期为30天</p>
          </template>
        </recruitment-collapse>
      </template>
    </page-edit>
  </el-form>
</template>
<script>
import Edit from './src/Edit'
import ElUpload from '@nascent/nui/lib/upload'
import VueDragResize from 'vue-drag-resize'
import RecruitmentCollapse from '@/components/NewUi/RecruitmentCollapse'
import LengthInput from '@/components/NewUi/LengthInput'
import PageEdit from '@/components/NewUi/PageEdit'
import ElColorPicker from '@nascent/nui/lib/color-picker'
import DrapUpload from '@/components/NewUi/DrapUpload'
import ElImage from '@nascent/nui/lib/image'
import TagArea from '@/components/NewUi/TagArea'
import NsBrandDialog from '@/components/NsBrandDialog'

Edit.components = {
  ElUpload,
  VueDragResize,
  RecruitmentCollapse,
  LengthInput,
  PageEdit,
  DrapUpload,
  ElImage,
  ElColorPicker,
  TagArea,
  NsBrandDialog
}
export default Edit
</script>
<style lang="scss" scoped>
@import "@components/NewUi/styles/reset.css";
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
}
.hot-ware {
  .set-ware {
    font-size: 14px;
    color: #0068B3;
    line-height: 22px;
    cursor: pointer;
    user-select: none;
    &.icon {
      margin-right: 8px;
    }
  }
  .ware-num {
    font-size: 12px;
    color: #8C8C8C;
    line-height: 20px;
    margin-left: 16px;
  }
}
.chat-content {
  width: 318px;
  height: 567px;
  margin: 0 auto;
  position: relative;
  background-size: cover;
  background-repeat: no-repeat
}
.qrcode-content {
  border: 1px solid #D9D9D9;
  border-radius: 2px;
  padding: 16px;
}
.drag-text {
  word-break: break-all;
  text-align: center;
}
.collapse-right__bottom {
  font-size: 12px;
  color: #595959;
  text-align: center;
}
.form-item_exmple__content {
  display: flex;
  justify-content: space-between;
  .form-item_exmple {
    color: #0068B3;
    cursor: pointer;
  }
}
</style>
<style scoped>
.fuscousQA>>>.el-radio__input.is-checked .el-radio__inner{
  border-color: #2153D4;
  background-color: #2153D4;
}
.fuscousIcon>>>.el-radio__input.is-checked .el-radio__inner{
  border-color: rgb(0, 145, 250);
  background-color: rgb(0, 145, 250);
}
.fuscousQA>>>.el-radio__input.is-checked + .el-radio__label{
color: #2153D4;
}
.fuscousIcon>>>.el-radio__input.is-checked + .el-radio__label{
color: rgb(0, 145, 250);
}
.fuscousQA >>> wise{
  color: #2153D4;
}
.fuscousIcon >>> wise{
  color: rgb(0, 145, 250);
}
</style>
