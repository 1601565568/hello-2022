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
      }
    }
  },
  mixins: [tableMixin],
  methods: {
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
    handleAnalysis (guestCodeId) {
      this.$router.push({
        path: '/Social/SocialOperation/CustomerCode/Analysis',
        query: { guestCodeId }
      })
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
