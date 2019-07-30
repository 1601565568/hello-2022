import tableMixin from 'web-crm/src/mixins/table'

export default {
  mixins: [tableMixin],
  props: {
    visible: Boolean,
    wxGroups: Array
  },
  data () {
    // const that = this
    return {
      sVisible: false,
      model: {},
      url: this.$api.guide.groupData.duplicateTable,
      _table: {
        operate_buttons: [
          // todo-zsf 暂无移出功能
          // {
          //   'func': function () {
          //   },
          //   'icon': '',
          //   'name': '批量移出',
          //   'auth': ``,
          //   'visible': ``
          // }
        ],
        table_buttons: [
          // todo-zsf 暂无移出功能
          // {
          //   'func': function () {
          //   },
          //   'icon': '',
          //   'name': '移出',
          //   'auth': ``,
          //   'visible': ``
          // }
        ]
      }
    }
  },
  watch: {
    visible (value) {
      this.sVisible = value
      if (value) {
        this.$searchAction$()
      }
    }
  },
  mounted () {
    this.sVisible = this.visible
  },
  methods: {
    onClose () {
      this.$emit('update:visible', false)
      this.$emit('update:wxGroups', [])
    },
    $handleParams (params) {
      let chatroomnames = []
      this.wxGroups.map(v => {
        chatroomnames.push(v.chatroomname)
      })
      params.searchBean = { chatroomnames }
      return params
    }
  }
}
