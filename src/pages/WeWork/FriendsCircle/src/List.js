export default {
  data () {
    return {
      statusOptionList: [
        {
          label: '全部',
          value: null
        }
      ],
      model: {
        styleType: null,
        startTime: '',
        endTime: '',
        creater: '',
        searchVal: ''
      },
      seachVal: '', // 搜索字段
      seachDate: [], // 时间字段
      _pagination: {
        enable: true,
        size: 15,
        sizeOpts: [15, 25, 50, 100],
        page: 1,
        total: 0
      },
      tabList: [ // tab列表
        {
          label: '所有内容',
          id: null
        },
        {
          label: '小朋友圈1',
          id: 1
        },
        {
          label: '小朋友圈2',
          id: 2
        }
      ],
      checkedTab: null // 选中的tab
    }
  },
  methods: {
    /**
     * 切换头部活动
     * @param {number｜string｜null} id
     */
    handleChangeTab (id) {
      this.checkedTab = id
    },
    /**
     * 设置model信息
     * @param {Object} model
     */
    changeSearchfrom (model) {
      this.model = Object.assign({}, this.model, model)
    },
    /**
     * 搜索
     * @param {string} searchVal
     */
    handleSearch (searchVal) {
      this.changeSearchfrom({ searchVal })
    },
    handleChangeGuide (creater) {
      this.changeSearchfrom({ creater })
    },
    /**
     * 修改页面
     * @param {string} type
     */
    handleChangePage (type) {
      const refs = this.$refs.allTable || this.$refs.eachTable
      refs[type]()
    },
    /**
     * 修改页面
     * @param {string} type
     */
    handleDetail () {
      this.$router.push({
        path: '/Marketing/FriendsCircle/Edit'
      })
    }
  }
}
