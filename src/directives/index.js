import autofocus from './autofocus'

export default {
  install (Vue, options) {
    Vue.directive('autofocus', autofocus)
  }
}
