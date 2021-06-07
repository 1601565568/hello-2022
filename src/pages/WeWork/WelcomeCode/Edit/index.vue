<template>
  <PageEdit>
    <template slot="header">
      <div class="common-header flex-box">
        <h3>新增智能欢迎语</h3>
        <div class="common-btn">
          <ns-button class="customer-btn_cancel" size="large" @click="$router.go(-1)" :loading="loading">取消</ns-button>
          <ns-button class="customer-btn_save" type="primary" size="large" @click="saveWelcome" :loading="loading">保存</ns-button>
        </div>
      </div>
    </template>
    <template slot='content'>
       <SimpleCollapse :title="'发布内容'">
          <PhoneBox phoneTitle phoneBar="内容预览">
            <template slot='collapse-left'>
              <el-form class="el-form-reset" size="medium" ref="ruleForm" :model="model" :rules="rules" label-width="98px" label-position="left">
                <el-form-item label="欢迎语" prop="content" :rules="rules.content" required>
                  <tag-area
                    class="tag-area"
                    v-model='model.content'
                    tag="wise"
                    ref="TagAreaText"
                    :maxlength="1000"
                    :tools='tools'
                    @inputLength="tagAreaInputLength"
                    placeholder="请输入欢迎语"
                    emojiClass=''
                  />
                </el-form-item>
                <el-form-item label="附件" prop="annexList">
                  <span class="add-tip label-gap">视频限制最大10MB，支持MP4格式；图片最大2MB，支持PNG、JPG格式；最多可添加9个附件</span>
                  <MessageList
                    :list.sync="model.annexList"
                    @edit="editAnnexMessage"
                  />
                  <el-popover
                    placement="top-start"
                    width="400"
                    trigger="hover"
                    :disabled="model.annexList.length >= 9"
                  >
                    <template slot="reference">
                      <div class="add-material" v-if="model.annexList.length < 9">
                        <Icon type="ns-add-border" class="icon"/>
                        添加消息内容
                      </div>
                      <div v-else class="add-material add-material-disabled" @click="$notify.error('附件已达上限（9个），不能再添加')">
                        <Icon type="ns-add-border" class="icon"/>
                        添加消息内容
                      </div>
                    </template>
                    <WechatMessageBar
                      ref="WechatMessageBar"
                      @addMessage="addAnnexMessage"
                    />
                  </el-popover>
                </el-form-item>
                <el-form-item label="使用范围">
                  <div class="select-area">
                    <span class="select-title">选择店铺</span>
                    <NsShopDialog
                      :selfBtn='true'
                      :appendToBody='true'
                      :isButton="false"
                      :auth="false"
                      type="icon"
                      btnTitle=""
                      dialogTitle="选择店铺"
                      v-model="model.shopIds"
                    >
                      <template slot='btnIcon'>
                        <div class="select-tips">
                          <span v-if="!model.shopIds.length" class="un-selected">请选择店铺</span>
                          <span v-else class="selected">已选择{{model.shopIds.length}}个店铺</span>
                          <Icon type="shop" class="icon"/>
                        </div>
                      </template>
                    </NsShopDialog>
                  </div>
                  <div class="select-area">
                    <span class="select-title">选择员工</span>
                    <NsGuideDialog
                      :selfBtn='true'
                      :appendToBody='true'
                      :isButton="false"
                      :auth="false"
                      type="primary"
                      btnTitle=""
                      dialogTitle="选择员工"
                      v-model="model.employeeIds"
                    >
                      <template slot='selfBtn'>
                        <div class="select-tips">
                          <span v-if="!model.employeeIds.length" class="un-selected">请选择员工</span>
                          <span v-else class="selected">已选择{{model.employeeIds.length}}个员工</span>
                          <Icon type="ns-people" class="icon"/>
                        </div>
                      </template>
                    </NsGuideDialog>
                  </div>
                  <div class="select-area">
                    <ChannelCodeDialog
                      :visible.sync="channelCodeDialogVisible"
                      @confirm="confirmChannelCodes"
                      :content="model.channelCodes"
                    />
                    <span class="select-title">选择渠道</span>
                      <div class="select-tips" @click="channelCodeDialogVisible = true">
                        <span v-if="!model.channelCodes.length" class="un-selected">请选择渠道</span>
                        <span v-else class="selected">已选择{{model.channelCodes.length}}个渠道</span>
                        <Icon type="channel" class="icon"/>
                      </div>
                  </div>
                </el-form-item>
              </el-form>
            </template>
            <template slot="collapse-right">
              <MessagePreviewPanel
                class="message-preivew-panel"
                :list="messageList"
                :messageType="WelcomeMessageType"
              />
            </template>
          </PhoneBox>
       </SimpleCollapse>
    </template>
  </PageEdit>
</template>

<script>
import PageEdit from '@/components/NewUi/PageEdit'
import SimpleCollapse from '@/components/NewUi/SimpleCollapse'
import PhoneBox from '@/components/NewUi/PhoneBox'
import TagArea from '@/components/NewUi/TagArea'
import NsGuideDialog from '@/components/NsGuideDialog'
import NsShopDialog from '@/components/NsShopDialog'
import ChannelCodeDialog from './ChannelCodeDialog'
import MessageList from './MessageList'
import WechatMessageBar from './WechatMessageBar'
import MessagePreviewPanel from './MessagePreviewPanel'
import { WelcomeMessageType } from '../types'

export default {
  components: {
    PageEdit,
    SimpleCollapse,
    PhoneBox,
    TagArea,
    NsGuideDialog,
    NsShopDialog,
    ChannelCodeDialog,
    MessageList,
    WechatMessageBar,
    MessagePreviewPanel
  },
  watch: {
    'model.content' () {
      this.welcomeMessage = {
        type: WelcomeMessageType.Text, // 文本消息即欢迎语，默认显示处理
        content: {
          content: this.$refs.TagAreaText.htmlToString(this.model.content, false),
          htmlContent: this.model.content,
          textContent: this.$refs.TagAreaText.htmlToText(this.model.content)
        }
      }
    }
  },
  computed: {
    messageList () {
      if (this.model.content) {
        return [ this.welcomeMessage, ...this.model.annexList ]
      } else {
        return this.model.annexList
      }
    }
  },
  data () {
    return {
      WelcomeMessageType: WelcomeMessageType,
      channelCodeDialogVisible: false,
      loading: false,
      welcomeInputLength: 0,
      welcomeMessage: undefined,
      model: {
        content: '',
        annexList: [
          // {
          //   type: 1,
          //   'content': {
          //     'image': 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/test/202104/80000002/59fb9189-deee-48ae-8e7d-4daf6e2b3aad.jpg'
          //   }
          // },
          // {
          //   type: 5,
          //   'content': {
          //     'video': 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/message/202105/80000002/80b6b861-14f6-4f8d-97f4-e1f9c22297ec.mp4'
          //   }
          // },
          // {
          //   'type': 2,
          //   'content': {
          //     'custom': 2,
          //     'settingId': '76recruiting',
          //     'link': 'https://sandbox-sg-v6.vecrp.com/mobile/index.html?groupId=80000002&guideUserId={guideUserId}&userId={userId}&source=2',
          //     'title': 'Dear，领会员卡享专属权益_1',
          //     'desc': 'Dear，点击立享专属会员服务哦',
          //     'image': 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/test/202104/80000002/59fb9189-deee-48ae-8e7d-4daf6e2b3aad.jpg'
          //   }
          // },
          // {
          //   'type': 3,
          //   'content': {
          //     'appid': 'wxsssss4546546',
          //     'path': '/page/aaa',
          //     'title': 'Dear，领会员卡享专属权益_1',
          //     'image': 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/test/202104/80000002/59fb9189-deee-48ae-8e7d-4daf6e2b3aad.jpg'
          //   }
          // },
          // {
          //   'type': 4,
          //   'content': {
          //     title: '我是海报',
          //     'configId': '131',
          //     'placard': 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/test/202104/80000002/59fb9189-deee-48ae-8e7d-4daf6e2b3aad.jpg'
          //   }
          // }
        ], // 附件列表
        shopIds: [], // 店铺ids
        employeeIds: [], // 员工ids
        channelCodes: [] // 渠道ids
      },
      rules: {
        content: [
          { required: true, message: '请输入欢迎语', trigger: ['blur'] }
        ]
      },
      // 欢迎语可插入标签
      tools: [
        { type: 'tag', text: '企业微信员工姓名', id: '{EmployeeNick}', value: '员工姓名' },
        { type: 'tag', text: '客户微信昵称', id: '{CustomerNick}', value: '客户昵称' },
        { type: 'tag', text: '企业微信员工别名', id: '{WeworkNickName}', value: '员工别名' }
      ]
    }
  },
  mounted () {
    this.getWelcomeCode()
  },
  methods: {
    tagAreaInputLength (length) {
      this.welcomeInputLength = length
      if (length > 0) {
        this.$refs.ruleForm.clearValidate('content')
      } else {
        if (this.$refs.ruleForm) this.$refs.ruleForm.validateField('content')
      }
    },
    addAnnexMessage (context) {
      const { index, content, type } = context
      if (index > -1) {
        // 编辑消息
        this.model.annexList.splice(index, 1, context)
      } else {
        // 新增消息
        if (this.model.annexList.length < 9) {
          this.model.annexList.push(context)
        } else {
          this.$notify.error('附件已达上限（9个），不能再添加')
        }
      }
    },
    editAnnexMessage (context) {
      this.$refs.WechatMessageBar.openMessageDialogByEdit(context)
    },
    confirmChannelCodes (channelIds) {
      this.model.channelCodes = channelIds
    },
    /**
     * 获取要编辑消息的详情
     */
    getWelcomeCode () {
      const welcomeCodeUuid = this.$route.query.welcomeCodeUuid
      if (welcomeCodeUuid) {
        this.$http.fetch(this.$api.weWork.welcomeCode.getWelcomeCode, {
          welcomeCodeUuid: welcomeCodeUuid
        })
          .then(resp => {
            this.model = {
              ...resp.result,
              content: this.$refs.TagAreaText.stringTohtml(resp.result.content, false)
            }
            this.$refs.TagAreaText.$refs[this.$refs.TagAreaText.className].innerHTML = this.model.content
          }).catch(resp => {
            this.$notify.error(resp.msg)
          })
      }
    },
    saveWelcome () {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.loading = true
          this.$http.fetch(this.$api.weWork.welcomeCode.saveOrUpdateWelcomeCode, {
            ...this.model,
            content: this.$refs.TagAreaText.htmlToString(this.model.content, false)
          })
            .then(resp => {
              if (resp.success) {
                this.$notify.success('保存成功')
                this.$router.push({
                  path: '/WeWork/WelcomeCode/WelcomeCodeList',
                  query: this.$route.query
                })
              } else {
                this.$notify.error('欢迎语保存失败')
              }
            }).catch((respErr) => {
              this.$notify.error('欢迎语保存失败')
            }).finally(() => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@components/NewUi/styles/reset.css";
@import "./styles/reset.css";

.el-form-reset {
  .el-form-item {
    margin-top: 26px;
    .el-input {
      width: 626px;
    }
    .tag-area {
      width: 626px;
    }
    .select-area {
      margin-top: 11px;
      width: 626px;
      height: 64px;
      background: #F5F5F5;
      font-size: 14px;
      display: flex;
      align-items: center;
      border-radius: 2px;
      .select-title {
        margin-left: 24px;
        display: inline-block;
      }
      .select-tips {
        width: 494px;
        height: 32px;
        margin-left: 36px;
        background: #fff;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          font-size: 14px;
          padding: 0 25px 0 9px;
          line-height: 32px;
        }
        .un-selected {
          color: #BFBFBF;
        }
        .selected {
          color: #606266;
        }
        .icon {
          color: #BFBFBF;
          font-size: 14px;
          margin-right: 9px;
        }
      }
    }
    .add-material {
      font-size: 14px;
      width: 136px;
      height: 100%;
      height: 36px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      .icon {
        font-size: 13px;
        color:#0091FA;
        margin-right: 5px;
      }
    }
    .add-material-disabled {
      color: #BFBFBF;
      .icon {
        color:#BFBFBF;
      }
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
  }
}
.message-preivew-panel {
  overflow: auto;
  height: 515px;
}
</style>
