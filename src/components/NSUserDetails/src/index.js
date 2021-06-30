import avartar from '../images/avartar.png'
import ElImage from '@nascent/nui/lib/image'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import ViewSelect from '@/components/NsViewSelect'
export default {
  props: {
    userDetails: {
      type: Object
    }
  },
  components: { ElImage, ViewSelect },
  mixins: [tableMixin],
  data () {
    let integralPagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    return {
      avartar,
      integralPagination: integralPagination,
      integralIsShow: [false, false, false, false, false],
      rfmInfo: {}, // rfm信息
      integralIsNum: [0, 0, 0, 0, 0], // 控制会员详情积分
      integralLogIsShow: [false, false, false, false, false],
      integralName: ['', '', '', '', ''], // 控制会员详情积分
      integralAliasName: ['', '', '', '', ''], // 积分别名
      shopKuhuShow: false,
      activeTab: {}, // 切换tab之后保存数据，以防止第二次重新打开不请求表格数据
      accountCode: {}, // 用于保存积分账号
      endTime: '',
      startTime: '',
      currentIndex: '',
      // 弹窗假数据
      selectedTabName: 'basic',
      integralAccountArr: [],
      tableData: [],
      searchParam: {}, // 积分查询条件
      items: {},
      viewList: [],
      viewId: '',
      shopId: '',
      unionId: ''
    }
  },
  computed: {
    /**
     * 区域id
     */
    areaId () {
      return this.$store.state.user.area.id
    }
  },
  mounted () {
    // this.init()
    this.findViewList()
  },
  methods: {
    async showDetailDialog (val) {
      this.shopId = val.shopId
      this.unionId = val.unionid
      this.shopKuhuShow = true
      this.customerGetDetail()
    },
    customerGetDetail () {
      // 查询会员详情
      // 无union_id则不支持查询详情
      if (this.unionId && this.unionId !== '') {
        this.$http.fetch(this.$api.guide.guide.customerGetDetail, {
          unionId: this.unionId,
          shopId: this.shopId,
          viewId: this.viewId
        }).then(resp => {
          if (resp.success && resp.result != null) {
            this.items = resp.result
            if (Object.keys(this.items).length > 0) {
              this.init()
            }
          }
        }).catch((resp) => {
          this.$notify.error('好友在视角中不存在，无法查看详情')
        })
      } else {
        this.$notify.warning('好友UNION_ID不存在,不支持查询详情')
      }
    },
    // 查询区域对应的视角列表
    findViewList () {
      this.$http.fetch(this.$api.core.common.findViewListByAreaId, { areaId: this.areaId })
        .then(res => {
          if (res.success) {
            if (res.result.length) {
              this.viewList = res.result
              this.viewId = res.result[0].viewId
            }
          } else {
            this.$notify.error(res.msg)
          }
        }).catch(res => {
          this.$notify.error('视角列表查询失败')
        })
    },
    viewChange () {
      this.customerGetDetail()
    },
    closeDetailDialog () {
      this.shopId = ''
      this.unionId = ''
      this.shopKuhuShow = false
      this.selectedTabName = 'basic'
      this.startTime = null
      this.endTime = null
      this.accountCode = {}
      this.searchParam = {}
      this.integralIsShow = [false, false, false, false, false]
      this.integralIsNum = [0, 0, 0, 0, 0] // 控制会员详情积分
      this.integralName = ['', '', '', '', '']
      this.integralAliasName = ['', '', '', '', '']
      // this.$emit('closeDetailDialog')
      // 重置tabs 分页组件size大小
      for (let i = 1; i <= this.integralLogIsShow.length; i++) {
        if (this.integralLogIsShow[i - 1]) {
          let name = 'integralPage' + i
          if (this.$refs[name] && this.$refs[name].internalPageSize) {
            this.$refs[name].internalPageSize = 15
          }
        }
      }
    },
    init () {
      let _this = this
      // if (this.activeTab && this.activeTab.label) {
      //   this.handleClick(this.activeTab)
      // }
      if (_this.items.integralAccountList) {
        let length = _this.items.integralAccountList.length
        for (let i = 0; i < length; i++) {
          this.$set(_this.integralLogIsShow, i, true)
          // 积分名称
          this.$set(
            this.integralName,
            i,
            _this.items.integralAccountList[i].integralName
          )
          this.$set(
            this.integralAliasName,
            i,
            _this.items.integralAccountList[i].integralAlias
          )
          // 积分显示
          this.$set(this.integralIsShow, i, true)
          this.$set(
            this.integralAliasName,
            i,
            _this.items.integralAccountList[i].integralAlias
          )
          this.accountCode[this.integralName[i]] =
            _this.items.integralAccountList[i].integralAccount
          // _this.integralLogIsShow[i] = true
          // // 积分名称
          // this.integralName[i] = _this.items.integralAccountList[i].integralName
          // this.integralAliasName[i] =
          //   _this.items.integralAccountList[i].integralAlias
          // // 积分显示
          // this.integralIsShow[i] = true
          // this.accountCode[this.integralName[i]] =
          //   _this.items.integralAccountList[i].integralAccount
        }
        _this.integralAccountArr.push(_this.items.integralAccountList)
      }
    },
    // 初始化参数
    restParams () {
      this.searchParam = {}
      this.startTime = null
      this.endTime = null
    },
    handleClick (tab, event) {
      const _this = this
      this.activeTab = tab
      // 假如切换到积分tab
      if (
        tab.label.indexOf('基础信息') === -1 &&
        tab.label.indexOf('交易信息') === -1
      ) {
        this.restParams()
        let tabName = tab.label
        this.currentIndex = tab.label
        let accountCode = this.accountCode[tab.label]
        this.searchParam.accountCode = accountCode
        this.searchParam.nick = this.items.customerId
        this.searchParam.length = this.integralPagination.size
        this.searchParam.pageNo = this.integralPagination.page
        this.getIntegralList(tabName)
      } else if (tab.label.indexOf('交易') > -1) {
        this.getCustomerRfmInfo(
          this.items.customerId,
          this.items.sgShopId === 0 ? this.items.shopId : this.items.sgShopId
        )
      }
      if (_this.items.assetJson) {
        let assetJson = JSON.parse(_this.items.assetJson)
        let length = _this.items.integralAccountList ? _this.items.integralAccountList.length : 0
        for (let name in assetJson) {
          for (let i = 0; i < length; i++) {
            // 积分别名
            let accountCode = _this.items.integralAccountList[i].integralAccount
            if (accountCode.indexOf(name) > -1) {
              this.integralIsNum[i] = assetJson[name]
            }
          }
        }
      }
      _this.items.province = _this.disposeArea(
        _this.items.province,
        _this.items.city
      )
    },
    // 处理区域信息
    disposeArea (province, city) {
      let area = ''
      if (province) {
        area += province
      }
      if (city) {
        area += city
      }
      if (area.length === 0) {
        return '-'
      }
      return area
    },
    // 开始时间清除处理
    disposeStartTime (value) {
      if (!value) {
        this.startTime = null
      }
    },
    // 结束时间清除处理
    disposeEndTime (value) {
      if (!value) {
        this.endTime = null
      }
    },
    // 积分分页-页数改变
    integralPageChange (page) {
      this.searchParam.pageNo = page
      this.getIntegralList(this.currentIndex)
    },
    // 积分分页-大小改变
    integralSizeChange (pageSize) {
      this.searchParam.length = pageSize
      this.searchParam.pageNo = 1
      this.getIntegralList(this.currentIndex)
    },
    // 积分搜索
    seachIntegral (index) {
      let startTime = this.startTime
      let endTime = this.endTime
      if ((!startTime && endTime) || (startTime && !endTime)) {
        this.$notify.error('开始时间和结束时间都要选择')
        return
      }
      if (startTime > endTime) {
        this.$notify.error('开始时间必须小于结束时间')
        return
      }
      this.searchParam.startTime = startTime
      this.searchParam.endTime = endTime
      this.getIntegralList(this.integralName[index])
    },
    getIntegralList (tabName) {
      // 查询会员积分
      this.$http
        .fetch(this.$api.guide.guide.queryCustomerIntegral, this.searchParam)
        .then(resp => {
          this.integralPagination.total = parseInt(resp.result.total)
          this.$set(this.tableData, tabName, resp.result.data)
        })
        .catch(resp => {
          this.$notify.error('查询失败')
        })
    },
    getCustomerRfmInfo (customerId, shopId) {
      // 查询会员Rfm信息
      this.$http
        .fetch(this.$api.guide.guide.queryCustomerRfmInfo, {
          customerId: customerId,
          shopId: shopId,
          viewId: this.viewId
        })
        .then(resp => {
          this.rfmInfo = resp.result
        })
        .catch(resp => {
          this.$notify.error('查询失败')
        })
    }
  }
}
