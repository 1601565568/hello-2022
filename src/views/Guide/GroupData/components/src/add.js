import { getErrorMsg } from '@/utils/toast'

export default {
  props: {
    visible: Boolean
  },
  data () {
    const originModel = {
      displayname: '',
      chatroomnotice: '',
      members: []
    }
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
      nextBtnDisabled: true,
      selectedMemberDialog: {
        visible: false
      },
      originModel,
      saveModel: JSON.parse(JSON.stringify(originModel)),
      searchFriendModel: '',
      privateAccountSelection: [],
      friendData: [],
      selectedFriendItem: [],
      friendPagination: {
        size: 10,
        page: 1,
        total: 0
      },
      loadingPrivateAccountTable: false,
      loadingFriendTable: false,
      selectedMemberRules: {
        displayname: [
          { required: true, message: '请输入群聊名称', trigger: ['blur', 'change'] }
        ]
      },
      friendSelection: [],
      saving: false
    }
  },
  watch: {
    visible (value) {
      this.sVisible = value
      if (value) {
        this.loadWxPrivateAccount()
      }
    },
    'selectedMemberDialog.visible' (value) {
      if (value) {
        this.loadFriend()
      }
    }
  },
  computed: {
    addBtnDisabled: function () {
      return !this.saveModel.displayname || this.friendSelection.length < 2
    }
  },
  mounted () {
    this.sVisible = this.visible
  },
  methods: {
    onClose () {
      this.$emit('update:visible', false)
      this.friendData = []
      this.pagination.page = 1
      this.privateAccountData = []
      this.privateAccountSelection = []
      this.friendSelection = []
      this.saveModel = JSON.parse(JSON.stringify(this.originModel))
    },
    searchWxPrivateAccount () {
      this.pagination.page = 1
      this.loadWxPrivateAccount()
    },
    loadWxPrivateAccount () {
      this.loadingPrivateAccountTable = true
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
        .finally(() => {
          this.loadingPrivateAccountTable = false
        })
    },
    onCurrentChange (page) {
      this.pagination.page = page
      this.loadWxPrivateAccount()
    },
    onRemoveSelectedPrivateAccount (row) {
      this.$refs.privateAccountTable.toggleRowSelection(row, false)
    },
    onRemoveSelectedFriend (row) {
      this.$refs.friendTable.toggleRowSelection(row, false)
    },
    searchFriend () {
      this.friendPagination.page = 1
      this.loadFriend()
    },
    loadFriend () {
      this.loadingFriendTable = true
      this.$http.fetch(this.$api.guide.wxPrivateAccount.tableFriendLite, {
        start: (this.friendPagination.page - 1) * this.friendPagination.size,
        length: this.friendPagination.size,
        searchMap: {
          nick: this.searchFriendModel,
          ownerId: this.privateAccountSelection[0].wid
        }
      })
        .then(data => {
          this.friendData = data.result.data
          this.friendPagination.total = Number(data.result.recordsTotal)
        })
        .catch(error => {
          this.$notify.error(getErrorMsg('获取个人号列表异常', error))
        })
        .finally(() => {
          this.loadingFriendTable = false
        })
    },
    onFriendCurrentChange (page) {
      this.friendPagination.page = page
      this.loadFriend()
    },
    onSelectedMemberDialogClose () {
      this.friendPagination.page = 1
      this.friendData = []
      this.friendSelection = []
    },
    privateAccountSelectionChange (selection) {
      if (this.visible) {
        if (!selection || selection.length <= 0) {
          this.$message.error('请选择一个个人号')
          this.nextBtnDisabled = true
        } else if (selection && selection.length > 1) {
          this.$message.error('只允许选择一个个人号')
          this.nextBtnDisabled = true
        } else {
          this.nextBtnDisabled = false
        }
      }
      this.privateAccountSelection = selection
    },
    friendSelectionChange (selection) {
      if (this.selectedMemberDialog.visible) {
        if (!selection || selection.length <= 1) {
          this.$message.error('至少选择两个好友')
        }
      }
      this.friendSelection = selection
    },
    createGroup () {
      this.$refs.saveModel.validate(valid => {
        if (valid) {
          this.saving = true
          let params = JSON.parse(JSON.stringify(this.saveModel))
          params.ownerId = this.privateAccountSelection[0].wid
          this.friendSelection.map(v => {
            params.members.push(v.wid)
          })
          this.$http.fetch(this.$api.guide.groupData.createChatroom, params)
            .then(data => {
              this.$notify.success('创建成功，稍后可在个人号或列表中查看结果')
            })
            .catch(error => {
              this.$notify.error(getErrorMsg('创建群聊出现异常', error))
            })
            .finally(() => {
              this.saving = false
            })
        }
      })
    }
  }
}
