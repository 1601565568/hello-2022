import ElUpload from '@nascent/nui/lib/upload'
import ElContainer from '@nascent/nui/lib/container'
import ElMain from '@nascent/nui/lib/main'
import ElAside from '@nascent/nui/lib/aside'
import ElImage from '@nascent/nui/lib/image'
import { getErrorMsg } from '@/utils/toast'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import moment from 'moment'
import VEmojiPicker from 'v-emoji-picker'
import packData from 'v-emoji-picker/data/emojis.json'
export default {
  components: {
    ElUpload,
    ElContainer,
    ElMain,
    ElAside,
    VEmojiPicker,
    ElImage
  },
  mixins: [tableMixin],
  props: {
    types: Object,
    comment: Object,
    moment: Object
  },
  data: function () {
    var pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    var interactionPagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    var quickInput = [{
      'template': '',
      'inline': false,
      'name': 'customerName',
      'text': '姓名',
      'placeholder': '请输入姓名',
      'type': 'text',
      'value': '',
      'isConvenient': false
    }]
    let rules = {
      'likesMin': [
        { message: '请输入正整数', trigger: 'blur,change' },
        {
          pattern: /^[0-9]*[1-9][0-9]*$/,
          message: '数字格式错误，请您重新输入！'
        }
      ],
      'likesMax': [
        { message: '请输入正整数', trigger: 'blur,change' },
        {
          pattern: /^[0-9]*[1-9][0-9]*$/,
          message: '数字格式错误，请您重新输入！'
        },
        {
          validator: (rule, value, callback) => {
            if (value <= this.model.likesMin) {
              // eslint-disable-next-line standard/no-callback-literal
              callback('点赞最大数不能小于或等于最小数')
            }
          }
        }
      ],
      'commentsMin': [
        { message: '请输入正整数', trigger: 'blur,change' },
        {
          pattern: /^[0-9]*[1-9][0-9]*$/,
          message: '数字格式错误，请您重新输入！'
        }
      ],
      'commentsMax': [
        { message: '请输入正整数', trigger: 'blur,change' },
        {
          pattern: /^[0-9]*[1-9][0-9]*$/,
          message: '数字格式错误，请您重新输入！'
        },
        {
          validator: (rule, value, callback) => {
            if (value <= this.model.commentsMax) {
              // eslint-disable-next-line standard/no-callback-literal
              callback('最大数不能小于或等于最小数')
            }
          }
        }
      ]
    }
    var quickSearchNames = quickInput.map(x => x.name)
    var quickSearchModel = {}
    var model = Object.assign({},
      {
        ownerId: null, // 个人号id
        likesMin: null, // 点赞最小数
        likesMax: null, // 点赞最大数
        commentsMin: null, // 评论最小数
        commentsMax: null, // 评论最大数
        snsType: null, // 内容类型
        keyword: null, // 关键字
        orderType: null, // 排序方式
        timeEnd: null,
        timeStart: null,
        time: null // 发朋友圈时间
      },
      {})
    var _this = this

    quickInput.map(item => {
      Object.defineProperty(quickSearchModel, item.name, {
        get: function () {
          return model[item.name]
        },
        set: function (val) {
          model[item.name] = val
          // TODO 由于特殊需求导致下列写法
          if (item.type === 'radio') {
            _this._data._table.quickSearchMap[item.name] = val
            _this.$quickSearch$()
          }
        },
        enumerable: true
      })
    })
    return {
      srcList: [], // 点击图片列表的任何一张图片，然后显示该图片的大图地址
      dialogVisible: false,
      dialogVisibleShow: false,
      dialogVisibleReply: false,
      visible2: false,
      isHidden: false,
      momentIsHidden: true,
      likesMin: null, // 点赞最小数
      likesMax: null, // 点赞最大数
      commentsMin: null, // 评论最小数
      commentsMax: null, // 评论最大数
      model: model,
      imageUrl: '',
      textarea: null,
      pack: packData,
      quickSearchModel: quickSearchModel,
      numberRules: rules,
      _pagination: pagination,
      // eslint-disable-next-line vue/no-reserved-keys
      interactionPagination: interactionPagination,
      momentsTotal: 0,
      _queryConfig: {
        expand: false
      },
      moments: [], // 朋友圈列表
      // images: [],
      likeNames: null, // 点赞的名称
      interationMsgs: null, // 互动消息
      personalNumberList: null, // 个人号列表
      content: null, // 回复内容
      wid: null, // 朋友圈id
      url: null,
      otherMoment: null,
      otherComment: null,
      interactionTotal: 0,
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一天',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  mounted () {
    this.initPersonalNumberList()
    this.initMomentsList()
    this.initInteractionMsgList()
    this.$nextTick(() => {
      this.setHeight()
      window.addEventListener('resize', () => {
        this.setHeight()
      })
    })
    this.setState()
  },
  methods: {
    $handleTabClick: function () {
      var expand = this._data._queryConfig.expand
      // var showCondition = this._data._queryConfig.showCondition
      if (expand) {
        this._data._queryConfig.expand = false
      } else {
        this._data._queryConfig.expand = true
      }
      this.$nextTick(() => {
        this.setHeight()
      })
    },
    initMomentStatus () {
      this.dialogVisibleShow = false
      this.momentIsHidden = true
    },
    // 初始化朋友圈信息
    initMomentsList () {
      var _this = this
      _this.url = _this.$api.guide.myMoments.momentsList
      let params = _this.$generateParams$()
      _this.$http.fetch(_this.url, params).then(resp => {
        if (resp.success && resp.result != null) {
          _this.moments = Object.assign([], resp.result.data)
          _this._data._pagination.total = parseInt(resp.result.recordsTotal)
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    initInteractionMsgList () {
      var _this = this
      let interactionUrl = _this.$api.guide.myMoments.interactionMsgList
      var limit = {
        start: (_this.interactionPagination.page - 1) * _this.interactionPagination.size,
        length: _this.interactionPagination.size
      }
      _this.$http.fetch(interactionUrl, limit).then(resp => {
        if (resp.success && resp.result != null) {
          _this.interationMsgs = resp.result.data
          _this.interactionTotal = parseInt(resp.result.recordsTotal)
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    sizeChange (size) {
      var _this = this
      var pagination = _this._data._pagination
      pagination.size = size
      pagination.page = 1
      let params = this.$generateParams$()
      _this.$http.fetch(_this.$api.guide.myMoments.momentsList, params).then(resp => {
        if (resp.success && resp.result != null) {
          _this.moments = resp.result.data
          _this._data._pagination.total = parseInt(resp.result.recordsTotal)
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    pageChange (page) {
      var _this = this
      var pagination = _this._data._pagination
      pagination.page = page
      let params = this.$generateParams$()
      _this.$http.fetch(_this.$api.guide.myMoments.momentsList, params).then(resp => {
        if (resp.success && resp.result != null) {
          _this.moments = resp.result.data
          _this._data._pagination.total = parseInt(resp.result.recordsTotal)
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    // 互动消息分页查询-页面跳转
    interactionPageChange (page) {
      var _this = this
      let changePage = page
      var limit = {
        start: (changePage - 1) * _this.interactionPagination.size,
        length: _this.interactionPagination.size
      }
      _this.$http.fetch(_this.$api.guide.myMoments.interactionMsgList, limit).then(resp => {
        if (resp.success && resp.result != null) {
          _this.interationMsgs = resp.result.data
          _this.interactionTotal = parseInt(resp.result.recordsTotal)
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    reloadList () {
      setTimeout(this.initMomentsList, 2000)
      setTimeout(this.initInteractionMsgList, 2000)
    },
    // 个人号列表
    initPersonalNumberList () {
      var _this = this
      _this.$http.fetch(_this.$api.guide.wxDeviceGuideRelation.findWidNickSelector).then(resp => {
        if (resp.success && resp.result != null) {
          _this.personalNumberList = resp.result
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    closeDialog () {
      this.dialogVisibleReply = false
      this.dialogVisibleShow = false
      this.otherComment = null
      this.otherMoment = null
      this.content = null
      this.isHidden = false
    },
    // 查询朋友圈列表
    queryMomentsList () {
      var _this = this
      if (_this.model.time !== '' && _this.model.time != null) {
        _this.model.timeStart = moment(_this.model.time[0]).format('YYYY-MM-DD HH:mm:ss')
        _this.model.timeEnd = moment(_this.model.time[1]).format('YYYY-MM-DD 23:59:59')
      }
      _this._data._pagination.page = 1
      let params = _this.$generateParams$()
      params.start = 0
      params.page = 1
      _this.$http.fetch(_this.$api.guide.myMoments.momentsList, params).then(resp => {
        if (resp.success && resp.result != null) {
          _this.moments = resp.result.data
          _this._data._pagination.total = parseInt(resp.result.recordsTotal)
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    // 快速查询
    $quickSearchAction$ (keyword) {
      var _this = this
      let params = _this.$generateParams$()
      params.searchMap.keyword = keyword
      _this.$http.fetch(_this.$api.guide.myMoments.momentsList, params).then(resp => {
        if (resp.success && resp.result != null) {
          _this.moments = resp.result.data
          _this._data._pagination.total = parseInt(resp.result.recordsTotal)
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    // 回复评论
    reply () {
      var _this = this
      _this.content = _this.content.replace(/\s*/g, '')
      if (_this.content == null || _this.content.length === 0 || _this.content.length === 0) {
        _this.$notify.error('内容不能为空')
        return
      }
      if (_this.content.length > 800) {
        _this.$notify.error('评论内容不能超过800字')
        return
      }
      _this.isHidden = true
      let commentType = 0
      let replyToNick = null
      if (_this.otherComment) {
        if (_this.otherComment.ownerId === _this.otherMoment.owner) {
          commentType = 0
          replyToNick = null
        } else {
          replyToNick = _this.otherComment.ownerNick
          commentType = 1
        }
      }
      let replyMomentVo = {
        wid: _this.otherMoment.owner,
        snsId: _this.otherMoment.snsId,
        author: _this.otherMoment.owner,
        content: _this.content,
        replyTo: _this.otherComment ? _this.otherComment.ownerId : _this.otherMoment.owner,
        commentType: commentType,
        replyToNick: replyToNick,
        commentId: _this.otherComment ? _this.otherComment.cid : null
      }
      _this.$http.fetch(_this.$api.guide.myMoments.replyComment, replyMomentVo).then(resp => {
        if (resp.success) {
          _this.$notify.success('评论成功')
          _this.closeDialog()
          this.reloadList()
        }
      }).catch((resp) => {
        _this.isHidden = false
        _this.$notify.error(getErrorMsg('评论失败', resp))
      })
    },
    // 回复评论-打开弹窗并初始化参数
    replyComment (moment, comment) {
      var _this = this
      _this.dialogVisibleReply = true
      _this.isHidden = true
      _this.otherMoment = moment
      if (comment) {
        _this.otherComment = comment
      }
    },
    // 点赞朋友圈
    like (moment) {
      var _this = this
      if (moment.likesWxId != null && moment.likesWxId.indexOf(moment.owner) !== -1) {
        _this.$notify.error('已点赞，不能重复点赞')
        return
      }
      let replyMomentVo = {
        wid: moment.owner,
        snsId: moment.snsId,
        author: moment.owner
      }
      _this.$http.fetch(_this.$api.guide.myMoments.like, replyMomentVo).then(resp => {
        if (resp.success) {
          _this.$notify.success('点赞成功')
          _this.reloadList()
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('点赞失败', resp))
      })
    },
    // 重置
    rest () {
      var _this = this
      _this.url = _this.$api.guide.myMoments.momentsList
      let keys = Object.keys(_this.model)
      for (let i = 0; i < keys.length; i++) {
        this.model[keys[i]] = null
      }
      // _this.$resetInputAction$()
      _this.initMomentsList()
    },
    selectEmoji (emoji) {
      if (this.content == null) {
        this.content = ''
      }
      this.content = this.content + emoji.emoji
    },
    // 发送朋友圈
    sendMoments () {
      var _this = this
      _this.momentIsHidden = true
      _this.textarea = _this.textarea.replace(/\s*/g, '')
      if (_this.textarea == null || _this.textarea.length === 0) {
        _this.$notify.error('内容不能为空')
        return
      }
      if (_this.wid == null) {
        _this.$notify.error('请选择个人号')
        return
      }
      try {
        if (_this.imageUrl.length > 0) {
          let images = []
          images.push(_this.imageUrl)
          _this.$http.fetch(_this.$api.guide.myMoments.sendImages, { wid: _this.wid, content: _this.textarea, images: images }).then(resp => {
            if (resp.success) {
              _this.$notify.success('发送成功')
              _this.dialogVisible = true
              _this.dialogVisibleShow = false
              _this.reloadList()
            }
          }).catch((resp) => {
            _this.momentIsHidden = false
            _this.$notify.error(getErrorMsg('发送失败', resp))
          })
        } else {
          _this.$http.fetch(_this.$api.guide.myMoments.sendText, { wid: _this.wid, content: _this.textarea }).then(resp => {
            if (resp.success) {
              _this.$notify.success('发送成功')
              _this.dialogVisible = true
              _this.dialogVisibleShow = false
              _this.reloadList()
            }
          }).catch((resp) => {
            _this.momentIsHidden = false
            _this.$notify.error(getErrorMsg('发送失败', resp))
          })
        }
      } catch (e) {
        _this.momentIsHidden = false
      }
    },
    beforeAvatarUpload (file) {
      if (file.size / 1024 > 5000) {
        this.$notify.error('上传图片不得大于5M')
        return false
      }
      // 图片格式判断
      if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG|JPEG)$/.test(file.name)) {
        this.$notify.error('不支持的图片格式')
        return false
      }
    },
    // 处理上传图片
    'handleAvatarSuccess': function (res, file) {
      var _this = this
      _this.imageUrl = res.result.url
    },
    /**
     * 计算主要显示窗口的高度，动态设置页面内主要内容的高度
     */
    setHeight: function () {
      const PAGE_TOP_SEARCH = 39 // 简单搜索的高度
      const BTN_BOTTOM = 38 // 底部页码占据的高度
      let limitHeight = window.innerHeight -
        document.getElementsByClassName('nav')[0].offsetHeight -
        document.getElementsByClassName('template-table__bar-more')[0].offsetHeight - // 高级搜索
        BTN_BOTTOM - PAGE_TOP_SEARCH - 10
      let limitHeightRight = window.innerHeight -
        document.getElementsByClassName('talk-personal')[0].offsetHeight -
        document.getElementsByClassName('nav')[0].offsetHeight -
        BTN_BOTTOM - 5
      this.$refs.fullScreen.$el.children[0].style.maxHeight = limitHeight + 'px'
      this.$refs.fullScreenright.$el.children[0].style.maxHeight = limitHeightRight + 'px'
    },
    showTotalIntro (index) {
      this.$set(this.moments[index], 'showState', this.moments[index].showState === 1 ? 2 : 1)
    },
    setState () {
      this.moments.map((moment, index) => {
        let descHeight = this.$refs.asideList.children[index].children[1].children[1].clientHeight
        if (descHeight > 40) {
          this.$set(this.list[index], 'showState', 2)
        } else {
          this.$set(this.list[index], 'showState', 0)
        }
      })
    }
  },
  watch: {
    content (newValue) {
      this.content = newValue
      if (this.content != null && this.content.replace(/\s*/g, '').length !== 0) {
        this.isHidden = false
      } else {
        this.isHidden = true
      }
    },
    textarea (newValue) {
      this.textarea = newValue
      if (this.textarea != null && this.textarea.replace(/\s*/g, '').length !== 0) {
        this.momentIsHidden = false
      } else {
        this.momentIsHidden = true
      }
    },
    wid (newValue) {
      this.wid = newValue
      if (this.textarea != null) {
        this.momentIsHidden = false
      }
    }
  }
}
