import tableMixin from 'web-crm/src/mixins/table'
import moment from 'moment'
import ElBreadcrumb from 'nui-v2/lib/breadcrumb'
import ElBreadcrumbItem from 'nui-v2/lib/breadcrumb-item'

export default {
  mixins: [tableMixin],
  components: {
    ElBreadcrumb, ElBreadcrumbItem
  },
  data: function () {
    let pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    return {
      // 表格
      model: { createDate: null, ownerWid: null, name: null, memberSend: null, screenWidth: 1366 },
      _order: {
        orderDir: null,
        orderKey: null
      },
      _pagination: pagination,
      loading: false,
      _table: {
        quickSearchMap: {}
      },
      _queryConfig: { expand: false },
      url: this.$api.guide.sensitiveWord.findMonitorList,
      // 发送人
      memberSendData: [{
        value: null,
        label: '全部'
      }, {
        value: 1,
        label: '会员'
      }, {
        value: 0,
        label: '导购'
      }],
      // 个人号
      ownerData: null,
      contentDlgVisible: false,
      dlgContent: null,
      dlgNick: null,
      dlgWid: null,
      dateRadio: null
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
    chgDate () {
      switch (this.dateRadio) {
        case '今天':
          this.model.createDate = [this.addDate(0), this.addDate(0)]
          break
        case '昨天':
          this.model.createDate = [this.addDate(-1), this.addDate(-1)]
          break
        case '近7天':
          this.model.createDate = [this.addDate(-7), this.addDate(0)]
          break
      }
      this.$searchAction$()
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
      this.$searchAction$()
    }
  },
  // 初始化
  mounted: function () {
    this.model.screenWidth = document.body.clientWidth
    this.initParams('name', 'memberSend')
    // 默认
    // this.model.createDate = [this.addDate(-7), this.addDate(0)]
    this.loadOwnerSelector()
    this.$searchAction$()
  }
}
