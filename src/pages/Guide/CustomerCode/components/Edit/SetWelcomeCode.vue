<template>
  <div class='customCode-content_box'>
    <Box>
      <template slot='collapse-left'>
        <div class="form-item_tip">
          通过裂变海报添加的好友，会收到欢迎语和活动链接。好友进入活动链接后，可分享裂变海报邀请好友。
        </div>
        <el-form
          label-width="110px"
          size="medium"
          label-position="left"
          :model="model"
          class="normal-from padding-form"
          ref="setWelcomeCodeForm"
          :rules="rules"
        >
          <el-form-item label="欢迎语"
            required
            prop="activityIntroduction"
            :rules="[
              { required: true, message: '请输入欢迎语', trigger: ['blur', 'change'] },
              { validator: validates.validateActivityIntroduction.bind(this,activityIntroductionLength), message: '欢迎语最多1000个字', trigger: ['blur', 'change'] }
            ]"
          >
            <tag-area
              v-model="model.activityIntroduction"
              tag="wise"
              ref="tagAreaText"
              className="tagAreaText"
              :maxlength="1000"
              :tools="tools"
              placeholder="请输入欢迎语"
              @inputLength="inputLength"
              :showEmoji="true"
              :showTextEmoji="true"
              :isShowDefault="true"
              @showDefaultText="showDefaultText"
            />
          </el-form-item>
          <el-form-item
            label="活动链接"
            required
          >
            <div class="item-box">
              <el-form-item prop="cardTitle">
                <length-input
                  v-model="model.cardTitle"
                  placeholder="请输入活动名称"
                  :length="20"
                />
              </el-form-item>
              <el-form-item prop="cardCopywriting">
                <length-input
                  v-model="model.cardCopywriting"
                  placeholder="请输入文案"
                  :length="50"
                />
              </el-form-item>
              <el-form-item prop="cardCoverPic">
                <div class='simple-updata'>
                  <el-avatar v-if="model.cardCoverPic" shape="square" :size="100" fit="contain" :src="model.cardCoverPic"></el-avatar>
                  <div v-else class='default-updata'>
                    <Icon type="plus" className="company-upload__tip"/>
                  </div>
                  <div class='upload-content'>
                    <drap-upload  :scale='1' :maxSize="2" scaleTip='1' v-model='model.cardCoverPic' :isNeedCrop='true' :drag='false'>
                    </drap-upload>
                  </div>
                  <ns-button type='text' class="remind-text" @click="showDefCard">恢复默认图片</ns-button>
                </div>
                <div class="qrcode-bottom-view">
                  建议：比例为1:1，小于2M，jpg、png、jpeg格式
                </div>
              </el-form-item>
            </div>
          </el-form-item>
        </el-form>
      </template>
      <template slot="collapse-right">
        <Welcome :url="model.cardCoverPic" :title="model.cardTitle" :detail="model.cardCopywriting" :info="model.activityIntroduction"/>
      </template>
    </Box>
    <div class='costomcode-footer'>
      <div class='btn' @click="handlePrev">上一步，设置裂变海报</div>
      <div class='btn current' @click="handleSubmit">下一步</div>
    </div>
  </div>
</template>
<script>
import Box from '@/components/NewUi/Box'
import { STEP_LIST, DEFAULT_SETWELCOMECODE_DATA, DEFAULT_WELCOMECODE, Tools } from '../../src/const'
import validates from '../../src/validates'
import DrapUpload from '@/components/NewUi/DrapUpload'
import ElAvatar from '@nascent/nui/lib/avatar'
import LengthInput from '@/components/NewUi/LengthInput'
import TagArea from '@/components/NewUi/TagArea'
import { defCardImg } from '../../util/Edit'
import Welcome from '../Welcome'
export default {
  data () {
    return {
      model: { ...DEFAULT_SETWELCOMECODE_DATA },
      rules: {
        activityIntroduction: [
          { required: true, message: '请输入欢迎语', trigger: ['blur', 'change'] }
        ],
        cardTitle: [
          { required: true, trigger: ['blur', 'change'], message: '请输入活动消息卡片名称' },
          { validator: validates.validateCard, trigger: ['blur', 'change'] }
        ],
        cardCopywriting: [
          { required: true, trigger: ['blur', 'change'], message: '请输入活动消息卡片文案' },
          { validator: validates.validateString, trigger: ['blur', 'change'] }
        ],
        cardCoverPic: [
          { required: true, trigger: ['blur', 'change'], message: '请选择活动消息卡片封面图片' }
        ]
      },
      tools: Tools,
      validates,
      activityIntroductionLength: 0
    }
  },
  props: ['data', 'isStating'],
  components: {
    Box, DrapUpload, ElAvatar, TagArea, LengthInput, Welcome
  },
  methods: {
    inputLength (length) {
      this.activityIntroductionLength = length
      this.$refs.setWelcomeCodeForm && this.$refs.setWelcomeCodeForm.validateField('activityIntroduction')
    },
    showDefaultText (introText = DEFAULT_WELCOMECODE) {
      const str = this.$refs.tagAreaText.stringTohtml(introText)
      this.model.activityIntroduction = str
      this.$refs.tagAreaText.$refs[this.$refs.tagAreaText.className].innerHTML = str
      this.$refs.tagAreaText.currentText = this.$refs.tagAreaText.$refs[this.$refs.tagAreaText.className].innerText
    },
    showDefCard () {
      this.model.cardCoverPic = defCardImg
    },
    handlePrev () {
      this.$emit('changeStepId', 'prev')
    },
    handleSubmit () {
      this.$refs.setWelcomeCodeForm.validate((valid) => {
        if (valid) {
          this.$emit('changeData', {
            key: STEP_LIST[4].dataName,
            value: this.model
          })
          this.$emit('changeStepId', 'next')
        }
      })
    }
  },
  mounted () {
    this.model = { ...this.data }
    if (!this.model.activityIntroduction) {
      this.showDefaultText()
    }
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
.preview-img {
  background-color: #F5F5F5;
  background-position:0 0;
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-origin: 50% 50%;
  position: relative;
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
  >>> .collapse-right::before {
    display: none
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
