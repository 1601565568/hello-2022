<template>
  <div class="library-image-form limit-scroll-view">
    <el-form ref="form" :model="model" :rules="rules" label-width="114px">
      <el-form-item label="群欢迎语" prop="textContent" required>
        <div class="top-title-view">
          <tag-area
            class="tag-area"
            v-model='pitContent'
            :maxlength="500"
            :showEmoji='true'
            :showTextEmoji='true'
            :tagSpecialHandle='true'
            :tools='tools'
            :disabled='disabled'
            ref="tagContent"
            className="tagContent"
            placeholder="可在此输入群欢迎语，限制长度在500个字符以内"
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
            :disabled="disabled"
          />
          <el-popover
            placement="top-start"
            width="320"
            trigger="hover"
            :disabled="mediaList.length === 1 || disabled"
          >
            <template slot="reference">
              <div class="add-material" v-if="!mediaList.length && !disabled">
                <Icon type="ns-add-border" class="icon"/>
                添加消息内容
              </div>
              <div v-else-if="!disabled" class="add-material add-material-disabled" @click="$notify.error('附件已达上限（1个），不能再添加')">
                <Icon type="ns-add-border" class="icon"/>
                添加消息内容
              </div>
              <div v-else class="add-material add-material-disabled">
                <Icon type="ns-add-border" class="icon"/>
                添加消息内容
              </div>
            </template>
            <WechatMessageBar
              :pitBit='true'
              :showPitBit='false'
              :needLink="false"
              ref="WechatMessageBar"
              :multipleImage='false'
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
    disabled: {
      type: Boolean,
      default: false
    },
    detail: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data: function () {
    const checkCode = (rule, value, callback) => {
      let valus = this.$refs.tagContent.$refs[this.$refs.tagContent.className].innerText
      // console.log(rule, value, value.length, this.pitContent, valus.length, valus, '规则')
      // console.log(this.model.textContent, 'this.model.textContent')
      if (value === '') {
        callback(new Error('请输入群欢迎语'))
      } else if (valus.length > 500) {
        callback(new Error('限制长度在500个字符以内'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      model: {
        textContent: '',
        mediaList: []
      },
      rules: {
        textContent: [
          // {
          //   required: true,
          //   message: '请输入群欢迎语',
          //   trigger: ['blur', 'change']
          // },
          {
            validator: checkCode,
            trigger: ['blur', 'change']
          }
        ]
        // mediaList: [{ required: true, message: '请添加附件', trigger: 'change' }]
      },
      imageNum: 1,
      tools: [
        { type: 'tag', text: '客户微信昵称', id: 'CustomerNick', value: '客户昵称' }
      ],
      pitContent: '',
      isUploading: false
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
      },
      deep: true
    },
    detail: [
      function (newObj) {
        const tempModel = { ...newObj }
        this.model.textContent = tempModel.textContent
        let obj = {
          type: tempModel.otherMsgType,
          content: {}
        }
        if (obj.type + '' === '1') {
          obj.content.image = tempModel.imageUrl
        } else if (obj.type + '' === '2') {
          obj.content.video = tempModel.videoUrl
        } else if (obj.type + '' === '3') {
          obj.content.desc = tempModel.linkDesc
          obj.content.image = tempModel.linkPicUrl
          obj.content.title = tempModel.linkTitle
          obj.content.link = tempModel.linkUrl
        } else if (obj.type + '' === '4') {
          obj.content.appid = tempModel.miniProgramAppId
          obj.content.path = tempModel.miniProgramPage
          obj.content.image = tempModel.miniProgramPicUrl
          obj.content.title = tempModel.miniProgramTitle
        }
        if (obj.type + '' === '0') {
          this.model.mediaList = []
        } else {
          this.model.mediaList = [obj]
        }
        this.pitContent = this.$refs.tagContent.stringTohtml(this.model.textContent, false)
        this.$refs.tagContent.$refs[this.$refs.tagContent.className].innerHTML = this.pitContent
      }
    ],
    pitContent (newObj) {
      this.model.textContent = this.$refs.tagContent.htmlToString(newObj, false)
      this.$emit('pitContent', this.model.textContent)
      this.$refs.form.clearValidate()
    }
  },
  methods: {
    // 上传进度
    uploadProgress (data) {
      if (data) {
        const percent = data.content.percent
        this.isUploading = percent !== '100.00'
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
      this.model.mediaList.splice(context.index, 1)
    },
    editAnnexMessage (context) {
      this.$refs.WechatMessageBar.openMessageDialogByEdit(context, true)
    },
    addAnnexMessage (context) {
      // console.log(context, 'context新增消息')
      const { index, content, type, isDelete } = context
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
    onBack () {
      this.$emit('back')
    },
    onSave () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.doSave()
        }
      })
    },
    doSave () {
      if (this.loading) {
        return
      }
      const params = { ...this.detail, ...this.model }
      // params.name = params.name.replace(/\s+/g, '')
      const obj = this.$refs.tagContent.count
      if (obj.num < 0) {
        this.$notify.warning('群欢迎语' + obj.text)
        return
      }
      if (this.mediaList.length) {
        const { content, type } = this.mediaList[0]
        params.otherMsgType = type
        if (type + '' === '1') {
          params.imageUrl = content.image
        } else if (type + '' === '2') {
          params.videoUrl = content.video
        } else if (type + '' === '3') {
          params.linkDesc = content.desc
          params.linkPicUrl = content.image
          params.linkTitle = content.title
          params.linkUrl = content.link
        } else if (type + '' === '4') {
          params.miniProgramAppId = content.appid
          params.miniProgramPage = content.path
          params.miniProgramPicUrl = content.image
          params.miniProgramTitle = content.title
        }
      } else {
        params.otherMsgType = 0
      }

      // 控制图片数量
      let isLargeNumber = (item) => item.type === 2 && !item.content.video.includes('http')
      let findEditIndex = this.mediaList.findIndex(isLargeNumber)
      if (findEditIndex > -1) {
        this.$notify.warning('视频资源上传中，无法保存')
        return false
      }

      params.textContent = this.$refs.tagContent.htmlToString(this.pitContent, false)
      delete params.mediaList

      this.loading = true
      let tempContent = this.model.textContent
      this.$http
        .fetch(this.$api.weWork.groupWelcomeCode.saveOrUpdate, params)
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
    // this.catalogue = this.breadcrumb && this.breadcrumb.length ? this.breadcrumb : [{ id: 0, name: '' }]
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
  /* height: 144px; */
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
