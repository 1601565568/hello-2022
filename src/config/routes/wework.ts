/*
 * @Descripttion: 企业微信-菜单配置
 * @Author: yuye.huang
 * @Date: 2020-02-28 17:36:11
 * @LastEditors: yuye.huang
 * @LastEditTime: 2020-03-01 11:49:03
 */
export default {
  'path': '/WeWork/WelcomeCode',
  'name': 'WEWORK',
  'component': () => import('@/layout/Default.vue'),
  'meta': {
    'title': '企业微信',
    'requiresAuth': true
  }
}
