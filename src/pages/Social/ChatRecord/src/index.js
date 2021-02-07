import LoadMore from '../../components/LoadMore'
import ChatRecordList from '../../components/chatRecordList'
import packup from '../image/ns-arrow-packup.png'
import unfold from '../image/ns-arrow-unfold.png'
import infiniteScroll from 'vue-infinite-scroll'
import { formatWeWorkChatData, formatSenderList, formatToList } from './format'
export default {
  directives: { infiniteScroll },
  components: { LoadMore, ChatRecordList },
  data () {
    return {
      packup,
      unfold,
      unfoldAndStow: true, // 展开收起
      WeWorkChatParam: {
        chatDateTime: '', // 聊天日期时间
        sender: 'HongKai', // 聊天发起人
        seq: 0, // 企微聊天序列
        tolist: 'YuYaZhou', // 聊天接收人
        type: 1 // 1拉取历史数据 2拉取最新数据
      },
      weWorkChatData: [], // 聊天记录列表
      weWorkChatDataLoading: false, // 聊天记录加载loading
      isSetWeWorkChatData: false, // 判断切换重新渲染页面置底
      isMoreWeWorkChatData: true, // 判断历史聊天是否还有更多
      // isRequestWeWorkChatData: false, // 滚动加载更多判断是否请求结束
      senderList: [], // 发起人列表
      senderIndex: null, // 点击标识
      senderIsScroll: false, // 发起人是否禁用加载更多
      senderParams: { name: '', start: 0, length: 15 },
      senderListLoading: false, // 发起聊天loading
      toList: [], // 聊天对象列表
      toListLoading: false, // 聊天对象loading
      toListIndex: null, // 聊天对象标识
      time: '', // 搜索时间
      activeName: '1', // tabs切换表示
      talkToGuideListParams: {
        sender: '', // 查询iD
        time: '2021-02-06 00:00:00', // 查询时间
        name: '',
        start: 0,
        length: 15
      },
      select: 1,
      count: 40
    }
  },
  computed: {
    ml () {
      return this.unfoldAndStow && this.activeName !== '2'
        ? 'template-page__right_content'
        : ''
    },
    senderListPlaceholder () {
      return `请输入${
        this.activeName === '1'
          ? '客户'
          : this.activeName === '2'
            ? '群'
            : '导购'
      }`
    },
    toListPlaceholder () {
      return `请输入${
        this.activeName === '1'
          ? '导购'
          : this.activeName === '2'
            ? '群'
            : '客户'
      }`
    }
  },
  created () {
    this.init()
    // this.requestGuideList()
    window.addEventListener('resize', this.setHeight)
  },
  mounted () {
    this.setHeight()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.setHeight)
  },
  methods: {
    async init () {
      this.getDate()
      this.handlerLoading()
      this.requestExternalUserList()
      // this.requestGuideList()
      // this.getDate()
      // this.getWeWorkChatDataToDb()
    },
    /**
     * loading 加载
     */
    handlerLoading () {
      this.toListLoading = true
      this.weWorkChatDataLoading = true
      this.toList = []
      this.toListIndex = null
      this.weWorkChatData = []
    },
    /**
     * 获取当前列表
     */
    getDate () {
      const nowDate = new Date()
      this.time = `${nowDate.getFullYear()}-${nowDate.getMonth() +
        1}-${nowDate.getDate()}`
      this.WeWorkChatParam.chatDateTime = this.time
      this.talkToGuideListParams.time = this.time + ' 00:00:00'
      // this.WeWorkChatParam.chatDateTime = this.time
    },
    /**
     * 日期时间修改
     */
    handlerChangeTime (data) {
      if (data) {
        this.WeWorkChatParam.chatDateTime = data
        this.talkToGuideListParams.time = data
      } else {
        const nowDate = new Date()
        this.time = `${nowDate.getFullYear()}-${nowDate.getMonth() +
          1}-${nowDate.getDate()}`
      }
      console.log(this.time, 'this.timethis.timethis.timethis.time')
      // this.getWeWorkChatDataToDb()
      // this.getWeWorkChatDataToDb()
    },
    /**
     * 菜单栏切换
     */
    handleClick (tab) {
      this.resetSenderParams()
      this.handlerLoading()
      if (tab.name === '1') {
        this.requestExternalUserList()
      } else if (tab.name === '2') {
        this.requestChatRoomList()
      } else {
        this.requestGuideList()
      }
    },
    /**
     * senderList 重置请求参数
     */
    resetSenderParams () {
      this.senderIndex = null
      this.toListIndex = null
      this.toList = []
      this.senderList = []
      this.senderParams = { name: '', start: 0, length: 15 }
    },
    /**
     * 页面显示格式化
     * @param {string} //activeName 名称
     * @param {number} // type 类型
     */
    formatActiveName (activeName, type) {
      let name = ''
      let Name = parseInt(activeName)
      if (type === 1) {
        name = Name === 1 ? '客户' : Name === 2 ? '群' : '导购'
      } else {
        name = Name === 1 ? '导购' : Name === 2 ? '群' : '客户'
      }
      return name
    },
    /**
     * 二级列表展开收起
     */
    handlerUnfoldAndStow () {
      this.unfoldAndStow = !this.unfoldAndStow
      this.setHeight()
    },
    /**
     * senderList 搜索
     */
    onSenderSearch () {
      this.senderList = []
      this.senderIndex = null
      this.toList = []
      this.toListIndex = null
      this.senderParams = { ...this.senderParams, start: 0, length: 15 }
      if (parseInt(this.activeName) === 1) {
        this.requestExternalUserList()
      } else if (parseInt(this.activeName) === 2) {
        this.requestChatRoomList()
      } else {
        this.requestGuideList()
      }
      // this.resetSenderParams()
    },
    /**
     * toList 搜索
     */
    onToListSearch () {
      this.toList = []
      this.toListIndex = null
      this.talkToGuideListParams = {
        ...this.talkToGuideListParams,
        start: 0,
        length: 15
      }
      this.getTalkToGuideList()
    },
    /**
     * 获取客户聊天列表
     */
    requestExternalUserList () {
      const url = this.$api.marketing.chatRecord.externalUserList
      this.requestSenderList(url)
    },
    /**
     * 获取导购聊天列表
     */
    requestGuideList () {
      const url = this.$api.marketing.chatRecord.guideList
      this.requestSenderList(url)
    },
    /**
     * 获取群列表
     */
    requestChatRoomList () {
      const url = this.$api.marketing.chatRecord.chatRoomList
      this.requestSenderList(url)
    },
    /**
     * 获取发起人聊天列表
     * @param {string}  // url 请求接口地址
     */
    requestSenderList (url) {
      this.senderListLoading = true
      // this.toListLoading = true
      // this.weWorkChatDataLoading = true
      this.$http
        .fetch(url, this.senderParams)
        .then(res => {
          if (res.success) {
            this.senderList = this.senderList.concat(
              formatSenderList(res.result)
            )
            if (this.senderIndex === null) {
              this.senderIndex = 0
              // this.talkToGuideListParams.sender = this.senderList[0].userId
              if (this.activeName !== '2') {
                this.talkToGuideListParams.sender = 'HongKai'
                this.getTalkToGuideList()
              } else {
                this.toList = []
                this.toListIndex = null

                this.getTalkToGuideList()
              }
            }
            this.senderIsScroll = false
            this.senderListLoading = false
          }
        })
        .catch(err => {
          this.$notify.error(err.msg)
        })
    },
    /**
     * 查询发起人对应的聊天列表
     */
    getTalkToGuideList () {
      this.toListLoading = true
      this.$http
        .fetch(
          this.$api.marketing.chatRecord.talkToGuideList,
          this.talkToGuideListParams
        )
        .then(res => {
          this.toList = this.toList.concat(formatToList(res.result))
          this.toListLoading = false
          console.log(
            this.toListIndex,
            'this.toListIndexthis.toListIndexthis.toListIndex'
          )
          if (this.toListIndex === null) {
            this.toListIndex = 0
            console.log(
              this.toListIndex,
              'this.toListIndexthis.toListIndexthis.toListIndex'
            )
          }
          this.getWeWorkChatDataToDb()
        })
        .catch(err => {
          this.$notify.error(err.msg)
        })
    },
    /**
     * senderList 滚动加载更多
     */
    handlerScroll () {
      // if (this.senderIsScroll) {
      this.senderIsScroll = true
      this.senderParams.start =
        this.senderParams.start + this.senderParams.length
      if (parseInt(this.activeName) === 1) {
        this.requestExternalUserList()
      } else if (parseInt(this.activeName) === 2) {
        this.requestChatRoomList()
      } else {
        this.requestGuideList()
      }
      // }
    },
    /**
     * senderList 切换
     * @param {Object} // item list每一项
     * @param {Number} // index list下标
     */
    handleClickChangeSender (item, index) {
      this.senderIndex = index
      this.toList = []
      this.toListIndex = null
      this.talkToGuideListParams = {
        ...this.talkToGuideListParams,
        name: '',
        start: 0,
        length: 15
      }
      this.weWorkChatDataLoading = true
      // this.talkToGuideListParams.sender = 'HongKai'
      this.getTalkToGuideList()
    },
    async getWeWorkChatDataToDb () {
      this.weWorkChatDataLoading = true
      this.isSetWeWorkChatData = false
      this.weWorkChatData = await this.requestWeWorkChatDataToDb()
      this.isSetWeWorkChatData = true
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
              // this.isRequestWeWorkChatData = true
              resolve(formatWeWorkChatData(res.result))
              this.weWorkChatDataLoading = false
            }
          })
          .catch(err => {
            this.$notify.error(err.msg)
            this.weWorkChatDataLoading = false
            // reject(new Error(err))
          })
      })
      // this.weWorkChatDataLoading = true
      // this.$http
      //   .fetch(
      //     this.$api.marketing.chatRecord.getWeWorkChatDataToDb,
      //     this.WeWorkChatParam
      //   )
      //   .then(res => {
      //     if (res.success) {
      //       if (type == ) {}
      //       this.weWorkChatData = formatWeWorkChatData(res.result)
      //       this.weWorkChatDataLoading = false
      //       this.isSetWeWorkChatData = true
      //       this.isRequestWeWorkChatData = true
      //       console.log(this.weWorkChatData)
      //     }
      //   })
    },
    /**
     * 聊天记录顶部加载更多历史数据
     */
    async handleScrollTop () {
      if (this.isMoreWeWorkChatData) {
        this.WeWorkChatParam = {
          ...this.WeWorkChatParam,
          seq: this.weWorkChatData[0].seq
        }
        let arr = await this.requestWeWorkChatDataToDb()
        // 数据长度后台默认返回30条
        this.isMoreWeWorkChatData = arr.length > 25
        this.weWorkChatData.unshift(...arr)
      }
    },
    /**
     * 聊天客户列表加载更多
     */
    changeScroll () {
      return false
      // this.count += 2
    },
    selectUser (i) {
      this.select = i
    },
    /**
     * 监听页面变化设置高度
     */
    setHeight: function () {
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
      let ChatRecordBox =
        window.innerHeight -
        2 -
        20 -
        this.$refs.ChatRecordBox.getBoundingClientRect().top
      this.$refs.ChatRecordBox.style.height = ChatRecordBox + 'px'
      // })
    }
  }
}
