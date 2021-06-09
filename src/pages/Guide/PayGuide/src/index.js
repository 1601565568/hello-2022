export default {
  data () {
    return {
      load: false
    }
  },
  mounted () {
    const { step } = this.$route.query
    if (step) {
      const a = document.getElementById(step + 'a')
      a.click()
    }
    setTimeout(() => {
      this.load = true
    }, 1000)
    // const { step } = this.$route.query
    // if (step) {
    //   // this.$router.replace({
    //   //   path: `/Guide/Others/PayGuide#${step}`
    //   // })
    // }
  }
}
