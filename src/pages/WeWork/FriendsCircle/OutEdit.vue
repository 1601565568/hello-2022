<template>
  <div class='out-content'>
    <el-form label-width='100px' label-position='left' ref='searchform' class='normal-from common-container' :model='model' :rules="rules"  size='medium'>
      <page-edit>
        <template slot='header'>
          <div class='common-header flex-box'>
            <h3>
              新建企业对外信息展示
              <el-tooltip  effect='light' popper-class='popperClass' placement="right-end">
                <Icon type="question-circle"  class='question-circle'/>
                <template slot='content'>
                  <img src='./images/qibaotip.png' class='tip-img'>
                </template>
              </el-tooltip>
            </h3>
            <div class='common-btn'>
              <ns-button class='customer-btn_cancel' size='large' :loading='btnLoad' @click='handleCancel'>取消</ns-button>
              <ns-button class='customer-btn_save' type="primary" size='large' @click='handleSave' :loading='btnLoad'>保存</ns-button>
            </div>
          </div>
        </template>
        <template slot='content'>
          <!-- 基础信息 start -->
          <recruitment-collapse title='基本信息' phoneTitle=''>
            <template slot='collapse-left'>
              <el-form-item label='对外信息名称' prop='name' class='larger-item'>
                <div class='gray-color'>
                  请确保输入的名称与企业微信后台配置的对外信息一致
                  <ns-button type='text' class='tip-text' @click='handlePreview(true,1)'>查看示例</ns-button>
                </div>
                <LengthInput v-model='model.name' :length='8' placeholder="最多8个字符" :disabled='isEdit' :textLength='textLength'/>
              </el-form-item>
              <el-form-item label='网页名称' prop='webTitle' class='larger-item'>
                <LengthInput v-model='model.webTitle' :length='12' placeholder="可自定义网页名称，最多12个字"/>
              </el-form-item>
              <el-form-item label='点击跳转' prop='style' class='larger-item'>
                <template slot='label' class='larger-item_icon'>
                  <span>点击跳转</span>
                  <!-- <Icon type="question-circle" class='question-circle item-icon' @click='handlePreview(true,2)'/> -->
                </template>
                <div class='link-content'>
                  <template v-for='item in linkData'>
                    <div :key='item.type' :class='`link-item ${item.type === model.style ? "active":""}`' @click='handleChangeType(item.type)'>
                      <img :src='item.img' class='preview-img'>
                      <el-radio v-model="model.style" class='preview-radio' :label='item.type'>{{item.title}}</el-radio>
                    </div>
                  </template>
                </div>
              </el-form-item>
              <template v-if='model.style === 0'>
                <el-form-item label='个性签名' prop='signature' class='larger-item'>
                  <div class='gray-color'>
                    可自定义个性签名
                    <el-tooltip  effect='light' popper-class='popperClass' placement="right-end">
                      <ns-button type='text' class='tip-text'>查看示例</ns-button>
                      <template slot='content'>
                        <img src='./images/pyq.jpg' class='tip-img'>
                      </template>
                    </el-tooltip>
                  </div>
                  <LengthInput v-model='model.signature' :length='30' placeholder="最多输入30个字"/>
                </el-form-item>
                <el-form-item label='朋友圈封面图' prop='topImgUrl' class='larger-item'>
                  <drap-upload tip='（建议：尺寸比例8:5，小于1M，格式为jpg、jpeg或png的图片）' :maxSize='1' v-model='model.topImgUrl' :showPont='false' :showFooter='false'>
                  </drap-upload>
                </el-form-item>
              </template>
            </template>
            <template slot='collapse-right'>
              <div class='phone-wrapper'>
                <img src='./images/qy.png'>
                <div class='edit-div'>
                  <div class='edit-key'>{{model.name?model.name.substring(0,8):''}}</div>
                  <div class='edit-value'>{{model.webTitle}}</div>
                </div>
              </div>
            </template>
            <template slot='collapse-right__bottom'>
              <p class='phone-tip'>客户看见的页面</p>
            </template>
          </recruitment-collapse>
        </template>
      </page-edit>
      <el-dialog
        title="示例"
        :visible.sync="previewVisin"
        custom-class='full-dialog'
        class='full-dialog'
        height='600px'
        width='1000px'>
        <div class='dialog-content'>
          <img :src='shili' class='full-img'>
        </div>
      </el-dialog>
    </el-form>
  </div>
</template>
<script>
import Index from './src/OutEdit'
import PageEdit from '@/components/NewUi/PageEdit'
import LengthInput from '@/components/NewUi/LengthInput'
import DrapUpload from '@/components/NewUi/DrapUpload'
import RecruitmentCollapse from '@/components/NewUi/RecruitmentCollapse'
Index.components = {
  PageEdit, LengthInput, RecruitmentCollapse, DrapUpload
}
export default Index
</script>
<style lang="scss" scoped>
  @import "@components/NewUi/styles/reset.css";
  .tip-text{
    color: #0094FC;
    cursor: pointer;
    font-size: 12px;
  }
  .phone-tip {
    text-align: center;
    font-size: 12px;
    color: #595959;
  }
  .tip-img {
    width: 352px;
  }
  .question-circle {
    color: #8C8C8C;
    &.item-icon {
      position: relative;
      margin-left:5px;
      top: 1px;
    }
  }
  .phone-wrapper {
    height: 569px;
    background-color: #fff;
    margin-left: -1px;
    margin-top: -1px;
    margin-right: -1px;
    position: relative;
    img {
      display: block;
      width: 100%
    }
    .edit-div {
      position: absolute;
      left: 3px;
      right: 3px;
      top: 347px;
      z-index: 99;
      height: 43px;
      display: flex;
      font-size: 16px;
      align-items: center;
      .edit-key,.edit-value {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }
      .edit-key {
        padding-left: 12px;
        width:107px;
      }
      .edit-value {
        width:200px;
        color: #8C8C8C;
        word-break: break-all;
      }
    }
  }
  .link-content {
    display: flex;
    justify-content: space-between;
    width: 100%;
    .link-item {
      width: 25%;
      cursor: pointer;
      .preview-img {
        display: block;
        width: 100%;
        margin: 0 auto 25px auto;
        border: 1px solid #E8E8E8;
      }
      .preview-radio {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      &.active {
        .preview-img {
          border-color:#0094FC
        }
      }
    }
  }
  .dialog-content {
    width: 100%;
    .full-img {
      width: 100%;
    }
  }
  .gray-color {
    color:#8C8C8C
  }
</style>
<style scoped>
.out-content >>> .full-dialog{
  padding-bottom: 20px;
  box-sizing: content-box;
}
</style>
