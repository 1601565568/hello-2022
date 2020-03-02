/*
 * @Descripttion: 表单校验规则
 * @Author: yuye.huang
 * @Date: 2020-03-01 21:22:07
 * @LastEditors: yuye.huang
 * @LastEditTime: 2020-03-01 21:33:56
 */
export default {
  content: [{ required: true, message: '请输入智能欢迎语内容', trigger: ['blur', 'change'] },
    { min: 1, max: 100, message: '已超过可输入长度', trigger: ['blur', 'change'] }]
}
