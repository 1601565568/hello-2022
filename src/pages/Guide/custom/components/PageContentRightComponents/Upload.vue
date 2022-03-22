<template>
  <div class="custom_banner">
    <el-form>
      <div class="upload">
        <div class="upload-title">上传图片</div>
        <el-radio-group v-model="data.type" :class="[ENV === 'QA'? colorQA:colorNormal]">
          <el-radio :label="1">单行大图</el-radio>
          <el-radio :label="2">轮播图片</el-radio>
        </el-radio-group>
        <div class="custom-upload" v-if="data.image && data.image.length < 9">
          <el-upload
            class="upload-demo"
            :class="[ENV ==='QA' && 'styQA']"
            drag
            :action="$api.core.sgUploadFile('test')"
            accept=".jpg,.jpeg,.png"
            multiple
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
        <div class="addMenu" v-else>
          <i class="el-icon-plus"></i><span>新增轮播图</span>
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
            <div class="upload-table__list__icon" :class="[ENV === 'QA'? colorQA:colorNormal]"  >
              <span v-if="index !== 0"
                ><i
                  class="el-icon-download list__icon-top"
                  @click="handlemoveTopping(item, index)"
                ></i
              ></span>
              <span v-if="index !== 0 && index > 0"
                ><i class="el-icon-top" @click="handlemoveUp(item, index)"></i
              ></span>
              <span v-if="index !== data.image.length - 1"
                ><i
                  class="el-icon-bottom"
                  @click="handlemoveDown(item, index)"
                ></i
              ></span>
              <span v-if="index !== data.image.length - 1"
                ><i
                  class="el-icon-download"
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
              <ns-button
                class="del-pic-list"
                type="text"
                @click="handleDelPic(index)"
                >删除</ns-button
              >
            </div>
          </div>
          <h3>样式设计</h3>
          <el-form-item label="透明度" style="margin-right: 10px;">
            <div :class="[ENV === 'QA' ? 'sliderinputQA':'sliderinput']">
              <slider-input v-model="data.transparency" :max="100" :step="1"
                >个单位</slider-input
              >
            </div>
          </el-form-item>
          <el-form-item
            v-if="data.type === 2"
            label="播放间隔"
            style="margin-right: 10px;"
          >
            <div  :class="[ENV === 'QA' ? 'sliderinputQA':'sliderinput']">
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
    <DelTips :tipsShow='delPicShow' @onCancel="delPicShow = false" @onConfirm="onConfirmDelPic"><slot>确认是否删除图片?</slot></DelTips>
    <!-- <el-dialog :visible.sync="delPicShow" width="30%">
      <div class="tipsShowTitle" slot="title">提示信息</div>
      <div class="tipsShowContent">
        <span class="ns-warm-cricle">!</span>确认是否删除图片?
      </div>
      <span slot="footer" class="dialog-footer">
        <ns-button @click="delPicShow = false">取 消</ns-button>
        <ns-button type="primary" @click="onConfirmDelPic">确 定</ns-button>
      </span>
    </el-dialog> -->
  </div>
</template>
<script>
import SliderInput from '@/components/NewUi/SliderInput'
import ElUpload from '@nascent/nui/lib/upload'
import DelTips from '../pageComponents/delTips'
export default {
  components: { ElUpload, SliderInput, DelTips },
  props: {
    childrenEditData: {
      type: Object
    }
  },
  data () {
    return {
      data: JSON.parse(JSON.stringify(this.childrenEditData)),
      delPicShow: false,
      delIndex: 0,
      ENV: process.env.VUE_APP_THEME,
      colorQA: 'colorQA',
      colorNormal: 'colorNormal'
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
    // 处理上传图片
    handleAvatarSuccess: function (res, file) {
      if (this.data.image.length < 9) {
        this.data.image.push(res.result.url)
      }
    },
    beforeAvatarUpload (file) {
      // 图片格式判断
      if (!/\.(jpg|jpeg|png|JPG|PNG|JPEG)$/.test(file.name)) {
        this.$notify.error('仅支持jpg/jpeg/png的图片格式')
        return false
      }
      if (file.size / 1024 > 1024) {
        this.$notify.warning('上传图片不得大于1MB')
        return false
      }
    },
    // 图片替换
    handleChangePicture (res, file, index) {
      this.$set(this.data.image, index, res.result.url)
    },
    handleDelPic (index) {
      this.delIndex = index
      this.delPicShow = true
    },
    onUpload () {
      if (this.data && this.data.image.length >= 9) {
        this.$notify.error('图片上传数量达到上限')
      }
    },
    onConfirmDelPic () {
      this.data.image.splice(this.delIndex, 1)
      this.delPicShow = false
    }
  }
}
</script>
<style >
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
    justify-content: flex-start;
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
      cursor: pointer;
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

.sliderinput, .sliderinputQA  {
  padding-left: 70px;
}
.del-pic-list {
  margin-left: 10px;
}
.addMenu {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  border-radius: 6px;
  color: #bfbfbf;
  cursor: no-drop;
  border: 1px dashed #d9d9d9;
  background: #f5f5f5;
  span {
    display: inline-block;
    margin-left: 10px;
  }
}
.upload-demo:hover .el-upload__text {
  color: #0091fa;
}
</style>
<style scoped>
.styQA >>> .el-upload__text:hover{
  color: #2153D4;
}
.colorQA >>> .el-radio__input.is-checked .el-radio__inner{
  background: #2153D4;
    border-color: #2153D4;
}
.colorQA{
  color: #2153D4!important;
}
.colorNormal{
  color: #0091fa!important;
}
.sliderinputQA >>> .el-slider__bar{
  background-color:#2153D4!important ;
}
</style>
