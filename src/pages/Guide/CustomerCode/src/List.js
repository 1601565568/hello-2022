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
      url: this.$api.guide.customerCode.findList,
      // 筛选数据
      model: {
        guideIds: [],
        name: '',
        startTime: '',
        endTime: '',
        status: -1
      },
      // 筛选日期
      seachDate: [],
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
      drawer: false,
      CheckTagDrawerVisible: false,
      CheckTagList: [],
      // 侧边栏信息
      itemDate: {},
      activeIndex: -1,
      scopeName: process.env.VUE_APP_THEME,
      nameText: 'scope-name_text',
      nameTextQA: 'scope-name_textQA'
    }
  },
  mixins: [tableMixin],
  methods: {
    openTagDrawer (tagsStr) {
      this.CheckTagDrawerVisible = true
      this.CheckTagList = tagsStr.split(',')
    },
    handleDetail (query = {}) {
      this.$router.push({
        path: '/Social/SocialOperation/CustomerCode/Edit',
        query
      })
    },
    changeSearchfrom (obj = {}) {
      this.model = Object.assign(this.model, obj)
      this.$searchAction$()
    },
    handleChangeGuide (value) {
      this.changeSearchfrom({ guideIds: value })
    },
    handleSearch () {
      this.changeSearchfrom({ name: this.seachVal })
    },
    // 编辑
    handleEdit (obj) {
      this.handleDetail(obj)
    },
    handleEnd (guestCodeId) {
      this.$confirm('确定要结束活动吗？结束后将无法再开启', {
        confirmButtonText: '确定',
        type: 'warning',
        cancelButtonText: '取消'
      }).then(() => {
        this.endActivity(guestCodeId)
      })
    },
    // 结束活动
    endActivity (guestCodeId) {
      this.$http.fetch(this.$api.guide.customerCode.closeGuestCodeActivity, { guestCodeId })
        .then(() => {
          this.$searchAction$()
        }).catch(() => {
          vm.$notify.error('操作失败')
        })
    },
    // 去报表
    handleAnalysis (param) {
      this.$router.push({
        path: '/Social/SocialOperation/CustomerCode/Analysis',
        query: { guestCodeId: param.guestCodeId, validTimeStart: param.validTimeStart }
      })
    },
    // 关闭弹框
    handleClose () {
      this.activeIndex = -1
      this.drawer = false
    },
    // 打开侧边弹框
    handleShowDetail (item, index) {
      this.activeIndex = index
      this.loadActivity(item.guestCodeId)
    },
    // 请求详情信息
    loadActivity (guestCodeId) {
      this.$http.fetch(this.$api.guide.customerCode.getByGuestCodeId, { guestCodeId }).then(res => {
        const { result } = res
        this.itemDate = {
          ...result,
          statusColor: this.statusList[result.status].color,
          statusText: this.statusList[result.status].value,
          activityIntroductionHtml: this.jsonTotext(result.activityIntroduction)
        }
        this.drawer = true
      })
    },
    jsonTotext (string) {
      const tools = [
        { id: 'EXTERNAL_CONTACT_NICK', value: '好友微信昵称' },
        { id: 'USER_NICK', value: '员工微信昵称' },
        { id: 'PROMOTION_URL', value: '推广大师查询链接' },
        { id: 'RECRUIT_URL', value: '招募链接' },
        { id: 'ACTIVITY_VALIT_TIME', value: '活动有效时间' }
      ]
      tools.map(item => {
        const regexp = new RegExp('{' + item.id + '}', 'g')
        string = string.replace(regexp, `<span style="background: #E8E8E8;border-radius: 12px;border-radius: 12px;padding:0 8px;margin:0 8px;font-size: 14px;color: #262626;line-height: 23px;">${item.value}</span>`).replace('\n', ' <br /> ')
      })
      return string
    },
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex === this.activeIndex) {
        return { backgroundColor: '#D9EFFE' }
      }
      return ''
    },
    getOhterGuide (type, cb) {
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
    }
  },
  watch: {
    seachDate (newVal) {
      const date = newVal || [null, null]
      this.changeSearchfrom({ startTime: date[0], endTime: date[1] })
    }
  },
  mounted () {
    this.$searchAction$()
  }
}
