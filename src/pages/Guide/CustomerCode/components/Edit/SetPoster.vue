<template>
  <div class='customCode-content_box'>
    <PhoneBox phoneTitle=''>
      <template slot='collapse-left'>
        <div class="form-item_tip" :class="[btnNext==='QA'?fuscousQA:fuscousIcon]">
          {{fuscousEnv}}
        </div>
        <el-form
          label-width="110px"
          size="medium"
          label-position="left"
          :model="model"
          class="normal-from padding-form"
          :rules="rules"
          ref="setPosterForm"
        >
          <el-form-item label="上传海报" prop="content">
            <div class='item-box'>
              <div class='updata-box' :class="[btnNext==='QA'? updataQA : updata]">
                <SimpleUpload :maxWidth="750" :maxHeight="1334" :maxSize="2" scaleTip='1' v-model='model.backgroundPic' :isNeedCrop='true'  :showPont='false' :drag='false'/>
                <div class='updata-option'>
                  <ns-button type='text' class="remind-text" @click="showDefCard('backgroundPic',defBgImg)">恢复默认图片</ns-button>
                  <div class="qrcode-bottom-view">
                    建议：750*1334像素，小于2M，jpg、png、jpeg格式
                    <el-tooltip effect='light' popper-class='popperClass' placement="right-end">
                      <span type='text' class='safe-btn' :class="[btnNext==='QA'?btnSafeQA:btnSafe]">
                        查看示例
                      </span>
                      <template slot='content'>
                        <img :src='demoImg' class='demo-img' style='width:220px'/>
                      </template>
                    </el-tooltip>
                  </div>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="裂变大师信息" >
            <div class='item-box'>
              <div class="poster-set_content">
                <div class="row-view" :class="[btnNext==='QA'?radioQA:radio]">显示裂变大师头像、昵称：
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
                </div>
                <div class="row-view" style="height:60px;" >
                  <span>昵称颜色：</span>
                  <el-color-picker
                    v-model="model.nickColour"
                    :disabled="isStating"
                  ></el-color-picker>
                </div>
                <div class="row-view" :class="[btnNext==='QA'?radioQA:radio]">
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
                </div>
                <div class="row-view" :class="[btnNext==='QA'?radioQA:radio]">
                  <span>排版样式：</span>
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
          <el-form-item :label="QrCode" prop="qrCodeType" class="larger-item" :class="[btnNext==='QA'?radioQA:radio]">
            <el-radio-group v-model="model.qrCodeType">
              <el-radio :label="0">单{{employeeEnv}}二维码</el-radio>
              <div class="qrcode-bottom-view padding">
                <span class="remind-view"></span>
                {{employeeEnv}}二维码：{{promptQrCode}}
                <el-tooltip  placement="top" popper-class='popperClass'>
                  <span type='text' class='safe-btn' :class="[btnNext==='QA'?btnSafeQA:btnSafe]">
                    示例说明
                  </span>
                  <template slot='content'>
                    消费者通过{{employeeEnv}}小A分享的裂变活动都将添加小A为好友
                  </template>
                </el-tooltip>
              </div>
              <el-radio :label="1" :disabled="codeDisabled">{{isEmployee}}</el-radio>
                 <html-area v-if="cloudPlatformType === 'ecrp'">
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
                      请选择聚合二维码的员工
                    </p>
                  </template>
                </div>
                <template slot="suffix">
                  <div class="employee-suffix">
                    <GuideDialog
                      :selfBtn="true"
                      :appendToBody="true"
                      :isButton="false"
                      :validNull="true"
                      :auth="false"
                      :isOpenDialogAfterRequest='false'
                      btnTitle=""
                      type="text"
                      :dialogTitle="`选择${guideName}`"
                      v-model="model.guideIds"
                      @inputAllData="handleChangeGuide"
                      @input="handleChangeGuide"
                    >
                      <template slot="selfBtn">
                          <Icon type="geren"></Icon>
                        </template>
                    </GuideDialog>
                  </div>
                </template>
                </html-area>
                <div class="qrcode-bottom-view padding">
                <span class="remind-view"></span>
                <span>
                  {{employeeEnv}}聚合码：用户扫码后将{{describe}}中任一{{employeeEnv}}为好友，参与{{employeeEnv}}超过100人时，无法使用聚合码（仅可使用单{{employeeEnv}}二维码）
                  <el-tooltip  placement="top" popper-class='popperClass'>
                  <span type='text' class='safe-btn' :class="[btnNext==='QA'?btnSafeQA:btnSafe]">
                    示例说明
                  </span>
                  <template slot='content'>
                    消费者通过{{employeeEnv}}小A分享的裂变活动，将添加聚合码中任一{{employeeEnv}}为好友
                  </template>
                </el-tooltip>
                </span>
              </div>
            </el-radio-group>

          </el-form-item>
        </el-form>
      </template>
      <template slot="collapse-right">
        <div class='preview-img' :style='{backgroundImage: `url("${model.backgroundPic}")`}'>
          <div class='user-content_bg' v-if='!model.backgroundPic'>纯色背景</div>
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
              src="../../Images/touxiang.png"
            />
            <div
              class="user-content_name"
              :style="{ color: model.nickColour }"
            >
              裂变大师昵称
            </div>
          </div>
          <template v-if='loading'>
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
              <img src='@/assets/qrcode.png' style='width:100%;height:100%'>
            </VueDragResize>
          </template>

        </div>
      </template>
    </PhoneBox>
    <div :class="[btnNext !=='QA'? foot: footQA]">
      <div class='btn' @click="handlePrev">上一步，页面装修</div>
      <div class='current' :class="[btnNext==='QA'?btnQA:btn]" @click="handleSubmit">下一步</div>
    </div>
  </div>
</template>
<script>
import PhoneBox from '@/components/NewUi/PhoneBox'
import { DEFAULT_SETPOSTER_DATA, STEP_LIST, GUIDE_MAX, defBgImg, demoImg } from '../../src/const'
import validates from '../../src/validates'
import HtmlArea from '@/components/NewUi/HtmlArea'
import GuideDialog from '@/components/NewUi/GuideDialog'
import DrapUpload from '@/components/NewUi/DrapUpload'
import VueDragResize from 'vue-drag-resize'
import ElAvatar from '@nascent/nui/lib/avatar'
import ElColorPicker from '@nascent/nui/lib/color-picker'
import SimpleUpload from '@/components/NewUi/SimpleUpload'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      model: { ...DEFAULT_SETPOSTER_DATA },
      // 用户信息排列方式
      headPosition: {
        // 竖排
        0: {
          headPortraitCoordinateX: 136,
          headPortraitCoordinateY: 40,
          headPortraitSize: 48,
          nickCoordinateX: 0,
          nickCoordinateY: 104,
          nickPosition: 0
        },
        // 横排
        1: {
          headPortraitCoordinateX: 24,
          headPortraitCoordinateY: 40,
          headPortraitSize: 48,
          nickCoordinateX: 88,
          nickCoordinateY: 53,
          nickPosition: 1
        }
      },
      rules: {
        guideIds: [
          { required: true, message: `请选择`, trigger: ['blur', 'change'] },
          { validator: validates.validateGuideIds, message: `请选择`, trigger: ['blur', 'change'] }
        ]
      },
      loading: false,
      demoImg,
      defBgImg,
      codeDisabled: false, // 禁用聚合二维码
      btnNext: process.env.VUE_APP_THEME,
      btnQA: 'btnQA',
      btn: 'btn',
      updata: 'updata',
      updataQA: 'updataQA',
      btnSafeQA: 'btnSafeQA',
      btnSafe: 'btnSafe',
      radio: 'radiobox',
      radioQA: 'radioboxQA',
      fuscousQA: 'fuscousQA',
      fuscousIcon: 'fuscousIcon',
      foot: 'costomcode-footer',
      footQA: 'costomcodeQA-footer'
    }
  },
  props: ['data', 'isStating', 'selectedGuideNum'],
  computed: {
    ...mapState({
      // 环境判断
      cloudPlatformType: state => state.user.remumber.remumber_login_info.productConfig.cloudPlatformType
    }),
    QrCode () {
      return this.cloudPlatformType === 'ecrp' ? '员工二维码' : '二维码类型'
    },
    guideName () {
      return this.cloudPlatformType === 'ecrp' ? '人员' : '成员'
    },
    promptQrCode () {
      return this.cloudPlatformType === 'ecrp' ? '用户通过活动海报扫码后，将添加分享员工为好友' : '用户扫码后将添加分享成员为好友'
    },
    isEmployee () {
      return this.cloudPlatformType === 'ecrp' ? '员工聚合二维码' : '聚合二维码'
    },
    describe () {
      return this.cloudPlatformType === 'ecrp' ? '添加员工聚合二维码' : '添第一步（活动信息）中参加活动的成员'
    },
    fuscousEnv () {
      return this.cloudPlatformType === 'ecrp' ? '裂变大师点击上一步中的“立即分享”按钮分享海报，邀请好友添加员工企业微信。' : '裂变大师点击上一步中的“立即分享”按钮分享海报，邀请好友添加企业微信。'
    },
    employeeEnv () {
      return this.cloudPlatformType === 'ecrp' ? '员工' : '成员'
    }
  },
  components: {
    PhoneBox, VueDragResize, SimpleUpload, ElColorPicker, HtmlArea, GuideDialog
  },
  watch: {
    selectedGuideNum (val) {
      if (val > GUIDE_MAX) {
        this.model.qrCodeType = 0
        this.codeDisabled = true
      } else {
        this.codeDisabled = false
      }
    }
  },
  methods: {
    handleChangeGuide (value) {
      this.model.guideDatas = value
      this.$refs.setPosterForm && this.$refs.setPosterForm.validateField('guideIds')
    },
    // 删除所选员工
    handleDelect (index) {
      this.model.guideDatas.splice(index, 1)
      this.model.guideIds.splice(index, 1)
      this.$refs.setPosterForm && this.$refs.setPosterForm.validateField('guideIds')
    },
    // 删除所有员工
    handleDelectAll () {
      this.model.guideIds = []
      this.model.guideDatas = []
      this.$refs.setPosterForm && this.$refs.setPosterForm.validateField('guideIds')
    },
    // 拖动二维码
    onDragResize (params) {
      this.model = { ...this.model,
        qrcodeSize: params.width,
        qrcodeX: params.left,
        qrcodeY: params.top
      }
    },
    // 恢复默认图
    showDefCard (key, src) {
      this.model[key] = src
    },
    handlePrev () {
      this.$emit('changeStepId', 'prev')
    },
    handleSubmit () {
      this.$refs.setPosterForm.validate((valid) => {
        if (valid) {
          this.$emit('changeData', {
            key: STEP_LIST[3].dataName,
            value: { ...this.model, ...this.headPosition[this.model.headerType] }
          })
          this.$emit('changeStepId', 'next')
        }
      })
    }
  },
  mounted () {
    // setTimeout(() => {
    //   console.log();
    // }, 1000)
    this.model = { ...this.data, guideIds: [], guideDatas: [] }
    console.log(this.model)
    this.rules.guideIds = [
      { required: true, message: `请选择${this.guideNamesEnv}`, trigger: ['blur', 'change'] },
      { validator: validates.validateGuideIds, message: `请选择${this.guideNamesEnv}`, trigger: ['blur', 'change'] }
    ]
  }
}
</script>
<style lang="scss" scoped>
@import '@components/NewUi/styles/reset.css';
@import "../../styles/customcode.css";
.customCode-content_box {
  height: 100%;
  .collapse-content  {
    height: 100%;
  }
}
.poster-set_content {
  position: relative;
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
.user-content_bg {
  font-size: 12px;
  color: #595959;
  position: absolute;
  top:40%;
  left:0;
  right: 0;
  text-align: center;
}
.preview-img {
  background-color: #F5F5F5;
}

.qrcode-bottom-view {
  height: 20px;
  box-sizing: content-box;
  &.padding {
    padding: 10px 0;
  }
}
.user-content {
  .user-content_img {
    height: 24px;
    width: 24px;
    border-radius: 4px;
    >>> & > path {
      color: #f00;
    }
  }
  .user-content_name {
    font-size: 12px;
    color: #262626;
  }
  &.vertical {
    padding-top: 16px;
    .user-content_img {
      display: block;
      margin: 0px auto 8px;
    }
    .user-content_name {
      text-align: center;
    }
  }
  &.align {
    display: flex;
    align-items: center;
    padding-top: 16px;
    .user-content_img {
      display: block;
      margin: 0px 8px 0 16px;
    }
    .user-content_name {
      text-align: center;
    }
  }
}
.demo-img {
  width: 100px;
}
// 新增员工选择器样式
.html-area{
  // height: 32px;
  margin-top: 8px;
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
.employee-list_all {
  font-size: 12px;
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
.employee-selected-text {
  font-size: 14px;
  padding-bottom: 8px;
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
.form-item_time {
  display: flex;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 2px;
}
.employee-suffix {
  cursor: pointer;
  min-width: 40px;
  font-size: 12px;
  color: #262626;
  text-align: center;
}

</style>
<style scoped>
.employee-suffix >>> .template-search__chooes{
    color: #262626;
  }
.customCode-content_box {
  >>> .collapse-right,>>> .collapse-left{
    height: 100%;
    overflow-y: auto;
    &::-webkit-scrollbar{
      width: 5px;
      height: 5px;
    }
    &::-webkit-scrollbar-thumb{
      border-radius: 1em;
      background-color: rgba(144, 147, 153, .3);
      cursor: pointer;
    }
    &::-webkit-scrollbar-track{
      border-radius: 1em;
      background-color: rgba(50,50,50,0);
      cursor: pointer;
    }
  }
  >>> .collapse-content {
    padding-bottom: 0;
  }
}
.poster-set_content {
  >>> .el-col {
    margin-bottom: 12px;
  }
  >>> .el-radio {
    margin-right: 4px;
  }
}
.costomcode-footer .current{
  background-color: #0091FA;
  color: #FFFFFF;
  border: 1px solid #0091FA;
}
.costomcodeQA-footer .btnQA.current{
  background-color: #2153D4;
  color: #FFFFFF;
  width: 160PX;
  height: 40px;
  border: 1px solid #2153D4;
  text-align: center;
  line-height: 40px;
  border-radius: 2px;
  cursor: pointer;
  margin-right: 16px;
}
.updataQA >>> .updata-option .remind-text{
   color: #2153D4;
    font-weight: 400;
}
.updata >>> .updata-option .remind-text{
   color: #0392FB;
    font-weight: 400;
}
.btnSafeQA{
  color: #2153D4;
}
.btnSafe{
  color: #0091FA;
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
  background-color: rgba(237,242,252,100%);
}
.fuscousIcon {
  background-color: rgba(237,242,252);
}
</style>
