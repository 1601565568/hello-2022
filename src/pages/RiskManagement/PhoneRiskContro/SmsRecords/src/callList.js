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
        'visible': `scope.row.status !== 4`
      },
      {
        'func': function (scope) {
          this.onRedactFun(scope.row)
        },
        'icon': '',
        'name': '下载录音',
        'auth': ``,
        'visible': `scope.row.status !== 4`
      }
    ]
    let quickSearchModel = {}
    let searchModel = {
      deviceKey: null,
      deviceName: null,
      phone: null,
      account: null,
      mobile: null,
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
    setGuideStateNull () {
      this.model.status = null
    }
  }
}
