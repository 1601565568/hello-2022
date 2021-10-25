<template>
  <div class='poster-content'>
    <el-upload
      :disabled="disabled"
      class="upload-demo"
      ref='upload'
      :drag='drag'
      accept=".jpg,.jpeg,.png"
      :action="$api.core.sgUploadFile('test')"
      :on-remove='handleRemove'
      :show-file-list='false'
      :before-upload="beforeUpload"
      :on-success="handleUploadSuccess">
      <template v-if='drag'>
        <i class="el-icon-upload"></i>
        <div v-if="uploadTitle.length > 0" class="upload-title">{{uploadTitle}}</div>
        <div v-else class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip" v-if='tip'>{{tip}}</div>
      </template>
    </el-upload>
    <div :class='"el-upload-list el-upload-list--text "+!showFooter && "padingbottom"' v-if='fileList'>
      <div class='el-upload-list__item'>
        <a class="el-upload-list__item-name">
          <i class="el-icon-document"></i>
          {{getFileName(fileList)}}
        </a>
        <label class="el-upload-list__item-status-label" v-if="showDelImg">
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <i class="el-icon-close" @click='handleRemove(false)'></i>
          </el-tooltip>
        </label>
        <label class="el-upload-list__item-status-label reset" v-if='resetImage'>
          <el-tooltip class="item" effect="dark" content="还原默认图" placement="top">
            <i class="el-icon-refresh" @click='handleReset'></i>
          </el-tooltip>
        </label>
      </div>
    </div>
    <div class='poster-set_content' v-if='showFooter'>
      <span class='yellow-point' v-if='showPont'></span>
      <div>
        <slot name='footer'></slot>
        <!-- <p class='prompt-text'>公司logo和招募码为固定位置，建议尺寸为70*70</p>
        <p class='prompt-text'>logo获取导购后台-公司logo；门店名称和导购姓名动态获取当前导购的信息</p> -->
      </div>
    </div>
    <el-dialog
      title="上传图片"
      width='1053px'
      :append-to-body="true"
      :visible.sync="visible"
    >
      <Cropper ref='cropper' v-if='img' :img='img' :fixedNumber='cropScale'/>
      <div slot="footer" class="dialog-footer">
        <div style='margin-right:10px;'>
          <el-upload
            accept=".jpg,.jpeg,.png"
            :action="$api.core.sgUploadFile('test')"
            :show-file-list='false'
            :before-upload="beforeUpload"
            >
            <ns-button :loading='upDataLoad' type="primary">重新上传</ns-button>
          </el-upload>
        </div>
        <ns-button :loading='upDataLoad' @click='handleCancel'>取 消</ns-button>
        <ns-button :loading='upDataLoad' type="primary" @click='handleSaveImg'>确 定</ns-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ElUpload from '@nascent/nui/lib/upload'
import Cropper from './Cropper'
import { fileName } from '@/utils/fileName'
export default {
  data () {
    return {
      fileList: '',
      visible: false,
      img: null,
      upDataLoad: false,
      fileName: ''
    }
  },
  components: { ElUpload, Cropper },
  computed: {
    // 需要裁剪图片的裁剪比例
    cropScale () {
      if (!this.isNeedCrop) {
        return null
      }
      if (this.maxWidth && this.maxHeight) {
        return [this.maxWidth, this.maxHeight]
      }
      if (this.scale) {
        return this.decimalsToFractional(this.scale).split('/')
      }
      return [1, 1]
    }
  },
  props: {
    // 图片类型 需要大写
    imgType: {
      default () {
        return ['JPG', 'PNG', 'JPEG']
      },
      type: Array
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
    resetImage: {
      type: String,
      default: ''
    },
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
    },
    // 是否需要裁剪
    isNeedCrop: {
      default: false
    },
    // 上传提示标题
    uploadTitle: {
      type: String,
      default: ''
    },
    // 删除图片按钮是否显示
    showDelImg: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getFileName (url) {
      return fileName(url)
    },
    // 小数转分数
    decimalsToFractional (decimals) {
      const formatDecimals = decimals.toFixed(2)
      let denominator = 100// 初始化分母
      let numerator = formatDecimals * 100// 初始化分子
      let bigger = 0
      function recursion () {
        bigger = denominator > numerator ? denominator : numerator
        for (let i = bigger; i > 1; i--) {
          if (Number.isInteger(numerator / i) && Number.isInteger(denominator / i)) {
            numerator = numerator / i
            denominator = denominator / i
            recursion()
          }
        }
      }
      recursion()
      return `${numerator}/${denominator}`
    },
    // 截图上传之前钩子
    beforeUploadByCrop (file) {
      const fileObj = new FileReader()
      fileObj.onload = (e) => {
        this.img = e.target.result
        this.visible = true
      }
      fileObj.readAsDataURL(file)
      return false
    },
    // 上传之前钩子
    beforeUpload (file) {
      // 图片格式判断
      const { name = '' } = file
      const toUpperCaseName = name.split('.')[name.split('.').length - 1].toUpperCase()
      if (!this.imgType.includes(toUpperCaseName)) {
        this.$notify.error(`仅支持${this.imgType.join('/')}的图片格式`)
        return false
      }
      if (file.size / 1024 / 1024 > this.maxSize) {
        this.$notify.error(`上传图片不能超过${this.maxSize}M`)
        return false
      }
      // 如果需要裁剪则不上传
      if (this.isNeedCrop) {
        this.fileName = file.name
        this.beforeUploadByCrop(file)
        return false
      }
      return new Promise((resolve, reject) => {
        const _URL = window.URL || window.webkitURL
        const img = new Image()
        img.src = _URL.createObjectURL(file)
        img.onload = () => {
          const { width, height } = img
          let valid = true
          if (this.maxWidth || this.maxHeight) {
            valid = (!this.maxWidth || this.maxWidth === width) && (!this.maxHeight || this.maxHeight === height)
          } else if (this.scale) {
            valid = (width / height) === this.scale
          }
          if (valid) {
            resolve(file)
            this.fileList = file.name
          } else {
            this.fileList = this.value
            const msg = `上传图片尺寸只能是${this.maxWidth && this.maxHeight ? this.maxWidth + 'x' + this.maxHeight : this.maxWidth ? '宽' + this.maxWidth : this.scaleTip}`
            this.$notify.error(msg)
          }
        }
      })
    },

    // 截图
    async handleSaveImg () {
      if (this.$refs.cropper) {
        this.upDataLoad = true
        const url = await this.$refs.cropper.getImage()
        await this.upDataBase64(url)
        this.upDataLoad = false
        this.handleCancel()
      }
    },
    // base64 上传
    upDataBase64 (file) {
      return new Promise(resolve => {
        this.$http.fetch(this.$api.weWork.friendsCircle.uploadBase64File, { file, originalFileName: this.fileName }).then(res => {
          this.handleUploadSuccess(res)
          resolve(true)
        })
      })
    },
    // 关闭裁剪弹框
    handleCancel () {
      this.visible = false
    },
    // 上传完成钩子
    handleUploadSuccess (res) {
      if (this.maxWidth) {
        this.$emit('input', res.result.url + '?x-oss-process=image/resize,w_' + this.maxWidth + ',limit_0')
      } else {
        this.$emit('input', res.result.url)
      }
    },
    // 删除文件钩子
    handleRemove (file) {
      if (!file || !this.isNeedCrop) {
        this.$emit('input', '')
      }
    },
    // 还原
    handleReset () {
      this.$emit('input', this.resetImage)
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
.poster-content {
  >>> .el-upload--text {
    width: 100%;
    .el-upload-dragger {
      width: 100%
    }
  }
}
.poster-content {
  padding: 16px;
  padding-bottom: 0;
  background-color: #F5F5F5;
  .poster-set_content {
    padding-top: 16px;
    position: relative;
    &::before {
      border-top:1px solid #E8E8E8;
      position: absolute;
      left: -16px;
      right: -16px;
      top: 0;
      content: ' ';
    }
    >>> .el-col {
      margin-bottom: 24px;
    }
    >>> .el-radio {
      margin-right: 0;
    }
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
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
.upload-title {
  font-size: 14px;
  color: #8C8C8C;
  line-height: 22px;
}
</style>
