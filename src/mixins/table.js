import $ from 'jquery'

function isBlank (value) {
  if (value === null || value === undefined) {
    return true
  }
  if (/^\s*$/.test(value)) {
    return true
  }
  return false
}

function isEmpty (value) {
  if (value.length === 0) {
    return true
  } else {
    return false
  }
}

function hasKey (obj) {
  if (obj === null || obj === undefined) {
    return false
  }
  if (Object.keys(obj).length === 0) {
    return false
  }
  return true
}

function getType (o) {
  if (o === null || o === undefined) {
    return null
  }
  return o.constructor.name
}

export default {
  beforeMount: function () {
    if (typeof this.$beforeMount === 'function') {
      this.$beforeMount(this)
    }
  },
  data: function () {
    return {
      needScrollToView: false, // 是否需要自定滚动至可视区域
      tableElement: null,
      selectRows: [],
      model: {},
      rules: {},
      state: {},
      nameMap: {},
      textToShow: {},
      _helpState: false,
      _queryConfig: {
        expand: false,
        searched: false,
        showCondition: false
      },
      _table: {
        quickSearchNames: [],
        searchMap: null,
        quickSearchMap: {},
        data: [],
        key: 0,
        loadingtable: false,
        _CUSTOM_: 'custom',
        table_buttons: [],
        operate_buttons: []
      },
      _pagination: {
        enable: true,
        size: 15,
        sizeOpts: [15, 50, 100],
        page: 1,
        total: 0
      },
      _order: {
        orderDir: undefined,
        orderKey: undefined
      },
      originModel: {}
    }
  },
  props: {
    'button-ratio': {
      type: Number,
      default: 16
    }
  },
  computed: {
    collapseText: function () {
      // var preText = this._data._queryConfig.expand ? "收缩" : "展开";
      // var subText = "滤选"; //this._data._queryConfig.searched ? "结果" : "滤选";
      // return `${preText}${subText}`;
      if (!this._data._queryConfig.expand) {
        return '展开搜索'
      } else {
        return '收起搜索'
      }
    },
    inputRatio: function () {
      return 24 - this.buttonRatio
    }
  },
  methods: {
    // 设置uuid为表格id
    uuid () {
      const s = []
      const hexDigits = '0123456789abcdef'
      for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      }
      s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
      // @ts-ignore
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = '-'

      const uuid = s.join('')
      return uuid
    },
    /**
     *  将数据转换成json对象
     * @param data
     * @returns {any}
     */
    onTrans2Json: function (data) {
      return JSON.parse(data)
    },
    deleteRow: function (api, id) {
      const that = this
      return that.$http.fetch(api, { id: id }).then(resp => {
        that.$reload()
        that.$notify.success(resp.msg)
      }).catch(() => {
        that.$notify.error('删除失败')
      })
    },
    /**
     * 处理表格选择
     * @param val
     */
    onHandleSelectChange: function (val) {
      this.$set(this, 'selectRows', val)
    },
    $queryList$: function (params) {
      const that = this
      const tableConfig = this._data._table
      tableConfig.loadingtable = true
      return this.$http.fetch(this.url, params).then((resp) => {
        that._data._table.data = resp.result.data
        that._data._pagination.total = parseInt(resp.result.recordsTotal)
        that._data._ext = resp.result.ext || {}
        if (that._data._pagination.total > 0) {
          that._data._table.key = 1
        } else if (that._data._pagination.total === 0) {
          that._data._table.key = 2
        }
      }).catch((err) => {
        if (err && err.msg) {
          that.$notify.error(err.msg)
        } else {
          that.$notify.error('网络异常，获取数据失败！')
        }
      }).finally(() => {
        tableConfig.loadingtable = false
        that.needScrollToView && that._data._queryConfig.tableId && that.$scrollToView()
        that.needScrollToView = false
      })
    },
    $searchAction$: function () {
      this._data._table.searchMap = $.extend(true, {}, this.model)
      // 页码变更会触发reload动作
      this._data._pagination.page = 1
      this.$reload()
      this.$formatTextToShow$()
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
      this.$searchAction$()
    },
    $resetInput$: function () {
      const model = this.$getOriginModel$()
      const keys = Object.keys(model)
      for (let i = 0; i < keys.length; i++) {
        this.model[keys[i]] = model[keys[i]]
      }
      this._data._queryConfig.showCondition = false
    },
    $removeFilter$: function (name) {
      const vm = this
      if (typeof this.$removeFilter === 'function') {
        this.$removeFilter(this.model, name, function (name, value) {
          vm.$delete(vm._data._table.searchMap, name)
          vm.model[name] = value
        })
      } else {
        this.$delete(this._data._table.searchMap, name)
        this.model[name] = this.$getOriginModel$()[name]
      }
      this.$formatTextToShow$()
      this.$reload()
      if (Object.keys(this.textToShow).length === 0) {
        this._data._queryConfig.expand = false
        this._data._queryConfig.showCondition = false
      }
    },
    $handleTabClick: function () {
      const expand = this._data._queryConfig.expand
      // var showCondition = this._data._queryConfig.showCondition
      if (expand) {
        this._data._queryConfig.expand = false
      } else {
        this._data._queryConfig.expand = true
      }
    },
    $showHelp: function () {
      this._data._helpState = !this._data._helpState
    },
    $formatText$: function (name) {
      if (name in this.nameMap) {
        const info = this.nameMap[name]
        if (typeof info.instance.getText === 'function') {
          const text = info.instance.getText()
          if (!isBlank(text)) {
            return {
              text: text,
              label: info.text
            }
          }
        }
      }
    },
    $resetField$: function (name) {
      // var model = this.$getOriginModel$()
      this.$set(this.model, name, this.$getOriginModel$().name)
    },
    $reset$: function () {
      const keys = Object.keys(this.model)
      for (let i = 0; i < keys.length; i++) {
        if (typeof this.resetField === 'function') {
          const value = this.resetField(keys[i], this.model[keys[i]])
          this.$set(this.model, keys[i], value)
        }
      }
    },
    $format$: function () {
      const formatText = {}
      const keys = Object.keys(this.model)
      for (let i = 0; i < keys.length; i++) {
        if (typeof this.resetField === 'function') {
          const obj = this.formatText(keys[i], this.model[keys[i]])
          if (obj) {
            formatText[keys[i]] = obj
          }
        }
      }
      return formatText
    },
    $getModelForSearch$: function () {
      function excluded (model) {
        const oModel = {}
        const keys = Object.keys(model)
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i]
          const value = model[key]
          switch (getType(value)) {
            case null:
              break
            case 'String':
              if (isBlank(value)) {
                oModel[key] = value
              }
              break
            case 'Object':
              if (!hasKey(value)) {
                oModel[key] = value
              }
              break
            case 'Array':
              if (isEmpty(value)) {
                oModel[key] = value
              }
              break
            default:
              oModel[key] = value
              break
          }
        }
        return oModel
      }

      return excluded(this.model)
    },
    $formatTextToShow$: function () {
      function isBlank (value) {
        if (value === null || value === undefined) {
          return true
        }
        if (/^\s*$/.test(value)) {
          return true
        }
        return false
      }

      function convert (model, nameMap) {
        const keys = Object.keys(model)
        const textToShow = {}
        for (let i = 0; i < keys.length; i++) {
          if (keys[i] in nameMap) {
            const info = nameMap[keys[i]]
            if (typeof info.instance.getText === 'function') {
              const text = info.instance.getText()
              if (!isBlank(text)) {
                textToShow[keys[i]] = {
                  label: info.text,
                  text: info.instance.getText()
                }
              }
            } else {
              if (model[keys[i]]) {
                textToShow[keys[i]] = {
                  label: info.text,
                  text: model[keys[i]]
                }
              }
            }
          }
        }
        return textToShow
      }

      let textToShow = {}
      const $handleTextToShow = this.$handleTextToShow
      if (typeof $handleTextToShow === 'function') {
        textToShow = $handleTextToShow(this.model, this.nameMap)
      } else {
        textToShow = convert(this.$getModelForSearch$(), this.nameMap)
      }
      this.$set(this, 'textToShow', textToShow)
      // //无查询条件时，收起搜索框
      // if(Object.keys(textToShow).length === 0) {
      // this._data._queryConfig.searched = false;
      // this._data._queryConfig.expand = false;
      // }
    },
    $getOriginModel$: function () {
      return this.originModel
    },
    $pageChange$: function (page) {
      this.needScrollToView = true
      // var _pagination = this._data._pagination
      this._data._pagination.page = page
      return this.$reload()
    },
    $sizeChange$: function (size) {
      this.needScrollToView = true
      const pagination = this._data._pagination
      pagination.size = size
      pagination.page = 1
      return this.$reload()
    },
    $orderChange$: function (data) {
      const column = data.column
      const order = data.order
      const dir = order === 'ascending'
        ? 'asc' : (order === 'descending') ? 'desc' : undefined
      if (dir) {
        this._data._order.orderDir = dir
        this._data._order.orderKey = column.sortable
      } else {
        this._data._order.orderDir = undefined
        this._data._order.orderKey = undefined
      }
      this.$reload()
    },
    $generateParams$: function () {
      const order = this._data._order
      const pagination = this._data._pagination
      const limit = {
        start: (pagination.page - 1) * pagination.size,
        length: pagination.size
      }
      const searchMap = $.extend(true, {}, this._data._table.searchMap ? this._data._table.searchMap : this.model)
      const params = $.extend(true, {}, order, limit, { searchMap: searchMap })
      if (typeof this.$handleParams === 'function') {
        return this.$handleParams(params)
      }
      return params
    },
    $quickSearchAction$: function (name) {
      this._data._table.quickSearchMap[name] = this.model[name]
      this.$quickSearch$()
    },
    $quickSearch$: function () {
      this._data._table.searchMap = $.extend(true, {}, this._data._table.quickSearchMap)
      // 页码变更会触发reload动作
      this._data._pagination.page = 1
      this.$reload()
    },
    $handleParams: function (params) {
      return params
    },
    $reload: function () {
      return this.$queryList$(this.$generateParams$())
    },
    // 表格头部滚动至可视区域
    $scrollToView () {
      if (!this.tableElement) {
        // @ts-ignore
        this.tableElement = document.getElementById(this._data._queryConfig.tableId)
      }
      /* todo - 80 / 60 为页面 header 高度值，应为动态获取，此处代码存在问题； */
      // @ts-ignore
      this.tableElement && window.scrollTo(0, this.tableElement.offsetTop - (window.innerWidth > 1625 ? 80 : 60))
    },
    $search: function (params) {
      this._data._table.searchMap = $.extend(true, this._data._table.searchMap, params.searchMap)
      this.$reload()
    },
    $refresh: function () {
      this.$refs.tree.refresh()
    },
    $getSelectionsOfCurrPage: function () {
      return this.selectRows
    },
    $select: $.noop,
    $selectAll: $.noop,
    $selectionChange: $.noop,
    $cellMouseEnter: $.noop,
    $cellMouseLeave: $.noop,
    $cellClick: $.noop,
    $cellDbclick: $.noop,
    $rowClick: $.noop,
    $rowContextmenu: $.noop,
    $rowDbclick: $.noop,
    $headerClick: $.noop,
    $filterChange: $.noop,
    $currentChange: $.noop,
    $headerDragend: $.noop,
    $expend: $.noop
  },
  created: function () {
    this.originModel = Object.assign({}, this.model)
    if (this._data._queryConfig.tableId === '') {
      this._data._queryConfig.tableId = this.uuid()
    }
  }
}
