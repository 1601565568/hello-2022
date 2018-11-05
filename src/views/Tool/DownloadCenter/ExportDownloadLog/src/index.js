import formMixin from 'mixins/form'

var vm
export default {
  mixins: [formMixin],
  data: function () {
    return {
      visible: false,
      visibleShop: false,
      shopRadio: 0,
      checkedShops: [], // 选中的店铺
      checkedIndexShops: new Map(), // 页面加载得到店铺数据
      checkAllShops: new Map(), // 所有店铺信息
      shops: [],
      indexAllSelect: false,
      allSelect: false,
      allShopIds: [], // 得到所有店铺id
      isOnline: [],
      checkList: false,
      tagName: '',
      title: '新增品牌',
      isShow: true, // 是否集团品牌进行展示 默认true 非集团
      shopCount: 0,
      isIndeterminate: false,
      tagId: '',
      onLine: false, // 线上
      checkPlatForm: [], // 选择平台
      platForm: [], // 平台
      underLine: false, // 线下
      copyModel: {},
      brandModel: {
        tag_name: '',
        remark: '',
        member_scene: '1',
        checkPlatForm: [] // 选择平台
      },
      searchModel: {
        isOnline: '',
        shopName: ''
      },
      pagination: {
        pageSize: 15,
        sizeOpts: [15, 25, 50, 100],
        page: 1,
        total: 0,
        start: 0
      }
    }
  },
  methods: {
  },
  watch: {},
  created: function () {
    vm = this
  },
  mounted: function () {
    vm.$http.fetch(vm.$api.core.common.queryPlatForm)
    .then((resp) => {
      vm.platForm = resp.result
    })
  }
}
