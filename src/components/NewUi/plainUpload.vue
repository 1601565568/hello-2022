<template>
  <div class='plain-content'>
    <el-upload
      class="upload-demo"
      ref='upload'
      accept=".pdf"
      :show-file-list='false'
      :action="$api.core.sgUploadFile('test')"
      :on-remove='handleRemove'
      :before-upload="beforeUpload"
      :on-success="handleUploadSuccess">
      <div class="u_btn"><img src='@/assets/btn.png' /></div>
    </el-upload>
    <div :class='"el-upload-list el-upload-list--text "+!ßßshowFooter && "padingbottom"' v-if='fileList'>
      <div class='el-upload-list__item'>
        <a class="el-upload-list__item-name">
          <i class="el-icon-document"></i>
          {{fileList}}
        </a>
        <label class="el-upload-list__item-status-label">
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <i class="el-icon-close" @click='handleRemove'></i>
          </el-tooltip>
        </label>
      </div>
    </div>
  </div>
</template>
<script>
import ElUpload from '@nascent/nui/lib/upload'
export default {
  data () {
    return {
      fileList: ''
    }
  },
  components: { ElUpload },
  props: {
    // 类型 需要大写
    imgType: {
      default () {
        return ['PDF']
      },
      type: Array
    },
    limit: {
      default () {
        return 1
      },
      type: Number
    },
    // 最大尺寸m单位
    maxSize: {
      type: Number,
      default: 10
    },
    // 最大宽度 px
    maxWidth: {
      type: Number
    },
    // 最大高度 px
    maxHeight: {
      type: Number
    },
    // 如果有maxWidth或者maxHeight，此属性无效  w/h
    scale: {
      type: Number
    },
    // 比例不符合的提示
    scaleTip: {
      type: String
    },
    // 提示
    tip: {
      type: String
    },
    value: {
      type: String
    },
    // 还原图片地址，没有不现实还原按钮
    showPont: {
      type: Boolean,
      default: true
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    // 是否拖拽
    drag: {
      default: true
    }
  },
  methods: {
    // 上传之前钩子
    beforeUpload (file) {
      // PDF格式判断
      const { name = '' } = file
      const toUpperCaseName = name.split('.')[name.split('.').length - 1].toUpperCase()
      if (!this.imgType.includes(toUpperCaseName)) {
        this.$notify.error(`仅支持${this.imgType.join('/')}上传的PDF格式`)
        return false
      }
      if (file.size / 1024 / 1024 > this.maxSize) {
        this.$notify.error(`上传PDF不能超过${this.maxSize}M`)
        return false
      }
    },
    // 上传完成钩子
    handleUploadSuccess (res) {
      this.$emit('input', res.result.url)
    },
    // 删除文件钩子
    handleRemove () {
      this.$emit('input', '')
    }
  },
  watch: {
    value: {
      handler (newVal) {
        this.fileList = newVal
      },
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./styles/reset.css";
.poster-set_content {
  display: flex;
  align-items: flex-start;
  padding:16px 0;
  .yellow-point {
    display: inline-block;
    background: #F2AA18;
    height: 8px;
    width: 8px;
    border-radius: 50%;
    margin-right: 8px;
    line-height: 20px;
    position: relative;
    top: 6px;
  }
  .prompt-text {
    font-size: 12px;
    color: #595959;
    line-height: 20px;
  }
}
.el-upload-list__item-name {
  margin-right: 60px;
}
.el-upload-list__item-status-label {
  display: block;
  cursor: pointer;
  &.reset {
    right: 36px;
  }
}
.el-upload-list__item .el-icon-close {
  display: block
}
.padingbottom {
  padding-bottom: 16px;
}
.u_btn{
    display: block;
    height: 32px;
    width: 108px;
    img{
        height: 100%;
        width: 100%;
        vertical-align: top;
    }
}
</style>
