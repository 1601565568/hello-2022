<template>
  <div v-if="!isError">
    <div class="page-title">
      {{$route.query.taskId ? ($route.query.openType === 'view'?'查看': $route.query.openType === 'copy' ? '复制' :'编辑'):'新建'}}微信好友营销
    </div>
    <ElScrollbar ref="fullScreen">
      <ElForm label-width="100px" ref="formName" :model="model" :rules="rules">
      <div class="message-container">
        <ElCard shadow="never">
          <div slot="header">基本信息</div>
          <div>
              <ElFormItem label="活动名称：" prop="name">
                <ElFormGrid size="xlg">
                  <ElInput
                    :disabled="isUpdate"
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
                  <!--<NsButton type="text" @click="openMarking()">+选择营销人群</NsButton>-->
                  <NsEmployeeOrCustGroupDialog :onlyOne="onlyOne" :disabled="isUpdate" :queryType="2" btnTitle="选择营销人群" v-model="employeeSelectData" :echoStore='true' :isNeedLink='true'></NsEmployeeOrCustGroupDialog>
                </ElFormGrid>
                <ElFormGrid>
                  已选择<span class="text-primary">{{employeeSelectData.data? employeeSelectData.data.length: 0}}</span>{{employeeSelectData.type == 'employee'? '个员工全部好友': '个客户分群'}}
                </ElFormGrid>
              </ElFormItem>
              <ElFormItem label="发送方式：" required>
                <ElFormGrid>
                  <ElRadioGroup :disabled="isUpdate" v-model="model.executeMode" @change="changeExec">
                    <ElRadio :label="1">立即发送</ElRadio>
                    <ElRadio :label="2">定时发送</ElRadio>
                  </ElRadioGroup>
                </ElFormGrid>
                <ElFormGrid class="text-secondary">设置任务发送的时间</ElFormGrid>
              </ElFormItem>
              <ElFormItem label="执行时间：" v-if="model.executeMode== 2" prop="executeTime">
                <ElFormGrid size="xmd">
                  <el-date-picker
                    :disabled="isUpdate"
                    v-model="model.executeTime"
                    type="datetime"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </ElFormGrid>
                <ElFormGrid size="xmd">
                </ElFormGrid>
              </ElFormItem>
          </div>
        </ElCard>
        <ElCard shadow="never" class="message-container__card">
          <div slot="header">发布设置</div>
          <div class="message-composition">
            <div class="message-composition__left">
                <ElFormItem prop="textarea">
                  <tag-area :disabled="isUpdate" v-model='model.textarea' tag="wise" ref="testText" :maxlength="400" @inputLength="changeInputLength" placeholder="请输入内容" emojiClass='' @input='setView' :showEmoji='true' :showTextEmoji='true'/>
                  <!-- <ElFormGrid>
                    <el-input
                      :disabled="isUpdate"
                      type="textarea"
                      :rows="6"
                      placeholder="请输入内容"
                      @blur="setView"
                      v-model="model.textarea" maxlength="400" style="width: 600px;">
                    </el-input>
                  </ElFormGrid> -->
                </ElFormItem>
                <ElFormItem>
                  <ElFormGrid>
                    <ElPopover trigger="hover" v-if="!isUpdate && !show">
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
                      <NsButton :disabled="isUpdate" type="text" slot="reference">+添加图片/图文/小程序</NsButton>
                     </ElPopover>
                    <div v-if="show">
                      <ElUpload ref="upload"
                                :action="this.$api.core.sgUploadFile('activityPic')"
                                :show-file-list="false"
                                :on-success="uploadSuccess"
                                :before-upload="beforeAvatarUpload"
                                accept=".gif,.jpg,.jpeg,.png,.GIF,.JPG,.PNG" v-if="model.type === 1" style="display: inline-block;">
                        <NsButton :disabled="isUpdate" type="text">图片</NsButton>
                      </ElUpload>
                      <NsButton :disabled="isUpdate" type="text" @click="openPic" v-if="model.type === 2" style="display: inline-block;">图文</NsButton>
                      <NsButton :disabled="isUpdate" type="text" @click="openMiniPro" v-if="model.type === 3" style="display: inline-block;">小程序</NsButton>
                      <NsButton :disabled="isUpdate" type="text">
                        <Icon type="close-circle"  theme="outlined"  @click="clear"/>
                      </NsButton>
                    </div>
                  </ElFormGrid>
                </ElFormItem>
            </div>
            <div class="message-composition__right">
              <contentPreview  ref="preview"/>
            </div>
          </div>
        </ElCard>
      </div>
      </ElForm>
    </ElScrollbar>
    <div class="form-save__unique">
      <NsSave  @click="save" :disabled="isUpdate" :loading="loading"/>
      <NsButton @click="cancel">{{$t('operating.cancel')}}</NsButton>
    </div>
    <el-dialog title="选择营销人群" :visible.sync="visible" :show-scroll-x="false"
               :close-on-click-modal = "false" :before-close="onMarkingClose" width="700px" height="400px">
      <el-form>
        <el-form-item>
          <el-tabs v-model="model.customerType" @tab-click="change">
            <el-tab-pane label="客户分群" name="1"></el-tab-pane>
            <el-tab-pane label="员工全部好友" name="2"></el-tab-pane>
          </el-tabs>
        </el-form-item>
        <el-form-item>
          <ElRow :gutter="10" class="code-container">
            <ElCol :span="12" class="code-container__item">
              <div class="code-title">可选{{model.customerType == '1'? '分组': '好友'}}</div>
              <ElInput
                :placeholder="model.customerType == '1'? '请输入分组人群': '请输入好友员工'"
                suffix-icon="el-icon-search"
                v-model="select" class="code-space">
              </ElInput>
              <ElScrollbar>
                <ElTree
                  :data="selectData"
                  ref="selectTree"
                  show-checkbox
                  :filter-node-method="selectFilterNode"
                  node-key="id"
                  default-expand-all
                  :default-checked-keys="selectKeys"
                  @check="check"
                  :props="leftDefaultProps" class="code-space">
            <span class="code-detail clearfix" slot-scope="{ node, data }">
              <span class="code-detail__text">{{ node.label }}</span>
              <span>{{ data.children ? '/' + data.children.length : '' }}</span>
            </span>
                </ElTree>
              </ElScrollbar>
            </ElCol>
            <ElCol :span="12" class="code-container__item">
              <div class="code-title">已选{{model.customerType == '1'? '个分组': '个好友'}}</div>
              <ElInput
                :placeholder="model.customerType == '1'? '请输入分组人群': '请输入好友员工'"
                suffix-icon="el-icon-search"
                v-model="selected" class="code-space">
              </ElInput>
              <ElScrollbar>
                <ElTree
                  :data="selectedData"
                  ref="selectedTree"
                  :filter-node-method="selectedFilterNode"
                  node-key="id"
                  :expand-on-click-node="false" class="code-space">
            <span class="code-detail clearfix" slot-scope="{ node, data }">
              <span class="code-detail__text">{{ node.label }}</span>
              <span>
                <ns-button
                  type="text"
                  size="mini"
                  @click="() => remove(node, data)">
                  <Icon type="delete" className="code-delete"/>
                </ns-button>
              </span>
            </span>
                </ElTree>
              </ElScrollbar>
            </ElCol>
          </ElRow>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="onMarkingClose()">{{$t('operating.cancel')}}</ns-button>
        <ns-save @click="onMarkingSave()"></ns-save>
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
          <ElFormItem label="封面图：" required  label-width="100px" prop="pic" >
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
          <ElFormItem label="封面图：" required  label-width="100px" prop="pic" class="el-form-validate__unHide">
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
import contentPreview from './contentPreview.vue'
import $ from 'jquery'
import moment from 'moment'
import NsEmployeeOrCustGroupDialog from '@/components/NsEmployeeOrCustGroupDialog'
import TagArea, { toolFn } from '@/components/NewUi/TagArea'
let vm
export default {
  mixins: [scrollHeight, tableMixin],
  components: {
    ElCard,
    contentPreview,
    NsEmployeeOrCustGroupDialog,
    ElUpload,
    TagArea
  },
  data () {
    return {
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
        executeTime: '',
        textarea: '',
        type: ''
      },
      copyType: '',
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
      employeeSelectData: {
        data: [],
        type: 'employee'
      },
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
      dataList: [{ key: 2, label: '全部平台' }, {
        key: 1,
        label: '天猫'
      }],
      transTitle: ['可选分群', '已选分群'],
      // 左边树数据
      selectData: [],
      selectEmpData: [],
      selectSubData: [],
      // 左边树默认绑定数据
      leftDefaultProps: {
        children: 'children',
        label: 'label'
      },
      copySelectKeys: [],
      copySelectedData: [],
      copyCustomerType: '',
      // 右边树数据
      selectedData: [],
      // 右边输入框绑定值
      select: '',
      selected: '',
      selectKeys: [],
      // 页面滚动条配置
      scrollBarDeploy: {
        ref: 'fullScreen', // 页面滚动条ref的名称
        excludeHeight: 69 // 底部按钮的高度39 + 30顶部设置小程序积分体系的高度
      },
      inputLength: 0
    }
  },
  created: function () {
    vm = this
    vm.init()
  },
  mounted () {
    // this.initSubTree()
    this.initEmpTree()
    this.verifyProductToCRM()
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
          this.copyPic = JSON.parse(JSON.stringify(this.pic))
          vm.model.type = 2
          vm.show = true
          vm.setView()
          vm.picVisible = false
        } else {
          return false
        }
      })
    },
    changeInputLength (length) {
      this.inputLength = length
    },
    saveMiniPro () {
      vm.$refs.miniProForm.validate((valid) => {
        if (valid) {
          this.copyMiniPro = JSON.parse(JSON.stringify(this.miniPro))
          vm.model.type = 3
          vm.show = true
          vm.setView()
          vm.miniProVisible = false
        } else {
          return false
        }
      })
    },
    changeExec () {
      this.model.executeTime = ''
    },
    init () {
      const that = this
      if (this.$route.query.taskId) {
        this.$http.fetch(this.$api.marketing.weworkMarketing.getEnterpriseActivity, { taskId: this.$route.query.taskId })
          .then(resp => {
            const data = resp.result
            vm.isUpdate = that.$route.query.openType === 'view'
            vm.model.id = that.$route.query.openType === 'copy' ? '' : data.id
            vm.model.name = data.name
            vm.model.executeMode = data.executeMode
            if (vm.model.executeMode === 2) {
              vm.model.executeTime = data.executeTime
            }
            vm.model.customerType = data.customerType + ''
            // 编辑状态修改
            if (that.$route.query.openType === 'copy') {
              that.initCrmData()
            } else {
              vm.onlyOne = data.customerType === 1 ? '' : 'employee'
            }
            vm.copyCustomerType = vm.model.customerType
            if (data.content) {
              if (data.content.text) {
                // vm.model.textarea = toolFn.stringTohtml.call(this.$refs.testText, data.content.text, false)
                vm.model.textarea = toolFn.stringTohtml(data.content.text, false, { tools: [], emojiClass: '', showEmoji: true })
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
            vm.setView()
            const employeeSelectData = {
              data: [],
              type: 'employee'
            }
            vm.employeeSelectData = employeeSelectData
            const userList = []
            for (const item of data.userGroupIds.split(',')) {
              let userItem = {}
              if (data.customerType === 2) {
                userItem = {
                  employeeID: item
                }
              } else {
                userItem = {
                  id: item
                }
              }
              userList.push(userItem)
            }
            vm.employeeSelectData.data = userList
            if (data.customerType === 2) {
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
    change (tab) {
      if (tab.name === '1') {
        vm.selectData = vm.selectSubData
      } else {
        vm.selectData = vm.selectEmpData
      }
      vm.model.customerType = tab.name
      this.$refs.selectTree.getCheckedNodes().splice(0, this.$refs.selectTree.getCheckedNodes().length)
      this.selectedData = []
      this.selectKeys = []
    },
    initSubTree: function () {
      const that = this
      // 分群类别加载
      this.$http.fetch(this.$api.marketing.weworkMarketing.getSubdivisionList)
        .then(resp => {
          // id 为-1 只是用来点击显示全部的分群，不用于做添加修改等操作
          const serverData = [{ id: 0, pId: null, label: '全部', isRoot: true }]
          $.each(resp.result, function (index, element) {
            serverData.push({
              id: element.id,
              pId: element.parent_id,
              label: element.subdivision_name,
              isRoot: false,
              disabled: element.is_category === 1
            })
          })
          this.selectSubData = this.transformToTreeFormat(serverData, this.treeDefaultSetting)
          vm.selectData = vm.selectSubData
        }).catch(() => {
          that.$notify.error('客户分群加载失败！')
        })
    },
    initEmpTree: function () {
      const that = this
      // 分群类别加载
      this.$http.fetch(this.$api.marketing.weworkMarketing.queryDeptAndEmpl, { isEnterprise: true })
        .then(resp => {
          // id 为-1 只是用来点击显示全部的分群，不用于做添加修改等操作
          const serverData = [{ id: 0, pId: null, label: '全部', isRoot: true }]
          $.each(resp.result, function (index, element) {
            serverData.push({
              id: element.id,
              pId: element.parentId,
              label: element.name,
              isRoot: false,
              disabled: element.type === 1
            })
          })
          this.selectEmpData = this.transformToTreeFormat(serverData, this.treeDefaultSetting)
        }).catch(() => {
          that.$notify.error('员工加载失败！')
        })
    },
    initCrmData () {
      const crm = localStorage.getItem('USER_LOCAL_COMPANY_PLAN')
      this.onlyOne = crm === '1' ? '' : 'employee'
    },
    verifyProductToCRM: function () {
      // 编辑保留之前的任务的状态
      if (this.$route.query.taskId) {
        return
      }
      this.initCrmData()
      // const that = this
      // // 分群类别加载
      // this.$http.fetch(this.$api.marketing.weworkMarketing.verifyProductToCRM)
      //   .then(resp => {
      //     // id 为-1 只是用来点击显示全部的分群，不用于做添加修改等操作
      //     const serverData = [{ id: 0, pId: null, label: '全部', isRoot: true }]
      //     if (resp.result) {
      //       that.onlyOne = ''
      //     }
      //   }).catch(() => {
      //     that.$notify.error('验证产品方案失败！')
      //   })
      // that.onlyOne = 'employee'
    },
    //  树方法
    _nodeChildren: function (setting, node, newChildren) { // 私有方法，children 键处理
      if (!node) {
        return null
      }
      const key = setting.children
      if (typeof newChildren !== 'undefined') {
        node[key] = newChildren
      }
      return node[key]
    },
    transformToTreeFormat: function (sNodes, setting) { // 将数据转换为树的children 结构，并且加上自己的配置数据，用来扩展el-tree功能
      if (setting !== undefined && typeof (setting) === 'object') {
        this.treeDefaultSetting = $.extend(this.treeDefaultSetting, setting)
      }
      let i, l
      const key = this.treeDefaultSetting.id
      const parentKey = this.treeDefaultSetting.pId
      if (!key || key === '' || !sNodes) { return [] }
      if ($.isArray(sNodes)) {
        const r = []
        const tmpMap = {}
        for (i = 0, l = sNodes.length; i < l; i++) {
          const tempExtData = $.extend({}, this.treeDefaultSetting.extData)
          sNodes[i].extData = tempExtData
          tmpMap[sNodes[i][key]] = sNodes[i]
        }
        for (i = 0, l = sNodes.length; i < l; i++) {
          const p = tmpMap[sNodes[i][parentKey]]
          if (p && sNodes[i][key] !== sNodes[i][parentKey]) {
            let children = this._nodeChildren(this.treeDefaultSetting, p)
            if (!children) {
              children = this._nodeChildren(this.treeDefaultSetting, p, [])
            }
            children.push(sNodes[i])
          } else {
            r.push(sNodes[i])
          }
        }
        return r
      } else {
        const tempExtData = $.extend({}, this.treeDefaultSetting.extData)
        sNodes.extData = tempExtData
        return [sNodes]
      }
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
          if (vm.picUrl) {
            data.image = {}
            data.image.image = vm.picUrl
          }
        } if (vm.model.type === 2) {
          data.picText = vm.pic
        } if (vm.model.type === 3) {
          data.miniPro = vm.miniPro
        }
      }
      target.content = data
      if (this.employeeSelectData.type === 'employee') {
        target.customerType = 2
        target.userGroupIds = (!this.employeeSelectData.data || this.employeeSelectData.data.length === 0) ? '' : this.employeeSelectData.data.map(value => { return parseInt(value.employeeID) }).join(',')
      } else {
        target.customerType = 1
        target.userGroupIds = (!this.employeeSelectData.data || this.employeeSelectData.data.length === 0) ? '' : this.employeeSelectData.data.map(value => { return parseInt(value.id) }).join(',')
      }
      this.$http.fetch(this.$api.marketing.weworkMarketing.saveOrUpdateEnterprise, { ...target, textarea: this.$refs.testText.htmlToString(vm.model.textarea, false) })
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
      vm.$router.push({ path: '/Marketing/EnterpriseMessage' })
    },
    selectedFilterNode (query, item) {
      return item.label.indexOf(query) > -1
    },
    selectFilterNode (query, item) {
      return item.label.indexOf(query) > -1
    },
    check () {
      vm.setSelectedData()
    },
    setSelectedData () {
      this.selectedData = []
      const data = this.$refs.selectTree.getCheckedNodes()
      if (data) {
        for (const dataParent of data) {
          if (!dataParent.disabled) {
            this.selectedData.push(dataParent)
          }
        }
      }
      return this.selectedData
    },
    openMarking () {
      vm.visible = true
      this.$nextTick(function () {
        this.copySelectedData = JSON.parse(JSON.stringify(vm.setSelectedData()))
      })
      vm.copyCustomerType = this.model.customerType
    },
    onMarkingClose () {
      this.$nextTick(() => {
        this.selectedData = this.copySelectedData
        this.model.customerType = vm.copyCustomerType
        if (this.selectedData.length > 0) {
          this.$refs.selectTree.setCheckedKeys([])
          const data = this.selectedData.map(value => { return value.id })
          this.$refs.selectTree.setCheckedKeys(data)
          this.selectKeys = data
        } else {
          this.$refs.selectTree.setCheckedKeys([])
        }
      })
      vm.visible = false
    },
    onMarkingSave () {
      if (this.selectedData.length > 0) {
        if (vm.model.marketingType === 1) {
          this.copySelectedData = this.selectedData
          this.copyCustomerType = vm.model.customerType
          const data = this.selectedData.map(value => {
            return value.id
          })
          this.selectKeys = data
        } else {
          this.copySelectedData = JSON.parse(JSON.stringify(vm.selectedData))
        }
        vm.visible = false
      } else {
        this.$notify.warning('请选择人群')
      }
    },
    // 删除右边的树子节点数据
    remove (node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
      const nodes = this.$refs.selectTree.getCheckedNodes()
      const nodeIndex = nodes.findIndex(d => d.id === data.id)
      nodes.splice(nodeIndex, 1)
      for (const i in nodes) {
        if (nodes[i].children) {
          nodes.splice(i, 1)
        }
      }
      if (nodes.length > 0) {
        this.$refs.selectTree.setCheckedNodes(nodes)
      } else {
        this.$refs.selectTree.setCheckedKeys([])
      }
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
