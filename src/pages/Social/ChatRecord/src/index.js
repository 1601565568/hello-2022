import LoadMore from '../../components/LoadMore'
import ChatRecordList from '../../components/chatRecordList'
import packup from '../image/ns-arrow-packup.png'
import unfold from '../image/ns-arrow-unfold.png'
export default {
  components: { LoadMore, ChatRecordList },
  data () {
    return {
      packup,
      unfold,
      value1: '',
      activeName: '1',
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
