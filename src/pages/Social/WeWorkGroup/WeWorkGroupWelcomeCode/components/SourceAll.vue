<template>
  <div class="library-image-form limit-scroll-view">
    <el-form ref="form" :model="model" :rules="rules" label-width="114px">
      <el-form-item label="群欢迎语" required>
        <div class="top-title-view">
          <tag-area
            class="tag-area"
            v-model='pitContent'
            :maxlength="1500"
            :showEmoji='true'
            :showTextEmoji='true'
            :tools='tools'
            ref="tagContent"
            className="tagContent"
            placeholder="可在此输入群欢迎语，限制长度在1500个字符以内"
            tag="wise"
            emojiClass=''
          />
        </div>
      </el-form-item>
      <el-form-item ref="imageForm" label="附件：">
        <span class="add-tip label-gap">视频限制最大10MB，支持MP4格式；图片最大2MB，支持PNG、JPG、JPEG格式；最多可添加1个附件</span><br/>
        <!-- <span class="add-tip label-gap">最多可添加1个附件</span> -->
          <MessageList
            :list.sync="mediaList"
            @edit="editAnnexMessage"
            @delete="deleteAnnexMessage"
            :isUploading.sync="isUploading"
            @dragUploadList="dragUploadList"
          />
          <el-popover
            placement="top-start"
            width="320"
            trigger="hover"
            :disabled="mediaList.length === 1"
          >
            <template slot="reference">
              <div class="add-material" v-if="!mediaList.length">
                <Icon type="ns-add-border" class="icon"/>
                添加消息内容
              </div>
              <div v-else class="add-material add-material-disabled" @click="$notify.error('附件已达上限（1个），不能再添加')">
                <Icon type="ns-add-border" class="icon"/>
                添加消息内容
              </div>
            </template>
            <WechatMessageBar
              :pitBit='true'
              :showPitBit="false"
              ref="WechatMessageBar"
              :multipleImage='true'
              :limitImage='limitImage'
              @addMessage="addAnnexMessage"
              @uploadVideoProgress="uploadProgress"
            />
          </el-popover>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getErrorMsg } from '@/utils/toast'
import TagArea from '@/components/NewUi/TagArea'
import MessageList from './MessageList'
import WechatMessageBar from '@/pages/WeWork/WelcomeCode/Edit/WechatMessageBar/index'

export default {
  name: 'imageform',
  components: {
    TagArea,
    MessageList,
    WechatMessageBar
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
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
      NsGuide2DialogVisible: false,
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
        content: '',
        subdivisionIds: null,
        codeType: 2,
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
        shelfTime: '',
        notifyState: 0,
        notifyType: 1,
        guideIdList: [],
        notifyTime: ''
      },
      rules: {
        content: [
          {
            required: true,
            message: '请输入群欢迎语',
            trigger: ['blur', 'change']
          },
          {
            min: 0,
            max: 1500,
            message: '限制长度在1500个字符以内',
            trigger: ['blur', 'change']
          }
        ]
        // mediaList: [{ required: true, message: '请添加附件', trigger: 'change' }]
      },
      mType: 1,
      imageNum: 1,
      catalogue: [{ id: 0, name: '' }],
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
      showMiniCode: false,
      isUploading: false,
      disabledPicType: true,
      guideDatas: [] // 提醒设置，已选员工展示使用
    }
  },
  computed: {
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
        const isSelect = (item) => item.type === 1
        const index = newVal.findIndex(isSelect)
        if (index === -1) {
          this.disabledPicType = true
          this.model.codeType = 2
        } else {
          this.disabledPicType = false
        }
      },
      deep: true
    },
    detail: [
      function (newObj) {
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
      async function getGuideList (newObj) {
        const res = await this.$http.fetch(this.$api.core.sysUser.findByGuideIds, { userIds: newObj.guideIdList.slice(0, 5).join(',') })
        this.guideDatas = res.result
      }
    ],
    pitContent (newObj) {
      this.model.content = this.$refs.tagContent.htmlToString(newObj)
      this.$emit('pitContent', this.model.content)
    }
  },
  methods: {
    // 拖动事件处理
    dragUploadList (list) {
      this.model.mediaList = list
    },
    // 上传进度
    uploadProgress (data) {
      if (data) {
        const percent = data.content.percent
        this.isUploading = percent !== '100.00'
        // const deleteData = sessionStorage.getItem(data.content.uid)
        // if (deleteData) {
        //   return
        // }
        // // 根据uid判断是否存在
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
    deleteAnnexMessage (context) {
      // if (context.type === 2 && Number(context.content.percent) < 100) {
      //   sessionStorage.setItem(context.content.uid, context.content.uid)
      // }
      this.model.mediaList.splice(context.index, 1)
    },
    editAnnexMessage (context) {
      this.$refs.WechatMessageBar.openMessageDialogByEdit(context, true)
      // let isLargeNumber = (item) => item.type === 2 && !item.content.video.includes('http')
      // let findEditIndex = this.model.mediaList.findIndex(isLargeNumber)
      // if (findEditIndex > -1) {
      //   this.$notify.warning('视频资源上传中，请稍等')
      // } else {
      //   this.$refs.WechatMessageBar.openMessageDialogByEdit(context, true)
      // }
      // this.$refs.WechatMessageBar.openMessageDialogByEdit(context, true)
    },
    addAnnexMessage (context) {
      const { index, content, type, isDelete } = context
      const deleteData = sessionStorage.getItem(content.uid)
      if (content.uid) {
        let isLargeNumber = (item) => item.content.uid === content.uid
        let findEditIndex = this.model.mediaList.findIndex(isLargeNumber)
        if (findEditIndex > -1) {
          this.$set(this.model.mediaList, findEditIndex, context)
        }
      } else if (index > -1) {
        // 编辑消息
        this.$set(this.model.mediaList, index, context)
      } else {
        // 新增消息
        if (!this.model.mediaList.length) {
          this.model.mediaList.push(context)
        } else {
          this.$notify.error('附件已达上限（1个），不能再添加')
        }
      }
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
      if (e === 2) {
        this.selectGoods()
      } else if (e === 4) {
        this.selectMarket()
      }
    },
    codeTargetChange (e) {
      let codeTargetObj = e ? this.wechatPageUrlList[Number(e) - 1] : {}
      this.$set(this.model, 'codeTargetName', codeTargetObj.codeTargetName || '')
    },
    selectMarket () {
      this.$nextTick(() => {
        this.$refs.selectMarket.showToggle(this.model)
      })
    },
    selectGoods () {
      this.$nextTick(() => {
        this.$refs.selectGoods.showToggle(this.model)
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
      // 提醒设置更新
      this.model.shelfTime = this.model.shelfType === 1 ? '' : this.model.shelfTime
      this.model.endTime = this.model.endType === 1 ? '' : this.model.endTime
      if (this.model.notifyState === 0) {
        this.guideDatas = []
        this.model = {
          ...this.model,
          notifyType: 1,
          guideIdList: [],
          notifyTime: ''
        }
      }

      const params = { ...this.detail, ...this.model, mType: this.mType }
      params.name = params.name.replace(/\s+/g, '')
      const obj = this.$refs.tagContent.count
      if (obj.num < 0) {
        this.$notify.warning('推广文案' + obj.text)
        return
      }
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

      if (!this.isEdit && this.model.notifyState === 1 && this.model.notifyType === 2) {
        if (this.model.shelfType === 1 && new Date() > new Date(this.model.notifyTime)) {
          // 立即上架
          return this.$notify.warning('提醒时间需晚于当前时间')
        }

        if (this.model.shelfType === 0 && new Date(this.model.shelfTime) > new Date(this.model.notifyTime)) {
          // 自定义上架时间
          return this.$notify.warning('提醒时间需晚于素材上架时间')
        }
      }

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
    this.catalogue = this.breadcrumb && this.breadcrumb.length ? this.breadcrumb : [{ id: 0, name: '' }]
  }
}
</script>
<style scoped>
/* @import '@theme/variables.pcss'; */
@import '../styles/image.css';
.limit-scroll-view {
  max-height: 750px;
  overflow: scroll;
  &::-webkit-scrollbar-thumb {
     display: none;
  }
  &::-webkit-scrollbar {
     display: none;
  }
}
.run-link-view {
  width: 200px;
  height: 32px;
  background: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  display: flex;
  flex-direction: row;
  font-size: 14px;
  align-items: center;
  justify-content: space-between;
}
.run-link-name {
  width: 280px;
  font-size: 14px;
  color: #BFBFBF;
  margin-left: 5px;
  overflow: hidden;
  word-break: break-all;
  -webkit-line-clamp: 1;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
.run-link-true-name {
  color: #595959;
}
.run-icon-view {
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-top: -5px;
}
.top-title-view {
  width: 100%;
  height: 144px;
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
  height: 115px;
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

</style>
<style lang="scss" scoped>
.icon-plus {
  color: #0094FC;
  font-size: 14px;
  margin-left: 8px;
  display: inline-block;
}
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
  margin-top: 16px;
  display: flex;
  padding: 24px 16px 0 16px;
  flex-direction: row;
  width: 540px;
  .remind-text {
    font-size: 14px;
    color: #595959;
    display: inline-block;
    margin-right: 16px;
    line-height: 32px;
    height: 32px;
  }
}

.remind-setting {
  margin-bottom: 42px;
}

.employee-list {
  height: 30px;
  display: flex;
  align-items: center;
  padding-left: 9px;
  .selected-tip {
    position: absolute;
    top: -25px;
    right: 0;
    font-size: 12px;
    color: rgba(0,0,0,0.45);
    line-height: 20px;
    .selected-count {
      color: #0094FC;
    }
  }

  .employee-list_item {
    display: inline-block;
    align-items: center;
    background: #f5f5f5;
    margin-right: 4px;
    height: 24px;
    line-height: 24px;
    padding: 0 8px;
    border-radius: 12px;
    font-size: 14px;
    i {
      margin-left: 4px;
      cursor: pointer;
      display: inline;
    }
  }
  .employee-list_all {
    display: inline-block;
    height: 18px;
    line-height: 18px;
    color: #fff;
    width: 18px;
    text-align: center;
    border-radius: 50%;
    background: #8c8c8c;
    margin-top: 3px;
    cursor: pointer;
  }
  .employee-selected-text {
    font-size: 14px;
    padding-bottom: 8px;
  }
  .employee-text {
    font-size: 14px;
    line-height: 32px;
    color: #bfbfbf;
  }
}
.employee-suffix {
  cursor: pointer;
  min-width: 40px;
  font-size: 12px;
  color: #0392FB;
  text-align: center;
}
</style>
