import LoadMore from '@/pages/Social/components/LoadMore'
import ChatRecordList from '@/pages/Social/components/chatRecordList'
import ElDrawer from '@nascent/nui/lib/drawer'
import ItemDrawer from '../../components/ItemDrawer'
import packup from '../image/ns-arrow-packup.png'
import unfold from '../image/ns-arrow-unfold.png'
export default {
  components: { LoadMore, ChatRecordList, ElDrawer, ItemDrawer },
  data () {
    return {
      packup,
      unfold,
      unfoldAndStow: true, // 展开收起
      ruleForm: {
        desc: '',
        aaa: ''
      },
      visible: true,
      rules: {
        aaa: [{ required: true, message: '请输入敏感词', trigger: 'blur' }]
      },
      // 分页配置
      pagination: {
        size: 15,
        sizeOpts: [15, 25, 50, 100],
        page: 1,
        total: 0
      },
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
    /**
     * 二级列表展开收起
     */
    handlerUnfoldAndStow () {
      this.unfoldAndStow = !this.unfoldAndStow
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
        console.log(extraHeight, 'extraHeight')
        // extraHeight += (this.enable ? 38 : 0) + 17 + 5
        this.$refs.fullScreen.$el.children[0].style.maxHeight =
          window.innerHeight - extraHeight - 38 + 'px'
      })
    }
  }
}
