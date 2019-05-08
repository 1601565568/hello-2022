import api from '@/config/http'
import moment from 'moment/moment'
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
          this.$emit('synchronousStores')
        },
        'name': '同步门店'
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
        image: ''
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
      'shopName': null, // 门店名称
      'city': null, // 门点所在区域市
      'district': null, // 门点所在区域区
      'province': null, // 门点所在区域省
      'shopType': null, // 门店类型
      'phone': null, // 联系电话
      'area_region': null, // 所属地区
      'shopStatus': null, // 营业状态
      'area': [] // 所属区域
    }
    let model = Object.assign({}, findVo, {}, searchModel)
    let rules = {
      'name': [
        { required: true, message: '请输入姓名', trigger: 'blur' },
        { min: 0, max: 20, message: '已超过可输入长度', trigger: 'blur,change' }
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
        { min: 0, max: 20, message: '已超过可输入长度', trigger: 'blur,change' }
      ],
      'mobile': [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/, message: '手机号格式错误，请您重新输入！' }
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
      dialogFormVisible: false, // 点击上传弹窗
      model
    }
  },
  methods: {
    clickOnTheUpload (row) { // 点击上传按钮
      console.log('988989089')
      this.dialogFormVisible = true
    }
  },
  mounted: function () {
    var _this = this
    _this.initShopList()
  }
}
