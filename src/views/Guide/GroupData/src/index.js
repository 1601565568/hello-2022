import tableMixin from 'web-crm/src/mixins/table'
import { getErrorMsg } from '@/utils/toast'
import Add from '../components/add'

export default {
  mixins: [tableMixin],
  components: { Add },
  data () {
    const that = this
    return {
      NoImg: '',
      url: this.$api.guide.groupData.table,
      _table: {
        operate_buttons: [
          {
            'func': function () {
              that.addDialog.visible = true
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
        ownerId: '',
        nick: '',
        displayname: '',
        isFriend: '',
        chatroomname: ''
      },
      filterGroup: '',
      groupTreeHeight: 0,
      groupList: [],
      addDialog: {
        visible: false
      }
    }
  },
  mounted () {
    this.groupTreeHeight = window.innerHeight - 130
    this.getWxGroup()
    this.$searchAction$()
  },
  watch: {
    filterGroup (value) {
      this.$refs.groupTree.filter(value)
    }
  },
  methods: {
    onFilterGroupNode (value, data) {
      if (!value) {
        return true
      }
      return data.label.indexOf(value) !== -1
    },
    onFilterGroup () {
      this.$refs.groupTree.filter(this.filterGroup)
    },
    onClickGroupNode (data) {
      this.model.ownerId = data.wid
      this.model.chatroomname = data.chatroomname
      this.$searchAction$()
    },
    searchAction () {

    },
    getWxGroup () {
      this.$http.fetch(this.$api.guide.groupData.getWxGroup).then(data => {
        this.groupList = Object.assign([], data.result)
      }).catch(error => {
        this.$notify.error(getErrorMsg('获取群聊出现异常', error))
      })
    },
    wordLimit: function (words) {
      return words.length > 10 ? words.substr(0, 9) + '...' : words
    },
    $resetInput () {
      const origin = this.$getOriginModel$()
      // 重置时不重置左侧已选择的个人号或群聊
      return Object.assign({}, origin, { wid: this.model.ownerId, chatroomname: this.model.chatroomname })
    }
  }
}
