import money from './money'

export default {
  register (Vue) {
    Vue.filter('money', money)
  }
}
