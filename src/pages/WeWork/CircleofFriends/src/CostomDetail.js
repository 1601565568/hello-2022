export default {
  mounted () {
    const { momentId, userId = null } = this.$route.query
    if (momentId) {
      this.getMomentInfo(momentId, userId)
    }
  }
}
