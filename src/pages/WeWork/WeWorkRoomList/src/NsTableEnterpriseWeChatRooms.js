import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import NsDatetime from '@nascent/ecrp-ecrm/src/components/NsDatetime'
import NsWechatEmoji from '@nascent/ecrp-ecrm/src/components/NsWechatEmoji'
import ElSelectLoad from '@nascent/nui/packages/select-load/src'

let vm
export default {
  name: 'NsTableWeChatRooms',
  mixins: [tableMixin],
  props: {
    url: Object
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
        func: function (scope) {
          console.log(scope)
          this.$router.push({
            name: 'WEWORK_ROOM_MEMBER_LIST',
            params: {
              chatId: scope.row.chatId,
              personalWxid: this.personalWxid
            }
          })
        },
        icon: '$.noop',
        name: '查看群成员',
        auth: '',
        visible: '  '
      }
    ]
    const quickInput = [{
      template: '',
      inline: false,
      name: 'title',
      text: '群名称',
      placeholder: '请输入群名称',
      type: 'text',
      value: ''
    }]
    const quickSearchNames = quickInput.map(x => x.name)
    const quickSearchModel = {}
    const model = Object.assign({},
      {
        title: '',
        chatroomLeaderWxid: '',
        buildTime: []
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
      _pagination: pagination,
      _table: {
        table_buttons: tableButtons,
        quickSearchNames: quickSearchNames,
        quickSearchMap: {}
      },
      _queryConfig: { expand: false },
      chatroomLeaders: [],
      personalWxid: ''
    }
  },
  mounted: function () {
    vm = this
    if (typeof this.$init === 'function') {
      this.$init(this, this.$generateParams$)
    } else {
      this.$reload()
    }
    this.queryChatroomLeaderOptions()
  },
  components: {
    NsDatetime,
    NsWechatEmoji,
    ElSelectLoad
    // NsSensitiveButton
  },
  computed: {},
  methods: {
    $queryList$: function (params) {
      const tableConfig = this._data._table
      tableConfig.loadingtable = true
      return this.$http.fetch(this.url, params).then((resp) => {
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
      if (params.searchMap && params.searchMap.joinTime && params.searchMap.joinTime.length > 0) {
        params.searchMap.startJoinTime = params.searchMap.joinTime[0]
        params.searchMap.endJoinTime = params.searchMap.joinTime[1]
      }
      if (params.searchMap && params.searchMap.buildTime && params.searchMap.buildTime.length > 0) {
        params.searchMap.startBuildTime = params.searchMap.buildTime[0]
        params.searchMap.endBuildTime = params.searchMap.buildTime[1]
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
    queryChatroomLeaderOptions () {
      this.$http.fetch(this.$api.weWork.weWorkRooms.queryWeWorkRoomsLeaderOptions)
        .then((resp) => {
          this.chatroomLeaders = resp.result
        }).catch((resp) => {
          this.$notify.error(resp.msg || '群主下拉框数据加载失败')
        })
    }
  }
}
