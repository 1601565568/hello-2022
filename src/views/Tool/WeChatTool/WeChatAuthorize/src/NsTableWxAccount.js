import tableMixin from 'mixins/table'
import apiRequestConfirm from 'utils/apiRequestConfirm'
// import ErrorCode from 'configs/errorCode'
export default {
  name: 'NsTableWxAccount',
  mixins: [tableMixin],
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
        'func': function (args) {
          this.$emit('edit', args.row)
        },
        'icon': '$.noop',
        'name': '编辑',
        'auth': ``,
        'visible': `  `
      },
      {
        'func': function (args) {
          let that = this
          that.$confirm('是否确定删除该微信公众号？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            that.$http.fetch(that.$api.touch.wxAccount.deleteById,
              {id: args.row.id}).then(resp => {
                that.$notify.success(resp.msg)
                that.$reload()
              }).catch(() => {
                that.$notify.error('删除失败')
              })
          }).catch(() => {
          })
        },
        'icon': '$.noop',
        'name': '\u5220\u9664',
        'auth': ``,
        'visible': `  `
      }
    ]
    var operateButtons = [
      {
        'func': function () {
          let that = this
          that.$http.fetch(that.$api.touch.wxAccount.syncWxAccount).then(() => {
            that.$parent.$reload()
            that.$notify.success('同步成功')
          }).catch(resp => {
            that.$notify.error(resp.msg)
          })
        },
        'icon': '',
        'name': '同步微信公众号',
        'auth': ``,
        'visible': `  `
      }
    ]
    var quickInput = [{
      'template': '',
      'inline': false,
      'name': 'name',
      'text': '公众号',
      'placeholder': '请输入公众号',
      'type': 'text',
      'value': ''
    }]
    var quickSearchNames = quickInput.map(x => x.name)
    var model = Object.assign({}, {'name': ''}, {})
    return {
      model: model,
      rules: Object.assign({}, {}, {}),
      state: {},
      url: this.$api.touch.wxAccount.queryTable,
      _pagination: pagination,
      _table: {
        table_buttons: tableButtons,
        operate_buttons: operateButtons,
        quickSearchNames: quickSearchNames,
        quickSearchMap: {}
      },
      _queryConfig: {expand: false}
    }
  },
  mounted: function () {
    if (typeof this.$init === 'function') {
      this.$init(this, this.$generateParams$)
    } else {
      this.$reload()
    }
  },
  computed: {},
  methods: {
    onStateChange: function (call, val, row) {
      let that = this
      let info
      let changeStatus = 0
      if (val === 1) {
        info = '禁用该公众号'
        changeStatus = 0
      } else if (val === 0) {
        info = '启用该公众号'
        changeStatus = 1
      }
      apiRequestConfirm(info).then(() => {
        that.$http.fetch(that.$api.touch.wxAccount.statusUpdate, {id: row.id, status: changeStatus}).then(() => {
          call()
        }).catch(() => {
          that.$notify.error('状态更新失败，请重试')
        })
      }).catch(() => {
      })
    },
    // 修改优先级
    onEditOrder: function (event) {
      let input = event.target.nextElementSibling
      input.type = 'number'
      input.focus()
      input.select()
      input.originalData = event.target.textContent
      event.target.textContent = ''
    },
    // 确认修改优先级
    onConfirmOrder: function (row, event) {
      event.target.type = 'hidden'
      event.target.previousElementSibling.textContent = event.target.value
      let that = this
      let orderNum = event.target.value
      if (!/^[0-9]+$/.test(orderNum) || parseInt(orderNum) <= 0) {
        that.$notify.warning('优先级必须是正整数')
        event.target.previousElementSibling.textContent = event.target.originalData
        return
      }
      if (orderNum) {
        that.$http.fetch(this.$api.touch.wxAccount.updateOrderNum, {
          id: row.id,
          orderNum: event.target.value
        }).catch(() => {
          event.target.previousElementSibling.textContent = event.target.originalData
          that.$notify.error('优先级修改失败')
        })
      } else {
        event.target.previousElementSibling.textContent = event.target.originalData
      }
    }
  },
  created: function () {
  }
}
