<template>
  <div class="item-view">
    <el-form
      label-width="100px"
      label-position="left"
      size="medium"
      class="normal-from">
      <SetPrize :prizeModel='prizeModel' ref="setPrize" @updatePrize="updatePrize"/>
      <el-form-item
        label=""
        class="larger-item"
      >
        <div class="goods-view">
          <div class="input-view">
            <length-input
              v-model="activeInfo.goodsName"
              placeholder="一个奖品名称"
              :length="20"
            />
            <div style="height:16px"></div>
            <length-input
              v-model="activeInfo.goodsDes"
              placeholder="请输入奖品简介"
              :length="50"
            />
          </div>
          <drap-upload
              tip="（请上传格式为jpg的图片，建议长宽比例为1:1，大小不超过2M）"
              v-model="activeInfo.image"
              :showPont="false"
              :maxSize="2"
              :isNeedCrop="false"
              :showFooter="false"
              uploadTitle="点击或拖拽上传奖品图片"
            >
            </drap-upload>
        </div>
      </el-form-item>
      <el-form-item
        label="虚拟完成人数"
        class="larger-item"
      >
        <length-input
          v-model="activeInfo.number"
          placeholder="请输入人数"
        />
      </el-form-item>
      <el-form-item
        label="领取奖励按钮颜色"
        class="larger-item"
      >
      <div class="color-view">
        <el-color-picker
          v-model="activeInfo.getColor"
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
export default {
  name: 'active',
  components: {
    DrapUpload,
    LengthInput,
    ElColorPicker,
    SetPrize
  },
  watch: {
    activeInfo: {
      handler (newValue, oldValue) {
        this.$emit('updateActiveInfo', newValue)
      },
      deep: true
    }
  },
  data () {
    return {
      activeInfo: {
        image: '',
        number: '0',
        getColor: '#FF6A41',
        goodsName: '',
        goodsDes: ''
      },
      prizeModel: {}
    }
  },
  methods: {
    updatePrize (model) {
      this.$emit('updateActiveModel', model)
    },
    updateGetColor () {
      this.activeInfo.getColor = '#FF6A41'
    }
  }
}
</script>

<style scoped>
.item-view {
  margin-top: 24px;
  margin-bottom: 24px;
}
.color-view {
  display: flex;
  align-items: center;
  flex-direction: row;
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
.input-view {
  padding: 16px 16px 0 16px;
}

</style>
