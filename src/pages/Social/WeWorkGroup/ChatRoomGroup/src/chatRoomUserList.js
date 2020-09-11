import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import { getErrorMsg } from '@/utils/toast'
import apiRequestConfirm from '@nascent/ecrp-ecrm/src/utils/apiRequestConfirm'
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
          this.$router.push({ path: '/Social/WeWorkGroup/chatRoomUser/' + scope.row.chat_id, params: { 'remark': scope.row.remark } })
        },
        'icon': '',
        'name': '群详情',
        'auth': ``,
        'visible': `scope.row.status !== 2`
      },
      {
        'func': function (scope) {
          this.onDeleteFun(scope.row)
        },
        'icon': '',
        'name': '删除',
        'auth': ``,
        'visible': `scope.row.status !== 2`
      }
    ]
    let quickSearchModel = {}
    let searchModel = {
      remark: null
    }
    let findVo = {
      'name': null,
      'owner': null,
      'canJoin': null
    }
    let model = Object.assign({}, findVo, {}, searchModel)
    return {
      model: model,
      quickSearchModel: quickSearchModel,
      _pagination: pagination,
      _table: {
        table_buttons: tableButtons,
        quickSearchMap: {}
      },
      // 群主列表
      ownerList: [],
      dataList: [],
      chatId: null,
      // 群组名称
      remark: '',
      syncTime: ''
    }
  },
  mounted: function () {
    this.chatId = this.$route.params.chatId
    this.remark = this.$route.params.remark
    this.syncTime = this.$route.params.syncTime
    if (!this.chatId) {
      this.$notify.error('请选择群')
      return
    }
    this.getOwnerInfo()
    // 获取群主列表.
    this.loadListFun()
  },
  methods: {
    // 加载列表
    async loadListFun () {
      this.loading = true
      this.searchObj.searchMap.chatId = this.chatId
      await this.$http
        .fetch(this.$api.guide.chatRoomConfig.chatRoomUserList, this.searchObj)
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
      this.$http
        .fetch(this.$api.guide.chatRoomConfig.chatRoomGroupAllOwner, { configId: this.configId })
        .then(resp => {
          this.ownerList = resp.result
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询群主列表失败', resp))
        })
    },
    // 提交搜索
    submitForm () {
      this.searchObj.start = 0
      this.searchObj.searchMap.type = this.model.type
      this.searchObj.searchMap.name = this.model.name
      this.searchObj.searchMap.ownerBind = this.model.ownerBind
      // 组装搜索对象
      this.loadListFun()
    },
    resetForm () {
      this.model = {}
      this.searchObj.start = 0
      this.searchObj.searchMap = {}
      this.loadListFun()
    },
    syncUser () {
      this.$http
        .fetch(this.$api.guide.chatRoomConfig.syncUser, { chatId: this.chatId })
        .then(resp => {
          this.syncTime = resp.result
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('同步群成员失败', resp))
        })
    }
  }
}
