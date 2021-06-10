<template>
  <div class='poster-content'>
    <el-upload
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
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip" v-if='tip'>{{tip}}</div>
      </template>
    </el-upload>
    <div :class='"el-upload-list el-upload-list--text "+!showFooter && "padingbottom"' v-if='fileList'>
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
      title="选择品牌"
      :append-to-body="true"
      :visible="visible"
    >
      <Cropper v-if='img' :img='img'/>
    </el-dialog>
  </div>
</template>
<script>
import ElUpload from '@nascent/nui/lib/upload'
import Cropper from './Cropper'
export default {
  data () {
    return {
      fileList: '',
      visible: false,
      img: null
    }
  },
  components: { ElUpload, Cropper },
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
    }
  },
  methods: {
    // 上传之前钩子
    // beforeUpload (file) {
    //   // 图片格式判断
    //   const { name = '' } = file
    //   const toUpperCaseName = name.split('.')[name.split('.').length - 1].toUpperCase()
    //   if (!this.imgType.includes(toUpperCaseName)) {
    //     this.$notify.error(`仅支持${this.imgType.join('/')}的图片格式`)
    //     return false
    //   }
    //   if (file.size / 1024 / 1024 > this.maxSize) {
    //     this.$notify.error(`上传图片不能超过${this.maxSize}M`)
    //     return false
    //   }
    //   return new Promise((resolve, reject) => {
    //     const _URL = window.URL || window.webkitURL
    //     const img = new Image()
    //     img.src = _URL.createObjectURL(file)
    //     img.onload = () => {
    //       const { width, height } = img
    //       let valid = true
    //       if (this.maxWidth || this.maxHeight) {
    //         valid = (!this.maxWidth || this.maxWidth === width) && (!this.maxHeight || this.maxHeight === height)
    //       } else if (this.scale) {
    //         valid = (width / height) === this.scale
    //       }
    //       if (valid) {
    //         resolve(file)
    //         this.fileList = file.name
    //       } else {
    //         this.fileList = this.value
    //         const msg = `上传图片尺寸只能是${this.maxWidth && this.maxHeight ? this.maxWidth + 'x' + this.maxHeight : this.maxWidth ? '宽' + this.maxWidth : this.scaleTip}`
    //         this.$notify.error(msg)
    //       }
    //     }
    //   })
    // },
    beforeUpload (file) {
      // let reader = new FileReader()
      // let rs = reader.readAsArrayBuffer(file)
      // console.log(reader)
      // let blob = null
      // reader.onload = (e) => {
      //   console.log(e)
      //   if (typeof e.target.result === 'object') {
      //     blob = new Blob([e.target.result])
      //   } else {
      //     blob = e.target.result
      //   }
      //   console.log(blob)
      //   this.img = blob
      //   this.visible = true
      // }
      // return false
      const reader = new FileReader()
      reader.onload = function (e) {
        // target.result 该属性表示目标对象的DataURL
        console.log(e.target.result)
      }
      // 传入一个参数对象即可得到基于该参数对象的文本内容
      reader.rederAsDataURL(file)
    },
    // 上传完成钩子
    handleUploadSuccess (res) {
      this.$emit('input', res.result.url)
    },
    // 删除文件钩子
    handleRemove () {
      this.$emit('input', '')
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
</style>
