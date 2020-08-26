/*
 * @Descripttion: 使用员工组件
 * @Author: yuye.huang
 * @Date: 2020-03-09 13:55:17
 * @LastEditors: yuye.huang
 * @LastEditTime: 2020-06-17 14:43:00
 */
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'

export default {
  name: 'NsTableShopScope',
  props: {
    data: {
      type: Object,
      default () {
        return {
          welcomeCodeUuid: '',
          visible: false
        }
      }
    }
  },
  mixins: [tableMixin],
  data () {
    let model = {
      shopName: ''
    }
    return {
      _table: {
        searchMap: {},
        quickSearchMap: {}
      },
      model: model,
      url: this.$api.weChat.autoReply.findAutoReplyShopList
    }
  },
  mounted () {
    this.model = Object.assign({}, this.model, this.childData)
  },
  methods: {
  },
  computed: {
    childData: {
      get: function () {
        return this.data
      }
    }
  }
}
