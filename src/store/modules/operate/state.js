import LocalStorage from 'store/dist/store.legacy.min.js'

export default {
  // 登录成功后,该用户的拥有的菜单信息
  menus: LocalStorage.get('operate_menus') || [],
  brands: LocalStorage.get('operate_brands') || [],
  brand: LocalStorage.get('operate_brand') || {},
  // 记住密码相关信息，现在暂且只做记住一个账号密码
  // 后期：每次登录成功一次，就缓存到列表中，然后在登录表单，输入时，会出现下拉列表选择之前登录过得用户
  remumber: {
    remumber_flag: !!LocalStorage.get('remumber_flag'),
    remumber_login_info: LocalStorage.get('remumber_login_info') || {
      user: '',
      nick: '',
      token: '',
      lastCheckTime: null
    }
  }
}
