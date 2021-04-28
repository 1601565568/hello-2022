import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
export default {
  data () {
    return {
      model: {
        name: '',
        operatorName: ''
      },
      drawer: false,
      url: this.$api.guide.redpacket.getCoverList
    }
  },
  mixins: [tableMixin],
  mounted () {
    this.$reload()
  },
  methods: {
    handleSearch () {
      this.changeSearchfrom(this.model)
    },
    /**
     * 修改搜索项
     * @param {*} [obj]
     */
    changeSearchfrom (obj = {}) {
      this.model = Object.assign(this.model, obj)
      this.$searchAction$()
    },
    handleDetail (query = {}) {
      this.$router.push({
        path: '/Social/SocialOperation/RedPacket/Poster/Edit',
        query
      })
    },
    // 删除封面
    handleDelete (id, isDefault) {
      if (isDefault) {
        this.$notify.error('默认封面不能删除')
        return false
      }
      this.$confirm('删除后不可恢复，使用此封面的红包替换为默认封面', '确定删除？', {
        confirmButtonText: '确定',
        type: 'warning',
        cancelButtonText: '取消'
      }).then(() => {
        this.deleteCover(id)
      })
    },
    deleteCover (id) {
      this.$http.fetch(this.$api.guide.redpacket.deleteCover(id))
        .then(() => {
          this.$searchAction$()
          this.$notify.success('删除成功')
        }).catch(() => {
          this.$notify.error('操作失败')
        })
    },
    handleSort (data) {
      this.changeSearchfrom({ sortName: data.prop, sortType: data.order === 'ascending' ? 1 : 0 })
    },
    handleChangeState (id, isDefault) {
      if (isDefault) {
        this.$notify.error('至少有一个默认封面')
        return false
      }
      this.$http.fetch(this.$api.guide.redpacket.setDefault(id)).then(res => {
        if (res.success) {
          this.$notify.success('操作成功')
          this.$searchAction$()
        }
      })
    }
  }
}
