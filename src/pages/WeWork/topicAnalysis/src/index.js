import ChatRecordList from '@/pages/Social/components/chatRecordList'
import ElDrawer from '@nascent/nui/lib/drawer'
import ItemDrawer from '../../components/ItemDrawer'
import packup from '../image/ns-arrow-packup.png'
import unfold from '../image/ns-arrow-unfold.png'
import nsAddBorder from '../image/ns-add-border.png'
import infiniteScroll from 'vue-infinite-scroll'
import moment from 'moment'
import AddKeyWordTopic from '../../components/addKeyWordTopic'
import AddKeyWord from '../../components/addKeyWord'
import Message from '../../components/message'
import { formatList, formatWeWorkChatData } from './format'
import NsNoData from '@nascent/ecrp-ecrm/src/components/NsNoData.vue'
import KeyWordList from '../components/KeyWordList.vue'
import ElBreadcrumb from '@nascent/nui/lib/breadcrumb'
import ElBreadcrumbItem from '@nascent/nui/lib/breadcrumb-item'
import MemberList from '../components/MemberList.vue'
export default {
  directives: { infiniteScroll },
  components: {
    ChatRecordList,
    ElDrawer,
    ItemDrawer,
    AddKeyWordTopic,
    AddKeyWord,
    Message,
    NsNoData,
    KeyWordList,
    ElBreadcrumb,
    ElBreadcrumbItem,
    MemberList
  },
  data () {
    let _that = this
    return {
      packup,
      unfold,
      nsAddBorder,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now() // 禁止选择以后的时间
        }
      },
      unfoldAndStow: true, // 展开收起
      time: '', // 时间
      listParams: {
        // 话题列表请求参数
        start: 0,
        time: '',
        length: 15,
        name: ''
      },
      list: [], // 话题列表
      keyWordsVoList: [], // 关键词列表
      listIsScroll: true, // 敏感词列表加载更多
      getListMore: true, // 是否还有更多
      // 分页配置
      pagination: {
        size: 15,
        sizeOpts: [15, 25, 50, 100],
        page: 1,
        total: 0
      },
      select: null, // 切换话题列表选中状态
      keyWordId: null,
      selectKeyWordId: null, // 切换关键字选中状态
      cantRequest: false,
      getContentListTime: null, // 防抖处理
      topicId: null,
      delType: 1, // 1 删除话题列表  2 删除关键字
      text: '', // 删除弹窗文案
      drawer: false, // 查看聊天记录侧边栏
      table: {
        loading: false,
        tableData: []
      },
      tableParams: {
        id: '',
        time: '',
        start: 0,
        length: 15
      },
      keyWordVoListReq: {
        time: '',
        start: 0,
        length: 20,
        topicId: null
      },
      WeWorkChatParam: {
        chatDateTime: '', // 聊天日期时间
        sender: '', // 聊天发起人
        seq: 0, // 企微聊天序列
        tolist: '', // 聊天接收人
        type: 1 // 1拉取历史数据 2拉取最新数据
      },
      weWorkChatData: [],
      userInfo: {},
      isDetails: false,
      memberData: {
        word: '',
        topicId: null
      }
    }
  },
  computed: {
    ml () {
      return this.unfoldAndStow ? 'template-page__right_content' : ''
    }
  },
  created () {
    window.addEventListener('resize', this.setHeight)
    this.init()
  },
  mounted () {
    this.setHeight()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.setHeight)
  },
  methods: {
    /**
     * 页面初始化
     */
    async init () {
      this.listLoading = true
      this.keyWordsVoListLoding = true
      this.table.loading = true
      this.getDate()
      this.getKeyWordTopicList()
    },
    /**
     * 输入框搜索
     */
    onSearch () {
      this.list = []
      this.keyWordsVoList = []
      this.table.tableData = []
      this.listParams.start = 0
      this.select = null
      this.selectKeyWordId = null
      this.getKeyWordTopicList()
    },
    /**
     * 获取当天日期
     */
    getDate () {
      const nowDate = new Date()
      this.time = moment(nowDate).format('YYYY-MM-DD')
      this.tableParams.time = this.time
      this.listParams.time = this.time
    },
    /**
     * 日期时间修改
     */
    handlerChangeTime (data) {
      if (data) {
        this.tableParams.time = data
        this.listParams.time = data
        // 更新关键词列表数量
        this.onChangeList()
      } else {
        const nowDate = new Date()
        this.time = moment(nowDate).format('YYYY-MM-DD')
      }
    },
    /**
     * 话题列表加载更多
     */
    handlerScroll () {
      console.log(!this.listIsScroll && this.getListMore, '!this.listIsScroll && this.getListMore')
      if (!this.listIsScroll && this.getListMore) {
        this.listIsScroll = true
        this.listParams.start = this.listParams.start + this.listParams.length
        this.getKeyWordTopicList(true)
      }
    },
    /**
     * 获取话题列表
     */
    getKeyWordTopicList (noLoding) {
      if (!noLoding) {
        this.listLoading = true
      }
      // 清空数据
      // this.keyWordsVoList = []
      // this.table.tableData = []
      // this.select = null
      // this.selectKeyWordId = null
      // 请求 话题列表
      this.$http
        .fetch(
          this.$api.weWork.topicAnalysis.getKeyWordTopicList,
          this.listParams
        )
        .then(res => {
          this.list = this.list.concat(formatList(res.result))
          this.listLoading = false
          this.listIsScroll = false
          if (this.select === null && this.list.length > 0) {
            // 默认选中第一个
            let def = this.list[0] && this.list[0].topicId ? this.list[0] : null
            this.onChangeList(def)
          }
          if (!res.result || res.result.length < 1) {
            this.keyWordsVoListLoding = false
            this.table.loading = false
          }
          if (res.result.length < this.listParams.length) {
            this.getListMore = false
          } else {
            this.getListMore = true
          }
        })
        .catch(err => {
          this.$notify.error(err.msg || '获取话题列表失败')
          this.listLoading = false
          this.listIsScroll = false
        })
    },
    /**
     * 话题列表切换 || 关键词列表
     * @param {Object} // i 列表某一项
     */
    onChangeList (i) {
      if (this.cantRequest) {
        return
      }
      this.cantRequest = true
      // 话题列表
      this.keyWordsVoListLoding = true
      this.table.loading = true
      if (i) {
        this.select = i.topicId
        // 查询详情列表和数量
        this.keyWordVoListReq.topicId = i.topicId
      }
      this.keyWordVoListReq.time = this.time
      this.$http
        .fetch(
          this.$api.weWork.topicAnalysis.getKeyWordTopicList,
          this.keyWordVoListReq
        ).then(res => {
          this.cantRequest = false
          let response = res.result
          this.keyWordsVoList = response.length > 0 ? response[0].keyWordsVoList : []
          let defItem =
            this.keyWordsVoList[0] && this.keyWordsVoList[0].keyWordId
              ? this.keyWordsVoList[0]
              : null
          // 没有关键字列表
          this.keyWordsVoListLoding = false
          if (defItem === null) {
            this.table.loading = false
            this.table.tableData = []
            this.selectKeyWordId = null
            return
          }
          this.selectKeyWord(defItem)
        }).catch(error => {
          this.cantRequest = false
          this.keyWordsVoListLoding = false
          this.table.loading = false
          this.$notify.error(error.msg)
        })
      this.$refs.keyWordList.fetch({ topicId: this.select })
    },
    /**
     * 新增话题弹窗
     */
    addKeyWordTopic () {
      this.$refs.addKeyWordTopic.onShow()
    },
    /**
     * 新增关键字弹窗
     */
    addKeyWordDialog () {
      this.$refs.addKeyWord.onShow()
    },
    /**
     * 新增话题弹窗确认
     * @param {Object} // data 弹窗回传的对象
     */
    add (data, cb) {
      if (this.listLoading) {
        return
      }
      if (cb) {
        cb(data)
      }
      this.listLoading = true
      this.keyWordsVoListLoding = true
      this.$http
        .fetch(this.$api.weWork.topicAnalysis.addKeyWordTopic, data)
        .then(res => {
          if (res.success) {
            this.$notify.success(res.msg)
            this.onSearch()
          }
        })
        .catch(err => {
          this.$notify.error(err.msg || '新增话题异常')
          this.listLoading = false
          this.keyWordsVoListLoding = false
        })
    },
    /**
     * 新增关键词弹窗确认
     * @param {Object} // data 弹窗回传的对象
     */
    addKeyWord (data) {
      this.$http
        .fetch(this.$api.weWork.topicAnalysis.addKeyWord, data)
        .then(res => {
          if (res.success) {
            this.$notify.success(res.msg)
            this.keyWordsVoList = []
            this.table.tableData = []
            this.selectKeyWordId = null
            // 话题列表请求参数页码
            this.listParams.start = 0
            this.onChangeList()
          }
        })
        .catch(err => {
          this.$notify.error(err.msg || '新增关键词异常')
        })
    },
    /**
     * 删除弹窗
     * @param {number} // delType 删除类型
     * @param {string} // content 提示文案
     * @param {number} // Id 删除的标识
     */
    del (delType, content, Id) {
      this.delType = delType
      if (delType === 1) {
        this.text = `确定要删除话题“${content}”吗？`
        this.topicId = Id
      } else {
        this.text = `确定要删除关键词“${content}”吗？`
        this.keyWordId = Id
      }
      this.$refs.message.show()
    },
    /**
     * 删除确认事件
     */
    messageConfirm () {
      if (this.delType === 1) {
        this.deleteKeyWordTopic()
      } else {
        this.deleteKeyWord()
      }
    },
    /**
     * 删除话题
     * PS:会触发滚动事件
     */
    deleteKeyWordTopic () {
      this.listIsScroll = true
      this.$http
        .fetch(this.$api.weWork.topicAnalysis.deleteKeyWordTopic, {
          topicId: this.topicId
        })
        .then(res => {
          if (res.success) {
            this.$notify.success(res.msg)
            this.list = []
            this.keyWordsVoList = []
            this.select = null
            this.selectKeyWordId = null
            // 话题列表请求参数页码
            this.listParams.start = 0
            this.getKeyWordTopicList()
          }
        })
        .catch(err => {
          this.$notify.error(err.msg || '删除话题异常')
        })
    },
    /**
     * 删除关键字
     */
    deleteKeyWord () {
      this.$http
        .fetch(this.$api.weWork.topicAnalysis.deleteKeyWord, {
          topicId: this.select,
          keyWordId: this.keyWordId
        })
        .then(res => {
          if (res.success) {
            this.$notify.success(res.msg)
            this.keyWordsVoList = []
            this.selectKeyWordId = null
            this.onChangeList()
          }
        })
        .catch(err => {
          this.$notify.error(err.msg || '删除关键词异常')
        })
    },
    /**
     * 获取明细
     */
    getContentList () {
      if (this.cantRequest) {
        return
      }
      this.cantRequest = true
      this.table.loading = true
      this.$http
        .fetch(this.$api.weWork.topicAnalysis.contentList, this.tableParams)
        .then(res => {
          if (res.success) {
            this.table.tableData = res.result.data
            this.pagination.total = parseInt(res.result.recordsTotal)
            this.table.loading = false
            this.cantRequest = false
          }
        })
        .catch(err => {
          this.$notify.error(err.msg || '列表获取失败')
          this.table.loading = false
          this.cantRequest = false
        })
    },
    /**
     * 获取table列表详情
     *  @param {object}
     */
    getContext (row) {
      // todo 补全员工姓名
      this.userInfo.userName = row.topicName
      console.log(row, 'rowwwww')
      if (this.cantRequest) {
        return
      }
      this.cantRequest = true
      this.WeWorkChatParam = {
        chatDateTime: this.time,
        sender: row.sender,
        seq: row.seq,
        tolist: row.tolist,
        roomid: row.roomid ? row.roomid : '',
        type: 1,
        before: 10,
        after: 2
      }
      this.$http
        .fetch(this.$api.weWork.sensitiveWords.context, this.WeWorkChatParam)
        .then(res => {
          this.weWorkChatData = formatWeWorkChatData(res.result)
          this.drawer = true
          this.cantRequest = false
        })
        .catch(err => {
          this.cantRequest = false
          this.$notify.error(err.msg || '查询失败')
        })
    },
    /**
     * 聊天记录加载最新的数据
     */
    async getMore () {
      const data = this.WeWorkChatParam
      this.WeWorkChatParam = {
        chatDateTime: data.chatDateTime,
        sender: data.sender,
        tolist: data.tolist,
        roomid: data.roomid ? data.roomid : '',
        seq: this.weWorkChatData[this.weWorkChatData.length - 1].seq,
        type: 2
      }
      let arr = await this.requestWeWorkChatDataToDb()
      if (arr.length === 0) {
        this.$notify.error('暂无最新的记录，请稍后再试')
      }
      this.weWorkChatData.push(...arr)
    },
    /**
     * 聊天记录顶部加载更多历史数据
     */
    async handleScrollTop () {
      const data = this.WeWorkChatParam
      this.WeWorkChatParam = {
        chatDateTime: data.chatDateTime,
        sender: data.sender,
        tolist: data.tolist,
        roomid: data.roomid ? data.roomid : '',
        seq: this.weWorkChatData[0].seq,
        type: 1
      }
      let arr = await this.requestWeWorkChatDataToDb()
      this.weWorkChatData.unshift(...arr.reverse())
    },
    /**
     * 拉取企业微信最新聊天数据
     */
    requestWeWorkChatDataToDb () {
      return new Promise(resolve => {
        this.$http
          .fetch(
            this.$api.marketing.chatRecord.getWeWorkChatDataToDb,
            this.WeWorkChatParam
          )
          .then(res => {
            if (res.success) {
              const arr = res.result || []
              resolve(formatWeWorkChatData(arr))
            }
          })
          .catch(err => {
            this.$notify.error(err.msg)
          })
      })
    },
    /**
     * 关闭弹窗
     */
    handleClose () {
      this.drawer = false
    },
    /**
     * 二级列表展开收起
     */
    handlerUnfoldAndStow () {
      this.unfoldAndStow = !this.unfoldAndStow
    },
    /**
     * 切换关键字
     * @param {Object} // item 关键字列表每一项
     */
    selectKeyWord (item) {
      if (item) {
        this.selectKeyWordId = item.keyWordId
      }
      this.tableParams.start = 0
      this.tableParams.id = this.selectKeyWordId
      this.table = {
        loading: true,
        tableData: []
      }
      this.getContentList()
    },
    /**
     * 每页条数发生变化
     */
    handleSizeChange (size) {
      if (this.tableParams.id) {
        this.pagination.page = 1
        this.tableParams.length = size
        this.tableParams.start = 0
        this.getContentList()
      }
    },
    /**
     * 页码发生变化
     */
    handlePageChange (page) {
      if (this.tableParams.id) {
        this.tableParams.start = (page - 1) * this.tableParams.length
        this.getContentList()
      }
    },
    setHeight: function () {
      // this.$nextTick(() => {
      // let extraHeight = this.$refs.fullScreen.$el.getBoundingClientRect().top || 0
      // this.$refs.fullScreen.$el.children[0].style.maxHeight = window.innerHeight - extraHeight - 38 + 'px'
      let limitHeight = window.innerHeight - 16 - 20 - this.$refs.loadMoreWrapper.getBoundingClientRect().top
      this.$refs.loadMoreWrapper.style.height = limitHeight + 'px'
      // let loadMoreWrapperChildren = window.innerHeight - 16 - 20 - this.$refs.loadMoreWrapperChildren.getBoundingClientRect().top
      // this.$refs.loadMoreWrapperChildren.style.height = loadMoreWrapperChildren + 'px'
      // })
    },
    handleRowJump (params) {
      if (params) {
        let { word, keyWordId } = params
        this.memberData = { word, keyWordId }
        this.$refs.memberList.fetchList({ keyWordId })
      }
      this.isDetails = !this.isDetails
    }
  }
}
