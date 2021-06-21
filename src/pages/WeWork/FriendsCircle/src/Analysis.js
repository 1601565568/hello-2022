import formMixin from '@nascent/ecrp-ecrm/src/mixins/form'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import moment from 'moment'
import { getErrorMsg } from '@/utils/toast'

let vm
export default {
  mixins: [formMixin, tableMixin],
  data () {
    let _minTime = null
    let _maxTime = null
    return {
      pickerOptions: {
        // 限制搜索时间为三个月
        onPick (time) {
          if (!time.maxDate) {
            let timeRange = 90 * 24 * 3600 * 1000
            _minTime = time.minDate.getTime() // 最小时间
            _maxTime = time.minDate.getTime() + timeRange // 最大时间
          } else {
            _minTime = _maxTime = null
          }
        },
        disabledDate (time) {
          // 可以选择今天
          let nowTime = new Date(new Date().toLocaleDateString()).getTime() + 86399000
          // let afterToday = Date.now() - 3600 * 1000 * 24
          if (_maxTime) {
            _maxTime = (_maxTime <= nowTime) ? _maxTime : nowTime
          } else {
            return time.getTime() > nowTime
          }
          if (_minTime && _maxTime) {
            return time.getTime() < _minTime || time.getTime() > _maxTime
          }
        }
      },
      buttonStatus: 0, // 0是高级搜索，1是重置
      treeData: [],
      // 简单搜索参数
      model: {
        name: ''
      },
      // 高级搜索参数
      searchModel: {},
      root: {
        id: 0,
        label: '全部员工',
        code: 'root',
        parentId: 0,
        disabled: true,
        children: []
      },
      emptyText: '',
      labelMaxLength: 12,
      pageSize: 50, // 每页条数
      pageNo: 1,
      total: 0, // 总条数
      totalPage: 1, // 总页数
      // 下拉门店树相关变量===开始
      shopTreePage: {
        total: 0,
        page: 1,
        size: 50,
        shopName: ''
      },
      checkStatusList: ['1', '-1'],
      shopFindList: [],
      // 下拉门店树相关变量===结束
      modelTab: {
        style: null,
        startTime: '',
        endTime: '',
        founderId: null,
        content: '',
        profileId: null
      },
      tabList: [ // 头部tab列表
        {
          name: '所有内容',
          id: null
        }
      ],
      profileId: '',
      // timeListactive: 0,
      // timeList: ['今天', '近7天', '近30天']
      time: this.changeDate(1),
      // 时间筛选
      dateList: [
        {
          label: '今天',
          value: '1day'
        }, {
          label: '近7天',
          value: '7day'
        }, {
          label: '近30天',
          value: '30day'
        }
      ],
      date: this.changeDate(1),
      // 时间选择的值
      dateValue: '1day',
      areaId: null, // 区域id
      areaName: '', // 区域名称
      shopList: [],
      debounce: null // 点击获取图表时防抖
    }
  },
  created: function () {
    vm = this
    // vm.initShopList()
    // vm.getTreeData(1)
    vm.getProfileList()
    vm.date = vm.changeDate(1)
  },
  methods: {
    /**
     * 获取对外信息列表
     */
    // 修改时间
    changeDate (day) {
      const timestamp = day * 86400000
      const nowTime = new Date(new Date().toLocaleDateString()).getTime() + 86399000
      const oldTime = nowTime - timestamp
      const startTime = moment(oldTime + 1000).format('YYYY-MM-DD HH:mm:ss')
      const endTime = moment(nowTime).format('YYYY-MM-DD HH:mm:ss')
      return [startTime, endTime]
    },
    // 根据类型修改请求时间
    handleChangeDateType (tab) {
      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        if (tab.name === 'all') {
          this.startTime = null
          this.endTime = null
        } else {
          const data = this.changeDate(parseInt(tab.name))
          this.changeModelDate(data[0], data[1])
        }
      }, 500)
    },
    // 根据值修改请求时间
    handleChangeDateValue (date) {
      if (date) {
        const startTime = date[0] || null
        const endTime = date[1] || null
        this.changeModelDate(startTime, endTime)
      } else {
        this.changeModelDate(null, null)
      }
      this.dateValue = null
    },
    changeModelDate (startTime, endTime) {
      this.time = [startTime, endTime]
      this.date = [startTime, endTime]
    },
    // 数据分析列表
    getProfileList () {
      this.$http.fetch(this.$api.weWork.friendsCircle.profileList, { start: 0, length: 999 }).then((res) => {
        if (res.success && res.result) {
          const { data } = res.result
          this.tabList = [{
            name: '所有内容',
            id: null
          }, ...data]
        }
      }).catch((resp) => {
        this.$notify.error(getErrorMsg('获取失败', resp))
      })
    },
    // tab切换
    handleTab (value) {
      if (value.name === 'null') {
        this.changeSearchfrom({ style: null, profileId: null })
      } else {
        this.changeSearchfrom({ style: null, profileId: value.name * 1 })
      }
    },
    /**
     * 设置modelTab信息
     * @param {Object} modelTab
     */
    changeSearchfrom (modelTab) {
      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        var _this = this
        this.modelTab = Object.assign({}, this.modelTab, modelTab)
        _this.$refs.table.$data.model.profileId = modelTab.profileId
        _this.$refs.table.$searchAction$()
      }, 500)
    },
    /**
     * 过滤树
     * @param val
     */
    filterNode (value, data) {
      if (!value) {
        return true
      }
      return data.label.indexOf(value) !== -1
    },
    // 查询菜单树数据
    getTreeData (pageNo) {
      this.loading = false
      this.$http.fetch(vm.$api.databaseCenter.customer.queryQyChatroomsTreeData, this.generateParams())
        .then((resp) => {
          vm.total = parseInt(resp.result.recordsTotal)
          vm.totalPage = Math.ceil(vm.total / vm.pageSize)
          vm.pageNo = pageNo
          vm.root.children = resp.result.data
          vm.$set(vm, 'treeData', [vm.root])
        }).catch(() => {
          vm.emptyText = vm.$t('prompt.noData')
          vm.$notify.error('加载失败')
        }).finally(() => {
          vm.loading = false
        })
    },
    onClick (data) {
      if (data.code !== 'root') {
        if (data.children) {
          const wxIds = []
          data.children.map(item => {
            wxIds.push(item.ext1)
          })
          this.$refs.table.$data.model.wxIds = wxIds.join(',')
        } else {
          this.$refs.table.$data.personalWxid = data.ext1
          this.$refs.table.$data.model.wxIds = data.ext1
        }
      } else {
        this.$refs.table.$data.model.wxIds = null
      }
      this.$refs.table.$searchAction$()
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.getTreeData(val)
    },
    // 构建请求参数
    generateParams () {
      const param = {}
      param.start = (this.pageNo - 1) * this.pageSize
      param.length = this.pageSize
      param.searchMap = Object.assign(this.searchModel, this.model)
      return param
    },
    // 重置树
    resetTree () {
      this.model = {}
      this.searchModel = {}
      this.getTreeData(1)
    },
    // 下拉门店树相关方法====开始
    // initShopList (page) {
    //   this.shopTreePage.page = page || 1
    //   if (this.shopTreePage.shopName) {
    //     if (this.checkStatusList.length === 0) {
    //       this.$notify.info('请先选择店铺状态')
    //       return
    //     }
    //   }
    //   this.$http.fetch(this.$api.guide.guide.customerGetGuideTree, {
    //     start: (this.shopTreePage.page - 1) * this.shopTreePage.size,
    //     length: this.shopTreePage.size,
    //     searchMap: {
    //       shopName: this.shopTreePage.shopName,
    //       shopStatus: this.checkStatusList.join(',')
    //     }
    //   }).then(resp => {
    //     if (resp.success && resp.result !== null) {
    //       this.shopTreePage.total = Number(resp.result.recordsTotal)
    //       let list = resp.result.data
    //       list.map(item => {
    //         item.children = []
    //       })
    //       this.shopFindList = list
    //       if (this.shopFindList.length > 0) {
    //         this.$nextTick(function () {
    //           this.$refs.guideTree && this.$refs.guideTree.setCurrentKey(this.shopFindList[0].id)
    //         })
    //         this.onClickNode(this.shopFindList[0])
    //       } else {
    //         this._data._table.data = []
    //         this._data._pagination.total = 0
    //         this.shuJushuzu.id = ''
    //         this.offLineShopId = ''
    //         this.setStatus()
    //         this.$emit('offLineShopId', this.offLineShopId)
    //       }
    //     }
    //   })
    // },
    // changeShopStatus () {
    //   this.initShopList()
    // },
    // 树节点过滤
    // onFilterNode (value, data, node) {
    //   // 如果什么都没填就直接返回
    //   if (!value) {
    //     return true
    //   }
    //   // 如果传入的value和data中的label相同说明是匹配到了
    //   if (data.label.indexOf(value) !== -1) {
    //     return true
    //   }
    //   // 否则要去判断它是不是选中节点的子节点
    //   return this.checkBelongToChooseNode(value, data, node)
    // },
    // 门店树选择
    onClickNode (id) {
      // 方式
      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        this.$refs.table.$data.model.areaId = id
        this.$refs.table.$data.model.shopIds = ''
        this.shopList = []
        this.$refs.table.$searchAction$()
      }, 500)
    },
    handleChangeShop (ids) {
      this.$refs.table.$data.model.shopIds = ids.join(',')
      this.$refs.table.$searchAction$()
      this.shopList = ids
    }
  }
}
