import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import { getErrorMsg } from '@/utils/toast'
export default {
  data () {
    return {
      url: this.$api.weWork.friendsCircle.adPageList,
      statusOptionList: [ // 样式列表
        {
          label: '全部',
          value: null
        }, {
          label: '朋友圈样式',
          value: 0
        }, {
          label: '设计师样式',
          value: 1
        }, {
          label: '多媒体样式',
          value: 2
        }
      ],
      createrList: [ // 创建人列表
        {
          name: '全部',
          founderId: null
        }
      ],
      model: {
        style: null,
        startTime: '',
        endTime: '',
        founderId: null,
        content: '',
        profileId: null
      },
      seachVal: '', // 搜索字段
      seachDate: [], // 时间字段
      tabList: [ // 头部tab列表
        {
          name: '所有内容',
          id: null
        }
      ]
    }
  },
  mixins: [tableMixin],
  methods: {
    /**
     * 获取对外信息列表
     */
    getProfileList () {
      this.$http.fetch(this.$api.weWork.friendsCircle.profileList, { start: 0, length: 999 }).then((res) => {
        if (res.success && res.result) {
          const { data } = res.result
          this.tabList = [{
            name: '所有内容',
            id: null
          }, ...data]
        }
      }).catch((resp) => {
        this.$notify.error(getErrorMsg('获取失败', resp))
      })
    },
    /**
     * 获取创建人列表
     */
    getFoundList () {
      this.$http.fetch(this.$api.weWork.friendsCircle.adFoundList, { start: 0, length: 999 }).then((res) => {
        if (res.success && res.result) {
          this.createrList = [{
            name: '全部',
            founderId: null
          }, ...res.result]
        }
      }).catch((resp) => {
        this.$notify.error(getErrorMsg('获取失败', resp))
      })
    },
    /**
     * 设置model信息
     * @param {Object} model
     */
    changeSearchfrom (model) {
      this.model = Object.assign({}, this.model, model)
      this.$searchAction$()
    },
    /**
     * 搜索
     * @param {string} content
     */
    handleSearch (content) {
      this.changeSearchfrom({ content })
    },
    /**
     * 删除
     * @param {number} uuid
     */
    onDelect (uuid) {
      this.$confirm('删除后，网页中的内容将被清空，是否确认删除？', '提示信息', {
        confirmButtonText: '确定',
        type: 'warning',
        cancelButtonText: '取消'
      }).then(() => {
        this.requestDelect(uuid)
      })
    },
    /**
     * 请求删除
     * @param {number} uuid
     */
    requestDelect (uuid) {
      this.$http.fetch(this.$api.weWork.friendsCircle.adDeleteById, { uuid }).then(() => {
        this.$notify.success('删除成功')
        this.$searchAction$()
      }).catch((resp) => {
        this.$notify.error(getErrorMsg('删除失败', resp))
      })
    },
    /**
     * 置顶
     * @param {*} data
     */
    onTop (data) {
      this.$http.fetch(this.$api.weWork.friendsCircle.adToTop, data).then(() => {
        this.$searchAction$()
      }).catch((resp) => {
        this.$notify.error(getErrorMsg('置顶失败', resp))
      })
    },
    /**
     * 查看详情/新建
     * @param {number｜null} uuid
     */
    handleDetail (uuid) {
      const query = uuid ? { uuid } : {}
      this.$router.push({
        path: '/Marketing/FriendsCircle/Edit',
        query
      })
    }
  },
  watch: {
    seachDate (newVal) {
      const date = newVal || [null, null]
      this.changeSearchfrom({ startTime: date[0], endTime: date[1] })
    }
  },
  mounted () {
    this.getProfileList()
    this.getFoundList()
    this.$searchAction$()
  }
}
