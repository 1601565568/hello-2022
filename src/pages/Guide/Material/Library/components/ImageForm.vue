<template>
  <div class="library-image">
    <el-form ref="form" :model="model" :rules="rules" label-width="98px">
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
        <span class="library-image__extra" @click="toggleLabel">
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
      <el-form-item ref="imageForm" label="素材图片：" prop="imageList">
        <ul class="library-image__list clearfix">
          <li class="library-image__item" v-for="(item,index) in imageList" :key="index">
            <img :src="item">
            <div class="library-image__mask">
              <Icon type="zoom-in" @click="previewImage(index)"/>
              <Icon type="delete" @click="removeImage(index)"/>
            </div>
          </li>
          <li v-if="imageList.length < imageNum">
            <el-upload
              class="library-uploader"
              :action="this.$api.core.sgUploadFile('image')"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              accept=".jpg,.jpeg,.png"
              list-type="picture-card"
              multiple
            >
              <Icon type="plus"/>
            </el-upload>
          </li>
        </ul>
        <div class="library-image__extra">
          <Icon type="tishi"/>
          <span>上传图片不能大于1MB；图片最多上传9张（加小程序码的最多8张）</span>
        </div>
      </el-form-item>
      <el-form-item label="小程序链接：" prop="codeModule">
        <el-select
          v-model="model.codeModule"
          placeholder="请选择"
          clearable
          @change='codeModuleChange'
          style="width: 240px"
        >
          <el-option v-for="item in wechatPageTypeList" :key="item.id" :label="item.name" :value="item.id" >
          </el-option>
        </el-select>
        <el-form-grid v-if="model.codeModule == 1">
          <el-select v-model="model.codeTarget" placeholder="请选择" clearable  @change='codeTargetChange'>
            <el-option
              v-for="item in wechatPageUrlList"
              :key="item.codeTarget"
              :value="item.codeTarget"
              :label="item.codeTargetName"
            >
            </el-option>
          </el-select>
        </el-form-grid>
        <el-form-grid v-if="model.codeModule == 2">
          <ns-button @click='selectGoods' type='primary'>选择商品</ns-button>
        </el-form-grid>
        <el-form-grid v-if="model.codeModule == 4">
          <ns-button @click='selectMarket' type='primary'>选择营销活动</ns-button>
        </el-form-grid>
      </el-form-item>
      <el-form-item
        v-if="model.codeModule && model.codeModule != 1 && model.codeTargetName != '' "
        :label="model.codeModule == 2 ? '商品名称：' : model.codeModule == 4 ? '活动名称：' : ''"
        prop='codeTargetName'
      >
        <el-input v-model="model.codeTargetName" :disabled="true" style="width: 240px"></el-input>
      </el-form-item>
      <el-form-item label="小程序码类型：" prop="codeType" v-if='model.codeTarget'>
        <el-radio-group v-model="model.codeType">
          <el-radio :label="1">图片上植入小程序码
          </el-radio>
          <el-radio :label="2">单独增加一张小程序码图
          </el-radio>
        </el-radio-group>
        <div v-if="model.codeType == 2" style='line-height:1.5;' class="library-image__extra">
          <Icon type="info-circle"/>
          <span>生成一张新的小程序码图片，需门店里有对应信息的才会显示</span>
        </div>
      </el-form-item>
      <el-form-item label="保存到：" >
        <span class="library-catalogue__text">{{catalogueStr}}</span>
        <ns-button type="primary" @click="toggleFolder">选择文件夹</ns-button>
      </el-form-item>
    </el-form>
    <div class="library-footer">
      <ns-button @click="onBack()">取消</ns-button>
      <ns-button type="primary" :loading="loading" @click="onSave">保存</ns-button>
    </div>
    <folder-tree ref="folderTree" @submit="handleFolder"></folder-tree>
    <SelectMarket ref="selectMarket" :callBack="selectMarketBack"></SelectMarket>
    <SelectGoods ref="selectGoods" :callBack="selectMarketBack"></SelectGoods>
  </div>
</template>
<script>
import FolderTree from './FolderTree'
import ElUpload from '@nascent/nui/lib/upload'
import { getErrorMsg } from '@/utils/toast'
import SelectMarket from '../../components/selectMarket'
import SelectGoods from '../../components/selectGoods'

export default {
  name: 'imageform',
  components: { FolderTree, ElUpload, SelectMarket, SelectGoods },
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
      wechatPageTypeList: [{ name: '商城主页面', id: 1 }, { name: '商品', id: 2 }, { name: '营销活动', id: 4 }],
      wechatPageUrlList: [{ codeTargetName: '首页', codeTarget: '1' }, { codeTargetName: '分类', codeTarget: '2' }, { codeTargetName: '我的', codeTarget: '3' }],
      model: {
        isDirectory: 0,
        name: '',
        content: '',
        subdivisionId: null,
        codeType: 1,
        imageList: [],
        marketType: null,
        codeModule: null,
        extJson: '',
        codeTarget: '',
        codeTargetName: ''
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
          { required: true, message: '请添加素材图片', trigger: 'change' }
        ]
      },
      mType: 1,
      imageNum: 9,
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
          tempModel[k] = tempModel[k].filter(v => /\.(jpg|jpeg|png|JPG|PNG|JPEG)$/.test(v))
        }
      })
      this.model = tempModel
      this.catalogue = parentIds.map((id, index) => ({ id: +id, name: parentNames[index] }))
    },
    'model.codeType' (newVal) {
      this.imageNum = newVal === 2 ? 8 : 9
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
      this.$emit('togglePreview', index, this.imageList, 'img')
    },
    handleFolder ({ catalogue }) {
      this.catalogue = catalogue
    },
    removeImage (index) {
      this.model.imageList.splice(index, 1)
      this.$refs.form.validateField('imageList')
    },
    handleAvatarSuccess (res, file) {
      this.$refs.imageForm.clearValidate()
      if (this.model.imageList.length < this.imageNum) {
        this.model.imageList.push(res.result.url)
      }
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
    codeModuleChange (e) {
      this.$set(this.model, 'codeTarget', '')
      this.$set(this.model, 'codeTargetName', '')
    },
    codeTargetChange (e) {
      let codeTargetObj = e ? this.wechatPageUrlList[Number(e) - 1] : {}
      this.$set(this.model, 'codeTargetName', codeTargetObj.codeTargetName || '')
    },
    selectMarket () {
      this.$nextTick(() => {
        this.$refs.selectMarket.showToggle()
      })
    },
    selectGoods () {
      this.$nextTick(() => {
        this.$refs.selectGoods.showToggle()
      })
    },
    selectMarketBack (obj) {
      if (obj.activityId) {
        this.$set(this.model, 'codeTarget', obj.activityId)
        this.$set(this.model, 'codeTargetName', obj.activityName)
        this.$set(this.model, 'marketType', obj.marketType)
      } else if (obj.sysItemId) {
        this.$set(this.model, 'codeTarget', obj.sysItemId)
        this.$set(this.model, 'codeTargetName', obj.title)
        this.$set(this.model, 'extJson', JSON.stringify({ mallId: obj.mallId, bankId: obj.bankId }))
      }
    },
    onBack (isSave) {
      this.$emit('onBack', isSave ? this.catalogue : null)
    },
    onSave () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.doSave()
        }
      })
    },
    doSave () {
      const params = { ...this.detail, ...this.model, mType: this.mType }
      // 控制图片数量
      params.imageList = this.imageList
      // 带码状态
      if (params.codeTarget === '') {
        params.codeType = 0
      }
      params.parentId = this.catalogue[this.catalogue.length - 1].id
      this.loading = true
      // 校验推广内容是否是纯空格 或换行
      let tempContent = this.model.content
      if (tempContent.replace(/\s+|[\r\n]/g, '').length === 0) {
        this.$notify.error('保存失败，推广文案不能输入纯空格或换行')
        this.loading = false
        return
      }
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
    @b image {
      @e extra {
        font-size: var(--default-font-size-small);
        color: #0392fb;
        cursor: pointer;
        svg {
          font-size: var(--default-font-size-small);
        }
        i + span,
        svg + span {
          margin-left: var(--default-margin-small);
        }
      }
      @e list {
        width: 300px;
        list-style: none;
        padding: 0;
        margin-bottom: var(--default-margin-small);
        > li {
          float: left;
          position: relative;
          margin: 0 var(--default-margin-small) var(--default-margin-small) 0;
        }
      }
      @e item {
        font-size: 0;
        > img {
          width: 90px;
          height: 90px;
          border-radius: var(--default-radius-mini);
          object-fit: cover;
          border: 1px solid #E8E8E8;
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
        font-size: 16px;
        color: #fff;
        text-align: center;
        line-height: 90px;
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
    @b uploader {
      >>> .el-upload--picture-card {
        width: 90px;
        height: 90px;
        border: dashed 1px #DCDFE6;
        background-color: transparent;
        font-size: 18px;
        color: #8c8c8c;
        line-height: 88px;
        border-radius: var(--default-radius-mini);
        &:hover {
          border-color: var(--theme-color-primary);
          color: var(--theme-color-primary);
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
    @b footer {
      padding: 20px 0 30px;
      text-align: center;
      button + button {
        margin-left: var(--default-margin-larger);
      }
    }
    >>> .el-form {
      padding: 20px 0;
    }
    >>> .el-form-item {
      margin-bottom: var(--default-margin-larger);
      .el-form-item__label {
        font-size: var(--default-font-size-base);
        color: #606266;
      }
      .el-select + .library-image__extra {
        margin-left: var(--default-margin-larger);
      }
      .el-textarea__inner {
        height: 90px;
      }
    }
    >>> .el-form-grid {
      margin-left: var(--default-margin-larger);
    }
  }
</style>
