import { getErrorMsg } from '@/utils/toast'
import DuplicateTable from '../DuplicateTable'

export default {
  props: {
    visible: Boolean
  },
  components: { DuplicateTable },
  data () {
    const searchModelOrigin = {
      ownerId: '',
      displayname: ''
    }
    return {
      sVisible: false,
      privateAccountSelect: [],
      searchModelOrigin,
      searchModel: JSON.parse(JSON.stringify(searchModelOrigin)),
      pagination: {
        size: 10,
        page: 1,
        total: 0
      },
      wxGroupData: [],
      loadingWxGroupTable: false,
      wxGroupSelection: [],
      nextBtnDisabled: true,
      duplicateTableDialog: {
        visible: false,
        data: []
      }
    }
  },
  watch: {
    visible (value) {
      this.sVisible = value
      if (value) {
        this.initPrivateAccount()
        this.search()
      }
    }
  },
  mounted () {
    this.sVisible = this.visible
  },
  methods: {
    initPrivateAccount () {
      this.$http.fetch(this.$api.guide.wxPrivateAccount.listLite, {}).then(data => {
        this.privateAccountSelect = Object.assign([], data.result)
        this.privateAccountSelect.splice(0, 0, {
          wid: '',
          nick: '全部'
        })
      }).catch(error => {
        this.$notify.error(getErrorMsg('获取个人号列表出现异常', error))
      })
    },
    search () {
      this.pagination.page = 1
      this.loadWxGroup()
    },
    loadWxGroup () {
      this.loadingWxGroupTable = true
      this.$http.fetch(this.$api.guide.wxGroup.tableLite, {
        start: (this.pagination.page - 1) * this.pagination.size,
        length: this.pagination.size,
        searchMap: this.searchModel
      }).then(data => {
        this.wxGroupData = data.result.data
        this.pagination.total = Number(data.result.recordsTotal)
      }).catch(error => {
        this.$notify.error(getErrorMsg('获取群聊列表出现异常', error))
      }).finally(() => {
        this.loadingWxGroupTable = false
      })
    },
    onWxGroupSelectionChange (selection) {
      if (this.sVisible) {
        if (!selection || selection.length < 2) {
          this.$message.error('请选择两个以上的群聊进行筛选')
          this.nextBtnDisabled = true
        } else {
          this.nextBtnDisabled = false
        }
      }
      this.wxGroupSelection = selection
    },
    onClose () {
      this.$emit('update:visible', false)
      this.pagination.page = 1
      this.wxGroupData = []
      this.wxGroupSelection = []
      this.searchModel = JSON.parse(JSON.stringify(this.searchModelOrigin))
    },
    onCurrentChange (page) {
      this.pagination.page = page
      this.loadWxGroup()
    },
    onRemoveSelectedWxGroup (row) {
      this.$refs.wxGroupTable.toggleRowSelection(row, false)
    },
    onConfirm () {
      this.duplicateTableDialog.data = JSON.parse(JSON.stringify(this.wxGroupSelection))
      this.duplicateTableDialog.visible = true
    }
  }
}
