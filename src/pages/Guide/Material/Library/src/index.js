import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import ElBreadcrumb from '@nascent/nui/lib/breadcrumb'
import ElBreadcrumbItem from '@nascent/nui/lib/breadcrumb-item'
import ShopSelectLoad from '@/components/ShopSelectLoad'
import TableItem from '../components/TableItem'
import NewFolder from '../components/NewFolder'
import FolderTree from '../components/FolderTree'
import scrollTable from '@/mixins/scrollTable'
import { getErrorMsg } from '@/utils/toast'

export default {
  components: { ShopSelectLoad, ElBreadcrumb, ElBreadcrumbItem, TableItem, NewFolder, FolderTree },
  mixins: [tableMixin, scrollTable],
  data: function () {
    return {
      // 表格顶部
      operateButtons: [
        {
          'name': '新建素材',
          'type': 'primary',
          'visible': true,
          'func': () => {
            // console.log(this.selectRows)
          }
        },
        {
          'name': '新建文件夹',
          'func': () => {
            this.$refs.newFolder.show()
          },
          'visible': true
        },
        {
          'name': '标签管理',
          'func': () => {},
          'visible': true
        },
        {
          'name': '打标签',
          'func': () => {},
          'icon': 'dabiaoqian',
          'visible': false
        },
        {
          'name': '移动到',
          'func': () => {
            this.$refs.folderTree.show()
          },
          'icon': 'yidongdao',
          'visible': false
        },
        {
          'name': '删除',
          'func': () => {
            this.batchRemove()
          },
          'icon': 'shanchu',
          'visible': false
        }
      ],
      // 搜索数据
      model: {
        title: '',
        content: '',
        sourceId: null,
        subdivisionId: null,
        type: '',
        codeType: '',
        time: []
      },
      // table列表配置
      _table: {
        data: [
          {
            type: 0,
            content: '10个目录，5个文件',
            create_time: '2019-11-05 16:31:34',
            id: 737,
            imageList: ['https://shopguide.oss-cn-hangzhou.aliyuncs.com/test/201911/10000146/9317b820-9780-4d17-8761-f9fe2bf81e82.jpg'],
            source_name: '研发二部4',
            subdivision_id: 36,
            title: '图文素材目录'
          },
          {
            type: 1,
            content: '秋天',
            create_time: '2019-11-05 16:31:34',
            id: 737,
            imageList: ['https://shopguide.oss-cn-hangzhou.aliyuncs.com/test/201911/10000146/9317b820-9780-4d17-8761-f9fe2bf81e82.jpg'],
            m_type: 0,
            source_name: '研发二部4',
            subdivision_id: 36,
            title: '一年一度的风筝节',
            cardTitle: '这是推广文章标题'
          },
          {
            type: 1,
            content: '视频内容视频内容视频内容视频内容视频内容视频内容视频内容视频内容视频内容视频内容视频内容视频内容视频内容',
            create_time: '2020-07-21 18:25:06',
            id: 896,
            imageList: [
              'https://shopguide.oss-cn-hangzhou.aliyuncs.com/test/202007/10000146/bc7da31c-f9b1-46d8-b3ae-afcacc558a70.png',
              'https://shopguide.oss-cn-hangzhou.aliyuncs.com/test/202007/10000146/3dfe7609-a54b-4b0d-954e-dfb1a38f9f99.jpg'
            ],
            m_type: 1,
            source_name: '研发二部4',
            subdivision_id: 22,
            hasqrcode: 1,
            title: '图文素材标题'
          },
          {
            type: 1,
            content: '视频内容视频内容视频内容视频内容视频内容视频内容视频内容视频内容视频内容视频内容视频内容视频内容视频内容',
            create_time: '2020-07-21 18:25:06',
            id: 826,
            imageList: [
              'https://shopguide.oss-cn-hangzhou.aliyuncs.com/test/202007/10000146/bc7da31c-f9b1-46d8-b3ae-afcacc558a70.png',
              'https://shopguide.oss-cn-hangzhou.aliyuncs.com/test/202007/10000146/3dfe7609-a54b-4b0d-954e-dfb1a38f9f99.jpg',
              'https://shopguide.oss-cn-hangzhou.aliyuncs.com/test/202007/10000146/3dfe7609-a54b-4b0d-954e-dfb1a38f9f99.jpg',
              'https://shopguide.oss-cn-hangzhou.aliyuncs.com/test/202007/10000146/3dfe7609-a54b-4b0d-954e-dfb1a38f9f99.jpg'
            ],
            m_type: 1,
            source_name: '研发二部4',
            subdivision_id: 22,
            hasqrcode: 1,
            title: '图文素材标题'
          },
          {
            type: 1,
            content: '视频内容',
            create_time: '2020-07-21 18:25:06',
            id: 897,
            videoUrl: 'https://www.w3school.com.cn/i/movie.ogg',
            m_type: 2,
            source_name: '研发二部4',
            subdivision_id: 22,
            title: '视频素材标题'
          }
        ],
        operate_buttons: [
          {
            'name': '移动到',
            'func': (scope) => {}
          },
          {
            'name': '编辑',
            'func': (scope) => {
              const { type, title, id } = scope.row
              if (type === 0) {
                this.$refs.newFolder.show({ type: 'edit', model: { folderName: title, folderId: id } })
              }
            }
          },
          {
            'name': '删除',
            'func': (scope) => {
              this.removeItem(scope.row)
            }
          }
        ]
      },
      // 瀑布流配置
      _waterfall: {},
      // 分页配置
      _pagination: {
        enable: true,
        size: 15,
        sizeOpts: [15, 25, 50, 100],
        page: 1,
        total: 0
      },
      listMode: 'waterfall', // list
      insertList: [],
      labelList: [],
      typeList: [{ name: '全部', id: '' }, { name: '图文素材', id: 1 }, { name: '视频素材', id: 2 }, { name: '文章素材', id: 0 }],
      codeTypeList: [{ name: '全部', id: '' }, { name: '带码', id: 1 }, { name: '不带码', id: 2 }],
      breadcrumb: [{ name: '素材库', id: -1 }, { name: '其他', id: 0 }]
    }
  },
  computed: {
    operate_buttons () {
      let isSelected = this.selectRows.length
      return this.operateButtons.filter(o => {
        return o.visible || isSelected
      })
    }
  },
  methods: {
    searchAction () {
      // console.log('========开始搜索')
    },
    removeItem (row) {
      const { type } = row
      this.$confirm(`此操作将永久删除该${type === 0 ? '文件夹' : '条数据'}，是否继续？`, '删除确认', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确定'
      }).then(() => {
        // console.log('=====removeItem：', row)
      }).catch(() => {})
    },
    batchRemove () {
      let numArr = [{ num: 0, suffix: '条素材' }, { num: 0, suffix: '个文件夹' }]
      this.selectRows.forEach(o => {
        o.type === 0 ? numArr[1].num++ : numArr[0].num++
      })
      let strArr = numArr.map(o => o.num ? `${o.num}${o.suffix}` : '').filter(s => !!s)
      this.$confirm(`已选择${strArr.join('、')}，确认要删除吗？`, '删除确认', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确定'
      }).then(() => {
        // console.log('=====removeItem：', selectRows)
      }).catch(() => {})
    },
    async getLabelList () {
      await this.$http
        .fetch(this.$api.guide.materialGroudListAll, {})
        .then(resp => {
          this.labelList = resp.result
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
    }
  },
  created () {
    // 获取标签列表
    this.getLabelList()
  }
}
