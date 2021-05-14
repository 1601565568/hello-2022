<template>
  <el-form label-width='100px' label-position='left' ref='searchform' class='normal-from common-container' :model='model' :rules="rules"  size='medium' @submit.native.prevent>
    <page-edit>
      <template slot='header'>
        <div class='common-header flex-box'>
          <h3>新建红包封面</h3>
          <div class='common-btn'>
            <ns-button class='customer-btn_cancel' size='large' :loading='btnLoad' @click='handleCancel(listPath)'>取消</ns-button>
            <ns-button class='customer-btn_save' type="primary" size='large' @click='update(submitApi)' :loading='btnLoad'>保存</ns-button>
          </div>
        </div>
      </template>
      <template slot='content'>
        <!-- 红包封面配置 start -->
        <recruitment-collapse title='红包封面配置' phoneTitle=''>
          <template slot='collapse-left'>
            <el-form-item label='封面名称' required prop='name' class='larger-item'>
              <length-input v-model='model.name' placeholder="请输入封面名称，长度10个字符以内" :length='10'/>
            </el-form-item>
            <el-form-item label='红包背景图' required prop='background' ref='imgItem'>
              <drap-upload tip='（建议：750*1334像素，小于1M，jpg、png、jpeg格式）' v-model='model.background' :maxWidth='750' :maxHeight='1334' :showPont='false' :showFooter='false' :maxSize='1'>
              </drap-upload>
              <ns-button type='text' style='margin-top:16px' @click='handleDownload'>下载设计模板</ns-button>
            </el-form-item>
          </template>
          <template slot='collapse-right'>
            <div class='preview-img'>
              <RedPacket :bgImage='model.background'/>
            </div>
          </template>
          <template slot='collapse-right__bottom'>
            <p class='collapse-right__bottom'>好友领红包封面预览图</p>
          </template>
        </recruitment-collapse>
         <!-- 红包封面配置 end -->
      </template>
    </page-edit>
  </el-form>
</template>
<script>
import Index from './src/edit'
import RecruitmentCollapse from '@/components/NewUi/RecruitmentCollapse'
import LengthInput from '@/components/NewUi/LengthInput'
import DrapUpload from '@/components/NewUi/DrapUpload'
import PageEdit from '@/components/NewUi/PageEdit'
import RedPacket from '../components/RedPacket'
Index.components = {
  RecruitmentCollapse, LengthInput, PageEdit, DrapUpload, RedPacket
}
export default Index
</script>
<style lang="scss" scoped>
  @import "@components/NewUi/styles/reset.css";
  .preview-img {
    width: 100%;
    height: 100%;
    font-size: 30px;
  }
  .collapse-right__bottom {
    text-align: center;
  }
</style>
