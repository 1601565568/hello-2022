export default {
  data () {
    return {
      pageHeight: 0
    }
  },
  methods: {
    setHeight: function () {
      let menuHeight = 80
      let headHeight = 48
      let limitHeight = window.innerHeight - menuHeight - headHeight
      this.pageHeight = limitHeight
    }
  },
  created () {
    this.setHeight()
    window.addEventListener('resize', this.setHeight)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.setHeight)
  }
}
