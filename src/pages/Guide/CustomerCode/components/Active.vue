<template>
  <div class="item-view">
    <el-form
      label-width="110px"
      label-position="left"
      :model="pageObj.activeInfo"
      :rules="rules"
      ref="reward"
      size="medium"
      class="normal-from">
      <SetPrize :prizeModel='prizeModel' :isStating="isStating" :isSetPrize="isSetPrize" ref="setPrize" @updatePrize="updatePrize"/>
      <el-form-item
        label=""
        class="larger-item"
      >
        <div class="goods-view">
          <div class="goods-input-view">
            <el-form-item prop="goodsName">
              <length-input
                v-model="pageObj.activeInfo.goodsName"
                placeholder="请输入奖品名称"
                :length="20"
                :disabled="isStating"
                @input='input'
              />
            </el-form-item>
            <div style="height:16px"></div>
            <el-form-item prop="goodsDes">
              <length-input
                v-model="pageObj.activeInfo.goodsDes"
                placeholder="请输入奖品简介"
                :disabled="isStating"
                :length="50"
                @input='input'
              />
            </el-form-item>
          </div>
          <el-form-item prop="image">
            <drap-upload
              tip="（请上传格式为jpg、jpeg或png的图片，建议长宽比例为1:1，大小不超过2M）"
              v-model="pageObj.activeInfo.image"
              :showPont="false"
              :maxSize="2"
              :isNeedCrop="true"
              :showFooter="false"
              uploadTitle="点击或拖拽上传奖品图片"
              :showDelImg="!isStating"
              :disabled="isStating"
              @input="input"
            >
            </drap-upload>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item
        label="虚拟完成人数"
        class="larger-item"
      >
        <length-input
          v-model="pageObj.activeInfo.number"
          placeholder="请输入人数"
          @input='inputNumber'
        />
      </el-form-item>
      <el-form-item
        label="领取奖励按钮颜色"
        class="larger-item"
      >
      <div class="active-color-view">
        <el-color-picker
          v-model="pageObj.activeInfo.getColor"
        ></el-color-picker>
        <span class="color-text" @click="updateGetColor">重置</span>
      </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import DrapUpload from '@/components/NewUi/DrapUpload'
import LengthInput from '@/components/NewUi/LengthInput'
import ElColorPicker from '@nascent/nui/lib/color-picker'
import SetPrize from './SetPrize'
import validates from '../src/validates'
export default {
  name: 'active',
  components: {
    DrapUpload,
    LengthInput,
    ElColorPicker,
    SetPrize
  },
  props: {
    value: Object,
    prizeModel: Object,
    isStating: Boolean,
    isSetPrize: Boolean
  },
  computed: {
    pageObj () {
      return this.value
    }
  },
  data () {
    return {
      rules: {
        goodsName: [
          {
            required: true,
            message: '请输入奖品名称',
            trigger: ['blur', 'change']
          },
          { validator: validates.goodsName, trigger: ['blur', 'change'] }
        ],
        goodsDes: [
          {
            required: true,
            message: '请输入奖品简介',
            trigger: ['blur', 'change']
          },
          { validator: validates.goodsDesc, trigger: ['blur', 'change'] }
        ]
        // image: [
        //   {
        //     required: true,
        //     message: '请上传上传奖品图片',
        //     trigger: ['blur', 'change']
        //   }
        // ]
      }
    }
  },
  methods: {
    validateRules () {
      const formRules = new Promise((resolve, reject) => {
        this.$refs.reward.validate((valid) => {
          if (valid) {
            resolve()
          }
        })
      })
      const prizeRules = this.$refs.setPrize.validateRules()
      return Promise.all([formRules, prizeRules])
    },
    updatePrize (model) {
      this.$emit('updateActiveModel', model)
    },
    updateGetColor () {
      this.pageObj.activeInfo.getColor = this.pageObj.mainColor
    },
    inputNumber (value) {
      this.pageObj.activeInfo.number = value.replace(/[^\d]/g, '')
      this.$emit('scrollPhone', 'time-view')
    },
    input () {
      this.$emit('scrollPhone', 'time-view')
    }
  }
}
</script>

<style scoped>
.item-view {
  margin-top: 24px;
  margin-bottom: 24px;
}
.active-color-view {
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-left: 0px;
  /* height: 60px; */
}
.color-text {
  font-size: 14px;
  color: #0094FC;
  line-height: 20px;
  display: inline-block;
  margin-left: 16px;
  cursor: pointer;
}

.goods-view {
  background: #F5F5F5;
}
.goods-input-view {
  padding: 16px 16px 0 16px;
}
.goods-input-view {
  >>> .el-form-item {
    margin-bottom: 0px !important;
  }
}
</style>
