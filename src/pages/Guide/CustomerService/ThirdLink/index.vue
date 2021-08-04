<template>
  <el-form label-width='100px' label-position='left' ref='form' class='normal-from common-container' :model='model' :rules="rules"  size='medium'>
    <page-edit>
      <template slot='header'>
        <div class='common-header flex-box'>
          <h3>第三方关联链接配置</h3>
          <div class='common-btn'>
            <ns-button class='customer-btn_save' type="primary" size='large' @click='onSave' :loading='btnLoad'>保存</ns-button>
          </div>
        </div>
      </template>
      <template slot='content'>
        <recruitment-collapse title='关联成功页面' :phoneBar='`关联${platform.name}帐号`' :disabled='true'>
          <template slot='collapse-left'>
            <el-form-item label='背景图' required prop='background'  class='larger-item'>
              <drap-upload tip='（请上传格式为jpg或png图片，图片尺寸为750*1206,大小不超过10M）' v-model='model.background' :maxWidth='750' :maxHeight='1206' :showPont='false' :isNeedCrop='true' :maxSize='10'>
                <template slot='footer'>
                  <div class='flex-box hot-ware'>
                    <Icon type="ns-edit" class='set-ware icon' @click='handleSetHot'/>
                    <span class='set-ware' @click='handleSetHot'>设置图片热区</span>
                    <span class='ware-num' v-if='model.hotZoneData.length'>已设置{{model.hotZoneData.length}}个热区</span>
                  </div>
                </template>
              </drap-upload>
            </el-form-item>
            <el-form-item label='提示文案' required prop='text' class='larger-item' :rules="[
              { required: true, message: '请填写提示文案', trigger: ['blur', 'change'] },
              { validator: validatesText.bind(this, textLength), trigger: ['blur', 'change'] }
            ]">
              <div class='form-item_exmple__content'>
                <span>客户{{platform.name}}昵称较长时提示文案可能出现换行，请注意拖动时页面排版问题</span>
              </div>
              <tag-area v-model='model.text' tag="wise" ref="testText" :maxlength="30" :tools='tools' placeholder="请输入活动介绍" @inputLength='inputLength'/>
            </el-form-item>
            <el-form-item label='字体颜色' required prop='fontColor'>
              <el-color-picker v-model="model.fontColor"></el-color-picker>
            </el-form-item>
          </template>
          <template slot='collapse-right'>
            <div class='chat-content' :style='{"background-image":`url(${model.background})`}'>
              <VueDragResize axis="y" :isResizable='false' :w="model.textW" :h='model.textH' :parentLimitation="true"  :x='model.textX' :y='model.textY' @dragstop="onDragResize">
                <div class='drag-text' :style="{color:model.fontColor}">{{htmlText}}</div>
              </VueDragResize>
            </div>
          </template>
        </recruitment-collapse>
      </template>
    </page-edit>
    <HotAreaDialog :data="model.hotZoneData" :url='model.background' :hotVisible='hotVisible' v-if="hotVisible" @handleCancel="handleCancel" @setHotData="setHotData"/>
  </el-form>
</template>
<script>
import Index from './src/index'
import ElUpload from '@nascent/nui/lib/upload'
import VueDragResize from 'vue-drag-resize'
import RecruitmentCollapse from '@/components/NewUi/RecruitmentCollapse'
import LengthInput from '@/components/NewUi/LengthInput'
import PageEdit from '@/components/NewUi/PageEdit'
import ElColorPicker from '@nascent/nui/lib/color-picker'
import DrapUpload from '@/components/NewUi/DrapUpload'
import ElImage from '@nascent/nui/lib/image'
import TagArea from '@/components/NewUi/TagArea'
import HotAreaDialog from '@/components/NewUi/HotAreaDialog'
Index.components = {
  ElUpload, VueDragResize, RecruitmentCollapse, LengthInput, PageEdit, DrapUpload, ElImage, ElColorPicker, TagArea, HotAreaDialog
}
export default Index
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
  height: 515px;
  margin: 0 auto;
  position: relative;
  background-size: cover;
  background-repeat: no-repeat
}
.drag-text {
  word-break: break-all;
  text-align: center;
}
</style>
