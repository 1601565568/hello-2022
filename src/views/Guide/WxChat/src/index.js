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
    let that = this
    return {
      model: {
        srhDate: [this.getStartDate(-30), this.getEndDate(new Date())],
        ownerId: null,
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
            picker.$emit('pick', [that.getStartDate(-7), that.getEndDate(new Date())])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            picker.$emit('pick', [that.getStartDate(-30), that.getEndDate(new Date())])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            picker.$emit('pick', [that.getStartDate(-90), that.getEndDate(new Date())])
          }
        }]
      },
      ownerData: [],
      url: this.$api.guide.wxChat.findTargetList,
      targetList: [],
      currTargetIndex: null,
      dialogVisible: false,
      chatList: [],
      isChatLoadEnd: false,
      isContentDiabled: true,
      targetLoading: false,
      chatLoading: false,
      btnSearchDisabled: false
    }
  },
  methods: {
    getStartDate (addDay) {
      let date = new Date(new Date().toLocaleDateString())
      date.setTime(date.getTime() + 3600 * 1000 * 24 * addDay)
      return date
    },
    getEndDate (date) {
      return new Date(new Date(date.toLocaleDateString()).getTime())
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
      // 加载聊天时不能点击
      if (this.chatLoading) {
        return false
      }
      this.currTargetIndex = index
      // 清空并加载数据
      this.loadChatLog(true)
    },
    loadChatLog (isClear) {
      let _this = this
      let target = this.targetList[this.currTargetIndex]
      let param = {
        startTime: this.searchedModel.srhDate[0],
        endTime: this.searchedModel.srhDate[1],
        ownerId: target.ownerId,
        talker: target.talker,
        content: this.searchedModel.content,
        start: isClear ? 0 : this.chatList.length
      }

      this.chatLoading = true
      this.$http.fetch(this.$api.guide.wxChat.findChatList, param).then(resp => {
        if (isClear) {
          _this.chatList = []
        }
        for (let row of resp.result) {
          _this.chatList.unshift(row)
        }
        _this.isChatLoadEnd = resp.result.length < 10
        _this.chatLoading = false
        if (isClear && this.chatList.length > 0) {
          // 定位
          // console.warn(this.$refs.fullScreenright)
          // console.warn(this.$refs.fullScreenright.$el.chatLog0)

          // this.$refs['fullScreenright'].wrap.scrollTop = document.getElementById('chatLog_0').offsetTop
        }
        _this.btnSearchDisabled = false
      })
    },
    isChatLeft (receive) {
      return receive
    },
    widChanged () {
      this.isContentDiabled = this.model.wid === null || this.model.wid === ''
      if (this.isContentDiabled) {
        this.model.content = ''
      }
    },
    search () {
      let _this = this
      // 日期格式转换
      this.model.srhDate = [moment(this.model.srhDate[0]).format('YYYY-MM-DD'), moment(this.model.srhDate[1]).format('YYYY-MM-DD')]
      this.searchedModel = this.model
      this.searchedModel.startTime = this.model.srhDate[0]
      this.searchedModel.endTime = this.model.srhDate[1]

      // 查询
      this.chatList = []
      this.targetLoading = true
      this.btnSearchDisabled = true
      this.$http.fetch(this.$api.guide.wxChat.findTargetList, this.searchedModel).then(resp => {
        _this.targetLoading = false
        _this.isChatLoadEnd = false
        _this.targetList = resp.result
        if (_this.targetList.length > 0) {
          _this.clickTarget(0)
        } else {
          _this.chatList = []
          _this.isChatLoadEnd = true
        }
        this.btnSearchDisabled = false
      })
    },
    reset () {
      this.model.srhDate = [this.getStartDate(-30), this.getEndDate(new Date())]
      this.model.ownerId = null
      this.model.content = null
      this.search()
    },
    getHourMinitue (datetime) {
      return datetime.substr(10, 6)
    },
    /**
     * 计算主要显示窗口的高度，动态设置页面内主要内容的高度
     */
    setHeight: function () {
      /**  15px为顶部表单上面的间距和左右内容的标题上面的间距 **/
      const BTN_TITLE = 50 // 左右内容的标题的高度
      let limitHeight = window.innerHeight -
        document.getElementsByClassName('nav')[0].offsetHeight -
        BTN_TITLE - document.getElementsByClassName('talk-chat__form')[0].offsetHeight - 30
      if (limitHeight < 400) {
        limitHeight = 400
      }
      this.$refs.fullScreen.$el.children[0].style.maxHeight = limitHeight + 'px'
      this.$refs.fullScreenright.$el.children[0].style.maxHeight = limitHeight + 'px'
    }
  },
  // 初始化
  mounted: function () {
    this.$nextTick(() => {
      this.setHeight()
      window.addEventListener('resize', () => {
        this.setHeight()
      })
    })
    this.loadPrivateAccount()
    this.search()
  }
}
