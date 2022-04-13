import backIcon from '@/assets/icon-fanhuishangyiji.png'
export default {
  data () {
    return {
      drawer: false,
      backIcon,
      info: {}
    }
  },
  methods: {
    changeDrawer (drawer = !this.drawer) {
      this.drawer = drawer
    },
    handleBack () {
      this.$router.go(-1)
    },
    getMomentInfo (momentId, userId) {
      const parmas = { momentId }
      userId && (parmas.userId = userId)
      this.$http
        .fetch(this.$api.guide.momentList.getMomentInfo, parmas)
        .then(res => {
          if (res.success) {
            this.info = res.result
          }
        })
    }
  }
}
