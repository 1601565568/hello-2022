import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import { getErrorMsg } from '@/utils/toast'

export default {
  name: 'TableFriendCnt',
  mixins: [tableMixin],
  data: function () {
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
      url: this.$api.weChat.welcomes.findList,
      model: model,
      quickSearchModel: quickSearchModel,
      _table: {
        quickSearchNames: quickSearchNames,
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
