import api from '@/config/http'
import { getErrorMsg } from '@/utils/toast'
import apiRequestConfirm from '@nascent/ecrp-ecrm/src/utils/apiRequestConfirm'
import bgimg from './images/bgimage.png'
import posterPreview from './images/posterPreview.png'
import qrcode from './images/qrcode.png'
export default {
  components: { Image },
  data: function () {
    let pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    let paginations = {
      enable: true,
      size: 10,
      sizeOpts: [5, 10, 15],
      page: 1,
      total: 0
    }
    let paginationss = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    let customPagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    const tableButtons = [{}]
    let quickSearchModel = {}
    let searchModel = {
      updateAllGuidePrefix: 0,
      sgGuide: {
        brand_id: null,
        name: null,
        nickname: null,
        sex: 1,
        mobile: null,
        birthday: null,
        work_num: '',
        password: null,
        image: ''
      },
      personalQrcode: {
        guid: null,
        creatorId: null,
        nickname: null,
        creatorName: 1,
        name: null,
        personnels: null,
        prersonelIds: '',
        num: null,
        image: '',
        createTime: '',
        showType: 1
      },
      sgGuideShop: {
        id: null,
        shop_id: '',
        job: 0
      },
      sgGuideVo: {
        newShopId: null,
        type: 0
      }
    }
    let findVo = {
      'name': null,
      'shop': null,
      'job': null,
      'guideState': 1
    }
    let customFindVo = {
      'name': null,
      'shop': null,
      'mobile': null
    }
    let model = Object.assign({}, findVo, {}, searchModel)
    let rules = {
      'name': [
        { required: true, message: '请输入姓名', trigger: ['blur', 'change'] },
        { min: 0, max: 20, message: '已超过可输入长度', trigger: ['blur', 'change'] }
      ],
      'shop': [
        {
          required: true,
          trigger: ['blur', 'change'],
          validator: (rule, value, callback) => {
            if (this.model.sgGuideShop.shop_id === null || this.model.sgGuideShop.shop_id === '') {
              callback(new Error('请选择所属门店'))
            } else {
              callback()
            }
          }
        }
      ],
      'shops': [
        {
          required: true,
          trigger: ['blur', 'change'],
          validator: (rule, value, callback) => {
            if (this.subordinateStores.length === 0) {
              callback(new Error('请选择所属门店'))
            } else {
              callback()
            }
          }
        }
      ],
      'nickname': [
        { min: 0, max: 20, message: '已超过可输入长度', trigger: ['blur', 'change'] }
      ],
      'mobile': [
        { required: true, message: '请输入手机号', trigger: ['blur', 'change'] },
        {
          pattern: /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-3]{1})|(15[5-9]{1})|(16[6]{1})|(17[0]{1})|(17[6-8]{1})|(18[0-9]{1})|(19[8-9]{1}))+\d{8})$/,
          message: '手机号格式错误，请您重新输入！'
        }
      ],
      'work_id': [
        {
          required: true,
          trigger: ['blur', 'change'],
          validator: (rule, value, callback) => {
            if (this.model.sgGuide.work_number === '' || this.model.sgGuide.work_prefix === '') {
              callback(new Error('请输入工号'))
            } else {
              callback()
            }
          }
        }
      ]
    }
    let that = this
    return {
      url: api.API_ROOT + '/upload',
      memberManagePlan: 1, // 企业方案1：企微2：个号
      bgpic: '',
      postimg: posterPreview,
      qrcodeimg: qrcode,
      // 上传图片的地址
      imageUrl: '',
      // 输入框绑定值
      input: '',
      // 弹框是否打开判断值
      dialogVisible: false,
      // 聚合码类型 0：员工类型  1：自定义类型
      type: 1,
      personalLinkFormVisible: false,
      onShowId: '',
      onShowTitle: '',
      personalQrcodeLink: null,
      subordinateStores: [],
      showUpdateAllGuidePrefix: false,
      disabledWorkPrefix: true,
      imageRoot: api.API_ROOT + '/core/file/showImage?fileKey=',
      title: '',
      transferWay: '1',
      memberBelongingRadio: '1',
      frindAddList: [],
      pageChange: true, // 当前页数
      guideId: null, // 当前导购的id
      shopId: null,
      shopIds: null,
      successCount: null,
      failCount: null,
      rules: rules,
      row: null,
      memberBelongingtitle: '',
      memberBelongingShopid: null,
      memberBelongingShow: false,
      verification: false,
      nextStep: '确定',
      model: model,
      changeValue: {},
      guideValue: null,
      transferRadio: '1',
      memberferRadio: '2',
      replacementStoresHaveMembersRadio: '1',
      radio: null,
      nicknameValue: null,
      birthdayValue: null,
      sexsValue: null,
      mobileValue: null,
      jobsValue: null,
      memberBelongingValue: null,
      namesValue: null,
      storeValue: null,
      workIdChangeValue: null,
      changeObj: {},
      quickSearchModel: quickSearchModel,
      state: {},
      obj: {},
      value4: 50,
      memberBelongingList: [],
      _pagination: pagination,
      paginations: paginations,
      paginationss: paginationss,
      customPagination: customPagination,
      scopeRowCountShow: false,
      customFindVo: customFindVo,
      _table: {
        table_buttons: tableButtons,
        quickSearchMap: {}
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 8.64e7
        }
      },
      _queryConfig: { expand: false },
      sameSystemShopId: null, // 相同体系门店ID，用于查询相同体系门店Id接口参数
      insertList: []
    }
  },
  mounted () {
    this.initShopList()
    this.$http.fetch(this.$api.core.common.getRecruitVersion).then(data => {
      this.memberManagePlan = data.result.memberManagePlan
    })
  },
  methods: {
    refreshTable () {
      this.$refs.mainTable.searchAction()
    },
    // 上传图片地址的切换事件
    'handleAvatarSuccess': function (res, file) {
      this.$message.info('上传成功')
      this.bgpic = res.result.url
    },
    // 上传图片的类型和大小判断事件
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isJPG) {
        this.$message.error('上传背景图只能是 JPG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传背景图大小不能超过 5MB!')
        return false
      }
      return isJPG && isLt2M
    },
    workPrefix (val) {
      this.model.sgGuide.work_prefix = val
      // eslint-disable-next-line no-console
      // console.log('val:', val, this.model.sgGuide.work_prefix)
    },
    formatTooltip (val) {
      return val / 100
    },
    getCurrentRow (row, index) { // 单选按钮
      this.radio = index
      this.value = row
    },
    // 复制
    copy (msg) {
      let url = msg
      let oInput = document.createElement('input')
      oInput.value = url
      document.body.appendChild(oInput)
      oInput.select() // 选择对象;
      // console.log(oInput.value)
      document.execCommand('Copy') // 执行浏览器复制命令
      this.$message({
        message: '复制成功',
        type: 'success'
      })
      oInput.remove()
    },
    download (imgSrc) {
      var a = document.createElement('a')
      a.download = name || '背景图'
      // 设置图片地址
      a.href = this.url + '/uploadImg?fileName=背景图&imgUrl=' + this.bgpic + '&width=750&height=1624'
      a.click()
    },
    onSaveShow () { // 保存投放预览
      let _this = this
      let onShowId = _this.onShowId
      let onShowTitle = _this.onShowTitle
      if (onShowTitle === '' || onShowTitle === null) {
        this.$message.error('聚合码标题不能为空!')
        return
      }
      let bgimg = _this.bgpic
      this.$http.fetch(_this.$api.guide.sgPersonalQrcode.saveShow, {
        id: onShowId,
        title: onShowTitle,
        bgimg: bgimg
      }).then(resp => {
        _this.$notify.success('保存成功')
      }).catch(resp => {
        _this.$notify.error(getErrorMsg('保存失败', resp))
      }).finally(() => {
        _this.dialogVisible = false
      })
    },
    // 投放预览
    preview () {
      let id = this.onShowId
      this.$http.fetch(this.$api.guide.sgPersonalQrcode.findById, {
        id: id
      }).then(data => {
        if (data.success) {
          this.dialogVisible = true
          this.onShowTitle = data.result.title
          this.bgpic = data.result.bgimg
        } else {
          this.$notify.error(getErrorMsg('获取聚合二维码信息失败：', data.msg))
        }
      }).catch((error) => {
        this.$notify.error(getErrorMsg('加载聚合二维码信息失败：', error))
      }).finally(() => {
        this.dialogVisible = true
      })
    },
    onShowFun (row) { // 投放预览
      this.onShowId = row.id
      this.$http.fetch(this.$api.guide.sgPersonalQrcode.findById, {
        id: row.id
      }).then(data => {
        if (data.success) {
          this.dialogVisible = true
          this.onShowTitle = data.result.title
          this.bgpic = data.result.bgimg
        } else {
          this.$notify.error(getErrorMsg('获取聚合二维码信息失败：', data.msg))
        }
      }).catch((error) => {
        this.$notify.error(getErrorMsg('加载聚合二维码信息失败：', error))
      }).finally(() => {
        this.dialogVisible = true
      })
    },
    transfer () {
      this.$router.push({
        path: '/Guide/Customer/CustomerManage'
      })
    },
    logo (value) {
      let _this = this
      _this.changeValue.logoValue = value
      _this.changeObj.logoChange = true
    },
    nickname (value) {
      let _this = this
      _this.changeValue.nicknameValue = value
      _this.changeObj.nicknameChange = true
    },
    birthday (value) {
      let _this = this
      _this.changeValue.birthdayValue = value
      _this.changeObj.birthdayChange = true
    },
    storeOwnership (value) {
    },
    memberBelonging (value) {
      let _this = this
      _this.model.sgGuideVo.type = value
      _this.changeValue.memberBelongingValue = value
      _this.memberBelongingRadio = value
      _this.changeObj.memberBelongingChange = true
    },
    sexs (value) {
      let _this = this
      _this.changeValue.sexsValue = value
      _this.changeObj.sexsChange = true
    },
    mobile (value) {
      let _this = this
      _this.changeValue.mobileValue = value
      _this.changeObj.mobileChange = true
    },
    names (value) {
      let _this = this
      _this.changeValue.namesValue = value
      _this.changeObj.namesChange = true
    },
    reduce (val) {},
    store (data, row) {
      let vId = data.select
      let _this = this
      let shopListArr = []
      data.data.map((item, i) => {
        if (vId.indexOf(item.id) !== -1) {
          shopListArr.push(item)
        }
      })
      this.memberBelongingList = shopListArr
      _this.changeValue.storeValue = vId
      if (this.memberBelongingList.length > 0) {
        _this.memberBelongingShopid = this.memberBelongingList[0].id
      }
      _this.shopIds = vId
      _this.changeObj.storeChange = true
    },
    changeShop (shopId) {
      this.shopIds = shopId
    },
    changeMemberBelonging (value) {
      this.model.sgGuideVo.newShopId = value
      this.model.sgGuideVo.type = 1
    },
    handleSelectionChange (value) {
      this.dimissionArry = value
      this.multipleSelection = value
      this.replaceStoresArry = value
      this.allPageCustomer = value
      this.dimissionArry.map(item => {
        if (item.status === 2) {
          this.accordingToJudgmentShow = true
        }
      })
    },
    onKeyUp (e) {
    },
    initShopList () {
    },
    onAddFun () {
      this.$route().push('/Guide/SgPersonalQrcode/List/Edit/0')
    },
    onEditFun (row) { // 修改和新增功能
      this.row = row
      var path = '/Guide/SgPersonalQrcode/List/Edit/' + this.row.id
      this.$router.push({ path: path })
    },
    onDeleteFun (row) { // 删除
      var _this = this
      apiRequestConfirm('删除：' + row.name).then(() => {
        let paramArr = []
        let param = {}
        param.id = row.id
        param.guid = row.guid
        paramArr.push(param)
        _this.$http.fetch(_this.$api.guide.sgPersonalQrcode.deletePersonalQrcode, paramArr).then(resp => {
          if (resp.result.failCount > 0) {
            _this.allDeleteFormVisible = true
          } else {
            _this.$notify.success('删除成功')
            _this.$refs.mainTable.$reload()
          }
        }).catch((resp) => {
          _this.$notify.error(getErrorMsg('删除失败，原因', resp))
        })
      })
    },
    // 活动效果
    onShowEffectAnalysisFun (row) {
      const name = row.name && row.name.includes('/') ? encodeURIComponent(row.name) : row.name
      this.$router.push(`/Guide/SgPersonalQrcode/List/ActivityEffect/${row.guid}/${name || ''}`)
    },
    qrcodeLink (row) { // 聚合二维码
      this.row = row
      this.onShowId = row.id
      if (row) {
        this.type = row.type
        if (this.memberManagePlan === 1 && row.type === 0) {
          // 修改此情况下聚合二维码的显示
          this.$refs.QrCodeDialog.getQrCode(row)
          return
          // if (row.qrcode_url === '' || row.qrcode_url === null) {
          //   this.personalQrcodeLink = bgimg
          // } else {
          //   this.personalQrcodeLink = row.qrcode_url
          // }
        } else if (this.memberManagePlan === 2 || (this.memberManagePlan === 1 && row.type === 1)) {
          this.row = row
          var hostUrl = window.location.protocol + '//' + window.location.host
          this.personalQrcodeLink = hostUrl + '/mobile/aggregationCode.html?guid=' + row.guid + '&groupId=' + row.groupid
          this.onShowId = row.id
          if (row.bgimg === '' || row.bgimg === null) {
            this.bgpic = bgimg
          } else {
            this.bgpic = row.bgimg
          }
        }
        if (row) {
          this.title = '聚合二维码'
          const s = () => {
            this.nextStep = '确定'
            this.personalLinkFormVisible = true
          }
          s()
        }
      }
    },
    posterLink (dataRow) {
      this.$refs.PosterDialog.getPosterUrl(dataRow)
    },
    cleanPersonQrcode () {
      this.personalLinkFormVisible = false
    },
    onConfirmResign () {
      _this.guideFindList()
      _this.findCustomerList()
      _this.onSaveCustomTransfer()
    },
    // 分页-页数改变
    customerPageChange (page) {
      var _this = this
      _this.paginations.page = page
      _this.findCustomerList()
    },
    // 分页-大小改变
    customerSizeChange (pageSize) {
      var _this = this
      _this.paginations.size = pageSize
      _this.paginations.page = 1
      _this.findCustomerList()
    },
    // 利用map key的唯一性去重
    handRepeatCustomer (selected, unSelected) {
      var _this = this
      var map = new Map()
      var arrays = []
      if (unSelected !== null && unSelected !== undefined && unSelected.length > 0) {
        for (let x = 0; x < _this.allPageCustomer.length; x++) {
          for (let y; y < unSelected.length; y++) {
            if (_this.allPageCustomer[x].customerId === unSelected[y]) {
              _this.allPageCustomer.splice(x, 1)
              x--
            }
          }
        }
      } else {
        for (let x = 0; x < selected.length; x++) {
          map.set(selected[x].customerId + '', selected[x])
        }
        for (let y = 0; y < _this.allPageCustomer.length; y++) {
          map.set(_this.allPageCustomer[y].customerId + '', _this.allPageCustomer[y])
        }
        map.forEach(function (value, key, map) {
          arrays.push(value)
        })
        _this.allPageCustomer = arrays
      }
    },
    selectAll: function (selected) {
      var _this = this
      // 当前页全选
      if (selected.length !== 0) {
        var arrays = []
        for (var a = 0; a < selected.length; a++) {
          arrays.push(selected[a])
        }
        _this.thisPageCustomer = arrays
        if (_this.allPageCustomer.length > 0) {
          // 数组去重
          _this.handRepeatCustomer(arrays, null)
        } else {
          _this.allPageCustomer = arrays
        }
      } else {
        // 当前页全不选
        _this.handRepeatCustomer(null, _this.thisPageCustomer)
      }
    },
    selectRow: function (selected, row) {
      var _this = this
      _this.thisPageCustomer = selected
      if (row !== null) {
        for (let x = 0; x < _this.allPageCustomer.length; x++) {
          if (_this.allPageCustomer[x].customerId === row.customerId) {
            _this.allPageCustomer.splice(x, 1)
            break
          }
        }
      }
      if (selected.length > 0) {
        _this.handRepeatCustomer(selected, null)
      }
    },
    chooseCustomerFocus: function () {
      var _this = this
      if (_this.allPageCustomer.length > 0) {
        _this.tableDataCustomer.filter(function (item, index) {
          for (var i = 0; i < _this.allPageCustomer.length; i++) {
            if (_this.allPageCustomer[i].customerId === item.customerId) {
              setTimeout(function () {
                // _this.$refs.chooseCustomer.toggleRowSelection(item)
              }, 0)
            }
          }
        })
      }
    },
    downLodeQyQrcode () {
      var event = new MouseEvent('click')
      var a = document.createElement('a')
      a.download = name || '背景图'
      // 设置图片地址
      a.href = this.personalQrcodeLink
      // a.click()
      a.dispatchEvent(event)
    },
    disabled (shopId) {
      let retVal = this.guideShopList.some(item => {
        return item.shopId === shopId
      })
      return retVal
    },
    thisGuideDisabled (guideId) {
      let _this = this
      if (guideId === _this.guideId) {
        return true
      } else {
        return false
      }
    },
    closeDialog () {
      // Object.assign(this.$data.model, this.$options.data().model)
      this.$data.model = this.$options.data().model
      this.personalLinkFormVisible = false
      this.isHidden = false
      this.row = null
    }
  },
  watch: {
    subordinateStores (newValue) {
      this.storeOwnershipDisplay = !!(newValue && newValue.length > 0)
    },
    resignFormVisible (newRadio) {
      if (newRadio === false) {
        this.transferRadio = '1'
      }
    }
  }
}
