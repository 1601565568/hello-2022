import formMixin from 'mixins/form'
import dataCheck from 'utils/dataCheck'

var vm
export default {
  mixins: [formMixin],
  data: function () {
    let benefitModel = {}
    return {
      visible: false,
     // addVisible: true,
      formVisible: false,
      manageType: null,
      gradeSystemEnabled: true,
      gradeRuleEnabled: true,
      gradeBenefitLoading: true,
      saveBenefitLoading: true,
      benefitOption: [],
      selectedBenefitType: '',
      benefitModel: benefitModel,
      benefitRuleList: [],
      rules: {
        'selectedBenefitType': [
          {required: true, message: '请选择权益类型', trigger: 'blur'}
        ],
        'benefitModel.grade_benefit_name': [
          {required: true, message: '请输入权益名称', trigger: 'blur'},
          {min: 2, max: 25, message: '权益名称长度在 2 到 25个字符', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    onCheckConditions: function (ruleDetailState, regexStr, alertMsg, val, call) {
      // 排除没启用的等级
      if (ruleDetailState === 1) {
        if (regexStr !== null && regexStr !== 'null' && regexStr !== undefined && regexStr !== '') {
          var reg = new RegExp(regexStr)
          // /^[0-9]+$/
          if (!reg.test(val)) {
            call(new Error(alertMsg))
          }
        }
      }
      call()
    },
    onBenefitChange: function () {
      vm.manageType = 1
      vm.getGradeBenefitRule()
    },
    onHandleItemChange: function (index1, index2) {
      if (index1 !== null && index2 !== null) {
          // vm.benefitRuleList[]
        let value = vm.benefitRuleList[index2].handleRuleContent[index1].value
        let triggerValue = vm.benefitRuleList[index2].handleRuleContent[index1].triggerValue
        let triggerIndex = vm.benefitRuleList[index2].handleRuleContent[index1].triggerItemIndex
        let triggerItem = vm.benefitRuleList[index2].handleRuleContent[triggerIndex]
        if (value === triggerValue) {
          triggerItem.showSupWord = true
        } else {
          triggerItem.showSupWord = false
        }
        triggerItem.value = null
      }
    },
    onAdd: function () {
      if (!vm.gradeRuleEnabled || !vm.gradeSystemEnabled) {
        vm.$notify.error(!vm.gradeSystemEnabled ? '会员体系未开启，请先开启再点击新增' : '请至少启用一个等级')
        return
      }
      if (this.benefitOption === null || this.benefitOption.length <= 0) {
        vm.$notify.error('所有权益已存在，如需修改请点击设置')
        return
      }
      this.visible = true
      this.manageType = 1
      this.selectedBenefitType = this.benefitOption[0].typecd
      vm.getGradeBenefitRule()
     // this.addVisible = true
    },
    onUpdateBenefit: function (obj) {
      let type = obj.row.gradeBenefitType
      this.selectedBenefitType = type
      this.manageType = 2
      this.getGradeBenefitRule()
      this.visible = true
      // this.addVisible = false
    },
    onCloseDialog () {
      this.$set(this, 'benefitRuleList', [])
      this.$set(this, 'benefitModel', {})
      this.$set(this, 'selectedBenefitType', '')
      this.$refs.form.resetFields()
      this.benefitExistFlag = false
      this.visible = false
      this.formVisible = false
      this.gradeBenefitLoading = false
      this.manageType = null
      this.gradeRuleEnabled = true
      this.gradeSystemEnabled = true
    },
    onSave () {
      if (!vm.gradeRuleEnabled || !vm.gradeSystemEnabled || (vm.hasSetFlag && vm.manageType === 1)) {
        vm.$notify.error(!vm.gradeSystemEnabled ? '会员体系未开启，无法保存' : (!vm.gradeRuleEnabled ? '请至少启用一个等级' : '该权益类型已存在'))
        return
      }
      let checkMsg = vm.checkDiscount()
      if (checkMsg !== '') {
        vm.$notify.error(checkMsg)
        return
      }
      this.validAndSubmit({
        api: vm.$api.vip.gradeBenefit.saveOrUpdate,
        handleParams: vm.handleSubmitParams,
        params: vm.benefitModel,
        success: function (resp) {
          vm.onCloseDialog()
          vm.$refs.table.getBenefitList()
          vm.getBenefitTypeItmes()
          vm.$notify.success(resp.msg)
        },
        error: function () {
          vm.$notify.error('修改失败')
        },
        complete: function () {
          vm.gradeBenefitLoading = false
          vm.saveBenefitLoading = false
        }
      })
    },
    /**
     * 折扣大小校验，等级低的折扣不能大于等级高的
     * @returns {boolean}
     */
    checkDiscount: function () {
      if (vm.benefitModel.grade_benefit_type === 2) {
        let valueComp = parseFloat(11)
        for (let benefitRule of vm.benefitRuleList) {
          if (benefitRule.ruleDetailState === 1) {
            for (let handleRule of benefitRule.handleRuleContent) {
              if (handleRule.type === 2) {
                if (parseFloat(handleRule.value) > valueComp) {
                  return '等级低的折扣不能大于等级高的折扣'
                } else {
                  valueComp = parseFloat(handleRule.value)
                }
              }
            }
          }
        }
      }
      /**  待后期优化 **/
      /* if (vm.benefitModel.grade_benefit_type === 1) {
        let valueComp = parseFloat(0)
        for (let benefitRule of vm.benefitRuleList) {
          if (benefitRule.ruleDetailState === 1) {
            for (let handleRule of benefitRule.handleRuleContent) {
              if (handleRule.type === 2) {
                if (parseFloat(handleRule.value) < valueComp) {
                  return '等级低的赠送积分不能大于等级高'
                } else {
                  valueComp = parseFloat(handleRule.value)
                }
              }
            }
          }
        }
      } */
      return ''
    },
    handleSubmitParams: function (params) {
      let submitParam = {}
      let gradeBenefitRuleList = []
      let gradeBenefitRuleJsonAll = {content: []}
      let ruleDetailTemp = {}
      // 遍历每个等级规则
      this.benefitRuleList.map((benefitRule, index) => {
        // 单个等级规则详情
        ruleDetailTemp.gradeCode = benefitRule.grade
        ruleDetailTemp.gradeName = benefitRule.gradeName
        ruleDetailTemp.gradeBenefitJson = benefitRule.gradeBenefitJson
        ruleDetailTemp.gradeBenefitName = benefitRule.gradeBenefitName
        ruleDetailTemp.groupId = benefitRule.groupId
        ruleDetailTemp.ruleId = benefitRule.ruleId
        ruleDetailTemp.gradeBenefitTemplateId = benefitRule.gradeBenefitTemplateId
        ruleDetailTemp.ruleState = benefitRule.ruleState !== undefined && benefitRule.ruleState !== null && benefitRule.ruleState !== '' ? benefitRule.ruleState : 1
        let gradeBenefitRuleJson = {
          grade: benefitRule.grade,
          content: benefitRule.gradeBenefitJson,
          placeHolder: benefitRule.placeHolder
        }
        // 给占位符赋输入的值
        let handleRuleContent = benefitRule.handleRuleContent
        if (gradeBenefitRuleJson.placeHolder !== undefined && handleRuleContent !== undefined) {
          gradeBenefitRuleJson.placeHolder.forEach(placeItem => {
            handleRuleContent.forEach(handleRuleItem => {
              if (placeItem.name === handleRuleItem.name) {
                placeItem.value = handleRuleItem.value
              }
            })
          })
        }
        gradeBenefitRuleJsonAll.content.push(gradeBenefitRuleJson)
      })
      ruleDetailTemp.gradeBenefitRuleJson = JSON.stringify(gradeBenefitRuleJsonAll)
      // 规则详情放入列表
      gradeBenefitRuleList.push(ruleDetailTemp)
      // 规则详情
      submitParam.gradeBenefitTemplate = params
      submitParam.gradeBenefitRuleList = gradeBenefitRuleList
      return submitParam
    },
    /**
     * 获取选择的等级权益模板
     */
    getGradeBenefitRule: function () {
      vm.gradeBenefitLoading = true
      vm.$http.fetch(vm.$api.vip.gradeBenefit.queryGradeBenefitRulesByType, {'benefitType': vm.selectedBenefitType, 'manageType': vm.manageType})
        .then(resp => {
          // 模板对象
          let gradeSystemEnabled = resp.result.gradeSystemEnabled
          let gradeRuleEnabled = resp.result.gradeRuleEnabled
          let hasSetFlag = resp.result.hasSetFlag
          this.$set(this, 'benefitRuleList', [])
          this.$set(this, 'benefitModel', {})
          this.$refs.form.resetFields()
          vm.hasSetFlag = hasSetFlag
          vm.gradeSystemEnabled = gradeSystemEnabled
          vm.gradeRuleEnabled = gradeRuleEnabled
          if (!gradeSystemEnabled) {
            vm.$notify.error('会员体系未启用')
            return
          }
          if (!gradeRuleEnabled) {
            vm.$notify.error('请至少启用一个等级')
            return
          }
          if (hasSetFlag && vm.manageType === 1) {
            vm.$notify.error('该权益类型已存在，如需修改请点击设置')
            return
          }
          let benefitRuleList = resp.result.gradeBenefitRuleList
          let benefitModel = resp.result.gradeBenefitTemplate
          if (!benefitModel || !benefitRuleList || benefitRuleList.length <= 0) {
            vm.$notify.error('等级权益信息初始化错误')
          } else {
            vm.formVisible = true
            vm.benefitExistFlag = false
            let descArr = vm.handleGradeBenefitDesc(benefitModel)
            // 设置权益模板信息
            // Object.assign(benefitModel, {'descArr': descArr})
            benefitModel.descArr = descArr
            // Object.assign(vm.benefitModel, benefitModel)
            vm.$set(vm, 'benefitModel', benefitModel)
            // 设置权益等级规则信息
            let benefitRuleList2 = this.handleRuleDetailData(benefitRuleList)
            vm.$set(vm, 'benefitRuleList', benefitRuleList2)
          }
        }).catch(() => {
          vm.$notify.error('数据获取失败')
        }).finally(() => {
          vm.gradeBenefitLoading = false
        })
    },
    /**
     * 处理权益说明
     * @param benefitModel
     */
    handleGradeBenefitDesc: function (benefitModel) {
      if (benefitModel !== null && benefitModel.grade_benefit_desc !== '') {
        let desc = benefitModel.grade_benefit_desc
        let descArr = desc.split('&&&')
        if (descArr !== null && descArr.length > 0) {
          return descArr
        }
      }
    },
    /**
     * 获取首页权益类型
     */
    getBenefitTypeItmes: function () {
      vm.$http.fetch(vm.$api.vip.gradeBenefit.queryAllGradeBenefitType)
        .then(resp => {
          // let typeItems = JSON.parse(resp.result)
          vm.benefitOption = resp.result !== null && resp.result !== undefined && resp.result !== '' ? JSON.parse(resp.result).typeitems : null
        }).catch(() => {
          vm.$notify.error('数据获取失败')
        }).finally(() => {
          vm.gradeBenefitLoading = false
        })
    },
    /**
     * 处理权益规则信息
     * @param detailList
     * @returns {Array}
     */
    handleRuleDetailData: function (rulelDetailList) {
      let ruleDetails = []
      // 遍历等级详情数据
      rulelDetailList.forEach((detail, dIndex) => {
        let gradeBenefitRuleJson = detail.gradeBenefitRuleJson ? JSON.parse(detail.gradeBenefitRuleJson) : JSON.parse(detail.gradeBenefitJson)
        let ruleDetailTemp = {
          gradeName: detail.gradeName,
          grade: gradeBenefitRuleJson.grade ? gradeBenefitRuleJson.grade : '',
          gradeBenefitJson: gradeBenefitRuleJson.content,
          gradeBenefitName: detail.gradeBenefitName,
          gradeBenefitTemplateId: detail.gradeBenefitTemplateId,
          groupId: detail.groupId,
          ruleId: detail.ruleId,
          ruleDetailState: detail.ruleDetailState,
          gradeBenefitRuleJson: gradeBenefitRuleJson,
          placeHolder: gradeBenefitRuleJson.placeHolder ? gradeBenefitRuleJson.placeHolder : [],
          ruleState: detail.ruleState,
          handleRuleContent: []
        }
        // 拼装显示规则 json 串
        let handleArr = [] // 存放遍历的规则内容
        if (ruleDetailTemp.gradeBenefitRuleJson !== undefined && ruleDetailTemp.gradeBenefitRuleJson !== '' &&
        ruleDetailTemp.gradeBenefitRuleJson.content !== undefined && ruleDetailTemp.gradeBenefitRuleJson.content !== '') {
          // 模板内容解析成数组
          let contentArr = ruleDetailTemp.gradeBenefitRuleJson.content.split('#')
          if (contentArr !== null && contentArr.length > 0) {
            if (ruleDetailTemp.placeHolder !== undefined && ruleDetailTemp.placeHolder !== '') {
              contentArr.forEach(function (item) {
                if (item.length > 0) {
                  // 存放在权益内容框展示的信息 数组
                  let handleItem = {}
                  // 为占位符的情况
                  if (item.indexOf('PLACE') >= 0) {
                    ruleDetailTemp.placeHolder.forEach(placeItem => {
                      if (item === placeItem.name) {
                        handleItem.name = item
                        handleItem.type = placeItem.type
                        handleItem.value = placeItem.value
                        handleItem.selectItems = placeItem.selectItems
                        handleItem.regexStr = placeItem.regexStr
                        handleItem.alertMsg = placeItem.alertMsg
                        handleItem.triggerValue = placeItem.triggerValue
                        handleItem.triggerItemIndex = placeItem.triggerItemIndex
                        handleItem.supplementWord = placeItem.supplementWord
                        handleItem.showSupWord = false
                        // 下拉赋默认值
                        if (placeItem.type === 1 && (placeItem.value === undefined || placeItem.value === '')) {
                          for (let sel of placeItem.selectItems) {
                            if (sel.selected === '1') {
                              handleItem.value = sel.key
                            }
                          }
                        }
                        // 倍字 展示 逻辑
                        if (handleItem.supplementWord !== undefined &&
                          handleItem.supplementWord !== null &&
                          handleItem.supplementWord !== '' &&
                          handleArr[handleItem.triggerItemIndex] !== undefined &&
                          handleArr[handleItem.triggerItemIndex] !== null) {
                          if (handleArr[handleItem.triggerItemIndex].value === handleArr[handleItem.triggerItemIndex].triggerValue) {
                            handleItem.showSupWord = true
                          }
                        }
                      }
                    })
                  } else {
                    handleItem.text = item
                    handleItem.type = 99 // 表示就是字符显示
                  }
                  handleArr.push(handleItem)
                }
              })
              ruleDetailTemp.handleRuleContent = handleArr
              // vm.$set(ruleDetailTemp, 'handleRuleContent', handleArr)
            }
          } else {
            let handleItem = {}
            handleItem.text = ruleDetailTemp.gradeBenefitRuleJson.content
            handleItem.type = 99 // 表示就是字符显示
            handleArr.push(handleItem)
          }
          vm.$set(ruleDetailTemp, 'handleRuleContent', handleArr)

          // }
        }
        // 添加权益等级
        ruleDetails.push(ruleDetailTemp)
      })
      return ruleDetails
    },
    checkDecimalField: function (val, call) {
      if (!dataCheck.isDecimal(val)) {
        call(new Error('请输入数字（两位小数）'))
      }
      if (val.length > 10) {
        call(new Error('已超过可输入长度，请重新输入'))
      }
      call()
    }
  },
  created: function () {
    vm = this
    // this.getGradeBenefitRule()
    this.getBenefitTypeItmes()
  },
  mounted: function () {

  },
  watch: {
  }
}
