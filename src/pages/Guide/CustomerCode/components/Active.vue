<template>
  <div class="item-view">
    <el-form
      label-width="100px"
      label-position="left"
      size="medium"
      class="normal-from">
      <el-form-item
        label="奖品设置"
        class="larger-item"
      >
        <drap-upload
          tip=""
          v-model="image"
          :maxWidth="750"
          :maxHeight="1334"
          :showPont="false"
          :maxSize="1"
          :isNeedCrop="true"
          :showFooter="false"
        >
        </drap-upload>
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
export default {
  name: 'active',
  components: {
    DrapUpload,
    LengthInput,
    ElColorPicker
  },
  data () {
    return {
      image: '',
      number: '',
      nickColour: '#262626'
    }
  }
}
</script>

<style scoped>
@import '../styles/reset.css';
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

</style>
