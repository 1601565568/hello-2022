export default {
  mounted () {
    const { step } = this.$route.query
    if (step) {
      const a = document.getElementById(step + 'a')
      a.click()
    }
    // const { step } = this.$route.query
    // if (step) {
    //   // this.$router.replace({
    //   //   path: `/Guide/Others/PayGuide#${step}`
    //   // })
    // }
  }
}
