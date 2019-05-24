
import numeral from 'numeral'

export default {
  install (Vue, options) {
    Vue.prototype.$numeral = numeral
  }
}
