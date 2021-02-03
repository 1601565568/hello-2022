import Page from '../../components/page'
import LoadMore from '../../components/LoadMore'
import ChatRecordList from '../../components/chatRecordList'
export default {
  components: { Page, LoadMore, ChatRecordList },
  data () {
    return {
      value1: '',
      activeName: '客户',
      count: 40,
      input1: '',
      select: 1
    }
  },
  computed: {
    placeholder () {
      return `请输入${this.activeName}`
    }
  },
  methods: {
    /**
     * 聊天客户列表加载更多
     */
    changeScroll () {
      return false
      // this.count += 2
    },
    selectUser (i) {
      this.select = i
    }
  }
}
