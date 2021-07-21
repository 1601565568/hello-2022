<template>
  <div v-if="!isError">
    <div class="page-title">
      新建微信群营销
    </div>
    <ElScrollbar ref="fullScreen">
      <div class="message-container">
        <ElCard shadow="never">
          <div slot="header">基本信息</div>
          <div>
            <ElForm label-width="100px" ref="formName" :model="model" :rules="rules" :disabled="isUpdate">
              <ElFormItem label="活动名称：" prop="name">
                <ElFormGrid size="xlg">
                  <ElInput
                    type="text"
                    placeholder="请输入活动名称"
                    v-model="model.name"
                    maxlength="30"
                    show-word-limit
                  />
                </ElFormGrid>
              </ElFormItem>
              <ElFormItem label="选择营销人群：" required>
                <ElFormGrid>
                  <!--<NsButton type="text" @click="onOpenGroupSelect()"><Icon type="plus"/>选择营销人群</NsButton>-->
                  <NsChatrommSelectDialog :echoStore='true' :disabled="false" :queryType="2" :isqywx="true" onlyOne="chatroom" dialogTitle="选择群主" btnTitle="选择群主" v-model="employeeSelectData2"></NsChatrommSelectDialog>
                </ElFormGrid>
                <ElFormGrid>
                  已选择<span class="text-primary">{{employeeSelectData2.data? employeeSelectData2.data.length: 0}}</span>个群主
                </ElFormGrid>
              </ElFormItem>
              <ElFormItem label="发送方式：" required>
                <ElFormGrid>
                  <ElRadioGroup v-model="model.executeMode" @change="changeExec">
                    <ElRadio :label="1">立即发送</ElRadio>
                    <ElRadio :label="2">定时发送</ElRadio>
                  </ElRadioGroup>
                </ElFormGrid>
                <ElFormGrid class="text-secondary">设置任务发送的时间</ElFormGrid>
              </ElFormItem>
              <ElFormItem label="执行时间：" v-if="model.executeMode== 2" prop="executeTime">
                <ElFormGrid size="xmd">
                  <el-date-picker
                    v-model="model.executeTime"
                    type="datetime"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </ElFormGrid>
                <ElFormGrid size="xmd">
                </ElFormGrid>
              </ElFormItem>
            </ElForm>
          </div>
        </ElCard>
        <ElCard shadow="never" class="message-container__card">
          <div slot="header">发布设置</div>
          <div class="message-composition">
            <div class="message-composition__left">
              <ElForm label-width="0px" ref="formPush" :model="model" :rules="rules" :disabled="isUpdate">
                <ElFormItem prop="textarea">
                  <tag-area :disabled="isUpdate" v-model='model.textarea' tag="wise" ref="testText" :maxlength="1000" @inputLength="changeInputLength" placeholder="请输入内容" emojiClass='' :showEmoji='true' :showTextEmoji='true' @input='setView'/>
                  <!-- <ElFormGrid>
                    <el-input
                      type="textarea"
                      :rows="6"
                      placeholder="请输入内容"
                      @blur="setView"
                      v-model="model.textarea" maxlength="1000" style="width: 700px;">
                    </el-input>
                  </ElFormGrid> -->
                </ElFormItem>
                <ElFormItem>
                  <ElFormGrid>
                    <ElPopover trigger="hover" v-if="!show">
                      <div class="message-prompt">
                      <div class="message-prompt__mass" @click="setType()">
                        <ElUpload ref="upload"
                                  :action="this.$api.core.sgUploadFile('activityPic')"
                                  :show-file-list="false"
                                  :on-success="uploadSuccess"
                                  :before-upload="beforeAvatarUpload"
                                  accept=".gif,.jpg,.jpeg,.png,.GIF,.JPG,.PNG">
                          <Icon type="picture" className="font-size-xlarge cursor-pointer message-hovericolor"/>
                          <div class="message-prompt__mass--topspace cursor-pointer message-hovericolor">图片</div>
                        </ElUpload>
                      </div>
                      <div class="message-prompt__mass" style="display: inline-block;" @click="openPic">
                          <Icon type="picture" className="font-size-xlarge cursor-pointer message-hovericolor"/>
                          <div class="message-prompt__mass--topspace cursor-pointer message-hovericolor">图文</div>
                      </div>
                      <div class="message-prompt__mass" style="display: inline-block;" @click="openMiniPro">
                          <Icon type="wechat" className="font-size-xlarge cursor-pointer message-hovericolor"/>
                          <div class="message-prompt__mass--topspace cursor-pointer message-hovericolor">小程序</div>
                      </div>
                        <!--<div class="message-prompt__mass">
                          <Icon type="link" className="font-size-xlarge cursor-pointer message-hovericolor"/>
                          <div class="message-prompt__mass&#45;&#45;topspace cursor-pointer message-hovericolor">链接</div>
                        </div>
                        <div class="message-prompt__mass" @click="dialogVisibleLink = true">
                          <Icon type="applet" className="font-size-xlarge cursor-pointer message-hovericolor"/>
                          <div class="message-prompt__mass&#45;&#45;topspace cursor-pointer message-hovericolor">小程序</div>
                        </div>-->
                      </div>
                      <NsButton type="text" slot="reference">+添加图片/图文/小程序</NsButton>
                     </ElPopover>
                    <div v-if="show">
                      <ElUpload ref="upload"
                                :action="this.$api.core.sgUploadFile('activityPic')"
                                :show-file-list="false"
                                :on-success="uploadSuccess"
                                :before-upload="beforeAvatarUpload"
                                accept=".gif,.jpg,.jpeg,.png,.GIF,.JPG,.PNG" v-if="model.type === 1" style="display: inline-block;">
                        <NsButton type="text">图片</NsButton>
                      </ElUpload>
                      <NsButton type="text" @click="openPic" v-if="model.type === 2" style="display: inline-block;">图文</NsButton>
                      <NsButton type="text" @click="openMiniPro" v-if="model.type === 3" style="display: inline-block;">小程序</NsButton>
                      <NsButton type="text">
                        <Icon type="close-circle"  theme="outlined"  @click="clear"/>
                      </NsButton>
                    </div>
                  </ElFormGrid>
                </ElFormItem>
              </ElForm>
            </div>
            <div class="message-composition__right">
              <contentPreview  ref="preview"/>
            </div>
          </div>
        </ElCard>
      </div>
    </ElScrollbar>
    <div class="form-save__unique">
      <NsSave  @click="save" :disabled="isUpdate" :loading="loading"/>
      <NsButton @click="cancel">{{$t('operating.cancel')}}</NsButton>
    </div>

    <el-dialog title="选择微信群" :show-scroll-x="false" :visible.sync="visible"
               :close-on-click-modal = "false" :before-close="onCloseSelectRoom" width="700px" height="400px">
      <div>
        <el-form>
          <el-form-item>
            <el-form-grid><div style="margin-left: 10px;">选择门店：</div></el-form-grid>
            <el-form-grid>
              <el-select-load v-model="roomsData.searchShopId" :options="roomsData.offEmployees" filterable @change="changeShop"
                              clearable @clear="clear" :page-sizes="20" placeholder="请选择">
              </el-select-load>
            </el-form-grid>
          </el-form-item>
        </el-form>
        <el-row :gutter="24">
          <el-col :span="12">
            <ElTable ref="selectEmp" :data="roomsData.matchRooms" height="260" @select="selectChange" @select-all="selectAllChange" v-loading="roomsData.loading">
              <ElTableColumn type="selection" width="55"/>
              <ElTableColumn :show-overflow-tooltip="true" type="default" prop="empNick" label="群主昵称" align="left" width="120" >
              </ElTableColumn>
              <ElTableColumn :show-overflow-tooltip="true" type="default" prop="empName" label="员工姓名" align="left" />
            </ElTable>
          </el-col>
          <el-col :span="12"><ElTable :data="roomsData.selectedData" height="260" v-loading="">
            <ElTableColumn :show-overflow-tooltip="true" type="default" prop="empName" label="已选群主" align="left" />
            <ElTableColumn  prop="select" align="center" width="55" >
              <template slot-scope="scope">
                <ns-button
                  type="text"
                  size="mini"
                  @click="() => removeRoom(scope)">
                  <Icon type="delete" className="code-delete"/>
                </ns-button>
              </template>
            </ElTableColumn>
          </ElTable></el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="onCloseSelectRoom()">{{$t('operating.cancel')}}</ns-button>
        <ns-save @click="onSaveSelectRoom()"></ns-save>
      </div>
    </el-dialog>
    <!-- 图文 start -->
    <ElDialog
      width="500px"
      height="265px"
      title="图文"
      :visible.sync="picVisible"
      :show-scroll-x=false :before-close="cancelPic">
      <div class="margin-lr-small">
        <ElForm ref="picForm" :model="pic" :rules="picRules">
          <ElFormItem label="图片标题：" required label-width="100px" prop="title">
            <ElFormGrid size="lg">
            <ElInput
              type="text"
              placeholder="请输入图文标题"
              v-model="pic.title"
            />
            </ElFormGrid>
          </ElFormItem>
          <ElFormItem label="图文描述：" required  label-width="100px" prop="desc">
            <ElFormGrid size="lg">
            <ElInput
              type="textarea"
              row="3"
              placeholder="请输入图文描述"
              v-model="pic.desc"
            />
            </ElFormGrid>
          </ElFormItem>
          <ElFormItem label="封面图：" required  label-width="100px" prop="pic">
            <ElFormGrid>
            <ElUpload
              :action="this.$api.core.sgUploadFile('activityPic')"
              :show-file-list="false"
              :on-success="uploadSuccess"
              :before-upload="beforeAvatarUpload" accept=".gif,.jpg,.jpeg,.png,.GIF,.JPG,.PNG">
              <img v-if="pic.pic" :src="pic.pic" style="height: 30px; width: 30px">
              <Icon type="plus" style="height: 30px; width: 30px" v-else/>
            </ElUpload>
            </ElFormGrid>
          </ElFormItem>
          <ElFormItem label="图文链接：" required label-width="100px" prop="url">
            <ElFormGrid size="lg">
              <ElInput
                type="text"
                placeholder="请输入图文链接"
                v-model="pic.url"
              />
            </ElFormGrid>
          </ElFormItem>
        </ElForm>
      </div>
      <span slot="footer">
        <NsButton @click="cancelPic">{{$t('operating.cancel')}}</NsButton>
        <NsSave @click="savePic"/>
      </span>
    </ElDialog>
    <!-- 图文 end -->
    <!-- 小程序 start-->
    <ElDialog
      width="500px"
      title="小程序"
      :visible.sync="miniProVisible"
      :show-scroll-x=false :before-close="cancelMiniPro">
      <div class="margin-lr-small">
        <ElForm ref="miniProForm" :model="miniPro" :rules="miniProRules">
          <ElFormItem label="小程序标题：" required label-width="100px" prop="title">
            <ElInput
              type="text"
              placeholder="请输入小程序标题"
              v-model="miniPro.title"
            />
          </ElFormItem>
          <ElFormItem label="小程序appid：" required label-width="100px" prop="appid">
            <ElInput
              type="text"
              placeholder="请输入小程序appid"
              v-model="miniPro.appid"
            />
          </ElFormItem>
          <ElFormItem label="小程序路径：" required  label-width="100px" prop="appPath">
            <ElInput
              type="text"
              placeholder="请输入小程序路径"
              v-model="miniPro.appPath"
            />
          </ElFormItem>
          <ElFormItem label-width="100px">
            <el-form-grid size="xmd">
              <a href="https://jingyan.baidu.com/article/f3ad7d0f4c39aa09c3345bf1.html" target="_blank">如何获取路径</a>
            </el-form-grid>
          </ElFormItem>
          <ElFormItem label="封面图：" required  label-width="100px" prop="pic">
            <ElFormGrid>
              <ElUpload
                :action="this.$api.core.sgUploadFile('activityPic')"
                :show-file-list="false"
                :on-success="uploadSuccess"
                :before-upload="beforeAvatarUpload" accept=".gif,.jpg,.jpeg,.png,.GIF,.JPG,.PNG">
                <img v-if="miniPro.pic" :src="miniPro.pic" style="height: 30px; width: 30px">
                <Icon type="plus" style="height: 30px; width: 30px" v-else/>
              </ElUpload>
            </ElFormGrid>
          </ElFormItem>
        </ElForm>
      </div>
      <span slot="footer">
        <NsButton @click="cancelMiniPro">{{$t('operating.cancel')}}</NsButton>
        <NsSave @click="saveMiniPro"/>
      </span>
    </ElDialog>
    <!-- 小程序 end-->
  </div>
  <div v-else>
    <ns-no-data>{{$t('prompt.noData')}}</ns-no-data>
  </div>
</template>
<script>
import ElCard from '@nascent/nui/lib/card'
import scrollHeight from '@nascent/ecrp-ecrm/src/mixins/scrollHeight'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import ElUpload from '@nascent/nui/lib/upload'
import ElSelectLoad from '@nascent/nui/lib/select-load'
import contentPreview from './contentPreview.vue'
import NsChatrommSelectDialog from '@/components/NsChatrommSelectDialog'
import TagArea from '@/components/NewUi/TagArea'

import moment from 'moment'
let vm
export default {
  mixins: [scrollHeight, tableMixin],
  components: {
    ElCard,
    contentPreview,
    ElUpload,
    ElSelectLoad,
    NsChatrommSelectDialog,
    TagArea
  },
  data () {
    return {
      isError: false,
      isUpdate: false,
      loading: false,
      model: {
        id: '',
        name: '',
        marketingType: '',
        // 群主
        customerType: '4',
        executeMode: 1,
        executeTime: '',
        textarea: '',
        type: ''
      },
      copyType: '',
      employeeSelectData2: {
        data: [],
        type: 'chatroom'
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        executeTime: [
          { required: true, message: '请选择执行时间', trigger: 'blur' }
        ],
        textarea: [
          {
            validator: (rule, value, callback) => {
              const text = this.$refs.testText.htmlToText(value)
              if (text.length > 1000) {
                callback(new Error('长度在 1 到 1000 个字符'))
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
                  callback(new Error('请输入发布内容'))
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
      picRules: {
        title: [
          { required: true, message: '请输入图片标题', trigger: ['blur', 'change'] },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: ['blur', 'change'] }
        ],
        desc: [
          { required: true, message: '请输入图文描述', trigger: ['blur', 'change'] },
          { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: ['blur', 'change'] }
        ],
        pic: [
          { required: true, message: '请选择封面图', trigger: ['blur', 'change'] },
          {
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                callback(new Error('请选择封面图'))
              }
            },
            trigger: 'blur'
          }],
        url: [
          { required: true, message: '请输入图文链接', trigger: ['blur', 'change'] }
        ]
      },
      miniProRules: {
        appid: [
          { required: true, message: '请输入小程序appid', trigger: ['blur', 'change'] },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: ['blur', 'change'] }
        ],
        appPath: [
          { required: true, message: '请输入小程序路径', trigger: ['blur', 'change'] },
          { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: ['blur', 'change'] }
        ],
        title: [
          { required: true, message: '请输入小程序标题', trigger: ['blur', 'change'] },
          { min: 1, max: 60, message: '长度在 1 到 60 个字符', trigger: ['blur', 'change'] }
        ],
        pic: [
          { required: true, message: '请选择封面图', trigger: ['blur', 'change'] },
          {
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                callback(new Error('请选择封面图'))
              }
            },
            trigger: 'blur'
          }]
      },
      picVisible: false,
      miniProVisible: false,
      show: false,
      pic: {
        title: '',
        desc: '',
        url: '',
        pic: '',
        code: ''
      },
      miniPro: {
        appid: '',
        appPath: '',
        appPathBak: '',
        title: '',
        desc: '',
        pic: '',
        code: ''
      },
      copyPic: {},
      copyMiniPro: {},
      picUrl: '',
      code: '',
      treeDefaultSetting: { id: 'id', pId: 'pId', children: 'children', extData: { showCheckbox: false, showIcon: false, showAddIcon: false, showEditIcon: false, showDeleteIcon: false } },
      visible: false,
      // 页面滚动条配置
      scrollBarDeploy: {
        ref: 'fullScreen', // 页面滚动条ref的名称
        excludeHeight: 69 // 底部按钮的高度39 + 30顶部设置小程序积分体系的高度
      },
      // 选择群弹框数据
      roomsData: {
        allRooms: [],
        matchRooms: [],
        searchShopId: '',
        selectedData: [],
        offEmployees: [],
        loading: false
      },
      // 保存的选择群信息
      roomSelectedData: [],
      inputLength: 0
    }
  },
  created: function () {
    vm = this
  },
  mounted () {
    this.queryGroupRooms4ent(null)
    this.$nextTick(function () {
      vm.init()
      vm.getViewShopOffList()
    })
  },
  watch: {
    selected (val) {
      this.$refs.selectedTree.filter(val)
    },
    select (val) {
      this.$refs.selectTree.filter(val)
    }
  },
  methods: {
    getViewShopOffList () {
      const that = this
      this.$http.fetch(this.$api.marketing.weworkMarketing.getViewShopOffList)
        .then(resp => {
          if (resp && resp.result) {
            that.roomsData.offEmployees = JSON.parse(JSON.stringify(resp.result))
          }
        }).catch((aaa) => {
          that.$notify.error('导购员工列表加载失败！')
        })
    },
    // 查询群主
    queryGroupRooms4ent (shopId) {
      const that = this
      this.roomsData.loading = true
      this.$http.fetch(this.$api.marketing.weworkMarketing.queryGroupEntRoomsLeaderList, { shopId: shopId })
        .then(resp => {
          if (resp && resp.result) {
            that.roomsData.matchRooms = JSON.parse(JSON.stringify(resp.result))
            if (!shopId) {
              that.roomsData.allRooms = JSON.parse(JSON.stringify(resp.result))
            } else {
              that.$nextTick(function () {
                that.fileData()
              })
            }
          }
          that.roomsData.loading = false
        }).catch(() => {
          that.$notify.error('微信群加载失败！')
          that.roomsData.loading = false
        })
    },
    save () {
      let isOk = false
      this.$refs.formName.validate((valid) => {
        if (!valid) {
          isOk = true
          return false
        }
      })
      if (isOk) {
        return
      }
      this.$refs.formPush.validate((valid) => {
        if (!valid) {
          return false
        } else {
          return vm.saveOrUpdate()
        }
      })
    },
    // 保存活动信息
    saveOrUpdate () {
      if (!this.employeeSelectData2.data || this.employeeSelectData2.data.length === 0) {
        this.$notify.warning('请选择人群')
        return false
      }
      this.loading = true
      const target = JSON.parse(JSON.stringify(this.model))
      if (target.executeMode === 2) {
        target.executeTime = moment(target.executeTime).format('YYYY-MM-DD HH:mm:ss')
      }
      const data = {}
      if (vm.model.textarea) {
        data.text = this.$refs.testText.htmlToString(vm.model.textarea, false)
      }
      if (vm.model.type) {
        if (vm.model.type === 1) {
          data.image = {}
          data.image.image = vm.picUrl
        } if (vm.model.type === 2) {
          data.picText = vm.pic
        } if (vm.model.type === 3) {
          data.miniPro = vm.miniPro
        }
      }
      target.content = data
      // target.userGroupIds = (!this.roomSelectedData || this.roomSelectedData.length === 0) ? '' : this.roomSelectedData.map(value => { return parseInt(value.empId) }).join(',')
      target.userGroupIds = (!this.employeeSelectData2.data || this.employeeSelectData2.data.length === 0) ? '' : this.employeeSelectData2.data.map(value => { return value.empId.trim() }).join(',')
      this.$http.fetch(this.$api.marketing.weworkMarketing.saveOrUpdateEnterprise4Room, { ...target, textarea: this.$refs.testText.htmlToString(vm.model.textarea, false) })
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
    /**
     * 初始化页面
     */
    init () {
      if (this.$route.query.taskId) {
        this.$http.fetch(this.$api.marketing.weworkMarketing.getEnterpriseActivity, { taskId: this.$route.query.taskId })
          .then(resp => {
            const data = resp.result
            vm.isUpdate = !data.isUpdate
            vm.model.id = data.id
            vm.model.name = data.name
            vm.model.executeMode = data.executeMode
            if (vm.model.executeMode === 2) {
              vm.model.executeTime = data.executeTime
            }
            if (vm.$route.query.openType === 'copy') {
              vm.model.id = ''
              vm.isUpdate = false
            }
            if (data.content) {
              if (data.content.text) {
                vm.model.textarea = this.$refs.testText.stringTohtml(data.content.text, false)
              }
              if (data.content.image && Object.keys(data.content.image).length > 0) {
                vm.picUrl = data.content.image.image
                vm.model.type = 1
                vm.show = true
              }
              if (data.content.picText && Object.keys(data.content.picText).length > 0) {
                vm.pic = data.content.picText
                vm.model.type = 2
                vm.show = true
              }
              if (data.content.miniPro && Object.keys(data.content.miniPro).length > 0) {
                vm.miniPro = data.content.miniPro
                vm.model.type = 3
                vm.show = true
              }
            }
            const employeeSelectData2 = {
              data: [],
              type: 'chatroom'
            }
            vm.employeeSelectData2 = employeeSelectData2
            const userList = []
            for (const item of data.userGroupIds.split(',')) {
              let userItem = {}
              userItem = {
                empId: item
              }
              userList.push(userItem)
            }
            vm.employeeSelectData2.data = userList
            vm.setView()
            // const roomList = []
            // for (const item of data.userGroupIds.split(',')) {
            //   roomList.push({ empId: item })
            // }
            // vm.roomSelectedData = roomList
          }).catch((resp) => {
            this.isError = true
            vm.$notify.error('数据查询失败！' || resp.msg)
          }).finally(() => {
            // do something
          })
      }
    },
    selectChange (select, scope) {
      if (this.roomsData.selectedData.length > 0) {
        const index = this.roomsData.selectedData.findIndex(d => d.empId === scope.empId)
        if (index > -1) {
          this.roomsData.selectedData.splice(index, 1)
        } else {
          this.roomsData.selectedData.push(scope)
        }
      } else {
        this.roomsData.selectedData = JSON.parse(JSON.stringify(this.$refs.selectEmp.selection))
      }
      if (this.roomsData.selectedData.length === 0) {
        this.$refs.selectEmp.clearSelection()
      }
    },
    selectAllChange (select) {
      if (select.length === 0) {
        for (const data of this.roomsData.matchRooms) {
          const index = this.roomsData.selectedData.findIndex(d => d.empId === data.empId)
          if (index > -1) {
            this.roomsData.selectedData.splice(index, 1)
          }
        }
      } else {
        for (const data of select) {
          const index = this.roomsData.selectedData.findIndex(d => d.empId === data.empId)
          if (index === -1) {
            this.roomsData.selectedData.push(data)
          }
        }
      }
    },
    removeRoom (scope) {
      this.roomsData.selectedData.splice(scope.$index, 1)
      const index = this.$refs.selectEmp.selection.findIndex(d => d.empId === scope.row.empId)
      if (index > -1) {
        this.$refs.selectEmp.selection.splice(index, 1)
      }
      if (this.$refs.selectEmp.selection.length === 0) {
        this.$refs.selectEmp.clearSelection()
      }
    },
    onSaveSelectRoom () {
      if (this.roomsData.selectedData.length > 0) {
        this.roomSelectedData = JSON.parse(JSON.stringify(vm.roomsData.selectedData))
        this.visible = false
      } else {
        this.$notify.warning('请至少选择一个群')
      }
    },
    onCloseSelectRoom () {
      vm.visible = false
    },
    // 打开选择群弹框
    onOpenGroupSelect () {
      vm.visible = true
      vm.roomsData.selectedData = JSON.parse(JSON.stringify(vm.roomSelectedData))
      vm.$nextTick(function () {
        vm.fileData()
        vm.fillData()
      })
    },
    // 设置选中状态
    fileData () {
      if (this.$refs.selectEmp) {
        this.$refs.selectEmp.clearSelection()
      }
      this.$nextTick(function () {
        for (const indexDat of vm.roomsData.matchRooms) {
          if (vm.roomsData.selectedData.filter(d => d.empId === indexDat.empId).length > 0) {
            this.$refs.selectEmp.toggleRowSelection(indexDat)
          }
        }
      })
    },
    // 完善分组信息，编辑或查看时只带了id，需完善数据
    fillData () {
      if (vm.roomsData.allRooms.length > 0 && vm.roomsData.selectedData && vm.roomsData.selectedData.length > 0 && !vm.roomsData.selectedData[0].empName) {
        const roomList = []
        for (const item of vm.roomsData.selectedData) {
          const matchArr = vm.roomsData.allRooms.filter(data => {
            return data.empId === item.empId
          })
          if (matchArr.length > 0) {
            roomList.push(JSON.parse(JSON.stringify(matchArr[0])))
          }
        }
        vm.roomsData.selectedData = roomList
      }
    },
    changeShop (value) {
      if (value) {
        vm.queryGroupRooms4ent(value)
      } else {
        vm.roomsData.matchRooms = JSON.parse(JSON.stringify(vm.roomsData.allRooms))
        vm.$nextTick(function () {
          vm.fileData()
        })
      }
    },
    cancel () {
      vm.$router.push({ path: '/Marketing/EnterpriseGroupMessage' })
    },
    // end
    setView () {
      const data = []
      if (vm.model.textarea) {
        data.push({
          type: 1,
          msg: this.$refs.testText.htmlToString(vm.model.textarea, false)
        })
      }
      switch (vm.model.type) {
        case 1: {
          data.push({
            type: 2,
            pic: vm.picUrl
          })
          break
        }
        case 2: {
          const picData = {
            type: 3
          }
          Object.assign(picData, vm.pic)
          data.push(picData)
          break
        }
        case 3: {
          const picData = {
            type: 4
          }
          Object.assign(picData, vm.miniPro)
          data.push(picData)
          break
        }
        default:
      }
      this.$refs.preview.massData = data
    },
    clear () {
      vm.model.type = ''
      vm.setView()
      vm.show = false
    },
    setType () {
      vm.model.type = 1
    },
    changeInputLength (length) {
      this.inputLength = length
    },
    uploadSuccess (resp) {
      if (resp.result) {
        const url = resp.result.url
        if (vm.model.type === 1) {
          vm.picUrl = url
          vm.setView()
        } else if (vm.model.type === 2) {
          vm.pic.pic = url
        } else if (vm.model.type === 3) {
          vm.miniPro.pic = url
        }
        vm.show = true
      } else {
        vm.$notify.error('图片上传失败' + resp.msg ? resp.msg : '')
      }
    },
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 < 512
      const suffix = 'gif|jpg|jpeg|png|GIF|JPG|PNG'
      if (suffix.indexOf(file.type) !== -1) {
        this.$notify.warning('上传形象图只支持 JPG GIF JPEG GIF PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$notify.warning('图片不能大于512KB!')
        return false
      }
      return true
    },
    openPic () {
      this.copyPic = JSON.parse(JSON.stringify(this.pic))
      vm.picVisible = true
      vm.copyType = vm.model.type
      vm.model.type = 2
    },
    openMiniPro () {
      this.copyMiniPro = JSON.parse(JSON.stringify(this.miniPro))
      vm.miniProVisible = true
      vm.copyType = vm.model.type
      vm.model.type = 3
    },
    cancelPic () {
      vm.model.type = vm.copyType
      vm.$refs.picForm.resetFields()
      this.pic = JSON.parse(JSON.stringify(this.copyPic))
      vm.picVisible = false
    },
    cancelMiniPro () {
      vm.model.type = vm.copyType
      vm.$refs.miniProForm.resetFields()
      this.miniPro = JSON.parse(JSON.stringify(this.copyMiniPro))
      vm.miniProVisible = false
    },
    savePic () {
      vm.$refs.picForm.validate((valid) => {
        if (valid) {
          vm.model.type = 2
          vm.show = true
          this.copyPic = JSON.parse(JSON.stringify(this.pic))
          vm.setView()
          vm.picVisible = false
        } else {
          return false
        }
      })
    },
    saveMiniPro () {
      vm.$refs.miniProForm.validate((valid) => {
        if (valid) {
          vm.model.type = 3
          vm.show = true
          this.copyMiniPro = JSON.parse(JSON.stringify(this.miniPro))
          vm.setView()
          vm.miniProVisible = false
        } else {
          return false
        }
      })
    },
    changeExec () {
      this.model.executeTime = ''
    }
  }
}
</script>

<style scoped>
  @import "@theme/variables.pcss";

  @component-namespace message {
    @b container {
      >>> .el-card {
        border: none;
        border-radius: var(--default-radius-mini);
      }
      @e card {
        margin-top: var(--default-margin-base);
        border: none;
        border-radius: var(--default-radius-mini);
      }
    }
    @b composition {
      display: flex;
      @e left {
        width: 68%;
      }
      @e right {
        flex-shrink: 0;
        margin: 0 auto;
        >>> .el-scrollbar__wrap {
          height: 410px;
          padding-bottom: 20px;
        }
      }
    }
  }
  /* 页面结构标题样式 start*/
  .page-title {
    font-size: var(--default-font-size-base);
    padding-bottom: var(--default-padding-larger);
    font-weight: bold;
  }
  /* 页面结构标题样式 end*/

  /* 底部按钮样式 start*/
  .form-save__unique {
    padding: var(--default-padding-small) 0 var(--default-padding-small) 121px;
    border-top: 1px solid var(--theme-base-border-color-primary);
    background-color: var(--theme-color-white);
    border-bottom-left-radius: var(--default-radius-mini);
    border-bottom-right-radius: var(--default-radius-mini);
  }
  /* 底部按钮样式 end*/

  /* 卡片样式 start*/
  >>> .el-card:last-child {
    border-bottom: none;
  }
  /* 卡片样式 end*/

  /** start 选择员工*/
  @component-namespace code {
    @b container {
      padding: 0 var(--default-padding-small);
      @e item {
        >>> .el-scrollbar__wrap {
          height: 200px;
        }
      }
    }
    @b title {
      font-weight: bold;
      line-height: 30px;
      background: var(--theme-bg-color-base);
      padding: 0 8px;
      border-radius: var(--default-radius-mini);
    }
    @b delete {
      margin-left: var(--default-margin-small);
    }
    @b space {
      margin-top: var(--default-margin-base);
    }
    @b detail {
      display: flex;
      align-items: center;
      @e text {
        max-width: 188px;
        margin-right: var(--default-margin-small);
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
  /** end 选择员工*/

  @component-namespace message {
    @b detail {
      padding: 20px 20px 0;
      margin-bottom: 20px;
      border: 1px dashed var(--theme-base-border-color-primary);
      border-radius: 6px;
      @e btn {
        display: flex;
        align-items: center;
        justify-content: space-between;
        >>> .el-tag {
          cursor: text;
        }
      }
      @e table {
        margin-top: var(--default-margin-larger);
      }
      >>> .ElImage {
        background-color: unset;
      }
    }
    @b item {
      display: flex;
      align-items: center;
      @m title {
        line-height: 18px;
      }
      @m image {
        margin: 7px 0;
      }
      @m add {
        line-height: 60px;
        height: 60px;
      }
      @m opposite {
        width: 76px;
        height: 46px;
        position: relative;
      }
      @e broadcast {
        width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-left: 8px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, .4);
        border-radius: 50%;
      }
    }
    @b circle {
      width: 0;
      height: 0;
      border-width: 4px;
      border-style: solid;
      border-color: transparent transparent transparent var(--theme-color-white);
    }
    @b prompt {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: var(--default-margin-larger) 0;
      @e mass {
        text-align: center;
        padding: var(--default-padding-larger) 25px;
        cursor: pointer;
        border-right: 1px solid var(--theme-base-border-color-primary);
      &:hover {
        .message-hovericolor {
          color: var(--theme-color-primary);
        }
      }
    &:last-child {
       border-right: 0;
     }
      @m topspace {
        margin-top: var(--default-margin-small);
      }
    }
    >>> .el-popover {
      padding: 0;
    }
  }
  @b headling {
    font-weight: bold;
    padding: 0 var(--default-padding-larger);
    background: var(--theme-bg-color-base);
    border-radius: var(--default-radius-mini);
  }
  @b upload {
    >>> .el-upload {
      width: 100px;
      height: 100px;
      position: relative;
      border: 1px solid var(--theme-base-border-color-primary);
      border-radius: var(--default-radius-mini);
  &:hover {
     border-color: var(--theme-color-primary-light);
   }
  }
  @e tip {
    font-size: var(--default-font-size-large);
    color: var(--theme-base-border-color-primary);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  @e avatar {
    width: 100px;
    height: 100px;
    position: relative;
    top: -1px;
    left: -1px;
  }
  }
  @b videodialog {
    >>>> .el-dialog__headerbtn {
      display: none;
    }
    >>> .el-dialog__body {
      padding: 20px 0 0 0;
    }
  }
  @b spacelarger {
    margin-top: var(--default-margin-larger);
  }
  }
</style>
