import formMixin from 'mixins/form'
import moment from 'moment'

export default {
  mixins: [formMixin],
  data: function () {
    let model = {
      id: -1,
      name: '',
      activityTime: null,
      /* 执行次数 */
      runType: 0,
      /* 任务类型 */
      type: 0,
      shopRangeType: 0,
      shopIds: [],
      remark: '',
      brandId: null,
      materialId: null,
      taskCode: null
    }
    let that = this
    let rules = {
      /**
       * 任务名称
       */
      name: [{
        required: true,
        validator: (rule, value, callback) => {
          if (!value || value.trim() === '') {
            callback(new Error('请输入任务名称'))
          } else {
            callback()
          }
        },
        trigger: 'blur,change'
      }, {
        min: 0,
        max: 20,
        message: '已超过可输入长度',
        trigger: 'blur,change'
      }],
      /**
       * 任务编号
       */
      taskCode: [{
        min: 0,
        max: 20,
        message: '已超过可输入长度',
        trigger: 'blur,change'
      }],
      /**
       * 任务时间
       */
      activityTime: [{
        required: true,
        validator: (rule, value, callback) => {
          if (!(!value || !(value[0] || value[1]))) {
            callback()
          } else {
            callback(new Error('请输入任务时间'))
          }
        },
        trigger: 'blur,change'
      }],
      materialId: [{
        validator: (rule, val, call) => {
          if (that.model.type === 2) {
            if (!val) {
              call(new Error('请选择素材'))
            }
          }
          call()
        },
        trigger: 'blur,change'
      }],
      shopIds: [{
        validator: (rule, val, call) => {
          if (that.model.shopRangeType === 1) {
            if (!val || val.length <= 0) {
              call(new Error('请指定门店'))
            }
          }
          call()
        },
        trigger: 'blur,change'
      }]
    }
    return {
      title: '',
      serviceTime: null,
      dialogVisible: false,
      forbidden: false,
      disableSelect: false,
      shopList: [],
      loading: false,
      rules: rules,
      model: model,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  methods: {
    /**
     * 门店查询
     */
    findShopList: function () {
      const that = this
      that.$http.fetch(that.$api.core.sysShop.getBrandList, {isOnline: 0}).then((resp) => {
        if (resp.success === true) {
          that.shopList = resp.result
        }
      }).catch(() => {
        that.$notify.error('门店查询失败')
      })
    },
    /**
     * 停止任务
     */
    stopTask: function (row) {
      const that = this
      this.$confirm('分配给导购的任务将不再被执行,且无法再次开启此任务' +
        '是否确认对[' + row.name + ']进行终止？', '终止任务提示', {
          confirmButtonText: '确定',
          type: 'warning',
          cancelButtonText: '取消'
        }).then(() => {
          that.$http.fetch(that.$api.guide.task.updateTaskState, {taskId: row.id, state: 2}).then((resp) => {
            if (resp.success === true) {
              that.$notify.success('任务终止成功')
              that.$refs.table.$reload()
            }
          }).catch(() => { that.$notify.error('任务终止失败') })
        }).catch(() => {})
    },
    /**
     * 编辑任务
     * @param row
     */
    edit (row) {
      let that = this
      that.title = '编辑任务'
      that.forbidden = false
      that.disableSelect = false
      if (row) {
        that.model.id = row.id
        that.model.name = row.name
        that.model.taskCode = row.taskCode
        that.model.type = row.type
        that.model.state = row.state
        that.model.remark = row.remark
        that.model.runType = row.runType
        if (row.targetIds && row.targetIds === '0') {
          that.model.shopRangeType = 0
        } else {
          that.model.shopRangeType = 1
          that.model.shopIds = row.targetIds ? row.targetIds.split(',').map(Number) : []
        }
        that.model.materialId = row.materialId ? row.materialId : null
        that.model.brandId = row.brandId
        let activityTime = []
        activityTime.push(row.startTime)
        activityTime.push(row.endTime)
        that.model.activityTime = activityTime
      }
      that.findShopList()
      that.dialogVisible = true
      // 已终止、已过期、已经开始执行的任务不允许编辑
      if (row.state === 2 || row.state === 4 ||
        (row.state === 1 && that.getServiceTime() >= moment(row.startTime))) {
        that.forbidden = true
      }
    },
    /**
     * 打开弹框
     */
    addTask: function () {
      const that = this
      that.resetForm()
      that.title = '新增任务'
      that.dialogVisible = true
      that.forbidden = false
      that.disableSelect = false
      that.findShopList()
    },
    /**
     * 关闭弹框
     */
    closeDialog: function () {
      const that = this
      that.dialogVisible = false
    },
    /**
     * 保存任务
     */
    saveTask: function () {
      let that = this
      that.$refs.form.validate((valid) => {
        if (valid) {
          // 封装数据
          let formValue = that.model
          let time = that.model.activityTime
          let startTime = ''
          if (time[0]) {
            let currentDate = that.getServiceTime()
            // 若任务开始执行时间为今天，则以当前时间为准；若大于今天则从00:00:00开始算
            startTime = currentDate >= moment(time[0])
              ? currentDate.format('YYYY-MM-DD HH:mm:ss')
              : moment(time[0]).format('YYYY-MM-DD 00:00:00')
          }
          let endTime = time[1] !== null ? moment(time[1]).format('YYYY-MM-DD 23:59:59') : ''
          formValue.startTime = startTime
          formValue.endTime = endTime
          if (formValue.shopRangeType === 0) {
            formValue.targetIds = 0
          } else {
            formValue.targetIds = formValue.shopIds ? formValue.shopIds.join(',') : null
          }
          formValue.materialId = formValue.materialId ? formValue.materialId : null
          that.$http.fetch(that.$api.guide.task.saveOrUpdateTask, formValue).then((resp) => {
            that.$notify.success(resp.msg)
            that.$refs.form.resetFields()
            that.$refs.table.$reload()
            that.dialogVisible = false
          }).catch((resp) => {
            that.$notify.error('保存失败')
          })
        } else {
          return false
        }
      })
    },
    // 重置表单数据
    resetForm: function () {
      let obj = {
        id: -1,
        name: '',
        activityTime: null,
        runType: 0,
        type: 0,
        shopRangeType: 0,
        shopIds: [],
        remark: '',
        sourceType: 0,
        brandId: null,
        materialId: null,
        taskCode: null
      }
      this.$set(this, 'model', obj)
    },
    // 删除任务
    deleteTask: function (row) {
      let that = this
      let executedNum = 1
      // 查询已完成任务的导购数
      that.$http.fetch(that.$api.guide.task.queryTaskExecutedNum, {taskId: row.id}).then((resp) => {
        if (resp.success === true) {
          executedNum = resp.result !== null ? resp.result : executedNum
          if (executedNum > 0) {
            that.$notify.error('已有导购完成任务，不能删除')
            return
          }
          // 删除任务
          that.$confirm('任务删除后，门店及员工的工作记录也将删除，是否确认删除？', '删除任务提示', {
            confirmButtonText: '确定',
            type: 'warning',
            cancelButtonText: '取消'
          }).then(() => {
            that.$http.fetch(that.$api.guide.task.deleteTask, {taskId: row.id}).then((resp) => {
              if (resp.success === true) {
                that.$notify.success('任务删除成功')
                that.$refs.table.$reload()
              }
            }).catch(() => { that.$notify.error('任务删除失败') })
          }).catch(() => {})
        } else {
          that.$notify.error('查询任务完成情况失败')
        }
      }).catch(() => { that.$notify.error('查询任务完成情况失败') })
    },
    // 获取服务器时间
    getServiceTime: function () {
      let req = new XMLHttpRequest()
      req.open('GET', location, false)
      req.send(null)
      this.serviceTime = moment(req.getResponseHeader('Date'))
      return this.serviceTime
    }
  }
}
