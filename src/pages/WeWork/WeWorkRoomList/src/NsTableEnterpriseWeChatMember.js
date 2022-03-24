import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import NsDatetime from '@nascent/ecrp-ecrm/src/components/NsDatetime'
import NsWechatEmoji from '@nascent/ecrp-ecrm/src/components/NsWechatEmoji'
import NsFriendDetail from '@/components/NsFriendDetail'

let vm
export default {
  name: 'NsTableWeChatRooms',
  mixins: [tableMixin],
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
        func: function () {
          this.$router.push({
            name: 'WeComRoomList'
          })
        },
        icon: '$.noop',
        name: '返回',
        auth: '',
        visible: '  '
      }
    ]
    const operateButtons = [
      {
        func: function (obj) {
          // console.log(this, 'this')
          // this.$parent.$refs.detail.onOpenDetail(obj.row.sys_customer_id)
          this.onUserDetail(obj.row)
        },
        // icon: '$.noop',
        name: '详情',
        auth: '',
        visible: 'scope.row.member_type === 2'
      }
    ]

    const quickInput = [{
      template: '',
      inline: false,
      name: 'memberWechatNick',
      text: '微信昵称',
      placeholder: '请输入微信昵称',
      type: 'text',
      value: ''
    }]
    const quickSearchNames = quickInput.map(x => x.name)
    const quickSearchModel = {}
    const model = Object.assign({},
      {
        memberWechatNo: '',
        memberWechatNick: '',
        ownerBind: '',
        memberType: '',
        joinTime: [],
        joinScene: ''
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
      // 判断客道、ecrp环境
      cloudPlatformType: this.$store.state.user.remumber.remumber_login_info.productConfig.cloudPlatformType,
      model: model,
      quickSearchModel: quickSearchModel,
      rules: Object.assign({}, {}, {}),
      state: {},
      _pagination: pagination,
      _table: {
        table_buttons: tableButtons,
        operate_buttons: operateButtons,
        quickSearchNames: quickSearchNames,
        quickSearchMap: {}
      },
      _queryConfig: { expand: false }
    }
  },
  mounted: function () {
    vm = this
    if (typeof this.$init === 'function') {
      this.$init(this, this.$generateParams$)
    } else {
      this.$reload()
    }
  },
  components: {
    NsDatetime,
    NsWechatEmoji,
    NsFriendDetail
    // NsSensitiveButton
  },
  computed: {},
  methods: {
    $queryList$: function (params) {
      const tableConfig = this._data._table
      tableConfig.loadingtable = true
      return this.$http.fetch(this.$api.weWork.weWorkRooms.queryWeWorkRoomsMemberTable, params).then((resp) => {
        this._data._table.data = resp.result.data
        this._data._table.ext = resp.result.ext
        this._data._pagination.total = parseInt(resp.result.recordsTotal)
        if (this._data._pagination.total > 0) {
          this._data._table.key = 1
        } else if (this._data._pagination.total === 0) {
          this._data._table.key = 2
        }
      }).catch((err) => {
        if (err && err.msg) {
          this.$notify.error(err.msg)
        } else {
          this.$notify.error('网络异常，获取数据失败！')
        }
      }).finally(() => {
        tableConfig.loadingtable = false
      })
    },
    searchAction () {
      this.$refs.table_filter_form.validate((valid) => {
        if (valid) {
          this.$searchAction$()
        }
      })
    },
    /**
     * 参数设置
     */
    $handleParams: function (params) {
      Object.assign(params.searchMap, this.$route.query)
      if (params.searchMap) {
        if (params.searchMap.joinTime && params.searchMap.joinTime.length > 0) {
          params.searchMap.startJoinTime = params.searchMap.joinTime[0]
          params.searchMap.endJoinTime = params.searchMap.joinTime[1]
        }
      }
      return params
    },
    checkUrl (url) {
      if (url !== null && url !== '') {
        if (url.indexOf('img.alicdn.com') !== -1) {
          url = url + '_200x200.jpg'
        }
      }
      return url
    },
    // 查询外部联系人详情，根据shopId和unionId查询
    onUserDetail (val) {
      this.$refs.NsFriendDetail.showDetailDialog({
        shopId: '',
        unionid: '',
        externalUserId: val.user_id
      })
    },
    // 好友详情打开会员详情事件传递
    showVip (val) {
      // this.$refs.NSUserDetails.showDetailDialog(val)
    },
    getViewId (val) {
      this.propsViewId = val
    }
  }
}
