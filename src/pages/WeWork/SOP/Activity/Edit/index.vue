<template>
  <PageEdit>
    <template slot='header'>
      <div class='common-header flex-box'>
        <h3>社群日历</h3>
        <div class='common-btn'>
          <ns-button class='customer-btn_cancel' size='large' @click="$router.go(-1)" :loading="btnLoading">取消</ns-button>
          <ns-button class='customer-btn_save' type="primary" size='large' @click="saveActivity(SOPExamineStatus.UnSubmit)" :loading="btnLoading">保存</ns-button>
          <ns-button class='customer-btn_save' type="primary" size='large' @click="saveActivity(SOPExamineStatus.Pending)" :loading="btnLoading">保存并提交审核</ns-button>
        </div>
      </div>
    </template>
    <template slot='content'>
      <el-form class="el-form-reset" size="medium" ref="ruleForm" :model="model" :rules="rules" label-width="98px" label-position="right">
        <SimpleCollapse :title="'基本信息'" class="content">
          <el-form-item label="编号" required>
            <span>{{model.code}}</span>
          </el-form-item>
          <el-form-item label="名称" prop="name" required>
            <el-input v-model="model.name" placeholder="请输入名称" class="el-input" :length="10"></el-input>
          </el-form-item>
          <el-form-item label="发送群" prop="chatRoomIdList" required>
            <NsRoomDialog
              :visible.sync="roomDialogVisible"
              :chatIds.sync="model.chatRoomIdList"
            />
            <div class="select-area">
              <div
                class="select-tips"
                @click="roomDialogVisible = true"
              >
                <el-input suffix-icon="geren" placeholder="请选择群" :value="selectedTip" readonly>
                  <Icon type="geren" class="icon" slot="suffix"></Icon>
                </el-input>
              </div>
            </div>
          </el-form-item>
          <div style="position: relative">
            <el-form-item label="发送方式" prop="sendType" required style="padding-bottom: 24px">
              <el-radio-group v-model="model.sendType">
                <el-radio :label="0">
                  立即发送
                  <el-tooltip
                    class="message-icons-item"
                    content="审核成功后发送消息内容"
                    placement="top"
                  >
                    <Icon type="ns-help" className="icon"/>
                  </el-tooltip>
                </el-radio>
                <el-radio :label="1">定时发送</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="model.sendType === 1" class="el-form-item_send-time" prop="sendTime" label-width="0">
              <el-date-picker
                class="el-date-picker"
                type="datetime"
                placeholder="请选择"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="pickerOptions"
                default-time="12:00:00"
                v-model="model.sendTime"
              />
            </el-form-item>
          </div>
        </SimpleCollapse>
        <SimpleCollapse :title="'发布内容'">
          <PhoneBox>
            <template slot='collapse-left'>
              <el-form-item label="素材" prop="contentList" required>
                <el-popover
                  placement="top-start"
                  width="480"
                  trigger="hover"
                  :disabled="model.contentList.length >= 10"
                >
                  <template slot="reference">
                    <div v-if="model.contentList.length < 10" class="add-material">
                      <Icon type="ns-add-border" class="icon"/>
                      添加消息内容
                    </div>
                    <div v-else class="add-material" @click="$message.error('最多添加10条消息')">
                      <Icon type="ns-add-border" class="icon"/>
                      添加消息内容
                    </div>
                  </template>
                  <WechatMessageBar
                    ref="WechatMessageBar"
                    @addMessage="addMessage"
                    @uploadVideoProgress="uploadProgress"
                  />
                </el-popover>
                <span class="add-tip label-gap">最多添加10条消息，图片最大2M，视频最大10M</span>
              </el-form-item>
              <el-form-item>
                <MessageList
                  :list.sync="model.contentList"
                  @edit="editMessage"
                  @delete="deleteAnnexMessage"
                />
                <!-- <div class="message-table label-gap">
                  <el-table
                    style="width: 100%;"
                    class="table-form_reset"
                    height="520px"
                    :data="model.contentList"
                  >
                    <el-table-column prop="content" width="157px" style="max-height: 60px" label="消息内容" >
                      <template slot-scope="scope">
                        <TextMessage
                          v-if="scope.row.type === SOPActivityMessageType.Text"
                          class="text-message"
                          :content="scope.row.content"
                        />
                        <ImageMessage
                          v-else-if="scope.row.type === SOPActivityMessageType.Image || scope.row.type === SOPActivityMessageType.Poster"
                          class="image-message"
                          :content="scope.row.content"
                        />
                        <VideoMessage
                          v-else-if="scope.row.type === SOPActivityMessageType.Video"
                          class="video-message"
                          :content="scope.row.content"
                        />
                        <NewsMessage
                          v-else-if="scope.row.type === SOPActivityMessageType.Link"
                          class="news-message"
                          :content="scope.row.content"
                        />
                        <MiniProgramMessage
                          v-else-if="scope.row.type === SOPActivityMessageType.MiniProgram"
                          class="mini-message"
                          :content="scope.row.content"
                        />
                      </template>
                    </el-table-column>
                    <el-table-column prop="type" label="内容类型" width="78px">
                      <template slot-scope="scope">
                        {{scope.row.type | msgTypeText}}
                      </template>
                    </el-table-column>
                    <el-table-column label="发送顺序" width="156px">
                      <template slot-scope="scope">
                        <div class="send-sort" :class="{ 'first-line': scope.$index === 0 }">
                          <NsButton v-show="scope.$index !== 0" type="text" @click="sortMessage(scope.$index, 'top')">
                            <Icon type="zhiding"/>
                          </NsButton>
                          <NsButton v-show="scope.$index !== 0" type="text" @click="sortMessage(scope.$index, 'up')">
                            <Icon type="top-arr"/>
                          </NsButton>
                          <NsButton v-show="scope.$index !== model.contentList.length - 1" type="text" @click="sortMessage(scope.$index, 'down')">
                            <Icon type="down-arr"/>
                          </NsButton>
                          <NsButton v-show="scope.$index !== model.contentList.length - 1" type="text" @click="sortMessage(scope.$index, 'bottom')">
                            <Icon type="zhidi"/>
                          </NsButton>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="128px">
                      <template slot-scope="scope">
                        <NsButton type="text" @click="editMessage(scope.row, scope.$index)">编辑</NsButton>
                        <NsButton type="text" @click="deleteMessage(scope.row, scope.$index)">删除</NsButton>
                      </template>
                    </el-table-column>
                  </el-table>
                </div> -->
              </el-form-item>
            </template>
            <template slot="collapse-right">
              <MessagePreviewPanel class="message-preivew-panel" :list="model.contentList"/>
            </template>
          </PhoneBox>
        </SimpleCollapse>
      </el-form>
    </template>
  </PageEdit>
</template>

<script>
import PageEdit from '@/components/NewUi/PageEdit'
import SimpleCollapse from '@/components/NewUi/SimpleCollapse'
import PhoneBox from '@/components/NewUi/PhoneBox'
import NsRoomDialog from '@/components/NsRoomDialog'
import MessagePreviewPanel from '../../components/MessagePreviewPanel/index.vue'
// import { TextMessage, ImageMessage, VideoMessage, NewsMessage, MiniProgramMessage } from '../../components/ActivityMessage/index.vue'
import WechatMessageBar from './WechatMessageBar'
import { SOPActivityMessageType, SOPExamineStatus } from '../../types'
import MessageList from './MessageList'
export default {
  components: {
    PageEdit,
    SimpleCollapse,
    PhoneBox,
    NsRoomDialog,
    MessagePreviewPanel,
    // TextMessage,
    // ImageMessage,
    // VideoMessage,
    // NewsMessage,
    // MiniProgramMessage,
    WechatMessageBar,
    MessageList
  },
  filters: {
    msgTypeText (type) {
      switch (type) {
        case SOPActivityMessageType.Text:
          return '文本'
        case SOPActivityMessageType.Image:
          return '图片'
        case SOPActivityMessageType.Video:
          return '视频'
        case SOPActivityMessageType.Link:
          return '链接'
        case SOPActivityMessageType.MiniProgram:
          return '小程序'
        case SOPActivityMessageType.Poster:
          return '海报'
        default:
          return ''
      }
    }
  },
  computed: {
    selectedTip () {
      if (this.model.chatRoomIdList.length) {
        return `已选择${this.model.chatRoomIdList.length}个群`
      } else {
        return ''
      }
    }
  },
  data () {
    return {
      test: [ 'wraQfGDQAAJgQCRn4aIOsbN1balDuV3Q', 'wraQfGDQAA20PS7x3olaip6zWb6N9vmg', 'wraQfGDQAAb6YBajyT4sFqVsB0rbxr1A' ],
      roomDialogVisible: false,
      SOPActivityMessageType: SOPActivityMessageType,
      SOPExamineStatus: SOPExamineStatus,
      btnLoading: false,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24
        }
      },
      model: {
        id: null, // 标识
        code: '', // 任务编号
        name: '', // 任务名称
        chatRoomIdList: [], // 发送群
        sendType: 0, // 发送状态 0 立即发送 1 定时发送
        sendTime: '', // 发送时间 sendType = 1 定时发送时使用
        submitReview: 0, // 提交审核状态 0 不审核 1 审核
        contentList: [
          // {
          //   content: {
          //     type: 'text',
          //     content: '{EMOJI_[太阳]}{#GUIDESHOP#}{#GUIDENAME#}你好啊',
          //     htmlContent: '<wise id="r1619168721172d480" class="EMOJI_[太阳]">[太阳]</wise><wise id="r1619168717832d305" class="#GUIDESHOP#">导购门店名称</wise><wise id="r1619168717493d810" class="#GUIDENAME#">导购姓名</wise>你好啊',
          //     textContent: '{[太阳]}{导购门店名称}{导购姓名}你好啊'
          //   },
          //   type: 0
          // },
          // {
          //   content: {
          //     type: 'image',
          //     mediaid: 'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
          //   },
          //   type: 1
          // },
          // {
          //   content: {
          //     type: 'video',
          //     mediaid: 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/guide/202104/80000002/7033e4f2-75ff-4cbb-89ca-833474fea024.mp4'
          //   },
          //   type: 2
          // },
          // {
          //   content: {
          //     type: 'news',
          //     link: 'https://search-operate.cdn.bcebos.com/d054b8892a7ab572cb296d62ec7f97b6.png',
          //     title: '我是链接标题',
          //     desc: '这个是一个链接描述',
          //     imgUrl: 'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
          //   },
          //   type: 3
          // },
          // {
          //   content: {
          //     type: 'miniprogram',
          //     appid: 'wx8bd80126147df384',
          //     title: 'this is title',
          //     imgUrl: 'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg',
          //     page: '/index/page.html'
          //   },
          //   type: 4
          // },
          // {
          //   content: {
          //     type: 'poster',
          //     mediaid: 'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg',
          //     model: {
          //       createTime: '2021-04-08 17:46:31',
          //       id: '108',
          //       configId: '108',
          //       loginAccount: '18961400576',
          //       placard: 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/GUIDE_WECHAT_QRCODE_PLACARD/80000002/0/a5376eba-0264-416e-a56d-216347033717.png',
          //       title: '看看海报',
          //       type: 1
          //     }
          //   },
          //   type: 5
          // }
        ] // 发送消息详情集合 { content: {}, type, }
      },
      // 校验规则
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: ['blur', 'change'] },
          { max: 10, message: '最多可输入10个字符', trigger: ['blur', 'change'] }
        ],
        chatRoomIdList: [
          { required: true, message: '请选择群', trigger: 'change' },
          { validator: (rule, value, callback) => {
            if (!value || value.length <= 0) {
              callback(new Error(`请选择群`))
            } else {
              callback()
            }
          },
          message: '请选择群',
          trigger: ['blur', 'change']
          }
        ],
        sendTime: [
          { required: true, message: '请选择发送时间', trigger: 'change' },
          { validator: (rule, value, callback) => {
            if (Date.now() > (new Date(value)).getTime()) {
              callback(new Error(`发送时间必须大于当前时间`))
            } else {
              callback()
            }
          },
          message: '发送时间必须大于当前时间',
          trigger: ['blur', 'change']
          }
        ],
        contentList: [
          { required: true, message: '请添加素材消息', trigger: 'change' },
          { validator: (rule, value, callback) => {
            if (!value || value.length <= 0) {
              callback(new Error(`请添加素材消息`))
            } else {
              callback()
            }
          },
          message: '请添加素材消息',
          trigger: ['blur', 'change']
          }
        ]
      },
      isCopy: false
    }
  },
  async mounted () {
    if (this.$route.params.id > 0) {
      this.isCopy = !!this.$route.query.isCopy
      // 编辑
      await this.getActivityDetailById(this.$route.params.id)
      // 复制
      if (this.isCopy) {
        this.getActivityCode()
      }
    } else {
      // 新增 获取任务编号
      this.getActivityCode()
    }
  },
  methods: {
    uploadProgress (data) {
      if (data) {
        const deleteData = sessionStorage.getItem(data.content.uid)
        if (deleteData) {
          return
        }
        if (data.index >= 0) {
          // 编辑
          this.model.contentList.splice(data.index, 1, data)
        } else {
          // 根据uid判断是否存在
          let isLargeNumber = (item) => item.content.uid === data.content.uid
          let findEditIndex = this.model.contentList.findIndex(isLargeNumber)
          if (findEditIndex === -1) {
            // 新添加
            let findIndex = this.model.contentList.length
            let objData = { ...data, uid: data.content.uid }
            this.model.contentList.push(objData)
          } else {
            this.model.contentList.splice(findEditIndex, 1, data)
          }
          const limit = Number(data.content.percent) === 100
        }
      }
    },
    getActivityDetailById (id) {
      return new Promise((resolve) => {
        this.$http.fetch(this.$api.weWork.sop.findById, { id })
          .then(resp => {
            const model = resp.result
            if (this.isCopy) {
              model.code = null
              model.id = null
            }
            this.model = model
            resolve()
          }).catch(() => {
            this.$notify.error('获取活动详情失败')
          })
      })
    },
    /**
     * 获取活动任务编号
     */
    getActivityCode () {
      this.$http.fetch(this.$api.weWork.sop.getCode)
        .then(resp => {
          this.model.code = resp.result
        }).catch(() => {
          this.$notify.error('获取活动任务编号失败')
        })
    },
    /**
     * 保存活动
     */
    saveActivity (submitReview) {
      let isLargeNumber = (item) => item.type === 2 && !item.content.mediaid.includes('http')
      let findEditIndex = this.model.contentList.findIndex(isLargeNumber)
      if (findEditIndex > -1) {
        this.$notify.warning('视频资源上传中，无法保存')
        return false
      }
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.btnLoading = true
          this.$http.fetch(this.$api.weWork.sop.addOrUp, {
            ...this.model,
            submitReview
          })
            .then(resp => {
              if (resp.success) {
                this.$notify.success('保存成功')
                this.$router.push({
                  path: '/Marketing/SOP',
                  query: this.$route.query
                })
              } else {
                this.$notify.error('活动保存失败')
              }
            }).catch((respErr) => {
              if (respErr.success === false && respErr.code === '1031') {
                this.getActivityCode()
                this.$notify.error('编号重复已自动更新，请重新保存')
              } else {
                this.$notify.error('活动保存失败')
              }
            }).finally(() => {
              this.btnLoading = false
            })
        }
      })
    },
    /**
     * 选择群
     */
    selectedRoom (data) {
      this.model.chatRoomIdList = data
    },
    /**
     * 改变消息顺序
     * @param index 当前消息位置
     * @param direction 改变方向 top up down bottom
     */
    sortMessage (index, direction) {
      const [ delItem ] = this.model.contentList.splice(index, 1)
      if (direction === 'top') {
        this.model.contentList.unshift(delItem)
      } else if (direction === 'bottom') {
        this.model.contentList.push(delItem)
      } else if (direction === 'up') {
        this.model.contentList.splice(index - 1, 0, delItem)
      } else if (direction === 'down') {
        this.model.contentList.splice(index + 1, 0, delItem)
      }
    },
    /**
     * 新增素材消息
     */
    addMessage (context) {
      const { index, content, type, isDelete } = context
      const deleteData = sessionStorage.getItem(content.uid)
      if (deleteData && type === 2) {
        sessionStorage.removeItem(content.uid)
        return
      }
      if (index) {
        this.$set(this.model.contentList, index, context)
      } else if (content.uid) {
        let isLargeNumber = (item) => item.content.uid === content.uid
        let findEditIndex = this.model.contentList.findIndex(isLargeNumber)
        if (findEditIndex > -1) {
          this.$set(this.model.contentList, findEditIndex, context)
        }
      } else {
        if (index > -1) {
          // 编辑消息
          this.$set(this.model.contentList, index, context)
        } else {
          // 新增消息
          if (this.model.contentList.length < 9) {
            this.model.contentList.push(context)
          } else {
            this.$notify.error('附件已达上限（9个），不能再添加')
          }
        }
      }
    },
    /**
     * 编辑素材消息
     */
    editMessage (data, index) {
      this.$refs.WechatMessageBar.openMessageDialogByEdit({ ...data, index })
    },
    deleteMessage (data, index) {
      this.model.contentList.splice(index, 1)
    },
    deleteAnnexMessage (context) {
      if (context.type === 2 && Number(context.content.percent) < 100) {
        sessionStorage.setItem(context.content.uid, context.content.uid)
      }
      // this.model.contentList.splice(context.index, 1)
    }
  }
}
</script>

<style>
.send-sort {
  padding: 0 20px;
}
.first-line {
  display: flex;
  justify-content: flex-end;
}
</style>

<style lang="scss" scoped>
@import "@components/NewUi/styles/reset.css";
@import "./styles/reset.css";
@import "../../styles/table-reset.css";

.select-area {
  width: 680px;
  .select-tips {
    .icon {
      color: #BFBFBF;
      font-size: 24px;
      margin-top: 4px;
      margin-right: 4px;
    }
  }
}

.el-form-reset {
  margin-bottom: 20px;
  .el-form-grid {
    .el-form-item {
      margin-top: 0;
    }
  }

  .el-form-item_send-time {
    position: absolute;
    top: -30px;
    left: 328px;
  }

  .el-form-item {
    margin-top: 29px;
    .label-gap {
      margin-left: 36px;
    }
    .el-input {
      width: 626px;
    }
    span {
      font-size: 14px;
    }
    .select-group {
      display: flex;
      flex-direction: column;
      button {
        width: 36px;
        font-size: 12px;
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
      // justify-content: center;
      .icon {
        font-size: 13px;
        color:#0091FA;
        margin-right: 5px;
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

    .el-date-picker {
      width: 240px;
      margin-left: 6px;
    }
  }
}

.add-material-bar {
  display: flex;
  height: 92px;
  .add-material-item {
    width: 80px;
    height: 92px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .icon {
      font-size: 32px;
    }
    span {
      color: #303133;
      margin-top: 4px;
      font-size: 12px;
    }
  }
}

.message-table {
  width: 536px;
  height: 50px;

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #9093994d;;
  }

  .table-form_reset {
    font-size: 14px;
  }

  .el-table::before {
    display: none;
  }

  .text-message {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }
  .image-message {
    height: 90px;
  }
  .video-message {
    width: 120px;
  }
  .news-message {
    border: 1px solid #EEEEEE;
  }

  .mini-message {
    border: 1px solid #EEEEEE;
    width: 120px;
    // transform: scale(0.7);
  }
}

.message-preivew-panel {
  overflow: auto;
  height: 569px;
}
</style>
