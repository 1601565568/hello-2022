import formMixin from '@nascent/ecrp-ecrm/src/mixins/form'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import { getErrorMsg } from '@/utils/toast'

let vm
export default {
  mixins: [formMixin, tableMixin],
  data () {
    return {
      // 判断客道、ecrp环境
      cloudPlatformType: this.$store.state.user.remumber.remumber_login_info.productConfig.cloudPlatformType,
      buttonStatus: 0, // 0是高级搜索，1是重置
      treeData: [],
      guideIds: '', // 店铺员工树选中后的导购id集合
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
      chooesQA: process.env.VUE_APP_THEME,
      checkQA: 'el-checkbox__innerQA',
      checks: 'el-checkbox__inner',
      fuscousQA: 'fuscousQA',
      fuscousIcon: 'fuscousIcon'
    }
  },
  created: function () {
    vm = this
    vm.initShopList()
  },
  methods: {
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
    initShopList (page) {
      this.shopTreePage.page = page || 1
      if (this.shopTreePage.shopName) {
        if (this.checkStatusList.length === 0) {
          this.$notify.info('请先选择店铺状态')
          return
        }
      }
      this.$http.fetch(this.$api.guide.guide.customerGetGuideTree, {
        start: (this.shopTreePage.page - 1) * this.shopTreePage.size,
        length: this.shopTreePage.size,
        searchMap: {
          shopName: this.shopTreePage.shopName,
          guideStatus: '1,2',
          shopStatus: this.checkStatusList.join(',')
        }
      }).then(resp => {
        if (resp.success && resp.result !== null) {
          this.shopTreePage.total = Number(resp.result.recordsTotal)
          this.shopFindList = resp.result.data
          if (this.shopFindList.length > 0) {
            this.$nextTick(function () {
              this.$refs.guideTree.setCurrentKey(this.shopFindList[0].id)
            })
            this.onClickNode(this.shopFindList[0])
          } else {
            this._data._table.data = []
            this._data._pagination.total = 0
            // this.shuJushuzu.id = ''
            this.offLineShopId = ''
            // this.setStatus()
            this.$emit('offLineShopId', this.offLineShopId)
          }
        }
      }).catch((resp) => {
        this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    changeShopStatus () {
      this.initShopList()
    },
    // 树节点过滤
    onFilterNode (value, data, node) {
      // 如果什么都没填就直接返回
      if (!value) {
        return true
      }
      // 如果传入的value和data中的label相同说明是匹配到了
      if (data.label.indexOf(value) !== -1) {
        return true
      }
      // 否则要去判断它是不是选中节点的子节点
      return this.checkBelongToChooseNode(value, data, node)
    },
    // 门店树选择
    onClickNode (data) {
      var _this = this
      if (data.code !== 'root') {
        if (data.children) {
          const guideIdArray = []
          data.children.map(item => {
            guideIdArray.push(item.id)
          })
          _this.guideIds = guideIdArray.join(',')
        } else {
          _this.guideIds = data.id
        }
      } else {
        _this.guideIds = ''
      }
      _this.$refs.table.$data.model.guideIds = _this.guideIds
      _this.$refs.table.$data.guideIds = _this.guideIds
      _this.$refs.table.$searchAction$()
    }
    // 下拉门店树相关方法====结束

  }
}
