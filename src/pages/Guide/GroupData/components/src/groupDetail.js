import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import { NO_IMG_BIG } from '@/utils/constants'

export default {
  mixins: [tableMixin],
  props: {
    visible: Boolean,
    groupDetail: Object
  },
  data () {
    return {
      NO_IMG_BIG,
      sVisible: false,
      url: this.$api.guide.groupData.groupDetailTable,
      model: {
        ownerId: '',
        chatroomname: ''
      },
      _order: {
        orderDir: 'desc',
        orderKey: 'm.update_time'
      }
    }
  },
  watch: {
    visible (value) {
      if (value) {
        this.model = Object.assign({}, {
          chatroomname: this.groupDetail.chatroomname,
          roomowner: this.groupDetail.roomowner
        })
        this.$searchAction$()
      }
      this.sVisible = value
    }
  },
  mounted () {
    this.sVisible = this.visible
  },
  methods: {
    onClose () {
      this.model = {}
      this.$emit('update:visible', false)
      this.$emit('update:groupDetail', {})
      this._data._pagination.page = 1
      this._data._table.data = []
    }
  }
}
