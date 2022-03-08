import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import { getErrorMsg } from '@/utils/toast'
import ShopSelectLoad from '@/components/ShopSelectLoad'
import BindDevice from '../components/BindDevice'
import NsTableColumnOperateButtonExt from '@/components/NsTableColumnOperateButton'

export default {
  name: 'NsTableGuide',
  mixins: [tableMixin],
  components: { BindDevice, NsTableColumnOperateButtonExt, ShopSelectLoad },
  props: {
    url: Object
  },
  data: function () {
    let pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    const tableButtons = [
      {
        'func': function (scope) {
          this.onRedactFun(scope.row)
        },
        'icon': '',
        'name': '详情',
        'auth': ``,
        'visible': `scope.row.status !== 2`
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
        work_id: null,
        password: null,
        image: null
      },
      sgGuideShop: {
        id: null,
        shop_id: null,
        job: 0
      }
    }
    let findVo = {
      'workId': null,
      'workNumber': null,
      'mobile': null,
      'job': null,
      'name': null,
      'nickname': null,
      'shop': null,
      'guideState': null
    }
    let model = Object.assign({}, findVo, {}, searchModel)
    return {
      model: model,
      quickSearchModel: quickSearchModel,
      _table: {
        table_buttons: tableButtons,
        quickSearchNames: quickSearchNames,
        quickSearchMap: {}
      },
      multipleSelection: [],
      select: true,
      bindDeviceDialog: {
        visible: false,
        guide: {}
      },
      memberManagePlan: 1,
      shopSelectUrl: this.$api.guide.shop.findBrandShopList,
      shopSelectOptions: [],
      fuscous: process.env.VUE_APP_THEME,
      fuscousQA: 'fuscousQA',
      fuscousIcon: 'fuscousIcon'
    }
  },

  mounted: function () {
    if (typeof this.$init === 'function') {
    } else {
      this.$reload()
    }
    this.$http.fetch(this.$api.core.common.getRecruitVersion).then(data => {
      this.memberManagePlan = data.result.memberManagePlan
    })
  },
  computed: {},
  methods: {
    async scopeRowCountAndviewDetails (succeedObj) { // 查看门店详情和查看所属区域详情
      let that = this
      let obj = {}
      obj.templateId = succeedObj.template_id
      obj.appId = succeedObj.app_id
      that.particularsObj = {}
      await this.$http
        .fetch(that.$api.isv.getTemplateInfo, obj)
        .then(resp => {
          resp.result.audit_category = JSON.parse(resp.result.audit_category)
          that.particularsObj = resp.result
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
    },
    scopeRowCount (data) { // 查看门店详情和查看所属区域详情
      this.$emit('scopeRowCount', data)
    },
    onRedactFun (data) { // 查看门店详情和查看所属区域详情
      this.$emit('onRedactFun', data)
    },
    shopDel (index) {
      this.guideShopList.splice(index, 1)
    },
    disabled (shopId) {
      let retVal = this.guideShopList.some(item => {
        return item.shopId === shopId
      })
      return retVal
    },
    // 设置job清空时值为null而不是''
    setJobNull () {
      this.model.job = null
    },
    // 设置状态清空时为null
    setGuideStateNull () {
      this.model.guideState = null
    },
    // 设置shop清空时值为null而不是''
    setShopNull () {
      this.model.shop = null
    },
    thisGuideDisabled (guideId) {
      let retVal = this.guideShopList.some(item => {
        return item.id === guideId
      })
      return retVal
    },
    handleSelectionChange (val) {
      this.$emit('handleSelectionChange', val)
    },
    // 解析后台传进来的字符串
    strToJson (str) {
      if (str && str.length > 0) {
        return JSON.parse(str)
      } else {
        return null
      }
    },
    getListFirst (list) {
      if (list && list.length > 0) {
        return list[0]
      } else {
        return {
          district: '',
          name: '',
          job: ''
        }
      }
    },
    onShowBindDialog (row) {
      this.bindDeviceDialog.guide = row
      this.bindDeviceDialog.visible = true
    }
  }
}
