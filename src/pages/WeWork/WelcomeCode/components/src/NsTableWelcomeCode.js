/*
 * @Descripttion: 智能欢迎语
 * @Author: yuye.huang
 * @Date: 2020-03-01 16:34:26
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-06-04 18:25:35
 */
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import { WelcomeMessageType, WelcomeMessageTypeTip } from '../../types'
export default {
  name: 'NsTableWelcomeCode',
  mixins: [tableMixin],
  data: function () {
    const operateButtons = [
      {
        'func': function () {
          // this.onAddFun()
          this.$router.push({ path: '/WeWork/WelcomeCode/Edit' })
        },
        'icon': '',
        'name': '新增欢迎语',
        'auth': ``,
        'visible': ``
      }
    ]
    let tableButtons = [
      {
        'func': function (scope) {
          this.$emit('onRedactFun', scope.row)
        },
        'icon': '',
        'name': '编辑',
        'auth': ``,
        'visible': ``
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
    let quickSearchModel = {}
    let searchModel = {
      'content': '',
      'employeeName': '',
      'channelName': '',
      'shopName': '',
      'annexType': '',
      'orderKey': 'updateTime',
      'order': 'descending',
      // 员工组建 员工值
      guideIds: [],
      // 店铺组件 店铺值
      shopIds: []
    }
    let model = Object.assign({}, searchModel)
    return {
      url: this.$api.weWork.welcomeCode.findList,
      model: model,
      quickSearchModel: quickSearchModel,
      _table: {
        table_buttons: tableButtons,
        operate_buttons: operateButtons,
        loadingtable: false
      },
      // 附带内容类型
      annexTypeOptions: [
        {
          value: WelcomeMessageType.Image,
          label: '图片'
        },
        {
          value: WelcomeMessageType.Video,
          label: '视频'
        },
        {
          value: WelcomeMessageType.Link,
          label: '链接'
        },
        {
          value: WelcomeMessageType.MiniProgram,
          label: '小程序'
        },
        {
          value: WelcomeMessageType.Poster,
          label: '二维码海报'
        }
      ],
      employees: process.env.VUE_APP_THEME,
      employeeQA: 'employeeQA',
      employeeScope: 'employee',
      stateQA: 'elStateQA',
      elState: 'elState'
    }
  },
  mounted () {
    this.$reload()
  },
  computed: {
  },
  methods: {
    messageToolTipList (list) {
      return list.map(type => {
        return WelcomeMessageTypeTip[type] || []
      })
    },
    /**
     * @msg:  从后台获取数据,重新排序
     * @param {Object} val {prop: 'date', order: 'descending'}
     */
    onSortChange (val) {
      this.model.orderKey = val.prop
      this.model.order = val.order
      this.$searchAction$()
    },
    /**
     * @msg: 查看欢迎语员工使用范围
     * @param {type} scope.row
     */
    onShowEmployeeScope (data) {
      this.$emit('onShowEmployeeScope', data)
    },
    /**
     * @msg: 查看欢迎语渠道使用范围
     * @param {type} scope.row
     */
    onShowChannelScope (data) {
      this.$emit('onShowChannelScope', data)
    },
    /**
     * @msg: 查看欢迎语门店使用范围
     * @param {type} scope.row
     */
    onShowShopScope (data) {
      this.$emit('onShowShopScope', data)
    },
    /**
     * @msg: 删除智能欢迎语
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
        param.welcomeCodeUuid = data.welcomeCodeUuid
        _this.$http.fetch(_this.$api.weWork.welcomeCode.deleteWelcomeCode, param).then(resp => {
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

      this.$emit('onDeleteFun', data)
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
      that.$http.fetch(that.$api.weChat.welcomes.setWelcomeCodeStatus, { uuid: row.welcomeCodeUuid, status: status, plan: 1 }).then(resp => {
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
