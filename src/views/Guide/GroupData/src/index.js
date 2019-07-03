import tableMixin from 'web-crm/src/mixins/table'
import { getErrorMsg } from '@/utils/toast'

export default {
  mixins: [tableMixin],
  data () {
    return {
      _table: {
        operate_buttons: [
          {
            'func': function () {
            },
            'icon': '',
            'name': '新建群聊',
            'auth': ``,
            'visible': ``
          },
          {
            'func': function () {
            },
            'icon': '',
            'name': '重复群成员筛选',
            'auth': ``,
            'visible': ``
          }
        ],
        table_buttons: [
          {
            'func': function (scope) {
            },
            'icon': '',
            'name': '聊天',
            'auth': ``,
            'visible': ``
          },
          {
            'func': function (scope) {
            },
            'icon': '',
            'name': '详情',
            'auth': ``,
            'visible': ``
          }
        ]
      },
      model: {
        wid: '',
        nick: '',
        displayname: '',
        isFriend: ''
      },
      filterGroup: '',
      groupTreeHeight: 0,
      groupList: []
    }
  },
  mounted () {
    this.groupTreeHeight = window.innerHeight - 130
    this.getWxGroup()
  },
  methods: {
    onFilterGroupNode () {

    },
    onClickGroupNode () {
    },
    searchAction () {

    },
    getWxGroup () {
      this.$http.fetch(this.$api.guide.groupData.getWxGroup).then(data => {
        console.log(data)
      }).catch(error => {
        this.$notify.error(getErrorMsg('获取群聊出现异常', error))
      })
    }
  }
}
