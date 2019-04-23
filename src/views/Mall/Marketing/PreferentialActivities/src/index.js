import tableMixin from 'mixins/table'
import apiRequestConfirm from 'web-crm/src/utils/apiRequestConfirm'
export default {
  name: 'index',
  mixins: [tableMixin],
  data: function () {
    let that = this
    let tableButtons = [
      {
        'func': function () {
          that.$refs.edit.showData()
          that.showEdit = true
        },
        'name': '新增'
      }
    ]
    let operateButtons = [
      {
        'func': function (args) {
          that.$refs.detail.showData(args.row.id)
          that.showView = true
          that.$refs.detail.dialogVisible = true
        },
        'name': '查看'
      },
      {
        'func': function (args) {
          that.$refs.edit.showData(args.row.id)
          that.showEdit = true
        },
        'name': '编辑',
        'visible': 'scope.row.state === 0'
      },
      {
        'func': function (args) {
          that.end(args.row)
        },
        'name': '结束',
        'visible': 'scope.row.state === 1'
      },
      {
        'func': function (args) {
          that.delete(args.row)
        },
        'name': '删除'
      }
    ]
    let model = {
      name: null,
      state: null
    }
    let quickInput = [{ 'name': 'name' }]
    let quickSearchNames = quickInput.map(x => x.name)
    let quickSearchModel = {}
    quickInput.map(item => {
      Object.defineProperty(quickSearchModel, item.name, {
        get: function () {
          return model[item.name]
        },
        set: function (val) {
          model[item.name] = val
        },
        enumerable: true
      })
    })
    return {
      quickSearchModel: quickSearchModel,
      rules: Object.assign({}, {}, {}),
      model: model,
      activityActive: 'all',
      showEdit: false,
      showView: false,
      url: this.$api.guide.marketing.findPreferentialActivitiesList,
      _table: {
        table_buttons: tableButtons,
        operate_buttons: operateButtons,
        quickSearchMap: {},
        quickSearchNames: quickSearchNames
      }
    }
  },
  mounted: function () {
    if (typeof this.$init === 'function') {
      this.$init(this, this.$generateParams$)
    } else {
      this.$reload()
    }
  },
  methods: {
    // 活动状态切换
    tabClick: function (tab) {
      switch (tab.name) {
        case 'all':
          this.model.state = null
          break
        case 'notStart':
          this.model.state = 0
          break
        case 'ongoing':
          this.model.state = 1
          break
        case 'finished':
          this.model.state = 2
          break
        default:
          break
      }
      this._data._pagination.page = 1
      this.$reload()
    },

    // 显示列表
    showList (e) {
      this.showEdit = false
      if (e !== 'back') {
        // 刷新列表
        this.model.state = null
        this.$reload()
      }
    },
    // 关闭详情弹框
    closeView: function () {
      let that = this
      that.showView = false
      that.$refs.detail.dialogVisible = false
    },
    /**
     * 删除活动
     */
    delete: function (row) {
      let that = this
      apiRequestConfirm('删除此活动').then(() => {
        that.$http.fetch(this.$api.guide.marketing.deletePreferentialActivity,
          { activityId: row.id }).then(() => {
          that.$reload()
          that.$notify.success('删除成功')
        }).catch((resp) => {
          that.$message.error(resp.msg || '删除失败，请稍后再试')
        })
      }).catch(() => {})
    },
    /**
     * 结束活动
     */
    end: function (row) {
      let that = this
      apiRequestConfirm('提前结束此活动').then(() => {
        that.$http.fetch(this.$api.guide.marketing.endPreferentialActivity,
          { activityId: row.id }).then(() => {
          that.$reload()
          that.$notify.success('活动已结束')
        }).catch((resp) => {
          that.$message.error(resp.msg || '活动结束失败，请稍后再试')
        })
      }).catch(() => {})
    }
  }
}
