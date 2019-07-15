import { getErrorMsg } from '@/utils/toast'

export default {
  props: {
    visible: Boolean
  },
  data () {
    return {
      sVisible: false,
      privateAccountData: [],
      selectedPrivateAccount: [],
      pagination: {
        size: 10,
        page: 1,
        total: 0
      },
      searchPrivateAccount: '',
      selectedPrivateAccountItem: [],
      privateAccountMap: {},
      nextBtnDisabled: true
    }
  },
  watch: {
    visible (value) {
      this.sVisible = value
      if (value) {
        this.loadWxPrivateAccount()
      }
    },
    selectedPrivateAccount (value) {
      this.nextBtnDisabled = !value || value.length < 1
      // 移除不存在的
      let del = []
      this.selectedPrivateAccountItem.forEach((v, i) => {
        if (value.indexOf(v.wid) <= 0) {
          del.push(i)
        }
      })
      for (let i = 0; i < del.length; i++) {
        this.selectedPrivateAccountItem.splice(del[i], 1)
      }
      value.map((v, i) => {
        // 添加新增的
        let item = this.privateAccountMap[v]
        if (item) {
          this.selectedPrivateAccountItem.push(Object.assign({}, item, { selectedIndex: i }))
        }
      })
    },
    privateAccountData (value) {
      this.privateAccountMap = {}
      value.map(v => {
        Object.assign(this.privateAccountMap, { [v.wid]: v })
      })
    }
  },
  mounted () {
    this.sVisible = this.visible
  },
  methods: {
    onClose () {
      this.$emit('update:visible', false)
      this.selectedPrivateAccount = []
    },
    loadWxPrivateAccount () {
      this.$http.fetch(this.$api.guide.wxPrivateAccount.tableLite, {
        start: (this.pagination.page - 1) * this.pagination.size,
        length: this.pagination.size,
        searchMap: {
          nick: this.searchPrivateAccount
        }
      })
        .then(data => {
          this.privateAccountData = data.result.data
          this.pagination.total = Number(data.result.recordsTotal)
        })
        .catch(error => {
          this.$notify.error(getErrorMsg('获取个人号列表异常', error))
        })
    },
    onCurrentChange (page) {
      this.pagination.page = page
      this.loadWxPrivateAccount()
    },
    onRemoveSelectedPrivateAccount (value) {
      this.selectedPrivateAccount.splice(value.selectedIndex, 1)
    }
  }
}
