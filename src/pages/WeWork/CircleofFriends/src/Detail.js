import { PublishStatuMap, PublishStatuList } from '../const'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      model: {
        momentId: null,
        publishStatus: null,
        guideIds: []
      },
      ext: {
        published: '0',
        unpublished: '0'
      },
      url: this.$api.guide.momentList.getMomentTaskMerged,
      guideIds: [],
      PublishStatuMap,
      PublishStatuList
    }
  },
  methods: {
    exportClick () {
      if (!this._data._table.data.length) {
        this.$notify.error('当前没有匹配的数据项')
        return
      }
      const start = 0
      const length = 999999999
      const params = {
        momentId: this.model.momentId,
        publishStatus: this.model.publishStatus,
        // 后台说不传guideIds
        // ...this.model,
        start,
        length,
        exportType: 2
      }
      const elem = document.getElementById('exportButton')
      const rect = elem.getBoundingClientRect()
      this.$http.fetch(this.$api.guide.task.exportExcel, params)
        .then((resp) => {
          this.$store.dispatch({
            type: 'down/downAction',
            status: true,
            top: rect.top,
            right: 60
          })
        }).catch((resp) => {
          this.$notify.error(resp.msg || '导出报错，请联系管理员')
        })
    },
    $queryList$: function (params) {
      const that = this
      const tableConfig = this._data._table
      tableConfig.loadingtable = true
      return this.$http.fetch(this.url, params).then((resp) => {
        that._data._table.data = resp.result.data
        that._data._pagination.total = parseInt(resp.result.recordsTotal)
        this.ext = resp.result.ext
        if (that._data._pagination.total > 0) {
          that._data._table.key = 1
        } else if (that._data._pagination.total === 0) {
          that._data._table.key = 2
        }
      }).catch((err) => {
        if (err && err.msg) {
          that.$notify.error(err.msg)
        } else {
          that.$notify.error('网络异常，获取数据失败！')
        }
      }).finally(() => {
        tableConfig.loadingtable = false
        that.needScrollToView && that._data._queryConfig.tableId && that.$scrollToView()
        that.needScrollToView = false
      })
    },
    handleDetail (userId) {
      const { momentId } = this.$route.query
      this.$router.push({
        path: '/Social/OperationData/CircleOfFriends/costomDetail',
        query: { momentId, userId }
      })
    },
    // 修改请求参数
    changeSearchfrom (obj = {}) {
      this.model = Object.assign(this.model, obj)
      this.$searchAction$()
    },
    handleChangeGuide (value) {
      this.changeSearchfrom({ guideIds: value.length > 0 ? value.join(',') : null })
    }
  },
  computed: mapState({
    aliasGuideName: state => state.env.aliasGuideName,
    cloudPlatformType: state => state.user.remumber.remumber_login_info.productConfig.cloudPlatformType
  }),
  created () {
    const { momentId, userId = null } = this.$route.query
    this.model = { ...this.model, momentId }
    this.getMomentInfo(momentId, userId)
    this.$searchAction$()
  }
}
