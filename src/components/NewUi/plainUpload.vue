<template>
  <div class='plain-content'>
    <el-upload
      class="upload-demo"
      ref='upload'
      accept=".pdf"
      :limit='limit'
      :show-file-list='false'
      :action="$api.core.sgUploadFile('test')"
      :on-remove='handleRemove'
      :before-upload="beforeUpload"
      :file-list="fileList"
      :on-success="handleUploadSuccess">
      <div v-loading="loading" class="u_btn"><img src='@/assets/btn.png' /></div>
    </el-upload>
    <div :class='"el-upload-list el-upload-list--text "+!ßßshowFooter && "padingbottom"' v-if='fileList.length > 0'>
      <div class='el-upload-list__item' v-for="(item, index) in fileList" :key="index">
        <a class="el-upload-list__item-name">
          <i class="el-icon-document"></i>
          {{item.name}}
        </a>
        <label class="el-upload-list__item-status-label">
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <i class="el-icon-close" @click='handleRemove(index)'></i>
          </el-tooltip>
        </label>
      </div>
    </div>
    <div v-else>
      <div class="register_content"><span class='yellow-point'></span><span class='prompt-text'>最大上传10M、PDF格式</span></div>
    </div>
  </div>
</template>
<script>
import ElUpload from '@nascent/nui/lib/upload'
export default {
  data () {
    return {
      loading: false,
      videoUploadPercent: '0',
      fileList: []
    }
  },
  components: { ElUpload },
  props: {
    file_list: {
      default () {
        return []
      },
      type: Array
    },
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
    // 如果有maxWidth或者maxHeight，此属性无效  w/h
    scale: {
      type: Number
    }
  },
  methods: {
    // 上传之前钩子
    beforeUpload (file) {
      // PDF格式判断
      const { name = '' } = file
      const toUpperCaseName = name.split('.')[name.split('.').length - 1].toUpperCase()
      if (!this.imgType.includes(toUpperCaseName)) {
        this.$notify.error(`仅支持上传${this.imgType.join('/')}的格式`)
        return false
      }
      if (file.size / 1024 / 1024 > this.maxSize) {
        this.$notify.error(`上传PDF不能超过${this.maxSize}M`)
        return false
      }
      this.loading = true
    },
    // 上传完成钩子
    handleUploadSuccess (res) {
      this.fileList.push({
        name: res.result.originalFileName,
        url: res.result.url
      })
      this.loading = false
      this.$emit('onSuccess', this.fileList)
    },
    // 删除文件钩子
    handleRemove (index) {
      this.fileList.splice(index, 1)
      this.$emit('onRemove', this.fileList)
    },
    uploadVideoProcess (event, file, fileList) {
      this.videoUploadPercent = Math.floor(event.percent)
    }
  },
  watch: {
    file_list: {
      handler (newVal) {
        if (newVal.length > 0 && newVal[0].url) {
          this.fileList = newVal
        }
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
.register_content {
  display: flex;
  align-items: flex-start;
  padding-top: 18px;
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
