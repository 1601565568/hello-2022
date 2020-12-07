import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
// import loading from './loading'
import NsGuideDialog from '@/components/NsGuideDialog'
import moment from 'moment'
import { API_ROOT } from '@/config/http.js'
import LocalStorage from 'store/dist/store.legacy.min.js'
import NsCategorySelect from '@/components/NsCategorySelect'
export default {
  mixins: [tableMixin],
  components: { NsGuideDialog, NsCategorySelect },
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
          }
          // {
          //   text: '最近三个月',
          //   onClick (picker) {
          //     const end = new Date()
          //     const start = new Date()
          //     start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          //     picker.$emit('pick', [start, end])
          //   }
          // }
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
        materialType: '', // 素材类型
        materialTitle: '', // 素材标题
        folderId: '', // 文件夹
        tagId: '', // 标签
        orderType: '1', // 排序方式 1下载 2发送 3 转发
        isDesc: '1' // 是否倒叙  2正序，1倒序
      },
      time: [],
      url: this.$api.guide.materialAnalysis.getList,
      materialGroudList: [{ subdivisionId: '', subdivisionName: '全部' }],
      materialGroudListParms: {
        length: 15,
        searchMap: { subdivisionName: '' },
        start: 0
      }, // 素材搜索
      getTreeUrl: this.$api.guide.getDirectoryTree
    }
  },
  watch: {
    'model.folderId' () {
      this.handleSearch()
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
      // this.getDirectoryTree()
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
    // getDirectoryTree () {
    //   this.$http
    //     .fetch(this.$api.guide.getDirectoryTree)
    //     .then(res => {
    //       if (res.success) {
    //         this.directoryTreelist = res.result
    //         const arr = [{ id: '', label: '全部' }]
    //         this.getDirectoryTreeList(arr, res.result)
    //         this.directoryTreeList = arr
    //       } else {
    //         this.$notify.error('获取文件夹列表失败')
    //       }
    //     })
    //     .catch(err => {
    //       this.$notify.error('获取文件夹列表失败' + err)
    //     })
    // },
    // getDirectoryTreeList (arr, treeList) {
    //   if (treeList.length === 0) {
    //     this.directoryTreeList = []
    //     return
    //   }
    //   treeList.forEach(item => {
    //     arr.push(this.formadirectoryTreeList(item))
    //     if (item.children) {
    //       this.getDirectoryTreeList(arr, item.children)
    //     }
    //   })
    // },
    // formadirectoryTreeList (item) {
    //   let items = JSON.parse(JSON.stringify(item))
    //   if (items.children) {
    //     delete items.children
    //   }
    //   return {
    //     ...items
    //   }
    // },
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
      if (this.model.guideId) {
        let guideId = this.model.guideId.join(',')
        this.$search({ searchMap: { ...this.model, guideId: guideId } })
      } else {
        this.$search({ searchMap: { ...this.model } })
      }
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
      this.handleSearch()
    },
    // table表格排序
    sortChange (data) {
      let order = data.order
      let prop = data.prop
      // 排序方式 1下载 2分享 3 发送
      this.model.isDesc =
      order === 'descending' ? '1' : order === 'ascending' ? '2' : '1'
      this.model.orderType =
        prop === 'sendCount' ? '3' : prop === 'shareCount' ? '2' : '1'
      this.$reload()
    },
    // 操作
    toggle (data) {
      LocalStorage.set('guideId', this.model.guideId)
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
