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
          this.$router.push({ path: '/Social/WeWorkGroup/chatRoomUser/' + scope.row.chat_id, params: { 'remark': scope.row.remark, 'syncTime': scope.row.syncTime } })
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
      configId: null,
      // 群组名称
      remark: ''
    }
  },
  mounted: function () {
    this.configId = this.$route.params.configId
    this.remark = this.$route.params.remark
    if (!this.configId) {
      this.$notify.error('请选择聚合群组')
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
    }
  }
}
