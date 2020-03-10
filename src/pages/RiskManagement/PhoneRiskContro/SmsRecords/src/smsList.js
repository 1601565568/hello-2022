import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import NsTableColumnOperateButtonExt from '@/components/NsTableColumnOperateButton'

export default {
  name: 'callList',
  mixins: [tableMixin],
  components: { NsTableColumnOperateButtonExt },
  props: {
    url: Object
  },
  data: function () {
    let quickSearchModel = {}
    let searchModel = {
      deviceKey: null,
      deviceName: null,
      phone: null,
      account: null,
      mobile: null,
      content: null,
      sendStatus: null,
      deviceKeyOrPhone: null,
      time: []
    }
    let model = Object.assign({}, searchModel)
    return {
      model: model,
      quickSearchModel: quickSearchModel,
      _table: {
        quickSearchMap: {}
      },
      multipleSelection: [],
      select: true,
      bindDeviceDialog: {
        visible: false,
        guide: {}
      },
      memberManagePlan: 1
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
    setGuideStateNull () {
      this.model.status = null
    }
  }
}
