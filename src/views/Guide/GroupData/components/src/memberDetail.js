import { NO_IMG_BIG } from '@/utils/constants'

export default {
  props: {
    visible: Boolean,
    memberDetail: Object
  },
  data () {
    return {
      sVisible: false,
      NO_IMG_BIG
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
      this.$emit('update:memberDetail', {})
    }
  }
}
