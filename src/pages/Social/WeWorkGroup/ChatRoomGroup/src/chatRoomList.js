import { getErrorMsg } from '@/utils/toast'
import NsTableColumnOperateButtonExt from '@/components/NsTableColumnOperateButton'
import listPageMixin from '@/mixins/listPage'
export default {
  name: 'NsTableAutoPass',
  mixins: [listPageMixin],
  components: { NsTableColumnOperateButtonExt },
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
        'func': function (scope) {
          this.$router.push({
            path: '/Social/WeWorkGroup/chatRoomUser/' + scope.row.chat_id,
            query: { 'groupName': scope.row.name, 'syncTime': scope.row.sync_time }
          })
        },
        'icon': '',
        'name': '群详情',
        'auth': ``
      },
      {
        'func': function (scope) {
          this.onDeleteFun(scope.row)
        },
        'icon': '',
        'name': '删除',
        'auth': ``
      }
    ]
    return {
      model: { name: null, owner: null, canJoin: null },
      _pagination: pagination,
      _table: {
        table_buttons: tableButtons
      },
      // 群主列表
      ownerList: [],
      dataList: [],
      configId: null,
      // 群组名称
      remark: ''
    }
  },
  mounted: function () {
    this.configId = this.$route.params.configId
    this.remark = this.$route.query.remark
    if (!this.configId) {
      this.$notify.error('请选择聚合群组')
      return
    }
    this.getOwnerInfo()
    // 获取群主列表.
    this.loadListFun()
  },
  methods: {
    goback () {
      this.$router.back()
    },
    // 加载列表
    async loadListFun () {
      this.loading = true
      this.searchObj.searchMap.configId = this.configId
      await this.$http
        .fetch(this.$api.guide.chatRoomConfig.chatRoomList, this.searchObj)
        .then(resp => {
          this.dataList = resp.result.data
          this.pagination.total = parseInt(resp.result.recordsTotal)
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
      this.loading = false
    },
    // 群主列表
    getOwnerInfo () {
      this.loading = true
      this.$http
        .fetch(this.$api.guide.chatRoomConfig.chatRoomGroupAllOwner, { configId: this.configId })
        .then(resp => {
          this.ownerList = resp.result
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询群主列表失败', resp))
        })
      this.loading = false
    },
    // 快速搜索
    quickSearch () {
      this.searchObj.start = 0
      this.searchObj.searchMap = { name: this.model.name }
      this.loadListFun()
    },
    // 提交搜索
    submitForm () {
      this.searchObj.start = 0
      this.searchObj.searchMap.canJoin = this.model.canJoin
      this.searchObj.searchMap.name = this.model.name
      this.searchObj.searchMap.owner = this.model.owner
      // 组装搜索对象
      this.loadListFun()
    },
    resetForm () {
      this.model = {}
      this.searchObj.start = 0
      this.searchObj.searchMap = {}
      this.loadListFun()
    },
    onDeleteFun (row) {
      this.loading = true
      this.$http
        .fetch(this.$api.guide.chatRoomConfig.chatRoomDelete, { chatId: row.chat_id, configId: this.configId })
        .then(resp => {
          this.$notify.success('该群已在聚合码中删除')
          this.loadListFun()
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('删除失败', resp))
        })
      this.loading = false
    }
  }
}
