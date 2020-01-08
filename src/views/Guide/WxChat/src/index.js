import ElContainer from '@nascent/nui/lib/container'
import ElMain from '@nascent/nui/lib/main'
import ElAside from '@nascent/nui/lib/aside'
import ElImage from '@nascent/nui/lib/image'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import moment from 'moment'

export default {
  components: {
    ElContainer,
    ElMain,
    ElAside,
    ElImage
  },
  mixins: [tableMixin],
  data () {
    let that = this
    return {
      model: {
        srhDate: [this.getStartDate(-30), this.getEndDate(new Date())],
        ownerId: null,
        content: null,
        id: null,
        createTime: null
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
      contentList: [],
      isChatLoadEnd: false,
      targetLoading: false,
      chatLoading: false,
      contentLoading: false,
      btnSearchDisabled: false,
      dialogVisibleSearcher: false,
      btnSearchContentDisabled: false,
      currentOwner: { wid: null, name: null, head: '' },
      contentKeyWord: null,
      contentSearchKeyWord: null,
      isContentDisabled: true
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
      let endTime = this.searchedModel.srhDate[1]
      let id = this.searchedModel.id
      let createTime = this.searchedModel.createTime
      let content = this.searchedModel.content
      if (!isClear) {
        let firstRecord = this.chatList[0]
        endTime = firstRecord.createTime
        id = firstRecord.id
        content = null
        createTime = null
      }

      let param = {
        startTime: this.searchedModel.srhDate[0],
        endTime: endTime,
        ownerId: target.ownerId,
        talker: target.talker,
        content: content,
        start: 0,
        id: id,
        createTime: createTime
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
          if (this.searchedModel.id !== null) {
            // 按内容查询需要定位
            setTimeout(_this.locateContent, 500)
          }
        }
        _this.btnSearchDisabled = false
      })
    },
    locateContent () {
      let id = this.searchedModel.id
      this.$refs['fullScreenright'].wrap.scrollTop = document.getElementById('chatLog_' + id).offsetTop
    },
    isChatLeft (receive) {
      return receive
    },
    widChanged () {
      this.isContentDisabled = this.model.ownerId === null || this.model.ownerId === ''
      if (this.isContentDisabled) {
        this.model.content = ''
      }
    },
    search () {
      if (this.model.content !== '' && this.model.content !== null) {
        if (this.model.ownerId === '' || this.model.ownerId === null) {
          this.$notify.warning('请选择个人号')
          return
        }
        this.showContentDlg()
      } else {
        // 清除隐藏条件
        this.model.id = null
        this.model.createTime = null
        this.searchChat()
      }
    },
    showContentDlg () {
      // 个人号信息
      this.currentOwner = this.ownerData.find((value, index, arr) => {
        return value.wid === this.model.ownerId
      })
      this.dialogVisibleSearcher = true
      this.contentKeyWord = this.model.content
      // 查询包含内容的聊天记录
      this.searchByContent()
    },
    // 按内容查询
    searchByContent () {
      if (this.contentKeyWord === '' || this.contentKeyWord === undefined) {
        this.$notify.error('请输入查询内容！')
        return
      }
      let _this = this
      // 日期格式转换
      this.model.srhDate = [moment(this.model.srhDate[0]).format('YYYY-MM-DD'), moment(this.model.srhDate[1]).format('YYYY-MM-DD')]
      this.searchedModel = Object.assign({}, this.model)
      this.searchedModel.content = this.contentKeyWord
      this.contentSearchKeyWord = this.contentKeyWord
      this.searchedModel.startTime = this.searchedModel.srhDate[0]
      this.searchedModel.endTime = this.searchedModel.srhDate[1]
      this.searchedModel.id = null
      this.contentList = []
      this.contentLoading = true
      this.btnSearchContentDisabled = true
      this.$http.fetch(this.$api.guide.wxChat.findByContent, this.searchedModel).then(resp => {
        _this.contentList = resp.result
        _this.contentLoading = false
        _this.btnSearchContentDisabled = false
      })
    },
    // 普通查询
    searchChat () {
      // 日期格式转换
      this.model.srhDate = [moment(this.model.srhDate[0]).format('YYYY-MM-DD'), moment(this.model.srhDate[1]).format('YYYY-MM-DD')]
      this.searchedModel = this.model
      this.searchedModel.startTime = this.model.srhDate[0]
      this.searchedModel.endTime = this.model.srhDate[1]

      let _this = this
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
        _this.btnSearchDisabled = false
      })
    },
    reset () {
      this.model.srhDate = [this.getStartDate(-30), this.getEndDate(new Date())]
      this.model.ownerId = null
      this.model.content = null
      this.search()
    },
    getHourMinute (datetime) {
      return datetime.substr(10, 6)
    },
    /**
     * 关键字高亮
     * @param content
     */
    renderContent (content) {
      return content.replace(this.contentSearchKeyWord, '<span><font color=\'#0091FA\'>' + this.contentSearchKeyWord + '</font></span>')
    },
    /**
     * 点击聊天记录，定位
     */
    locateKeyWord (id, createTime) {
      // 设置隐藏查询参数
      // 关闭窗口
      this.dialogVisibleSearcher = false
      this.model.id = id
      this.model.createTime = createTime
      this.searchChat()
    },
    /**
     * 计算主要显示窗口的高度，动态设置页面内主要内容的高度
     */
    setHeight: function () {
      const BTN_TITLE = 41 // 左右内容的标题的高度
      let limitHeight = window.innerHeight -
        document.getElementsByClassName('nav')[0].offsetHeight -
        BTN_TITLE - document.getElementsByClassName('talk-chat__form')[0].offsetHeight - 20
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
  },
  watch: {
    dialogVisibleSearcher () {
      if (this.dialogVisibleSearcher) {
        this.contentKeyWord = this.model.content
      } else {
        this.model.content = this.contentKeyWord
      }
    }
  }
}
