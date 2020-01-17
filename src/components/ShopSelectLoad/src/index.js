import { getErrorMsg } from '@/utils/toast'
import shopApi from '@/apis/guide/shop'

export default {
  model: {
    prop: 'shopId',
    event: 'change'
  },
  props: {
    shopId: {
      type: [String, Array, Number],
      default: null
    },
    clear: {
      type: Function,
      default: function () {
      }
    },
    pageSize: {
      type: Number,
      default: 20
    },
    multiple: {
      type: Boolean,
      default: false
    },
    insertList: {
      type: Array,
      default () {
        return []
      }
    },
    url: {
      type: Object,
      default () {
        return shopApi.findShopPage
      }
    }
  },
  data () {
    return {
      props: {
        value: 'id',
        label: 'shopName'
      },
      value: null,
      currentPage: 1,
      searchList: [],
      showOption: [],
      options: [],
      haveMore: true,
      loading: false,
      shopName: '',
      insertShopIds: []
    }
  },
  watch: {
    shopId (newShopId) {
      this.value = newShopId
    },
    value (newValue) {
      this.$emit('change', newValue)
      this.$emit('selectShop', { select: newValue, data: this.options })
    },
    insertList (newValue) {
      this.findShopPage(this.currentPage = 1)
    }
  },
  mounted () {
    this.init()
    this.$nextTick(() => {
      this.findShopPage(this.currentPage)
    })
  },
  methods: {
    init () {
      this.value = this.shopId
    },
    getInsertShopIds () {
      let t = ''
      if (this.insertList && this.insertList.length > 0) {
        let l = this.insertList.length
        let e = l - 1
        for (let i = 0; i < l; i++) {
          t = t.concat(this.insertList[i][this.props.value])
          if (i < e) {
            t = t.concat(',')
          }
        }
      }
      return t
    },
    resetOptions () {
      const t = []
      this.insertList.map(v => {
        if (this.shopName) {
          if (v[this.props.label].indexOf(this.shopName) > -1) {
            t.push(v)
          }
        } else {
          t.push(v)
        }
      })
      this.options = t
    },
    loadMore (obj) {
      if (obj && obj.$el.childNodes[0].scrollTop * 1.1 + obj.$el.scrollHeight > obj.$el.children[0].children[0].scrollHeight) {
        if (this.haveMore && !this.loading) {
          this.currentPage = this.currentPage + 1
          this.$nextTick(() => {
            this.findShopPage(this.currentPage)
          })
        }
      }
    },
    remoteMethod (condition) {
      this.shopName = condition
      this.currentPage = 1
      this.findShopPage(1)
    },
    findShopPage (page = 1) {
      this.loading = true
      var limit = {
        start: (page - 1) * this.pageSize,
        length: this.pageSize
      }
      this.$http.fetch(this.url, Object.assign({}, limit, {
        searchMap: {
          shopName: this.shopName,
          insertShopIds: this.getInsertShopIds()
        }
      })).then(resp => {
        if (resp.success && resp.result != null) {
          this.haveMore = resp.result.length >= this.pageSize
          if (page === 1) {
            this.resetOptions()
          }
          resp.result.map(v => {
            this.options.push(v)
          })
        }
      }).catch((resp) => {
        this.$notify.error(getErrorMsg('门店下拉框加载失败', resp))
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
