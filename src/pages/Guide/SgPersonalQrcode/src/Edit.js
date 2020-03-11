import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import { getErrorMsg } from '@/utils/toast'

export default {
  name: 'index',
  mixins: [tableMixin],
  data: function () {
    let that = this
    return {
      // 弹框是否打开判断值
      dialogVisible: false,
      // 左边输入框绑定值
      input: '',
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
        // 右边输入框绑定值
        select: '',
        selected: '',
        selectKeys: [],
        treeVisible: false,
        selectData: []
      },
      // 这里定义选择二维码类型名称
      QrCodeTypeNames: [
        '员工',
        '自定义图片',
        '公众号',
        '小程序'
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
        type: 1,
        num: null,
        image: '',
        createTime: '',
        showType: 1,
        personalQrcodeType: 1
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
      tableData: [{
        name: null,
        image: null,
        date: null
      }]
    }
  },
  mounted: function () {
    const id = this.$route.params.id
    if (id > 0) {
      this.title = '编辑聚合二维码'
      this.$http.fetch(this.$api.guide.sgPersonalQrcode.findById, {
        id: id
      }).then(data => {
        if (data.result.type === 1) {
          debugger
          let split = data.result.personnelIds.split(',')
          let guideIds = []
          for (let i = 0; i < split.length; i++) {
            this.choosePerson.push(parseInt(split[i]))
          }
        }
        this.personalQrcode.id = data.result.id
        this.personalQrcode.name = data.result.name
        this.personalQrcode.showType = data.result.showType
      }).catch((error) => {
        this.$notify.error(getErrorMsg('加载聚合二维码信息失败：', error))
      }).finally(() => {
        this.loading = false
      })
    } else {
      this.title = '新增聚合二维码'
    }
    if (typeof this.$init === 'function') {
      this.$init(this, this.$generateParams$)
    } else {
      this.$reload()
    }
    this.initEmpTree()
  },
  methods: {
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
    onSave () {
      let that = this
      if (that.personalQrcode.name === null) {
        that.$notify.error('聚合码名称不能为空')
        return
      }
      if (that.personalQrcode.type === 1 && that.choosePerson.length < 1) {
        that.$notify.error('请选择子码')
        return
      }
      that.$http.fetch(that.$api.guide.sgPersonalQrcode.save, that.personalQrcode).then(() => {
        that.$notify.success('保存成功')
      }).catch((resp) => {
        that.$notify.error(getErrorMsg('保存失败', resp))
      }).finally(() => {
        that.$router.push({ path: '/Guide/SgPersonalQrcode/List' })
      })
    },
    onConfirm () { // 选择员工弹唱确认
    },
    choosePersonnel (type) { // 选择员工
      debugger
      console.info(type)
      let _this = this
      _this.dialogVisible = true
      _this.transferRadio = type
      if (type === 0) {
        // _this.getDepartment()
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
        _this.personalQrcode.personnels = arr.join(',')
      }
    },
    onSaveChildQrcode () {
      let _this = this
      _this.dialogVisible = false
    },
    shiftChange (val) {
      let _this = this
      if (val === '1') {
      } else if (val === '2') {
        _this.choosePerson = []
      }
      _this.personalQrcode.type = val
    },
    // 树方法
    check () {
      this.setSelectedData()
    },
    setSelectedData () {
      this.tree.selectedData = []
      let data = this.$refs.selectTree.getCheckedNodes()
      if (data) {
        for (let dataParent of data) {
          if (!dataParent.disabled) {
            this.tree.selectedData.push(dataParent)
          }
        }
      }
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
      return item.label.indexOf(query) > -1
    },
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
    handleEdit (index, row) {
    },
    handleDelete (index, row) {
      this.tableData.splice(index, 1)
    },
    // 上传图片地址的切换事件
    'handleAvatarSuccess': function (res, file) {
      this.$message.info('上传成功')
      this.bgpic = res.result.url
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
        name: null,
        image: null,
        date: null
      }
      if (this.tableData.length > 5) {
        this.$notify.error('添加数量最多为50个')
      } else {
        this.tableData.push(a)
      }
    }
  }
}
