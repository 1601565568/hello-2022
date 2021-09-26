<template>
  <div class="share-view">
    <el-form>
      <el-form-item
        label="分享按钮颜色"
        class="item-view"
      >
        <el-color-picker
          v-model="nickColour"
          :disabled="isStating"
        ></el-color-picker>
        <span>重置</span>
      </el-form-item>
      <el-form-item
        label="分享按钮名称"
        required
        class="item-view"
      >
      <length-input
        v-model="shareName"
        placeholder="请输入名称"
        :length="20"
        :disabled="isStating"
      />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ElColorPicker from '@nascent/nui/lib/color-picker'
import LengthInput from '@/components/NewUi/LengthInput'
export default {
  name: 'share',
  components: {
    ElColorPicker,
    LengthInput
  },
  data () {
    return {
      nickColour: 'black',
      isStating: false,
      shareName: ''
    }
  }
}
</script>

<style scoped>
.share-view {
  width: 100%;
}
.item-view {
  display: flex;
  font-size: 14px;
  color: #595959;
}
.share-view {
  >>> .el-form-item--small.el-form-item  {
    margin-bottom: 0;
  }
}
</style>
