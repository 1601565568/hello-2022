import api from 'configs/http'
export default {
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
    const tableButtons = [{}]
    const operateButtons = [
      {
        'func': function () {
          this.$emit('add')
        },
        'name': '新增导购'
      }
    ]
    let quickInput = [{
      'template': '',
      'inline': false,
      'name': 'name',
      'text': '任务名称',
      'placeholder': '请输入任务名称',
      'type': 'text',
      'value': ''
    }]
    let quickSearchNames = quickInput.map(x => x.name)
    let quickSearchModel = {}
    let searchModel = {
      sgGuide: {
        brand_id: null,
        name: null,
        nickname: null,
        sex: 1,
        mobile: null,
        birthday: null,
        work_num: '',
        password: null,
        image: '',
        operator: 1,
        operators: null,
        staff: null,
        brandParty: null,
        endTime: null,
        moduleType: null,
        operatorId: null,
        operatorName: null,
        shopId: null,
        startTime: null,
        terminalType: null
      },
      sgGuideShop: {
        id: null,
        shop_id: '',
        job: 0,
        memberBelonging: 1,
        updateAllGuidePrefix: 0
      },
      sgGuideVo: {
        newShopId: 0,
        type: 0
      }
    }
    let findVo = {
      'name': null,
      'shop': null,
      'job': null,
      'guideState': 1
    }
    let model = Object.assign({}, findVo, {}, searchModel)
    let rules = {
      'name': [
        {required: true, message: '请输入姓名', trigger: 'blur'},
        {min: 0, max: 20, message: '已超过可输入长度', trigger: 'blur,change'}
      ],
      'shop': [
        {
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (this.model.sgGuideShop.shop_id === null || this.model.sgGuideShop.shop_id === 0) {
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
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (this.subordinateStores.length < 1) {
              callback(new Error('请选择所属门店'))
            } else {
              callback()
            }
          }
        }
      ],
      'nickname': [
        // {required: true, message: '请输入昵称', trigger: 'blur'},
        {min: 0, max: 20, message: '已超过可输入长度', trigger: 'blur,change'}
      ],
      'mobile': [
        {required: true, message: '请输入手机号', trigger: 'blur'},
        {pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/, message: '手机号格式错误，请您重新输入！'}
      ],
      'work_id': [
        {
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (this.model.sgGuide.work_number === '') {
              callback(new Error('请输入工号'))
            } else {
              callback()
            }
          }
        }
      ]
    }
    let that = this
    quickInput.map(item => {
      Object.defineProperty(quickSearchModel, item.name, {
        get: function () {
          return model[item.name]
        },
        set: function (val) {
          model[item.name] = val
          // todo 由于特殊需求导致以下列写法
          if (item.type === 'radio') {
            that._data._table.quickSearchMap[item.name] = val
            that.$quickSearch$()
          }
        },
        enumerable: true
      })
    })
    return {
      subordinateStores: [],
      showUpdateAllGuidePrefix: false,
      disabledWorkPrefix: true,
      imageRoot: api.API_ROOT + '/core/file/showImage?fileKey=',
      title: '变更详情',
      transferWay: '1',
      brandId: null,
      shopKuhuShow: false,
      dialogVisible: false,
      customerIds: null,                  // 转移的客户ids，用逗号隔开
      allPageCustomer: [],                // 选择的所有的客户
      thisPageCustomer: [],               // 当前页面全选的客户
      pageChange: true,                   // 当前页数
      guideId: null,                      //  当前导购的id
      shopId: null,
      shopIds: null,
      successCount: null,
      failCount: null,
      receiveGuideId: null,               //  接收的导购id
      customerTotal: null,
      rules: rules,
      row: null,
      memberBelongingtitle: '',
      memberBelongingShow: false,
      verification: false,
      guideList: [],
      shopList: [],
      shopFindList: [],
      shopFindLists: [],
      guideShopList: [],
      dimissionArry: [],      // 批量离职员工数组
      replaceStoresArry: [],  // 批量更换门店数组
      tableDataCustomer: [],        // 客户集合
      multipleSelection: [],
      multipleSelections: [],
      allDeleteName: [],
      model: model,
      changeValue: {},
      guideValue: null,
      newAdd: {
        brand_id: null,
        name: null,
        nickname: null,
        sex: 1,
        mobile: null,
        birthday: null,
        work_num: '',
        password: null,
        image: '',
        id: null,
        shop_id: null,
        job: 0
      },
      logoValue: null,
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
      _pagination: pagination,
      paginations: paginations,
      shopTitle: '门店更换列表',
      scopeRowCountShow: false,
      _table: {
        table_buttons: tableButtons,
        operate_buttons: operateButtons,
        quickSearchNames: quickSearchNames,
        quickSearchMap: {}
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 8.64e7
        }
      },
      _queryConfig: {expand: false}
    }
  },
  methods: {
    viewDetails (value) {
      this.shopKuhuShow = true
      this.initList(value)
    },
    initList (value) { // 查询详情列表
      let _this = this
      let arr = []
      let arr1 = []
      _this.$http.fetch(_this.$api.guide.guide.operationlogGetDetail, {id: Number(value.id)}).then(resp => {
        if (resp.result.afterJson !== null) {
          resp.result.afterJson = JSON.parse(resp.result.afterJson)
          console.log(resp.result.afterJson)
          for (let i in resp.result.afterJson) {
            if (Object.prototype.toString.call(resp.result.afterJson[i]) === '[object Array]') {
              resp.result.afterJson[i].map(item => {
                let str = ''
                for (let j in item) {
                  str = str + `${j}:${item[j] || '-'}，`
                }
                arr.push(str.substring(0, str.length - 1))
              })
            } else {
              arr.push(`${i}:${resp.result.afterJson[i] || ''}`)
            }
          }
          resp.result.afterJson = arr
        }
        if (resp.result.beforeJson !== null) {
          resp.result.beforeJson = JSON.parse(resp.result.beforeJson)
          for (let i in resp.result.beforeJson) {
            if (Object.prototype.toString.call(resp.result.beforeJson[i]) === '[object Array]') {
              resp.result.beforeJson[i].map(item => {
                let str = ''
                for (let j in item) {
                  str = str + `${j}:${item[j] || '-'}，`
                }
                arr1.push(str.substring(0, str.length - 1))
              })
            } else {
              arr1.push(`${i}:${resp.result.beforeJson[i] || ''}`)
            }
          }
          resp.result.beforeJson = arr1
        }
        this.changeValue = resp.result
      }).catch((resp) => {
        _this.$notify.error('查询失败：' + resp.msg)
      })
    }
  }
}
