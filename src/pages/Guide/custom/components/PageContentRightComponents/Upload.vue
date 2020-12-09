<template>
  <el-form>
    <div class="upload">
      <div class="upload-title">上传图片</div>
      <el-radio-group v-model="radio">
        <el-radio :label="1">单行大图</el-radio>
        <el-radio :label="2">轮播图片</el-radio>
      </el-radio-group>
      <div class="custom-upload">
        <el-upload
          class="upload-demo"
          drag
          action="https://jsonplaceholder.typicode.com/posts/"
          multiple
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
      <template>
        <div class="upload-table">
          <div>图片</div>
          <div class="upload-table__line">排序</div>
          <div class="upload-table__line">操作</div>
        </div>
        <div class="upload-table__list">
          <div class="upload-table__list__pic">
            <img
              class="pic"
              src="https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2974706256,1511610652&fm=111&gp=0.jpg"
            />
          </div>
          <div class="upload-table__list__icon">
            <i class="el-icon-download list__icon-top"></i
            ><i class="el-icon-top"></i><i class="el-icon-bottom"></i
            ><i class="el-icon-download"></i>
          </div>
          <div>
            <ns-button type="text">更换图片</ns-button
            ><ns-button type="text">删除</ns-button>
          </div>
        </div>
        <h3>样式设计</h3>
        <el-form-item label="透明度" style="margin-right: 10px;">
          <div class="sliderinput">
            <slider-input v-model="aaa" :max="100" :step="1"
              >个单位</slider-input
            >
          </div>
        </el-form-item>
        <el-form-item label="播放间隔" style="margin-right: 10px;">
          <div class="sliderinput">
            <slider-input v-model="aa" :max="10" :step="1">秒</slider-input>
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
</template>
<script>
import SliderInput from '@/components/NewUi/SliderInput'
import ElUpload from '@nascent/nui/lib/upload'
export default {
  components: { ElUpload, SliderInput },
  data () {
    return {
      radio: 1,
      aa: 0,
      aaa: 0
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
  div {
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
