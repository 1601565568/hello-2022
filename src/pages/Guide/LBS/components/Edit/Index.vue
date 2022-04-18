<template>
  <el-form label-width='100px' label-position='left' ref='searchform' class='normal-from common-container' :model='model' :rules="rules"  size='medium'>
    <page-edit>
      <template slot='header'>
        <div class='common-header flex-box'>
          <h3>{{title}}</h3>
          <div class='common-btn'>
            <ns-button class='customer-btn_cancel' size='large' :loading='btnLoad' @click='handleCancel'>取消</ns-button>
            <ns-button class='customer-btn_save' type="primary" size='large' @click='update' :loading='btnLoad'>保存</ns-button>
          </div>
        </div>
      </template>
      <template slot='content'>
        <!-- 基础信息 start -->
        <recruitment-collapse title='基本信息' phoneTitle=''>
          <template slot='collapse-left'>
            <el-form-item label='活动名称' required prop='name' class='larger-item'>
              <length-input v-model='model.name' placeholder="请输入活动名称，长度20个字符以内" :length='20'/>
            </el-form-item>
            <el-form-item label='参与门店' prop='shopIdList'>
              <div class='flex-box form-item_toptext'>
                <span>{{shopTip}}</span>
              </div>
              <html-area>
                <div class='employee-list'>
                  <div v-if='model.shopIdList.length>0' class='employee-text active'>
                   已选{{model.shopIdList.length}}个门店
                  </div>
                  <template v-else>
                    <p class='employee-text'>请选择参与活动的门店</p>
                  </template>
                </div>
                <template slot='suffix'>
                  <div class='employee-suffix'>
                    <!-- <NsShopDialog :selfBtn='true' :appendToBody='true' :isButton="false" :validNull="true" :auth="false"   btnTitle="" type='icon' dialogTitle="选择门店" v-model="model.shopIdList" @input="handleChangeShopList">
                       <template slot='btnIcon'>
                        <Icon type="shop" class='shop-icon'></Icon>
                      </template>
                    </NsShopDialog> -->
                    <shopSelect @callBack="handleChangeShopList" :hasShopArr="model.shopIdList" shopStatus='1,-1' isDIYBtn penetrate=1>
                      <template slot='btnIcon'>
                        <Icon type="shop" class='shop-icon'></Icon>
                      </template>
                    </shopSelect>
                  </div>
                </template>
              </html-area>
            </el-form-item>
            <el-form-item label='有效时间' required prop='timeType'>
              <div class='form-item_toptext' :class="[messageQA==='QA'?radioboxQA:radiobox]">
                <el-radio v-model="model.timeType" :label="1" :disabled='isStating'>固定时间</el-radio>
                <el-radio v-model="model.timeType" :label="2" :disabled='isStating'>永久有效</el-radio>
              </div>
              <div class='form-item_time' v-if='model.timeType === 1'>
                <div>时间范围</div>
                <el-form-item label-width="8px" label=' '  prop='time' hide-required-asterisk>
                  <!-- <el-date-picker
                    v-model="model.time"
                    type="datetimerange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    range-separator="至"
                    start-placeholder="请选择开始日期"
                    end-placeholder="请选择结束日期"
                    :default-time="['00:00:00','23:59:59']"
                    align="right">
                  </el-date-picker> -->
                  <ns-datetime type="datetime" :clearable="false"
                                 :sameDay="true"
                                 v-model="model.time"
                                 start-placeholder="请选择开始日期"
                                 range-separator="至"
                                 end-placeholder="请选择结束日期"
                                 value-format="yyyy-MM-dd HH:mm:ss"
                                 :default-time="['00:00:00','23:59:59']"
                                 :startDisabled="isStating"
                                 :class="{}">
                    </ns-datetime>
                </el-form-item>
              </div>
            </el-form-item>
            <el-form-item label='活动海报' required prop='activityPoster'>
              <drap-upload tip='请上传格式为jpg、jpeg或png的图片，大小不超过1M' v-model='model.activityPoster' :maxWidth='750' :maxHeight='1334' :showPont='false' :showFooter='false' :isNeedCrop='true' :maxSize='1'>
              </drap-upload>
            </el-form-item>
          </template>
          <template slot='collapse-right'>
            <div class='preview-img' :style='{backgroundImage: `url(${model.activityPoster})`}'>
              <div class='user-content_bg' v-if='!model.activityPoster'>你还未上传活动海报</div>
              <div class="upload-content_lbs" v-if='!model.activityPoster'>
                <drap-upload v-model='model.activityPoster' :maxWidth='750' :maxHeight='1334' :showPont='false' :drag='false' :isNeedCrop='true'>
                </drap-upload>
                上传海报图
              </div>
              <VueDragResize v-if='loadOver' :w="model.activityQrcodeWidth" :h="model.activityQrcodeWidth" :parentLimitation="true" :aspectRatio='true' :x='model.activityPositionX' :y='model.activityPositionY' @dragstop="onDragPosterResize" @resizestop='onDragPosterResize' :sticks="['tl','tr','bl','br']" >
                <img src='@/assets/qrcode.png' style='width:100%;height:100%'>
              </VueDragResize>
            </div>
          </template>
        </recruitment-collapse>
         <!-- 基础信息 end -->
        <!-- 消费者进群页面设置 start -->
        <SimpleCollapse  :title='groupTip'>
          <PhoneBox class='first-phone' title='01 引导页设置' :phoneBar='phoneTitle' phoneTitle='' showBottom>
            <template slot='collapse-left'>
              <el-form-item label='海报' required prop='welcomePoster'>
                <drap-upload tip='建议：宽度750像素，高度不限，jpg、jpeg或png的图片，小于1M' v-model='model.welcomePoster' :maxSize='1'>
                  <template slot='footer'>
                    <p class='prompt-text'>{{welcomePosterTip}}</p>
                  </template>
                </drap-upload>
              </el-form-item>
            </template>
            <template slot='collapse-right'>
              <div class='search-bar'>
                <Icon type="ns-search" slot="suffix" class='search-icon'></Icon>
                <span class='search-bar_text'>搜索您最近的门店</span>
              </div>
              <div class='preview-img short-img' :style='{backgroundImage: `url(${model.welcomePoster})`}'>
                <div v-if='!model.welcomePoster'>
                  <div class='user-content_bg' >你还未上传活动海报</div>
                  <div class="upload-content_lbs">
                    <drap-upload v-model='model.welcomePoster' :showPont='false' :drag='false'>
                    </drap-upload>
                    上传海报图
                  </div>
                </div>
              </div>
            </template>
          </PhoneBox>
          <PhoneBox :title='groupSet' :phoneBar='phoneTitle' phoneTitle=''>
            <template slot='collapse-left'>
              <!-- 群聚合码设置 start -->
              <template v-if='type === "Group"'>
                <div class='form-item_tip' :class="[messageQA==='QA'?fuscousQA:fuscousIcon]">
                  消费者进入此活动页面后，根据定位位置自动推荐最近门店的群聚合码，客户可扫码入群<br />
                  群满后会根据以下规则自动创建新群
                </div>
                <div class='step-content'>
                  <div class='step-name'>Step1：</div>
                  <div class='step-value'>引导店长创建门店群</div>
                  <div class='step-tip'>
                    <el-tooltip  placement="top" popper-class='popperClass'>
                      <Icon type="question-circle" class='question-circle_detail'/>
                      <template slot='content'>
                        <p class='popperClass'>店长收到创建群通知</p>
                      </template>
                    </el-tooltip>
                  </div>
                </div>
                <el-form-item label='群名称规则' required prop='roomRule'>
                  <div class='form-item_toptext'>
                  将同步店长端显示，提示店长群名称格式规范
                  </div>
                  <length-input :disabled='isStating' type="textarea"  v-model='model.roomRule' placeholder="请输入群名称提示，长度50个字符以内" :length='50'/>
                </el-form-item>
                <div class='step-content'>
                  <div class='step-name'>Step2：</div>
                  <div class='step-value'>根据门店群自动创建群聚合码</div>
                  <div class='step-tip'>
                    <el-tooltip  placement="top" popper-class='popperClass'>
                      <Icon type="question-circle" class='question-circle_detail'/>
                      <template slot='content'>
                        <p class='popperClass'>自动创建的群聚合码不会显示在群聚合码列表</p>
                      </template>
                    </el-tooltip>
                  </div>
                </div>
                <el-form-item label='自动建群名称' prop='roomBaseName' :rules="[
                  { validator: validateActivityIntroduction.bind(this, roomBaseNameLength), trigger: ['blur', 'change'] }
                ]">
                  <div class='form-item_toptext'>
                    将以原群主身份自动创建新群，如未设置，自动新建的群名称为初始群名称
                  </div>
                  <tag-area v-model='model.roomBaseName' tag="wise" ref="testText" :maxlength="50" :tools='tools' placeholder="请输入自动建群名称，长度40个字符以内" @inputLength="inputLength"/>
                </el-form-item>
                <el-form-item label='自动建群序号' prop='roomBaseId'>
                  <el-input-number :disabled='isStating' style='width:118px;' size="medium" v-model="model.roomBaseId" controls-position="right" :min="1" :step='1' step-strictly controls onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input-number>
                  <!-- <el-input style='width:88px;' v-model='model.effectiveCycle' onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" type="number"/>  -->
                  <p class='prompt-text'><span class='yellow-point'></span>自动创建的群聊按照序号开始依次生成，如“广州客户群1”，请输入1-100的正整数</p>
                </el-form-item>
                <el-form-item label='自动移除群' class='larger-item'>
                  <template slot='label' class='larger-item_icon'>
                    <span>自动移除群</span>

                    <el-tooltip content=""  placement="top">
                      <div slot="content">
                        <span>企微接口限制，单个群码聚合超过100个群时，无法自动创建新群</span><br/>
                        <span>请输入1-200的正整数，群聚合码达到100个群时，聚合码中会移除超过该人数的群聊（不会解散群）</span>
                      </div>
                      <Icon type="question-circle" class='question-circle' />
                    </el-tooltip>
                  </template>
                  <div style='display:flex;'>
                    当群聚合超的群过100个群时，自动移除 <div class='cha'></div>
                    <el-form-item prop='roomUserNum'>
                      <el-input-number :disabled='isStating' style='width:118px;margin-top:-6px;' size="medium" v-model="model.roomUserNum" controls-position="right" :min="1" :step='1' step-strictly controls onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input-number>
                    </el-form-item><div class='cha'></div>人以上群聊
                  </div>
                </el-form-item>
                <div class='step-content'>
                  <div class='step-name'>Step3：</div>
                  <div class='step-value'>群二维码海报配置</div>
                  <div class='step-tip'>
                    <el-tooltip  placement="top" popper-class='popperClass'>
                      <Icon type="question-circle"  class='question-circle_detail'/>
                      <template slot='content'>
                        <p class='popperClass'>消费者选择定位后，展示此海报和对应的群聚合码</p>
                      </template>
                    </el-tooltip>
                  </div>
                </div>
              </template>
              <!-- 群聚合码设置 end -->
              <!-- 好友聚合码设置 start -->
              <template v-if='type === "Friends"'>
                <div class='form-item_tip' :class="[messageQA==='QA'?fuscousQA:fuscousIcon]">
                  消费者进入此活动页面后，根据定位位置自动推荐最近门店的企微聚合码，客户可扫码添加企业员工为好友
                </div>
                <div class='step-content'>
                  <div class='step-name'>Step1：</div>
                  <div class='step-value'>聚合二维码海报配置</div>
                  <div class='step-tip'>
                    <el-tooltip  placement="top" popper-class='popperClass'>
                      <Icon type="question-circle"  class='question-circle_detail'/>
                      <template slot='content'>
                        <p class='popperClass'>设置门店的企微聚合码</p>
                      </template>
                    </el-tooltip>
                  </div>
                </div>
                <el-form-item label='聚合码设置' required prop='qrcodeType'  class='larger-item' :class="[messageQA==='QA'?radioboxQA:radiobox]">
                  <el-radio-group v-model="model.qrcodeType">
                    <el-radio :label="1">门店全部员工</el-radio>
                    <el-radio :label="2">仅店长</el-radio>
                  </el-radio-group>
                  <p class='prompt-text'><span class='yellow-point'></span>聚合码最多添加100人，超过时将自动截取</p>
                </el-form-item>
                <div class='step-content'>
                  <div class='step-name'>Step2：</div>
                  <div class='step-value'>二维码海报配置</div>
                  <div class='step-tip'>
                    <el-tooltip  placement="top" popper-class='popperClass'>
                      <Icon type="question-circle"  class='question-circle_detail'/>
                      <template slot='content'>
                        <p class='popperClass'>消费者选择定位后，展示此海报和开启的企微聚合码</p>
                      </template>
                    </el-tooltip>
                  </div>
                </div>
              </template>
              <!-- 好友聚合码设置 end -->
              <el-form-item label='海报背景' required prop='qrcodePoster'>
                <drap-upload v-model='model.qrcodePoster' tip='请上传格式为jpg、jpeg或png的图片，大小不超过1M' :maxWidth='750' :maxHeight='1334' :showPont='false' :showFooter='false'  :isNeedCrop='true' :maxSize='1'>
                </drap-upload>
              </el-form-item>
            </template>
            <template slot='collapse-right'>
              <div class='search-bar'>
                <Icon type="ns-search" slot="suffix" class='search-icon'></Icon>
                <span class='search-bar_text'>搜索您最近的门店</span>
              </div>
              <div class='preview-img short-img' :style='{backgroundImage: `url(${model.qrcodePoster})`}'>
                <div v-if='!model.qrcodePoster'>
                  <div class='user-content_bg' >你还未上传活动海报</div>
                  <div class="upload-content_lbs">
                    <drap-upload v-model='model.qrcodePoster' :maxWidth='750'  :maxHeight='1334' :showPont='false' :drag='false' :isNeedCrop='true'>
                    </drap-upload>
                    上传海报图
                  </div>
                </div>
                <VueDragResize v-if='loadOver' :w="model.qrcodeWidth" :h="model.qrcodeWidth" :parentLimitation="true" :aspectRatio='true' :x='model.positionX' :y='model.positionY' @dragstop="onDragQrResize" @resizestop='onDragQrResize' :sticks="['tl','tr','bl','br']" >
                  <img src='@/assets/qrcode.png' style='width:100%;height:100%'>
                </VueDragResize>
              </div>
            </template>
          </PhoneBox>
        </SimpleCollapse>
        <!-- 消费者进群页面设置 end -->
      </template>
    </page-edit>
  </el-form>
</template>
<script>
import Index from './src/index'
import VueDragResize from 'vue-drag-resize'
import HtmlArea from '@/components/NewUi/HtmlArea'
import TagArea from '@/components/NewUi/TagArea'
import RecruitmentCollapse from '@/components/NewUi/RecruitmentCollapse'
import SimpleCollapse from '@/components/NewUi/SimpleCollapse'
import LengthInput from '@/components/NewUi/LengthInput'
import PageEdit from '@/components/NewUi/PageEdit'
import DrapUpload from '@/components/NewUi/DrapUpload'
import ElImage from '@nascent/nui/lib/image'
import NsShopDialog from '@/components/NsShopDialog'
import PhoneBox from '@/components/NewUi/PhoneBox'
import ElInputNumber from '@nascent/nui/lib/input-number'
import NsDatetime from '@nascent/ecrp-ecrm/src/components/NsDatetime'
import shopSelect from '../../../components/selectShops'
Index.components = {
  VueDragResize, RecruitmentCollapse, LengthInput, PageEdit, DrapUpload, ElImage, NsShopDialog, HtmlArea, SimpleCollapse, PhoneBox, TagArea, ElInputNumber, NsDatetime, shopSelect
}
export default Index
</script>
<style lang="scss" scoped>
  @import "@components/NewUi/styles/reset.css";
  .cha {
    width:5px;
  }
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
    &.active {
      color: #262626;
    }
  }
  .employee-list {
    display: flex;
    padding-left:8px;
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
    &:hover {
      cursor: pointer;
      color: rgb(34,126,246);
      border:1px solid rgb(172,216,252)
    }
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
  .first-phone {
    margin-bottom: 24px;
  }
  .step-content {
    font-size: 14px;
    color: #262626;
    line-height: 22px;
    display: flex;
    align-items: center;
    font-weight: bold;
    margin-bottom: 25px;
    .step-name {
      margin-right: 27px;
    }
    .step-value {
      margin-right: 5px;
    }
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
  .shop-icon {
    margin-right: 10px;
    font-size: 16px;
    color:#D9D9D9;
  }
  .preview-img {
    width: 100%;
    height: 567px;
    background-position:0 0;
    background-size: 100% auto;
    background-repeat: no-repeat;
    background-origin: 50% 50%;
    position: relative;
    &.short-img {
      height:476px;
      .user-content_bg {
        top: 120px;
      }
      .upload-content_lbs {
        top: 168px;
      }
    }
  }
  .question-circle {
    position: relative;
    top: 1px;
    color:#8C8C8C;
    left: 5px;
  }
  .question-circle_detail {
    color:#8C8C8C;
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
  opacity: 0;
  padding: 0;
}
.upload-content_lbs >>> .el-upload-list {
  display: none;
}
.upload-content_lbs >>> .poster-set_content {
  display: none
}
.form-item_time >>> .el-form-grid--xmd {
  width: 220px;
}
.radiobox >>> .el-radio__input.is-checked .el-radio__inner{
  background-color:#41a2e8;
  border-color:#41a2e8;
}
.radiobox >>>.el-radio__input.is-checked + .el-radio__label{
  color:#41a2e8;
}
.radioboxQA >>> .el-radio__input.is-checked .el-radio__inner{
  background-color:#2153D4 ;
  border-color:#2153D4 ;
}
.radioboxQA>>>.el-radio__input.is-checked + .el-radio__label{
  color:#2153D4 ;
}
.fuscousQA{
  background: rgba(237,242,252, 100%);
}
.fuscousIcon{
  background: rgba(237,242,252);
}
</style>
