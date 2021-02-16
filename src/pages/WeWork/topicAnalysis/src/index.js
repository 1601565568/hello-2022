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
export default {
  directives: { infiniteScroll },
  components: {
    ChatRecordList,
    ElDrawer,
    ItemDrawer,
    AddKeyWordTopic,
    AddKeyWord,
    Message
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
      WeWorkChatParam: {
        chatDateTime: '', // 聊天日期时间
        sender: '', // 聊天发起人
        seq: 0, // 企微聊天序列
        tolist: '', // 聊天接收人
        type: 1 // 1拉取历史数据 2拉取最新数据
      },
      weWorkChatData: []
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
      this.table.loading = true
      this.getDate()
      this.getKeyWordTopicList()
    },
    /**
     * 输入框搜索
     */
    onSearch () {
      this.list = []
      this.select = null
      this.keyWordsVoList = []
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
    },
    /**
     * 日期时间修改
     */
    handlerChangeTime (data) {
      if (data) {
        // const currentTime = that.time
        const now = new Date()
        const threeMonths = 60 * 60 * 1000 * 24 * 90
        if (now.getTime() > new Date(data).getTime() + threeMonths) {
          this.$notify.error('只能选择三个月之内的时间')
          return
          // return time.getTime() > data.getTime() + threeMonths
        }
        this.tableParams.time = data
        this.getContentList()
      } else {
        const nowDate = new Date()
        this.time = moment(nowDate).format('YYYY-MM-DD')
      }
    },
    /**
     * 话题列表加载更多
     */
    handlerScroll () {
      if (!this.listIsScroll && this.getListMore) {
        this.listIsScroll = true
        this.listParams.start = this.model.start + this.model.length
        this.getKeyWordTopicList()
      }
    },
    /**
     * 获取话题列表
     */
    getKeyWordTopicList () {
      this.listLoading = true
      this.$http
        .fetch(
          this.$api.weWork.topicAnalysis.getKeyWordTopicList,
          this.listParams
        )
        .then(res => {
          this.list = this.list.concat(formatList(res.result))
          if (this.select === null) {
            this.select =
              this.list[0] && this.list[0].topicId ? this.list[0].topicId : null
            this.keyWordsVoList =
              this.list[0] && this.list[0].keyWordsVoList
                ? this.list[0].keyWordsVoList
                : []
            this.selectKeyWordId =
              this.keyWordsVoList[0] && this.keyWordsVoList[0].keyWordId
                ? this.keyWordsVoList[0].keyWordId
                : null
            if (this.selectKeyWordId !== null) {
              this.tableParams.id = this.selectKeyWordId
              this.getContentList()
            } else {
              this.table.loading = false
            }
          }
          if (res.result.length < this.listParams.length) {
            this.getListMore = false
          }
          this.listLoading = false
          this.listIsScroll = false
        })
        .catch(err => {
          this.$notify.error(err.msg || '获取话题列表失败')
          this.listLoading = false
        })
    },
    /**
     * 话题列表切换
     * @param {Object} // i 列表某一项
     */
    onChangeList (i) {
      const _this = this
      this.select = i.topicId
      this.keyWordsVoList = i.keyWordsVoList
      this.selectKeyWordId =
        this.keyWordsVoList[0] && this.keyWordsVoList[0].keyWordId
          ? this.keyWordsVoList[0].keyWordId
          : null
      this.tableParams.start = 0
      this.tableParams.id = this.selectKeyWordId
      this.table = {
        loading: true,
        tableData: []
      }
      if (this.selectKeyWordId === null) {
        this.table.loading = false
        return
      }
      clearTimeout(this.getContentListTime)
      this.getContentListTime = setTimeout(() => {
        _this.getContentList()
      }, 500)
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
    add (data) {
      this.$http
        .fetch(this.$api.weWork.topicAnalysis.addKeyWordTopic, data)
        .then(res => {
          if (res.success) {
            this.$notify.success(res.msg)
            this.list = []
            this.keyWordsVoList = []
            this.select = null
            this.getKeyWordTopicList()
          }
        })
        .catch(err => {
          this.$notify.error(err.msg || '新增话题异常')
          this.listLoading = false
        })
    },
    /**
     * 新增关键词弹窗确认
     * @param {Object} // data 弹窗回传的对象
     */
    addKeyWord (data) {
      this.$http
        .fetch(this.$api.weWork.topicAnalysis.addKeyWord, {
          keyWords: data,
          topicId: this.select
        })
        .then(res => {
          if (res.success) {
            this.$notify.success(res.msg)
            this.list = []
            this.keyWordsVoList = []
            this.select = null
            this.getKeyWordTopicList()
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
        this.text = `确定要删除关键字“${content}”吗？`
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
     */
    deleteKeyWordTopic () {
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
            this.list = []
            this.keyWordsVoList = []
            this.select = null
            this.selectKeyWordId = null
            this.getKeyWordTopicList()
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
      this.table.loading = true
      this.$http
        .fetch(this.$api.weWork.topicAnalysis.contentList, this.tableParams)
        .then(res => {
          if (res.success) {
            this.table.tableData = res.result.data
            this.pagination.total = parseInt(res.result.recordsTotal)
            this.table.loading = false
          }
        })
        .catch(err => {
          this.$notify.error(err.msg || '列表获取失败')
          this.table.loading = false
        })
    },
    /**
     * 获取table列表详情
     *  @param {object}
     */
    getContext (row) {
      this.WeWorkChatParam = {
        chatDateTime: this.time,
        sender: row.sender,
        seq: row.seq,
        tolist: row.tolist,
        roomid: row.roomid ? row.roomid : '',
        type: 1,
        before: 5,
        after: 3
      }
      this.$http
        .fetch(this.$api.weWork.sensitiveWords.context, this.WeWorkChatParam)
        .then(res => {
          this.weWorkChatData = formatWeWorkChatData(res.result)
          this.drawer = true
        })
        .catch(err => {
          this.$notify.error(err.msg || '查询失败')
        })
    },
    /**
     * 聊天记录加载最新的数据
     */
    async getMore () {
      const data = this.WeWorkChatParam
      this.WeWorkChatParam = {
        chatDateTime: data.time,
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
        chatDateTime: data.time,
        sender: data.sender,
        tolist: data.tolist,
        roomid: data.roomid ? data.roomid : '',
        seq: this.weWorkChatData[0].seq,
        type: 1
      }
      let arr = await this.requestWeWorkChatDataToDb()
      this.weWorkChatData.unshift(...arr)
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
              const arrReverse = arr.reverse()
              resolve(formatWeWorkChatData(arrReverse))
            }
          })
          .catch(err => {
            this.$notify.error(err.msg)
            // reject(new Error(err))
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
      this.selectKeyWordId = item.keyWordId
    },
    /**
     * 每页条数发生变化
     */
    handleSizeChange (size) {
      this.tableParams.length = size
      this.getContentList()
    },
    /**
     * 页码发生变化
     */
    handlePageChange (page) {
      this.tableParams.start = (page - 1) * this.tableParams.length
      this.getContentList()
    },
    setHeight: function () {
      // this.$nextTick(() => {
      let extraHeight =
        this.$refs.fullScreen.$el.getBoundingClientRect().top || 0
      this.$refs.fullScreen.$el.children[0].style.maxHeight =
        window.innerHeight - extraHeight - 38 + 'px'
      let limitHeight =
        window.innerHeight -
        16 -
        20 -
        this.$refs.loadMoreWrapper.getBoundingClientRect().top
      this.$refs.loadMoreWrapper.style.height = limitHeight + 'px'
      let loadMoreWrapperChildren =
        window.innerHeight -
        16 -
        20 -
        this.$refs.loadMoreWrapperChildren.getBoundingClientRect().top
      this.$refs.loadMoreWrapperChildren.style.height =
        loadMoreWrapperChildren + 'px'
      // })
    }
  }
}
