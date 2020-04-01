<template>
  <div>
    <ElDialog
      width="400px"
      :visible.sync="dialogVisibleVideo"
      :before-close="close"
      :show-scroll-x=false class="message-videodialog">
      <div>
        <!-- 视频上传 -->
        <ElUpload name="file" class="avatar-uploader el-upload--text"
                  :action="this.$api.core.sgUploadFile('message')"
                  :show-file-list="false"
                  accept=".mp4"
                  :on-success="handleVideoSuccessVideoEdit"
                  :before-upload="beforeUploadVideo">
          <video v-if="model.content !=''"
                 :src="model.content"
                 class="avatar video-avatar"
                 controls="controls">您的浏览器不支持视频播放</video>
          <NsButton class="video-btn"
                    slot="trigger"
                    v-if="isShowUploadVideo"
                    type="primary">选取文件</NsButton>
        </ElUpload>
        <P v-if="isShowUploadVideo"
           class="text">请保证视频格式正确，且不超过20M
        </P>
      </div>
    </ElDialog>
  </div>
</template>
<script>
import ElUpload from '@nascent/nui/lib/upload'
import { getErrorMsg } from '@/utils/toast'
export default {
  components: {
    ElUpload
  },
  props: ['videoModel', 'dialogVisibleVideo'],
  data () {
    return {
      isShowUploadVideo: false,
      model: {
        content: '', // 视频cdn地址
        contentFilename: '', // 视频在手机上的名称
        face: '', // 视频封面的cdn地址
        faceFilename: '' // 视频封面在手机上的名称
      }
    }
  },
  methods: {
    // 验证视频格式和视频大小
    beforeUploadVideo (file) {
      const isLt30M = file.size / 1024 / 1024 < 30
      if (['video/mp4'].indexOf(file.type) === -1) {
        this.$message.error('请上传正确的视频格式')
        return false
      }
      if (!isLt30M) {
        this.$message.error('上传视频大小不能超过30MB哦!')
        return false
      }
      this.isShowUploadVideo = false
    },
    // 视频上传是否成功事件(视频组件编辑专用)
    handleVideoSuccessVideoEdit (res, file) {
      this.model.content = res.result.url
      this.$emit('handleVideoSuccessVideoEdit', res.result.url)
    },
    // 关闭弹框
    close () {
      this.$emit('close', 'video')
    }
  },
  watch: {
    publishData () {
      this.model = this.videoModel
    }
  },
  mounted () {
    this.model = this.videoModel
  }
}
</script>
<style scoped>
  @import "@theme/variables.pcss";

  /* 视频样式设置 start */
  .avatar-uploader {
    line-height: 0;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed var(--theme-base-border-color-primary);
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: var(--theme-color-primary-light);
  }
  .avatar-uploader-icon {
    font-size: 20px;
    color: var(--theme-color-white);
  }
  .avatar {
    width: 400px;
    height: 250px;
    display: block;
  }
  .video-avatar {
    width: 400px;
    height: 250px;
    border-radius: 4px;
  }
  /* 视频样式设置 end */

  @component-namespace message {
    @b detail {
      padding: 20px 20px 0;
      margin-bottom: 20px;
      border: 1px dashed var(--theme-base-border-color-primary);
      border-radius: 6px;
      @e btn {
        display: flex;
        align-items: center;
        justify-content: space-between;
        >>> .el-tag {
          cursor: text;
        }
      }
      @e table {
        margin-top: var(--default-margin-larger);
      }
      >>> .ElImage {
        background-color: unset;
      }
    }
    @b item {
      display: flex;
      align-items: center;
      @m title {
        line-height: 18px;
      }
      @m image {
        margin: 7px 0;
      }
      @m add {
        line-height: 60px;
        height: 60px;
      }
      @m opposite {
        width: 76px;
        height: 46px;
        position: relative;
      }
      @e broadcast {
        width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-left: 8px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, .4);
        border-radius: 50%;
      }
    }
    @b circle {
      width: 0;
      height: 0;
      border-width: 4px;
      border-style: solid;
      border-color: transparent transparent transparent var(--theme-color-white);
    }
    @b prompt {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: var(--default-margin-larger) 0;
      @e mass {
        text-align: center;
        padding: var(--default-padding-larger) 25px;
        cursor: pointer;
        border-right: 1px solid var(--theme-base-border-color-primary);
      &:hover {
        .message-hovericolor {
          color: var(--theme-color-primary);
        }
      }
    &:last-child {
       border-right: 0;
     }
      @m topspace {
        margin-top: var(--default-margin-small);
      }
    }
    >>> .el-popover {
      padding: 0;
    }
  }
  @b headling {
    font-weight: bold;
    padding: 0 var(--default-padding-larger);
    background: var(--theme-bg-color-base);
    border-radius: var(--default-radius-mini);
  }
  @b upload {
    >>> .el-upload {
      width: 100px;
      height: 100px;
      position: relative;
      border: 1px solid var(--theme-base-border-color-primary);
      border-radius: var(--default-radius-mini);
  &:hover {
     border-color: var(--theme-color-primary-light);
   }
  }
  @e tip {
    font-size: var(--default-font-size-large);
    color: var(--theme-base-border-color-primary);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  @e avatar {
    width: 100px;
    height: 100px;
    position: relative;
    top: -1px;
    left: -1px;
  }
  }
  @b videodialog {
    >>>> .el-dialog__headerbtn {
      display: none;
    }
    >>> .el-dialog__body {
      padding: 20px 0 0 0;
    }
  }
  @b spacelarger {
    margin-top: var(--default-margin-larger);
  }
  }
</style>
