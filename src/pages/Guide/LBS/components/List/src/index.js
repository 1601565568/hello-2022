import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
export default {
  data () {
    return {
      pagination4Emp: {
        enable: true,
        size: 15,
        sizeOpts: [15, 25, 50, 100],
        page: 1,
        total: 0
      },
      // 筛选数据
      model: {
        shopIdList: [],
        name: '',
        state: null
      },
      // 筛选名称
      seachVal: '',
      // 活动状态列表
      statusOptionList: [
        {
          label: '全部',
          value: null
        },
        {
          label: '未开始',
          value: 0
        },
        {
          label: '进行中',
          value: 1
        },
        {
          label: '已结束',
          value: 2
        },
        {
          label: '提前结束',
          value: 3
        }
      ],
      // 状态列表
      statusList: {
        2: {
          value: '已结束',
          color: 'info'
        },
        0: {
          value: '未开始',
          color: 'warning'
        },
        1: {
          value: '进行中',
          color: 'success'
        },
        3: {
          value: '提前结束',
          color: 'info'
        }
      },
      showEditState: [0, 1], // 展示编辑和结束活动的状态 进行中 或 未开始
      // 查看参与门店弹框
      drawer: false,
      // 弹框信息
      dialogVisible: false,
      // 侧边栏信息
      itemDate: {
        data: [],
        page: {
          enable: true,
          size: 15,
          sizeOpts: [15, 25, 50, 100],
          page: 1,
          total: 0
        }
      },
      // 弹框信息
      dialogData: {
        activityName: '', // 活动名称
        link: '', // 链接地址
        placard: '', // 海报地址
        qrcode: '', // 二维码地址
        guid: '', // 选择活动id
        type: '' // 弹框类型 预览海报 poster 预览二维码qrcode
      },
      activeIndex: -1,
      messageQA: process.env.VUE_APP_THEME,
      messageIconQA: 'scope_tipQA',
      messageIcon: 'scope_tip',
      fuscousQA: 'fuscousQA',
      fuscousIcon: 'fuscousIcon'
    }
  },
  props: {
    type: {
      default: 'Group' // Group 群拉新 Friends 好友拉新
    }
  },
  computed: {
    headerTip () {
      return ''
      // return this.type === 'Group' ? '需向企业微信申请企业白名单，才可使用此功能' : ''
    },
    title () {
      return this.type === 'Friends' ? 'LBS好友拉新活动' : 'LBS群拉新活动'
    },
    // 详情页面路径
    detailPath () {
      return this.type === 'Group' ? '/Guide/LBS/Group/Edit' : '/Guide/LBS/Friends/Edit'
    },
    // 报表页面路径
    analysisPath () {
      return this.type === 'Group' ? '/Guide/LBS/Group/Analysis' : '/Guide/LBS/Friends/Analysis'
    },
    // 列表数据接口路由
    url () {
      return this.type === 'Group' ? this.$api.guide.lbs.findGroupList : this.$api.guide.lbs.findFriendsList
    },
    // 删除数据接口路由
    deleteApi () {
      return this.type === 'Group' ? this.$api.guide.lbs.deleteGroupById : this.$api.guide.lbs.deleteFriendsById
    },
    // 删除提示
    endTip () {
      return this.type === 'Group' ? '结束后将无法再开启，此活动码将失效，消费者无法扫码入群。' : '结束后将无法再开启，此活动码将失效，消费者无法扫码添加员工企业微信。'
    }
  },
  mixins: [tableMixin],
  methods: {
    // 搜索
    // 修改搜索项
    changeSearchfrom (obj = {}) {
      this.model = Object.assign(this.model, obj)
      this.$searchAction$()
    },
    // 选择门店
    handleChangeShop (value) {
      this.changeSearchfrom({ shopIdList: value })
    },
    handleSearch () {
      this.changeSearchfrom({ name: this.seachVal })
    },

    // 查看门店操作
    // 关闭弹框
    handleClose () {
      this.activeIndex = -1
      this.drawer = false
    },
    // 打开侧边弹框
    handleShowDetail (item, index) {
      this.activeIndex = index
      this.dialogData.guid = item.guid
      this.drawer = true
    },
    // 查看门店当前选择的活动
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex === this.activeIndex) {
        return { backgroundColor: '#D9EFFE' }
      }
      return ''
    },
    // 查看门店选择上一个或下一个活动
    getOhter (type, cb) {
      const { page, size, total } = this._data._pagination
      if (type === 'prev') {
        if (this.activeIndex === 0) {
          if (page === 1) {
            this.$notify.error('暂无上一个')
          } else {
            this._data._pagination.page = page - 1
            this.$queryList$(this.$generateParams$()).then(() => {
              const index = this._data._table.data.length - 1
              cb(this._data._table.data[index], index)
            })
          }
        } else {
          const index = this.activeIndex - 1
          cb(this._data._table.data[index], index)
        }
      } else if (type === 'next') {
        if (((page - 1) * size + this.activeIndex + 1) >= total) {
          this.$notify.error('暂无下一个')
        } else {
          if (this.activeIndex === size - 1) {
            this._data._pagination.page = page + 1
            this.$queryList$(this.$generateParams$()).then(() => {
              const index = 0
              cb(this._data._table.data[index], index)
            })
          } else {
            const index = this.activeIndex + 1
            cb(this._data._table.data[index], index)
          }
        }
      }
    },

    // 数据操作栏
    // 是否展示编辑和结束按钮
    isShowEdit (item) {
      if (item.isCompile) {
        return this.showEditState.includes(item.state)
      }
      return false
    },
    // 查看海报
    handlePreviewPoster (item) {
      this.dialogData.activityName = item.name
      this.dialogData.placard = item.activityPosterUrl
      this.dialogData.link = item.activityQrcode
      this.dialogData.type = 'poster'
      this.dialogVisible = true
    },
    // 查看二维码
    handlePreviewQrcode (item) {
      this.dialogData.activityName = item.name
      this.dialogData.placard = item.activityQrcode
      this.dialogData.type = 'qrcode'
      this.dialogVisible = true
    },
    // 结束活动
    handleEnd (guid, createId) {
      this.$confirm(this.endTip, '确定要结束活动吗？', {
        confirmButtonText: '确定',
        type: 'warning',
        cancelButtonText: '取消'
      }).then(() => {
        this.endActivity(guid, createId)
      })
    },
    // 结束活动api
    endActivity (guid, createId) {
      this.$http.fetch(this.deleteApi, { guid, createId })
        .then(() => {
          this.$searchAction$()
        }).catch(() => {
          vm.$notify.error('操作失败')
        })
    },
    // 去报表
    handleAnalysis (guid, name, state) {
      this.$router.push({
        path: this.analysisPath,
        query: { guid, name, state }
      })
    },
    // 跳转详情
    handleDetail (query = {}) {
      this.$router.push({
        path: this.detailPath,
        query
      })
    }
    //
  },
  mounted () {
    this.$searchAction$()
  }
}
