import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import { getErrorMsg } from '@/utils/toast'

export default {
  name: 'index',
  mixins: [tableMixin],
  data: function () {
    let that = this
    return {
      memberManagePlan: 1,
      // 弹框是否打开判断值
      dialogVisible: false,
      // 选择渠道弹窗
      channelVisible: false,
      // 左边输入框绑定值
      channelList: [],
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
        channelCode: null
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
        'code': [{ required: true, message: '请输入配置项编码' }],
        'value': [{ required: true, message: '请输入配置项值' }],
        'type': [{ required: true, message: '请选择类型' }]
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
          let personnels = data.result.personnels.split(',')
          for (let i = 0; i < personnelIds.length; i++) {
            this.choosePerson.push(parseInt(personnelIds[i]))
          }
        }
        this.personalQrcode = data.result
        this.tableData = JSON.parse(data.result.child_qrcodes)
        this.addTableData = JSON.parse(data.result.child_qrcodes)
      }).catch((error) => {
        this.$notify.error(getErrorMsg('加载聚合二维码信息失败：', error))
      }).finally(() => {
        this.loading = false
      })
    } else {
      this.title = '新增聚合二维码'
    }

    var keyMap = {}
    this.$http.fetch(this.$api.guide.sgPersonalQrcode.getQrcodeDepartment, {
      name: this.tree.select
    }).then(resp => {
      if (resp.success && resp.result != null) {
        let json = JSON.parse(resp.result)
        this.tree.selectData = json
        this.choosePerson.forEach(function (value, i) {
          keyMap[value] = 1
        })
        for (let i = 0; i < json.length; i++) {
          let children = json[i].children
          for (let j = 0; j < children.length; j++) {
            let id = children[j].id
            if (keyMap[id] === 1) {
              this.tree.selectedData.push(children[j])
            }
          }
          // children.forEach(function (value, i) {
          //   if (keyMap[value.id] === 1) {
          //     this.tree.selectedData.push(value)
          //   }
          // })
        }
        // json.forEach(function (value, i) {
        //   value.children.forEach(function (value, i) {
        //     if (keyMap[value.id] === 1) {
        //       this.tree.selectedData.push(value)
        //     }
        //   })
        // })
      } else {
        this.$notify.error(getErrorMsg('获取员工数据失败', resp))
      }
    }).catch((resp) => {
      this.$notify.error(getErrorMsg('获取员工数据失败', resp))
    })
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
      if (that.personalQrcode.name === null) {
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
      that.personalQrcode.childQrcodes = JSON.stringify(that.tableData)
      that.$http.fetch(that.$api.guide.sgPersonalQrcode.save, that.personalQrcode).then(() => {
        that.$notify.success('保存成功')
      }).catch((resp) => {
        that.$notify.error(getErrorMsg('保存失败', resp))
      }).finally(() => {
        that.$router.push({ path: '/Guide/SgPersonalQrcode/List' })
      })
    },
    choosePersonnel (type) { // 选择员工
      let _this = this
      _this.dialogVisible = true
      _this.transferRadio = type
      if (type === 0) {
        _this.initEmpTree()
      }
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
    // 选择员工弹窗确认
    onSaveChildQrcode () {
      let _this = this
      _this.dialogVisible = false
      if (_this.personalQrcode.type === 0) {
        _this.tableData = []
        let selectedData = _this.tree.selectedData
        for (let data of selectedData) {
          let chooseData = {}
          chooseData.name = data.label
          chooseData.image = data.qrcode
          chooseData.num = null
          chooseData.guideId = data.guideId
          chooseData.userName = data.userName
          chooseData.userId = data.userId
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
              this.choosePerson.push(dataParent.id)
            }
          }
        }
      }
      this.personalQrcode.personnelIds = this.choosePerson.join(',')
      return this.tree.selectedData
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
      for (let i in this.choosePerson) {
        if (this.choosePerson[i] === parseInt(guideId)) {
          this.choosePerson.splice(i, 1)
        }
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
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 20MB!')
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
