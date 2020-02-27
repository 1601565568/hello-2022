import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import { getErrorMsg } from '@/utils/toast'
export default {
  name: 'index',
  mixins: [tableMixin],
  data: function () {
    let that = this
    return {
      dialogVisible: false, // 选择好友弹窗是否展示
      // 树数据
      treeData: [{
        id: 1,
        label: '售后服务部',
        children: [{
          id: 123458,
          label: '服务部1',
          children: [{
            id: 856,
            label: '员工1'
          }, {
            id: 10,
            label: '员工2'
          }]
        }]
      }, {
        id: 2,
        label: '设计部',
        children: [{
          id: 886,
          label: '设计部1'
        }, {
          id: 6,
          label: '设计部2'
        }]
      }, {
        id: 3,
        label: '财务部',
        children: [{
          id: 7,
          label: '财务部1'
        }, {
          id: 8,
          label: '财务部2'
        }]
      }],
      chooseTreeData: [],
      // 树默认绑定数据
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 左边输入框绑定值
      input: '',
      personalQrcode: {
        id: null,
        guid: null,
        creatorId: null,
        nickname: null,
        creatorName: null,
        name: null,
        personnels: null,
        prersonelIds: '',
        num: null,
        image: '',
        createTime: '',
        showType: 1
      },
      title: null,
      parameter: {
        length: 10,
        searchMap: {
        },
        start: 0
      },
      modelObj: {},
      status: 0,
      rules: {
        'code': [{ required: true, message: '请输入配置项编码' }],
        'value': [{ required: true, message: '请输入配置项值' }],
        'type': [{ required: true, message: '请选择类型' }]
      }
    }
  },
  mounted: function () {
    const id = this.$route.params.id
    if (id > 0) {
      this.title = '编辑商品'
      this.$http.fetch(this.$api.guide.personalQrcode.findById, {
        id: id
      }).then(data => {
        this.personalQrcode.id = data.result.id
        this.personalQrcode.name = data.result.name
        this.personalQrcode.showType = data.result.showType
      }).catch((error) => {
        this.$notify.error(getErrorMsg('加载聚合二维码信息失败：', error))
      }).finally(() => {
        this.loading = false
      })
    } else {
      this.title = '新增商品'
    }
    if (typeof this.$init === 'function') {
      this.$init(this, this.$generateParams$)
    } else {
      this.$reload()
    }
  },
  methods: {
    // 删除右边的树子节点数据
    remove (node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },
    onSave () {
      let that = this
      that.$http.fetch(that.$api.guide.personalQrcode.save, that.personalQrcode).then(() => {
        that.$notify.success('保存成功')
      }).catch((resp) => {
        that.$notify.error(getErrorMsg('保存失败', resp))
      })
    },
    onConfirm () { // 选择员工弹唱确认
    },
    handleNodeCheck (data, node, vuecomponent) {
      console.log(data, node, vuecomponent)
    }
  }
}
