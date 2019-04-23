import ErrorCode from '@/config/errorCode'
import formMixin from 'mixins/form'

var vm
export default {
  mixins: [formMixin],
  data: function () {
    return {
      remarkSelect: 'public',
      title: '新增备注短语',
      copyMemo: {},
      visible: false,
      loading: false,
      shops: [],
      model: {
        memo_phrase: '',
        shop_id: '',
        is_public: '1',
        id: ''
      },
      rules: {
        shop_id: [{required: true, message: '请选择店铺', trigger: 'change'}],
        memo_phrase: [
          {required: true, message: '请输入备注短语', trigger: 'blur'},
          {min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur'},
          {
            validator: (rule, value, callback) => {
              if (value !== '') {
                vm.$http.fetch(vm.$api.kdjl.remarks.queryByMemoPhrase, {
                  memoPhrase: vm.model.memo_phrase,
                  id: vm.model.id
                })
                  .then((resp) => {
                    if (resp.code === ErrorCode.TITLE_REPEAT) {
                      callback(new Error(resp.msg))
                    } else {
                      callback()
                    }
                  }).catch((resp) => {
                    callback(new Error(resp.msg))
                  }).finally()
              } else {
                callback(new Error('请输入备注短语'))
              }
            }
          }
        ]
      }
    }
  },
  methods: {
    handleClick (obj) {
      if (obj.name === 'public') {
        vm.model.is_public = '1'
        vm.remarkSelect = 'public'
      } else {
        vm.model.is_public = '0'
        vm.remarkSelect = 'private'
      }
    },
    add: function () {
      vm.title = '新增备注短语'
      if (JSON.stringify(this.copyMemo) === '{}') {
        var data = JSON.parse(JSON.stringify(vm.model))
        this.copyMemo = data
      }
      vm.visible = true
    },
    update: function (obj) {
      if (JSON.stringify(this.copyMemo) === '{}') {
        var data = JSON.parse(JSON.stringify(vm.model))
        this.copyMemo = data
      }
      vm.title = '修改备注短语'
      vm.model.memo_phrase = obj.memo_phrase
      vm.model.shop_id = obj.shop_id
      vm.model.id = obj.id
      vm.model.is_public = obj.is_public + ''
      vm.visible = true
    },
    onCloseTouhDialog: function () { // 关闭触达黑名单弹框
      vm.$refs.formTouch.resetFields()
      vm.visibleAddTouch = false
    },
    onSave: function () { // 保存
      vm.$refs['form'].validate((valid) => {
        if (valid) {
          vm.loading = true
          vm.$http.fetch(vm.$api.kdjl.remarks.saveOrUpdate, vm.model)
          .then((resp) => {
            vm.$notify.success(resp.msg)
            vm.$refs.public.$reload()
            vm.$refs.private.$reload()
            vm.onClose()
          }).catch((resp) => {
            vm.$notify.error(resp.msg)
          }).finally(() => {
            vm.loading = false
          })
        } else {
          return false
        }
      })
    },
    onClose: function () { // 关闭
      vm.$refs['form'].resetFields()
      vm.model = JSON.parse(JSON.stringify(vm.copyMemo))
      vm.visible = false
    }
  },
  watch: {},
  created: function () {
    vm = this
    vm.$http.fetch(vm.$api.core.common.queryShopListForTopByBrand)
      .then((resp) => {
        vm.shops = resp.result
      }).catch((resp) => {
        vm.$notify.error(resp.msg)
      }).finally()
  },
  mounted: function () {
  }
}
