import back from './back'

export default {
  install (Vue, options) {
    Vue.mixin({
      methods: {
        back
      }
    })
  }
}
