<template>
  <div class='customCode-content_box'>
    <PhoneBox phoneTitle=''>
      <template slot='collapse-left'>
        <div class="form-item_tip">
          裂变大师点击上一步中的“立即分享”按钮分享海报，邀请好友添加员工企业微信。
        </div>
        <el-form
          label-width="110px"
          size="medium"
          label-position="left"
          :model="model"
          class="normal-from padding-form"
          ref="setPosterForm"
        >
          <el-form-item label="上传海报" prop="content">
            <div class='item-box'>
              <div class='updata-box'>
                <SimpleUpload :maxWidth="750" :maxHeight="1334" :maxSize="2" scaleTip='1' v-model='model.backgroundPic' :isNeedCrop='true'  :showPont='false' :drag='false'/>
                <div class='updata-option'>
                  <ns-button type='text' class="remind-text" @click="showDefCard('backgroundPic',defBgImg)">恢复默认图片</ns-button>
                  <div class="qrcode-bottom-view">
                    建议：750*1334像素，小于2M，jpg、png、jpeg格式
                    <el-tooltip  placement="top" popper-class='popperClass'>
                      <span type='text' class='safe-btn'>
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
                <div class="row-view">显示裂变大师头像、昵称：
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
                <div class="row-view" style="height:60px;">
                  <span>昵称颜色：</span>
                  <el-color-picker
                    v-model="model.nickColour"
                    :disabled="isStating"
                  ></el-color-picker>
                </div>
                <div class="row-view">
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
                <div class="row-view">
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
          <el-form-item label="二维码类型" prop="qrCodeType" class="larger-item">
            <el-radio-group v-model="model.qrCodeType">
              <el-radio :label="0">单员工二维码</el-radio>
              <el-radio :label="1" :disabled="codeDisabled">聚合二维码</el-radio>
            </el-radio-group>
            <div class="qrcode-bottom-view">
              <span class="remind-view"></span>
              员工二维码：用户扫码后将添加分享员工为好友
              <el-tooltip  placement="top" popper-class='popperClass'>
                <span type='text' class='safe-btn'>
                  示例说明
                </span>
                <template slot='content'>
                  消费者通过员工小A分享的裂变活动都将添加小A为好友
                </template>
              </el-tooltip>
            </div>
            <div class="qrcode-bottom-view">
              <span class="remind-view"></span>
              <span>
                员工聚合码：用户扫码后将添第一步（活动信息）中参加活动的员工中任一员工为好友，参与员工超过100人时，无法使用聚合码（仅可使用单员工二维码）
                <el-tooltip  placement="top" popper-class='popperClass'>
                <span type='text' class='safe-btn'>
                  示例说明
                </span>
                <template slot='content'>
                  消费者通过员工小A分享的裂变活动，将添加聚合码中任一员工为好友
                </template>
              </el-tooltip>
              </span>
            </div>
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
    <div class='costomcode-footer'>
      <div class='btn' @click="handlePrev">上一步，页面装修</div>
      <div class='btn current' @click="handleSubmit">下一步</div>
    </div>
  </div>
</template>
<script>
import PhoneBox from '@/components/NewUi/PhoneBox'
import { DEFAULT_SETPOSTER_DATA, STEP_LIST, GUIDE_MAX, defBgImg, demoImg } from '../../src/const'
import validates from '../../src/validates'
import DrapUpload from '@/components/NewUi/DrapUpload'
import VueDragResize from 'vue-drag-resize'
import ElAvatar from '@nascent/nui/lib/avatar'
import ElColorPicker from '@nascent/nui/lib/color-picker'
import SimpleUpload from '@/components/NewUi/SimpleUpload'
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
      loading: false,
      demoImg,
      defBgImg,
      codeDisabled: false // 禁用聚合二维码
    }
  },
  props: ['data', 'isStating', 'selectedGuideNum'],
  components: {
    PhoneBox, VueDragResize, SimpleUpload, ElColorPicker
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
    //   this.loading = true
    // }, 1000)
    // console.log(this.model)
    this.model = { ...this.data }
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
</style>
<style scoped>
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
</style>
