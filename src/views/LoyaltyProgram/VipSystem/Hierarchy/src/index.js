import formMixin from 'mixins/form'
import dataCheck from 'utils/dataCheck'

var vue
export default {
  mixins: [formMixin],
  data () {
    let model = {
      // 等级规则状态，默认不启用
      gradeStatus: 0,
      // 是否启用定级服务 默认不启用
      isGrading: 0,
      // 是否支持降级服务 默认允许降级
      allowSubGrade: 1,
      // 多少天未消费自动降级
      subDays: '',
      // 开始累计时间
      dateStart: '',
      // 累计几天前相对天数
      daysBetween: '',
      // 是否排除权益黑名单 默认包含
      isIncludeBlack: 0,
      // 是否排除未激活会员 默认不排除
      isExcludeNoActive: 0,
      id: 0
    }
    let that = this
    let rules = {
      'model.dateStart': [{
        validator: (rule, val, call) => {
          if (that.dataValidRange === 1) {
            if (!val) {
              call(new Error('请选择日期'))
            }
          }
          call()
        },
        trigger: 'blur'
      }],
      'model.daysBetween': [
        {
          validator: (rule, val, call) => {
            if (that.dataValidRange === 2) {
              if (that.model.gradeStatus === 0) {
                call()
              }
              if (!val) {
                call(new Error('请输入天数'))
              } else {
                if (!dataCheck.isNumber(val) || parseInt(val) <= 0) {
                  call(new Error('请输入正整数'))
                }
                if (val.length > 10) {
                  call(new Error('已超过可输入长度，请重新输入'))
                }
              }
            }
            call()
          },
          trigger: 'blur'
        }],
      'model.subDays': [
        {
          validator: (rule, val, call) => {
            if (that.model.allowSubGrade === 1) {
              if (that.model.gradeStatus === 0) {
                call()
              }
              if (!val || !dataCheck.isNumber(val) || parseInt(val) <= 7) {
                call(new Error('请输入大于7的整数'))
              }
              if (val.length > 10) {
                call(new Error('已超过可输入长度，请重新输入'))
              }
            }
            call()
          },
          trigger: 'blur'
        }]
    }
    return {
      model: model,
      originModel: {},
      rules: rules,
      saveBtnLoading: false,
      // 数据有效范围
      dataValidRange: 1,
      saveLoading: false,
      gradeRuleLoading: true,
      ratingData: [],
      originRatingData: [],
      // 全部表单项
      memberRuleCheckData: [{
        name: '累积消费金额满',
        value: '',
        key: 'consumeSum',
        placeholder: '输入金额',
        unit: '元',
        popover: false,
        type: 'double'
      }, {
        name: '累积消费次数满',
        value: '',
        key: 'consumeCount',
        placeholder: '输入次数',
        unit: '次',
        popover: false,
        type: 'int'
      }, {
        name: '单笔消费金额满',
        value: '',
        key: 'singleConsumeCount',
        placeholder: '输入金额',
        unit: '元',
        popover: false,
        type: 'double'
      }, {
        name: '成长值满',
        value: '',
        key: 'growthValue',
        placeholder: '输入个数',
        unit: '个',
        popover: false,
        type: 'int'
      }]
    }
  },
  methods: {
    // 删除会员等级
    onDeleteMember (index) {
      this.ratingData.splice(index, 1)
    },
    // 新增会员等级
    onAddMember () {
      this.ratingData.push(this.$options.data().ratingData[0])
    },
    // 会员等级条件 event
    // 添加条件
    onMemberRuleSaveCheck (index) {
      let rules = []
      //  选择的条件
      this.ratingData[index].checkedRules.forEach((check, checkedIndex) => {
        this.$options.data().memberRuleCheckData.forEach((data) => {
          if (check === data.key) {
            // 回显原来的值
            let rule = this.ratingData[index].rules.find(item => item.key === check)
            if (rule) {
              data.value = rule.value
            }
            rules.push(data)
          }
        })
      })
      this.ratingData[index].rules = rules
    },
    // 表单删除条件
    onMemberRuleDelete (index, series, key) {
      var that = this
      that.ratingData[index].rules.splice(series, 1)
      that.ratingData[index].checkedRules.forEach(function (value, currIndex) {
        if (value === key) {
          that.ratingData[index].checkedRules.splice(currIndex, 1)
        }
      })
    },
    /**
     * 条件弹窗隐藏
     * @param index
     */
    onMemberRulePopoverHide (index) {
      this.ratingData[index].checkedRules = []
      this.ratingData[index].rules.forEach(item => {
        this.ratingData[index].checkedRules.push(item.key)
      })
    },
    // 选择参数：
    onHandleChangeCheck (index) {
      if (this.ratingData[index].checkedRules.length < 1) {
        this.$notify({
          message: '最少要选择一个参数',
          type: 'warning'
        })
      }
    },
    /**
     * 保存
     */
    onSave: function () {
      if (this.model.gradeStatus === 1) {
        let hasEnable = vue.ratingData.find(item => {
          return item.isEnable
        })
        if (!hasEnable) {
          vue.$notify.warning('至少开启一个等级')
          return
        }
      }
      vue.loading = true
      this.validAndSubmit({
        loading: 'saveBtnLoading',
        api: vue.$api.vip.gradeRule.saveOrUpdate,
        handleParams: vue.handleSubmitParams,
        success: function (resp) {
          vue.$notify.success(resp.msg)
          // 拷贝获取的等级规则
          vue.$set(vue, 'originModel', JSON.parse(JSON.stringify(vue.model)))
          // 拷贝获取的等级规则详情
          vue.$set(vue, 'originRatingData', JSON.parse(JSON.stringify(vue.ratingData)))
        },
        error: function () {
          vue.$notify.error('修改失败')
        },
        complete: function () {
          vue.loading = false
        }
      })
    },
    handleSubmitParams: function (params) {
      let submitParam = {}
      let gradeRule = {
        id: params.id,
        // 等级规则状态，默认不启用
        grade_status: params.gradeStatus,
        // 是否启用定级服务 默认不启用
        is_grading: params.isGrading,
        // 是否支持降级服务 默认允许降级
        allow_sub_grade: params.allowSubGrade,
        // 多少天未消费自动降级
        sub_days: params.subDays,
        // 开始累计时间
        date_start: params.dateStart,
        // 累计几天前相对天数
        days_between: params.daysBetween ? params.daysBetween : 0,
        // 是否排除权益黑名单 默认包含
        is_include_black: params.isIncludeBlack,
        // 是否排除未激活会员 默认不排除
        is_exclude_no_active: params.isExcludeNoActive
      }
      submitParam.gradeRule = gradeRule
      let gradeRuleDetailList = []
      // 遍历每个等级规则
      this.ratingData.map((rating, index) => {
        // 单个等级规则详情
        let gradeRuleDetail = {}
        gradeRuleDetail.grade_name = rating.gradeName
        gradeRuleDetail.grade = rating.grade
        gradeRuleDetail.grade_code = rating.grade
        gradeRuleDetail.is_enable = rating.isEnable
        gradeRuleDetail.id = rating.id
        let gradeConditionJson = {
          allGoods: rating.allGoods,
          arbitrarilyGoods: rating.arbitrarilyGoods,
          orConditions: []
        }
        // 遍历累积条件
        rating.rules.map((item, index) => {
          gradeConditionJson.orConditions.push({
            key: item.key,
            value: item.value
          })
        })
        gradeRuleDetail.grade_condition_json = JSON.stringify(gradeConditionJson)
        // 规则详情放入列表
        gradeRuleDetailList.push(gradeRuleDetail)
      })
      // 规则详情
      submitParam.gradeRuleDetailList = gradeRuleDetailList
      return submitParam
    },
    /**
     * 重置
     */
    onReset: function () {
      this.$set(this, 'ratingData', JSON.parse(JSON.stringify(this.originRatingData)))
      this.$set(this, 'model', JSON.parse(JSON.stringify(this.originModel)))
    },
    /**
     * 获取当前等级规则
     */
    getGradeRule: function () {
      vue.$http.fetch(vue.$api.vip.gradeRule.queryGradeRule).then(resp => {
        // 等级规则
        let gradeRule = resp.result.gradeRule
        // 规则详情
        let detailList = resp.result.gradeRuleDetailList
        if (!gradeRule || !detailList || detailList.length <= 0) {
          vue.$notify.error('等级规则数据初始化错误')
        } else {
          // 处理数据回显
          let data = vue.handleEchoData(gradeRule, detailList)
          // 设置等级规则
          vue.$set(vue, 'model', data.model)
          // 设置等级规则详情
          vue.$set(vue, 'ratingData', data.ratingData)
          // 拷贝获取的等级规则
          vue.$set(vue, 'originModel', JSON.parse(JSON.stringify(data.model)))
          // 拷贝获取的等级规则详情
          vue.$set(vue, 'originRatingData', JSON.parse(JSON.stringify(data.ratingData)))
        }
      }).catch(() => {
        vue.$notify.error('数据获取失败')
      }).finally(() => {
        vue.gradeRuleLoading = false
      })
    },
    /**
     * 处理等级规则数据的回显
     * @param gradeRule
     * @param detailList
     */
    handleEchoData: function (gradeRule, detailList) {
      // 规则表单model
      let model = {
        // 等级规则状态，默认不启用
        gradeStatus: gradeRule.grade_status,
        // 是否启用定级服务 默认不启用
        isGrading: gradeRule.is_grading,
        // 是否支持降级服务 默认允许降级
        allowSubGrade: gradeRule.allow_sub_grade,
        // 多少天未消费自动降级
        subDays: gradeRule.sub_days,
        // 开始累计时间
        dateStart: gradeRule.date_start ? gradeRule.date_start : '',
        // 累计几天前相对天数
        daysBetween: gradeRule.days_between !== 0 ? gradeRule.days_between : '',
        // 是否排除权益黑名单 默认包含
        isIncludeBlack: gradeRule.is_include_black,
        // 是否排除未激活会员 默认不排除
        isExcludeNoActive: gradeRule.is_exclude_no_active,
        id: gradeRule.id
      }
      let ratingData = this.handleDetailEchoData(detailList)
      this.dataValidRange = model.dateStart ? 1 : 2
      return {model: model, ratingData: ratingData}
    },
    /**
     * 处理详情回显数据
     * @param detailList
     * @returns {Array}
     */
    handleDetailEchoData: function (detailList) {
      let ratingData = []
      // 遍历等级详情数据
      detailList.forEach((detail, dIndex) => {
        let conditionJson = detail.grade_condition_json ? JSON.parse(detail.grade_condition_json) : {}
        let rating = {
          gradeName: detail.grade_name,
          grade: detail.grade,
          isEnable: detail.is_enable,
          checkedRules: [],
          // 或任意商品
          arbitrarilyGoods: conditionJson.arbitrarilyGoods ? conditionJson.arbitrarilyGoods : [],
          // 且全部商品
          allGoods: conditionJson.allGoods ? conditionJson.allGoods : [],
          rules: [],
          id: detail.id
        }
        // 或条件
        if (conditionJson.orConditions) {
          // 遍历会员规则条件
          this.memberRuleCheckData.forEach((checkData, mIndex) => {
            // 遍历保存的会员规则条件数据
            conditionJson.orConditions.forEach((condition, oIndex) => {
              // 判断是否条件相同
              if (checkData.key === condition.key) {
                rating.checkedRules.push(checkData.key)
                checkData.value = condition.value
                rating.rules.push(Object.assign({}, checkData))
              }
            })
          })
        }
        // 判断是否未初始化条件
        if (rating.rules.length === 0) {
          rating.rules.push(Object.assign({}, vue.memberRuleCheckData[0]))
          rating.checkedRules.push(vue.memberRuleCheckData[0].key)
        }
        // 添加等级规则
        ratingData.push(rating)
      })
      return ratingData
    },
    /**
     *  校验等级名称
     * @param index 某等级索引
     * @param val
     * @param call
     */
    onCheckGradeName: function (index, val, call) {
      if (this.model.gradeStatus === 0) {
        call()
      }
      let gradeName = this.ratingData[index].gradeName
      if (!gradeName) {
        call(new Error('请输入等级名称'))
      }
      if (gradeName.length > 50) {
        call(new Error('已超过可输入长度，请重新输入'))
      }
      this.ratingData.forEach((rating, rIndex) => {
        if (rIndex !== index && gradeName === rating.gradeName) {
          call(new Error('等级名称已存在，请重新输入'))
        }
      })
      call()
    },
    /**
     *  校验等级规则条件
     * @param index
     * @param currRuleIndex
     * @param val
     * @param call
     */
    onCheckConditions: function (index, currRuleIndex, val, call) {
      if (this.model.gradeStatus === 0) {
        call()
      }
      if (!this.ratingData[index].isEnable) {
        call()
      }
      let currRule = this.ratingData[index].rules[currRuleIndex]
      if (currRule.type === 'int') {
        if (!dataCheck.isNumber(currRule.value) || parseInt(val) <= 0) {
          call(new Error('请输入正整数'))
        }
        if (currRule.value.length > 10) {
          call(new Error('已超过可输入长度，请重新输入'))
        }
      } else {
        // 数值校验
        if (!dataCheck.isDecimal(currRule.value) || parseFloat(val) <= 0) {
          call(new Error('请输入金额(两位小数)'))
        }
        if (currRule.value.length > 13) {
          call(new Error('已超过可输入长度，请重新输入'))
        }
      }
      if (index > 0 && this.ratingData[index].isEnable) {
        for (let gradeIndex = index - 1; gradeIndex > -1; gradeIndex--) {
          let grade = this.ratingData[gradeIndex]
          if (gradeIndex < index && grade.isEnable) {
            grade.rules.forEach((rule) => {
              if (currRule.key === rule.key) {
                if (parseFloat(currRule.value) <= parseFloat(rule.value)) {
                  call(new Error('必须大于LV.' + (gradeIndex + 1) + '的' + rule.name.substr(0, rule.name.length - 1)))
                  // call(this.$notify.warning('必须大于' + this.ratingData[(index - 1)].gradeName + '的' + rule.name.substr(0, rule.name.length - 1)))
                }
              }
            })
          }
        }
      }
      call()
    },
    /**
     *  等级开启或关闭
     * @param val
     * @param index
     */
    onChangeGradeEnable (val, index) {
      if (val === 0) {
        let prop = []
        prop.push('ratingData.' + index + '.gradeName')
        this.ratingData[index].rules.forEach((item, ruleIndex) => {
          prop.push('ratingData.' + index + '.rules.' + ruleIndex + '.value')
        })
        this.$refs.form.clearValidate(prop)
      }
    }
  },
  created: function () {
    vue = this
    this.getGradeRule()
  },
  mounted () {
    this.$nextTick(() => {
      let limitHeight = window.innerHeight - 97
      this.$refs.hierarchyHeight.$el.children[0].style.maxHeight = limitHeight + 'px'
    })
  },
  watch: {
    'dataValidRange': function (val) {
      if (val === 1) {
        this.model.daysBetween = ''
        // 从某日期开始累计
        this.$refs.form.validateField('model.daysBetween')
      } else if (val === 2) {
        this.model.dateStart = ''
        // 累计多少天内
        this.$refs.form.validateField('model.dateStart')
      }
    },
    'model.gradeStatus': function (val) {
      if (val === 0) {
        this.$refs.form.clearValidate()
      }
    }
  }
}
