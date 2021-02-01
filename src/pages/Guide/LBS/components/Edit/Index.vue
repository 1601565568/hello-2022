<template>
  <el-form label-width='100px' label-position='left' ref='searchform' class='normal-from common-container' :model='model' :rules="rules"  size='medium'>
    <page-edit>
      <template slot='header'>
        <div class='common-header flex-box'>
          <h3>{{title}}</h3>
          <div class='common-btn'>
            <!-- <ns-button class='customer-btn_cancel' size='large' :loading='btnLoad' @click='handleCancel'>取消</ns-button> -->
            <ns-button class='customer-btn_save' type="primary" size='large' @click='update' :loading='btnLoad'>保存</ns-button>
          </div>
        </div>
      </template>
      <template slot='content'>
        <!-- 基础信息 start -->
        <recruitment-collapse title='基本信息'>
          <template slot='collapse-left'>
            <el-form-item label='活动名称' required prop='name' class='larger-item'>
              <length-input v-model='model.name' placeholder="请输入活动名称，长度20个字符以内" :length='20'  :disabled='isStating'/>
            </el-form-item>
            <el-form-item label='参与门店' prop='shopList'>
              <div class='flex-box form-item_toptext'>
                <span>会根据客户位置信息，自动推荐最近门店群聚合码</span>
              </div>
              <html-area>
                <div class='employee-list'>
                  <div v-if='model.shopList.length>0' class='employee-text active'>
                   已选{{model.shopList.length}}个门店
                  </div>
                  <template v-else>
                    <p class='employee-text'>请选择参与活动的门店</p>
                  </template>
                </div>
                <template slot='suffix'>
                  <div class='employee-suffix'>
                    <NsShopDialog :selfBtn='true' :appendToBody='true' :isButton="false" :validNull="true" :auth="false"   btnTitle="" type='icon' dialogTitle="选择门店" v-model="model.shopList" @inputAllData="handleChangeGuide">
                       <template slot='btnIcon'>
                        <Icon type="geren"></Icon>
                      </template>
                    </NsShopDialog>
                  </div>
                </template>
              </html-area>
            </el-form-item>
            <el-form-item label='有效时间' required prop='validTimeType'>
              <div class='form-item_toptext'>
                <el-radio v-model="model.validTimeType" :label="1">固定时间</el-radio>
                <el-radio v-model="model.validTimeType" :label="0">永久有效</el-radio>
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
            <el-form-item label='活动海报' required prop='activityPoster'>
              <drap-upload tip='（建议：宽度750像素，高度不限，小于1M，jpg、png、jpeg格式）' v-model='model.activityPoster' :maxWidth='750' :showPont='false'>
              </drap-upload>
            </el-form-item>
          </template>
          <template slot='collapse-right'>
            <div>
              <div class='user-content_bg' v-if='!model.activityPoster'>你还未上传活动海报</div>
              <div class="upload-content_lbs" v-if='!model.activityPoster'>
                <drap-upload v-model='model.activityPoster' :maxWidth='750' :showPont='false' :drag='false'>
                </drap-upload>
                上传海报图
              </div>
            </div>
          </template>
        </recruitment-collapse>
         <!-- 基础信息 end -->
        <!-- 引导页设置 start -->
        <recruitment-collapse title='招募链接卡片配置' phoneBar='加入门店群'>
          <template slot='collapse-left'>
            <el-form-item label='海报' required prop='welcomePoster'>
              <drap-upload tip='（建议：宽度750像素，高度不限，小于1M，jpg、png、jpeg格式）' v-model='model.welcomePoster' :maxWidth='750'>
                <template slot='footer'>
                  <p class='prompt-text'>场景说明：招募流程开启关注公众号，消费者注册会员后，将进入此页面关注公众号</p>
                </template>
              </drap-upload>
            </el-form-item>
          </template>
          <template slot='collapse-right'>
            <div class='search-bar'>
              <Icon type="ns-search-copy" slot="suffix" class='search-icon' @click="handleSearch"></Icon>
              <span class='search-bar_text'>搜索您最近的门店</span>
            </div>
            <div v-if='!model.welcomePoster'>
              <div class='user-content_bg' >你还未上传活动海报</div>
              <div class="upload-content_lbs">
                <drap-upload v-model='model.welcomePoster' :maxWidth='750' :showPont='false' :drag='false'>
                </drap-upload>
                上传海报图
              </div>
            </div>
          </template>
        </recruitment-collapse>
        <!-- 引导页设置 end -->
        <!-- 群聚合码设置 start -->
        <recruitment-collapse title='引导关注公众号页设置' phoneBar='加入门店群'>
          <template slot='collapse-left'>
            <el-form-item label='背景图' required prop='mpFollowBackground'>
              <drap-upload tip='（请上传格式为jpg或png图片，图片尺寸为750*1206,大小不超过1M）' :maxWidth='750' :maxHeight='1206' v-model='model.mpFollowBackground' :maxSize='1' :resetImage='defaultImg'>
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
        <!-- 群聚合码设置 end -->
      </template>
    </page-edit>
  </el-form>
</template>
<script>
import Index from './src/index'
import ElUpload from '@nascent/nui/lib/upload'
import VueDragResize from 'vue-drag-resize'
import HtmlArea from '@/components/NewUi/HtmlArea'
import RecruitmentCollapse from '@/components/NewUi/RecruitmentCollapse'
import LengthInput from '@/components/NewUi/LengthInput'
import PageEdit from '@/components/NewUi/PageEdit'
import DrapUpload from '@/components/NewUi/DrapUpload'
import ElImage from '@nascent/nui/lib/image'
import NsShopDialog from '@/components/NsShopDialog'
Index.components = {
  ElUpload, VueDragResize, RecruitmentCollapse, LengthInput, PageEdit, DrapUpload, ElImage, NsShopDialog, HtmlArea
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
   .form-item_tip {
    background: #F2F9FE;
    border-radius: 2px;
    padding: 9px 16px;
    font-size: 14px;
    color: #595959;
    line-height: 22px;
    margin-bottom: 25px;
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
  .employee-text {
    font-size: 14px;
    color: #BFBFBF;
    padding-bottom: 8px;
    &.active {
      color: #262626;
    }
  }
  .employee-list {
    display: flex;
    padding: 8px  0 0 8px;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .form-item_time {
    display: flex;
    padding: 16px;
    background: #F5F5F5;
    border-radius: 2px;
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
  }
  .search-bar {
    display: flex;
    background-color: #fff;
    align-items: center;
    justify-content: center;
    height: 40px;
    color: rgb(187,187,187);
    margin: -1px;
    .search-bar_text {
       color: rgb(141,141,141);
       margin-left: 10px;
    }
  }
</style>
<style scoped>
.form-item_time {
  >>> .el-form-item__label:before {
    display: none !important ;
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
  padding: 0;
}
.upload-content_lbs >>> .poster-set_content {
  display: none
}
</style>
