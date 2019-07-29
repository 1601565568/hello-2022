import ElContainer from 'nui-v2/lib/container'
import ElMain from 'nui-v2/lib/main'
import ElAside from 'nui-v2/lib/aside'
import tableMixin from 'web-crm/src/mixins/table'
import moment from 'moment'

export default {
  components: {
    ElContainer,
    ElMain,
    ElAside
  },
  mixins: [tableMixin],
  data () {
    return {
      model: {
        srhDate: [this.getDateFromToday(-30), new Date()],
        wid: null,
        content: null
      },
      // 保存查询条件,用于聊天查询
      searchedModel: {
        srhDate: [],
        wid: null,
        content: null
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            picker.$emit('pick', [this.getDateFromToday(-7), new Date()])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            picker.$emit('pick', [this.getDateFromToday(-30)])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            picker.$emit('pick', [this.getDateFromToday(-90), new Date()])
          }
        }]
      },
      ownerData: [],
      url: this.$api.guide.wxChat.findTargetList,
      targetList: [],
      currTargetIndex: null,
      dialogVisible: false,
      chatList: [],
      isChatLoadEnd: false
    }
  },
  methods: {
    getDateFromToday (addDay) {
      let date = new Date()
      date.setTime(date.getTime() + 3600 * 1000 * 24 * addDay)
      return date
    },
    loadPrivateAccount () {
      let _this = this
      this.$http.fetch(this.$api.guide.wxDeviceGuideRelation.findWidNickSelector).then(resp => {
        if (resp.success && resp.result != null) {
          _this.ownerData = resp.result
        }
      })
    },
    isCurrTarget (index) {
      return index === this.currTargetIndex
    },
    clickTarget (index) {
      this.currTargetIndex = index
      // 清空并加载数据
      this.chatList = []
      this.loadChatLog()
    },
    loadChatLog () {
      let _this = this
      let target = this.targetList[this.currTargetIndex]
      let param = {
        startTime: this.searchedModel.srhDate[0],
        endTime: this.searchedModel.srhDate[1],
        ownerId: target.ownerId,
        talker: target.talker,
        content: this.searchedModel.content,
        start: this.chatList.length
      }

      this.$http.fetch(this.$api.guide.wxChat.findChatList, param).then(resp => {
        _this.loading = false
        _this.chatList = resp.result
        if (resp.result.length === 0) {
          _this.isChatLoadEnd = true
        }
      })
    },
    isChatLeft (revieve) {
      return !revieve
    },
    search () {
      let _this = this
      // 日期格式转换
      this.model.srhDate = [moment(this.model.srhDate[0]).format('YYYY-MM-DD HH:mm:ss'), moment(this.model.srhDate[1]).format('YYYY-MM-DD HH:mm:ss')]
      this.searchedModel = this.model
      _this.loading = true
      this.$http.fetch(this.$api.guide.wxChat.findTargetList, this.model).then(resp => {
        _this.loading = false
        _this.targetList = resp.result
        if (_this.targetList.length > 0) {
          _this.clickTarget(0)
        }
      })
    },
    reset () {
      this.model.srhDate = [this.getDateFromToday(-30), new Date()]
      this.model.wid = null
      this.model.content = null
      this.search()
    },
    getHourMinitue (datetime) {
      return datetime.substr(10, 6)
    }
  },
  // 初始化
  mounted: function () {
    this.loadPrivateAccount()
    this.search()
  }
}
