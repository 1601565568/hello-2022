<template>
  <div class="item-view">
    <el-form
      label-width="100px"
      label-position="left"
      size="medium"
      class="normal-from">
      <el-form-item
        label=""
        class="larger-item"
      >
        <drap-upload
          tip="（请上传格式为jpg、jpeg或png的图片，大小不超过1M）"
          v-model="image"
          :maxWidth="750"
          :maxHeight="1334"
          :showPont="false"
          :maxSize="1"
          :isNeedCrop="true"
          :showFooter="false"
        >
        </drap-upload>
        <div class="remind-text">恢复默认banner图</div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import DrapUpload from '@/components/NewUi/DrapUpload'
export default {
  name: 'banner',
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
