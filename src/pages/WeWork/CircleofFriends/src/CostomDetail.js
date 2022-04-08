export default {
  data () {
    return {
      commentList: [],
      commentNum: 0,
      likeList: [],
      likeNum: 0,
      info: {},
      drawer: false
    }
  },
  methods: {
    handleClose () {
      this.drawer = false
    },
    getPersonalMomentInfo (momentId) {
      this.$http
        .fetch(this.$api.guide.momentList.getPersonalMomentInfo, {
          momentId
        })
        .then(res => {
          if (res.success) {
            const { commentList, commentNum, likeList, likeNum, guidePic, guideName, shopName, textContent, createTime } = res.result
            this.commentList = commentList
            this.commentNum = commentNum
            this.likeList = likeList
            this.likeNum = likeNum
            this.info = {
              guidePic, guideName, shopName, textContent, createTime
            }
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
