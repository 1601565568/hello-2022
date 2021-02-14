import LoadMore from '@/pages/Social/components/LoadMore'
import ChatRecordList from '@/pages/Social/components/chatRecordList'
import ElDrawer from '@nascent/nui/lib/drawer'
import ItemDrawer from '../../components/ItemDrawer'
import nsAddBorder from '../../topicAnalysis/image/ns-add-border.png'
import infiniteScroll from 'vue-infinite-scroll'
import AddSensitiveWords from '../../components/addSensitiveWords'
import moment from 'moment'
import { formatList, formatWeWorkChatData } from './format'
export default {
  directives: { infiniteScroll },
  components: {
    LoadMore,
    ChatRecordList,
    ElDrawer,
    ItemDrawer,
    AddSensitiveWords
  },
  data () {
    return {
      nsAddBorder,
      // 分页配置
      pagination: {
        size: 15,
        sizeOpts: [15, 25, 50, 100],
        page: 1,
        total: 0
      },
      model: {
        name: '',
        time: '',
        start: 0,
        length: 30
      },
      time: '',
      list: [], // 敏感词列表
      select: null, // 勾选的下标
      listLoading: false,
      listIsScroll: true, // 敏感词列表加载更多
      getListMore: true, // 是否还有更多
      getContentListTime: null,
      drawer: false,
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
  computed: {},
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
      this.getDate()
      this.getList()
    },
    /**
     * 获取敏感词列表
     */
    getList () {
      this.listLoading = true
      this.table.loading = true
      this.table.tableData = []
      this.$http
        .fetch(this.$api.weWork.sensitiveWords.list, this.model)
        .then(res => {
          const result = formatList(res.result)
          this.list = this.list.concat(result)
          this.tableParams.start = 0
          if (this.select === null) {
            this.select =
              this.list[0] && this.list[0].id ? this.list[0].id : null
          }
          if (this.list.length !== 0) {
            this.tableParams.id = this.select
            this.getContentList()
          } else {
            this.table.loading = false
          }
          if (result.length < this.model.length) {
            this.getListMore = false
          }
          this.listLoading = false
          this.listIsScroll = false
        })
        .catch(err => {
          this.$notify.error(err.msg || '敏感词列表失败')
        })
    },
    /**
     * 获取当天日期
     */
    getDate () {
      const nowDate = new Date()
      this.time = moment(nowDate).format('YYYY-MM-DD')
      this.model.time = this.time
      this.tableParams.time = this.time
    },
    /**
     * 日期时间修改
     */
    handlerChangeTime (data) {
      if (data) {
        this.tableParams.time = data
        this.model.time = data
        this.select = null
        this.list = []
        this.getList()
        // this.getContentList()
      } else {
        const nowDate = new Date()
        this.time = moment(nowDate).format('YYYY-MM-DD')
      }
    },
    /**
     * 输入框搜索
     */
    onSearch () {
      this.list = []
      this.getList()
    },
    /**
     * 敏感词列表加载更多
     */
    handlerScroll () {
      if (!this.listIsScroll && this.getListMore) {
        this.listIsScroll = true
        this.model.start = this.model.start + this.model.length
        this.getList()
      }
    },
    /**
     * 敏感词列表选中状态
     * @param {i} // i list唯一标识ID
     */
    selectUser (i) {
      this.select = i
      this.tableParams.id = i
      this.tableParams.start = 0
      let _this = this
      this.table.loading = true
      clearTimeout(this.getContentListTime)
      this.getContentListTime = setTimeout(() => {
        _this.getContentList()
      }, 500)
    },
    /**
     * 敏感词列表删除
     * @param {number} // id list唯一标识ID
     */
    listDeleteItem (id) {
      let _this = this
      this.$http
        .fetch(this.$api.weWork.sensitiveWords.delete, { id })
        .then(res => {
          if (res.success) {
            _this.$notify.success(res.msg)
            _this.model.start = 0
            this.select = null
            this.list = []
            _this.getList()
          }
        })
        .catch(err => {
          _this.$notify.error(err.msg || '删除失败')
        })
    },
    /**
     * 敏感词列表添加列表弹窗事件
     */
    onShowAddSensitiveWords () {
      this.$refs.AddSensitiveWords.onShow()
    },
    /**
     * 敏感词弹窗添加确认
     * @param {string} // data 添加的文字
     */
    add (data) {
      this.$http
        .fetch(this.$api.weWork.sensitiveWords.add, { words: data })
        .then(res => {
          if (res.success) {
            this.$notify.success('添加成功')
            this.model.start = 0
            this.list = []
            this.select = null
            this.getList()
          }
        })
        .catch(err => {
          this.$notify.error(err.msg || '添加失败')
        })
    },
    /**
     * 获取明细
     */
    getContentList () {
      this.table.loading = true
      this.$http
        .fetch(this.$api.weWork.sensitiveWords.contentList, this.tableParams)
        .then(res => {
          if (res.success) {
            this.table.tableData = res.result.data
            this.pagination.total = parseInt(res.result.recordsTotal)
            this.table.loading = false
          }
        })
        .catch(err => {
          this.$notify.error(err.msg || '添加失败')
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
      const data = this.weWorkChatData
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
      const data = this.weWorkChatData
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
      this.$nextTick(() => {
        let extraHeight =
          this.$refs.fullScreen.$el.getBoundingClientRect().top || 0
        this.$refs.fullScreen.$el.children[0].style.maxHeight =
          window.innerHeight - extraHeight - 38 + 'px'
        let limitHeight =
          window.innerHeight -
          16 -
          40 -
          this.$refs.loadMoreWrapper.getBoundingClientRect().top
        this.$refs.loadMoreWrapper.style.height = limitHeight + 'px'
      })
    }
  }
}
