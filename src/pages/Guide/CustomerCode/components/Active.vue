<template>
  <div class="item-view">
    <el-form
      label-width="100px"
      label-position="left"
      size="medium"
      class="normal-from">
      <SetPrize/>
      <el-form-item
        label=""
        class="larger-item"
      >
        <div class="goods-view">
          <div class="input-view">
            <length-input
              v-model="goodsName"
              placeholder="一个奖品名称"
              :length="20"
            />
            <div style="height:16px"></div>
            <length-input
              v-model="goodsDes"
              placeholder="请输入奖品简介"
              :length="50"
            />
          </div>
          <drap-upload
              tip="（请上传格式为jpg的图片，建议长宽比例为1:1，大小不超过2M）"
              v-model="image"
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
          v-model="number"
          placeholder="请输入人数"
        />
      </el-form-item>
      <el-form-item
        label="领取奖励按钮颜色"
        class="larger-item"
      >
      <div class="color-view">
        <el-color-picker
          v-model="nickColour"
        ></el-color-picker>
        <span class="color-text">重置</span>
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
  data () {
    return {
      image: '',
      number: '',
      nickColour: '#262626',
      goodsName: '',
      goodsDes: ''
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
}

.goods-view {
  background: #F5F5F5;
}
.input-view {
  padding: 16px 16px 0 16px;
}

</style>
