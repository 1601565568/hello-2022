export default {
  data () {
    return {
      activeNames: [],
      value1: true
    }
  },
  methods: {
    // 解决switch 开关触发 collapse
    onclick (event) {
      event.stopPropagation()
    },
    // 点击获取编辑模块
    onShowEdit () {
      return false
    }
  }
}
