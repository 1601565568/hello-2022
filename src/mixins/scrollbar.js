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
      _otherPagination: {
        enable: true,
        size: 15,
        sizeOpts: [15, 50, 100, 200],
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
    'collapseText': function () {
      // var preText = this._data._queryConfig.expand ? "收缩" : "展开";
      // var subText = "滤选"; //this._data._queryConfig.searched ? "结果" : "滤选";
      // return `${preText}${subText}`;
      if (!this._data._queryConfig.expand) {
        return '展开搜索'
      } else {
        return '收起搜索'
      }
    },
    'inputRatio': function () {
      return 24 - this.buttonRatio
    }
  },
  methods: {
    /**
     *  将数据转换成json对象
     * @param data
     * @returns {any}
     */
    onTrans2Json: function (data) {
      return JSON.parse(data)
    },
    deleteRow: function (api, id) {
      let that = this
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
      var that = this
      var tableConfig = this._data._table
      tableConfig.loadingtable = true
      return this.$http.fetch(this.url, params).then((resp) => {
        that._data._table.data = resp.result.data
        that._data._otherPagination.total = parseInt(resp.result.recordsTotal)
        if (that._data._otherPagination.total > 0) {
          that._data._table.key = 1
        } else if (that._data._otherPagination.total === 0) {
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
      })
    },
    $searchAction$: function () {
      this._data._table.searchMap = $.extend(true, {}, this.model)
      // 页码变更会触发reload动作
      this._data._otherPagination.page = 1
      this.$reload()
      this.$formatTextToShow$()
    },
    resetInputAction: function () {
      if (typeof this.$resetInput === 'function') {
        var model = this.$resetInput(this.model)
        if (model) {
          this.$set(this, 'model', model)
        }
      } else {
        this.resetInput()
      }
      this.$searchAction$()
    },
    resetInput: function () {
      var model = this.$getOriginModel$()
      var keys = Object.keys(model)
      for (var i = 0; i < keys.length; i++) {
        this.model[keys[i]] = model[keys[i]]
      }
      this._data._queryConfig.showCondition = false
    },
    $removeFilter$: function (name) {
      var vm = this
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
      var expand = this._data._queryConfig.expand
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
        var info = this.nameMap[name]
        if (typeof info.instance.getText === 'function') {
          var text = info.instance.getText()
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
      var keys = Object.keys(this.model)
      for (var i = 0; i < keys.length; i++) {
        if (typeof this.resetField === 'function') {
          var value = this.resetField(keys[i], this.model[keys[i]])
          this.$set(this.model, keys[i], value)
        }
      }
    },
    $format$: function () {
      var formatText = {}
      var keys = Object.keys(this.model)
      for (var i = 0; i < keys.length; i++) {
        if (typeof this.resetField === 'function') {
          var obj = this.formatText(keys[i], this.model[keys[i]])
          if (obj) {
            formatText[keys[i]] = obj
          }
        }
      }
      return formatText
    },
    $getModelForSearch$: function () {
      function excluded (model) {
        var oModel = {}
        var keys = Object.keys(model)
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i]
          var value = model[key]
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
        var keys = Object.keys(model)
        var textToShow = {}
        for (var i = 0; i < keys.length; i++) {
          if (keys[i] in nameMap) {
            var info = nameMap[keys[i]]
            if (typeof info.instance.getText === 'function') {
              var text = info.instance.getText()
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

      var textToShow = {}
      var $handleTextToShow = this.$handleTextToShow
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
    pageChange: function (page) {
      // var _otherPagination = this._data._otherPagination
      this._data._otherPagination.page = page
      return this.$reload()
    },
    sizeChange: function (size) {
      var pagination = this._data._otherPagination
      pagination.size = size
      pagination.page = 1
      return this.$reload()
    },
    $orderChange$: function (data) {
      let column = data.column
      let order = data.order
      var dir = order === 'ascending'
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
    generateParams: function () {
      var order = this._data._order
      var pagination = this._data._otherPagination
      var limit = {
        start: (pagination.page - 1) * pagination.size,
        length: pagination.size
      }
      var searchMap = $.extend(true, {}, this._data._table.searchMap ? this._data._table.searchMap : this.model)
      var params = $.extend(true, {}, order, limit, { searchMap: searchMap })
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
      this._data._otherPagination.page = 1
      this.$reload()
    },
    $handleParams: function (params) {
      return params
    },
    $reload: function () {
      return this.$queryList$(this.generateParams())
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
    '$select': $.noop,
    '$selectAll': $.noop,
    '$selectionChange': $.noop,
    '$cellMouseEnter': $.noop,
    '$cellMouseLeave': $.noop,
    '$cellClick': $.noop,
    '$cellDbclick': $.noop,
    '$rowClick': $.noop,
    '$rowContextmenu': $.noop,
    '$rowDbclick': $.noop,
    '$headerClick': $.noop,
    '$filterChange': $.noop,
    '$currentChange': $.noop,
    '$headerDragend': $.noop,
    '$expend': $.noop
  },
  created: function () {
    this.originModel = Object.assign({}, this.model)
  }
}
