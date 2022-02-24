/*
 * @Descripttion: 全局常量
 * @Author: hjl
 */

// 相对应的路由
const V2_URL = new Map()
// 聚合码
V2_URL.set('/Guide/SgPersonalQrcode/List', '/demo/').set(
  '/WeWork/WelcomeCode/WelcomeCodeList',
  '/Welcome/'
)
// // 通过value取出key
// const getKey = (value: string) => {
//   for (const key of V2_URL) {
//     if (value.includes(key[1])) {
//       return key[0]
//     }
//   }
// };
export { V2_URL }
