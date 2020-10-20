import scrollHeight from '@nascent/ecrp-ecrm/src/mixins/scrollHeight'
import ElBreadcrumb from '@nascent/nui/lib/breadcrumb'
import ElBreadcrumbItem from '@nascent/nui/lib/breadcrumb-item'
import ElCollapse from '@nascent/nui/lib/collapse'
import ElCollapseItem from '@nascent/nui/lib/collapse-item'
import selectMaterialListModal from '../selectMaterialListModal'
import shopSelect from '../../components/selectShops'
import { getErrorMsg } from '@/utils/toast'
import moment from 'moment'
export default {
  props: {
    callBack: Function
  },
  mixins: [scrollHeight],
  components: {
    ElBreadcrumb,
    ElBreadcrumbItem,
    ElCollapse,
    ElCollapseItem,
    selectMaterialListModal,
    shopSelect
  },
  data () {
    var validateMaterial = (rule, value, callback) => {
      if (this.$refs.form.model.type === 2) {
        if (!this.$refs.form.model.materialId) {
          callback(new Error('请选择素材'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      pickerOptions0: {
        // disabledDate (time) {
        //   return time.getTime()
        // }
      },
      pickerOptions2: {
        onPick: function (e) {}
      },
      // 页面滚动条内容高度配置
      scrollBarDeploy: {
        ref: 'fullScreen', // 页面滚动条ref的名称
        excludeHeight: 104
      },
      titleText: '新建任务',
      loading: false, // 防重复提交
      activeNames: ['1', '2'],
      hasShopArr: [], // 已选择门店
      model: {
        name: '',
        type: 0,
        activityTime: [],
        remark: '',
        shopRangeType: 0,
        runType: 0,
        viewId: '',
        viewName: '',
        subgroupId: '',
        subgroupName: '',
        materialTitle: '', // 素材库标题
        materialType: '', // 素材类型 1图片 2视频 0 文章
        materialMsg: {} // 素材库内容
      },
      rules: {
        name: [
          { required: true, message: '请输入任务名称', trigger: 'blur' },
          { min: 4, max: 25, message: '长度在4-25以内', trigger: 'blur' }
        ],
        activityTime: [
          { required: true, message: '请选择执行时间', trigger: 'blur' }
        ],
        type: [{ required: true, message: '请选择类型' }],
        shopRangeType: [{ required: true, message: '请选择门店' }],
        remark: [{ required: true, message: '请输入简述' }],
        runType: [{ required: true, message: '请选择执行次数' }],
        materialTitle: [{ validator: validateMaterial, trigger: 'blur' }]
      },
      options: [], // 视角集合
      subgroups: [], // 视角下分组集合
      selectMaterial: {}, // 当前选择的素材对象
      canNotEdit: false // 编辑进来禁止
    }
  },
  methods: {
    timeFun (val) {},
    selectShopBack (val) {
      this.hasShopArr = val
    },
    // 页面取消跳转列表
    handleClose () {
      this.hasShopArr = []
      this.$router.push('/Guide/Task/List')
    },
    // 选择视角
    chooseView (obj) {
      var param = {}
      param.viewId = obj
      this.subgroups = []
      this.model.subgroupId = null
      this.$http
        .fetch(this.$api.guide.querySubgroup, param)
        .then(resp => {
          if (resp.success) {
            for (var i = 0; i < resp.result.length; i++) {
              var subgroupmsg = resp.result[i]
              var subgroupJson = {}
              subgroupJson.id = subgroupmsg.id
              subgroupJson.name = subgroupmsg.subdivisionName
              this.subgroups.push(subgroupJson)
            }
          }
        })
        .catch(resp => {
          this.$notify.error('查询视角分组信息失败', resp)
        })
    },
    // 选择分组
    chooseSubgroup (subgroupId) {
      this.model = Object.assign({}, this.model, { subgroupId })
    },
    // 选择素材
    selectMaterialShowFun () {
      this.$nextTick(() => {
        this.$refs.selectDialogDom.showToggle(this.selectMaterial)
      })
    },
    // 选择素材回调
    selectMaterialBack (obj) {
      this.selectMaterial = obj
    },
    // 提交保存
    saveFun () {
      var that = this
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log(that.model)
          that.model.startTime = that.model.activityTime[0]
          that.model.endTime = that.model.activityTime[1]
          //   if (that.model.activityTime.length === 2) {
          //     that.model.startTime = moment(that.model.activityTime[0]).format(
          //       'YYYY-MM-DD HH:mm:ss'
          //     )
          //     that.model.endTime = moment(that.model.activityTime[1]).format(
          //       'YYYY-MM-DD HH:mm:ss'
          //     )
          //   }
          // 指定门店
          if (that.model.shopRangeType === 1) {
            if (that.hasShopArr.length === 0) {
              that.$notify.error('请至少选择一家门店')
              return
            }
            that.model.targetIds = that.hasShopArr.join(',')
          } else {
            that.model.targetIds = 0
          }
          that.doSave()
        }
      })
    },
    async doSave () {
      this.loading = true
      await this.$http
        .fetch(this.$api.guide.taskEdit, this.model)
        .then(resp => {
          // 置空已经选择的素材
          this.selectMaterial = {}
          this.handleClose()
          this.$notify.success(resp.msg)
          // 回调刷新列表
          this.$props.callBack()
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
      this.loading = false
    },
    showToggle (obj) {
      this.model = {
        name: '',
        type: 0,
        remark: '',
        shopRangeType: 0,
        runType: 0,
        shopIds: [],
        activityTime: []
      }
      this.selectMaterial = {}
      this.dialogVisible = true
    },
    // 编辑
    EditFun (id) {
      this.canNotEdit = true
      this.$http
        .fetch(this.$api.guide.queryTask, {
          taskId: parseInt(id)
        })
        .then(resp => {
          debugger
          if (resp.success) {
            var obj = resp.result
            this.titleText = '编辑任务'
            this.model.id = obj.id
            this.model.type = obj.type
            this.model.runType = obj.runType
            this.model.remark = obj.remark
            this.model.name = obj.name
            this.model.activityTime.push(new Date(obj.startTime))
            this.model.activityTime.push(new Date(obj.endTime))
            this.model.viewId = obj.viewId
            this.model.subgroupId = obj.subgroupId
            this.chooseView(obj.viewId)
            this.chooseSubgroup(obj.subgroupId)
            // 指定门店
            if (obj.targetIds === '0') {
              this.model.shopRangeType = 0
            } else {
              this.model.shopRangeType = 1
              this.hasShopArr = obj.targetIds.split(',')
            }
            // 素材任务时
            if (obj.materialId) {
              this.selectMaterial.id = obj.materialId
              this.selectMaterial.materialTitle = obj.materialTitle
              this.model.materialId = obj.materialId
              this.model.materialTitle = obj.materialTitle
            }
          }
        })
        .catch(resp => {
          console.log('resp:', resp)
          this.$notify.error(getErrorMsg('获取任务详情失败', resp))
          this.$router.push('/Guide/Task/List')
        })
    },
    init () {
      const id = this.$route.params.id
      this.$http
        .fetch(this.$api.guide.queryView)
        .then(resp => {
          if (resp.success) {
            let arr = []
            resp.result.map(item => {
              var viewJson = {}
              viewJson.value = item.viewId
              viewJson.label = item.viewName
              arr.push(viewJson)
              return arr
            })
            this.options = arr
          }
        })
        .catch(resp => {
          this.$notify.error('查询视角失败', resp)
        })
      if (+id > 0) {
        this.EditFun(id)
      }
    }
  },
  watch: {
    selectMaterial: {
      handler (newVal) {
        this.model.materialId = newVal.id
        this.model.materialTitle = newVal.name
        this.model.materialType = newVal.mType
        console.log(newVal.imageList)
        this.model.materialMsg.imageList = newVal.imageList
        if (newVal.mType === 0) {
          this.model.materialMsg.name = newVal.title
        }
        this.model.materialMsg = JSON.stringify(this.model.materialMsg)
      },
      deep: true
    }
  },
  mounted: function () {
    this.init()
  },
  created: function () {}
}
