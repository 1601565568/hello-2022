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
        shopIds: [],
        name: '',
        status: -1
      },
      // 筛选名称
      seachVal: '',
      // 活动状态列表
      statusOptionList: [
        {
          label: '全部',
          value: -1
        },
        {
          label: '已结束',
          value: 0
        },
        {
          label: '未开始',
          value: 1
        },
        {
          label: '进行中',
          value: 2
        },
        {
          label: '提前结束',
          value: 3
        }
      ],
      // 状态列表
      statusList: {
        0: {
          value: '已结束',
          color: 'info'
        },
        1: {
          value: '未开始',
          color: 'warning'
        },
        2: {
          value: '进行中',
          color: 'success'
        },
        3: {
          value: '提前结束',
          color: 'info'
        }
      },
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
        placard: '', // 海报地址
        qrcode: '', // 二维码地址
        lbsId: '', // 选择活动id
        type: '' // 弹框类型 预览海报 poster 预览二维码qrcode
      },
      activeIndex: -1
      // data: [{
      //   activityPlacard: 'https://shopguide.oss-cn-hangzhou.aliyuncs.com/GUIDE_GUEST_CODE/10000146/1611905489511/ceff2192-b277-4376-914a-0ff1c0c54570.png', // 海报
      //   createTime: '2021-01-29 15:31:30', // 创建时间
      //   loginAccount: 'lhl', // 创建人
      //   name: '2222', // 活动名称
      //   status: 2, // 状态  0 ：已结束 1：未开始 2：进行中 3: 提前结束
      //   validTimeEnd: '2021-02-22 23:59:59', // 开始时间
      //   validTimeStart: '2021-01-30 00:00:00', // 结束时间
      //   validTimeType: 1, // 0: 永久 1: 非永久
      //   shopNumber: 12, // 门店数量
      //   qrcode: 'https://shopguide.oss-cn-hangzhou.aliyuncs.com/GUIDE_GUEST_CODE/10000146/1611905489511/ceff2192-b277-4376-914a-0ff1c0c54570.png', // 二维码
      //   lbsId: '123111' // 唯一标示
      // }, {
      //   activityPlacard: 'https://shopguide.oss-cn-hangzhou.aliyuncs.com/GUIDE_GUEST_CODE/10000146/1611905489511/ceff2192-b277-4376-914a-0ff1c0c54570.png', // 海报
      //   createTime: '2021-01-29 15:31:30', // 创建时间
      //   loginAccount: 'lhl', // 创建人
      //   name: '2222', // 活动名称
      //   status: 2, // 状态  0 ：已结束 1：未开始 2：进行中 3: 提前结束
      //   validTimeEnd: '2021-02-22 23:59:59', // 开始时间
      //   validTimeStart: '2021-01-30 00:00:00', // 结束时间
      //   validTimeType: 1, // 0: 永久 1: 非永久
      //   shopNumber: 12, // 门店数量
      //   qrcode: 'https://shopguide.oss-cn-hangzhou.aliyuncs.com/GUIDE_GUEST_CODE/10000146/1611905489511/ceff2192-b277-4376-914a-0ff1c0c54570.png', // 二维码
      //   lbsId: '3333' // 唯一标示
      // }]
    }
  },
  props: {
    type: {
      default: 'Group' // Group 群拉新 Friends 好友拉新
    }
  },
  computed: {
    title () {
      return this.type === 'Friends' ? 'LBS好友拉新活动' : 'LBS群拉新活动'
    },
    // 详情页面路径
    detailPath () {
      return this.type === 'Group' ? '/Social/LBS/Group/Edit' : '/Social/LBS/Friends/Edit'
    },
    // 报表页面路径
    analysisPath () {
      return this.type === 'Group' ? '/Social/LBS/Group/Analysis' : '/Social/LBS/Friends/Analysis'
    },
    // 列表数据接口路由
    url () {
      return this.type === 'Group' ? this.$api.guide.lbs.findGroupList : this.$api.guide.lbs.findFriendsList
    },
    // 删除数据接口路由
    deleteApi () {
      return this.type === 'Group' ? this.$api.guide.lbs.deleteGroupById : this.$api.guide.lbs.deleteFriendsById
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
      this.changeSearchfrom({ shopIds: value })
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
      this.dialogData.lbsId = item.id
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
    // 查看海报
    handlePreviewPoster (item) {
      this.dialogData.placard = item.activityPlacard
      this.dialogData.type = 'poster'
      this.dialogVisible = true
    },
    // 查看二维码
    handlePreviewQrcode (item) {
      this.dialogData.placard = item.activityPlacard
      this.dialogData.type = 'qrcode'
      this.dialogVisible = true
    },
    // 结束活动
    handleEnd (lbsId) {
      this.$confirm('确定要结束活动吗？\n\r结束后将无法再开启，此活动码将失效，消费者无法扫码入群。', '提示信息', {
        confirmButtonText: '确定',
        type: 'warning',
        cancelButtonText: '取消'
      }).then(() => {
        this.endActivity(lbsId)
      })
    },
    // 结束活动api
    endActivity (lbsId) {
      this.$http.fetch(deleteApi, { lbsId })
        .then(() => {
          this.$searchAction$()
        }).catch(() => {
          vm.$notify.error('操作失败')
        })
    },
    // 去报表
    handleAnalysis (guid, name) {
      this.$router.push({
        path: this.analysisPath,
        query: { guid, name }
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
