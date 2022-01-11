import { getErrorMsg } from '@/utils/toast'
import { API_ROOT } from '@/config/http.js'
import NsTableColumnOperateButtonExt from '@/components/NsTableColumnOperateButton'
import listPageMixin from '@/mixins/listPage'
import apiRequestConfirm from '@nascent/ecrp-ecrm/src/utils/apiRequestConfirm'
import Preview from '@/components/NsPreview'

export default {
  name: 'NsTableAutoPass',
  mixins: [listPageMixin],
  components: { NsTableColumnOperateButtonExt, Preview },
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
          this.$router.push({ path: '/Social/WeWorkGroup/chatRoom/' + scope.row.configId, query: { remark: scope.row.remark } })
        },
        'icon': '',
        'name': '群列表',
        'auth': ``
      },
      {
        'func': function (scope) {
          this.downLoad(scope.row.qrCode)
        },
        'icon': '',
        'name': '下载',
        'auth': ``
      },
      {
        'func': function (scope) {
          this.$router.push({ path: '/Social/WeWorkGroup/chatRoomGroup/addOrEdit', query: { configId: scope.row.configId } })
        },
        'icon': '',
        'name': '编辑',
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
    const operateButtons = [
      {
        'func': function () {
          this.$router.push({ name: 'chatRoomGroupAddOrEdit' })
        },
        'name': '新建群聚合码'
      }
    ]
    let quickInput = [{
      'template': '',
      'inline': false,
      'name': 'name',
      'text': '任务名称',
      'placeholder': '请输入任务名称',
      'type': 'text',
      'value': ''
    }]
    let quickSearchNames = quickInput.map(x => x.name)
    let quickSearchModel = {}
    let searchModel = {
      remark: null
    }
    let findVo = {
      'remark': null
    }
    let model = Object.assign({}, findVo, {}, searchModel)
    return {
      isWhiteList: false,
      model: model,
      quickSearchModel: quickSearchModel,
      _pagination: pagination,
      _table: {
        table_buttons: tableButtons,
        operate_buttons: operateButtons,
        quickSearchNames: quickSearchNames,
        quickSearchMap: {}
      },
      _queryConfig: { expand: false },
      multipleSelection: [],
      select: true,
      bindDeviceDialog: {
        visible: false,
        guide: {}
      },
      memberManagePlan: 1,
      shopSelectUrl: this.$api.guide.shop.findBrandShopList,
      shopSelectOptions: [],
      dataList: []
    }
  },
  created: async function () {
    await this.checkWhiteList()
    this.loadListFun()
  },
  methods: {
    // 图片预览
    togglePreview (url) {
      if (url) {
        this.$refs.preview.toggleShow(0, [url])
      }
    },
    // 加载列表
    async loadListFun (data) {
      this.loading = true
      let searchObj = data || this.searchObj
      await this.$http
        .fetch(this.$api.guide.chatRoomConfig.chatRoomGroupList, searchObj)
        .then(resp => {
          resp.result.data.forEach(data => {
            data.canJoinChatRoom = data.canJoinChatRoom.join(',')
            data.owners = data.owners.join(',')
          })
          this.dataList = resp.result.data
          this.pagination.total = parseInt(resp.result.recordsTotal)
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
      this.loading = false
    },
    // 提交搜索
    submitForm () {
      this.searchObj.start = 0
      this.searchObj.searchMap.remark = this.model.remark
      // 组装搜索对象
      this.loadListFun()
    },
    resetForm () {
      this.model.remark = ''
      this.searchObj.start = 0
      this.searchObj.searchMap = {}
      this.loadListFun()
    },
    downLoad (url) {
      let requestUrl = API_ROOT + '/chatRoomGroup/downLoad'
      var form = document.createElement('form')
      form.setAttribute('action', requestUrl)
      form.setAttribute('method', 'get')
      var input = document.createElement('input')
      input.setAttribute('type', 'hidden')
      input.setAttribute('name', 'url')
      input.setAttribute('value', url)
      form.appendChild(input)
      document.body.appendChild(form)
      form.submit()
    },
    onDeleteFun (row) {
      let that = this
      apiRequestConfirm('删除聚合码').then(function () {
        that.$http.fetch(that.$api.guide.chatRoomConfig.chatRoomGroupDelete
          , { configId: row.configId })
          .then((resp) => {
            if (resp.success) {
              that.$notify.success(resp.msg)
              that.loadListFun()
            }
          }).catch((resp) => {
            that.$notify.error(getErrorMsg('删除失败', resp))
          })
      })
    },
    // 是否有白名单
    async checkWhiteList () {
      try {
        const resp = await this.$http.fetch(this.$api.guide.chatRoomConfig.isWhiteList)
        if (resp.success) {
          this.isWhiteList = !!resp.result
        }
      } catch (error) {
        this.$notify.error('是否是白名单获取失败')
      }
    }
  }
}
