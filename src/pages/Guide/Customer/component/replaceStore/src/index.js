
import NsDroptree from '@nascent/ecrp-ecrm/src/components/NsDroptree'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'

export default {
  components: { NsDroptree },
  mixins: [tableMixin],
  props: {
    title: {
      type: String,
      default: '按门店转移'
    },
    checkNumberLength: {
      type: Number,
      default: 0
    },
    shopCateTree: {
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
        shopCate: {},
        value: null,
        shopType: '',
        shopOptions: [],
        shopCateTree: [],
        allShopOptions: []
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
    'departData.shopCate': function (o1, o2) {
      let model = {
        auth: false,
        plan: 1
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
        this.allShopOptions.map(item => {
          if (!o1.value || (item.ext && item.ext.indexOf(o1.value) !== -1)) {
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
      this.departData.shopCateTree = this.shopCateTree
      this.departData.allShopOptions = this.allShopOptions
      this.$reload()
    },
    searchAction () {
      let model = {
        auth: false,
        plan: 1
      }
      if (this.departData.value) {
        this.model = {
          ...model,
          shopId: this.departData.value,
          shopType: this.departData.shopType
        }
      } else if (this.departData.shopCate.value) {
        this.model = {
          ...this.model,
          cateId: this.departData.shopCate.value,
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
      this.$searchAction$()
    },
    resetInputAction () {
      let model = {
        auth: false,
        plan: 1
      }
      this.departData.shopCate = {}
      this.departData.value = ''
      this.departData.shopType = ''
      this.model = model
      this.$searchAction$()
    },
    /**
     * 门店分类树点击事件(懒加载)
     * @param node
     * @param resolve
     * @returns {*}
     */
    loadShopCateNode (node, resolve) {
      let shopCateTree = this.shopCateTree
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
        let filter = shopCateTree.filter(data => {
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
    // getCurrentRow (shopId) {
    //   this.shopId = shopId
    //   console.log(shopId, 'shopId')
    // }
  },
  created () {
    // this.getShopCateAndShop()
  },
  mounted () {
    // this.init()
  }

}
