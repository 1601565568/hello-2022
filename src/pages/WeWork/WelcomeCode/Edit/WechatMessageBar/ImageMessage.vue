<template>
  <ElUpload
    name="file"
    :action="uploadUrl"
    :show-file-list="false"
    accept=".jpg,.jpeg,.png"
    :on-success="onSuccess"
    :before-upload="beforeUpload"
  >
    <slot>上传</slot>
  </ElUpload>
</template>

<script>
import ElUpload from '@nascent/nui/lib/upload'

export default {
  components: {
    ElUpload
  },
  data () {
    return {
      defaultModel: {
        image: '' // 图片的素材id
      },
      loading: false,
      uploadUrl: this.$api.core.sgUploadFile('message')
    }
  },
  methods: {
    beforeUpload (file) {
      this.loading = true
      const isPngOrJpg = file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isPngOrJpg) {
        this.$message.error('上传jpg、jpeg、png图片')
        this.loading = false
        return false
      }

      if (!isLt2M) {
        this.$message.error('大小不超过2M')
        this.loading = false
        return false
      }

      return true
    },
    onSuccess (uploadRes, file) {
      this.loading = false
      if (uploadRes.success) {
        this.$emit('confirm', { type: 'image', content: { image: uploadRes.result.url } })
      } else {
        this.$message.error('上传图片失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./styles/upload-reset.css";
</style>
