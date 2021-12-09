import scrollHeight from '@nascent/ecrp-ecrm/src/mixins/scrollHeight'
import ElBreadcrumb from '@nascent/nui/lib/breadcrumb'
import ElBreadcrumbItem from '@nascent/nui/lib/breadcrumb-item'
import ElCollapse from '@nascent/nui/lib/collapse'
import ElCollapseItem from '@nascent/nui/lib/collapse-item'
import selectMaterialListModal from '../selectMaterialListModal'
import shopSelect from '../../components/selectShops'
import { getErrorMsg } from '@/utils/toast'
import lookCardList from '../lookCardList'
import AddMaterial from '../addMaterial'
import Preview from '@/components/NsPreview'
import materialDialog from '../materialDialog'
import imgUrl from '../img/loading.gif'
import ElImage from '@nascent/nui/lib/image'
export default {
  props: {
    callBack: Function
  },
  mixins: [scrollHeight],
  components: {
    Preview,
    materialDialog,
    AddMaterial,
    ElBreadcrumb,
    ElBreadcrumbItem,
    ElCollapse,
    ElCollapseItem,
    selectMaterialListModal,
    shopSelect,
    lookCardList,
    ElImage
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
    const validateDate = (rule, value, callback) => {
      if (value && value.length && value[1]) {
        if (new Date(value[1]).getTime() < new Date().getTime()) {
          callback(new Error('结束时间必须大于当前时间'))
        } else {
          callback()
        }
      } else {
        callback(new Error('请选择执行时间'))
      }
    }
    return {
      dialogFlag: false,
      listMap: {},
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
      dialogVisible: false,
      saveTipsFlag: false,
      imgUrl,
      model: {
        name: '',
        type: 0,
        activityTime: [],
        remark: '',
        shopRangeType: 0,
        runType: 0,
        areaId: '', // 区域id
        areaName: '',
        viewId: '', // 视角id
        cost: '', // 获取客户名单花费时间
        isClickBudget: false,
        subgroupId: '',
        subgroupName: null,
        materialTitle: '', // 素材库标题
        materialType: '', // 素材类型 1图片 2视频 0 文章
        materialMsg: null, // 素材库内容
        taskSendTime: '' // 提醒时间
      },
      rules: {
        name: [
          { required: true, message: '请输入任务名称', trigger: 'blur' },
          { min: 4, max: 25, message: '长度在4-25以内', trigger: 'blur' }
        ],
        activityTime: [
          { required: true, message: '请选择执行时间', trigger: 'blur' },
          { validator: validateDate, trigger: ['blur', 'change'] }
        ],
        type: [{ required: true, message: '请选择类型' }],
        shopRangeType: [{ required: true, message: '请选择门店' }],
        remark: [{ required: true, message: '请输入简述' }],
        runType: [{ required: true, message: '请选择执行次数' }],
        materialTitle: [{ validator: validateMaterial, trigger: 'blur' }],
        taskSendTime: [{ required: true, message: '请选择提醒时间' }]
      },
      areaOptions: [], // 区域集合
      viewOptions: [], // 视角集合
      subgroups: [], // 视角下分组集合
      selectMaterial: {}, // 当前选择的素材对象
      canNotEdit: false, // 编辑进来禁止
      allNotEdit: false, // 全部禁止
      tableData: [{
        date: '2020-09-01 00:00:00',
        name: '姓名',
        phone: '15300001234',
        store: '门店名称',
        guide: '吴隽寒',
        level: '等级',
        address: '地区'
      }],
      disabled: false
    }
  },
  computed: {
    // viewRange: res.data.result.viewRange || 2, // 1-不同品牌不同视角，2-不同区域不同视角
    /**
     * 视角范围 1-不同品牌不同视角，2-不同区域不同视角
     */
    viewRange () {
      return this.$store.state.user.remumber.remumber_login_info.productConfig.viewRange
    }
  },
  methods: {
    subNumber (type, data) {
      if (type === 0) {
        return data && data.some(item => item.type === 0 || item.type === 1)
      } else {
        return data && data.some(item => item.type === type)
      }
    },
    timeFun (val) {},
    selectShopBack (val) {
      this.hasShopArr = val
    },
    // 页面取消跳转列表
    handleClose () {
      this.hasShopArr = []
      this.$router.push('/Guide/Task/List')
    },
    // 选择区域
    chooseArea (areaId) {
      this.model.areaId = areaId
      this.model.viewId = ''
      this.viewOptions = []
      this.backinitial()
      // 根据选择区域查询视角列表
      this.$http.fetch(this.$api.core.common.findViewListByAreaId, { areaId })
        .then(res => {
          if (res.success) {
            this.viewOptions = res.result
          } else {
            this.$notify.error(res.msg)
          }
        }).catch(res => {
          this.$notify.error('视角列表查询失败')
        })
    },
    dialogClick (row) {
      this.dialogFlag = true
      this.listMap = row
    },
    togglePreview (current, list, type) {
      this.$refs.preview.toggleShow(current, list, type)
    },
    // 选择视角
    chooseView (viewId) {
      this.model.viewId = viewId
      this.subgroups = []
      this.model.subgroupId = null
      this.model.subgroupName = null
      this.backinitial()
      this.$http
        .fetch(this.$api.guide.querySubgroup, { viewId })
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
    // 提示
    openTips (flag) {
      if (!flag) { this.dialogVisible = true }
    },
    // 关闭提示
    closeTips () {
      this.dialogVisible = false
    },
    // 立即预算
    goBudget (id) {
      this.closeTips()
      this.showSubgroupMsg(id)
    },
    // 回到初始状态
    backinitial () {
      this.model.isClickBudget = false
      this.model.cost = ''
    },
    // 获取预算时长
    showSubgroupMsg (id) {
      this.model.isClickBudget = true
      this.$http
        .fetch(this.$api.guide.queryExpectTime, { subdivisionId: id })
        .then(resp => {
          if (resp.success) {
            const needTime = +resp.result.cost
            // console.log(needTime, 'needTime')
            if (needTime >= 60 && needTime < 3600) {
              this.model.cost = `${Math.ceil(needTime / 60)}分钟`
            } else if (needTime > 3600) {
              this.model.cost = `${(needTime / 3600).toFixed(1)}小时`
            } else if (needTime >= 0 && needTime < 60) {
              this.model.cost = `${needTime}秒`
            } else if (needTime < 0) {
              this.$notify.error('获取失败', resp)
            }
          }
        })
        .catch(resp => {
          this.$notify.error('获取预算时间失败', resp)
        })
      // this.dialogVisible = true
    },
    // 选择分组
    chooseSubgroup (subgroupId) {
      this.backinitial()
      for (let index = 0; index < this.subgroups.length; index++) {
        var obj = this.subgroups[index]
        if (obj.id === subgroupId) {
          this.model.subgroupName = obj.name
        }
      }
      this.model = Object.assign({}, this.model, { subgroupId })
    },
    // 选择素材
    selectMaterialShowFun () {
      if (this.canNotEdit) return
      const times = this.model.activityTime
      let taskStart = ''
      let taskEnd = ''
      if (times.length >= 2) {
        taskStart = this.model.activityTime[0]
        taskEnd = this.model.activityTime[1]
        this.$nextTick(() => {
          this.$refs.selectDialogDom.showToggle(this.selectMaterial, taskStart, taskEnd)
        })
      } else {
        this.$notify.error('请先输入任务开始时间、结束时间')
      }
    },
    // 删除素材
    deleteMaterialShowFun () {
      if (this.canNotEdit) return
      this.disabled = false
      this.selectMaterial = {}
      this.$nextTick(() => {
        this.$refs.selectDialogDom.cancleToggle()
      })
    },
    // 选择素材回调
    selectMaterialBack (obj) {
      this.disabled = true
      this.selectMaterial = obj
    },
    // 提交保存
    saveFun (id) {
      var that = this
      that.model.startTime = that.model.activityTime[0]
      that.model.endTime = that.model.activityTime[1]
      // 指定门店
      if (that.model.shopRangeType === 1) {
        that.model.targetIds = that.hasShopArr.join(',')
      } else {
        that.model.targetIds = 0
      }

      this.$refs.form.validate(valid => {
        if (valid) {
          that.model.startTime = that.model.activityTime[0]
          that.model.endTime = that.model.activityTime[1]
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
          if (that.model.type === 2 && !that.model.materialTitle) {
            that.$notify.error('请选择素材')
            return
          }

          if (this.model.areaId && !this.model.viewId) {
            this.$notify.error('请选择视角')
            return
          }

          if (this.model.areaId && this.model.viewId && !this.model.subgroupId) {
            this.$notify.error('请选择会员分组')
            return
          }
          if (that.model.areaId) {
            that.saveTipsFlag = true
          } else {
            that.doSave()
          }

          // that.showSubgroupMsg(id)
        }
      })
    },
    closeSaveTips (flag) {
      var that = this
      that.saveTipsFlag = false
      that.model.startTime = that.model.activityTime[0]
      that.model.endTime = that.model.activityTime[1]
      if (flag) { that.doSave() }
    },
    async doSave () {
      var params = {}
      if (this.model.materialMsg) {
        params = { ...this.model, materialMsg: JSON.stringify(this.model.materialMsg) }
      } else {
        params = { ...this.model }
      }
      this.loading = true
      await this.$http
        .fetch(this.$api.guide.taskEdit, params)
        .then(resp => {
          // 置空已经选择的素材
          this.selectMaterial = {}
          this.$notify.success(resp.msg)
          this.handleClose()
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('保存任务失败', resp))
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
      this.$http
        .fetch(this.$api.guide.queryTask, {
          taskId: parseInt(id)
        })
        .then(resp => {
          if (resp.success) {
            var obj = resp.result
            this.titleText = '编辑任务'
            this.model.id = obj.id
            this.model.type = obj.type
            this.model.runType = obj.runType
            this.model.remark = obj.remark
            this.model.name = obj.name
            this.model.activityTime.push(obj.startTime)
            this.model.activityTime.push(obj.endTime)
            this.model.areaId = obj.areaId
            this.model.viewId = obj.viewId
            this.model.subgroupId = obj.subgroupId
            this.model.taskSendTime = obj.taskSendTime
            if (obj.areaId) {
              this.chooseArea(obj.areaId)
            }
            if (obj.viewId) {
              this.chooseView(obj.viewId)
            }
            if (obj.subgroupId) {
              this.chooseSubgroup(obj.subgroupId)
            }
            // 指定门店
            if (obj.targetIds === '0') {
              this.model.shopRangeType = 0
            } else {
              this.model.shopRangeType = 1
              this.hasShopArr = obj.targetIds.split(',')
            }
            // 素材任务时
            if (obj.materialId) {
              this.model.materialTitle = obj.materialTitle
              this.model.materialId = obj.materialId
              this.model.materialType = obj.materialType
              this.model.materialMsg = obj.materialMsg ? JSON.parse(obj.materialMsg) : null
              this.disabled = true
            }
            if (obj.state === 1) {
              this.canNotEdit = true
            }
            if (obj.state === 3 || obj.state === 6) {
              this.canNotEdit = true
              this.allNotEdit = true
            }
          }
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('获取任务详情失败', resp))
          this.$router.push('/Guide/Task/List')
        })
    },
    init () {
      // 区域模式下，初始化区域选择数据
      if (this.viewRange === 2) {
        this.areaOptions = this.$store.state.user.areas
      }

      // 品牌模式下，固定视角信息
      if (this.viewRange === 1) {
        this.viewOptions = this.$store.state.user.views
      }

      const id = this.$route.params.id
      if (+id > 0) {
        this.EditFun(id)
      }
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
    }
  },
  watch: {
    selectMaterial: {
      handler (newVal) {
        let materialMsg = {}
        this.model.materialId = newVal.id
        this.model.materialTitle = newVal.name
        this.model.materialType = newVal.mType
        materialMsg.imageList = newVal.mediaList
        if (newVal.mType === 0) {
          materialMsg.name = newVal.title
        }
        this.model.materialMsg = materialMsg
      },
      deep: true
    }
  },
  mounted: function () {
    this.init()
  },
  beforeUpdate () {
    if (this.titleText !== '新建任务') { this.showSubgroupMsg(this.model.subgroupId) }
  },
  created: function () {
  }
}
