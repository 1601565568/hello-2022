const number = new RegExp(/^[0-9]*$/)
const english = new RegExp(/^[A-Za-z]*$/)
const englishAndNumber = new RegExp(/^[A-Za-z0-9]*$/)
const invalidChar = new RegExp(/^[\u4e00-\u9fa5a-zA-Z0-9]*$/)
const callbackResult = (isPass, callback, msg) => {
  if (isPass) {
    callback()
  } else {
    callback(msg)
  }
}

const isMoney = (rule, value, callback, isPositive) => {
  let isPass = true
  let error = null
  if (value) {
    value = String(value)
    if (isNaN(value)) {
      isPass = false
      error = '金额仅允许输入数字和小数点'
    } else if (isPositive && Number(value) <= 0) {
      isPass = false
      error = '请输入大于0的金额'
    } else {
      let moneyArray = value.toString().split('.')
      if (moneyArray.length > 2) {
        isPass = false
        error = '金额仅允许输入一位小数点'
      } else {
        if (moneyArray[1] && moneyArray[1].length > 2) {
          isPass = false
          error = '金额小数点后仅允许输入两位数字'
        }
      }
    }
  }
  callbackResult(isPass, callback, error)
}

/**
 * 判断长度（min, max两个参数必须指定，若不验证最小，设置min为null即可，不验证max同理）
 * @param min 最小长度
 * @param max 最大长度
 * @param rule 规则
 * @param value 值
 * @param callback 回调
 */
const checkLength = (min, max, rule, value, callback) => {
  let isPass = true
  let msg = ''
  if (value) {
    // 纯数字小数点不算长度
    value = String(value)
    if (!isNaN(min)) {
      if (value.length < min) {
        isPass = false
        msg = '内容长度不能小于' + min + '位'
      }
    }
    if (!isNaN(max)) {
      if (value.length > max) {
        isPass = false
        msg = '内容长度不能大于' + max + '位'
      }
    }
  }
  callbackResult(isPass, callback, msg)
}

export default {
  /**
   * 正则验证
   * @param rule 规则
   * @param value 值
   * @param callback 回调
   */
  match (regExp, rule, value, callback) {
    let isPass = true
    if (value && regExp) {
      const reg = new RegExp(regExp)
      if (!reg.test(value)) {
        isPass = false
      }
    }
    callbackResult(isPass, callback, '不匹配')
  },
  /**
   * 判断是否输入为纯数字（也不包含小数点）
   * @param rule 规则
   * @param value 值
   * @param callback 回调
   */
  isPureNumber (rule, value, callback) {
    let isPass = true
    if (value) {
      if (!number.test(value)) {
        isPass = false
      }
    }
    callbackResult(isPass, callback, '只允许输入数字')
  },
  /**
   * 判断长度（min, max两个参数必须指定，若不验证最小，设置min为null即可，不验证max同理）
   * @param min 最小长度
   * @param max 最大长度
   * @param rule 规则
   * @param value 值
   * @param callback 回调
   */
  checkLength (min, max, rule, value, callback) {
    checkLength(min, max, rule, value, callback)
  },
  /**
   * 判断数字长度（min, max两个参数必须指定，若不验证最小，设置min为null即可，不验证max同理）
   * @param min 最小长度
   * @param max 最大长度
   * @param rule 规则
   * @param value 值
   * @param callback 回调
   */
  checkDigitalLength (min, max, rule, value, callback) {
    if (value !== null && value !== undefined && value !== '') {
      value = String(value).replace('.', '')
    }
    checkLength(min, max, rule, value, callback)
  },
  /**
   * 是否只包含字母
   * @param rule 规则
   * @param value 值
   * @param callback 回调
   */
  isEnglish (rule, value, callback) {
    let isPass = true
    if (value) {
      if (!english.test(value)) {
        isPass = false
      }
    }
    callbackResult(isPass, callback, '只允许输入英文字母')
  },
  /**
   * 是否只包含字母和数字
   * @param rule 规则
   * @param value 值
   * @param callback 回调
   */
  isEnglishAndNumber (rule, value, callback) {
    let isPass = true
    if (value) {
      if (!englishAndNumber.test(value)) {
        isPass = false
      }
    }
    callbackResult(isPass, callback, '只允许输入英文字母和数字')
  },
  require (rule, value, callback) {
    let isPass = true
    if (value === undefined || value === null) {
      isPass = false
    }
    callbackResult(isPass, callback, '该项必填')
  },
  /**
   * 是否为金额
   * @param rule 规则
   * @param value 值
   * @param callback 回调
   */
  money (rule, value, callback) {
    isMoney(rule, value, callback, false)
  },
  /**
   * 是否为正数的金额
   * @param rule 规则
   * @param value 值
   * @param callback 回调
   */
  isPositiveMoney (rule, value, callback) {
    isMoney(rule, value, callback, true)
  },
  /**
   * 是否为有效的图片格式
   * @param rule 规则
   * @param value 值
   * @param callback 回调
   */
  isImage (rule, value, callback) {
    let isPass = true
    let error = null
    if (value) {
      const fileNames = value.split('.')
      const suffix = fileNames[fileNames.length - 1]

      if (['jpg', 'jpeg', 'png'].indexOf(suffix) < 0) {
        error = '请上传jpg、jpeg或png格式的图片'
        isPass = false
      }
    }
    callbackResult(isPass, callback, error)
  },
  /**
   * 是否为正数
   * @param rule 规则
   * @param value 值
   * @param callback 回调
   */
  isPositiveNumber (rule, value, callback) {
    if (value) {
      if (isNaN(value)) {
        callbackResult(false, callback, '请输入大于0的数字')
        return
      }
      if (Number(value) <= 0) {
        callbackResult(false, callback, '请输入大于0的数字')
        return
      }
    }
    callbackResult(true, callback, null)
  },
  /**
   * 是否包含特殊字符
   * @param rule 规则
   * @param value 值
   * @param callback 回调
   */
  hasInvalidChar (rule, value, callback) {
    if (value) {
      if (!invalidChar.test(value)) {
        callbackResult(false, callback, '请勿输入特殊字符')
        return
      }
    }
    callbackResult(true, callback, null)
  },
  moneyAndNotZero (rule, value, callback) {
    let isPass = true
    let error = null
    if (value) {
      value = String(value)
      if (isNaN(value)) {
        isPass = false
        error = '金额仅允许输入数字和小数点'
      } else {
        let moneyArray = value.toString().split('.')
        if (moneyArray.length > 2) {
          isPass = false
          error = '金额仅允许输入一位小数点'
        } else {
          if (moneyArray[1] && moneyArray[1].length > 2) {
            isPass = false
            error = '金额小数点后仅允许输入两位数字'
          } else {
            if (value <= 0) {
              isPass = false
              error = '金额不允许小于等于0.00'
            }
          }
        }
      }
    }
    callbackResult(isPass, callback, error)
  },
  /**
   * 判断数字大小（min, max两个参数必须指定，若不验证最小，设置min为null即可，不验证max同理）
   * @param min 最小长度
   * @param max 最大长度
   * @param rule 规则
   * @param value 值
   * @param callback 回调
   */
  intervalMoney (min = Number.MIN_VALUE, max = Number.MAX_VALUE, rule, value, callback) {
    let isPass = true
    let msg = ''
    if (value) {
      value = parseFloat(value)
      if (!isNaN(min)) {
        if (value < min) {
          isPass = false
          msg = '最小输入' + min
        }
      }
      if (!isNaN(max)) {
        if (value > max) {
          isPass = false
          msg = '最大输入' + max
        }
      }
    }
    callbackResult(isPass, callback, msg)
  }
}
