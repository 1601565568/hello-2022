import LoadMore from '@/pages/Social/components/LoadMore'
import ChatRecordList from '@/pages/Social/components/chatRecordList'
import ElDrawer from '@nascent/nui/lib/drawer'
import ItemDrawer from '../../components/ItemDrawer'
import nsAddBorder from '../../topicAnalysis/image/ns-add-border.png'
import infiniteScroll from 'vue-infinite-scroll'
export default {
  directives: { infiniteScroll },
  components: { LoadMore, ChatRecordList, ElDrawer, ItemDrawer },
  data () {
    return {
      nsAddBorder,
      // 分页配置
      pagination: {
        size: 15,
        sizeOpts: [15, 25, 50, 100],
        page: 1,
        total: 0
      },
      ruleForm: {
        desc: ''
      },
      rules: {
        desc: [{ required: true, message: '请输入敏感词', trigger: 'blur' }]
      },
      busy: false,
      visible: false,
      delShow: false,
      value1: '',
      activeName: '客户',
      count: 40,
      input1: '',
      select: 1,
      drawer: false,
      table: {
        loading: false,
        tableData: [
          {
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          },
          {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          },
          {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }
        ]
      }
    }
  },
  computed: {
    placeholder () {
      return `请输入${this.activeName}`
    },
    ml () {
      return this.unfoldAndStow ? 'template-page__right_content' : ''
    }
  },
  created () {
    window.addEventListener('resize', this.setHeight)
  },
  mounted () {
    this.$nextTick(() => {
      for (let i = 0; i < 10; i++) {
        this.table.tableData.push({
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        })
      }
    })
    this.setHeight()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.setHeight)
  },
  methods: {
    loadMore () {
      this.count = this.count + 20
      console.log('123123123123123')
    },
    /**
     * 聊天客户列表加载更多
     */
    changeScroll () {
      return false
      // this.count += 2
    },
    selectUser (i) {
      this.select = i
    },
    /**
     * 每页条数发生变化
     */
    handleSizeChange (size) {
      console.log(size)
    },
    /**
     * 页码发生变化
     */
    handlePageChange (page) {
      console.log(page)
    },
    setHeight: function () {
      this.$nextTick(() => {
        let extraHeight =
          this.$refs.fullScreen.$el.getBoundingClientRect().top || 0
        this.$refs.fullScreen.$el.children[0].style.maxHeight =
          window.innerHeight - extraHeight - 38 + 'px'
        let limitHeight =
          window.innerHeight -
          16 -
          20 -
          this.$refs.loadMoreWrapper.getBoundingClientRect().top
        this.$refs.loadMoreWrapper.style.height = limitHeight + 'px'
      })
    }
  }
}
