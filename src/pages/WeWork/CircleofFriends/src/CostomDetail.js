export default {
  data () {
    return {
      commentList: [],
      commentNum: 0,
      likeList: [],
      likeNum: 0
    }
  },
  methods: {
    getPersonalMomentInfo (momentId) {
      this.$http
        .fetch(this.$api.guide.momentList.getPersonalMomentInfo, {
          momentId
        })
        .then(res => {
          if (res.success) {
            const { commentList, commentNum, likeList, likeNum } = res.result
            this.commentList = commentList
            this.commentNum = commentNum
            this.likeList = likeList
            this.likeNum = likeNum
          }
        })
    },
    handleBack () {
      this.$router.go(-1)
    }
  },
  mounted () {
    const { momentId } = this.$route.query
    if (momentId) {
      this.getPersonalMomentInfo(momentId)
    }
  }
}
