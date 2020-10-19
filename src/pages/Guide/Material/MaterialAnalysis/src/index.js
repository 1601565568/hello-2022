import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
export default {
  mixins: [tableMixin],
  data () {
    return {
      // 快速搜索
      quickObj: {
        expanded: false,
        searchKey: 'name',
        collapseText: '展开搜索'
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      searchform: {
        startTime: '',
        endTime: '',
        guideId: null,
        materialType: null, // 素材类型
        materialTitle: '', // 素材标题
        folderId: null, // 文件夹
        tagId: null, // 标签
        orderType: 1, // 排序方式 1下载 2发送 3 转发
        isDesc: 0 // 是否倒叙  0正序，1倒序
      },
      time: ''
    }
  },
  methods: {
    /**
     * 搜索模式切换
     */
    handleSearchType () {
      const { expanded } = this.quickObj
      this.quickObj = {
        ...this.quickObj,
        expanded: !expanded,
        collapseText: expanded ? '展开搜索' : '收起搜索'
      }
    },
    handleSearch () {
      console.log('searchform', this.searchform)
    },
    formatTime () {
      this.searchform = {
        ...this.searchform,
        startTime: this.time[0],
        endTime: this.time[1]
      }
      this.handleSearch()
    },
    // table表格排序
    sortChange (data) {
      let order = data.order
      this.searchform.isDesc = order === 'ascending' ? 0 : 1
      this.handleSearch()
    }

  }
}
