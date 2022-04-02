import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import NsDatetime from '@nascent/ecrp-ecrm/src/components/NsDatetime'
import NsWechatEmoji from '@nascent/ecrp-ecrm/src/components/NsWechatEmoji'
import ElSelectLoad from '@nascent/nui/packages/select-load/src'

let vm
export default {
  name: 'NsTableWeChatRooms',
  mixins: [tableMixin],
  props: {
    url: Object,
    guideIds: String
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
          this.$router.push({
            name: 'WeComRoomMemberList',
            query: {
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
        buildTime: [],
        guideIds: this.guideIds
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
      // 环境判断
      cloudPlatformType: this.$store.state.user.remumber.remumber_login_info.productConfig.cloudPlatformType,
      model: model,
      synButton: false, // 导出按钮
      quickSearchModel: quickSearchModel,
      rules: Object.assign({}, {}, {}),
      state: {},
      _pagination: pagination,
      _table: {
        table_buttons: tableButtons,
        quickSearchNames: quickSearchNames,
        quickSearchMap: {
          guideIds: this.guideIds
        }
      },
      _queryConfig: { expand: false },
      chatroomLeaders: [],
      personalWxid: ''
    }
  },
  mounted: function () {
    vm = this
    // if (typeof this.$init === 'function') {
    //   this.$init(this, this.$generateParams$)
    // } else {
    //   this.$reload()
    // }
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
    quickSearchAction (name) {
      this.model.guideIds = this.guideIds
      this._data._table.quickSearchMap.guideIds = this.guideIds
      this._data._table.quickSearchMap[name] = this.model[name]
      this.$quickSearch$()
    },
    searchAction () {
      this.model.guideIds = this.guideIds
      this.$refs.table_filter_form.validate((valid) => {
        if (valid) {
          this.$searchAction$()
        }
      })
    },
    resetInputAction () {
      if (typeof this.$resetInput === 'function') {
        const model = this.$resetInput(this.model)
        if (model) {
          this.$set(this, 'model', model)
        }
      } else {
        this.$resetInput$()
      }
      this.model.guideIds = this.guideIds
      this.$searchAction$()
    },
    // 导出
    exportList () {
      if (!this._data._table.data.length) {
        this.$notify.info('当前没有匹配的数据项')
        return
      }
      if (this.synButton) {
        this.$notify.info('正在导出中，请不要重复操作')
        return
      }
      const searchMap = this.$generateParams$().searchMap || {}
      const params = {
        ...searchMap,
        exportType: 20
      }
      const ball = document.getElementById('topSearchbtn').getBoundingClientRect()
      this.$http.fetch(this.$api.guide.task.exportExcel, params).then((resp) => {
        this.$store.dispatch({
          type: 'down/downAction',
          status: true,
          top: 70,
          right: document.body.clientWidth - ball.left - ball.width
        })
      }).catch((resp) => {
        this.$notify.error(resp.msg || '导出报错，请联系管理员')
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
      let params = this.cloudPlatformType === 'kd' ? { chatId: '' } : {}
      let url = this.cloudPlatformType === 'kd' ? this.$api.weWork.weWorkRooms.analysis_owner : this.$api.weWork.weWorkRooms.queryWeWorkRoomsLeaderOptions
      this.$http.fetch(url, params)
        .then((resp) => {
          this.chatroomLeaders = resp.result
        }).catch((resp) => {
          this.$notify.error(resp.msg || '群主下拉框数据加载失败')
        })
    }
  }
}
