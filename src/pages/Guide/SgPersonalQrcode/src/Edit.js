import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import { getErrorMsg } from '@/utils/toast'

export default {
  name: 'index',
  mixins: [tableMixin],
  data: function () {
    let that = this
    return {
      // 集团版本  1：个号版本  2：企微版本
      memberManagePlan: 1,
      // 弹框是否打开判断值
      dialogVisible: false,
      // 左边输入框绑定值
      input: '',
      // 左边树数据
      leftTreeData: null,
      // 左边树默认绑定数据
      leftDefaultProps: {
        children: 'children',
        label: 'label'
      },
      choosePerson: [],
      personalQrcode: {
        id: null,
        guid: null,
        creatorId: null,
        nickname: null,
        creatorName: null,
        name: null,
        personnels: null,
        prersonelIds: null,
        childQrcodes: null,
        type: 1,
        num: null,
        image: '',
        createTime: '',
        showType: 1,
        isvalidate: 1,
        keyword: null,
        channel: null
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
        name: '测试',
        img: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1272590022,602097170&fm=26&gp=0.jpg',
        date: '2020-02-02'
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
          let split = data.result.personnelIds.split(',')
          let guideIds = []
          for (let i = 0; i < split.length; i++) {
            this.choosePerson.push(parseInt(split[i]))
          }
          this.personalQrcode.personnelIds = data.result.personnelIds
        } else if (data.result.type === 2) {
          this.personalQrcode.childQrcodes = data.result.childQrcodes
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
      this.$http.fetch(this.$api.core.common.getRecruitVersion).then(data => {
        this.memberManagePlan = data.result.memberManagePlan
      })
      this.title = '新增聚合二维码'
    }
    if (typeof this.$init === 'function') {
      this.$init(this, this.$generateParams$)
    } else {
      this.$reload()
    }
  },
  methods: {
    // 删除右边的树子节点数据
    remove (node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
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
      } else if (that.personalQrcode.type === 2 && that.tableData.length < 1) {
        that.$notify.error('请选择子码')
        return
      }
      if (that.personalQrcode.type === 2) {
        that.personalQrcode.childQrcodes = JSON.stringify(that.tableData)
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
    choosePersonnel () { // 选择员工
      let _this = this
      _this.dialogVisible = true
      if (_this.transferRadio === '1') {
        _this.getDepartment()
      }
    },
    chooseChannel () { // 选择渠道
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
      _this.personalQrcode.type = parseInt(val)
    },
    getDepartment () {
      let _this = this
      _this.$http.fetch(_this.$api.guide.sgPersonalQrcode.getDepartment).then(resp => {
        if (resp.success && resp.result != null) {
          _this.leftTreeData = JSON.parse(resp.result)
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
    },
    cancel () {
      this.$router.push({ path: '/Guide/SgPersonalQrcode/List' })
    }
  }
}
