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
      let that = this
      that.$notify.info('导出中，请稍后片刻')
      this.$http
        .fetch(this.$api.weWork.weWorkRooms.export, that.$generateParams$())
        .then(resp => {
          that.synButton = false
          that.$notify.success('下载完成')
        })
        .catch(resp => {
          that.synButton = false
          if (!resp.size === 0) {
            that.$notify.error('导出报错，请联系管理员')
          } else {
            let url = window.URL.createObjectURL(new Blob([resp]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            let fileName = '群列表.csv'
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
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
