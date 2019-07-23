import tableMixin from 'web-crm/src/mixins/table'
import moment from 'moment'

export default {
  mixins: [tableMixin],
  data: function () {
    let that = this
    const tableButtons = [
      {
        'func': function () {
          that.model.createDate = [that.addDate(0), that.addDate(0)]
          that.search()
        },
        'name': '今天'
      },
      {
        'func': function () {
          that.model.createDate = [that.addDate(-1), that.addDate(-1)]
          that.search()
        },
        'name': '昨天'
      },
      {
        'func': function () {
          that.model.createDate = [that.addDate(-7), that.addDate(0)]
          that.search()
        },
        'name': '近7天'
      }
    ]
    return {
      // 表格
      model: { createDate: null, ownerWid: null, name: null, receive: null },
      currentTargetName: null,
      currentOwnerNick: null,
      currentOwnerWid: null,
      loading: false,
      _table: {
        table_buttons: tableButtons,
        quickSearchMap: {}
      },
      _queryConfig: { expand: false },
      url: this.$api.guide.sensitiveWord.findMonitorList,
      // 发送人
      receiveTypeData: [{
        value: '',
        label: '全部'
      }, {
        value: '1',
        label: '导购'
      }, {
        value: '0',
        label: '会员'
      }],
      // 个人号
      ownerData: null,
      contentDlgVisible: false,
      dlgContent: null,
      dlgNick: null,
      dlgWid: null
    }
  },
  methods: {
    moment (time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    addDate (days) {
      return this.dateFormat(new Date(new Date().getTime() + days * 86400000))
    },
    dateFormat (date) {
      let month = date.getMonth() + 1
      if (month < 10) {
        month = '0' + month
      }
      let day = date.getDate()
      if (day < 10) {
        day = '0' + day
      }
      return date.getFullYear() + '-' + month + '-' + day
    },
    contentFormatter (row, column) {
      return this.htmlEncode(row.content)
    },
    htmlEncode (str) {
      let s = ''
      if (str.length === 0) {
        return ''
      }
      s = str.replace(`&`, '&amp;')
      s = s.replace(`<`, '&lt;')
      s = s.replace(`>`, '&gt;')
      s = s.replace(` `, '&nbsp;')
      s = s.replace(`'`, '&#39;')
      s = s.replace(`"`, '&quot;')
      return s
    },
    search () {
      let _this = this
      _this.loading = true
      this.$reload().then(rep => {
        _this.loading = false
      })
    },
    reset () {
      this.model.createDate = [this.addDate(-7), this.addDate(0)]
      this.model.receive = ''
      this.model.ownerWid = null
      this.model.name = null
      this.loadOwnerSelector()
      this.search()
    },
    loadOwnerSelector () {
      this.$http.fetch(this.$api.guide.wxDeviceGuideRelation.findWidNickSelector).then(resp => {
        if (resp.success && resp.result != null) {
          this.ownerData = resp.result
        }
      })
    },
    openContentDlg (row) {
      this.contentDlgVisible = true
      this.dlgContent = row.content
      if (row.receive === '1') {
        this.dlgNick = row.friendNick
        this.dlgWid = row.friendWid
      } else {
        this.dlgNick = row.ownerNick
        this.dlgWid = row.ownerWid
      }
    },
    initParam (paramName) {
      let params = this.$route.params
      if (params !== null) {
        let param = params[paramName]
        if (param !== null) {
          this.model[paramName] = param
        }
      }
    },
    initParams (...paramNames) {
      for (let paramName of paramNames) {
        this.initParam(paramName)
      }
    },
    sortChange: function (column) {
      this._data._order.orderKey = column.prop === null ? '' : column.prop
      this._data._order.orderDir = ''
      if (column.order === 'ascending') {
        this._data._order.orderDir = 'asc'
      } else if (column.order === 'descending') {
        this._data._order.orderDir = 'desc'
      }
      this.search()
    }
  },
  // 初始化
  mounted: function () {
    this.initParams('name', 'recieve')
    // 默认
    this.model.createDate = [this.addDate(-7), this.addDate(0)]
    this.model.receive = ''
    this.loadOwnerSelector()
    this.search()
  }
}
