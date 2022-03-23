import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import scrollHeight from '@nascent/ecrp-ecrm/src/mixins/scrollHeight'
import { getErrorMsg } from '@/utils/toast'
import $ from 'jquery'

export default {
  name: 'NsTableGuide',
  mixins: [tableMixin, scrollHeight],
  props: {
    url: Object
  },
  data: function () {
    let pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    const tableButtons = [
      {
        func: function () {
          this.$emit('synchronousStores')
        },
        name: '批量下载招募码',
        code: true,
        auth: false
      }
    ]
    const operateButtons = [
      {
        func: function (args) {
          this.$emit('onAddCustomer', args.row)
        },
        icon: '',
        name: '编辑',
        auth: '',
        visible: ''
      },
      {
        func: function (args) {
          this.$emit('ondelete', args.row)
        },
        icon: '',
        name: '删除',
        auth: '',
        visible: '',
        color: '#f00'
      },
      {
        func: function (args) {
          this.$emit('quit', args.row)
        },
        icon: '',
        name: '离职',
        auth: '',
        visible: ''
      }
    ]
    let quickInput = [
      {
        template: '',
        inline: false,
        name: 'name',
        text: '任务名称',
        placeholder: '请输入任务名称',
        type: 'text',
        value: ''
      }
    ]
    let quickSearchNames = quickInput.map(x => x.name)
    let quickSearchModel = {}
    var findVo = {
      viewId: null, // 视角id
      name: null,
      shopName: null, // 门店名称
      shopId: null, // 门店ID
      city: null, // 门点所在区域市
      district: null, // 门点所在区域区
      province: null, // 门点所在区域省
      shopType: null, // 门店类型
      phone: null, // 联系电话
      area_region: null, // 所属地区
      shopStatus: null, // 营业状态
      area: [], // 所属区域
      areaId: '',
      areaName: ''
    }
    let model = Object.assign({}, findVo)
    return {
      // 滚动区域配置
      scrollBarDeploy: [
        {
          ref: 'pageLeft', // 页面左边滚动条ref的名称
          excludeHeight: 85
        },
        {
          ref: 'pageRight', // 页面右边滚动条ref的名称
          excludeHeight: 0
        }
      ],
      model: model,
      filterTreeText: '',
      quickSearchModel: quickSearchModel,
      _pagination: pagination,
      _table: {
        table_buttons: tableButtons,
        operate_buttons: operateButtons,
        quickSearchNames: quickSearchNames,
        quickSearchMap: {}
      },
      _queryConfig: { expand: false },
      multipleSelection: [],
      select: true,
      selectedArr: [],
      digitalShopList: [],
      digitalShopListLength: [],
      offsetHeight: false,
      shopLeiXing: [
        {
          value: 'LYD',
          label: '联营店'
        },
        {
          value: 'ZYD',
          label: '直营店'
        },
        {
          value: 'JMD',
          label: '加盟店'
        }
      ],
      operatingStatus: [
        {
          value: -2,
          label: '已关店'
        },
        {
          value: -1,
          label: '暂停营业'
        },
        {
          value: 1,
          label: '正常营业'
        }
      ],
      searchform: {
        // 区域选择相关start
        key: {
          children: 'children',
          label: 'label',
          value: 'label',
          disabled: 'disabled'
        }
      },
      shopTreePage: {
        total: 0,
        page: 1,
        size: 50,
        areaName: ''
      },
      fuscous: process.env.VUE_APP_THEME,
      fuscousQA: 'fuscousQA',
      fuscousIcon: 'fuscousIcon'
    }
  },
  mounted: function () {
    var vm = this
    vm.initDigitalShopList()
    // let limitHeight =
    //   window.innerHeight -
    //   40 -
    //   10 -
    //   this.$refs.shopTreeDiv.$el.getBoundingClientRect().top
    // this.$refs.shopTreeDiv.$el.children[0].style.height = limitHeight + 'px'
  },
  updated () {
    if (this.$refs.elTree) {
      this.$refs.elTree.offsetHeight > window.screen.availHeight
        ? (this.offsetHeight = true)
        : (this.offsetHeight = false)
    }
  },
  computed: {
    /**
     * 视角范围 1-不同品牌不同视角，2-不同区域不同视角
     */
    viewRange () {
      return this.$store.state.user.remumber.remumber_login_info.productConfig
        .viewRange
    },
    currentNodeKey () {
      return this.digitalShopList.length > 0 ? this.digitalShopList[0].id : '0'
    }
  },
  methods: {
    async scopeRowCountAndviewDetails (succeedObj) {
      // 查看门店详情和查看所属区域详情
      let that = this
      let obj = {}
      obj.templateId = succeedObj.template_id
      obj.appId = succeedObj.app_id
      that.particularsObj = {}
      await this.$http
        .fetch(that.$api.isv.getTemplateInfo, obj)
        .then(resp => {
          resp.result.audit_category = JSON.parse(resp.result.audit_category)
          that.particularsObj = resp.result
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
    },
    // 复选框
    selectable (row, index) {
      if (row.shopStatus === 1 || row.shopStatus === -1) {
        return true
      } else {
        return false
      }
    },
    onClickNode (data) {
      // 重置所有参数
      this.$resetInput$()
      this.model.areaId = data.id
      this.model.areaName = data.label
      this.$searchAction$()
    },
    resetInputAction () {
      // 重置所有参数
      let areaId = this.model.areaId
      let areaName = this.model.areaName
      // 重置所有参数
      this.$resetInput$()
      this.model.areaId = areaId
      this.model.areaName = areaName
      this.$searchAction$()
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
    // 判断传入的节点是不是选中节点的子节点
    checkBelongToChooseNode (value, data, node) {
      const level = node.level
      // 如果传入的节点本身就是一级节点就不用校验了
      if (level === 1) {
        return false
      }
      // 先取当前节点的父节点
      let parentData = node.parent
      // 遍历当前节点的父节点
      let index = 0
      while (index < level - 1) {
        // 如果匹配到直接返回
        if (parentData.data.label.indexOf(value) !== -1) {
          return true
        }
        // 否则的话再往上一层做匹配
        parentData = parentData.parent
        index++
      }
      // 没匹配到返回false
      return false
    },
    elIconMenu (row) {
      this.$http
        .fetch(this.$api.guide.shop.findIsShopLegal, {
          shopId: row.id
          // viewId: this.model.viewId
        })
        .then(resp => {
          if (resp.success) {
            this.$emit('elIconMenu', { row, viewId: this.model.viewId })
          }
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('下载失败', resp))
        })
    },
    scopeRowCount (data) {
      // 查看数字门店详情
      this.$emit('scopeRowCount', data)
    },
    onAreaChange () {
      // 城市切换进行赋值
      let that = this
      that.model.district = that.model.area[2]
      that.model.city = that.model.area[1]
      that.model.province = that.model.area[0]
    },
    // 区域列表
    initDigitalShopList (page) {
      this.shopTreePage.page = page || 1
      var _this = this
      this.$http
        .fetch(_this.$api.guide.shop.findDigitalShopList, {
          start: (this.shopTreePage.page - 1) * this.shopTreePage.size,
          length: this.shopTreePage.size,
          searchMap: {
            areaName: this.shopTreePage.areaName
          }
        })
        .then(resp => {
          if (resp.success && resp.result !== null) {
            if (resp.result.data.length) {
              this.shopTreePage.total = Number(resp.result.recordsTotal)
              this.digitalShopList = resp.result.data
              this.model.areaId = this.digitalShopList[0].id
              this.model.areaName = this.digitalShopList[0].label
              this.$searchAction$()
            } else {
              this.$notify.info('暂无区域')
            }
          }
        })
        .catch(resp => {
          _this.$notify.error(getErrorMsg('查询失败', resp))
        })
    },
    shopDel (index) {
      this.guideShopList.splice(index, 1)
    },
    disabled (shopId) {
      let retVal = this.guideShopList.some(item => {
        return item.shopId === shopId
      })
      return retVal
    },
    thisGuideDisabled (guideId) {
      let retVal = this.guideShopList.some(item => {
        return item.id === guideId
      })
      return retVal
    },
    // 选择门店
    handleSelectionChange (val) {
      this.selectedArr = val
      val.length > 0 ? (this.select = false) : (this.select = true)
    },
    // 批量下载门店二维码
    downloadQrod () {
      if (this.selectedArr.length < 1) {
        this.$notify.error('请选择门店')
        return
      }
      let shopId = []
      this.selectedArr.forEach(shop => {
        if (shop.id !== '' && shop.id != null) {
          shopId.push(shop.id)
        }
      })
      this.$emit('batchElIconMenu', {
        row: shopId.join(','),
        viewId: this.model.viewId
      })
    },
    onRedactFun (val) {
      this.$emit('onRedactFun', val)
    },
    onDelsTipFun (val) {
      this.$emit('onDelsTipFun', val)
    },
    dimissionFun (val) {
      this.$emit('dimissionFun', val)
    },
    // 解析后台传进来的字符串
    strToJson (str) {
      if (str && str.length > 0) {
        return JSON.parse(str)
      } else {
        return null
      }
    },
    getListFirst (list) {
      if (list && list.length > 0) {
        return list[0]
      } else {
        return {
          district: '',
          name: '',
          job: ''
        }
      }
    },
    changeState (state, id) {
      let _this = this
      _this.$http
        .fetch(_this.$api.guide.guide.updateGuideStatus, {
          guideId: id,
          status: state
        })
        .then(resp => {
          if (resp.success) {
            _this.$notify.success('切换成功！')
          } else {
            _this.$notify.error(getErrorMsg('切换失败，原因', resp))
          }
        })
        .catch(resp => {
          _this.$notify.error(getErrorMsg('查询失败', resp))
        })
    }
  },
  watch: {
    // 导购树过滤
    filterTreeText (val) {
      this.$refs.shopTree.filter(val)
    },
    'shopTreePage.areaName' (val) {
      this.$refs.shopTree.filter(val)
    }
  }
}
