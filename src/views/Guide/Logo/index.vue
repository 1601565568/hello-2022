<template>
  <div class="company-info">
    <el-scrollbar ref="fullScreen">
      <el-card shadow="never">
        <div slot="header">
          <div class="company-info__header">
            <div class="company-circle">
              <Icon type="gongsi" class="company-circle__gongsi"/>
            </div>
            <div class="company-text">公司logo</div>
          </div>
        </div>
        <div>
          <el-form label-width="80px" class="company-info__content">
            <el-form-item label="选择图片：">
              <el-form-grid class="company-upload">
                <el-upload
                  :action="this.$api.core.sgUploadFile('test')"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="imageUrl" :src="imageUrl" class="company-upload__avatar">
                  <Icon type="plus" className="company-upload__tip" v-else/>
                </el-upload>
              </el-form-grid>
              <el-form-item>
                <div class="company-example">
                  <span class="company-example__size">
                    <Icon type="exclamation-circle" theme="outlined" className="company-example__size--warning"/>
                    该logo将在用户端透出，建议图片尺寸为1:1。
                  </span>
                  <el-popover placement="bottom" trigger="click" @show="disposePopover" @hide="disposePopover">
                    <img src="./src/images/exampleImg.png" alt="示例图片" class="company-example__size--distance"/>
                    <span class="company-example__check" slot="reference">
                      查看示例
                      <Icon :type="isPopover ? 'up' : 'down'" className="company-arrow" />
                    </span>
                  </el-popover>
                </div>
              </el-form-item>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-scrollbar>
    <div class="form-save__unique">
      <ns-button type="primary" size="small"  @click="saveLogo">保存</ns-button>
    </div>
  </div>
</template>

<script>
import ElUpload from '@nascent/nui/lib/upload'
import ElCard from '@nascent/nui/lib/card'

export default {
  components: {
    ElUpload,
    ElCard
  },
  data () {
    return {
      imageUrl: '',
      isPopover: false
    }
  },
  methods: {
    'handleAvatarSuccess': function (res, file) {
      console.log('图片地址：' + res.result.url)
      this.imageUrl = res.result.url
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 20MB!')
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
    @e header {
      display: flex;
      align-items: center;
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
    @e size {
      font-size: var(--default-font-size-small);
      color: var(--theme-color-primary);
      @m warning {
        font-size: 15px;
        color: var(--theme-color-primary);
      }
      @m distance {
        margin: var(--default-margin-small) var(--default-margin-small) 0 ;
      }
    }
    @e check {
      font-size: var(--default-font-size-small);
      color: var(--theme-font-color-secondary);
      margin-left: var(--default-margin-larger);
    }
  }
  @b upload {
    >>> .el-upload {
      width: 100px;
      height: 100px;
      position: relative;
      border: 1px dashed var(--theme-base-border-color-primary);
      border-radius: 3px;
      &:hover {
        border-color: var(--theme-color-primary-light);
      }
    }
    @e tip {
      font-size: 18px;
      color: var(--theme-base-border-color-primary);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
    }
    @e avatar {
      width: 100px;
      height: 100px;
      position: relative;
      top: -1px;
      left: -1px;
    }
  }
  @b arrow {
    font-size: var(--default-font-size-middle);
    color: var(--theme-font-color-secondary);
    position: relative;
    top: 2px;
  }
}
.company-info >>> .el-card__header {
  border-bottom: none;
}
.form-save__unique {
  padding: var(--default-padding-small) 0 var(--default-padding-small) 150px;
  border-top: 1px solid var(--theme-base-border-color-primary);
  background-color: var(--theme-color-white);
}
</style>
