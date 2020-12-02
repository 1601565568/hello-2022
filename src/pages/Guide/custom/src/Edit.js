
export default {
  data () {
    return {}
  },
  methods: {
    onSave () {
      // console.log('保存')
      this.$refs.PageContentMiddle.toImage()
    },
    onCancel () {
      // console.log('取消')
    }
  }
}
