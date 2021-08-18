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
    :on-progress="onProgress"
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

      if (!isMp4) {
        this.$message.error('上传mp4视频')
        this.loading = false
        return false
      }

      if (!isLt10M) {
        this.$message.error('大小不超过10M')
        this.loading = false
        return false
      }

      this.$notify.info('上传中')

      return true
    },
    onSuccess (uploadRes, file) {
      this.loading = false
      if (uploadRes.success) {
        this.$emit('confirm', { ...this.defaultModel, mediaid: uploadRes.result.url, uid: String(file.uid) })
        // this.$message.success('上传视频成功')
      } else {
        this.$message.error('上传视频失败')
      }
    },
    onProgress (event, file, fileList) {
      this.$emit('uploadProgress', { type: 'video', content: { percent: event.percent.toFixed(2), mediaid: file.name, uid: String(file.uid) } })
      // this.$emit('uploadProgress', { ...this.defaultModel, percent: event.percent.toFixed(2), mediaid: file.name })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./styles/upload-reset.css";
</style>
