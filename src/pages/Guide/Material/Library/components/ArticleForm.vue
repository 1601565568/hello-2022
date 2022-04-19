<template>
  <div class="library-article">
    <el-form ref="form" :model="model" :rules="rules" label-width="100px">
      <el-form-item label="素材标题：" prop="name">
        <div class="top-input-view">
          <el-input
            type="textarea"
            maxlength="150"
            v-model="model.name"
            placeholder="请输入标题，长度在150个字符以内"
            style="width: 626px"
            :input="(model.name = model.name.replace(/\s+/g, ''))"
            clearable
          ></el-input>
        </div>
      </el-form-item>
      <el-form-item label="选择标签：" prop="subdivisionId">
        <el-select v-model="model.subdivisionIds" placeholder="请选择" filterable style="width: 626px" multiple :collapse-tags="true" :clearable="false">
          <el-option v-for="item in labelList" :key="item.subdivisionId" :label="item.subdivisionName" :value="item.subdivisionId"> </el-option>
        </el-select>
        <span class="library-icon__extra" @click="toggleLabel">
          <Icon type="plus" />
          <span>添加标签</span>
        </span>
      </el-form-item>
      <el-form-item label="推广文案：" prop="content">
        <div class="top-title-view">
          <tag-area :maxlength="1500" placeholder="可在此输入推广文案，限制长度在1500个字符以内。" :showEmoji="true" v-model="pitContent" :tools="tools" ref="tagContent"></tag-area>
        </div>
      </el-form-item>
      <el-form-item label="卡片样式：" prop="cardStyle">
        <div class="library-card">
          <div class="library-card__header">
            <span class="library-card__icon"></span>
            <span class="library-card__title">小程序名称</span>
          </div>
          <el-form-grid>
            <el-form-item prop="title">
              <el-input type="text" v-model="model.title" maxlength="20" placeholder="请输入文章标题，长度在20字内" :input="(model.title = model.title.replace(/\s+/g, ''))" clearable></el-input>
            </el-form-item>
            <el-form-item ref="imageForm" prop="mediaList">
              <div class="library-image__item" v-for="(item, index) in mediaList" :key="index">
                <img :src="item.url + '?x-oss-process=image/resize,m_mfit,h_200,w_200'" />
                <div class="library-image__mask">
                  <Icon type="zoom-in" @click="previewImage(index)" />
                  <Icon type="delete" @click="removeImage(index)" />
                </div>
              </div>
              <div v-if="mediaList.length === 0">
                <el-upload
                  class="library-uploader"
                  :loading="true"
                  :action="this.$api.core.sgUploadFile('image')"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                  accept=".jpg,.jpeg,.png"
                  list-type="picture-card"
                >
                  <Icon type="plus" />
                </el-upload>
              </div>
            </el-form-item>
          </el-form-grid>
          <div>
            <span class="library-card__desc">
              <Icon type="tishi" />
              <span>建议尺寸：800 * 800</span>
            </span>
            <div class="library-card__name">
              小程序
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="素材文章：" prop="textContent">
        <vue-ueditor-wrap :config="myConfig" v-model="model.textContent" @ready="editorReady"></vue-ueditor-wrap>
      </el-form-item>
      <el-form-item label="保存到：">
        <span class="library-catalogue__text">{{ catalogueStr }}</span>
        <ns-button type="primary" @click="toggleFolder">选择文件夹</ns-button>
      </el-form-item>
    </el-form>
    <div class="library-footer">
      <ns-button type="primary" :loading="loading" @click="onSave">保存</ns-button>
      <ns-button @click="onBack()">取消</ns-button>
    </div>
    <folder-tree ref="folderTree" title="选择文件夹" @submit="handleFolder"></folder-tree>
  </div>
</template>
<script>
import FolderTree from './FolderTree'
import VueUeditorWrap from 'vue-ueditor-wrap'
import ElUpload from '@nascent/nui/lib/upload'
import { getErrorMsg } from '@/utils/toast'
import TagArea from '@/components/NewUi/TagArea'
export default {
  name: 'articleform',
  components: { FolderTree, VueUeditorWrap, ElUpload, TagArea },
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
      myConfig: {
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 400,
        // 初始容器宽度
        initialFrameWidth: 800
      },
      loading: false,
      model: {
        isDirectory: 0,
        name: '',
        title: '',
        content: '',
        textContent: '',
        subdivisionIds: null,
        mediaList: [],
        cardStyle: {}
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入标题',
            trigger: ['blur', 'change']
          },
          {
            min: 0,
            max: 150,
            message: '限制长度在150个字符以内',
            trigger: ['blur', 'change']
          }
        ],
        content: [
          {
            required: true,
            message: '请输入推广文案',
            trigger: ['blur', 'change']
          },
          {
            min: 0,
            max: 1500,
            message: '限制长度在1500个字符以内',
            trigger: ['blur', 'change']
          }
        ],
        textContent: [
          {
            required: true,
            message: '请输入素材文章',
            trigger: ['blur', 'change']
          }
        ],
        mediaList: [{ required: true, message: '请添加素材图片', trigger: 'change' }],
        title: [
          {
            required: true,
            message: '请输入文章标题',
            trigger: ['blur', 'change']
          },
          {
            min: 0,
            max: 20,
            message: '限制长度在20个字符以内',
            trigger: ['blur', 'change']
          }
        ],
        cardStyle: [{ required: true, message: '卡片样式不能为空', trigger: 'blur' }]
      },
      mType: 0,
      imageNum: 1,
      catalogue: [],
      pitTitle: '',
      tools: [],
      pitContent: ''
    }
  },
  computed: {
    catalogueStr () {
      return this.catalogue.map(o => o.name).join(' > ')
    },
    mediaList () {
      return this.model.mediaList.slice(0, this.imageNum)
    }
  },
  watch: {
    detail (newObj) {
      const parentIds = newObj.parentPath.split('/')
      const parentNames = newObj.parentPathName.split('/')
      const tempModel = {}
      Object.keys(this.model).forEach(k => {
        tempModel[k] = !newObj[k] ? this.model[k] : newObj[k]
        // if (k === 'mediaList') {
        //   tempModel[k] = tempModel[k].filter(v =>
        //     /\.(jpg|jpeg|png|JPG|PNG|JPEG)$/.test(v)
        //   )
        // }
      })
      this.model = tempModel
      // this.pitTitle = this.$refs.tagTitle.stringTohtml(this.model.name)
      this.pitContent = this.$refs.tagContent.stringTohtml(this.model.content)
      this.$refs.tagContent.$refs[this.$refs.tagContent.className].innerHTML = this.pitContent
      this.catalogue = parentIds.map((id, index) => ({
        id: +id,
        name: parentNames[index]
      }))
    },
    pitContent (newObj) {
      this.model.content = this.$refs.tagContent.htmlToString(newObj)
    }
  },
  methods: {
    toggleFolder () {
      this.$refs.folderTree.show(null, this.catalogue)
    },
    toggleLabel () {
      this.$emit('toggleLabel')
    },
    previewImage (index) {
      this.$emit('togglePreview', 0, this.model.mediaList, 'img')
    },
    handleFolder ({ catalogue }) {
      this.catalogue = catalogue
    },
    editorReady: function (instance) {
      // 将实例 instance 存储到 data中
      this.editorInstance = instance
      instance.setContent(this.model.textContent || '') // 初始化时，对富文本编辑器进行赋值
      instance.addListener('blur', () => {
        this.model.textContent = this.editorInstance.getContent()
      })
    },
    removeImage (index) {
      this.model.mediaList = []
      this.$refs.form.validateField('mediaList')
    },
    handleAvatarSuccess (res, file) {
      this.$refs.imageForm.clearValidate()
      let obj = {
        pitType: 1,
        type: 1,
        url: res.result.url
      }
      this.model.mediaList = [obj]
    },
    beforeAvatarUpload (file) {
      // 图片格式判断
      if (!/\.(jpg|jpeg|png|JPG|PNG|JPEG)$/.test(file.name)) {
        this.$notify.error('仅支持jpg/jpeg/png的图片格式')
        return false
      }
      // 图片大小判断
      if (file.size / 1024 > 1024) {
        this.$notify.warning('上传图片不得大于1MB')
        return false
      }
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
      const params = { ...this.detail, ...this.model, mType: this.mType }
      params.parentId = this.catalogue[this.catalogue.length - 1].id
      params.mediaList = this.mediaList
      params.materialScriptType = 1
      let content = this.$refs.tagContent.htmlToString(this.pitContent)
      content = content.replace(/&nbsp;/g, '\u0020')
      params.content = content
      delete params.cardStyle
      this.$http
        .fetch(this.$api.guide.materialEdit, params)
        .then(resp => {
          this.$notify.success('保存成功')
          this.onBack(true)
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('保存失败', resp))
        })
        .finally(() => {
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
@import '@theme/variables.pcss';
@import '../styles/image.css';
.top-title-view {
  width: 626px;
  height: 144px;
}
@component-namespace library {
  @b card {
    padding: var(--default-padding-larger);
    width: 225px;
    background-color: #f7f9fa;
    border-radius: 3px;
    border: solid 1px var(--theme-base-border-color-primary);
    @e header {
      padding-bottom: var(--default-padding-larger);
      line-height: 1;
      > span {
        display: inline-block;
        vertical-align: middle;
      }
    }
    @e icon {
      width: 18px;
      height: 18px;
      background-color: #d8d8d8;
      border-radius: 100%;
    }
    @e title {
      margin-left: var(--default-margin-small);
      font-size: var(--default-font-size-small);
      color: var(--theme-font-color-secondary);
      line-height: var(--default-font-line-height);
    }
    @e desc {
      margin: var(--default-margin-small) 0;
      font-size: var(--default-font-size-small);
      color: #262626;
      cursor: pointer;
      svg + span {
        margin-left: var(--default-margin-small);
        color: #0392fb;
      }
    }
    @e name {
      padding-top: var(--default-padding-small);
      font-size: var(--default-font-size-small);
      color: var(--theme-font-color-secondary);
      line-height: var(--default-font-line-height);
      border-top: solid 1px #d8d8d8;
    }
    >>> .el-form-grid {
      width: 100%;
    }
    >>> .el-form-item {
      margin-bottom: var(--default-margin-small);
    }
  }
  @b uploader {
    >>> .el-upload--picture-card {
      width: 203px;
      height: 203px;
      border: solid 1px var(--theme-base-border-color-primary);
      font-size: 24px;
      color: #8c8c8c;
      line-height: 203px;
      border-radius: var(--default-radius-mini);
      background-color: #fff;
      &:hover {
        border-color: var(--theme-color-primary);
        color: var(--theme-color-primary);
      }
    }
  }
  @b image {
    @e item {
      position: relative;
      width: 203px;
      height: 203px;
      border-radius: var(--default-radius-mini);
      background-color: #fff;
      font-size: 0;
      > img {
        width: 100%;
        height: 100%;
        border-radius: var(--default-radius-mini);
        object-fit: cover;
      }
    }
    @e mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      background-color: rgba(0, 0, 0, 0.5);
      transition: opacity 0.3s;
      font-size: 20px;
      color: #fff;
      text-align: center;
      line-height: 203px;
      border-radius: var(--default-radius-mini);
      &:hover {
        opacity: 1;
      }
      svg {
        cursor: pointer;
      }
      svg + svg {
        margin-left: var(--default-margin-small);
      }
    }
  }
  @b catalogue {
    @e text {
      vertical-align: middle;
      & + button {
        margin-left: var(--default-margin-larger);
      }
    }
  }
}
</style>
