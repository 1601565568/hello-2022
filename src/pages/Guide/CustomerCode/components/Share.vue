<template>
  <div class="item-view">
    <el-form
      :model="pageObj.share"
      :rules="rules"
      label-width="100px"
      label-position="left"
      size="medium"
      ref="shareForm"
      class="normal-from">
      <el-form-item
        label="分享按钮颜色"
        class="larger-item"
      >
      <div class="color-view">
        <el-color-picker
          v-model="pageObj.share.color"
        ></el-color-picker>
        <span class="color-text" @click="updateColor">重置</span>
      </div>
      </el-form-item>
      <el-form-item
        label="分享按钮名称"
        class="larger-item"
        prop="name"
      >
        <length-input
          v-model="pageObj.share.name"
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
import validates from '../src/validates'
export default {
  name: 'share',
  components: {
    LengthInput,
    ElColorPicker
  },
  props: {
    value: Object
  },
  data () {
    return {
      rules: {
        name: [
          { required: true, message: '请输入分享按钮名称', trigger: ['blur', 'change'] },
          { validator: validates.shareName, trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  computed: {
    pageObj () {
      return this.value
    }
  },
  methods: {
    validateRules () {
      return new Promise((resolve, reject) => {
        this.$refs.shareForm.validate((valid) => {
          if (valid) {
            resolve()
          }
        })
      })
    },
    updateColor () {
      this.pageObj.share.color = this.pageObj.mainColor
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
