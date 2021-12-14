
import NsDroptree from '@nascent/ecrp-ecrm/src/components/NsDroptree'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'

export default {
  components: { NsDroptree },
  mixins: [tableMixin],
  props: {
    sameSystemShopId: {
      type: Number | String
    },
    title: {
      type: String,
      default: '按门店转移'
    },
    checkNumberLength: {
      type: Number | String,
      default: 0
    },
    shopAreaTree: {
      type: Array,
      default: []
    },
    shopOptions: {
      type: Array,
      default: []
    },
    allShopOptions: {
      type: Array,
      default: []
    }
  },
  data () {
    let pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    return {
      url: this.$api.core.sysShop.queryShopList,
      _pagination: pagination,
      model: {
        auth: false,
        plan: 1
      },
      dialogVisible: false,
      departData: {
        shopArea: {},
        value: null,
        shopType: '',
        shopOptions: [],
        shopAreaTree: [],
        allShopOptions: [],
        shopName: ''
      },
      shopId: '', // 记录门店勾选的状态
      options: [{
        value: 'B',
        label: '天猫'
      }, {
        value: 'C',
        label: '淘宝店'
      }, {
        value: 'ZYD',
        label: '直营店'
      }, {
        value: 'JMD',
        label: '加盟店'
      }]
    }
  },
  watch: {
    'departData.shopArea': function (o1, o2) {
      let model = {
        auth: false,
        plan: 1,
        sameSystemShopId: this.sameSystemShopId
      }
      this.model = model
      let shopOptions = []
      this.departData.value = ''
      this.departData.shopType = ''
      if (!o1.value || o1.value !== o2.value) {
        if (o1.value === 0) {
          this.departData.shopOptions = this.departData.allShopOptions
          return
        }
        let areaIdStr = '/' + o1.value + '/'
        this.allShopOptions.map(item => {
          if (!o1.value || (item.ext && item.ext.indexOf(areaIdStr) !== -1)) {
            shopOptions.push(item)
          }
        })
        this.departData.shopOptions = shopOptions
      }
    }
  },
  methods: {
    init () {
      this.dialogVisible = true
      this.departData.shopOptions = this.shopOptions
      this.departData.shopAreaTree = this.shopAreaTree
      this.departData.allShopOptions = this.allShopOptions
      this.model = {
        ...this.model,
        sameSystemShopId: this.sameSystemShopId
      }
      this.$reload()
    },
    searchAction () {
      let model = {
        auth: false,
        plan: 1,
        sameSystemShopId: this.sameSystemShopId
      }
      if (this.departData.value) {
        this.model = {
          ...model,
          shopId: this.departData.value,
          shopType: this.departData.shopType
        }
      } else if (this.departData.shopArea.value) {
        this.model = {
          ...this.model,
          areaId: this.departData.shopArea.value,
          shopType: this.departData.shopType
        }
      } else if (this.departData.shopType) {
        this.model = {
          ...model,
          shopType: this.departData.shopType
        }
      } else {
        this.model = model
      }
      this.model.shopName = this.departData.shopName || ''
      this.$searchAction$()
    },
    resetInputAction () {
      let model = {
        auth: false,
        plan: 1,
        sameSystemShopId: this.sameSystemShopId
      }
      this.departData.shopArea = {}
      this.departData.value = ''
      this.departData.shopType = ''
      this.departData.shopName = ''
      this.model = model
      this.$searchAction$()
    },
    /**
     * 门店区域树点击事件(懒加载)
     * @param node
     * @param resolve
     * @returns {*}
     */
    loadShopAreaNode (node, resolve) {
      let shopAreaTree = this.shopAreaTree
      if (node.level === 0) { // 第一次调用
        return resolve([{
          id: 0,
          parentId: -1,
          code: 0,
          label: '全部'
        }])
      }
      if (node.level >= 1) {
        // 点击之后触发
        let filter = shopAreaTree.filter(data => {
          return parseInt(data.parentId) === parseInt(node.data.id)
        })
        if (filter && filter.length > 0) {
          resolve(filter)
        } else {
          resolve([])
        }
      }
    },
    onSave () {
      if (!this.shopId) {
        this.$notify.error('请先选择门店')
        return false
      }
      this.$emit('onSave')
    },
    close () {
      this.$emit('close')
    }
  },
  created () {
  },
  mounted () {
  }

}
