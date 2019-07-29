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
      nextBtnDisabled: true,
      selectedMemberDialog: {
        visible: false
      },
      saveModel: {
        displayname: '',
        chatroomnotice: ''
      },
      searchFriend: '',
      privateAccountSelection: [],
      friendData: [],
      selectedFriendItem: [],
      FriendMap: {},
      friendPagination: {
        size: 10,
        page: 1,
        total: 0
      },
      loadingPrivateAccountTable: false
    }
  },
  watch: {
    visible (value) {
      this.sVisible = value
      if (value) {
        this.loadWxPrivateAccount()
      }
    },
    // selectedPrivateAccount (value) {
    //   this.nextBtnDisabled = !value || value.length < 1
    //   // 移除不存在的
    //   let del = []
    //   this.selectedPrivateAccountItem.forEach((v, i) => {
    //     if (value.indexOf(v.wid) <= 0) {
    //       del.push(i)
    //     }
    //   })
    //   for (let i = 0; i < del.length; i++) {
    //     this.selectedPrivateAccountItem.splice(del[i], 1)
    //   }
    //   value.map((v, i) => {
    //     // 添加新增的
    //     let item = this.privateAccountMap[v]
    //     if (item) {
    //       this.selectedPrivateAccountItem.push(Object.assign({}, item, { selectedIndex: i }))
    //     }
    //   })
    // },
    privateAccountData (value) {
      this.privateAccountMap = {}
      value.map(v => {
        Object.assign(this.privateAccountMap, { [v.wid]: v })
      })
    },
    friendData (value) {
      this.FriendMap = {}
      value.map(v => {
        Object.assign(this.FriendMap, { [v.wid]: v })
      })
    },
    // selectedFriend (value) {
    //   // 移除不存在的
    //   let del = []
    //   this.selectedFriendItem.forEach((v, i) => {
    //     if (value.indexOf(v.wid) <= 0) {
    //       del.push(i)
    //     }
    //   })
    //   for (let i = 0; i < del.length; i++) {
    //     this.selectedFriendItem.splice(del[i], 1)
    //   }
    //   value.map((v, i) => {
    //     // 添加新增的
    //     let item = this.FriendMap[v]
    //     if (item) {
    //       this.selectedFriendItem.push(Object.assign({}, item, { selectedIndex: i }))
    //     }
    //   })
    // },
    'selectedMemberDialog.visible' (value) {
      if (value) {
        this.loadFriend()
      }
    }
  },
  computed: {
    addBtnDisabled: function () {
      return !this.saveModel.displayname || this.selectedFriend.length < 2
    }
  },
  mounted () {
    this.sVisible = this.visible
  },
  methods: {
    onClose () {
      this.$emit('update:visible', false)
      this.selectedPrivateAccount = []
      this.pagination.page = 1
      this.privateAccountData = []
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
    onRemoveSelectedPrivateAccount (row) {
      this.$refs.privateAccountTable.toggleRowSelection(row, false)
    },
    // onRemoveSelectedFriend (value) {
    //   this.selectedFriend.splice(value.selectedIndex, 1)
    // },
    loadFriend () {
      this.$http.fetch(this.$api.guide.wxPrivateAccount.tableFriendLite, {
        start: (this.friendPagination.page - 1) * this.friendPagination.size,
        length: this.friendPagination.size,
        searchMap: {
          nick: this.searchPrivateAccount
        }
      })
        .then(data => {
          this.friendData = data.result.data
          this.friendPagination.total = Number(data.result.recordsTotal)
        })
        .catch(error => {
          this.$notify.error(getErrorMsg('获取个人号列表异常', error))
        })
    },
    onFriendCurrentChange (page) {
      this.friendPagination.page = page
      this.loadFriend()
    },
    onSelectedMemberDialogClose () {
      this.friendPagination.page = 1
      this.friendData = []
    },
    privateAccountSelectionChange (selection) {
      if (!selection || selection.length <= 0) {
        this.$message.error('请选择一个个人号')
        this.nextBtnDisabled = true
      } else if (selection && selection.length > 1) {
        this.$message.error('只允许选择一个个人号')
        this.nextBtnDisabled = true
      } else {
        this.nextBtnDisabled = false
      }
      this.privateAccountSelection = selection
    }
  }
}
