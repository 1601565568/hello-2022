import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import { getErrorMsg } from '@/utils/toast'
import ShopSelectLoad from '@/components/ShopSelectLoad'
import NsTableColumnOperateButtonExt from '@/components/NsTableColumnOperateButton'

export default {
  name: 'NsTableAutoPass',
  mixins: [tableMixin],
  components: { NsTableColumnOperateButtonExt, ShopSelectLoad },
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
          this.onShowFun(scope.row)
        },
        'icon': '',
        'name': '投放预览',
        'auth': ``,
        'visible': `scope.row.status !== 2`
      },
      {
        'func': function (scope) {
          this.onEditFun(scope.row)
        },
        'icon': '',
        'name': '编辑',
        'auth': ``,
        'visible': `scope.row.status !== 2`
      },
      {
        'func': function (scope) {
          this.onDeleteFun(scope.row)
        },
        'icon': '',
        'name': '删除',
        'auth': ``,
        'visible': `scope.row.status !== 2`
      }
    ]
    const qywxtableButtons = [
      {
        'func': function (scope) {
          this.onEditFun(scope.row)
        },
        'icon': '',
        'name': '编辑',
        'auth': ``,
        'visible': `scope.row.status !== 2`
      },
      {
        'func': function (scope) {
          this.onDeleteFun(scope.row)
        },
        'icon': '',
        'name': '删除',
        'auth': ``,
        'visible': `scope.row.status !== 2`
      }
    ]
    const operateButtons = [
      {
        'func': function () {
          this.$router.push({ path: '/Guide/SgPersonalQrcode/List/Edit/0' })
        },
        'name': '新增'
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
      'validateMsg': null,
      'shop': null,
      'job': null,
      'guideState': 1,
      'personnel': null,
      'type': '1',
      'sortType': '1'
    }
    let model = Object.assign({}, findVo, {}, searchModel)
    return {
      model: model,
      quickSearchModel: quickSearchModel,
      _pagination: pagination,
      _table: {
        table_buttons: tableButtons,
        qywx_table_buttons: qywxtableButtons,
        operate_buttons: operateButtons,
        quickSearchNames: quickSearchNames,
        quickSearchMap: {}
      },
      _queryConfig: { expand: false },
      multipleSelection: [],
      select: true,
      bindDeviceDialog: {
        visible: false,
        guide: {}
      },
      memberManagePlan: 1,
      shopSelectUrl: this.$api.guide.shop.findBrandShopList,
      shopSelectOptions: [],
      typeOptions: [
        {
          value: '1',
          label: '创建时间'
        },
        {
          value: '2',
          label: '扫描次数'
        }
      ],
      sortTypeOptions: [
        {
          value: '1',
          label: '降序'
        },
        {
          value: '2',
          label: '升序'
        }
      ]
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
    thisGuideDisabled (guideId) {
      let retVal = this.guideShopList.some(item => {
        return item.id === guideId
      })
      return retVal
    },
    handleSelectionChange (val) {
      this.$emit('handleSelectionChange', val)
    },
    // 编辑
    onEditFun (val) {
      this.$emit('onEditFun', val)
    },
    // 投放预览
    onShowFun (val) {
      this.$emit('onShowFun', val)
    },
    // 删除
    onDeleteFun (val) {
      this.$emit('onDeleteFun', val)
    },
    qrcodeLink (data) {
      this.$emit('qrcodeLink', data)
    },
    onDelsTipFun (val) {
      this.$emit('onDelsTipFun', val)
    },
    // 解析从后台传进来的字符串
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
    changeState (state, id) {
      let _this = this
      _this.$http.fetch(_this.$api.guide.guide.updateGuideStatus, {
        guideId: id,
        status: state
      }).then(resp => {
        if (resp.success) {
          _this.$notify.success('切换成功！')
        } else {
          _this.$notify.error(getErrorMsg('切换失败，原因', resp))
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    onShowBindDialog (row) {
    }
  }
}
