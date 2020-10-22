import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
// import loading from './loading'
import NsGuideDialog from '@/components/NsGuideDialog'
import moment from 'moment'
import { API_ROOT } from '@/config/http.js'
export default {
  mixins: [tableMixin],
  components: { NsGuideDialog },
  data () {
    return {
      // 快速搜索
      quickObj: {
        expanded: false,
        searchKey: 'name',
        collapseText: '展开搜索'
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        },
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
      materialTypeList: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '1',
          label: '图文素材'
        },
        {
          value: '2',
          label: '视频素材'
        },
        {
          value: '0',
          label: '文章素材'
        }
      ],
      findSubdivisionList: [],
      model: {
        startTime: '',
        endTime: '',
        guideId: '',
        materialType: null, // 素材类型
        materialTitle: '', // 素材标题
        folderId: null, // 文件夹
        tagId: null, // 标签
        orderType: 1, // 排序方式 1下载 2发送 3 转发
        isDesc: 0 // 是否倒叙  0正序，1倒序
      },
      time: [],
      url: this.$api.guide.materialAnalysis.getList,
      materialGroudList: [{ subdivisionId: '', subdivisionName: '全部' }],
      materialGroudListParms: {
        length: 15,
        searchMap: { subdivisionName: '' },
        start: 0
      }, // 素材搜索
      directoryTreeList: [] // 文件夹树列表
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const end = new Date()
      const start = new Date()
      this.model.startTime = moment(
        start.getTime() - 3600 * 1000 * 24 * 7
      ).format('YYYY-MM-DD HH:mm:ss')
      this.model.endTime = moment(end.getTime()).format('YYYY-MM-DD HH:mm:ss')
      this.time = [this.model.startTime, this.model.endTime]
      this.$reload()
      this.getfindSubdivisionList()
      this.getDirectoryTree()
    },
    // 标签列表
    getfindSubdivisionList () {
      this.$http
        .fetch(this.$api.guide.materialGroudList, this.materialGroudListParms)
        .then(res => {
          if (res.success) {
            this.materialGroudList = this.materialGroudList.concat(
              res.result.data
            )
            if (res.result.data.length > 14) {
              this.materialGroudListParms = {
                ...this.materialGroudListParms,
                start:
                  this.materialGroudListParms.start +
                  this.materialGroudListParms.length
              }
              this.getfindSubdivisionList()
            }
          } else {
            this.$notify.error('标签列表获取失败')
          }
        })
        .catch(err => {
          this.$notify.error('标签列表获取失败' + err)
        })
    },
    // 获取文件夹树
    getDirectoryTree () {
      this.$http
        .fetch(this.$api.guide.getDirectoryTree)
        .then(res => {
          if (res.success) {
            const arr = [{ id: '', label: '全部' }]
            this.getDirectoryTreeList(arr, res.result)
            this.directoryTreeList = arr
          } else {
            this.$notify.error('获取文件夹列表失败')
          }
        })
        .catch(err => {
          this.$notify.error('获取文件夹列表失败' + err)
        })
    },
    getDirectoryTreeList (arr, treeList) {
      if (treeList.length === 0) {
        this.directoryTreeList = []
        return
      }
      treeList.forEach(item => {
        arr.push(this.formadirectoryTreeList(item))
        if (item.children) {
          this.getDirectoryTreeList(arr, item.children)
        }
      })
    },
    formadirectoryTreeList (item) {
      let items = JSON.parse(JSON.stringify(item))
      if (items.children) {
        delete items.children
      }
      return {
        ...items
      }
    },
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
      this.$search({ searchMap: { ...this.model } })
      // console.log('searchform', this.model)
    },
    formatTime () {
      this.model = {
        ...this.model,
        startTime: this.time[0],
        endTime: this.time[1]
      }
      this.handleSearch()
    },
    NsGuideDialog () {
      this.model.guideId = this.model.guideId.join(',')
      this.handleSearch()
    },
    // table表格排序
    sortChange (data) {
      let order = data.order
      let prop = data.prop
      this.model.isDesc =
        order === 'descending' ? '0' : order === 'ascending' ? '1' : '0'
      // 排序方式 1下载 2发送 3 转发
      this.model.orderType =
        prop === 'sendCount' ? '2' : prop === 'shareCount' ? '3' : '1'
      this.handleSearch()
    },
    // 操作
    toggle (data) {
      this.$router.push({
        path: `/Guide/Material/MaterialAnalysis/details/${data.targetId}`
      })
    },
    exportData () {
      var url = API_ROOT + '/materialAnalysis/listExcel'
      var form = document.createElement('form')
      form.appendChild(
        this.generateHideElement('startTime', this.model.startTime)
      )
      form.appendChild(this.generateHideElement('endTime', this.model.endTime))
      form.appendChild(this.generateHideElement('guideId', this.model.guideId))
      form.appendChild(
        this.generateHideElement('materialType', this.model.materialType)
      )
      form.appendChild(
        this.generateHideElement('materialTitle', this.model.materialTitle)
      )
      form.appendChild(
        this.generateHideElement('folderId', this.model.folderId)
      )
      form.appendChild(this.generateHideElement('tagId', this.model.tagId))
      form.appendChild(
        this.generateHideElement('orderType', this.model.orderType)
      )
      form.appendChild(this.generateHideElement('isDesc', this.model.isDesc))
      form.setAttribute('action', url)
      form.setAttribute('method', 'get')
      document.body.appendChild(form)
      form.submit()
    },
    generateHideElement (name, value) {
      var tempInput = document.createElement('input')
      tempInput.type = 'hidden'
      tempInput.name = name
      tempInput.value = value
      return tempInput
    }
  }
}
