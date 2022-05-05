import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import $ from 'jquery'
import NsDatetime from '@nascent/ecrp-ecrm/src/components/NsDatetime'
import ElSelectLoad from '@nascent/nui/lib/select-load'
import NsWechatEmoji from '@nascent/ecrp-ecrm/src/components/NsWechatEmoji'
import NsEmployeeSelect from '@nascent/ecrp-ecrm/src/components/NsEmployeeSelect'
import { getErrorMsg } from '@/utils/toast'

let vm
export default {
  name: 'NsTableEnterpriseWeChat',
  mixins: [tableMixin],
  props: {
    types: Object
  },
  data: function () {
    const pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    const tableButtons = [
      {
        func: function (obj) {
          // console.log(this, 'this')
          // this.$parent.$refs.detail.onOpenDetail(obj.row.sys_customer_id)
          this.onUserDetail(obj.row)
        },
        // icon: '$.noop',
        name: '详情',
        auth: '',
        visible: ''
      }
    ]

    const operateButtons = []

    const quickInput = [{
      template: '',
      inline: false,
      name: 'externalName',
      text: '昵称',
      placeholder: '请输入昵称',
      type: 'text',
      value: '',
      isConvenient: false
    }]
    const quickSearchNames = quickInput.map(x => x.name)
    const quickSearchModel = {}
    const model = Object.assign({},
      {
        employeeIds: [],
        externalName: '',
        addFriendChannel: '',
        addTime: [],
        mobileNum: '',
        sexy: '',
        tag: '',
        areaId: this.$store.state.user.area.id
      }, {})

    quickInput.map(item => {
      Object.defineProperty(quickSearchModel, item.name, {
        get: function () {
          return model[item.name]
        },
        set: function (val) {
          model[item.name] = val
          // TODO 由于特殊需求导致下列写法
          if (item.type === 'radio') {
            vm._data._table.quickSearchMap[item.name] = val
            vm.$quickSearch$()
          }
        },
        enumerable: true
      })
    })

    return {
      propsSet: {
        label: 'tag_name',
        value: 'tag_id',
        disabled: 'disabled'
      },
      model: model,
      synButton: true,
      synFriend: true,
      // 批量打标弹窗
      showBatchMarkingVisible: false,
      // 标签组列表
      tagGroupList: [],
      // 标签列表
      tagList: [],
      // 选中的打标客户列表
      checkedCustomerList: [],
      // 选中的标签列表
      checkedTagList: [],
      quickSearchModel: quickSearchModel,
      rules: Object.assign({}, {}, {}),
      state: {},
      sourceList: [
        { id: '0', name: '未知来源' },
        { id: '1', name: '扫描二维码' },
        { id: '2', name: '搜索手机号' },
        { id: '3', name: '名片分享' },
        { id: '4', name: '群聊' },
        { id: '5', name: '手机通讯录' },
        { id: '6', name: '微信联系人' },
        { id: '7', name: '来自微信的添加好友申请' },
        { id: '8', name: '安装第三方应用时自动添加的客服人员' },
        { id: '9', name: '搜索邮箱' },
        { id: '201', name: '内部成员共享' },
        { id: '202', name: '管理员/负责人分配 ' }
      ],
      addWay: {
        '0': '未知来源',
        '1': '扫描二维码',
        '2': '搜索手机号',
        '3': '名片分享',
        '4': '群聊',
        '5': '手机通讯录',
        '6': '微信联系人',
        '7': '来自微信的添加好友申请',
        '8': '安装第三方应用时自动添加的客服人员',
        '9': '搜索邮箱',
        '201': '内部成员共享',
        '202': '管理员/负责人分配'
      },
      employees: [],
      addFriendChannels: [],
      total: 0,
      show: true,
      url: this.$api.weWork.externalContact.queryExternalContactTable,
      _pagination: pagination,
      _table: {
        table_buttons: tableButtons,
        operate_buttons: operateButtons,
        quickSearchNames: quickSearchNames,
        quickSearchMap: {}
      },
      _queryConfig: {
        expand: false
      },
      userDetails: {},
      // 体系Id
      propsViewId: '',
      selectParams: { isTagGroup: 0 },
      cloudPlatformType: this.$store.state.user.remumber.remumber_login_info.productConfig.cloudPlatformType // 判断客道、ecrp环境
    }
  },
  mounted: function () {
    vm = this
    if (typeof this.$init === 'function') {
      this.$init(this, this.$generateParams$)
    } else {
      this.reload()
    }
    this.initSynButton()
  },
  components: {
    ElSelectLoad,
    NsDatetime,
    NsWechatEmoji,
    NsEmployeeSelect
  },
  methods: {
    // 批量打标点击事件
    batchMarking: function () {
      if (this.checkedCustomerList && this.checkedCustomerList.length > 0) {
        this.queryTagList()
        this.showBatchMarkingVisible = true
      } else {
        this.$notify.warning('请先选择要打标的客户')
      }
    },
    // 查询企业标签列表
    queryTagList: function () {
      let that = this
      that.$http.fetch(that.$api.weWork.externalContact.queryCorpTagList)
        .then((resp) => {
          let corpTagList = resp.result
          if (corpTagList) {
            // 标签组列表
            let tagGroupList = []
            // 标签列表
            let tagList = []
            for (let corpTag of corpTagList) {
              if (corpTag.is_tag_group === 1) {
                tagGroupList.push({
                  tagId: corpTag.tag_id,
                  tagName: corpTag.tag_name
                })
              } else {
                tagList.push({
                  tagId: corpTag.tag_id,
                  tagName: corpTag.tag_name,
                  parentTagId: corpTag.parent_tag_id
                })
              }
            }
            that.tagGroupList = tagGroupList
            that.tagList = tagList
          }
        }).catch((resp) => {
          that.$notify.error(getErrorMsg('获取企业标签失败,请稍后重试', resp))
        }).finally(() => {})
    },

    // 查询好友同步情况
    initSynButton: function () {
      let that = this
      that.$http.fetch(that.$api.core.group.getGroupConfig)
        .then((resp) => {
          let config = resp.result
          that.synButton = false
          if (config && resp.result.syn_wework_friend === 1) {
            that.synFriend = true
          } else {
            that.synFriend = false
          }
        })
    },
    // 好友同步
    synFriends: function () {
      let that = this
      if (that.synButton || !that.synFriend) {
        this.$notify.warning('正在同步中')
        return
      }
      that.synFriend = false
      that.synButton = true
      that.$http.fetch(that.$api.weWork.externalContact.synWeWorkFriends)
        .then((resp) => {
          this.$notify.success('同步运行成功')
        }).catch((resp) => {
          this.$notify.error(getErrorMsg('同步失败，请稍后再试', resp))
          that.synFriend = true
          that.synButton = false
        })
    },
    // 批量打标保存
    saveBatchMarking: function () {
      let that = this
      if (that.checkedTagList && that.checkedTagList.length > 0) {
        that.$http.fetch(that.$api.weWork.externalContact.saveBatchMarking, { checkedCustomerList: that.checkedCustomerList, checkedTagList: that.checkedTagList }).then((resp) => {
          this.showBatchMarkingVisible = false
          this.checkedTagList = []
          this.$notify.success('批量打标成功')
          this.$searchAction$()
        }).catch((resp) => {
          this.$notify.error(getErrorMsg('批量打标失败', resp))
        })
      } else {
        this.$notify.warning('请先选择标签')
      }
    },
    // 批量打标关闭
    BatchMarkingClose: function () {
      this.showBatchMarkingVisible = false
      this.checkedTagList = []
    },
    // 多选框选中事件
    onHandleSelectChange: function (val) {
      let checkedCustomerList = []
      val.forEach(function (item) {
        checkedCustomerList.push({
          externalUserId: item.externalUserId,
          userId: item.userId
        })
      })
      this.checkedCustomerList = checkedCustomerList
    },
    $resetInputAction$: function () {
      if (typeof this.$resetInput === 'function') {
        const model = this.$resetInput(this.model)
        if (model) {
          this.$set(this, 'model', model)
        }
      } else {
        this.$resetInput$()
      }
      this.employees = []
      this.$searchAction$()
    },
    reload: function () {
      return this.$queryList$(this.$generateParams$())
    },
    searchAction () {
      this.$refs.table_filter_form.validate((valid) => {
        if (valid) {
          this.$searchAction$()
        }
      })
    },
    pageChange (obj) {
      if (obj === 100) {
        this.$notify.warning('最大页数只能100页')
      }
      this.$pageChange$(obj)
    },
    $handleParams: function (params) {
      if (params.searchMap) {
        if (params.searchMap.addTime && params.searchMap.addTime.length > 0) {
          params.searchMap.startAddTime = params.searchMap.addTime[0]
          params.searchMap.endAddTime = params.searchMap.addTime[1]
        }
        if (this.employees && this.employees.length > 0) {
          params.searchMap.employeeIds = this.employees
          // this.employees.map(item => {
          //   params.searchMap.employeeIds.push(...item)
          // })
          // this.employees.map(item => {
          //   params.searchMap.employeeIds.push(item.employeeId)
          // })
        }
      }
      return params
    },
    showDetail (obj) {
      this.$parent.sysCustomerId = obj.id.toString()
      this.$parent.showDetailVisible = true
    },
    onSearch () {
      this._data._table.searchMap = $.extend(true, {}, this.model)
      this._data._pagination.page = 1
      this.reload()
      this.$formatTextToShow$()
    },
    checkUrl (url) {
      if (url !== null && url !== '') {
        if (url.indexOf('img.alicdn.com') !== -1) {
          url = url + '_200x200.jpg'
        }
      }
      return url
    },
    searchTable () {
      if (!this._data._queryConfig.expand) {
        this.$searchAction$()
      }
    },
    employeeChange () {
      this.searchTable()
    },
    NsGuideDialog () {
      this.handleSearch()
    },
    handleSearch () {
      let params = JSON.parse(JSON.stringify(this.model))
      let param = {
        ...params,
        guideId: params.guideId.join(','),
        pageForm: params.pageForm.join(',')
      }
      this.$search({ searchMap: { ...param } })
      this.overview()
    },
    // 查询外部联系人详情，根据shopId和unionId查询
    onUserDetail (val) {
      // console.log(val, '打开')
      this.$refs.NsFriendDetail.showDetailDialog(val)
      // this.$refs.NSUserDetails.showDetailDialog(val)
    },
    // 好友详情打开会员详情事件传递
    showVip (val) {
      this.$refs.NSUserDetails.showDetailDialog(val)
    },
    getViewId (val) {
      this.propsViewId = val
    }
  }
}
