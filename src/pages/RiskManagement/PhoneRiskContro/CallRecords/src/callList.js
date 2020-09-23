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
          this.$emit('onPlay', scope.row)
        },
        'name': '听录音',
        'visible': `scope.row.content !== null && scope.row.content !== ''`
      },
      {
        'name': '-',
        'visible': `scope.row.content === null || scope.row.content === ''`
      },
      {
        'func': function (scope) {
          this.$emit('onDownLoad', scope.row)
        },
        'name': '下载录音',
        'visible': `scope.row.content !== null && scope.row.content !== ''`
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
  }
}
