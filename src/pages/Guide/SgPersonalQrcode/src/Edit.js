import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import scrollHeight from '@nascent/ecrp-ecrm/src/mixins/scrollHeight'
import { getErrorMsg } from '@/utils/toast'

export default {
  name: 'index',
  mixins: [tableMixin, scrollHeight],
  data () {
    return {
      // 页面滚动条内容高度配置
      scrollBarDeploy: {
        ref: 'fullScreen', // 页面滚动条ref的名称
        excludeHeight: 39 // 底部按钮的高度
      },
      employeeSelectData: [],
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
        channel_code: null,
        child_qrcodes: [],
        poster_background_url: '',
        qrcode_size: 172,
        qrcode_x: 74,
        qrcode_y: 349,
        tagList: ''
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
      }],
      addTagDialogVisible: false, // 是否显示打标签dialog
      disableSaveBtn: false,
      tagList: [], // 打标签列表
      tagId2TagGroupId: {}, // 已选择标签id映射标签组id
      saveLoading: false,
      showPosterQrcode: false,
      uploadPosterFileList: []
    }
  },
  computed: {
    selectedTagGroup () {
      return Array.from(new Set(Object.values(this.tagId2TagGroupId)))
    }
  },
  async mounted () {
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
      }).then(async data => {
        if (data.result.type === 0) {
          let personnelIds = data.result.personnelIds.split(',')
          for (let i = 0; i < personnelIds.length; i++) {
            this.employeeIds.push(parseInt(personnelIds[i]))
            this.employeeSelectData.push(parseInt(personnelIds[i]))
          }
        }
        this.initType = data.result.type
        this.personalQrcode = {
          ...data.result,
          poster_background_url: data.result.poster_background_url || '',
          qrcode_size: data.result.qrcode_size !== undefined ? data.result.qrcode_size : 172,
          qrcode_x: data.result.qrcode_x !== undefined ? data.result.qrcode_x : 74,
          qrcode_y: data.result.qrcode_y !== undefined ? data.result.qrcode_y : 349
        }

        this.showPosterQrcode = true
        if (data.result.type === 1) {
          this.tableData = JSON.parse(data.result.child_qrcodes)
        }
        this.addTableData = JSON.parse(data.result.child_qrcodes)

        // 显示已经上传的海报
        if (data.result.poster_background_url) {
          this.uploadPosterFileList = [ { name: data.result.poster_background_url, url: data.result.poster_background_url } ]
        }
        // 获取打标签列表
        await this.getWeWorkTagList()
        let checkList = []
        if (this.personalQrcode.tagList) {
          checkList = this.personalQrcode.tagList.split(',')
        }

        if (this.personalQrcode.tag_list) {
          checkList = this.personalQrcode.tag_list.split(',')
        }
        if (checkList.length) {
          const tagId2TagGroupId = {}
          for (const tagGroupItem of this.tagList) {
            const tagGroupId = tagGroupItem.tagGroupId
            for (const tagValItem of tagGroupItem.tagValueList) {
              const tagId = tagValItem.tagId
              if (checkList.indexOf(tagId) > -1) {
                tagId2TagGroupId[tagId] = tagGroupId
              }
            }
          }
          this.tagId2TagGroupId = tagId2TagGroupId
        }
      }).catch((error) => {
        this.$notify.error(getErrorMsg('加载聚合二维码信息失败：', error))
      }).finally(() => {
        this.loading = false
      })
      this.state = 1
    } else {
      this.getWeWorkTagList()
      this.showPosterQrcode = true
      this.title = '新增聚合二维码'
    }

    // 获取打标签列表
    // await this.getWeWorkTagList()
    // if (id > 0) {
    //   let checkList = []
    //   if (this.personalQrcode.tagList) {
    //     checkList = this.personalQrcode.tagList.split(',')
    //   }

    //   if (this.personalQrcode.tag_list) {
    //     checkList = this.personalQrcode.tag_list.split(',')
    //   }
    //   if (checkList.length) {
    //     const tagId2TagGroupId = {}
    //     for (const tagGroupItem of this.tagList) {
    //       const tagGroupId = tagGroupItem.tagGroupId
    //       for (const tagValItem of tagGroupItem.tagValueList) {
    //         const tagId = tagValItem.tagId
    //         if (checkList.indexOf(tagId) > -1) {
    //           tagId2TagGroupId[tagId] = tagGroupId
    //         }
    //       }
    //     }
    //     this.tagId2TagGroupId = tagId2TagGroupId
    //   }
    // }
  },
  methods: {
    getPosterQrcodeInfo (info) { // 海报信息
      this.personalQrcode.qrcodeSize = info.size
      this.personalQrcode.qrcodeX = info.x
      this.personalQrcode.qrcodeY = info.y
    },
    switchTagDialog (state) { // 选择标签
      this.addTagDialogVisible = state
    },
    selectedTags (info) { // 打标签已选标签
      this.personalQrcode = { ...this.personalQrcode, tagList: info.checkList }
      this.tagId2TagGroupId = info.tagId2TagGroupId
    },
    async getWeWorkTagList () { // 获取标签列表
      try {
        const res = await this.$http.fetch(this.$api.guide.sgPersonalQrcode.findWeWorkTagList)
        if (res.success) {
          this.tagList = res.result
        } else {
          this.$notify.error('获取企微标签失败')
        }
      } catch (error) {
        this.$notify.error('获取企微标签失败')
      }
    },
    sgUploadFile (name) {
      return this.$api.core.sgUploadFile('test')
    },
    onSave () {
      this.saveLoading = true

      let that = this
      if (that.personalQrcode.name === null || that.personalQrcode.name.trim() === '') {
        this.saveLoading = false
        return that.$notify.error('聚合码名称不能为空')
      }
      if (that.personalQrcode.type === 0 && that.tableData.length < 1) {
        this.saveLoading = false
        return that.$notify.error('请添加子码')
      } else if (that.personalQrcode.type === 1 && that.tableData.length < 1) {
        this.saveLoading = false
        return that.$notify.error('请添加子码')
      }
      // 判断聚合二维码类型
      let bool = false
      if ((that.memberManagePlan === 1 && that.personalQrcode.type === 1) || that.memberManagePlan === 2) {
        // 聚合二维码为企微自定义方案或个号方案
        bool = true
      }
      let personalIds = []
      for (let i = 0; i < that.tableData.length; i++) {
        let guideId = that.tableData[i].guideId
        personalIds.push(guideId)
        if (bool && (that.tableData[i].num === null || that.tableData[i].num === '')) {
          this.saveLoading = false
          return that.$notify.error('每日添加次数不能为空')
        }
      }
      that.personalQrcode.personnelIds = personalIds.join(',')
      that.personalQrcode.child_qrcodes = JSON.stringify(that.tableData)
      that.$http.fetch(that.$api.guide.sgPersonalQrcode.save, that.personalQrcode).then(() => {
        that.$notify.success('保存成功')
        that.$router.push({ path: '/Guide/SgPersonalQrcode/List' })
      }).catch((resp) => {
        that.$notify.error(getErrorMsg('保存失败', resp))
      }).finally(() => {
        this.saveLoading = false
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
          if (data.name === null || data.name === '') {
            return this.$notify.error('自定义子码名称不能为空')
          }
          if (data.image === null) {
            return this.$notify.error('自定义子码不能为空')
          }
          chooseData.index = data.index
          chooseData.name = data.name
          chooseData.image = data.image
          chooseData.date = data.date
          chooseData.num = null
          chooseData.guideId = null
          chooseData.userName = null
          chooseData.userId = null
          _this.tableData.push(chooseData)
        }
      }
      _this.dialogVisible = false
    },
    employeeTreeClose () {
      let _this = this
      _this.dialogVisible = false
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
    handleDelete (mag) {
      let type = this.personalQrcode.type
      if (type === 0) { // 选择员工
        let guideId = mag.row.guideId
        let tableData = this.tableData
        for (let i in tableData) {
          if (tableData[i].guideId === guideId) {
            tableData.splice(i, 1)
          }
        }
        let parent = this.employeeSelectData
        for (let i in parent) {
          if (parent[i] === guideId) {
            parent.splice(i, 1)
          }
        }
      } else if (type === 1) { // 自定义
        let position
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].index === mag.row.index) {
            position = i
          }
        }
        this.tableData.splice(position, 1)
      }
    },
    deleteChildQrcode (mag, row) {
      let position
      for (let i = 0; i < this.addTableData.length; i++) {
        if (this.addTableData[i].index === mag.row.index) {
          position = i
        }
      }
      this.addTableData.splice(position, 1)
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
      for (let i = 0; i < this.addTableData.length; i++) {
        let addTableDatum = this.addTableData[i]
        if (addTableDatum.name === null || addTableDatum.name.trim() === '') {
          return this.$notify.error('自定义子码名称不能为空')
        }
        if (addTableDatum.image === null) {
          return this.$notify.error('自定义子码不能为空')
        }
      }
      if (this.addTableData.length > 49) {
        this.$notify.error('添加数量最多为50个')
      } else {
        this.addTableData.push(a)
      }
    },
    cancel () { // 取消
      this.$router.push({ path: '/Guide/SgPersonalQrcode/List' })
    },
    uploadPosterSuccess (uploadRes, file, fileList) { // 上传海报成功回调
      const { success, result } = uploadRes
      this.uploadPosterFileList = [ { name: file.name, url: file.response.result.url } ]
      if (success) {
        // 展示背景图
        this.personalQrcode = { ...this.personalQrcode, posterBackgroundUrl: result.url }
      } else {
        this.$message.error('上传失败')
      }

      this.disableSaveBtn = false
    },
    uploadPosterError () { // 上传海报失败回调
      this.$message.error('上传海报失败')
      this.disableSaveBtn = false
    },
    uploadPosterBefore (file) { // 上传海报前回调
      this.disableSaveBtn = true
      const isPngOrJpg = file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/jpeg'
      const isLt10M = file.size / 1024 / 1024 < 10

      if (!isPngOrJpg || !isLt10M) {
        this.$message.error('请上传jpg、jpeg或png图片，大小不超过10M')
        this.disableSaveBtn = false
        return false
      }

      return new Promise((resolve, reject) => {
        const _URL = window.URL || window.webkitURL
        const img = new Image()
        img.src = _URL.createObjectURL(file)
        img.onload = () => {
          const { width, height } = img
          let valid = true
          if (width !== 750 || height !== 1334) {
            valid = false
          }
          if (valid) {
            return resolve(file)
          } else {
            const msg = `上传图片尺寸只能是750x1334`
            this.$notify.error(msg)
            this.disableSaveBtn = false
            return reject(msg)
          }
        }
      })
    },
    uploadPosterRemove (file, fileList) {
      this.disableSaveBtn = false
      // this.personalQrcode.posterBackgroundUrl = this.personalQrcode.poster_background_url || ''
      this.personalQrcode.posterBackgroundUrl = ''
    }
  },
  watch: {
    treeSelect (val) {
      this.$refs.selectTree.filter(val)
    },
    employeeSelectData (val) {
      this.$http.fetch(this.$api.guide.sgPersonalQrcode.getGuideMsg, {
        guides: val
      }).then(resp => {
        let chooseTableData = this.tableData
        this.tableData = []
        this.employeeIds = []
        for (let data of resp.result) {
          let chooseData = {}
          chooseData.name = data.name
          chooseData.image = data.qrcode
          for (let i = 0; i < chooseTableData.length; i++) {
            if (chooseTableData[i].guideId === data.id) {
              chooseData.num = chooseTableData[i].num
            }
          }
          chooseData.guideId = data.id
          chooseData.userName = data.userName
          chooseData.userId = data.userId
          this.tableData.push(chooseData)
        }
      }).catch((error) => {
        this.$notify.error(getErrorMsg('加载聚合二维码信息失败：', error))
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
