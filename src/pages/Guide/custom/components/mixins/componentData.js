export default {
  props: {
    editData: {
      type: Array
    }
  },
  data () {
    return {
      show: true
    }
  },
  watch: {
    editData: {
      handler (newVal) {
        let length = newVal.length
        let i = 0
        newVal.forEach(item => {
          if (item.status === 1) {
            i = i + 1
          }
        })
        this.show = i <= length && i > 0
      },
      deep: true,
      immediate: true
    }
  }
}
