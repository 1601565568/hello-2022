<template>
  <div class="library-video">
    <el-form ref="form" :model="model" :rules="rules" label-width="100px">
      <el-form-item label="素材标题：" prop="name">
        <el-input
          type="text"
          maxlength="20"
          v-model="model.name"
          placeholder="请输入标题，长度为4-20个字符"
          style="width: 260px"
          :input="model.name=model.name.replace(/\s+/g,'')"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="选择标签：" prop="subdivisionId">
        <el-select
          v-model="model.subdivisionId"
          placeholder="请选择"
          filterable
          clearable
          style="width: 260px"
        >
          <el-option
            v-for="item in labelList"
            :key="item.subdivisionId"
            :label="item.subdivisionName"
            :value="item.subdivisionId"
          >
          </el-option>
        </el-select>
        <span class="library-icon__extra" @click="toggleLabel">
          <Icon type="plus"/>
          <span>添加标签</span>
        </span>
      </el-form-item>
      <el-form-item label="推广文案：" prop="content">
        <el-input
          resize="none"
          type="textarea"
          maxlength="1500"
          v-model="model.content"
          placeholder="可在此输入推广文案，限制长度在1500个字符以内。"
          style="width: 340px"
        ></el-input>
      </el-form-item>
      <el-form-item label="素材视频：" ref="imageForm" prop="imageList">
        <div class="library-video__form">
          <div v-if="model.imageList && model.imageList.length" class="library-video__item">
            <video :src="model.imageList[0]">您的浏览器暂不支持播放该视频，请升级至最新版浏览器。</video>
            <div class="library-video__mask" @click="previewVideo">
              <div class="library-video__wrapper">
                <Icon type="begin" />
              </div>
            </div>
            <span class="library-video__remove" @click="removeVideo">
              <Icon type="delete" />
            </span>
          </div>
          <div v-else>
            <el-upload
              class="library-uploader"
              :action="this.$api.core.sgUploadFile('video')"
              :show-file-list="false"
              :on-success="handleVideoSuccess"
              :on-error="handleVideoError"
              :before-upload="beforeVideoUpload"
              accept=".mp4"
              list-type="picture-card"
            >
              <Icon type="plus"/>
            </el-upload>
          </div>
        </div>
        <div class="library-icon__extra">
          <Icon type="tishi"/>
          <span>上传视频限制大小为10MB，格式为MP4</span>
        </div>
      </el-form-item>
      <el-form-item label="保存到：" >
        <span class="library-catalogue__text">{{catalogueStr}}</span>
        <ns-button type="primary" @click="toggleFolder">选择文件夹</ns-button>
      </el-form-item>
    </el-form>
    <div class="library-footer">
      <ns-button type="primary" :loading="loading" @click="onSave">保存</ns-button>
      <ns-button @click="onBack()">取消</ns-button>
    </div>
    <folder-tree ref="folderTree" @submit="handleFolder"></folder-tree>
  </div>
</template>
<script>
import FolderTree from './FolderTree'
import ElUpload from '@nascent/nui/lib/upload'

export default {
  name: 'videoform',
  components: { FolderTree, ElUpload },
  props: {
    labelList: {
      type: Array,
      default () {
        return []
      }
    },
    breadcrumb: {
      type: Array,
      default () {
        return []
      }
    },
    detail: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data: function () {
    return {
      loading: false,
      model: {
        isDirectory: 0,
        name: '',
        content: '',
        imageList: [],
        subdivisionId: null
      },
      rules: {
        name: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 4, max: 20, message: '长度在4到20个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入推广文案', trigger: 'blur' },
          { min: 0, max: 1500, message: '限制长度在1500个字符以内', trigger: 'blur' }
        ],
        imageList: [
          { required: true, message: '请添加素材视频', trigger: 'change' }
        ]
      },
      mType: 2,
      imageNum: 1,
      catalogue: [{ id: 0, name: '素材库' }]
    }
  },
  computed: {
    catalogueStr () {
      return this.catalogue.map(o => o.name).join(' > ')
    },
    imageList () {
      return this.model.imageList.slice(0, this.imageNum)
    }
  },
  watch: {
    detail (newObj) {
      const parentIds = newObj.parentPath.split('/')
      const parentNames = newObj.parentPathName.split('/')
      const tempModel = {}
      Object.keys(this.model).forEach(k => {
        tempModel[k] = !newObj[k] ? this.model[k] : newObj[k]
        if (k === 'imageList') {
          tempModel[k] = tempModel[k].filter(v => /\.(mp4)$/.test(v))
        }
      })
      this.model = tempModel
      this.catalogue = parentIds.map((id, index) => ({ id: +id, name: parentNames[index] }))
    }
  },
  methods: {
    toggleFolder () {
      this.$refs.folderTree.show(null, this.catalogue)
    },
    toggleLabel () {
      this.$emit('toggleLabel')
    },
    previewVideo () {
      this.$emit('togglePreview', 0, this.imageList, 'video')
    },
    handleFolder ({ catalogue }) {
      this.catalogue = catalogue
    },
    removeVideo (index) {
      this.model.imageList = []
      this.$refs.form.validateField('imageList')
    },
    handleVideoSuccess (res, file) {
      this.model.imageList = [res.result.url]
      this.$refs.imageForm.clearValidate()
      this.uploader && this.uploader.close()
    },
    handleVideoError () {
      this.uploader && this.uploader.close()
    },
    beforeVideoUpload (file) {
      // 视频格式判断
      if (!/\.(mp4)$/.test(file.name)) {
        this.$notify.error('仅支持mp4的视频格式')
        return false
      }
      // 视频大小判断
      if (file.size / 1024 > 1024 * 10) {
        this.$notify.warning('上传视频不得大于10MB')
        return false
      }
      this.uploader = this.$loading({ target: '.library-video__form', fullscreen: false, text: '正在上传...' })
    },
    onBack (isSave) {
      this.$emit('back', isSave ? this.catalogue : null)
    },
    onSave () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.doSave()
        }
      })
    },
    doSave () {
      this.loading = true
      // 校验推广内容是否是纯空格 或换行
      let tempContent = this.model.content
      if (tempContent.replace(/\s+|[\r\n]/g, '').length === 0) {
        this.$notify.error('保存失败，推广文案不能输入纯空格或换行')
        this.loading = false
        return
      }
      const params = { ...this.detail, ...this.model, mType: this.mType }
      params.parentId = this.catalogue[this.catalogue.length - 1].id
      params.imageList = this.imageList
      this.$http.fetch(this.$api.guide.materialEdit, params).then(resp => {
        this.$notify.success('保存成功')
        this.onBack(true)
      }).catch(resp => {
        this.$notify.error(getErrorMsg('保存失败', resp))
      }).finally(() => {
        this.loading = false
      })
    }
  },
  mounted () {
    this.catalogue = this.breadcrumb && this.breadcrumb.length ? this.breadcrumb : [{ id: 0, name: '素材库' }]
  }
}
</script>
<style scoped>
  @import "@theme/variables.pcss";
  @component-namespace library {
    @b catalogue {
      @e text {
        vertical-align: middle;
        & + button {
          margin-left: var(--default-margin-larger);
        }
      }
    }
    @b uploader {
      >>> .el-upload--picture-card {
        width: 240px;
        height: 135px;
        border: solid 1px var(--theme-base-border-color-primary);
        font-size: 24px;
        color: #8c8c8c;
        line-height: 135px;
        border-radius: var(--default-radius-mini);
        background-color: #fff;
        &:hover {
          border-color: var(--theme-color-primary);
          color: var(--theme-color-primary);
        }
      }
    }
    @b video {
      @e form {
        position: relative;
        width: 240px;
        >>> .el-loading-mask {
          top: 1px;
          left: 1px;
          bottom: 1px;
          right: 1px;
          border-radius: var(--default-radius-mini);
        }
        >>> .el-loading-spinner {
          margin-top: -24px;
        }
      }
      @e item {
        position: relative;
        width: 240px;
        height: 135px;
        border-radius: var(--default-radius-mini);
        background-color: #fff;
        font-size: 0;
        > video {
          width: 100%;
          height: 100%;
          border-radius: var(--default-radius-mini);
          object-fit: cover;
        }
      }
      @e remove {
        position: absolute;
        right: -18px;
        bottom: 0;
        font-size: var(--default-font-size-base);
        color: var(--theme-color-primary);
        line-height: 1;
        svg {
          cursor: pointer;
        }
      }
      @e mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .25);
        cursor: pointer;
        border-radius: var(--default-radius-mini);
      }
      @e wrapper {
        position: relative;
        top: 50%;
        left: 50%;
        margin-left: -15px;
        margin-top: -15px;
        width: 30px;
        height: 30px;
        border-radius: 30px;
        background-color: rgba(255, 255, 255, .4);
        > svg {
          margin: 7px 0 0 8px;
          font-size: 16px;
          color: #fff;
        }
      }
    }
  }
</style>
