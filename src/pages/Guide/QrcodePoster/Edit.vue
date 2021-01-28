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
              <drap-upload tip='（上传限制：750*1334像素，小于2M，jpg、png、jpeg格式）' v-model='model.background' :maxWidth='750' :maxHeight='1334' :showPont='false' :maxSize='2'>
              </drap-upload>
            </el-form-item>
            <el-form-item label='二维码' required class='larger-item'>
              <el-radio-group v-model="model.type">
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
                <el-form-item label='添加占位符' required prop='background'  class='larger-item' :rules="[
                  { required: true, message: '请填写提示文案', trigger: ['blur', 'change'] },
                  { validator: validatesText.bind(this, textLength), trigger: ['blur', 'change'] }
                ]">
                  <div class='form-item_exmple__content'>
                    <span>官方限制，最多支持64位长度参数，若超出则二维码不带参数处理</span>
                  </div>
                  <tag-area v-model='model.sceneStr' tag="wise" ref="testText" :maxlength="64" :tools='tools' placeholder="请输入活动介绍" @inputLength='inputLength'/>
                </el-form-item>
              </div>
            </el-form-item>
          </template>
          <template slot='collapse-right'>
            <div class='chat-content' :style='{backgroundImage:"url("+model.background+")"}'>
              <VueDragResize :w="model.textW" :h='model.textW' :parentLimitation="true"  :x='model.textX' :y='model.textY' @dragstop="onDragResize" :aspectRatio='true' @resizestop='onDragResize' :sticks="['tl','tr','bl','br']">
                <img src='@/assets/qrcode.png' style='width:100%;height:100%'>
              </VueDragResize>
            </div>
          </template>
          <template slot='collapse-right__bottom'>
            <p class='collapse-right__bottom'>1. 二维码支持调整大小及移动位置</p>
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
Edit.components = {
  ElUpload, VueDragResize, RecruitmentCollapse, LengthInput, PageEdit, DrapUpload, ElImage, ElColorPicker, TagArea
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
</style>
