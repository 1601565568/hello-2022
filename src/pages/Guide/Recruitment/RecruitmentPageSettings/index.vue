<template>
  <el-form label-width='100px' label-position='left' ref='searchform' class='normal-from common-container' :model='model' :rules="rules"  size='medium'>
    <page-edit>
      <template slot='header'>
        <div class='common-header flex-box'>
          <h3>导购招募页面设置</h3>
          <div class='common-btn'>
            <!-- <ns-button class='customer-btn_cancel' size='large' :loading='btnLoad' @click='handleCancel'>取消</ns-button> -->
            <ns-button class='customer-btn_save' type="primary" size='large' @click='update' :loading='btnLoad'>保存</ns-button>
          </div>
        </div>
      </template>
      <template slot='content'>
        <!-- 导购招募海报配置 start -->
        <recruitment-collapse title='导购招募海报配置'>
          <template slot='collapse-left'>
            <el-form-item label='背景图' required prop='recruitingPostersImage'>
              <drap-upload tip='请上传格式为jpg、jpeg或png的图片，大小不超过1M' v-model='model.recruitingPostersImage' :maxWidth='750' :maxHeight='1334' :isNeedCrop='true' :maxSize='1'>
                <template slot='footer'>
                  <p class='prompt-text'>公司logo和招募码为固定位置，建议尺寸为70*70</p>
                  <p class='prompt-text'>logo获取导购后台-公司logo；门店名称和导购姓名动态获取当前导购的信息</p>
                </template>
              </drap-upload>
            </el-form-item>
          </template>
          <template slot='collapse-right'>
            <img :src='model.recruitingPostersImage' class='recruiting-posters__image'/>
            <div class="background_title"></div>
            <div class="background_content">长按识别二维码  添加专属导购</div>
            <div class="background_shop_guide">门店名称/导购名称</div>
            <div class="background_image">
              <ElImage
                :width="70" :height="70"
                :src="model.companyLogo||require('@/assets/groupLogo.png')"
                mode="fill" />
            </div>
            <div class="background_qrCode">
              <ElImage
                :width="132" :height="132"
                :src="require('@/assets/guide.png')"
                mode="fill" />
            </div>
          </template>
        </recruitment-collapse>
         <!-- 导购招募海报配置 end -->
        <!-- 招募链接卡片配置 start -->
        <recruitment-collapse title='招募链接卡片配置' phoneBar='内容预览'>
          <template slot='collapse-left'>
            <el-form-item label='标题' required prop='title'  class='larger-item'>
              <length-input v-model='model.title' :length='20' placeholder="请输入标题，长度在1-20个字符以内"/>
            </el-form-item>
            <el-form-item label='摘要' required prop='content'>
              <length-input type="textarea"  v-model='model.content' :length='50' placeholder="请输入摘要，长度在1-50个字符以内"/>
            </el-form-item>
            <el-form-item label='封面图' required prop='picture'>
              <drap-upload tip='（请上传格式为jpg或png图片，长宽比例为5:4,大小不超过10M）' :scale='1.25' scaleTip='5:4' v-model='model.picture' :isNeedCrop='true' :maxSize='10'>
                <template slot='footer'>
                  <p class='prompt-text'>场景说明：系统中招募链接，发送的消息卡片都根据设置的内容显示。如：门店招募、导购招募</p>
                </template>
              </drap-upload>
            </el-form-item>
          </template>
          <template slot='collapse-right'>
            <div class='chat-content'>
              <content-preview :title='model.title' :content='model.content' :picture='model.picture'/>
              <img src='@/assets/chat.png' class='chat-img'/>
            </div>
          </template>
        </recruitment-collapse>
        <!-- 招募链接卡片配置 end -->
        <!-- 引导关注公众号页设置 start -->
        <recruitment-collapse title='引导关注公众号页设置' v-if='model.mpFollowState === 1' phoneBar='关注我们'>
          <template slot='collapse-left'>
            <el-form-item label='背景图' required prop='mpFollowBackground'>
              <drap-upload tip='（请上传格式为jpg或png图片，图片尺寸为750*1206,大小不超过1M）' :maxWidth='750' :maxHeight='1206' v-model='model.mpFollowBackground' :maxSize='1' :resetImage='defaultImg' :isNeedCrop='true'>
                <template slot='footer'>
                  <p class='prompt-text'>场景说明：招募流程开启关注公众号，消费者注册会员后，将进入此页面关注公众号</p>
                </template>
              </drap-upload>
            </el-form-item>
          </template>
          <template slot='collapse-right'>
            <div class='mobile_content' :style='{backgroundImage:"url("+model.mpFollowBackground+")"}' v-if='model.mpFollowQrcodeSize || model.mpFollowQrcodeSize===0'>
              <VueDragResize :w="model.mpFollowQrcodeSize" :h="model.mpFollowQrcodeSize" :parentLimitation="true" :aspectRatio='true' :x='model.mpFollowQrcodeX' :y='model.mpFollowQrcodeY' @dragstop="onDragResize" @resizestop='onDragResize' :sticks="['tl','tr','bl','br']" >
                <img src='@/assets/qrcode.png' style='width:100%;height:100%'>
              </VueDragResize>
            </div>
          </template>
        </recruitment-collapse>
        <!-- 引导关注公众号页设置 end -->
      </template>
    </page-edit>
  </el-form>
</template>
<script>
import Index from './src/index'
import ElUpload from '@nascent/nui/lib/upload'
import VueDragResize from 'vue-drag-resize'
import RecruitmentCollapse from './components/RecruitmentCollapse'
import LengthInput from '@/components/NewUi/LengthInput'
import PageEdit from '@/components/NewUi/PageEdit'
import DrapUpload from '@/components/NewUi/DrapUpload'
import ElImage from '@nascent/nui/lib/image'
import ContentPreview from './components/ContentPreview'
Index.components = {
  ElUpload, VueDragResize, RecruitmentCollapse, LengthInput, PageEdit, DrapUpload, ContentPreview, ElImage
}
export default Index
</script>
<style lang="scss" scoped>
  @import "@components/NewUi/styles/reset.css";
  .common-collapse {
    margin-top: 16px;
  }
  .recruiting-collapse {
    padding-left: 16px;
    background-color: #fff;
  }
  .poster-set_content {
    display: flex;
    align-items: flex-start;
    padding: 16px 0;
    .yellow-point {
      display: inline-block;
      background: #F2AA18;
      height: 8px;
      width: 8px;
      border-radius: 50%;
      margin-right: 8px;
      line-height: 20px;
      position: relative;
      top: 6px;
    }
    .prompt-text {
      font-size: 12px;
      color: #595959;
      line-height: 20px;
    }
  }
  .recruiting-posters__image {
    width: 100%;
  }
  .mobile_content,.chat-content {
    width: 318px;
    height: 515px;
    margin: 0 auto;
    position: relative;
    background-size: cover;
    background-repeat: no-repeat
  }
  .chat-img {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%
  }
  .background_title{
    font-size: 10px;
    color: #fff;
    text-align: center;
    width: 294px;
    position: absolute;
    bottom: 415px;
    left: 13px;
    border-radius: 5px;
  }
  .background_content{
     font-size: 10px;
     color: #fff;
     text-align: center;
     width: 294px;
     position: absolute;
     bottom: 92px;
     left: 13px;
     border-radius: 5px;
   }
  .background_shop_guide{
    font-size: 10px;
    color: #fff;
    text-align: center;
    width: 294px;
    position: absolute;
    bottom: 78px;
    left: 13px;
    border-radius: 5px;
  }
  .background_image{
    text-align: center;
    width: 294px;
    position: absolute;
    bottom: 445px;
    left: 13px;
  }
  .background_qrCode{
     text-align: center;
     width: 294px;
     position: absolute;
     bottom: 188px;
     left: 13px;
   }
</style>
