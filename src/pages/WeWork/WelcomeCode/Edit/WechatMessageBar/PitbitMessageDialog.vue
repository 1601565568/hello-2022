<template>
  <el-dialog
    ref="tagArea"
    width="658px"
    :visible="visible"
    className="pitbit"
    title="指南"
    :tools="tools"
    :show-scroll-x="false"
    :close-on-click-modal="false"
    @open="open"
    @close="close"
    modal-append-to-body
    append-to-body
  >
    <div>
      <div class="guide-text">指南说明</div>
      <tag-area
          class="tag-area"
          :isShow='isShow'
          v-model='pitText'
          tag="wise"
          ref="tagAread"
          :maxlength="1500"
          :showEmoji='false'
          :showTextEmoji='false'
          placeholder="请输入"
          emojiClass=''
        />
    </div>
    <div>
      <div class="guide-text">示意图</div>
      <div class="upload-view">
        <div v-if="pitUrl" style="width:114px;height:114x;position:relative;">
          <div class="guide-mask">
            <Icon type="ns-delete" style="font-size:18px;" @click="removeGuideImage" />
          </div>
          <img :src="pitUrl" style="width:114px;height:114px;border-radius: 4px; object-fit: cover;" />
        </div>
        <div v-else class="show-uploader-view">
          <el-upload
            class="library-guide"
            :action="this.$api.core.sgUploadFile('image')"
            :on-success="handleGuideSuccess"
            :before-upload="beforeAvatarUpload"
            :show-file-list="false"
          >
            <div style="width:114px;height:114x;position:relative;">
              <div class="library-select-guide-uploader" slot="reference">
                <div class="el-upload--picture-card">
                  <Icon type="plus" />
                </div>
              </div>
            </div>
          </el-upload>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <ns-button @click="close">取消</ns-button>
      <ns-button @click="confirm" type="primary">确定</ns-button>
    </div>
  </el-dialog>
</template>

<script>
import ElUpload from '@nascent/nui/lib/upload'
import TagArea from '@/components/NewUi/TagArea'
export default {
  components: {
    ElUpload,
    TagArea
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    content: {
      type: Object,
      default: function () {
        return null
      }
    }
  },
  watch: {
  },
  data () {
    return {
      tools: [],
      isShow: false,
      pitText: '',
      pitUrl: ''
    }
  },
  mounted () {
  },
  methods: {
    close () {
      this.isShow = false
      this.pitText = ''
      this.pitUrl = ''
      this.$emit('update:visible', false)
    },
    open () {
      this.isShow = true
      if (this.content !== null) {
        this.pitText = this.content.pitText
        this.pitUrl = this.content.pitUrl
      }
    },
    removeGuideImage () {
      this.pitUrl = ''
    },
    confirm () {
      this.$emit('confirm', {
        type: 'pitbit',
        content: {
          pitUrl: this.pitUrl,
          pitText: this.pitText
        }
      })
      this.close()
    },
    beforeAvatarUpload (file) {
      // 图片格式判断
      if (!/\.(jpg|jpeg|png|JPG|PNG|JPEG)$/.test(file.name)) {
        this.$notify.error('仅支持jpg/jpeg/png的图片格式')
        return false
      }
      // 图片大小判断
      if (file.size / 1024 > 1024 * 2) {
        this.$notify.warning('上传图片不得大于2MB')
        return false
      }
    },
    handleGuideSuccess (uploadRes, file) {
      this.pitUrl = uploadRes.result.url
    }
  }
}
</script>

<style scoped>
/* @import '@theme/variables.pcss'; */
@import '../styles/image.css';
.top-title-view {
  width: 540px;
  height: 144px;
}
.library-image {
  >>> .el-form-item--small.el-form-item  {
    margin-bottom: 24px;
  }
  >>> .w-textarea{
    margin-bottom: 0;
  }
}
.library-image{
  /* padding-top: 12px; */
}
.guide-text {
  height: 22px;
  font-size: 14px;
  color: #595959;
  line-height: 22px;
  font-weight: 400;
  margin-bottom: 8px;
  margin-top: 16px;
}
.guide-input {
  height: 140px;
}
.upload-view {
  width: 114px;
  background: #f5f5f5;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.guide-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s;
  font-size: 16px;
  color: #fff;
  text-align: center;
  line-height: 114px;
  border-radius: var(--default-radius-mini);
  &:hover {
    opacity: 1;
  }
  svg {
    cursor: pointer;
  }
  svg + svg {
    margin-left: var(--default-margin-small);
  }
}

.dialog-footer {
  margin-top: 47px;
}
.diag-view {
  width: 72px;
  height: 32px;
  margin-left: 16px;
  font-size: 14px;
  font-weight: 400;
  border-radius: 2px;
}

@component-namespace library {
  @b image {
    @e list {
      width: 300px;
      list-style: none;
      padding: 0;
      margin-bottom: var(--default-margin-small);
      > li {
        float: left;
        position: relative;
        margin: 0 var(--default-margin-small) var(--default-margin-small) 0;
      }
    }
    @e item {
      font-size: 0;
      > img {
        width: 90px;
        height: 90px;
        border-radius: var(--default-radius-mini);
        object-fit: cover;
        border: 1px solid #e8e8e8;
      }
    }
    @e mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      background-color: rgba(0, 0, 0, 0.5);
      transition: opacity 0.3s;
      font-size: 16px;
      color: #fff;
      text-align: center;
      line-height: 90px;
      border-radius: var(--default-radius-mini);
      &:hover {
        opacity: 1;
      }
      svg {
        cursor: pointer;
      }
      svg + svg {
        margin-left: var(--default-margin-small);
      }
    }
  }
  @b uploader {
    >>> .el-upload--picture-card {
      width: 80px;
      height: 80px;
      border: none;
      background-color: transparent;
      color: #8c8c8c;
      line-height: 80px;
      border-radius: var(--default-radius-mini);
      &:hover {
        /* border-color: var(--theme-color-primary); */
        /* color: var(--theme-color-primary); */
      }
    }
  }
  @b guide-uploader {
    >>> .el-upload--picture-card {
      width: 80px;
      height: 80px;
      border: none;
      background-color: transparent;
      color: #8c8c8c;
      line-height: 80px;
      border-radius: var(--default-radius-mini);
      border-radius: 2px;
      &:hover {
        /* border-color: var(--theme-color-primary); */
        /* color: var(--theme-color-primary); */
      }
    }
  }
  @b select-uploader {
    z-index: 100;
    display: inline-block;
    >>> .el-upload--picture-card {
      width: 90px;
      height: 90px;
      /* border: dashed 1px #dcdfe6; */
      background-color: transparent;
      font-size: 18px;
      color: #8c8c8c;
      line-height: 88px;
      border-radius: var(--default-radius-mini);
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover {
        border-color: var(--theme-color-primary);
        color: var(--theme-color-primary);
      }
    }
  }
  @b popover {
    display: flex;
    flex-direction: row;
    align-items: center;
    >>> .popover-base {
      width: 80px;
      height: 80px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    >>> .popver-image {
      width: 35px;
      height: 30px;
      color: red;
    }
    >>> .popver-text {
      font-size: 12px;
      color: #303133;
      line-height: 20px;
      font-weight: 400;
      margin-top: 5px;
    }
    >>> .popover-icon {
      font-size: 35px;
      color: #383838;
    }
  }
  @b catalogue {
    @e text {
      vertical-align: middle;
      & + button {
        margin-left: var(--default-margin-larger);
      }
    }
  }
  >>> .el-form-grid {
    margin-left: var(--default-margin-larger);
  }
  @b guide {
    background: #ffffff;
    border-radius: ;
    display: block;
    width: 114px;
    display: flex;
    align-items: center;
    justify-content: center;
    >>> .el-upload-dragger {
      width: 114px;
      height: 114px;
      border: none;
      background-color: transparent;
      &:hover {
      }
    }
    >>> .el-upload-remind {
      font-size: 14px;
      color: #8c8c8c;
      text-align: center;
      line-height: 22px;
      font-weight: 400;
    }
    >>> .uploading-icon {
      margin-top: 20px;
      width: 60px;
      height: 46px;
      color: #0094fc;
    }
  }
  @b guide-remind {
    >>> .el-textarea__inner {
      height: 112px;
      font-size: 14px;
      line-height: 22px;
      font-weight: 400;
    }
  }
}
</style>
