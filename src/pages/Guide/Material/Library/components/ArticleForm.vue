<template>
  <div class="library-article">
    <el-form ref="form" :model="model" :rules="rules" label-width="98px">
      <el-form-item label="素材标题：" prop="title">
        <el-input
          type="text"
          maxlength="20"
          v-model="model.title"
          placeholder="请输入标题，长度为4-20个字符"
          style="width: 260px"
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
        <span class="library-article__extra" @click="toggleLabel">
          <i class="el-icon-circle-plus" />
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
      <el-form-item label="卡片样式：" prop="cardContent">
        <div class="library-card">
          <div class="library-card__header">
            <span class="library-card__icon"></span>
            <span class="library-card__title">小程序名称</span>
          </div>
          <el-form-grid>
            <el-form-item prop="cardTitle">
              <el-input type="text" v-model="model.cardTitle" placeholder="请输入文章标题，长度为4-40个字"></el-input>
            </el-form-item>
            <el-form-item prop="imageList">
              <div class="library-image__item" v-for="(item,index) in model.imageList" :key="index">
                <img :src="item">
                <div class="library-image__mask">
                  <Icon type="zoom-in" @click="previewImage(index)"/>
                  <Icon type="delete" @click="removeImage(index)"/>
                </div>
              </div>
              <div v-if="model.imageList.length === 0">
                <el-upload
                  class="library-uploader"
                  :action="this.$api.core.sgUploadFile('image')"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                  accept=".jpg,.jpeg,.png,.bmp,.gif"
                  list-type="picture-card"
                >
                  <Icon type="plus"/>
                </el-upload>
              </div>
            </el-form-item>
          </el-form-grid>
          <div>
            <span class="library-card__desc">
              <Icon type="tishi"/>
              <span>建议尺寸：800 * 800</span>
            </span>
            <div class="library-card__name">
              小程序
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="素材文章：" prop="textContent">
        <vue-ueditor-wrap
          :config="myConfig"
          v-model="model.textContent"
          @ready="editorReady"
        ></vue-ueditor-wrap>
      </el-form-item>
      <el-form-item label="保存到：" >
        <span class="library-catalogue__text">{{catalogueStr}}</span>
        <ns-button type="primary" @click="toggleFolder">选择文件夹</ns-button>
      </el-form-item>
    </el-form>
    <div class="library-footer">
      <ns-button @click="onBack">取消</ns-button>
      <ns-button type="primary" :loading="loading" @click="onSave">保存</ns-button>
    </div>
    <folder-tree ref="folderTree" @change="handleFolder"></folder-tree>
  </div>
</template>
<script>
import FolderTree from './FolderTree'
import VueUeditorWrap from 'vue-ueditor-wrap'
import ElUpload from '@nascent/nui/lib/upload'

export default {
  name: 'articleform',
  components: { FolderTree, VueUeditorWrap, ElUpload },
  props: {
    labelList: {
      type: Array,
      default () {
        return []
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
        mType: 0,
        title: '',
        content: '',
        textContent: '',
        subdivisionId: undefined,
        catalogue: [{ id: -1, label: '素材库' }],
        imageList: ['https://shopguide.oss-cn-hangzhou.aliyuncs.com/test/201911/10000146/9317b820-9780-4d17-8761-f9fe2bf81e82.jpg'],
        cardTitle: '',
        cardContent: {}
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 4, max: 10, message: '长度在4到20个字符', trigger: 'blur' },
          { pattern: /^(?!(\s+$))/, message: '不允许为空' }
        ],
        content: [
          { required: true, message: '请输入推广文案', trigger: 'blur' },
          { min: 0, max: 1500, message: '限制长度在1500个字符以内', trigger: 'blur' },
          { pattern: /^(?!(\s+$))/, message: '不允许为空' }
        ],
        textContent: [
          { required: true, message: '请输入素材文章', trigger: 'blur' }
        ],
        imageList: [
          { required: true, message: '请添加素材图片', trigger: 'change' }
        ],
        cardTitle: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 4, max: 10, message: '长度在4到40个字符', trigger: 'blur' }
        ],
        cardContent: [
          { required: true, message: '卡片样式不能为空', trigger: 'blur' }
        ]
      },
      list: []
    }
  },
  computed: {
    catalogueStr () {
      return this.model.catalogue.map(o => o.label).join(' > ')
    }
  },
  methods: {
    toggleFolder () {
      this.$refs.folderTree.show()
    },
    toggleLabel () {
      this.$emit('toggleLabel')
    },
    previewImage (index) {
      this.$emit('togglePreview', 0, this.model.imageList, 'img')
    },
    handleFolder ({ catalogue }) {
      this.model.catalogue = catalogue
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
      this.model.imageList.splice(index, 1)
    },
    handleAvatarSuccess: function (res, file) {
      this.model.imageList = [res.result.url]
    },
    beforeAvatarUpload (file) {
      if (file.size / 1024 > 1024) {
        this.$notify.warning('上传图片不得大于1MB')
        return false
      }
      // 图片格式判断
      if (!/\.(gif|jpg|jpeg|png|bmp|BMP|GIF|JPG|PNG|JPEG)$/.test(file.name)) {
        this.$notify.error('仅支持jpg/jepg/png/bmp/gif的图片格式')
        return false
      }
    },
    onBack () {
      this.$router.push({ path: '/Guide/Material/Library' })
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
      const params = { ...this.model }
      params.catalogue = params.catalogue.slice(1)
      delete params.cardContent
      this.$http.fetch(this.$api.guide.materialEdit, params).then(resp => {
        this.onBack()
      }).catch(resp => {
        this.$notify.error(getErrorMsg('保存失败', resp))
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style scoped>
  /* @import "@theme/variables.pcss"; */
  @component-namespace library {
    @b article {
      @e extra {
        font-size: 12px;
        color: #0392fb;
        cursor: pointer;
        i + span {
          margin-left: 5px;
        }
      }
    }
    @b card {
      padding: 10px;
      width: 225px;
      background-color: #f7f9fa;
      border-radius: 3px;
      border: solid 1px #dcdfe6;
      @e header {
        padding-bottom: 10px;
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
        margin-left: 5px;
        font-size: 12px;
        color: #909399;
        line-height: 20px;
      }
      @e desc {
        margin: 5px 0;
        font-size: 12px;
        color: #262626;
        cursor: pointer;
        svg + span {
          margin-left: 5px;
          color: #0392fb;
        }
      }
      @e name {
        padding-top: 5px;
        font-size: 12px;
        color: #909399;
        line-height: 20px;
        border-top: solid 1px #d8d8d8;
      }
      >>> .el-form-grid {
        width: 100%;
      }
      >>> .el-form-item {
        margin-bottom: 5px;
      }
    }
    @b uploader {
      >>> .el-upload--picture-card {
        width: 203px;
        height: 203px;
        border: solid 1px #DCDFE6;
        font-size: 24px;
        color: #8c8c8c;
        line-height: 203px;
        border-radius: 3px;
        background-color: #fff;
        &:hover {
          border-color: #0091fa;
          color: #0091fa;
        }
      }
    }
    @b image {
      @e item {
        position: relative;
        width: 203px;
        height: 203px;
        border-radius: 3px;
        background-color: #fff;
        font-size: 0;
        > img {
          width: 100%;
          height: 100%;
          border-radius: 3px;
        }
      }
      @e mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        background-color: rgba(0, 0, 0, .5);
        transition: opacity .3s;
        font-size: 20px;
        color: #fff;
        text-align: center;
        line-height: 203px;
        border-radius: 3px;
        &:hover {
          opacity: 1;
        }
        svg {
          cursor: pointer;
        }
        svg + svg {
          margin-left: 5px;
        }
      }
    }
    @b catalogue {
      @e text {
        vertical-align: middle;
        & + button {
          margin-left: 10px;
        }
      }
    }
    @b footer {
      padding: 20px 0 30px;
      text-align: center;
      button + button {
        margin-left: 10px;
      }
    }
    >>> .el-form {
      padding: 20px 0;
    }
    >>> .el-form-item {
      margin-bottom: 10px;
      .el-form-item__label {
        font-size: 14px;
        color: #606266;
      }
      .el-select + .library-article__extra {
        margin-left: 10px;
      }
      .el-textarea__inner {
        height: 90px;
      }
    }
  }
</style>
