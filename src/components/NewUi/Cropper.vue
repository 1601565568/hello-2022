<template>
  <div class='cropper-content'>
    <div class='cropper-main'>
      <vueCropper
        ref="cropper"
        :outputSize="option.size"
        :outputType="option.outputType"
        :info="true"
        :full="option.full"
        :canMove="option.canMove"
        :canMoveBox="option.canMoveBox"
        :original="option.original"
        :autoCrop="option.autoCrop"
        :fixed="option.fixed"
        :fixedNumber="fixedNumber"
        :centerBox="option.centerBox"
        :infoTrue="option.infoTrue"
        :fixedBox="option.fixedBox"
        :autoCropWidth='option.autoCropWidth'
        :autoCropHeight='option.autoCropHeight'
        :img="img"
        @realTime="realTime"
      ></vueCropper>
    </div>
    <div class='preview-content' :style='`width:${previewStyle.width}`'>
      <div class='cropper-preview' :style='previewStyle'>
        <div :style='{...preview.div,transform: `scale(${divScale})`}' class='preview-div'>
          <img :style='preview.img' :src='preview.url'/>
        </div>
      </div>
      <p class='tip'> 裁剪预览 </p>
      <p class='tip'> {{fixedNumber.join(':')}} </p>
    </div>
  </div>
</template>
<script>
import { VueCropper } from 'vue-cropper'
export default {
  data () {
    return {
      option: {
        info: true, // 裁剪框的大小信息
        outputSize: 1, // 裁剪生成图片的质量
        outputType: 'png', // 裁剪生成图片的格式
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        full: true, // 是否输出原图比例的截图
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        autoCropWidth: 9999, // 截图框是否被限制在图片里面
        autoCropHeight: 9999 // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      },
      // 预览图片样式
      preview: {
        div: '',
        img: '',
        url: ''
      },
      // 预览div的缩放比例
      divScale: 1,
      // 预览默认尺寸
      previewDefault: {
        w: 400,
        h: 500
      }
    }
  },
  computed: {
    // 预览的div大小
    previewStyle () {
      if (this.fixedNumber && this.fixedNumber.length > 1) {
        const scale = this.fixedNumber[0] / this.fixedNumber[1]
        const { w, h } = this.previewDefault
        if (scale > w / h) {
          return { width: w + 'px', height: w / scale + 'px' }
        }
        return { height: h + 'px', width: h * scale + 'px' }
      }
      return {}
    }
  },
  components: {
    VueCropper
  },
  props: {
    img: {},
    fixedNumber: {
      type: Array,
      default () {
        return [1, 1]
      }
    }
  },
  methods: {
    // 实时获取截图位置
    realTime (data) {
      this.preview = data
      this.divScale = parseFloat(this.previewStyle.height) / data.h
    },
    // 获取截图
    getImage () {
      return new Promise((resolve, reject) => {
        this.$refs.cropper.getCropData((data) => {
          resolve(data)
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.cropper-content {
  width: 1033px;
  display: flex;
  justify-content: flex-start;
  padding: 6px;
  background-color: #F5F5F5;
  .cropper-main {
    width: 600px;
    height: 600px;
    ::v-deep .cropper-modal {
      background: none;
    }
  }
  .preview-content {
    margin-left: 32px;
  }
  .preview-div {
    overflow: hidden;
    transform-origin: 0 0;
  }
  .tip {
    font-size: 14px;
    color: #8C8C8C;
    text-align: center;
    line-height: 22px;
     margin-top: 15px;
     width: 100%;
    &:last-child {
     margin-top: 0px;
    }
  }
  .cropper-preview {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC");
  }
}
</style>
