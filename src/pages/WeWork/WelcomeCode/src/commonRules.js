/*
 * @Descripttion: 表单校验规则
 * @Author: yuye.huang
 * @Date: 2020-03-01 21:22:07
 * @LastEditors: yuye.huang
 * @LastEditTime: 2020-04-01 11:11:30
 */
export default {
  link: [{ required: true, message: '请输入网址', trigger: ['blur', 'change'] }],
  title: [{ required: true, message: '请输入标题', trigger: ['blur', 'change'] },
    { min: 1, max: 20, message: '已超过可输入长度', trigger: ['blur', 'change'] }],
  innerContent: [{ required: true, message: '请输入文案', trigger: ['blur', 'change'] },
    { min: 1, max: 100, message: '已超过可输入长度', trigger: ['blur', 'change'] }],
  content: [{ required: true, message: '请输入智能欢迎语内容', trigger: ['blur', 'change'] }],
  selectOne: [{ required: true, message: '请选择一项', trigger: ['change', 'blur'] }],
  appid: [{ required: true, message: '请输入小程序appid', trigger: ['blur', 'change'] }],
  path: [{ required: true, message: '请输入小程序路径', trigger: ['blur', 'change'] },
    { min: 1, max: 50, message: '已超过可输入长度', trigger: ['blur', 'change'] }],
  image: [{ required: true, message: '请选择图片上传', trigger: ['blur', 'change'] }]
}
