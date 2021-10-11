<template>
  <div class="item-view">
    <el-form
      label-width="100px"
      label-position="left"
      size="medium"
      class="normal-from">
      <el-form-item
        label="注册会员"
        class="larger-item"
      >
        <drap-upload
          tip="（建议：宽度750像素，高度不限，小于2M，jpg、png、jpeg格式）"
          v-model="pageObj.regUrl"
          :showPont="false"
          :maxSize="2"
          :isNeedCrop="false"
          :showFooter="false"
          uploadTitle="点击或拖拽上传引导图"
          @input="input"
        >
        </drap-upload>
        <div class="remind-text" @click="showDefaultUrl">恢复默认引导图</div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import DrapUpload from '@/components/NewUi/DrapUpload'
export default {
  name: 'register',
  components: {
    DrapUpload
  },
  props: {
    value: Object
  },
  computed: {
    pageObj () {
      return this.value
    }
  },
  methods: {
    showDefaultUrl () {
      this.pageObj.regUrl = ''
    },
    input () {
      this.$emit('scrollPhone', 'register-view')
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
.remind-text {
  margin-top: 8px;
  font-size: 14px;
  color: #0392FB;
  line-height: 22px;
  cursor: pointer;
}
</style>
