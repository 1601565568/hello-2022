/*
 * @Descripttion: 智能欢迎语
 * @Author: yuye.huang
 * @Date: 2020-03-01 16:34:26
 * @LastEditors: yuye.huang
 * @LastEditTime: 2020-03-16 16:48:30
 */
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import annexType from '@/config/annexType.js'

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
        'visible': ``
      }
    ]
    let quickSearchModel = {}
    let searchModel = {}
    let model = Object.assign({}, searchModel)
    return {
      // 附带内容类型
      annexType: annexType,
      url: this.$api.weWork.welcomeCode.findList,
      model: model,
      quickSearchModel: quickSearchModel,
      _table: {
        table_buttons: tableButtons,
        operate_buttons: operateButtons,
        loadingtable: false
      }
    }
  },
  mounted () {
    if (typeof this.$init === 'function') {
      this.$init()
    } else {
      this.$reload()
    }
  },
  computed: {},
  methods: {
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
          }
        }).catch((resp) => {
          _this.$notify.error('删除失败')
        })
      })

      this.$emit('onDeleteFun', data)
    },
    /**
     * @msg: 转换附带内容类型 k-v
     * @param {Number} 附带内容类型值
     * @return: 附带内容类型名称
     */
    convertAnnexType (value) {
      return this.annexType.Collection[value]
    }
  }
}
