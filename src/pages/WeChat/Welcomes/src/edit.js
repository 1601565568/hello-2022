import scrollHeight from '@nascent/ecrp-ecrm/src/mixins/scrollHeight'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
export default {
  mixins: [scrollHeight, tableMixin],
  data: function () {
    return {
      // 欢迎语ID
      uuid: null,
      // 计划名称输入框绑定值
      title: '',
      loading: false, // 防重复提交
      // 页面滚动条配置
      scrollBarDeploy: {
        ref: 'fullScreen', // 页面滚动条ref的名称
        excludeHeight: 69 // 底部按钮的高度39 + 30顶部设置小程序积分体系的高度
      },
      // 左边输入框绑定值
      input: '',
      // 弹框是否打开判断值
      dialogVisible: false,
      treeSelect: '',
      treeSelected: '',
      // 员工树
      tree: {
        // 左边树默认绑定数据
        leftDefaultProps: {
          children: 'children',
          label: 'label'
        },
        // 右边树数据
        selectedData: [],
        copySelectedData: [],
        // 右边输入框绑定值
        select: '',
        selected: '',
        selectKeys: [],
        copySelectKeys: [],
        treeVisible: false,
        selectData: []
      },
      // 发布内容数据
      publishData: [],
      // 预置链接
      presetLink: []
    }
  },
  mounted () {
    this.initEdit({ welcomesId: this.$route.query.uuid })
    this.initEmpTree()
    this.getSystemPresetLink()
  },
  methods: {
    // 保存
    saveOrUpdateWelcomes () {
      this.loading = true
      let that = this
      let employeeIds = this.initSelectedData()
      if (!that.title) {
        that.$notify.error('标题不能为空')
        this.loading = false
        return
      }
      if (this.publishData.length === 0) {
        that.$notify.error('欢迎语不能为空')
        this.loading = false
        return
      }
      if (this.publishData.length > 10) {
        that.$notify.error('欢迎语不能超过10条')
        this.loading = false
        return
      }
      // 附带内容json
      let content = JSON.stringify(this.publishData)
      let model = {
        title: that.title,
        content: encodeURIComponent(content),
        uuid: that.uuid,
        employeeIds: employeeIds
      }
      that.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        that.$http
          .fetch(that.$api.weChat.welcomes.saveWelcomeCode, model)
          .then(resp => {
            this.loading = false
            that.$notify.success('操作成功')
            that.$router.push({ path: '/Guide/speech/speechList' })
          })
          .catch(resp => {
            that.$notify.error(resp.msg)
          })
          .finally(() => { })
      })
    },
    initSelectedData () {
      let arr = []
      if (this.tree.selectedData.length === 0) {
        return arr
      }
      this.tree.selectedData.forEach((item) => {
        if (item.id) {
          arr.push(item.id)
        }
      })
      return arr
    },
    // 取消编辑
    cancelWelcomes () {
      this.$router.push({ path: '/Guide/speech/speechList' })
    },
    // 打开员工树
    choosePersonnel () {
      let _this = this
      _this.dialogVisible = true
      if (this.tree.selectData.length === 0) {
        _this.initEmpTree()
      }
      // 右边树数据
      this.tree.copySelectedData = this.tree.selectedData
    },
    // 关闭员工树
    employeeTreeClose: function () {
      this.tree.selectedData = this.tree.copySelectedData
      this.$refs.selectTree.setCheckedNodes(this.tree.copySelectedData)
      this.dialogVisible = false
    },
    // 树方法
    check () {
      this.setSelectedData()
    },
    selectFilterNode (query, item) {
      if (!query) return true
      return item.label.indexOf(query) !== -1
    },
    setSelectedData () {
      this.tree.selectedData = []
      let data = this.$refs.selectTree.getCheckedNodes()
      if (data) {
        for (let dataParent of data) {
          if (!dataParent.disabled && dataParent.id) {
            this.tree.selectedData.push(dataParent)
          }
        }
      }
      return this.tree.selectedData
    },
    // 删除右边的树子节点数据
    remove (node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
      const nodes = this.$refs.selectTree.getCheckedNodes()
      const nodeIndex = nodes.findIndex(d => d.id === data.id)
      nodes.splice(nodeIndex, 1)
      for (let i in nodes) {
        if (nodes[i].children) {
          nodes.splice(i, 1)
        }
      }
      this.$refs.selectTree.setCheckedNodes(nodes)
    },
    // 初始化员工树
    initEmpTree: function () {
      let _this = this
      _this.$http.fetch(_this.$api.guide.sgPersonalQrcode.getDepartment).then(resp => {
        if (resp.success && resp.result != null) {
          this.tree.selectData = JSON.parse(resp.result)
        } else {
          _this.$notify.error(getErrorMsg('获取员工数据失败', resp))
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('获取员工数据失败', resp))
      })
    },
    // 获取系统预置链接
    getSystemPresetLink: function () {
      let _this = this
      _this.$http.fetch(_this.$api.guide.systemPreset.getLink).then(resp => {
        if (resp.success && resp.result != null) {
          resp.result.forEach(function (value, i) {
            _this.presetLink.push(value)
          })
        }
      })
    },
    /**
     * @msg: 页面初始化时的数据加载函数
     */
    async initEdit (data) {
      // 页面初始化时，加载页面数据
      let that = this
      var keyMap = {}
      if (data.welcomesId) {
        that.$http.fetch(that.$api.weChat.welcomes.getWelcomeCode, { uuid: data.welcomesId }
        ).then(resp => {
          that.uuid = resp.result.uuid
          that.title = resp.result.title
          if (resp.result.content) {
            let content = decodeURIComponent(resp.result.content)
            JSON.parse(content).forEach(function (value, i) {
              that.publishData.push(value)
            })
          }
          resp.result.employeeIds.forEach(function (value, i) {
            that.tree.selectKeys.push(value)
            keyMap[value] = 1
          })
          that.tree.selectData.forEach(function (value, i) {
            value.children.forEach(function (value, i) {
              if (keyMap[value.id] === 1) {
                that.tree.selectedData.push(value)
              }
            })
          })
        }).catch(resp => {
          that.$notify.error(resp.msg)
        })
      }
    }
  },
  watch: {
    treeSelect (val) {
      this.$refs.selectTree.filter(val)
    },
    treeSelected (val) {
      this.$refs.selectedTree.filter(val)
    }
  }
}
