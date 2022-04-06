<template>
  <PageEdit class="friend-marketing">
    <template slot="header">
      <div class="common-header flex-box">
        <h3>{{$route.query.messageId ? (openType === 'look' ? '查看' : openType === 'copy' ? '复制' : '编辑') : '新建'}}微信好友营销</h3>
        <div class="common-btn">
          <ns-button class="customer-btn_cancel" @click="cancel" size="large">取消</ns-button>
          <ns-button class="customer-btn_save"  :disabled="isUpdate" :loading="loading" @click='save' type="primary" size="large">保存</ns-button>
        </div>
      </div>
    </template>
    <template slot='content'>
      <el-form class="normal-from el-form-reset" size="medium" ref="formName" :model="model" :rules="rules" label-width="100px" label-position="left">
        <SimpleCollapse :title="'基本信息'" class="content">
          <el-form-item class="larger-item" label="活动名称" prop="name" required>
            <el-input v-model="model.name" :disabled="isUpdate" placeholder="请输入活动名称" class="el-input" show-word-limit :maxlength="30"></el-input>
          </el-form-item>
          <el-form-item class="larger-item" label="选择营销人群" prop="chatRoomIdList" required>
            <div class="select-area">
              <div
                class="select-tips"
                @click="openECDialog"
              >
                <el-input placeholder="请选择好友" :disabled="isUpdate" :value="selectedTip" readonly>
                  <!-- <Icon type="geren" class="icon" slot="suffix"></Icon> -->
                  <Icon type='icon-ns-people' class='icon' slot="suffix"/>
                </el-input>
              </div>
            </div>
          </el-form-item>
          <el-form-item class="form-slot" prop="executeMode" required>
            <span class="form-item-slot" slot="label">
              <div class="form-flex">
                <span>发送方式</span>
                <el-tooltip
                  class="message-icons-item"
                  content="设置任务发送的时间"
                  placement="top"
                >
                  <Icon type="ns-help" className="icon"/>
                </el-tooltip>
              </div>
            </span>
            <el-radio-group :disabled="isUpdate" v-model="model.executeMode" @change="changeExec" :class="[radioIcon==='QA'?radioQA:radio]">
              <el-radio :label="1">立即发送</el-radio>
              <el-radio :label="2">定时发送</el-radio>
            </el-radio-group>
            <div class="form-date" v-if="model.executeMode== 2">
              <span class="date-label">执行时间</span>
              <el-form-item prop="predictSendTime">
                <el-date-picker
                  :disabled="isUpdate"
                  v-model="model.predictSendTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
            </div>
          </el-form-item>
        </SimpleCollapse>
        <SimpleCollapse :title="'发布设置'">
          <PhoneBox phoneTitle :showPhoneHead="true">
            <template slot='collapse-left'>
              <el-form-item label="文案">
                <tag-area
                  :class="[radioIcon==='QA'? tagTextQA: tagText]"
                  :disabled="isUpdate"
                  v-model='model.textarea'
                  :tagSpecialHandle='true'
                  tag="wise"
                  ref="testText"
                  :maxlength="400"
                  @inputLength="changeInputLength"
                  placeholder="请输入文案内容"
                  emojiClass=''
                  @input='setView'
                  :showEmoji='true'
                  :showTextEmoji='true'
                />
              </el-form-item>
              <el-form-item ref="imageForm" label="附件">
                <span class="add-tip">视频限制最大10MB，支持MP4格式；图片最大2MB，支持PNG、JPG、JPEG格式；最多可添加9个附件</span>
                  <MessageList
                    :list.sync="mediaList"
                    @edit="editAnnexMessage"
                    @delete="deleteAnnexMessage"
                    :isUploading.sync="isUploading"
                    :disabled="isUpdate"
                  />
                  <el-popover
                    placement="top-start"
                    trigger="hover"
                    :disabled="!(mediaList.length < 9) || isUpdate"
                  >
                    <template slot="reference">
                      <div class="add-material" v-if="mediaList.length < 9 && !isUpdate">
                        <Icon type="ns-add-border" class="icon"/>
                        添加消息内容
                      </div>
                      <div v-else-if="!isUpdate" class="add-material add-material-disabled" @click="$notify.error('附件已达上限（9个），不能再添加')">
                        <Icon type="ns-add-border" class="icon"/>
                        添加消息内容
                      </div>
                      <div v-else class="add-material add-material-disabled">
                        <Icon type="ns-add-border" class="icon"/>
                        添加消息内容
                      </div>
                    </template>
                    <WechatMessageBar
                      ref="WechatMessageBar"
                      :multipleImage='false'
                      :limitImage='limitImage'
                      @addMessage="addAnnexMessage"
                      @uploadVideoProgress="uploadProgress"
                    />
                  </el-popover>
              </el-form-item>
            </template>
            <template slot="collapse-right">
              <MessagePreviewPanel :needMaxHeight="true" :hasBracket="false" class="message-preivew-panel" imageLabel="image" videoLabel="video" miniAndLinkImageLabel="image" :list="preList"/>
            </template>
          </PhoneBox>
        </SimpleCollapse>
      </el-form>
      <!-- 选择营销人群组件 -->
      <NsEmployeeOrCustGroupDialog ref="nsEmployeeOrCustGroupDialog" :needGroupName="true" :onlyOne="onlyOne" :disabled="isUpdate" :queryType="2" btnTitle="选择营销人群" v-model="employeeSelectData" :echoStore='true' :isNeedLink='true'></NsEmployeeOrCustGroupDialog>
    </template>
  </PageEdit>
</template>
<script>
import PageEdit from '@/components/NewUi/PageEdit'
import SimpleCollapse from '@/components/NewUi/SimpleCollapse'
import PhoneBox from '@/components/NewUi/PhoneBox'

import ElCard from '@nascent/nui/lib/card'
import scrollHeight from '@nascent/ecrp-ecrm/src/mixins/scrollHeight'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import ElUpload from '@nascent/nui/lib/upload'
import contentPreview from './contentPreview.vue'
import $ from 'jquery'
import moment from 'moment'
import NsEmployeeOrCustGroupDialog from '@/components/NsEmployeeOrCustGroupDialog'
import TagArea, { toolFn } from '@/components/NewUi/TagArea'
import MessageList from './components/MessageList'
import WechatMessageBar from './components/WechatMessageBar/index'
import MessagePreviewPanel from '@/pages/WeWork/SOP/components/MessagePreviewPanel/index.vue'
let vm
export default {
  mixins: [scrollHeight, tableMixin],
  components: {
    PageEdit,
    SimpleCollapse,
    PhoneBox,

    // ElCard,
    // contentPreview,
    NsEmployeeOrCustGroupDialog,
    // ElUpload,
    TagArea,
    MessageList,
    WechatMessageBar,
    MessagePreviewPanel
  },
  computed: {
    selectedTip () {
      if (this.employeeSelectData.data.length) {
        return `已选择${this.employeeSelectData.data.length}${this.employeeSelectData.type === 'employee' ? '个员工全部好友' : '个客户分群'}`
      } else {
        return ''
      }
    },
    preList () {
      let array = []
      array = (this.model.mediaList.slice(0, this.imageNum))
      if (this.model.textarea) {
        array.unshift({
          type: 0,
          content: {
            type: 'text',
            textContent: this.$refs.testText.htmlToString(this.model.textarea, false)
          }
        })
      }
      return array
    },
    // 展示的素材列表处理
    mediaList: {
      get () {
        return this.model.mediaList.slice(0, this.imageNum)
      },
      set (v) {
        let arr = []
        for (const item of v) {
          if (item && item.type !== 0) {
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
  data () {
    return {
      // 环境判断
      cloudPlatformType: this.$store.state.user.remumber.remumber_login_info.productConfig.cloudPlatformType,
      // preList: [], // 预览数组
      disabled: false, // 设置附件禁用
      isUploading: false, // 附件上传中标识
      imageNum: 9, // 允许图片张数
      isError: false,
      isUpdate: false,
      loading: false,
      onlyOne: '',
      model: {
        id: '',
        name: '',
        marketingType: '',
        customerType: '1',
        executeMode: 1,
        predictSendTime: '',
        textarea: '',
        type: '',
        mediaList: [],
        chatRoomIdList: []
      },
      copyType: '',
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        chatRoomIdList: [
          {
            validator: (rule, value, callback) => {
              const length = this.employeeSelectData.data.length
              if (!length) {
                callback(new Error('请选择营销人群'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        predictSendTime: [
          { required: true, message: '请选择执行时间', trigger: 'blur' }
        ],
        textarea: [
          {
            validator: (rule, value, callback) => {
              const text = this.$refs.testText.htmlToText(value)
              if (text.length > 1000) {
                callback(new Error('长度在 1 到 400 个字符'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (!value) {
                if (vm.model.type === '') {
                  callback(new Error('请输入发布文案'))
                } else {
                  callback()
                }
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      },
      employeeSelectData: {
        data: [],
        type: 'employee'
      },
      picUrl: '',
      code: '',
      // 页面滚动条配置
      scrollBarDeploy: {
        ref: 'fullScreen', // 页面滚动条ref的名称
        excludeHeight: 69 // 底部按钮的高度39 + 30顶部设置小程序积分体系的高度
      },
      inputLength: 0, // 文案输入字符数
      radioIcon: process.env.VUE_APP_THEME,
      radio: 'radio',
      radioQA: 'radioQA',
      tagText: 'tagText',
      tagTextQA: 'tagTextQA',
      openType: '' // 编辑页类型
    }
  },
  created: function () {
    vm = this
    vm.init()
  },
  mounted () {
    let { openType, messageId } = this.$route.query
    this.openType = openType
    if (openType === 'add' && this.cloudPlatformType === 'kd') {
      this.onlyOne = 'employee'
    }
  },
  watch: {
    'employeeSelectData.data' (val) {
      this.model.chatRoomIdList = val
    }
  },
  methods: {
    /**
     * 打开选择营销人群组件
     */
    openECDialog () {
      this.$refs.nsEmployeeOrCustGroupDialog.onDialogOpen()
    },
    setView () {
      // if (vm.model.textarea) {
      //   if (this.mediaList[0].type === 0) {
      //     this.mediaList[0].content.textContent = this.$refs.testText.htmlToString(this.model.textarea, false)
      //   } else {
      //     this.mediaList.unshift({
      //       type: 0,
      //       content: {
      //         type: 'text',
      //         textContent: this.$refs.testText.htmlToString(this.model.textarea, false)
      //       }
      //     })
      //   }
      // data.push({
      //   type: 0,
      //   msg: this.$refs.testText.htmlToString(vm.model.textarea, false)
      // })
      // }
      // this.$refs.preview.massData = data
    },
    clear () {
      vm.model.type = ''
      vm.setView()
      vm.show = false
    },
    changeInputLength (length) {
      this.inputLength = length
    },
    // 切换发送方式
    changeExec () {
      this.model.predictSendTime = ''
    },
    init () {
      const that = this
      const messageId = this.$route.query.messageId
      if (messageId) {
        this.$http.fetch(this.$api.marketing.weworkMarketing.getMsgDetail, { messageId })
          .then(resp => {
            const data = resp.result
            vm.isUpdate = that.openType === 'look'
            // vm.model.id = that.openType === 'copy' ? '' : data.id
            vm.model.name = data.name
            if (!data.predictSendTime) {
              vm.model.executeMode = 1
              vm.model.predictSendTime = ''
            } else {
              vm.model.executeMode = 2
              vm.model.predictSendTime = data.predictSendTime
            }
            vm.model.customerType = data.type + ''
            if (this.cloudPlatformType === 'ecrp') {
              const crm = localStorage.getItem('USER_LOCAL_COMPANY_PLAN')
              const isCrm = crm === '1'
              if (that.openType === 'copy') {
                if (!isCrm) {
                  if (data.type === 3) {
                    data.userGroupIds = ''
                    data.type = 1
                    vm.onlyOne = 'employee'
                  } else if (data.type === 1) {
                    vm.onlyOne = 'employee'
                  }
                } else {
                  vm.onlyOne = crm === '1' ? '' : 'employee'
                }
              } else {
                if (isCrm) {
                  vm.onlyOne = ''
                } else {
                  vm.onlyOne = data.type === 1 ? 'employee' : ''
                }
              }
              vm.copyCustomerType = vm.model.customerType
            } else {
              vm.onlyOne = 'employee'
            }
            if (data.content) {
              vm.model.textarea = toolFn.stringTohtml(data.content, false, { tools: [], emojiClass: '', showEmoji: true })
              // if (data.content.image && Object.keys(data.content.image).length > 0) {
              //   vm.picUrl = data.content.image.image
              //   vm.model.type = 1
              //   vm.show = true
              // }
              // if (data.content.picText && Object.keys(data.content.picText).length > 0) {
              //   vm.pic = data.content.picText
              //   vm.model.type = 2
              //   vm.show = true
              // }
              // if (data.content.miniPro && Object.keys(data.content.miniPro).length > 0) {
              //   vm.miniPro = data.content.miniPro
              //   vm.model.type = 3
              //   vm.show = true
              // }
            }
            this.model.mediaList = this.handleMediaList(data.attachments)
            // vm.setView()
            const employeeSelectData = {
              data: [],
              type: 'employee'
            }
            vm.employeeSelectData = employeeSelectData
            const userList = []
            const arr = data.targets.length && data.targets
            for (const item of arr) {
              let userItem = {}
              if (data.type === 1) {
                userItem = {
                  employeeID: item.targetId
                }
              } else {
                userItem = {
                  id: item.targetId
                  // targetName: item.targetName
                }
              }
              userList.push(userItem)
            }
            vm.employeeSelectData.data = userList
            if (data.type === 1) {
              vm.employeeSelectData.type = 'employee'
            } else {
              vm.employeeSelectData.type = 'group'
            }
          }).catch((resp) => {
            this.isError = true
            vm.$notify.error('数据查询失败！' || resp.msg)
          }).finally(() => {})
      }
    },
    handleMediaList (list) {
      let array = []
      if (list.length) {
        list.forEach(el => {
          if (el.type === 1) {
            array.push({
              type: 1,
              content: {
                fileName: el.title,
                image: el.remoteUrl
              }
            })
          } else if (el.type === 2) {
            array.push({
              type: 2,
              content: {
                fileName: el.title,
                video: el.remoteUrl,
                uid: ''
              }
            })
          } else if (el.type === 3) {
            array.push({
              type: 3,
              // Todo
              content: {
                brandId: '',
                custom: el.urlType,
                desc: el.description,
                image: el.picUrl,
                link: el.url,
                settingId: el.urlSettingId,
                title: el.title
              }
            })
          } else if (el.type === 4) {
            array.push({
              type: 4,
              content: {
                appid: el.appid,
                image: el.remoteUrl,
                path: el.page,
                title: el.title
              }
            })
          } else if (el.type === 5) {
            array.push({
              type: 5,
              content: {
                configId: el.qrcodePlacardConfigId,
                image: el.picUrl,
                title: el.title
              }
            })
          }
        })
      }
      return array
    },
    // change (tab) {
    //   if (tab.name === '1') {
    //     vm.selectData = vm.selectSubData
    //   } else {
    //     vm.selectData = vm.selectEmpData
    //   }
    //   vm.model.customerType = tab.name
    //   this.$refs.selectTree.getCheckedNodes().splice(0, this.$refs.selectTree.getCheckedNodes().length)
    //   this.selectedData = []
    //   this.selectKeys = []
    // },
    // initSubTree: function () {
    //   const that = this
    //   // 分群类别加载
    //   this.$http.fetch(this.$api.marketing.weworkMarketing.getSubdivisionList)
    //     .then(resp => {
    //       // id 为-1 只是用来点击显示全部的分群，不用于做添加修改等操作
    //       const serverData = [{ id: 0, pId: null, label: '全部', isRoot: true }]
    //       $.each(resp.result, function (index, element) {
    //         serverData.push({
    //           id: element.id,
    //           pId: element.parent_id,
    //           label: element.subdivision_name,
    //           isRoot: false,
    //           disabled: element.is_category === 1
    //         })
    //       })
    //       this.selectSubData = this.transformToTreeFormat(serverData, this.treeDefaultSetting)
    //       vm.selectData = vm.selectSubData
    //     }).catch(() => {
    //       that.$notify.error('客户分群加载失败！')
    //     })
    // },
    // initEmpTree: function () {
    //   const that = this
    //   // 分群类别加载
    //   this.$http.fetch(this.$api.marketing.weworkMarketing.queryDeptAndEmpl, { isEnterprise: true })
    //     .then(resp => {
    //       // id 为-1 只是用来点击显示全部的分群，不用于做添加修改等操作
    //       const serverData = [{ id: 0, pId: null, label: '全部', isRoot: true }]
    //       $.each(resp.result, function (index, element) {
    //         serverData.push({
    //           id: element.id,
    //           pId: element.parentId,
    //           label: element.name,
    //           isRoot: false,
    //           disabled: element.type === 1
    //         })
    //       })
    //       this.selectEmpData = this.transformToTreeFormat(serverData, this.treeDefaultSetting)
    //     }).catch(() => {
    //       that.$notify.error('员工加载失败！')
    //     })
    // },

    // Todo 待清理，看一下有无作用
    initCrmData () {
      const crm = localStorage.getItem('USER_LOCAL_COMPANY_PLAN')
      this.onlyOne = crm === '1' ? '' : 'employee'
    },
    verifyProductToCRM: function () {
      // 编辑保留之前的任务的状态
      if (this.$route.query.messageId) {
        return
      }
      this.initCrmData()
    },

    save () {
      this.$refs.formName.validate((valid) => {
        if (!valid) {
          return false
        } else {
          return vm.saveOrUpdate()
        }
      })
    },
    saveOrUpdate () {
      if (!this.employeeSelectData.data || this.employeeSelectData.data.length === 0) {
        this.$notify.warning('请选择营销人群')
        return false
      }
      if (!this.model.textarea && this.mediaList.length === 0) {
        this.$notify.warning('请输入文案内容或添加附件')
        return false
      }
      this.loading = true
      const target = JSON.parse(JSON.stringify(this.model))
      if (target.executeMode === 1) {
        target.predictSendTime = null
      }
      if (vm.model.textarea) {
        target.content = this.$refs.testText.htmlToString(vm.model.textarea, false)
      }
      if (vm.model.mediaList.length) {
        let array = []
        vm.model.mediaList.forEach(el => {
          if (el.type === 1) {
            array.push({
              type: 1,
              remoteUrl: el.content.image,
              title: el.content.fileName
            })
          } else if (el.type === 2) {
            array.push({
              type: 2,
              remoteUrl: el.content.video,
              title: el.content.fileName
            })
          } else if (el.type === 3) {
            array.push({
              type: 3,
              // Todo
              picUrl: el.content.image,
              description: el.content.desc,
              url: el.content.link,
              title: el.content.title,
              urlType: el.content.custom,
              urlSettingId: el.content.settingId
            })
          } else if (el.type === 4) {
            array.push({
              type: 4,
              appid: el.content.appid,
              remoteUrl: el.content.image,
              page: el.content.path,
              title: el.content.title
            })
          } else if (el.type === 5) {
            array.push({
              type: 5,
              qrcodePlacardConfigId: el.content.configId,
              picUrl: el.content.image,
              title: el.content.title
            })
          }
        })
        target.attachments = array
      }
      if (this.employeeSelectData.type === 'employee') {
        target.type = 1
        target.targets = (!this.employeeSelectData.data || this.employeeSelectData.data.length === 0) ? [] : this.employeeSelectData.data.map(value => { return { targetId: parseInt(value.employeeID), targetName: '' } })
      } else {
        target.type = 3
        target.targets = (!this.employeeSelectData.data || this.employeeSelectData.data.length === 0) ? [] : this.employeeSelectData.data.map(value => { return { targetId: parseInt(value.id), targetName: value.targetName } })
      }
      let apiUrl = ''
      if (this.openType === 'add' || this.openType === 'copy') {
        apiUrl = this.$api.marketing.weworkMarketing.saveEnterprise
      } else if (this.openType === 'edit') {
        apiUrl = this.$api.marketing.weworkMarketing.updateEnterprise
        target.messageId = this.$route.query.messageId
      }
      this.$http.fetch(apiUrl, target)
        .then(() => {
          this.$notify.success('保存成功')
          vm.cancel()
        }).catch((error) => {
          vm.$notify.error('保存失败' || error.msg)
        }).finally(() => {
          this.loading = false
          return true
        })
    },
    cancel () {
      vm.$router.replace({ path: '/Marketing/EnterpriseMessage' })
    },
    // 附件处理 start
    // 编辑附件列表
    editAnnexMessage (context) {
      this.$refs.WechatMessageBar.openMessageDialogByEdit(context, true)
    },
    // 删除附件
    deleteAnnexMessage (context) {
      this.model.mediaList.splice(context.index, 1)
    },
    // 新增附件
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
        if (this.model.mediaList.length < 9) {
          this.model.mediaList.push(context)
        } else {
          this.$notify.error('附件已达上限（9个），不能再添加')
        }
      }
    },
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
    }
  }
}
</script>

<style lang="scss" scoped>
// @import "@theme/variables.pcss";
@import "@components/NewUi/styles/reset.css";
.friend-marketing{
  .el-form-reset{
    .el-form-item {
      .el-input{
        width: 626px;
        height: 32px;
      }
      ::v-deep .el-input__suffix{
        height: 30px;
        line-height: 30px;
        &.el-input__suffix:before{
          display: none;
        }
      }
    }
    .select-area {
      width: 626px;
      .select-tips {
        .icon {
          color: #BFBFBF;
          font-size: 24px;
          margin-top: 4px;
          margin-right: 4px;
        }
      }
    }
    .form-slot{
      ::v-deep label{
        // display: flex;
        // align-items: center;
      }
    }
    .form-item-slot{
      display: inline-block;
      height: 32px;
      line-height: 32px;
      .form-flex{
        display: flex;
        align-items: center;
        .message-icons-item{
          margin-left: 4px;
        }
      }
    }
    .form-date{
      display: flex;
      align-items: center;
      width: 626px;
      padding: 16px;
      border: 1px solid #D9D9D9;
      border-radius: 2px;
      .date-label{
        font-size: 14px;
        color: #595959;
        margin-right: 8px;
        line-height: 32px;
      }
      .el-date-editor--datetime{
        width: 364px;
      }
    }
    .tag-class{
      margin-bottom: 0;
    }
    .add-tip{
      font-size: 12px;
      color: #595959;
      line-height: 20px;
      vertical-align: top;
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
  }
  // @b spacelarger {
  //   margin-top: var(--default-margin-larger);
  // }
}
.radioQA>>> .el-radio__input.is-checked .el-radio__inner{
  border-color: #2153D4;
  background: #2153D4;
}
.radio>>> .el-radio__input.is-checked .el-radio__inner{
  border-color: #0091FA;
  background: #0091FA;
}
.radioQA>>> .el-radio__input.is-checked + .el-radio__label{
  color: #2153D4;
}
.radio>>>.el-radio__input.is-checked + .el-radio__label{
  color: #0091FA;
}
 .tagTextQA>>> .emoji-icon{
  color: #2153D4;
}
 .tagText >>> .emoji-icon{
  color: #0091FA;
}
</style>
