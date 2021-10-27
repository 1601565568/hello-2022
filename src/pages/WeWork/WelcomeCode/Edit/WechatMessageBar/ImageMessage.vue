<template>
  <ElUpload
    ref='elupload'
    name="file"
    :action="uploadUrl"
    :show-file-list="false"
    accept=".jpg,.jpeg,.png"
    :on-success="onSuccess"
    :on-exceed='onExceed'
    :before-upload="beforeUpload"
    :on-progress="onProgress"
    :multiple='multiple'
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
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 99999
    }
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
        this.$emit('confirm', { type: 'image', content: { image: uploadRes.result.url, fileName: file.name } })
      } else {
        this.$message.error('上传图片失败')
      }
    },
    onProgress (event, file, fileList) {
      // this.$emit('uploadProgress', { type: 'image', content: { percent: event.percent.toFixed(2), image: file.name } })
    }
    // onExceed (files, fileList) {
    //   console.log(files, fileList)
    // }
  }
}
</script>

<style lang="scss" scoped>
@import "./styles/upload-reset.css";
</style>
