import tableMixin from 'mixins/table'
import apiRequestConfirm from 'utils/apiRequestConfirm'

export default {
  name: 'NsTableTeam',
  mixins: [tableMixin],
  props: {
    types: Object,
    department: Array,
    role: Array
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
          this.$emit('update', obj.row)
        },
        'icon': '$.noop',
        'name': '\u4fee\u6539',
        'auth': ``,
        'visible': ``
      },
      {
        'func': function (obj) {
          this.$emit('update-trans', obj.row)
        },
        'icon': '$.noop',
        'name': '转移',
        'auth': ``,
        'visible': ``
      },
      {
        'func': function (obj) {
          let that = this
          apiRequestConfirm('删除分类短语').then(function () {
            that.$http.fetch(that.$api.kdjl.phrase.deleteById
              , {ids: obj.row.id})
              .then((resp) => {
                that.$notify.success(resp.msg)
                that.$reload()
              })
          }).catch((resp) => {
            that.$notify.error(resp.msg)
          }).catch(() => {})
        },
        'icon': '$.noop',
        'name': '\u5220\u9664',
        'auth': ``,
        'visible': ``
      }
    ]

    var operateButtons = [
      {
        'func': function () {
          this.$emit('add')
        },
        'icon': '$.noop',
        'name': '新增分类短语',
        'auth': ``,
        'visible': ``
      },
      {
        'func': function () {
          this.$emit('import')
        },
        'icon': '$.noop',
        'name': '导入分类短语',
        'auth': ``,
        'visible': ``
      }
    ]

    var model = {
      classPhrase: '',
      shopId: '',
      typeId: '',
      isPublic: 1
    }

    return {
      model: model,
      quickSearchModel: {},
      rules: Object.assign({}, {}, {}),
      state: {},
      typeOptions: [],
      sourceOptions: [],
      Options: {},
      url: this.$api.kdjl.phrase.queryTable,
      _pagination: pagination,
      _table: {
        table_buttons: tableButtons,
        operate_buttons: operateButtons
      }
    }
  },

  mounted: function () {},
  components: {},
  methods: {
    resetInputAction () {
      this.model.classPhrase = ''
      this.$searchAction$()
    },
    deleteClick: function () {
      let that = this
      var data = that.$getSelectionsOfCurrPage()
      if (data.length === 0) {
        this.$notify.warning('请选择分类短语')
      } else {
        apiRequestConfirm('删除所选择分类短语').then(function () {
          let ids = data.map(x => x.id)
          that.$http.fetch(that.$api.kdjl.phrase.deleteById
            , {ids: ids.join(',')})
            .then((resp) => {
              that.$notify.success(resp.msg)
              that.$reload()
            })
        }).catch((resp) => {
          that.$notify.error(resp.msg)
        }).catch(() => {})
      }
    },
    transClick: function () {
      var data = this.$getSelectionsOfCurrPage()
      let ids = data.map(x => x.id)
      if (ids.length > 0) {
        this.$emit('open', ids)
      } else {
        this.$notify.warning('未选择分类短语')
      }
    },
    onHandleSelectChange: function (val) {
      this.$set(this, 'selectRows', val)
    },
    exportSelect () {
      var data = this.$getSelectionsOfCurrPage()
      if (data.length > 0) {
        let phrases = []
        for (let index of data) {
          phrases.push({
            class_phrase: index.class_phrase,
            class_type_id: index.class_type_id
          })
        }
        this.$emit('export-file', JSON.stringify(phrases))
      } else {
        this.$notify.warning('请选择导出分类短语')
      }
    },
    exportAll () {
      var that = this
      this.$http.fetch(this.$api.kdjl.phrase.countPhrase, {shopId: that.model.shopId, isPublic: that.model.isPublic})
        .then((resp) => {
          if (resp.result === '0') {
            that.$notify.warning('该店铺没有分类短语')
          } else {
            this.$emit('export-file', null)
          }
        }).catch((resp) => {
          that.$notify.error(resp.msg)
        })
    }
  }
}
