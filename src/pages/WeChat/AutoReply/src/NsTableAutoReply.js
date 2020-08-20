import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import { getErrorMsg } from '@/utils/toast'

export default {
  name: 'NsTableGuide',
  mixins: [tableMixin],
  props: {
    url: Object
  },
  data: function () {
    let pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    const tableButtons = [
      {
        'func': function (scope) {
          this.$emit('open-dialog', 'edit', '编辑聊天智能回复', scope.row.uuid)
        },
        'icon': '',
        'name': '编辑',
        'auth': ``
      }, {
        'func': function (scope) {
          this.onDeleteFun(scope.row)
        },
        'icon': '',
        'name': '删除',
        'auth': ``,
        'visible': 'scope.row.type !== 9'
      }
    ]
    let that = this
    var operateButtons = [
      {
        'func': function () {
          this.$emit('open-dialog', 'add', '新增智能回复')
        },
        'icon': '$.noop',
        'name': '新增智能回复',
        'auth': ``,
        'visible': ` `
      },
      {
        'func': function () {
          that.batchOperate(0)
        },
        'icon': '$.noop',
        'name': '批量删除',
        'auth': ``,
        'visible': ` `
      },
      {
        'func': function () {
          that.batchOperate(1)
        },
        'icon': '$.noop',
        'name': '批量关闭',
        'auth': ``,
        'visible': ` `
      },
      {
        'func': function () {
          that.batchOperate(2)
        },
        'icon': '$.noop',
        'name': '批量开启',
        'auth': ``,
        'visible': ` `
      }
    ]
    let quickInput = [{
      'template': '',
      'inline': false,
      'name': 'title',
      'text': '标题',
      'placeholder': '请输入欢迎语标题',
      'type': 'text',
      'value': ''
    }]
    let quickSearchNames = quickInput.map(x => x.title)
    let quickSearchModel = {}
    let searchModel = {
      welcomes: {
        id: null,
        group_id: null,
        content: null
      }
    }
    let findVo = {
      chatKeyWord: null,
      matchType: null,
      // 员工组建 员工值
      guideIds: [],
      // 店铺组件 店铺值
      shopIds: []
    }
    let model = Object.assign({}, findVo, {}, searchModel)
    return {
      model: model,
      quickSearchModel: quickSearchModel,
      _table: {
        table_buttons: tableButtons,
        operate_buttons: operateButtons,
        quickSearchNames: quickSearchNames,
        quickSearchMap: {}
      },
      selectedArr: [],
      multipleSelection: [],
      select: true,
      matchType: [
        {
          value: '0',
          label: '不限'
        },
        {
          value: '1',
          label: '完全匹配'
        },
        {
          value: '2',
          label: '模糊匹配'
        },
        {
          value: '3',
          label: '任意匹配'
        }
      ]
    }
  },

  mounted: function () {
    if (typeof this.$init === 'function') {
    } else {
      this.$reload()
    }
  },
  computed: {},
  methods: {
    // 复选框
    selectable (row, index) {
      if (row.shopStatus === 1 || row.shopStatus === -1) {
        return true
      } else {
        return false
      }
    },
    // 选择智能欢迎语
    handleSelectionChange (val) {
      this.selectedArr = val
      val.length > 0 ? this.select = false : this.select = true
    },
    batchOperate (type) {
      if (this.selectedArr.length < 1) {
        this.$notify.error('请选择聊天智能回复')
        return
      }
      let uuid = ''
      this.selectedArr.forEach((v) => {
        uuid += v.uuid + ','
      })
      uuid = uuid.substring(0, uuid.length - 1)
      let msg
      if (type === 0) {
        msg = '批量删除'
      } else if (type === 1) {
        msg = '批量关闭'
      } else if (type === 2) {
        msg = '批量开启'
      }
      this.$confirm('请确认是否进行' + msg + '操作!', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = {}
        param.uuid = uuid
        param.type = type
        this.$http.fetch(this.$api.weChat.autoReply.delete, param).then(resp => {
          if (resp.success) {
            this.$notify.success(msg + '成功')
            this.$nextTick(() => {
              this.$reload()
            })
          } else {
            this.$notify.success(resp.msg)
          }
        }).catch((resp) => {
          this.$notify.error(resp.msg)
        })
      })
    },
    async scopeRowCountAndviewDetails (succeedObj) { // 查看门店详情和查看所属区域详情
      let that = this
      let obj = {}
      obj.templateId = succeedObj.template_id
      obj.appId = succeedObj.app_id
      that.particularsObj = {}
      await this.$http
        .fetch(that.$api.isv.getTemplateInfo, obj)
        .then(resp => {
          resp.result.audit_category = JSON.parse(resp.result.audit_category)
          that.particularsObj = resp.result
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
    },
    // 父组件回传方法 点击编辑
    onRedactFun (data) {
      this.$emit('open-dialog', 'edit', '编辑智能欢迎语')
    },
    /**
     * @msg: 查看聊天智能回复员工使用范围
     * @param {type} scope.row
     */
    onShowEmployeeScope (data) {
      this.$emit('onShowEmployeeScope', data)
    },
    /**
     * @msg: 查看聊天智能回复门店使用范围
     * @param {type} scope.row
     */
    onShowShopScope (data) {
      this.$emit('onShowShopScope', data)
    },
    /**
     * @msg: 删除聊天智能回复
     * @param {type} scope.row
     */
    onDeleteFun (data) {
      let _this = this
      _this.$confirm('请确认是否进行删除操作!', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = {}
        param.uuid = data.uuid
        param.type = 0 // 删除
        _this.$http.fetch(_this.$api.weChat.autoReply.delete, param).then(resp => {
          if (resp.success) {
            _this.$notify.success('删除成功')
            _this.$nextTick(() => {
              _this.$reload()
            })
          } else {
            _this.$notify.success(resp.msg)
          }
        }).catch((resp) => {
          _this.$notify.error(resp.msg)
        })
      })
    },
    /**
     * 更改启用状态
     * @param call
     * @param currVal
     * @param row
     */
    onStatusChange: function (call, currVal, row) {
      let that = this
      let status
      if (currVal === 1) {
        status = 0
      } else if (currVal === 0) {
        status = 1
      }
      that.$http.fetch(that.$api.weChat.autoReply.updateStatus, { uuid: row.uuid, status: status }).then(resp => {
        if (resp.success) {
          that.$notify.success('修改成功')
          that.$nextTick(() => {
            that.$reload()
          })
        } else {
          that.$notify.error(resp.msg)
        }
      }).catch((resp) => {
        that.$notify.error(resp.msg)
      })
    }
  }
}
