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
        type: 'image',
        mediaid: '' // 图片的素材id
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

      if (!isPngOrJpg || !isLt2M) {
        this.$message.error('请上传jpg、jpeg或png图片，大小不超过2M')
        this.loading = false
        return false
      }

      return true
    },
    onSuccess (uploadRes, file) {
      this.loading = false
      if (uploadRes.success) {
        this.$emit('confirm', { ...this.defaultModel, mediaid: uploadRes.result.url })
        // this.$message.success('上传图片成功')
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
