import { getErrorMsg } from '@/utils/toast'
import shopApi from '@/apis/guide/shop'

export default {
  /**
   * @msg: 下拉框勾选的门店Id
   */
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
    /**
     * @msg: 下拉选项门店列表
     */
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
    },
    reload: {
      type: Object,
      default () {
        return shopApi.findShopPage
      }
    },
    autoload: {
      type: Boolean,
      default () {
        return true
      }
    },
    /**
     * @msg: 当前下拉组件查询的门店ID
     */
    sameSystemShopId: {
      type: [String, Number],
      default () {
        return null
      }
    },
    // 客道环境素材库创建人筛选开启
    kdSystemCreator: {
      type: Boolean,
      default () {
        return false
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
    shopId (newShopId, oldShopId) {
      this.value = newShopId
      if (!newShopId) {
        this.remoteMethod('')
        // this.findShopPage(this.currentPage = 1)
      }
    },
    sameSystemShopId (newShopId, oldShopId) {
      this.remoteMethod('')
    },
    value (newValue) {
      this.$emit('change', newValue)
      this.$emit('selectShop', { select: newValue, data: this.options })
    },
    insertList () {
      this.findShopPage(this.currentPage = 1)
    }
  },
  mounted () {
    this.init()
    if (this.autoload) {
      this.$nextTick(() => {
        this.findShopPage(this.currentPage)
      })
    }
  },
  methods: {
    init () {
      this.value = this.shopId
    },
    getInsertShopIds () {
      let t = ''
      const join = (array) => {
        if (array && array.length > 0) {
          let l = array.length
          let e = l - 1
          for (let i = 0; i < l; i++) {
            const v = array[i][this.props.value] || array[i]
            t = t.concat(v)
            if (i < e) {
              t = t.concat(',')
            }
          }
        }
      }
      join(this.insertList)
      t = t ? t.concat(',') : ''
      typeof this.value === 'string' ? t = t.concat(this.value) : join(this.value)
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
    handleVisibleChange (visible) {
      if (!visible) {
        this.remoteMethod('')
        this.$emit('handleVisibleChange')
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
      let searchMap = {
        shopName: this.shopName,
        insertShopIds: this.getInsertShopIds(),
        sameSystemShopId: this.sameSystemShopId
      }
      if (this.kdSystemCreator) {
        searchMap = {
          creator: this.shopName
        }
      }
      this.$http.fetch(this.url, Object.assign({}, limit, { searchMap }))
        .then(resp => {
          if (resp.success && resp.result != null) {
            this.haveMore = resp.result.length >= this.pageSize
            const push = (before) => {
              if (before) {
                before()
              }
              resp.result.map(v => {
                this.options.push(v)
              })
            }
            if (page === 1) {
              if (this.value && this.value.length > 0) {
              // 查询已选择，若不则么做，会导致已选择只展示门店id
                this.$http.fetch(this.$api.guide.shop.findShopListByShopIds, { shopIds: typeof this.value === 'string' ? this.value : this.value.join(',') }).then(selectedResponse => {
                  push(() => {
                    this.resetOptions()
                    if (selectedResponse.success && selectedResponse.result != null) {
                      selectedResponse.result.map(v => {
                        this.options.push(v)
                      })
                    }
                  })
                }).catch((resp) => {
                  this.$notify.error(getErrorMsg('查询失败', resp))
                })
              } else {
                push(() => {
                  this.resetOptions()
                })
              }
            } else {
              push()
            }
          }
        }).catch((resp) => {
          this.$notify.error(getErrorMsg('门店下拉框加载失败', resp))
        }).finally(() => {
          this.loading = false
        })
    }
  }
}
