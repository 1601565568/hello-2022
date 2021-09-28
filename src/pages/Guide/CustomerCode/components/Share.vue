<template>
  <div class="item-view">
    <el-form
      label-width="100px"
      label-position="left"
      size="medium"
      class="normal-from">
      <el-form-item
        label="分享按钮颜色"
        class="larger-item"
      >
      <div class="color-view">
        <el-color-picker
          v-model="share.color"
        ></el-color-picker>
        <span class="color-text" @click="updateColor">重置</span>
      </div>
      </el-form-item>
      <el-form-item
        label="分享按钮名称"
        class="larger-item"
        prop="shareText"
      >
        <length-input
          v-model="share.name"
          placeholder="请输入分享按钮名称"
          :length="10"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import DrapUpload from '@/components/NewUi/DrapUpload'
import LengthInput from '@/components/NewUi/LengthInput'
import ElColorPicker from '@nascent/nui/lib/color-picker'
export default {
  name: 'share',
  components: {
    LengthInput,
    ElColorPicker
  },
  watch: {
    share: {
      handler (newValue, oldValue) {
        this.$emit('updateShare', newValue)
      },
      deep: true
    }
  },
  data () {
    return {
      share: {
        color: '#FFA30E',
        name: '立即分享'
      }
    }
  },
  methods: {
    updateColor () {
      this.share.color = '#FFA30E'
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
