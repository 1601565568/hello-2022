export default {
  props: {
    visible: Boolean,
    chatroomname: String
  },
  data () {
    return {
      sVisible: false
    }
  },
  watch: {
    visible (value) {
      this.sVisible = value
    }
  },
  mounted () {
    this.sVisible = this.visible
  },
  methods: {
    onClose () {
      this.$emit('update:visible', false)
      this.$emit('update:chatroomname', '')
    }
  }
}
