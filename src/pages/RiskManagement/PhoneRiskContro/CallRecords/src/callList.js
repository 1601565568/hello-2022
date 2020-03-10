import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import { getErrorMsg } from '@/utils/toast'
import NsTableColumnOperateButtonExt from '@/components/NsTableColumnOperateButton'

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
      deviceKeyOrPhone: null,
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
      }
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
    onRedactFun (row) {
      window.open(row.content)
    },
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
