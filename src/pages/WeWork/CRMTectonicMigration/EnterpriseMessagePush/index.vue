<template>
  <PageEdit class="friend-marketing">
    <template slot="header">
      <div class="common-header flex-box">
        <h3>{{$route.query.taskId ? ($route.query.openType === 'view'?'查看': $route.query.openType === 'copy' ? '复制' :'编辑'):'新建'}}微信好友营销</h3>
        <div class="common-btn">
          <ns-button class="customer-btn_cancel" @click="$router.go(-1)" size="large">取消</ns-button>
          <ns-button class="customer-btn_save"  :disabled="isUpdate" :loading="loading" @click='save' type="primary" size="large">保存</ns-button>
        </div>
      </div>
    </template>
    <template slot='content'>
      <el-form class="normal-from el-form-reset" size="medium" ref="ruleForm" :model="model" :rules="rules" label-width="100px" label-position="left">
        <SimpleCollapse :title="'基本信息'" class="content">
          <el-form-item class="larger-item" label="活动名称" prop="name" required>
            <el-input v-model="model.name" placeholder="请输入活动名称" class="el-input" show-word-limit :maxlength="30"></el-input>
          </el-form-item>
          <el-form-item class="larger-item" label="选择营销人群" prop="chatRoomIdList" required>
            <div class="select-area">
              <div
                class="select-tips"
                @click="openECDialog"
              >
                <el-input placeholder="请选择好友" :value="selectedTip" readonly>
                  <!-- <Icon type="geren" class="icon" slot="suffix"></Icon> -->
                  <Icon type='icon-ns-people' class='icon' slot="suffix"/>
                </el-input>
              </div>
            </div>
          </el-form-item>
          <el-form-item class="form-slot" prop="executeMode" required style="padding-bottom: 24px">
            <span class="form-item-slot" slot="label">
              发送方式
              <el-tooltip
                class="message-icons-item"
                content="设置任务发送的时间"
                placement="top"
              >
                <Icon type="ns-help" className="icon"/>
              </el-tooltip></span>
            <el-radio-group v-model="model.executeMode">
              <el-radio :label="0">立即发送</el-radio>
              <el-radio :label="1">定时发送</el-radio>
            </el-radio-group>
          </el-form-item>
        </SimpleCollapse>
        <SimpleCollapse :title="'发布设置'">
          <PhoneBox phoneTitle :showPhoneHead="true">
            <template slot='collapse-left'>
              <!-- <source-all
                ref='sourceAll'
                :disabled="disabled"
                :detail="detail"
                @list='proviewList'
                @pitContent='proviewPitContent'
                @back="gotoList"
              /> -->
            </template>
            <template slot="collapse-right">
              <MessagePreviewPanel class="message-preivew-panel" imageLabel="image" videoLabel="video" miniAndLinkImageLabel="image" :list="list"/>
            </template>
          </PhoneBox>
        </SimpleCollapse>
      </el-form>
      <!-- 选择营销人群组件 -->
      <NsEmployeeOrCustGroupDialog ref="nsEmployeeOrCustGroupDialog" :onlyOne="onlyOne" :disabled="isUpdate" :queryType="2" btnTitle="选择营销人群" v-model="employeeSelectData" :echoStore='true' :isNeedLink='true'></NsEmployeeOrCustGroupDialog>
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
let vm
export default {
  mixins: [scrollHeight, tableMixin],
  components: {
    PageEdit,
    SimpleCollapse,
    PhoneBox,

    // ElCard,
    // contentPreview,
    NsEmployeeOrCustGroupDialog
    // ElUpload,
    // TagArea
  },
  computed: {
    selectedTip () {
      if (this.employeeSelectData.data.length) {
        return `已选择${this.employeeSelectData.data.length}${this.employeeSelectData.type === 'employee' ? '个员工全部好友' : '个客户分群'}`
      } else {
        return ''
      }
    }
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
    /**
     * 打开选择营销人群组件
     */
    openECDialog () {
      this.$refs.nsEmployeeOrCustGroupDialog.onDialogOpen()
    },
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
            // 编辑状态修改 that.$route.query.openType === 'copy'
            const crm = localStorage.getItem('USER_LOCAL_COMPANY_PLAN')
            const isCrm = crm === '1'
            if (that.$route.query.openType === 'copy') {
              if (!isCrm) {
                if (data.customerType === 1) {
                  data.userGroupIds = ''
                  data.customerType = 2
                  vm.onlyOne = 'employee'
                } else if (data.customerType === 2) {
                  vm.onlyOne = 'employee'
                }
              } else {
                vm.onlyOne = crm === '1' ? '' : 'employee'
              }
            } else {
              if (isCrm) {
                vm.onlyOne = ''
              } else {
                vm.onlyOne = data.customerType === 1 ? '' : 'employee'
              }
            }
            vm.copyCustomerType = vm.model.customerType
            if (data.content) {
              if (data.content.text) {
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
            const arr = data.userGroupIds && data.userGroupIds.split(',')
            for (const item of arr) {
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
    }
    .form-item-slot{
      display: inline-block;
      height: 32px;
      line-height: 32px;
    }
  }
}
</style>
