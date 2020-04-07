import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import { getErrorMsg } from '@/utils/toast'

export default {
  name: 'index',
  mixins: [tableMixin],
  data: function () {
    let that = this
    return {
      state: 0, // 状态 0：新增 1：编辑
      memberManagePlan: 1,
      // 弹框是否打开判断值
      dialogVisible: false,
      // 选择渠道弹窗
      channelVisible: false,
      // 左边输入框绑定值
      channelList: [],
      // 初始化聚合二维码类型状态
      initType: 0,
      employeeIds: [], // 使用员工ids
      input: '',
      treeSelect: '',
      // 员工树
      tree: {
        // 左边树默认绑定数据
        leftDefaultProps: {
          children: 'children',
          label: 'label'
        },
        copySelectKeys: [],
        copySelectedData: [],
        // 右边树数据
        selectedData: [],
        selected: '',
        selectKeys: [],
        treeVisible: false,
        selectData: []
      },
      // 这里定义选择二维码类型名称
      QrCodeTypeNames: [
        '员工',
        '自定义图片'
        // '公众号',
        // '小程序'
      ],
      choosePerson: [],
      personalQrcode: {
        id: null,
        guid: null,
        creatorId: null,
        nickname: null,
        creatorName: null,
        name: null,
        personnels: null,
        prersonelIds: '',
        type: 0,
        num: null,
        image: '',
        createTime: '',
        showType: 1,
        isvalidate: 1,
        keyword: null,
        channelCode: null,
        child_qrcodes: []
      },
      title: null,
      parameter: {
        length: 10,
        searchMap: {
        },
        start: 0
      },
      modelObj: {},
      status: 0,
      rules: {
        num: [{ required: true, message: '请输入每日添加次数' }]
      },
      transferRadio: '1',
      currentUploadIndex: null,
      channalList: [], // 所有渠道
      addTableData: [{
        index: 0,
        name: null,
        image: null,
        guideId: null,
        date: null,
        num: null,
        userName: null,
        userId: null
      }],
      tableData: [{
        index: 0,
        name: null,
        image: null,
        guideId: null,
        date: null,
        num: null,
        userName: null,
        userId: null
      }]
    }
  },
  mounted: function () {
    this.tableData = []
    this.$http.fetch(this.$api.core.common.getRecruitVersion).then(data => {
      this.memberManagePlan = data.result.memberManagePlan
    })
    if (this.memberManagePlan === 1) { // 1：企微方案
      this.$http.fetch({
        url: '/Guide/chanel/getChannelList',
        method: 'post'
      }).then(data => {
        if (data.success) {
          this.channelList = data.result
        }
      }).catch((error) => {
        this.$notify.error(getErrorMsg('获取渠道信息失败：', error))
      }).finally(() => {
        this.loading = false
      })
    }
    const id = this.$route.params.id
    if (id > 0) {
      this.title = '编辑聚合二维码'
      this.$http.fetch(this.$api.guide.sgPersonalQrcode.findById, {
        id: id
      }).then(data => {
        if (data.result.type === 0) {
          let personnelIds = data.result.personnelIds.split(',')
          for (let i = 0; i < personnelIds.length; i++) {
            this.employeeIds.push(parseInt(personnelIds[i]))
          }
        }
        this.initType = data.result.type
        this.personalQrcode = data.result
        this.tableData = JSON.parse(data.result.child_qrcodes)
        this.addTableData = JSON.parse(data.result.child_qrcodes)
      }).catch((error) => {
        this.$notify.error(getErrorMsg('加载聚合二维码信息失败：', error))
      }).finally(() => {
        this.loading = false
      })
      this.state = 1
    } else {
      this.title = '新增聚合二维码'
    }

    if (this.personalQrcode.type === 0) {
      var keyMap = {}
      this.$http.fetch(this.$api.guide.sgPersonalQrcode.getQrcodeDepartment, {
        name: this.tree.select
      }).then(resp => {
        if (resp.success && resp.result != null) {
          let json = JSON.parse(resp.result)
          this.tree.selectData = json
        } else {
          this.$notify.error(getErrorMsg('获取员工数据失败', resp))
        }
      }).catch((resp) => {
        this.$notify.error(getErrorMsg('获取员工数据失败', resp))
      })
    }
  },
  methods: {
    sgUploadFile (name) {
      return this.$api.core.sgUploadFile('test')
    },
    // 删除右边的树子节点数据
    remove (node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
      const chooseIndex = this.choosePerson.findIndex(d => d.id === data.id)
      this.choosePerson.splice(chooseIndex, 1)
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
    onSave () {
      let that = this
      if (that.personalQrcode.name === null || that.personalQrcode.name.trim() === '') {
        that.$notify.error('聚合码名称不能为空')
        return
      }
      if (that.personalQrcode.type === 0 && that.tableData.length < 1) {
        that.$notify.error('请选择子码')
        return
      } else if (that.personalQrcode.type === 1 && that.tableData.length < 1) {
        that.$notify.error('请选择子码')
        return
      }
      let personalIds = []
      for (let i = 0; i < that.tableData.length; i++) {
        let guideId = that.tableData[i].guideId
        personalIds.push(guideId)
      }
      that.personalQrcode.personnelIds = personalIds.join(',')
      that.personalQrcode.childQrcodes = JSON.stringify(that.tableData)
      that.$http.fetch(that.$api.guide.sgPersonalQrcode.save, that.personalQrcode).then(() => {
        that.$notify.success('保存成功')
      }).catch((resp) => {
        that.$notify.error(getErrorMsg('保存失败', resp))
      }).finally(() => {
        that.$router.push({ path: '/Guide/SgPersonalQrcode/List' })
      })
    },
    // 聚合码类型改变
    checkChange () {
      if (this.state === 0) {
        this.tableData = []
      } else if (this.state === 1) {
        let type = this.personalQrcode.type
        if (type === this.initType) {
          this.tableData = JSON.parse(this.personalQrcode.child_qrcodes)
        } else {
          this.tableData = []
        }
      }
    },
    // 选择员工/自定义按钮
    choosePersonnel (type) { // 选择员工/自定义
      let _this = this
      _this.dialogVisible = true
      if (type === 0) {
        let selectData = _this.tree.selectData
        _this.tree.selectedData = []
        let keyMap = {}
        for (let i = 0; i < _this.employeeIds.length; i++) {
          let personnelId = _this.employeeIds[i]
          keyMap[personnelId] = 1
        }
        for (let i = 0; i < selectData.length; i++) {
          let children = selectData[i].children
          for (let j = 0; j < children.length; j++) {
            let id = children[j].id
            if (keyMap[id] === 1) {
              _this.tree.selectedData.push(children[j])
              _this.tree.copySelectedData.push(children[j])
            }
          }
        }
      } else if (type === 1) {
        _this.addTableData = []
        for (let i = 0; i < _this.tableData.length; i++) {
          let data = {}
          let tableDatum = _this.tableData[i]
          data.index = i
          data.name = tableDatum.name
          data.image = tableDatum.image
          data.guideId = tableDatum.guideId
          data.date = tableDatum.date
          data.num = tableDatum.num
          data.userName = tableDatum.userName
          data.userId = tableDatum.userId
          _this.addTableData.push(data)
        }
      }
    },
    // 选择员工弹窗确认
    onSaveChildQrcode () {
      let _this = this
      _this.dialogVisible = false
      if (_this.personalQrcode.type === 0) {
        _this.tableData = []
        _this.employeeIds = []
        let selectedData = _this.tree.selectedData
        for (let data of selectedData) {
          let chooseData = {}
          chooseData.name = data.label
          chooseData.image = data.qrcode
          chooseData.num = null
          chooseData.guideId = data.guideId
          chooseData.userName = data.userName
          chooseData.userId = data.userId
          _this.employeeIds.push(data.guideId)
          _this.tableData.push(chooseData)
        }
      } else if (_this.personalQrcode.type === 1) {
        _this.tableData = []
        let addTableData = _this.addTableData
        for (let data of addTableData) {
          let chooseData = {}
          chooseData.name = data.name
          chooseData.image = data.image
          chooseData.date = data.date
          chooseData.num = null
          chooseData.guideId = null
          chooseData.userName = null
          chooseData.userId = null
          _this.tableData.push(data)
        }
      }
    },
    employeeTreeClose () {
      let _this = this
      _this.dialogVisible = false
      _this.$refs.selectTree.setCheckedNodes(_this.tree.copySelectedData)
    },
    handleCheckChange () {
      let _this = this
      let res = this.$refs.tree.getCheckedNodes()
      let arr = []
      res.forEach((item) => {
        if (item.id) {
          arr.push(item.id)
        }
      })
      _this.choosePerson = arr
      if (arr.length > 1) {
        _this.personalQrcode.personnelIds = arr.join(',')
      }
    },
    // 左边树选择
    check () {
      this.setSelectedData()
    },
    setSelectedData () {
      this.tree.selectedData = []
      this.choosePerson = []
      let data = this.$refs.selectTree.getCheckedNodes()
      if (data) {
        for (let dataParent of data) {
          if (!dataParent.disabled) {
            if (dataParent.id) {
              this.tree.selectedData.push(dataParent)
              // this.choosePerson.push(dataParent.id)
            }
          }
        }
      }
      // this.personalQrcode.personnelIds = this.choosePerson.join(',')
      // return this.tree.selectedData
    },
    onCloseTree () {
      this.tree.selectedData = this.tree.copySelectedData
      this.$refs.selectTree.setCheckedKeys(this.tree.selectedData.map(value => { return value.id }))
      this.tree.treeVisible = false
    },
    onSaveTree () {
      if (this.tree.selectedData.length > 0) {
        this.tree.copySelectedData = this.selectedData
        this.tree.selectKeys = []
        this.tree.treeVisible = false
      } else {
        this.$notify.warning('请选择营销人群')
      }
    },
    showTree () {
      this.tree.treeVisible = true
      this.$nextTick(function () {
        this.tree.copySelectedData = JSON.parse(JSON.stringify(this.setSelectedData()))
      })
    },
    selectFilterNode (query, item) {
      if (!query) return true
      return item.label.indexOf(query) !== -1
    },
    initEmpTree: function () {
      let _this = this
      var keyMap = {}
      _this.$http.fetch(_this.$api.guide.sgPersonalQrcode.getQrcodeDepartment, {
        name: _this.tree.select
      }).then(resp => {
        if (resp.success && resp.result != null) {
          _this.tree.selectData = JSON.parse(resp.result)
          let keyMap = {}
          let personnelIds = _this.personalQrcode.prersonelIds.split(',')
          for (let i = 0; i < personnelIds.length; i++) {
            let personnelId = personnelIds[i]
            keyMap[personnelId] = 1
          }
          for (let i = 0; i < json.length; i++) {
            let children = json[i].children
            for (let j = 0; j < children.length; j++) {
              let id = children[j].id
              if (keyMap[id] === 1) {
                _this.tree.selectedData.push(children[j])
              }
            }
          }
        } else {
          _this.$notify.error(getErrorMsg('获取员工数据失败', resp))
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('获取员工数据失败', resp))
      })
    },
    handleEdit (index, row) {
    },
    handleDelete (mag, row) {
      let type = this.personalQrcode.type
      if (type === 0) { // 选择员工
        let guideId = mag.row.guideId
        let tableData = this.tableData
        for (let i in tableData) {
          if (tableData[i].guideId === guideId) {
            tableData.splice(i, 1)
          }
        }
        let parent = this.tree.selectedData
        for (let i in parent) {
          if (parent[i].id === guideId) {
            parent.splice(i, 1)
          }
        }
        for (let i in this.employeeIds) {
          if (this.employeeIds[i] === parseInt(guideId)) {
            this.employeeIds.splice(i, 1)
          }
        }
      } else if (type === 1) { // 自定义
        this.tableData.splice(mag, 1)
      }
    },
    // 上传图片地址的切换事件
    'handleAvatarSuccess': function (res, file) {
      this.$message.info('上传成功')
      this.addTableData[this.currentUploadIndex].image = res.result.url
    },
    setCurrentUploadRowIndex (index) {
      this.currentUploadIndex = index
    },
    // 上传图片的类型和大小判断事件
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传二维码只能是 JPG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传二维码大小不能超过 2MB!')
        return false
      }
      return isJPG && isLt2M
    },
    handleAdd () {
      let a = {
        index: this.addTableData.length,
        name: null,
        image: null,
        date: null
      }
      if (this.addTableData.length > 49) {
        this.$notify.error('添加数量最多为50个')
      } else {
        this.addTableData.push(a)
      }
    },
    cancel () { // 取消
      this.$router.push({ path: '/Guide/SgPersonalQrcode/List' })
    }
  },
  watch: {
    treeSelect (val) {
      this.$refs.selectTree.filter(val)
    }
  }
}
