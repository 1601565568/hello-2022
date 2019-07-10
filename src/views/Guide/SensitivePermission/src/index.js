import moment from 'moment/moment'
import tableMixin from 'web-crm/src/mixins/table'
import NsDatetime from 'web-crm/src/components/NsDatetime'
import { getErrorMsg } from '@/utils/toast'
import Detail from '../components/Detail'

export default {
  mixins: [tableMixin],
  components: { NsDatetime, Detail },
  data () {
    const that = this
    return {
      url: this.$api.guide.sensitivePermission.table,
      _queryConfig: {
        expand: true
      },
      model: {
        times: [],
        ownerId: ''
      },
      defButton: 7,
      quickMode: false,
      privateAccountSelect: [],
      _table: {
        table_buttons: [
          {
            'func': function () {
              that.detailDialog.visible = true
            },
            'icon': '',
            'name': '查看详情',
            'auth': ``,
            'visible': ``
          }
        ]
      },
      _order: {
        orderDir: 'desc',
        orderKey: 'sum_quantity'
      },
      detailDialog: {
        visible: false
      }
    }
  },
  mounted () {
    this.todayTime(7)
    this.initPrivateAccount()
    this.$searchAction$()
  },
  watch: {
    'model.times' () {
      if (!this.quickMode) {
        this.defButton = -1
      } else {
        this.quickMode = false
      }
    }
  },
  methods: {
    todayTime (type) {
      this.defButton = type
      this.quickMode = true
      this.model.times = [moment().subtract(type, 'days').format('YYYY-MM-DD HH:mm:ss'), type === 1 ? moment().subtract(type, 'days').format('YYYY-MM-DD HH:mm:ss') : moment().format('YYYY-MM-DD HH:mm:ss')]
    },
    initPrivateAccount () {
      this.$http.fetch(this.$api.guide.wxPrivateAccount.listLite, {}).then(data => {
        this.privateAccountSelect = Object.assign([], data.result)
      }).catch(error => {
        this.$notify.error(getErrorMsg('获取个人号列表出现异常', error))
      })
    },
    $resetInput () {
      this.defButton = 7
      this.todayTime(7)
    }
  }
}
