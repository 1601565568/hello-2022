import ChatRecordList from '../../components/chatRecordList'
import packup from '../image/ns-arrow-packup.png'
import unfold from '../image/ns-arrow-unfold.png'
import infiniteScroll from 'vue-infinite-scroll'
import moment from 'moment'
import NsNoData from '@nascent/ecrp-ecrm/src/components/NsNoData.vue'
import { formatWeWorkChatData, formatSenderList, formatToList } from './format'
export default {
  directives: { infiniteScroll },
  components: { ChatRecordList, NsNoData },
  data () {
    return {
      packup,
      unfold,
      unfoldAndStow: true, // 展开收起
      WeWorkChatParam: {
        chatDateTime: '', // 聊天日期时间
        sender: '', // 聊天发起人
        seq: 0, // 企微聊天序列
        tolist: '', // 聊天接收人
        type: 1 // 1拉取历史数据 2拉取最新数据
      },
      weWorkChatData: [], // 聊天记录列表
      weWorkChatDataLoading: false, // 聊天记录加载loading
      isSetWeWorkChatData: false, // 判断切换重新渲染页面置底
      // isMoreWeWorkChatData: true, // 判断历史聊天是否还有更多
      // isRequestWeWorkChatData: false, // 滚动加载更多判断是否请求结束
      senderList: [], // 发起人列表
      senderIndex: null, // 点击标识
      senderIsScroll: true, // 发起人是否禁用加载更多
      senderParams: { name: '', start: 0, length: 15 },
      senderListLoading: false, // 发起聊天loading
      getMoreloading: false, // 加载更多提示文案
      noMore: true, // senderList 加载判断是否还有更多数据
      senderTime: null, // 发起人列表点击防抖处理
      toList: [], // 聊天对象列表
      toListLoading: false, // 聊天对象loading
      toListIndex: null, // 聊天对象标识
      toListTime: null, // 聊天对象防抖处理
      toListIsScroll: true, // 聊天是否禁用加载更多
      getToListNoMore: true, // toList 加载判断是否还有更多数据
      getToListloading: false, // toList加载更多提示文案
      tabClickTime: null, // tab切换防抖
      time: '', // 搜索时间
      activeName: '1', // tabs切换表示
      talkToGuideListParams: {
        id: '', // 查询iD
        time: '', // 查询时间
        name: '',
        start: 0,
        length: 15
      }
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
    /**
     * 页面初始化
     */
    async init () {
      this.getDate()
      this.handlerLoading()
      this.requestExternalUserList()
    },
    /**
     * loading 加载
     */
    handlerLoading () {
      this.senderListLoading = true
      this.toListLoading = true
      this.weWorkChatDataLoading = true
      this.isSetWeWorkChatData = false
      this.senderList = []
      this.senderIndex = null
      this.toList = []
      this.toListIndex = null
      this.weWorkChatData = []
    },
    /**
     * 获取当前列表
     */
    getDate () {
      const nowDate = new Date()
      this.time = moment(nowDate).format('YYYY-MM-DD')
      this.WeWorkChatParam.chatDateTime = this.time
      this.talkToGuideListParams.time = this.time
      // this.WeWorkChatParam.chatDateTime = this.time
    },
    /**
     * 日期时间修改
     */
    handlerChangeTime (data) {
      if (data) {
        this.WeWorkChatParam.chatDateTime = data
        this.talkToGuideListParams.time = data
        this.toList = []
        this.toListIndex = null
        this.weWorkChatData = []
        this.toListLoading = true
        this.weWorkChatDataLoading = true
        this.isSetWeWorkChatData = false
        // this.handlerLoading()
        if (this.activeName === '2') {
          // 群聊天特殊处理
          this.getWeWorkChatDataToDb()
        } else {
          this.getTalkToGuideList()
        }
      } else {
        const nowDate = new Date()
        this.time = moment(nowDate).format('YYYY-MM-DD')
      }
    },
    /**
     * 菜单栏切换
     */
    handleClick (tab) {
      let _this = this
      // 点击相同的禁止请求接口
      if (this.activeName === tab) {
        return
      }
      this.activeName = tab
      this.resetSenderParams()
      this.handlerLoading()
      clearTimeout(this.tabClickTime)
      this.tabClickTime = setTimeout(() => {
        if (tab === '1') {
          _this.requestExternalUserList()
        } else if (tab === '2') {
          _this.requestChatRoomList()
        } else {
          _this.requestGuideList()
        }
      }, 500)
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
      this.talkToGuideListParams = {
        id: '', // 查询iD
        time: this.time, // 查询时间
        name: '',
        start: 0,
        length: 15
      }
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
      // this.resetSenderParams()
      this.handlerLoading()
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
      const params = JSON.parse(JSON.stringify(this.senderParams))
      this.$http
        .fetch(url, params)
        .then(res => {
          if (res.success) {
            this.senderList = this.senderList.concat(
              formatSenderList(res.result)
            )
            this.toListIndex = null
            if (this.senderIndex === null) {
              this.senderIndex = 0
              this.talkToGuideListParams.id = this.senderList[0]
                ? this.senderList[0].userId
                : ''
              this.WeWorkChatParam.sender = this.senderList[0]
                ? this.senderList[0].userId
                : ''
            }
            // 判断是否还要加载请求更多的数据
            const arr = res.result || []
            this.noMore = arr.length < this.senderParams.length
            // getMoreloading 加载更多文案提示判断是否是发起人列表滚动, 接口统一请求导致错误
            if (!this.getMoreloading) {
              // 群聊天单独处理
              if (this.activeName !== '2') {
                this.getTalkToGuideList()
              } else {
                this.WeWorkChatParam = {
                  chatDateTime: this.WeWorkChatParam.chatDateTime,
                  sender: '',
                  tolist: '',
                  seq: 0,
                  type: 1,
                  roomid: this.senderList[0] ? this.senderList[0].chatId : ''
                }
                this.getWeWorkChatDataToDb()
              }
            }
            this.senderIsScroll = false
            this.senderListLoading = false
            this.getMoreloading = false
          }
        })
        .catch(err => {
          this.$notify.error(err.msg || '数据拉取失败')
          this.senderListLoading = false
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
          if (this.toListIndex === null) {
            this.toListIndex = 0
            this.WeWorkChatParam.tolist = this.toList[0]
              ? this.toList[0].userId
              : ''
          }
          this.toListIsScroll = false
          if (!this.getToListloading) {
            if (this.toList.length === 0) {
              this.weWorkChatDataLoading = false
              this.weWorkChatData = []
              this.isSetWeWorkChatData = true
            } else {
              this.getWeWorkChatDataToDb()
            }
          }
          // 判断是否还要加载请求更多的数据
          const arr = res.result || []
          this.getToListNoMore = arr.length < this.talkToGuideListParams.length
          this.getToListloading = false
        })
        .catch(err => {
          this.$notify.error(err.msg)
        })
    },
    /**
     * senderList 滚动加载更多
     */
    handlerScroll () {
      if (!this.senderIsScroll && !this.noMore) {
        this.senderIsScroll = true
        this.getMoreloading = true
        this.senderParams.start =
          this.senderParams.start + this.senderParams.length
        if (parseInt(this.activeName) === 1) {
          // this.senderListLoading = true
          this.requestExternalUserList()
        } else if (parseInt(this.activeName) === 2) {
          this.requestChatRoomList()
        } else {
          this.requestGuideList()
        }
      }
    },
    /**
     * toList 滚动加载更多
     */
    handlerListScroll () {
      if (!this.toListIsScroll) {
        this.toListIsScroll = true
        this.getToListloading = true
        this.talkToGuideListParams = {
          ...this.talkToGuideListParams,
          start:
            this.talkToGuideListParams.start +
            this.talkToGuideListParams.length,
          length: 15
        }
        this.getTalkToGuideList()
      }
    },
    /**
     * senderList 切换
     * @param {Object} // item list每一项
     * @param {Number} // index list下标
     */
    handleClickChangeSender (item, index) {
      let _this = this
      this.senderIndex = index
      this.toList = []
      this.toListIndex = null
      this.weWorkChatDataLoading = true
      this.toListLoading = true
      this.isSetWeWorkChatData = false
      clearTimeout(this.senderTime)
      // 客户导购处理
      if (this.activeName !== '2') {
        this.talkToGuideListParams = {
          ...this.talkToGuideListParams,
          name: '',
          start: 0,
          length: 15,
          id: item.userId
        }
        this.WeWorkChatParam = {
          ...this.WeWorkChatParam,
          sender: item.userId,
          seq: 0,
          roomid: ''
        }
        this.senderTime = setTimeout(() => {
          _this.getTalkToGuideList()
        }, 500)
      } else {
        // 群单独处理
        this.WeWorkChatParam = {
          chatDateTime: this.WeWorkChatParam.chatDateTime,
          sender: '',
          tolist: '',
          seq: 0,
          type: 1,
          roomid: item.chatId
        }
        this.senderTime = setTimeout(() => {
          this.getWeWorkChatDataToDb()
        }, 500)
      }
    },
    /**
     * tolist 切换
     * @param {Object} // item list每一项
     * @param {Number} // index list下标
     */
    handleClickChangeToList (item, index) {
      const _this = this
      this.WeWorkChatParam = {
        ...this.WeWorkChatParam,
        tolist: item.userId,
        seq: 0,
        type: 1,
        roomid: ''
      }
      this.toListIndex = index
      this.isSetWeWorkChatData = false
      this.weWorkChatDataLoading = true
      clearTimeout(this.toListTime)
      this.toListTime = setTimeout(() => {
        _this.getWeWorkChatDataToDb()
      }, 500)
    },
    async getWeWorkChatDataToDb () {
      this.weWorkChatDataLoading = true
      this.isSetWeWorkChatData = false
      let data = await this.requestWeWorkChatDataToDb()
      this.weWorkChatData = data.reverse()
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
    },
    /**
     * 聊天记录顶部加载更多历史数据
     */
    async handleScrollTop () {
      this.WeWorkChatParam = {
        ...this.WeWorkChatParam,
        seq: this.weWorkChatData[0].seq,
        type: 1
      }
      let arr = await this.requestWeWorkChatDataToDb()
      this.weWorkChatData.unshift(...arr)
    },
    /**
     * 聊天记录加载最新的数据
     */
    async getMore () {
      this.WeWorkChatParam = {
        ...this.WeWorkChatParam,
        seq: this.weWorkChatData[this.weWorkChatData.length - 1].seq,
        type: 2
      }
      let arr = await this.requestWeWorkChatDataToDb()
      if (arr.length === 0) {
        this.$notify.error('暂无最新的记录，请稍后再试')
      }
      arr.reverse()
      console.log(this.weWorkChatData)
      this.weWorkChatData.push(...arr)
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
