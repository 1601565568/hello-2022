export default {
  validateMaxNumber: (rule, value, callback) => {
    if (value > 9999) {
      callback(new Error('最大9999'))
    } else {
      callback()
    }
  },
  shareName: (rule, value, callback) => {
    if (value.length > 10) {
      callback(new Error('分享按钮名称最多10个字'))
    } else {
      callback()
    }
  },
  goodsName: (rule, value, callback) => {
    if (value.length > 20) {
      callback(new Error('奖品名称最多20个字'))
    } else {
      callback()
    }
  },
  goodsDesc: (rule, value, callback) => {
    if (value.length > 50) {
      callback(new Error('奖品简介最多50个字'))
    } else {
      callback()
    }
  },
  validateCard: (rule, value, callback) => {
    if (value.length > 20) {
      callback(new Error('活动名称最多20个字'))
    } else {
      callback()
    }
  },
  validateString: (rule, value, callback) => {
    if (value.length > 50) {
      callback(new Error('活动文案最多50个字'))
    } else {
      callback()
    }
  },
  // 活动名称不大于20个子
  validateName: (rule, value, callback) => {
    if (value.length > 20) {
      callback(new Error('活动名称最多20个字'))
    } else {
      callback()
    }
  },
  // 活动说明不大于1000个子
  validateActivityDescription: (name, rule, value, callback) => {
    if (value.length > 1000) {
      callback(new Error(`${name}最多1000个字`))
    } else {
      callback()
    }
  },
  validateActivityIntroduction: (length, rule, value, callback) => {
    if (length > 1000) {
      callback(new Error(`活动介绍最多1000个字`))
    } else {
      callback()
    }
  },
  validateActivityIntroductionLeast: (length, rule, value, callback) => {
    if (length <= 0) {
      callback(new Error(`请输入活动介绍`))
    } else {
      callback()
    }
  },
  // 活动人员
  validateGuideIds: (rule, value, callback) => {
    if (!value || value.length <= 0) {
      callback(new Error(`请选择参加活动人员`))
    } else {
      callback()
    }
  }
}
