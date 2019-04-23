import formMixin from 'mixins/form'
import ErrorCode from '@/config/errorCode'

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
      channels: [{id: 1, label: '线上', children: [], checked: false, parentId: '0'}, {id: 0, label: '线下', children: [], checked: false}],
      indexAllSelect: false,
      allSelect: false,
      allShopIds: [], // 得到所有店铺id
      isOnline: {text: '', value: ''},
      checkList: false,
      brandLoading: false,
      relationLoading: false,
      tagName: '',
      title: '新增品牌',
      isShow: true, // 是否集团品牌进行展示 默认true 非集团
      shopCount: 0,
      isIndeterminate: false,
      isAllIndeterminate: false,
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
      },
      rules: {
        tag_name: [{required: true, message: '请输入品牌名称'}, {validator: (rule, value, callback) => {
          if (this.brandModel.tag_name !== '') {
            var id = '0'
            if (typeof (this.brandModel.id) !== 'undefined') {
              id = this.brandModel.id
            }
            vm.$http.fetch(vm.$api.core.brand.queryByTagName
                , {'tagName': vm.brandModel.tag_name, 'id': id})
              .then((resp) => {
                if (resp.code === ErrorCode.TITLE_REPEAT) {
                  callback(new Error('此品牌名称已存在,请重新输入'))
                } else {
                  callback()
                }
              })
          } else {
            callback(new Error('请输入品牌名称'))
          }
        },
          trigger: 'blur'},
          { min: 1, max: 50, message: '已超过可输入长度', trigger: 'blur' }],
        checkPlatForm: [{validator: (rule, value, callback) => {
          if (vm.underLine) {
            callback()
          } else {
            if (value.length > 0) {
              callback()
            } else {
              callback(new Error('请选择业务平台'))
            }
          }
        },
          trigger: 'change'}
        ],
        remark: [{min: 1, max: 200, message: '请输入 1 到 200 个字符', trigger: 'change'}]
      }
    }
  },
  methods: {
    addTags: function () {
      vm.title = '新增品牌'
      vm.brandModel.remark = ''
      vm.brandModel.tag_name = ''
      vm.isShow = true
      this.visible = true
      this.$nextTick(() => {
        this.$refs.brandManageHeight.$el.children[0].style.maxHeight = '520px'
      })
    },
    updateTags (obj) {
      vm.title = '修改品牌'
      vm.brandModel.checkPlatForm = []
      vm.brandModel.tag_name = obj.row.tag_name
      vm.brandModel.id = obj.row.id
      if (obj.row.tag_type === 1) {
        vm.isShow = true
        vm.brandModel.remark = obj.row.remark
        if (obj.row.member_scene != null && obj.row.member_scene !== '') {
          vm.brandModel.member_scene = obj.row.member_scene.toString()
          if (obj.row.business_type_json !== null && obj.row.business_type_json !== '') {
            var platForms = obj.row.business_type_json.split(',')
            for (var indexPlatForm of platForms) {
              if (indexPlatForm === '0') {
                vm.underLine = true
              } else {
                vm.brandModel.checkPlatForm.push(parseInt(indexPlatForm))
              }
            }
          }
          if (vm.brandModel.checkPlatForm.length > 0) {
            vm.isIndeterminate = true
          }
        }
        if (vm.brandModel.checkPlatForm.length === vm.platForm.length - 1) {
          vm.onLine = true
        } else {
          vm.onLine = false
        }
      } else {
        vm.isShow = false
      }
      vm.visible = true
    },
    relationTags (obj) {
      vm.tagName = obj.row.tag_name
      vm.searchModel.platform = obj.row.business_type_json
      vm.tagId = obj.row.id
      vm.checkAllShops = new Map()
      var start = (vm.pagination.page - 1) * vm.pagination.pageSize
      var length = vm.pagination.pageSize
      vm.$http.fetch(vm.$api.core.sysShop.queryShopByPlatFormAndShopByTadId, { platForm: vm.searchModel.platform, tagId: obj.row.id, start: start, length: length })
      .then((resp) => {
        if (resp.result != null) {
          for (let shop of resp.result.shop) {
            vm.checkAllShops.set(shop.value, 0)
          }
          for (let selectShop of resp.result.selectShops) {
            vm.checkAllShops.set(selectShop, 1)
          }
          vm.pagination.total = parseInt(resp.result.indexSelectShop.recordsTotal)
          vm.shops = resp.result.indexSelectShop.data
          for (let shop of vm.shops) {
            if (vm.checkAllShops.get(shop.value) === 1) {
              vm.checkedShops.push(shop.value)
            }
          }
          vm.visibleShop = true
          vm.selectCount()
          vm.checked()
        }
      })
    },
    getTable: function () {
      vm.indexAllSelect = false
      var table = {}
      table.start = (vm.pagination.page - 1) * vm.pagination.pageSize
      table.length = vm.pagination.pageSize
      vm.searchModel.tagId = vm.tagId
      table.searchMap = vm.searchModel
      vm.$http.fetch(vm.$api.core.brand.queryShop, table).then((resp) => {
        vm.checkedShops = []
        vm.shops = []
        vm.pagination.total = parseInt(resp.result.recordsTotal)
        vm.shops = resp.result.data
        for (let shop of vm.shops) {
          if (vm.checkAllShops.get(shop.value) === 1) {
            vm.checkedShops.push(shop.value)
          }
        }
        vm.checked()
        vm.selectCount()
        vm.visibleShop = true
      })
    },
    change (obj) {
      if (vm.shops.length > 0) {
        vm.checkedShops = []
        if (obj) {
          for (let shop of vm.shops) {
            vm.checkAllShops.set(shop.value, 1)
            vm.checkedShops.push(shop.value)
          }
        } else {
          for (let shop of vm.shops) {
            vm.checkAllShops.set(shop.value, 0)
          }
        }
        vm.selectCount()
        vm.checked()
      }
    },
    changeAll (obj) {
      if (vm.checkAllShops.size > 0) {
        vm.checkedShops = []
        var state = 0
        if (obj) {
          for (let shop of vm.shops) {
            vm.checkedShops.push(shop.value)
          }
          state = 1
        }
        for (let key of vm.checkAllShops.keys()) {
          vm.checkAllShops.set(key, state)
        }
        if (vm.checkedShops.length === vm.shops.length && vm.shops.length > 0) {
          vm.indexAllSelect = true
        } else {
          vm.indexAllSelect = false
        }
        vm.selectCount()
        vm.checked()
      }
      vm.indexAllSelect = obj
    },
    onSaveRelation () {
      var ids = []
      for (let [key, value] of vm.checkAllShops) {
        if (value === 1) {
          ids.push(key)
        }
      }
      vm.relationLoading = true
      vm.$http.fetch(vm.$api.core.brand.saveShopAndTags, {'shopIds': ids, 'tagId': vm.tagId})
      .then((resp) => {
        vm.$notify.success('关联店铺成功')
        vm.onCloseRelation()
      }).catch((resp) => {
        vm.$notify.error(resp.msg)
      }).finally(() => {
        vm.relationLoading = false
      })
    },
    onCloseRelation () {
      vm.isOnline = {text: '', value: ''}
      vm.indexAllSelect = false
      vm.allSelect = false
      vm.searchModel.isOnline = ''
      vm.searchModel.shopName = ''
      vm.checkedShops = []
      vm.tagId = ''
      vm.shopCount = 0
      vm.pagination.page = 1
      vm.pagination.start = 0
      vm.pagination.pageSize = 15
      vm.isIndeterminate = false
      vm.checkedIndexShops = new Map()
      this.$set(vm, 'visibleShop', false)
      vm.checkAllShops = new Map()
    },
    handleCheckedShopsChange (shopIds) {
      for (let shop of vm.shops) {
        vm.checkAllShops.set(shop.value, 0)
      }
      for (let shopId of shopIds) {
        vm.checkAllShops.set(shopId, 1)
      }
      vm.selectCount()
      vm.checked()
    },
    checked () {
      if (vm.checkedShops.length > 0) {
        vm.isIndeterminate = true
      } else {
        vm.isIndeterminate = false
      }
      if (vm.checkedShops.length === vm.shops.length && vm.checkedShops.length > 0) {
        vm.isIndeterminate = false
        vm.indexAllSelect = true
      } else {
        vm.indexAllSelect = false
      }
      if (vm.shopCount > 0) {
        vm.isAllIndeterminate = true
      } else {
        vm.isAllIndeterminate = false
      }
      if (vm.shopCount === vm.checkAllShops.size && vm.checkAllShops.size !== 0) {
        vm.allSelect = true
        vm.isAllIndeterminate = false
      } else {
        vm.allSelect = false
      }
    },
    selectCount () {
      var i = 0
      for (let value of vm.checkAllShops.values()) {
        if (value === 1) {
          i++
        }
      }
      vm.shopCount = i
    },
    searchAction () {
      if (vm.isOnline.value !== '') {
        if (vm.isOnline.value.split(',').length === 2) {
          vm.searchModel.isOnline = ''
        } else {
          vm.searchModel.isOnline = vm.isOnline.value
        }
      } else {
        vm.searchModel.isOnline = ''
      }
      vm.pagination.page = 1
      vm.getTable()
    },
    handleCurrentChange (obj) {
      vm.pagination.start = (obj - 1) * vm.pagination.pageSize
      vm.getTable()
    },
    handleSizeChange (obj) {
      vm.pagination.pageSize = obj
      vm.getTable()
    },
    onCloseDialog () {
      var copyModel = {
        tag_name: '',
        remark: '',
        member_scene: '1',
        checkPlatForm: [] // 选择平台
      }
      this.$refs.table.brandCheckboxVal = false
      this.$refs.table.brandIndeterminateIndex = false
      this.$set(this, 'brandModel', copyModel)
      this.$refs.form.resetFields()
      this.underLine = false
      this.isIndeterminate = false
      this.visible = false
    },
    onSave () {
      var that = this
      if (vm.underLine) {
        vm.brandModel.checkPlatForm.push('0')
      }
      vm.brandModel.business_type_json = vm.brandModel.checkPlatForm.join(',')
      vm.onLine = false
      that.$refs['form'].validate((valid) => {
        if (valid) {
          that.brandLoading = true
          that.$http.fetch(that.$api.core.brand.saveOrUpdateSysTags, vm.brandModel)
          .then((resp) => {
            delete vm.brandModel.id
            that.onCloseDialog()
            that.$refs.table.$reload()
            that.$notify.success(resp.msg)
          }).catch((err) => {
            that.$notify.error(err.msg)
          }).finally(() => {
            vm.brandLoading = false
          })
        } else {
          return false
        }
      })
    },
    changeOnLine (obj) {
      if (obj) {
        vm.brandModel.checkPlatForm = []
        for (let palt of vm.platForm) {
          vm.brandModel.checkPlatForm.push(palt.value)
        }
      } else {
        vm.brandModel.checkPlatForm = []
      }
      vm.isIndeterminate = false
    },
    indexChangePlatForm (obj) {
      if (obj.length > 0) {
        vm.isIndeterminate = true
      } else {
        vm.isIndeterminate = false
      }
      if (obj.length === vm.platForm.length) {
        vm.isIndeterminate = false
        vm.onLine = true
      } else {
        vm.onLine = false
      }
    }
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
