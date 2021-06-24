<template>
  <div class="company-info">
    <el-scrollbar ref="fullScreen">
      <div class="company-info__header">
        <div class="company-circle">
          <Icon type="gongsi" class="company-circle__gongsi"/>
        </div>
        <div class="company-text">公司logo</div>
      </div>
      <el-form label-width="70px">
        <el-form-item label="选择图片：">
          <el-form-grid class="company-upload" :class="imageUrl !== '' ? 'company-detele-border' : ''">
            <div class='img-url__logo'>
              <img v-if="imageUrl" :src="imageUrl" class="company-upload__avatar">
              <Icon type="plus" className="company-upload__tip" v-else/>
              <drap-upload  :scale='1' scaleTip='1' v-model='imageUrl' :isNeedCrop='true'  :showPont='false' :drag='false'>
              </drap-upload>
            </div>
            <!-- <el-upload
              :action="this.$api.core.sgUploadFile('test')"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="company-upload__avatar">
              <Icon type="plus" className="company-upload__tip" v-else/>
            </el-upload> -->
          </el-form-grid>
        </el-form-item>
        <el-form-item>
          <div class="company-example">
            <span class="text-primary">
               <Icon type="exclamation-circle" theme="outlined"/>
               该logo将在导购招募海报，优惠券领取页面透出，建议图片尺寸为1:1，JPG、JPEG、PNG格式
            </span>
            <el-popover
              placement="bottom-start" trigger="click">
              <img src="./src/images/exampleImg.png" alt="示例图片"/>
              <ns-button slot="reference" class="company-example__check">
                查看示例
                <Icon :type="isPopover ? 'up' : 'down'" className="company-arrow"/>
              </ns-button>
            </el-popover>
          </div>
        </el-form-item>
        <el-form-item>
          <ns-button type="primary" size="small"  @click="saveLogo">保存</ns-button>
        </el-form-item>
      </el-form>
    </el-scrollbar>
  </div>
</template>

<script>
import DrapUpload from '@/components/NewUi/DrapUpload'

export default {
  components: {
    DrapUpload
  },
  data () {
    return {
      imageUrl: '',
      isPopover: false
    }
  },
  methods: {
    'handleAvatarSuccess': function (res, file) {
      // console.log('图片地址：' + res.result.url)
      this.imageUrl = res.result.url
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG、JPEG、PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    saveLogo () {
      if (this.imageUrl) {
        this.$http.fetch(this.$api.guide.group.saveLogo, {
          logoUrl: this.imageUrl
        }).then((resp) => {
          this.$notify.success('保存成功')
        }).catch((resp) => {
          this.$notify.error('保存失败')
        })
      }
    },
    disposePopover () {
      this.isPopover = !this.isPopover
    }
  },
  mounted: function () {
    this.$http.fetch(this.$api.guide.group.getLogo, {}).then((resp) => {
      if (resp.result) {
        this.imageUrl = resp.result
      }
    }).catch((resp) => {})
  }
}
</script>

<style scoped>
@import "@theme/variables.pcss";

@component-namespace company {
  @b info {
    background: var(--theme-color-white);
    border-radius: var(--default-radius-mini);
    @e header {
      display: flex;
      align-items: center;
      padding: var(--default-padding-base) var(--default-padding-larger);
      border-top-left-radius: var(--default-radius-mini);
      border-top-right-radius: var(--default-radius-mini);
    }
  }
  @b circle {
    text-align: center;
    line-height: 44px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--theme-color-primary-light);
    @e gongsi {
      color: var(--theme-color-white);
      width: 22px;
      height: 23px;
      opacity: 0.9;
    }
  }
  @b text {
    font-size: var(--default-font-size-large);
    font-weight: bold;
    color: var(--theme-font-color-primary);
    margin-left: var(--default-margin-larger);
  }
  @b add {
    padding-left: var(--default-padding-larger);
  }
  @b example {
    @e check {
      color: var(--theme-font-color-secondary);
      cursor: pointer;
    }
  }
  @b upload {
    width: 100px;
    height: 100px;
    >>> .el-upload {
      width: 100px;
      height: 100px;
      position: relative;
      border: 1px dashed var(--theme-base-border-color-primary);
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
    width: 100%;
    height: 100%;
  }
}
  @b detele-border {
    >>> .el-upload {
      border: 0;
    }
  }
  @b arrow {
    color: var(--theme-font-color-secondary);
  }
}
.form-save__unique {
  padding: var(--default-padding-small) 0 var(--default-padding-small) 70px;
  background-color: var(--theme-color-white);
  border-bottom-left-radius: var(--default-radius-mini);
  border-bottom-right-radius: var(--default-radius-mini);
}
.company-example >>> .el-button {
  padding: 0;
  border: none;
  background: var(--theme-color-white);
}
.company-example >>> .el-button:hover {
  background: var(--theme-color-white);
}
.img-url__logo {
  position: relative;
  height: 100px;
  overflow: hidden;
}
.img-url__logo >>> .upload-demo .el-upload {
  position: absolute;
  top:0;
  left: 0;
  right: 0;
  bottom: 0;
}
.img-url__logo >>> .poster-content{
  opacity: 0;
  padding: 0;
}
.img-url__logo >>> .el-upload-list {
  display: none;
}
.img-url__logo >>> .poster-set_content {
  display: none
}
.img-url__logo >>> .padingbottom {
  display: none;
}
</style>
