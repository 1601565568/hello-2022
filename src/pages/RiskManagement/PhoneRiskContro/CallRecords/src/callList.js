import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import { getErrorMsg } from '@/utils/toast'
import NsTableColumnOperateButtonExt from '@/components/NsTableColumnOperateButton'
import callRecords from '../../../../../apis/riskManagement/callRecords'

export default {
  name: 'callList',
  mixins: [tableMixin],
  components: { NsTableColumnOperateButtonExt },
  props: {
    url: Object
  },
  data: function () {
    const tableButtons = [
      {
        'func': function (scope) {
          this.onRedactFun(scope.row)
        },
        'icon': '',
        'name': '听录音',
        'auth': ``,
        'visible': `!scope.row.content`
      },
      {
        'func': function (scope) {
          this.onDownLoad(scope.row)
        },
        'icon': '',
        'name': '下载录音',
        'auth': ``,
        'visible': `!scope.row.content`
      }
    ]
    let quickSearchModel = {}
    let searchModel = {
      deviceKey: null,
      deviceName: null,
      phone: null,
      account: null,
      mobile: null,
      time: [],
      startTime: null,
      endTime: null
    }
    let model = Object.assign({}, searchModel)
    return {
      model: model,
      quickSearchModel: quickSearchModel,
      _table: {
        table_buttons: tableButtons,
        quickSearchMap: {}
      },
      multipleSelection: [],
      select: true,
      bindDeviceDialog: {
        visible: false,
        guide: {}
      },
      memberManagePlan: 1,
      shopSelectUrl: this.$api.guide.shop.findBrandShopList,
      shopSelectOptions: []
    }
  },

  mounted: function () {
    if (typeof this.$init === 'function') {
    } else {
      this.$reload()
    }
    // this.initTableData()
  },
  computed: {},
  methods: {
    // initTableData () {
    //   var _this = this
    //   _this.$http.fetch(_this.$api.riskManagement.callRecords.findList, {
    //     start: 0, length: _this._data._pagination.size, searchMap: this.model
    //   }).then(resp => {
    //     if (resp.success === true && resp.result.data != null) {
    //       _this._data._table.data = resp.result.data
    //       _this._data._pagination.total = parseInt(resp.result.recordsTotal)
    //     }
    //   }).catch((resp) => {
    //     _this.$notify.error(getErrorMsg('查询失败', resp))
    //   })
    // },
    // handleSelectionChange (val) {
    //   this.$emit('handleSelectionChange', val)
    // },
    onDownLoad (data) {
      let _this = this
      _this.$http.fetch(_this.$api.riskManagement.callRecords.download, {
        url: data.content
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('下载失败', resp))
      })
    }
  }
}
