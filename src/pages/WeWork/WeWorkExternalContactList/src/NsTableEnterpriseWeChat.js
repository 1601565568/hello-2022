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
        icon: '$.noop',
        name: '\u8be6\u60c5',
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
        addTime: []
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
      model: model,
      quickSearchModel: quickSearchModel,
      rules: Object.assign({}, {}, {}),
      state: {},
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
      userDetails: {}
    }
  },
  mounted: function () {
    vm = this
    if (typeof this.$init === 'function') {
      this.$init(this, this.$generateParams$)
    } else {
      this.reload()
    }
  },
  components: {
    ElSelectLoad,
    NsDatetime,
    NsWechatEmoji,
    NsEmployeeSelect
  },
  watch: {},
  methods: {
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
          console.log(this.employees)
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
      let _this = this
      // 无union_id则不支持查询详情
      if (val.unionId && val.unionId !== '') {
        _this.$http.fetch(_this.$api.guide.guide.customerGetDetail, {
          'unionId': val.unionId,
          'shopId': val.shopId
        }).then(resp => {
          if (resp.success && resp.result != null) {
            _this.NSUserDetails = resp.result
            _this.$refs.NSUserDetails.showDetailDialog()
          }
        }).catch((resp) => {
          _this.$notify.error(getErrorMsg('查询失败', resp))
        })
      } else {
        _this.$notify.warning('好友UNION_ID不存在,不支持查询详情')
      }
    }
  }
}
