import formMixin from 'web-crm/src/mixins/form'
import ErrorCode from '@/config/errorCode'
import CryptoJS from 'crypto-js'
import EncryptKey from '@/config/encryptKey'
var vm
function checkPasswordRule () {
  return [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' },
    { validator: (rule, value, callback) => {
      var password = vm.model.user_psw
      var resetPassword = vm.model.user_repsw
      if (value !== '') {
        if (/^(?![^a-zA-Z]+$)(?!\D+$)/.test(value)) {
          if (value.length <= 18) {
            if (resetPassword !== '') {
              if (password !== resetPassword) {
                callback(new Error('两次输入密码有误'))
              } else {
                callback()
              }
            }
          } else {
            callback(new Error('长度超过 18 个字符'))
          }
        } else {
          callback(new Error('密码只能数字、字母组合'))
        }
      } else {
        callback()
      }
    },
    trigger: 'blur' }]
}
function checkResetPs () {
  return [{ validator: (rule, value, callback) => {
    var resetPassword = vm.model.reset_repsw
    if (resetPassword !== '') {
      if (value === '') {
        callback(new Error('密码只能数字、字母组合'))
      }
      if (/^(?![^a-zA-Z]+$)(?!\D+$)/.test(value)) {
        if (value.length > 18) {
          callback(new Error('长度超过 18 个字符'))
        } else {
          callback()
        }
      } else {
        callback(new Error('密码只能数字、字母组合'))
      }
    } else if (resetPassword === '' && value !== '') {
      vm.$refs.form.validateField('reset_repsw')
      callback()
    } else {
      callback()
    }
  },
  trigger: 'blur' }]
}
function checkResetRsPs () {
  return [{ validator: (rule, value, callback) => {
    var password = vm.model.reset_psw
    if (password !== '') {
      if (/^(?![^a-zA-Z]+$)(?!\D+$)/.test(value)) {
        if (value.length === 0) {
          callback(new Error('密码只能数字、字母组合'))
        }
        if (value.length <= 18) {
          if (password !== value) {
            callback(new Error('两次输入密码有误'))
          } else {
            callback()
          }
        } else {
          callback(new Error('长度超过 18 个字符'))
        }
      } else {
        callback(new Error('密码只能数字、字母组合'))
      }
    } else {
      vm.$refs.form.validateField('reset_psw')
      callback()
    }
  },
  trigger: 'blur' }]
}
export default {
  mixins: [formMixin],
  data: function () {
    return {
      visibleUser: false,
      title: '新增用户',
      roleOption: [],
      department: [],
      reset: false,
      saveLoading: false,
      model: {
        id: '', // id
        login_account: '', // 登录账号
        user_psw: '', //  密码
        user_repsw: '', // 重新输入密码
        user_name: '', // 用户名
        department: '', // 部门id
        role_id: '', // 角色id
        reset_psw: '', // 重置密码
        reset_repsw: '' // 确认重置密码
      },
      rules: {
        login_account: [{ required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (/^[a-zA-Z][a-zA-Z0-9]*$/.test(value)) {
              vm.$http.fetch(vm.$api.core.sysUser.queryIsAccount
                , { id: vm.model.id, loginAccount: vm.model.login_account })
                .then((resp) => {
                  if (resp.code === ErrorCode.TITLE_REPEAT) {
                    callback(new Error('此用户名已存在,请重新输入'))
                  } else {
                    callback()
                  }
                })
            } else {
              callback(new Error('支持字母开头，数字、字母组合，不支持特殊字符'))
            }
          },
          trigger: 'blur' }],
        user_psw: checkPasswordRule(),
        user_repsw: checkPasswordRule(),
        reset_psw: checkResetPs(),
        reset_repsw: checkResetRsPs(),
        user_name: [{ required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }],
        department: [{ required: true, message: '请选择部门', trigger: 'change' }],
        role_id: [{ required: true, message: '请输入角色', trigger: 'change' }]
      }
    }
  },
  methods: {
    addUser: function () {
      this.title = '新增用户'
      this.reset = false
      this.visibleUser = true
    },
    updateUser: function (obj) {
      this.title = '修改用户'
      this.reset = true
      this.$set(this, 'model', this.model)
      var model = {
        user_name: obj.user_name,
        login_account: obj.login_account,
        department: { text: obj.department_name, value: obj.department_id },
        id: obj.id,
        role_id: obj.role_id,
        reset_psw: '',
        reset_repsw: ''
      }
      this.$set(this, 'model', model)
      this.visibleUser = true
    },
    onSave: function () {
      var password = ''
      if (vm.model.id !== '') {
        if (this.model.reset_psw.length > 0) {
          password = this.model.reset_psw
        }
      } else {
        if (vm.model.user_psw.length > 0) {
          password = vm.model.user_psw
        }
      }
      if (password.length > 0) {
        password = CryptoJS.MD5(EncryptKey.loginPsw + password).toString()
      }
      var sysUser = {
        id: vm.model.id,
        userPsw: password,
        userName: vm.model.user_name,
        departmentId: vm.model.department.value,
        loginAccount: vm.model.login_account,
        roleId: vm.model.role_id
      }
      vm.saveLoading = true
      vm.$refs.form.validate((valid) => {
        if (valid) {
          vm.$http.fetch(vm.$api.core.sysUser.saveOrUpdate, sysUser)
            .then((resp) => {
              vm.$notify.success(resp.msg)
              vm.$refs.table.$reload()
              vm.resetForm()
              vm.visibleUser = false
            }).catch((resp) => {
              vm.$notify.error(resp.msg)
            }).finally(() => {
              vm.saveLoading = false
            })
        } else {
          return false
        }
      })
    },
    onClose: function () {
      this.visibleUser = false
      this.resetForm()
    }
  },
  watch: {},
  created: function () {
    vm = this
    vm = this
    vm.$http.fetch(vm.$api.core.sysRole.queryOptionItem)
      .then((resp) => {
        vm.roleOption = resp.result
      })
    vm.$http.fetch(vm.$api.core.department.queryDepartmentTree)
      .then((resp) => {
        this.department = resp.result
      })
  },
  mounted: function () {}
}
