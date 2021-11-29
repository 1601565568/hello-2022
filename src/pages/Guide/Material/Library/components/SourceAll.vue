<template>
  <div class="library-image">
    <el-form ref="form" :model="model" :rules="rules" label-width="100px">
      <el-form-item label="素材标题：" prop="name">
        <el-input
          type="textarea"
          placeholder="请输入标题，长度在150个字符以内"
          v-model="model.name"
          @keydown.native='handleDown($event)'
          maxlength="150"
          show-word-limit
          class="input_textarea"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="选择标签：" prop="subdivisionId">
        <el-select v-model="model.subdivisionIds" placeholder="请选择" filterable style="width: 540px" multiple :collapse-tags="true" :clearable="false">
          <el-option v-for="item in labelList" :key="item.subdivisionId" :label="item.subdivisionName" :value="item.subdivisionId"> </el-option>
        </el-select>
        <div class="library-icon__extra" @click="toggleLabel">
          <Icon type="plus" />
          <span>添加标签</span>
        </div>
      </el-form-item>
      <el-form-item label="上架时间：" required>
        <el-radio-group v-model="model.shelfType">
          <el-radio :label=1>立即上架</el-radio>
          <el-radio :label=0>自定义</el-radio>
        </el-radio-group>
        <div class="select-time-view" v-show="model.shelfType === 0">
          <span class="remind-text">上架时间</span>
          <el-form-item prop="shelfTime" :rules="[
            {required:model.shelfType === 0 ? true : false, message:'请选择上架时间', trigger: ['blur', 'change']},
          ]">
            <el-date-picker
              v-model="model.shelfTime"
              type="datetime"
              size="large"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择上架时间">
            </el-date-picker>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="下架时间：" required>
        <el-radio-group v-model="model.endType">
          <el-radio :label=1>永久有效</el-radio>
          <el-radio :label=0>自定义</el-radio>
        </el-radio-group>
        <div class="select-time-view" v-show="model.endType === 0">
          <span class="remind-text">下架时间</span>
          <el-form-item prop="endTime" :rules="[
            {required:model.endType === 0 ? true : false, message:'请选择下架时间', trigger: ['blur', 'change']},
          ]">
            <el-date-picker
              v-model="model.endTime"
              type="datetime"
              size="large"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择下架时间">
            </el-date-picker>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="推广文案：">
        <div class="top-title-view">
          <tag-area
            class="tag-area"
            v-model='pitContent'
            :maxlength="1348"
            :showEmoji='true'
            :showTextEmoji='true'
            :tools='tools'
            ref="tagContent"
            className="tagContent"
            placeholder="可在此输入推广文案，限制长度在1348个字符以内"
            tag="wise"
            emojiClass=''
          />
        </div>
      </el-form-item>
      <el-form-item ref="imageForm" label="附件：">
        <span class="add-tip label-gap">视频限制最大10MB，支持MP4格式；图片最大2MB，支持PNG、JPG格式；</span><br/>
        <span class="add-tip label-gap">最多可添加9个附件（加小程序码的最多8个）</span><br/>
        <span class="add-tip label-gap">若希望在移动端一键发送至朋友圈，附件仅支持图片、视频、链接，且只能存在一种类型</span>
          <MessageList
            :list.sync="mediaList"
            @edit="editAnnexMessage"
            @delete="deleteAnnexMessage"
          />
          <el-popover
            placement="top-start"
            width="480"
            trigger="hover"
            :disabled="!(imageNum===8?mediaList.length < 8:mediaList.length < 9)"
          >
            <template slot="reference">
              <div class="add-material" v-if="imageNum===8?mediaList.length < 8:mediaList.length < 9">
                <Icon type="ns-add-border" class="icon"/>
                添加消息内容
              </div>
              <div v-else class="add-material add-material-disabled" @click="$notify.error('附件已达上限（9个），不能再添加')">
                <Icon type="ns-add-border" class="icon"/>
                添加消息内容
              </div>
            </template>
            <WechatMessageBar
              :pitBit='true'
              ref="WechatMessageBar"
              :multipleImage='true'
              :limitImage='limitImage'
              @addMessage="addAnnexMessage"
              @uploadVideoProgress="uploadProgress"
            />
          </el-popover>
      </el-form-item>
      <el-form-item label="小程序链接：" prop="codeModule" v-if="showMiniCode">
        <el-select v-model="model.codeModule" placeholder="请选择" clearable @change="codeModuleChange" style="width: 540px">
          <el-option v-for="item in wechatPageTypeList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
        <el-form-grid v-if="model.codeModule == 1">
          <el-select v-model="model.codeTarget" placeholder="请选择" clearable @change="codeTargetChange">
            <el-option v-for="item in wechatPageUrlList" :key="item.codeTarget" :value="item.codeTarget" :label="item.codeTargetName"> </el-option>
          </el-select>
        </el-form-grid>
        <el-form-grid v-if="model.codeModule == 2">
          <ns-button @click="selectGoods" type="primary">选择商品</ns-button>
        </el-form-grid>
        <el-form-grid v-if="model.codeModule == 4">
          <ns-button @click="selectMarket" type="primary">选择营销活动</ns-button>
        </el-form-grid>
        <div class="add-tip label-gap">该小程序链接生成的二维码仅会产生在自建坑位和普通图片上，不影响附码图片</div>
      </el-form-item>
      <el-form-item
        v-if="model.codeModule && model.codeModule != 1 && model.codeTargetName != ''"
        :label="model.codeModule == 2 ? '商品名称：' : model.codeModule == 4 ? '活动名称：' : ''"
        prop="codeTargetName"
      >
        <el-input v-model="model.codeTargetName" :disabled="true" style="width: 240px"></el-input>
      </el-form-item>
      <el-form-item label="小程序码类型：" prop="codeType" v-if="model.codeTarget">
        <el-radio-group v-model="model.codeType">
          <el-radio :label="1">图片上植入小程序码 </el-radio>
          <el-radio :label="2">单独增加一张小程序码图 </el-radio>
        </el-radio-group>
        <div v-if="model.codeType == 2" style="line-height:1.5;" class="library-icon__extra">
          <Icon type="info-circle" />
          <span>生成一张新的小程序码图片，需门店里有对应信息的才会显示</span>
        </div>
      </el-form-item>
      <el-form-item label="保存到：">
        <span class="library-catalogue__text">{{ catalogueStr }}</span>
        <ns-button style='margin-left: 12px' type="primary" @click="toggleFolder">选择文件夹</ns-button>
      </el-form-item>
    </el-form>
    <folder-tree ref="folderTree" title="选择文件夹" @submit="handleFolder"></folder-tree>
    <SelectMarket ref="selectMarket" :callBack="selectMarketBack"></SelectMarket>
    <SelectGoods ref="selectGoods" :callBack="selectMarketBack"></SelectGoods>
    <div class="cus-diglog-view">
    </div>
    <GuideInfo ref="guideInfo" />
  </div>
</template>
<script>
import FolderTree from './FolderTree'
import { getErrorMsg } from '@/utils/toast'
import SelectMarket from '../../components/selectMarket'
import SelectGoods from '../../components/selectGoods'
import GuideInfo from './GuideInfo'
import TagArea from '@/components/NewUi/TagArea'
// import AttachView from './AttachView'
// import draggable from 'vuedraggable'
import MessageList from './MessageList'
import WechatMessageBar from '@/pages/WeWork/WelcomeCode/Edit/WechatMessageBar/index'
export default {
  name: 'imageform',
  components: {
    FolderTree,
    SelectMarket,
    SelectGoods,
    GuideInfo,
    TagArea,
    MessageList,
    WechatMessageBar
  },
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
      wechatPageTypeList: [
        { name: '商城主页面', id: 1 },
        { name: '商品', id: 2 },
        { name: '营销活动', id: 4 }
      ],
      wechatPageUrlList: [
        { codeTargetName: '首页', codeTarget: '1' },
        { codeTargetName: '分类', codeTarget: '2' },
        { codeTargetName: '我的', codeTarget: '3' }
      ],
      model: {
        isDirectory: 0,
        name: '',
        content: '',
        subdivisionIds: null,
        codeType: 1,
        marketType: null,
        codeModule: null,
        extJson: '',
        codeTarget: '',
        codeTargetName: '',
        mediaList: [],
        materialScriptType: 1,
        shelfType: 1,
        endType: 1,
        endTime: '',
        shelfTime: ''
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
        mediaList: [{ required: true, message: '请添加附件', trigger: 'change' }]
      },
      mType: 1,
      imageNum: 9,
      catalogue: [{ id: 0, name: '素材库' }],
      visible: false,
      defaultImgUrl: 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/image/material/custom-edit.png',
      showEdit: false,
      guideText: '',
      drawer: false,
      editIndex: 0,
      showEidtImg: '',
      tools: [],
      limitIndex: 0,
      pitTitle: '',
      pitContent: '',
      showMiniCode: false
    }
  },
  computed: {
    catalogueStr () {
      return this.catalogue.map(o => o.name).join(' > ')
    },
    mediaList: {
      get () {
        return this.model.mediaList.slice(0, this.imageNum)
      },
      set (v) {
        let arr = []
        for (const item of v) {
          if (item) {
            arr.push(item)
          }
        }
        this.model.mediaList = arr
      }
    },
    // 图片多选时，判断还能选择的张数
    limitImage () {
      return this.imageNum - this.mediaList.length
    }
  },
  watch: {
    mediaList: {
      handler (newVal) {
        this.$refs.form.validateField('mediaList')
        this.$emit('list', newVal)
      },
      deep: true
    },
    // 素材标题
    'model.name': {
      handler (newVal) {
        this.$emit('title', newVal)
      },
      deep: true
    },
    'model.subdivisionIds': {
      handler (newVal) {
        if (newVal && newVal.length > 0) {
          this.$emit('subdivision', true)
        } else {
          this.$emit('subdivision', false)
        }
      },
      deep: true
    },
    detail (newObj) {
      const parentIds = newObj.parentPath.split('/')
      const parentNames = newObj.parentPathName.split('/')
      const tempModel = { ...newObj }
      // Object.keys(this.model).forEach(k => {
      //   tempModel[k] = !newObj[k] ? this.model[k] : newObj[k]
      //   // if (k === 'mediaList') {
      //   //   tempModel[k] = tempModel[k].filter(v =>
      //   //     /\.(jpg|jpeg|png|JPG|PNG|JPEG)$/.test(v)
      //   //   )
      //   // }
      // })
      this.model = tempModel
      // this.pitTitle = this.$refs.tagTitle.stringTohtml(this.model.name)
      this.pitContent = this.$refs.tagContent.stringTohtml(this.model.content)
      this.$refs.tagContent.$refs[this.$refs.tagContent.className].innerHTML = this.pitContent
      this.catalogue = parentIds.map((id, index) => ({
        id: +id,
        name: parentNames[index]
      }))
    },
    'model.codeType' (newVal) {
      this.imageNum = newVal === 2 ? 8 : 9
    },
    pitContent (newObj) {
      this.model.content = this.$refs.tagContent.htmlToString(newObj)
      this.$emit('pitContent', this.model.content)
    }
  },
  methods: {
    uploadProgress (data) {
      if (data) {
        const deleteData = sessionStorage.getItem(data.content.uid)
        if (deleteData) {
          return
        }
        // 根据uid判断是否存在
        let isLargeNumber = (item) => item.content.uid === data.content.uid
        let findEditIndex = this.model.mediaList.findIndex(isLargeNumber)
        if (findEditIndex === -1) {
          // 新添加
          let findIndex = this.model.mediaList.length
          let objData = { ...data, uid: data.content.uid }
          this.model.mediaList.push(objData)
        } else {
          this.model.mediaList.splice(findEditIndex, 1, data)
        }
      }
    },
    getdata (data) {},
    datadragEnd (evt) {},
    removeGuideImage () {
      this.showEidtImg = ''
      let item = this.model.mediaList[this.editIndex]
      if (item) {
        item.url = ''
        this.model.mediaList[this.editIndex] = item
        this.showEidtImg = ''
      }
    },
    removeGuideImg () {
      let item = this.mediaList[this.editIndex]
      item.url = ''
      this.mediaList.splice(this.editIndex, 1)
    },
    addCustomImg () {
      // 添加坑位
      this.$refs.imageForm.clearValidate()
      this.$refs.popoverView.doClose()
      this.guideText = ''
      this.showEidtImg = ''
      this.editIndex = this.model.mediaList.length
      this.showEdit = true
    },
    handleSure () {
      //  点击拍摄指南确定
      const text = this.$refs.tagArea.currentText
      if (text.length > 1500) {
        this.$notify.warning('最多1500个字符')
        return
      }
      if (this.model.mediaList.length <= this.imageNum) {
        let str = this.$refs.tagArea.htmlToString(this.guideText)
        const item = this.model.mediaList[this.editIndex]
        if (item) {
          item.pitText = str
          item.url = this.showEidtImg
          this.model.mediaList[this.editIndex] = item
        } else {
          const obj = {
            pitType: 2,
            pitText: str,
            type: 1,
            url: this.showEidtImg
          }
          this.model.mediaList.push(obj)
        }
      }

      this.showEdit = false
    },
    handleCloseDia () {
      this.showEdit = false
      this.guideText = ''
      this.showEidtImg = ''
    },
    deleteAnnexMessage (context) {
      if (context.type === 2 && Number(context.content.percent) < 100) {
        sessionStorage.setItem(context.content.uid, context.content.uid)
      }
      // this.model.mediaList.splice(context.index, 1)
    },
    editAnnexMessage (context) {
      let isLargeNumber = (item) => item.type === 2 && !item.content.video.includes('http')
      let findEditIndex = this.model.mediaList.findIndex(isLargeNumber)
      if (findEditIndex > -1) {
        this.$notify.warning('视频资源上传中， 请稍等')
      } else {
        this.$refs.WechatMessageBar.openMessageDialogByEdit(context, true)
      }
    },
    addAnnexMessage (context) {
      const { index, content, type, isDelete } = context
      const deleteData = sessionStorage.getItem(content.uid)
      if (deleteData && type === 2) {
        sessionStorage.removeItem(content.uid)
        return
      }
      if (content.uid) {
        let isLargeNumber = (item) => item.content.uid === content.uid
        let findEditIndex = this.model.mediaList.findIndex(isLargeNumber)
        if (findEditIndex > -1) {
          this.$set(this.model.mediaList, findEditIndex, context)
        }
      } else {
        // if (index > -1) {
        //   // 编辑消息
        //   this.$set(this.model.mediaList, index, context)
        // } else {
        // 新增消息
        if (this.model.mediaList.length < 9) {
          this.model.mediaList.push(context)
        } else {
          this.$notify.error('附件已达上限（9个），不能再添加')
        }
        // }
      }
    },
    editImage (index) {
      this.editIndex = index
      let item = this.model.mediaList[index]
      this.showEidtImg = item.url
      this.guideText = item.pitText
      setTimeout(() => {
        this.guideText = this.$refs.tagArea.stringTohtml(item.pitText)
        this.$refs.tagArea.$refs[this.$refs.tagArea.className].innerHTML = this.guideText
      }, 0)
      this.showEdit = !this.showEdit
    },
    handleImageType () {
      this.visible = !this.visible
    },
    toggleFolder () {
      this.$refs.folderTree.show(null, this.catalogue)
    },
    toggleLabel () {
      this.$emit('toggleLabel')
    },
    previewImage (index) {
      let imgs = []
      this.mediaList.forEach(item => {
        if (item.pitType === 1) {
          imgs.push(item.url)
        }
      })
      this.$emit('togglePreview', 0, imgs, 'img')
    },
    handleFolder ({ catalogue }) {
      this.catalogue = catalogue
    },
    removeImage (index) {
      this.model.mediaList.splice(index, 1)
    },
    // handleAvatarSuccess (res, file, fileList) {
    //   if (file.size / 1024 / 1024 > 2) {
    //     return
    //   }
    //   if (this.model.mediaList.length < this.imageNum) {
    //     let obj = {
    //       pitType: 1,
    //       pitText: '',
    //       type: 1,
    //       url: res.result.url
    //     }
    //     this.model.mediaList.push(obj)
    //   }
    //   this.$refs.imageForm.clearValidate()
    //   this.$refs.popoverView.doClose()
    // },
    // handleGuideSuccess (res, file) {
    //   let item = this.mediaList[this.editIndex]
    //   if (item) {
    //     item.url = res.result.url
    //   } else {
    //     let obj = {
    //       pitType: 2,
    //       pitText: this.guideText,
    //       type: 1,
    //       url: res.result.url
    //     }
    //     // this.mediaList[this.editIndex] = obj
    //   }
    //   this.showEidtImg = res.result.url
    // },
    beforeGuideUpload (file) {
      this.beforeAvatarUpload(file)
      this.$refs.popoverView.doClose()
    },
    beforeAvatarUpload (file) {
      // 图片格式判断
      if (!/\.(jpg|jpeg|png|JPG|PNG|JPEG)$/.test(file.name)) {
        this.$notify.error('仅支持jpg/jpeg/png的图片格式')
        return false
      }
      // 图片大小判断
      if (file.size / 1024 > 1024 * 2) {
        this.$notify.warning('上传图片不得大于2MB')
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
    handleDown (e) {
      if (e.keyCode === 13) {
        e.preventDefault()
        return false
      }
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
      this.model.shelfTime = this.model.shelfType === 1 ? '' : this.model.shelfTime
      this.model.endTime = this.model.endType === 1 ? '' : this.model.endTime
      const params = { ...this.detail, ...this.model, mType: this.mType }
      // 控制图片数量
      params.mediaList = this.mediaList
      let isLargeNumber = (item) => item.type === 2 && !item.content.video.includes('http')
      let findEditIndex = this.mediaList.findIndex(isLargeNumber)
      if (findEditIndex > -1) {
        this.$notify.warning('视频资源上传中，无法保存')
        return false
      }
      // 带码状态
      if (params.codeTarget === '') {
        params.codeType = 0
      }
      let flag = params.mediaList.length > 0 && params.mediaList.some(item => item.type === 1 || item.type === 0)
      if (!flag && (params.codeType === 1)) {
        this.$notify.warning('您未添加图片，暂无法植入二维码，请先添加图片')
        return false
      }
      params.materialScriptType = 1
      for (let i = 0; i < params.mediaList.length; i++) {
        let item = params.mediaList[i]
        if (item.type === 0) {
          params.materialScriptType = 2
          break
        }
      }
      params.content = this.$refs.tagContent.htmlToString(this.pitContent)
      params.parentId = this.catalogue[this.catalogue.length - 1].id

      this.loading = true
      // 校验推广内容是否是纯空格 或换行
      let tempContent = this.model.content
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
    },
    loadCompanyPlan () {
      this.$http
        .fetch(this.$api.guide.queryCompanyPlan, {})
        .then(resp => {
          if (resp.success) {
            let list = resp.result || []
            for (const item of list) {
              if (item.productCode === 'ecrp-wm') {
                this.showMiniCode = true
                break
              }
            }
          }
        })
        .catch(resp => {})
        .finally(() => {})
    }
  },
  mounted () {
    this.loadCompanyPlan()
    this.catalogue = this.breadcrumb && this.breadcrumb.length ? this.breadcrumb : [{ id: 0, name: '素材库' }]
  }
}
</script>
<style scoped>
/* @import '@theme/variables.pcss'; */
@import '../styles/image.css';
.top-title-view {
  width: 540px;
  height: 144px;
}
.library-image {
  >>> .el-form-item--small.el-form-item  {
    margin-bottom: 24px;
  }
  >>> .w-textarea{
    margin-bottom: 0;
  }
}
.library-image{
  /* padding-top: 12px; */
}
.guide-text {
  height: 22px;
  font-size: 14px;
  color: #595959;
  line-height: 22px;
  font-weight: 400;
  margin-bottom: 8px;
  margin-top: 16px;
}
.guide-input {
  height: 140px;
}
.upload-view {
  width: 114px;
  background: #f5f5f5;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.guide-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s;
  font-size: 16px;
  color: #fff;
  text-align: center;
  line-height: 114px;
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

.dialog-footer {
  margin-top: 47px;
}
.diag-view {
  width: 72px;
  height: 32px;
  margin-left: 16px;
  font-size: 14px;
  font-weight: 400;
  border-radius: 2px;
}
.input_textarea{
  height: 144px;
  width: 540px;
  >>> .el-textarea__inner {
    height: 100%;
    resize:none;
    overflow: hidden;
  }
  >>> .el-textarea__inner:focus{
    border-color: #d9d9d9
  }
}
@component-namespace library {
  @b image {
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
        border: 1px solid #e8e8e8;
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
      width: 80px;
      height: 80px;
      border: none;
      background-color: transparent;
      color: #8c8c8c;
      line-height: 80px;
      border-radius: var(--default-radius-mini);
      &:hover {
        /* border-color: var(--theme-color-primary); */
        /* color: var(--theme-color-primary); */
      }
    }
  }
  @b guide-uploader {
    >>> .el-upload--picture-card {
      width: 80px;
      height: 80px;
      border: none;
      background-color: transparent;
      color: #8c8c8c;
      line-height: 80px;
      border-radius: var(--default-radius-mini);
      border-radius: 2px;
      &:hover {
        /* border-color: var(--theme-color-primary); */
        /* color: var(--theme-color-primary); */
      }
    }
  }
  @b select-uploader {
    z-index: 100;
    display: inline-block;
    >>> .el-upload--picture-card {
      width: 90px;
      height: 90px;
      /* border: dashed 1px #dcdfe6; */
      background-color: transparent;
      font-size: 18px;
      color: #8c8c8c;
      line-height: 88px;
      border-radius: var(--default-radius-mini);
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover {
        border-color: var(--theme-color-primary);
        color: var(--theme-color-primary);
      }
    }
  }
  @b popover {
    display: flex;
    flex-direction: row;
    align-items: center;
    >>> .popover-base {
      width: 80px;
      height: 80px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    >>> .popver-image {
      width: 35px;
      height: 30px;
      color: red;
    }
    >>> .popver-text {
      font-size: 12px;
      color: #303133;
      line-height: 20px;
      font-weight: 400;
      margin-top: 5px;
    }
    >>> .popover-icon {
      font-size: 35px;
      color: #383838;
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
  >>> .el-form-grid {
    margin-left: var(--default-margin-larger);
  }
  @b guide {
    background: #ffffff;
    border-radius: ;
    display: block;
    width: 114px;
    display: flex;
    align-items: center;
    justify-content: center;
    >>> .el-upload-dragger {
      width: 114px;
      height: 114px;
      border: none;
      background-color: transparent;
      &:hover {
      }
    }
    >>> .el-upload-remind {
      font-size: 14px;
      color: #8c8c8c;
      text-align: center;
      line-height: 22px;
      font-weight: 400;
    }
    >>> .uploading-icon {
      margin-top: 20px;
      width: 60px;
      height: 46px;
      color: #0094fc;
    }
  }
  @b guide-remind {
    >>> .el-textarea__inner {
      height: 112px;
      font-size: 14px;
      line-height: 22px;
      font-weight: 400;
    }
  }
}
</style>
<style lang="scss" scoped>
.add-material {
  margin-top: 16px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 136px;
  height: 32px;
  color: #0094FC;
  background: #FFFFFF;
  border: 1px solid #DCDFE6;
  border-radius: 2px;
  .icon {
    font-size: 13px;
    color:#0091FA;
    margin-right: 5px;
  }
}
.add-material:hover{
  background: #e6f2ff;
}
.add-material-disabled {
  background: #F5F5F5;
  border: 1px solid #D9D9D9;
  color: #BFBFBF;
  .icon {
    color:#BFBFBF;
  }
}
.add-material-disabled:hover{
  background: #F5F5F5;
  cursor: not-allowed;
}
.add-tip::before {
  content: '';
  display: inline-block;
  background: #f2aa18;
  height: 8px;
  width: 8px;
  border-radius: 50%;
  margin-right: 8px;
  margin-bottom: 1px;
}
.select-time-view {
  background: #F5F5F5;
  border-radius: 2px;
  padding: 16px;
  margin-top: 16px;
  .remind-text {
    font-size: 14px;
    color: #595959;
    display: inline-block;
    margin-right: 26px;
  }
}
</style>
