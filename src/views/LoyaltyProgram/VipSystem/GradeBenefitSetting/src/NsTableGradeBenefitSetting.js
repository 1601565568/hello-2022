import tableMixin from 'mixins/form'

var vm
export default {
  name: 'NsTableGradeBenefitSetting',
  mixins: [tableMixin],
  props: {
    types: Object
  },
  data: function () {
    var tableButtons = [
      {
        'func': function (obj) {
          this.$emit('benefit-update', obj)
        },
        'icon': '$.noop',
        'name': '设置',
        'auth': ``,
        'visible': `  `
      }
    ]
    var operateButtons = [
      {
        'func': function () {
          this.$emit('add')
        },
        'icon': '',
        'name': '新增权益',
        'auth': ``,
        'visible': `  `
      }
    ]
    let benefitList = []

    return {
      rules: Object.assign({}, {}, {}),
      state: {},
      gradeRuleState: '',
      gradeBenefitTypeList: [{
        benefitList: benefitList
      }
      ],
      gradeNameList: [],
      // url: this.$api.core.sysRole.queryTable,
      _table: {
        table_buttons: tableButtons,
        operate_buttons: operateButtons
      },
      datafor: [{'degree': '1', 'degree_name': '普通会员'},
        {'degree': '2', 'degree_name': '金牌会员'}]
    }
  },
  created: function () {
  },
  mounted: function () {
    vm = this
    vm.getBenefitList()
    /* if (typeof this.$init === 'function') {
      this.$init(this, this.$generateParams$)
    } else {
      this.$reload()
    } */
  },
  components: {},
  methods: {
    onRuleStateChange: function (call, currVal, row) {
      let ruleId = row.ruleId
      let that = this
      let info
      let changeStatus = 1
      if (currVal === 1) {
        info = '是否确定禁用该权益？'
        changeStatus = 0
      } else if (currVal === 0) {
        info = '是否确定启用该权益？'
        changeStatus = 1
      }
      that.$confirm(info, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        that.$http.fetch(that.$api.vip.gradeBenefit.updateBenefitRuleState, {ruleId: ruleId, ruleState: changeStatus})
          .then(() => {
            call()
          }).catch(() => {
            that.$notify.error('状态更新失败，请重试')
          })
      }).catch(() => {
      })
    },
    getBenefitList: function () {
      vm.$http.fetch(vm.$api.vip.gradeBenefit.queryBenefitList)
        .then(resp => {
          let gradeSystemEnabled = resp.result.gradeSystemEnabled
          let gradeRuleEnabled = resp.result.gradeRuleEnabled
          let gradeBenefitRuleTypeList = resp.result.gradeBenefitRuleList
          let gradeNameList = resp.result.gradeNameList
          let gradeRuleState = resp.result.gradeRuleState
          this.$parent.gradeSystemEnabled = gradeSystemEnabled
          this.$parent.gradeRuleEnabled = gradeRuleEnabled
          vm.$set(this, 'gradeRuleState', gradeRuleState)
          // 当 等级未启用的时候不展示 权益信息
          if (!gradeSystemEnabled) {
            vm.$notify.error('会员体系未启用')
            vm.$set(this, 'gradeBenefitTypeList', [])
          } else {
            if (!gradeRuleEnabled) {
              vm.$notify.error('请至少启用一个等级')
              vm.$set(this, 'gradeBenefitTypeList', [])
            } else {
              if (!gradeBenefitRuleTypeList || gradeBenefitRuleTypeList.length <= 0) {
                vm.$set(this, 'gradeBenefitTypeList', [])
                vm.$set(this, 'gradeNameList', vm.handleGradeNameList(gradeNameList))
              } else {
                let gradeBenefitTypeList2 = vm.handleRuleDetailData(gradeBenefitRuleTypeList, gradeNameList)[0]
                let gradeNameListFinal2 = vm.handleRuleDetailData(gradeBenefitRuleTypeList, gradeNameList)[1]
                vm.$set(this, 'gradeBenefitTypeList', gradeBenefitTypeList2)
                vm.$set(this, 'gradeNameList', gradeNameListFinal2)
                // Object.assign(vm.gradeBenefitTypeList, vm.handleRuleDetailData(gradeBenefitRuleTypeList))
              }
            }
          }
        }).catch(() => {
          vm.$notify.error('数据获取失败')
          vm.$set(this, 'gradeBenefitTypeList', [])
        }).finally(() => {
          vm.gradeBenefitLoading = false
        })
    },
    /**
     * 处理展示等级名
     * @param gradeNameList
     * @returns {*}
     */
    handleGradeNameList: function (gradeNameList) {
      if (gradeNameList !== null) {
        let gradeNameListFinal = []
        for (let gradeItem of gradeNameList) {
          if (gradeItem.enabled === 1) {
            gradeNameListFinal.push(gradeItem)
          }
        }
        return gradeNameListFinal
      }
      return null
    },
    /**
     * 处理权益规则信息
     * @param detailList
     * @returns {Array}
     */
    handleRuleDetailData: function (ruleTypeList, gradeNameList) {
      let ruleDetails = []
      let gradeNameListFinal = []
      // 遍历等级详情数据ruleState
      ruleTypeList.map((detail, dIndex) => {
        let gradeBenefitRuleJson = detail.gradeBenefitRuleJson ? JSON.parse(detail.gradeBenefitRuleJson) : {}
        let ruleTypeTemp = {
          gradeBenefitName: detail.gradeBenefitName,
          gradeBenefitType: detail.gradeBenefitType,
          ruleId: detail.ruleId,
          ruleState: detail.ruleState,
          benefitList: []
        }
        let benefitList = []
        if (gradeBenefitRuleJson !== undefined) {
          let content = gradeBenefitRuleJson.content
          if (content !== undefined && content.length > 0) {
            content.map((item, index) => {
              let benefit = {}
              benefit.gradeName = item.grade
              let contentItem = item.content
              let gradeEnabled = gradeNameList[index].enabled
              if (contentItem !== undefined && contentItem.length > 0 && gradeEnabled === 1) {
                // let message = ''
                let handleArr = []// 存放处理过后的内容数组
                let messageArr = []// 存放要展示的文字内容数组
                let notSetFlag = false// 默认已设置，显示为 --
                let contentArr = contentItem.split('#')
                if (contentArr !== null && contentArr.length > 0) {
                  if (item.placeHolder !== undefined && item.placeHolder !== '') {
                    contentArr.forEach(function (strItem) {
                      let handleItem = {}
                      if (strItem.length > 0) {
                        // 如果有值未设置，则默认展示为 -- ，而不再遍历
                        if (!notSetFlag && strItem.indexOf('PLACE') >= 0) {
                          item.placeHolder.forEach(placeItem => {
                            if (strItem === placeItem.name) {
                              // 下拉框取到对应的中文名
                              if (placeItem.type === 1) {
                                for (let selItem of placeItem.selectItems) {
                                  if (selItem.key === placeItem.value) {
                                    // message = message + selItem.value
                                    messageArr.push(selItem.value)
                                  }
                                }
                                handleItem.value = placeItem.value
                                handleItem.triggerValue = placeItem.triggerValue
                              } else if (placeItem.type === 2) {
                                // message = message + placeItem.value
                                messageArr.push(placeItem.value)
                                handleItem.triggerItemIndex = placeItem.triggerItemIndex
                                handleItem.supplementWord = placeItem.supplementWord
                              }
                              notSetFlag = (placeItem.value === undefined || placeItem.value === '')
                            }
                          })
                          handleArr.push(handleItem)
                        } else {
                          // message += strItem
                          messageArr.push(strItem)
                          handleItem.value = strItem
                          handleArr.push(handleItem)
                        }
                      }
                    })
                  }
                } else {
                  // message = contentArr
                  messageArr.push(contentArr)
                }

                // 倍字 展示 逻辑
                if (!notSetFlag && handleArr != null && handleArr.length > 0) {
                  handleArr.forEach((handle, index) => {
                    if (handle.supplementWord !== undefined &&
                      handle.supplementWord !== null &&
                      handle.supplementWord !== '' &&
                      handleArr[handle.triggerItemIndex] !== undefined &&
                      handleArr[handle.triggerItemIndex] !== null) {
                      if (handleArr[handle.triggerItemIndex].value === handleArr[handle.triggerItemIndex].triggerValue && messageArr.length > 0) {
                        messageArr[index] += handle.supplementWord
                      }
                    }
                  })
                }
                benefit.rule = notSetFlag ? '--' : messageArr.toString().replace(/,/g, '')
                benefitList.push(benefit)
                if (dIndex < 1) {
                  gradeNameListFinal.push(gradeNameList[index])
                }
              }
            })
          }
        }
        ruleTypeTemp.benefitList = benefitList
        ruleDetails.push(ruleTypeTemp)
      })
      return [ruleDetails, gradeNameListFinal]
    },
    dataFormatter (row, index) {
      return row.benefitList[index].rule
    }

  }}
