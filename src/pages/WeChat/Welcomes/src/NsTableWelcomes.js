import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import { getErrorMsg } from '@/utils/toast'
import NsTableColumnOperateButtonExt from '@/components/NsTableColumnOperateButton'

export default {
  name: 'NsTableGuide',
  mixins: [tableMixin],
  components: { NsTableColumnOperateButtonExt },
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
          this.$emit('open-dialog', 'edit', '编辑智能欢迎语', scope.row.uuid)
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
        'visible': ``
      }
    ]
    var operateButtons = [
      {
        'func': function () {
          this.$emit('open-dialog', 'add', '新增智能欢迎语')
        },
        'icon': '$.noop',
        'name': '新增',
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
      'title': null
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
      multipleSelection: [],
      select: true
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
     * @msg: 查看欢迎语员工使用范围
     * @param {type} scope.row
     */
    onShowEmployeeScope (data) {
      this.$emit('onShowEmployeeScope', data)
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
        param.welcomeCodeUuid = data.uuid
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
    }
  }
}
