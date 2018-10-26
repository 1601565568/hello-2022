import tableMixin from 'mixins/table'
import NsDatetime from 'components/NsDatetime'
import ErrorCode from 'configs/errorCode'
import apiRequestConfirm from 'utils/apiRequestConfirm'
import Vue from 'vue'
import $ from 'jquery'
let vm = this
Vue.component('business-checkbox', {
  data () {
    return {
      brandCheckVal: false,
      brandIsIndeterminate: false
    }
  },
  props: {
    brandCheckV: Boolean,
    brandIndeterminate: Boolean
  },
  watch: {
    brandCheckVal: {
      handler (val) {
      },
      immediate: true,
      deep: true
    },
    brandIndeterminate: {
      handler (val) {
        this.brandIsIndeterminate = val
      },
      immediate: true,
      deep: true
    },
    brandCheckV: {
      handler (val) {
        this.brandCheckVal = val
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    changeFun () {
      vm.changeVal()
    }
  },
  template: '<el-checkbox v-model="brandCheckVal" :indeterminate="brandIsIndeterminate" @change="changeFun"></el-checkbox>'
})

export default {
  name: 'NsTableBrand',
  mixins: [tableMixin],
  props: {
    types: Object
  },
  data: function () {
    var pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    var tableButtons = [
      {
        'func': function (obj) {
          this.$emit('update-tags', obj)
        },
        'icon': '$.noop',
        'name': '修改',
        'auth': ``,
        'visible': ``
      },
      {
        'func': function (obj) {
          let ids = []
          ids.push(obj.row.id)
          let that = this
          apiRequestConfirm('删除品牌').then(function () {
            that.$http.fetch(that.$api.core.brand.deleteById
              , {ids: ids})
              .then((resp) => {
                if (resp.code === ErrorCode.SUCCESS) {
                  that.$notify.success(resp.msg)
                  that.$reload()
                  that.$parent.brandCheckboxVal = false
                  that.brandIndeterminateIndex = false
                } else {
                  that.$notify.warning(resp.msg)
                }
              }).catch((resp) => {
                that.$notify.error(resp.msg)
              })
          }).catch(() => {})
        },
        'icon': '$.noop',
        'name': '删除',
        'auth': ``,
        'visible': `scope.row.tag_type !== 0`
      },
      {
        'func': function (obj) {
          this.$emit('relation-tags', obj)
        },
        'icon': '$.noop',
        'name': '关联店铺',
        'auth': ``,
        'visible': 'scope.row.tag_type !== 0'
      }
    ]

    var operateButtons = [
      {
        'func': function () {
          this.$emit('add-tags')
        },
        'icon': '$.noop',
        'name': '\u65B0\u589E',
        'auth': ``,
        'visible': ``
      },
      {
        'func': function () {
          var that = this
          var data = that.$parent._data._table.data
          if (data.length > 0) {
            let ids = []
            for (let indexData of data) {
              if (indexData.isSelect) {
                ids.push(indexData.id)
              }
            }
            if (ids.length > 0) {
              apiRequestConfirm('删除所选择的品牌').then(function () {
                that.$http.fetch(that.$api.core.brand.deleteById
                  , {ids: ids})
                  .then((resp) => {
                    if (resp.code === ErrorCode.SUCCESS) {
                      that.$notify.success('删除成功')
                      that.$parent.$reload()
                      that.$parent.brandCheckboxVal = false
                      that.$parent.brandIndeterminateIndex = false
                    } else {
                      that.$notify.warning(resp.msg)
                    }
                  }).catch((resp) => {
                    that.$notify.error(resp.msg)
                  })
              }).catch(() => {
              })
            } else {
              this.$notify.warning('未选择品牌')
            }
          } else {
            this.$notify.warning('未选择品牌')
          }
        },
        'icon': '$.noop',
        'name': '\u5220\u9664',
        'auth': ``,
        'visible': ``
      }
    ]

    var quickInput = [{
      'template': '',
      'inline': false,
      'name': 'tag_name',
      'text': '品牌名称',
      'placeholder': '请输入品牌名称',
      'type': 'text',
      'value': '',
      'isConvenient': false
    }]
    var quickSearchNames = quickInput.map(x => x.name)
    var quickSearchModel = {}
    var model = Object.assign({}, {tag_name: '', remark: ''}, {time: []})
    var that = this

    quickInput.map(item => {
      Object.defineProperty(quickSearchModel, item.name, {
        get: function () {
          return model[item.name]
        },
        set: function (val) {
          model[item.name] = val
          // TODO 由于特殊需求导致下列写法
          if (item.type === 'radio') {
            that._data._table.quickSearchMap[item.name] = val
            that.$quickSearch$()
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
      url: this.$api.core.brand.queryTable,
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
      brandCheckboxVal: false, // 表格头部是否选中
      brandIndeterminateIndex: false // 表格是否全选
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
    NsDatetime
  },
  methods: {
    '$handleParams': function (params) {
      if (params.searchMap && params.searchMap.time && params.searchMap.time.length > 0) {
        params.searchMap.start_time = params.searchMap.time[0]
        params.searchMap.end_time = params.searchMap.time[1]
      }
      delete params.searchMap.time
      return params
    },
    $sizeChange$: function (size) {
      var pagination = this._data._pagination
      pagination.size = size
      return this.reload()
    },
    reload: function () {
      this._data._table.data = []
      this.brandCheckboxVal = false
      this.brandIndeterminateIndex = false
      return this.$queryList$(this.$generateParams$())
    },
    // 当前选择
    indexSelection () {
      this.getSelectionsOfCurrPage()
    },
    // 判断选择
    getSelectionsOfCurrPage () {
      let selections = []
      var count = 0
      for (let date of this._data._table.data) {
        if (date.isSelect) {
          selections.push(date)
        }
        if (date.tag_type === 0) {
          count++
        }
      }
      if (selections.length === (this._data._table.data.length - count)) {
        this.brandCheckboxVal = true
        this.brandIndeterminateIndex = false
      } else if (selections.length > 0) {
        this.brandCheckboxVal = false
        this.brandIndeterminateIndex = true
      } else {
        this.brandCheckboxVal = false
        this.brandIndeterminateIndex = false
      }
    },
    $searchAction$: function () {
      this._data._table.searchMap = $.extend(true, {}, this.model)
      // 记录搜索的条件
      var prePage = this._data._pagination.page
      // 页码变更会触发reload动作
      this._data._pagination.page = 1
      if (prePage === 1) {
        this.reload()
      }
      this.$formatTextToShow$()
    },
    // 全选
    selectionAll (obj) {
      for (let date of this._data._table.data) {
        if (date.tag_type !== 0) {
          this.$set(date, 'isSelect', obj)
        }
      }
      this.getSelectionsOfCurrPage()
    },
    onHandleSelectChange: function (val) {
      this.$set(this, 'selectRows', val)
    },
    onSearch () {
    },
    // 在渲染表头的时候，会调用此方法，h为createElement的缩写版  添加on.change事件即可
    renderProductId (h, {column}) {
      return h('business-checkbox', {
        props: {
          brandCheckV: this.brandCheckboxVal,
          brandIndeterminate: this.brandIndeterminateIndex
        }
      })
    },
    changeVal () {
      this.brandCheckboxVal = !this.brandCheckboxVal
      this.selectionAll(this.brandCheckboxVal)
    }
  }
}
