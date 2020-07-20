/*
 * @Descripttion: 表单校验规则
 * @Author: yuye.huang
 * @Date: 2020-03-01 21:22:07
 * @LastEditors: yuye.huang
 * @LastEditTime: 2020-07-13 15:14:01
 */
/**
 * @msg: appId 前缀校验
 */
var prefixCheck = (rule, value, callback) => {
  if (value && !value.startsWith(rule.prefix)) {
    return callback(new Error('输入格式错误'))
  } else {
    callback()
  }
}
/**
 * @msg: 校验除空格和换行符以外字符
 */
var contentCheck = (rule, value, callback) => {
  const regexp = /\S+/
  if (value && !regexp.test(value)) {
    return callback(new Error('请输入欢迎语'))
  } else {
    callback()
  }
}

export default {
  link: [{ required: true, message: '请输入网址', trigger: ['blur'] }],
  title: [{ required: true, message: '请输入标题', trigger: ['blur'] },
    { min: 1, max: 20, message: '长度在2-20个字符以内', trigger: ['blur'] }],
  innerContent: [{ required: true, message: '请输入文案', trigger: ['blur'] },
    { min: 1, max: 100, message: '已超过可输入长度', trigger: ['blur'] }],
  content: [{ required: true, message: '请输入欢迎语', trigger: ['blur'] },
    { validator: contentCheck, trigger: 'blur' }],
  selectOne: [{ required: true, message: '请选择一项', trigger: ['blur'] }],
  appid: [{ required: true, message: '请输入小程序appid', trigger: ['blur'] },
    { min: 5, max: 30, message: '长度在5-30个字符以内', trigger: 'blur' },
    { prefix: 'wx', validator: prefixCheck, trigger: 'blur' }],
  path: [{ required: true, message: '请输入小程序路径', trigger: ['blur'] },
    { min: 1, max: 255, message: '长度在1-255个字符以内', trigger: ['blur'] }],
  image: [{ required: true, message: '请选择图片上传', trigger: ['change'] }],
  desc: [{ required: true, message: '请输入文案', trigger: ['blur'] },
    { min: 1, max: 50, message: '长度在1-50个字符以内', trigger: ['blur'] }]
}
