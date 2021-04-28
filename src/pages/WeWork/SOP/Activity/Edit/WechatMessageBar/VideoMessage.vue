<template>
  <ElUpload
    name="file"
    :action="uploadUrl"
    :show-file-list="false"
    accept=".mp4"
    :on-success="onSuccess"
    :before-upload="beforeUpload"
    modal-append-to-body
    append-to-body
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
        type: 'video',
        mediaid: '' // 视频的素材id
      },
      loading: false,
      uploadUrl: this.$api.core.sgUploadFile('message')
    }
  },
  methods: {
    beforeUpload (file) {
      this.loading = true
      const isMp4 = file.type === 'video/mp4'
      const isLt10M = file.size / 1024 / 1024 < 10

      if (!isMp4 || !isLt10M) {
        this.$message.error('请上传mp4视频，大小不超过10M')
        this.loading = false
        return false
      }

      this.$notify.info('上传中')

      return true
    },
    onSuccess (uploadRes, file) {
      this.loading = false
      if (uploadRes.success) {
        this.$emit('confirm', { ...this.defaultModel, mediaid: uploadRes.result.url })
        // this.$message.success('上传视频成功')
      } else {
        this.$message.error('上传视频失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./styles/upload-reset.css";
</style>
