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
        <div class="remind-text">恢复默认引导图</div>
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
  data () {
    return {
      image: ''
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
}
</style>
