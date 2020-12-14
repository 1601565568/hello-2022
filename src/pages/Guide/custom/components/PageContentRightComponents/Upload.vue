<template>
  <div class="custom_banner">
    <el-form>
      <div class="upload">
        <div class="upload-title">上传图片</div>
        <el-radio-group v-model="data.type">
          <el-radio :label="1">单行大图</el-radio>
          <el-radio :label="2">轮播图片</el-radio>
        </el-radio-group>
        <div class="custom-upload">
          <el-upload
            class="upload-demo"
            drag
            :disabled="data.image && data.image.length == 9"
            :action="$api.core.sgUploadFile('test')"
            accept=".jpg,.jpeg,.png"
            multiple
            :limit="9"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <div class="el-upload__text">
              <i class="el-icon-plus"></i><span>新增轮播图</span>
            </div>
          </el-upload>
          <div class="prompt-text">
            <p><span class="yellow-point"></span></p>
            <span class="prompt-text__text"
              >建议：宽度750像素，高度不限，小于100kb，jpg、png、jpeg格式</span
            >
          </div>
        </div>
        <template v-if="data.image.length > 0">
          <div class="upload-table">
            <div>图片</div>
            <div class="upload-table__line">排序</div>
            <div class="upload-table__line">操作</div>
          </div>
          <div
            class="upload-table__list"
            v-for="(item, index) in data.image"
            :key="index"
          >
            <div class="upload-table__list__pic">
              <img class="pic" :src="item" />
            </div>
            <div class="upload-table__list__icon">
              <span
                ><i
                  class="el-icon-download list__icon-top"
                  v-if="index !== 0"
                  @click="handlemoveTopping(item, index)"
                ></i
              ></span>
              <span
                ><i
                  class="el-icon-top"
                  @click="handlemoveUp(item, index)"
                  v-if="index !== 0 && index > 0"
                ></i
              ></span>
              <span
                ><i
                  class="el-icon-bottom"
                  @click="handlemoveDown(item, index)"
                  v-if="index !== data.image.length - 1"
                ></i
              ></span>
              <span
                ><i
                  class="el-icon-download"
                  v-if="index !== data.image.length - 1"
                  @click="handlemoveBottom(item, index)"
                ></i
              ></span>
              <span v-if="data.image.length === 1">-</span>
            </div>
            <div>
              <el-upload
                :action="$api.core.sgUploadFile('test')"
                multiple
                :limit="1"
                :show-file-list="false"
                :on-success="
                  (res, file) => {
                    handleChangePicture(res, file, index)
                  }
                "
                :before-upload="beforeAvatarUpload"
              >
                <ns-button type="text">更换图片</ns-button>
              </el-upload>
              <ns-button type="text" @click="handleDelPic(index)"
                >删除</ns-button
              >
            </div>
          </div>
          <h3>样式设计</h3>
          <el-form-item label="透明度" style="margin-right: 10px;">
            <div class="sliderinput">
              <slider-input v-model="data.transparency" :max="100" :step="1"
                >个单位</slider-input
              >
            </div>
          </el-form-item>
          <el-form-item label="播放间隔" style="margin-right: 10px;">
            <div class="sliderinput">
              <slider-input v-model="data.interval" :max="10" :step="1"
                >秒</slider-input
              >
            </div>
            <div class="prompt-text">
              <p><span class="yellow-point"></span></p>
              <span class="prompt-text__text"
                >支持（1-10）之间整数，0默认为不播放</span
              >
            </div>
          </el-form-item>
        </template>
      </div>
    </el-form>
  </div>
</template>
<script>
import SliderInput from '@/components/NewUi/SliderInput'
import ElUpload from '@nascent/nui/lib/upload'
export default {
  components: { ElUpload, SliderInput },
  props: {
    childrenEditData: {
      type: Object
    }
  },
  data () {
    return {
      data: JSON.parse(JSON.stringify(this.childrenEditData))
    }
  },
  watch: {
    childrenEditData: {
      handler (newValue, oldValue) {
        if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
          this.data = JSON.parse(JSON.stringify(newValue))
        }
      },
      deep: true,
      immediate: true
    },
    data: {
      handler (val) {
        this.$emit('change', val)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handlemoveTopping (item, index) {
      let items = this.data.image[0]
      this.$set(this.data.image, index, items)
      this.$set(this.data.image, 0, item)
    },
    handlemoveUp (item, index) {
      let items = item
      this.$set(this.data.image, index, this.data.image[index - 1])
      this.$set(this.data.image, index - 1, item)
    },
    handlemoveDown (item, index) {
      let items = item
      this.$set(this.data.image, index, this.data.image[index + 1])
      this.$set(this.data.image, index + 1, item)
    },
    handlemoveBottom (item, index) {
      let len = this.data.image.length - 1
      let items = this.data.image[len]
      this.$set(this.data.image, index, items)
      this.$set(this.data.image, len, item)
    },
    // 限制上传个数
    handleExceed (files, fileList) {
      this.$notify.error(
        `最大上限9张图片，本次选择了 ${
          files.length
        } 个，共选择了 ${files.length + fileList.length} 个`
      )
    },
    // 处理上传图片
    handleAvatarSuccess: function (res, file) {
      if (this.data.image.length < 9) {
        this.data.image.push(res.result.url)
      }
    },
    beforeAvatarUpload (file) {
      if (file.size / 1024 > 1024) {
        this.$notify.warning('上传图片不得大于1MB')
        return false
      }
      // 图片格式判断
      if (!/\.(gif|jpg|jpeg|png|bmp|BMP|GIF|JPG|PNG|JPEG)$/.test(file.name)) {
        this.$notify.error('仅支持jpg/jepg/png的图片格式')
        return false
      }
    },
    // 图片替换
    handleChangePicture (res, file, index) {
      this.$set(this.data.image, index, res.result.url)
    },
    handleDelPic (index) {
      this.data.image.splice(index, 1)
    }
  }
}
</script>
<style>
/* upload */
.custom-upload .el-upload--text {
  width: 100%;
}
.custom-upload .el-upload-dragger {
  width: 100%;
  height: 40px;
  line-height: 40px;
  color: #606266;
}
.custom-upload .el-upload-dragger span {
  display: inline-block;
  margin-left: 8px;
}
.custom_banner .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #0091fa;
  border-color: #0091fa;
}
.custom_banner .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #0091fa;
  border-color: #0091fa;
}
.custom_banner .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #262626;
}
.custom_banner .el-radio__label,
.el-checkbox__label {
  font-size: 14px !important;
  color: #262626 !important;
}
</style>
<style lang="scss" scoped>
.PageContentRightupload {
  color: #262626;
}
.upload-title {
  height: 40px;
  line-height: 40px;
}
.prompt-text {
  display: flex;
  align-items: flex-start;
  color: #595959;
  .yellow-point {
    background: #f2aa18;
    display: inline-block;
    height: 8px;
    width: 8px;
    border-radius: 50%;
    margin-right: 8px;
  }
  .prompt-text__text {
    flex: 1;
  }
}
.upload-table {
  margin-top: 10px;
  display: flex;
  height: 40px;
  background: #f5f5f5;
  border-bottom: 1px solid #e8e8e8;
  div {
    flex: 1;
    padding-left: 9px;
    font-weight: bold;
    line-height: 40px;
  }
  .upload-table__line {
    position: relative;
    &::before {
      position: absolute;
      content: '';
      top: 50%;
      transform: translate(0%, -50%);
      left: 0;
      width: 1px;
      height: 24px;
      background: #e8e8e8;
    }
  }
}
.upload-table__list {
  display: flex;
  height: 80px;
  border-bottom: 1px solid #e8e8e8;
  > div {
    flex: 1;
    display: flex;
    align-items: center;
    padding-left: 9px;
  }
  .upload-table__list__pic {
    img {
      width: 60px;
      height: 60px;
    }
  }
  .upload-table__list__icon {
    color: #0091fa;
    .list__icon-top {
      transform: rotate(180deg);
    }
    span {
      display: inline-block;
      width: 16px;
      height: 16px;
    }
    i {
      display: inline-block;
      margin-right: 8px;
      font-size: 16px;
    }
  }
}
h3 {
  margin-top: 25px;
  font-size: 14px;
}
.slider-input {
  height: 28px;
}
.sliderinput {
  padding-left: 70px;
}
</style>
